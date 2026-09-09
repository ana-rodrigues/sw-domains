// Typosquatting Detection Algorithm
// Detects domains attempting to impersonate legitimate Portuguese institutions

/**
 * Calculate Levenshtein distance between two strings
 * This is the core algorithm for measuring string similarity
 * @param {string} str1 - First string to compare
 * @param {string} str2 - Second string to compare  
 * @returns {number} - Minimum number of edits needed
 */

// Homoglyph normalization is backed by CONFUSABLES_MAP_RAW, a table derived
// from Unicode's official confusables.txt (loaded via homoglyph-confusables.js
// — see manifest.json for load order), rather than a small hand-rolled list.
// Build a reverse lookup: confusable char -> Latin letter/digit it renders as.
function buildConfusablesLookup(rawMap) {
  const lookup = {};
  for (const [latinChar, confusables] of Object.entries(rawMap || {})) {
    for (const confusable of confusables) {
      lookup[confusable] = latinChar;
    }
  }
  return lookup;
}

let confusablesLookupCache = null;
function getConfusablesLookup() {
  if (!confusablesLookupCache) {
    confusablesLookupCache = buildConfusablesLookup(window.CONFUSABLES_MAP_RAW);
  }
  return confusablesLookupCache;
}

function levenshteinDistance(str1, str2) {
    // Create a 2D matrix: rows = str2.length + 1, cols = str1.length + 1
    const matrix = [];
    
    // Initialize the matrix with base cases
    // First row: distance from empty string to prefixes of str1
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    // First column: distance from empty string to prefixes of str2  
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    // Fill the matrix using dynamic programming
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        // If characters match, no additional cost
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          // Take minimum of three operations + 1:
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    
    // Return the bottom-right cell (final result)
    return matrix[str2.length][str1.length];
  }
  
/**
 * Calculate similarity percentage between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} - Similarity percentage (0-100)
 */
function calculateSimilarity(str1, str2) {
  const maxLength = Math.max(str1.length, str2.length);
  
  // Handle edge case: both strings empty = 100% similar
  if (maxLength === 0) return 100;
  
  const distance = levenshteinDistance(str1, str2);
  
  // Formula: (maxLength - distance) / maxLength * 100
  // Example: "cgd.pt" vs "cgd.com" = (6-2)/6 * 100 = 66.7%
  return ((maxLength - distance) / maxLength) * 100;
}

/**
 * Normalize domain by replacing homoglyphs with their Latin equivalents
 * @param {string} domain - Domain to normalize
 * @returns {string} - Normalized domain with homoglyphs replaced
 */
function normalizeHomoglyphs(domain) {
  // NFKC first: folds compatibility variants (fullwidth forms, some accented
  // letters) to their canonical form before confusable lookup runs.
  const nfkc = domain.normalize('NFKC');
  const lookup = getConfusablesLookup();

  let normalized = '';
  for (const char of nfkc) {
    normalized += lookup[char] || char;
  }

  return normalized;
}

/**
 * Detect if domain contains homoglyph characters
 * @param {string} domain - Domain to check
 * @param {string} legitimateDomain - Known legitimate domain
 * @returns {boolean} - True if homoglyphs detected
 */
function detectHomoglyphs(domain, legitimateDomain) {
  const normalizedDomain = normalizeHomoglyphs(domain);
  
  // If normalized version matches legitimate domain, original had homoglyphs
  if (normalizedDomain === legitimateDomain && domain !== legitimateDomain) {
    return true;
  }
  
  // Check if normalized version is very similar (allows for additional typos)
  const similarity = calculateSimilarity(normalizedDomain, legitimateDomain);
  if (similarity > 90 && domain !== normalizedDomain) {
    return true;
  }
  
  return false;
}

/**
 * Check whether legitimateDomain is embedded in domain in a way that's worth
 * inspecting for subdomain abuse — either as a label-aligned run (so
 * "cgd.pt.evil.com" matches "cgd.pt" but "notcgd.pt.example.com" does NOT,
 * since "cgd" there is only a suffix of the "notcgd" label, not a label of
 * its own — see SIDE-25) or glued onto a label via a hyphen (so
 * "secure-cgd.pt.com" still matches, since that hyphenation is itself a
 * distinct suspicious signal handled below as Pattern C).
 * @param {string} domain
 * @param {string} legitimateDomain
 * @returns {boolean}
 */
function isLegitimateDomainEmbedded(domain, legitimateDomain) {
  const domainLabels = domain.split('.');
  const legitLabels = legitimateDomain.split('.');

  for (let i = 0; i <= domainLabels.length - legitLabels.length; i++) {
    if (domainLabels.slice(i, i + legitLabels.length).join('.') === legitimateDomain) {
      return true;
    }
  }

  const escapedLegit = legitimateDomain.replace(/\./g, '\\.');
  return new RegExp('(^|[.-])' + escapedLegit + '([.-]|$)').test(domain)
    && domain !== legitimateDomain;
}


/**
 * Calculate dynamic similarity threshold based on domain characteristics
 * Shorter domains require higher similarity to flag as suspicious
 * @param {string} legitimateDomain - The legitimate domain being compared
 * @param {object} patterns - Detected typosquatting patterns
 * @returns {number} - Threshold percentage (0-100)
 */
function getDynamicThreshold(legitimateDomain, patterns) {
  const length = legitimateDomain.length;
  let baseThreshold;
  
  // Base threshold by domain length
  if (length <= 6) {
    baseThreshold = 85;  // Very short domains (cgd.pt) - strict
  } else if (length <= 10) {
    baseThreshold = 80;  // Short domains (novobanco.pt)
  } else if (length <= 15) {
    baseThreshold = 75;  // Medium domains (millenniumbcp.pt)
  } else {
    baseThreshold = 70;  // Long domains
  }
  
  // Adjust threshold based on detected patterns
  // High-confidence patterns allow lower threshold
  if (patterns.characterSubstitution) {
    baseThreshold -= 10;  // Single char substitution is very suspicious
  }
  if (patterns.homoglyphAttack) {
    baseThreshold -= 10;  // Homoglyphs are very suspicious
  }
  if (patterns.tldSubstitution) {
    // TLD substitution has bigger impact on short domains
    // For short domains, TLD change represents larger % of total string
    if (length <= 10) {
      baseThreshold -= 30;  // Short domains: TLD is significant portion
    } else {
      baseThreshold -= 15;  // Longer domains: TLD is smaller portion
    }
  }
  if (patterns.characterAddition) {
    // Character addition (especially with hyphens) can lower similarity significantly
    // Example: cgd.pt vs cg-dd.pt or banco-bpi-online.pt
    // The added characters/hyphens increase length, reducing similarity percentage
    baseThreshold -= 25;  // Lower threshold to catch hyphenated additions
  }
  if (patterns.subdomainAbuse) {
    // Subdomain abuse is EXTREMELY suspicious and has very low similarity
    // The legitimate domain appears verbatim but similarity is low due to length difference
    // Example: cgd.pt (6 chars) vs cgd.pt.secure-login.com (24 chars) = only ~25% similarity
    // For this pattern, we essentially ignore the base threshold
    baseThreshold = 20;  // Set to minimum - pattern detection is the key signal
  }
  
  // Ensure threshold stays within reasonable bounds
  // Lower bound depends on pattern type:
  // - Subdomain abuse can have very low similarity (20-30%) but is highly suspicious
  // - Character addition with hyphens can have lower similarity (40-50%)
  // - Other patterns need higher similarity to avoid false positives
  const minThreshold = patterns.subdomainAbuse ? 15 : patterns.characterAddition ? 40 : 50;
  return Math.max(minThreshold, Math.min(baseThreshold, 90));
}
  

/**
 * Detect specific typosquatting patterns
 * @param {string} domain - Domain being checked
 * @param {string} legitimateDomain - Known legitimate domain
 * @returns {object} - Object with detected patterns
 */

  function detectTyposquattingPatterns(domain, legitimateDomain) {
    const patterns = {
      characterSubstitution: false,
      characterOmission: false, 
      characterAddition: false,
      subdomainAbuse: false,
      tldSubstitution: false,
      homoglyphAttack: false
    };
    
    // Pattern 1: Single character substitution
    // Example: cgd.pt → cqd.pt (g→q substitution)
    if (Math.abs(domain.length - legitimateDomain.length) === 0) {
      let differences = 0;
      for (let i = 0; i < domain.length; i++) {
        if (domain[i] !== legitimateDomain[i]) {
          differences++;
        }
      }
      if (differences === 1) {
        patterns.characterSubstitution = true;
      }
    }
    
    
    // Pattern 2: Character omission
    // Example: cgd.pt → cd.pt (missing 'g')
    if (domain.length === legitimateDomain.length - 1) {
      patterns.characterOmission = true;
    }

    
    // Pattern 3: Character addition  
    // Example: cgd.pt → cgdd.pt (extra 'd')
    // Also handles hyphenated additions: cgd.pt → cg-dd.pt
    
    // Remove hyphens to detect additions hidden by hyphenation
    const domainNoHyphens = domain.replace(/-/g, '');
    const legitNoHyphens = legitimateDomain.replace(/-/g, '');
    
    // Check if domain (without hyphens) is longer than legitimate domain
    // Allow up to 8 extra characters to catch additions like "online", "secure", etc.
    const lengthDiff = domainNoHyphens.length - legitNoHyphens.length;
    if (lengthDiff >= 1 && lengthDiff <= 8) {
      patterns.characterAddition = true;
    }
    
    // Also detect pure hyphen insertion (same length after removing hyphens)
    // Example: cgd.pt → c-g-d.pt (hyphens added but no extra characters)
    if (domain.includes('-') && !legitimateDomain.includes('-')) {
      if (domainNoHyphens === legitNoHyphens) {
        // Pure hyphen insertion - treat as character addition
        patterns.characterAddition = true;
      }
    }

    
  // Pattern 4: Subdomain abuse
  // Example: cgd.pt.malicious.com (legitimate domain as subdomain)
  // CRITICAL: Must distinguish between:
  // - LEGITIMATE: particulares.santander.pt (subdomain OF santander.pt) ✓
  // - MALICIOUS: santander.pt.malicious.com (santander.pt BEFORE different root) ✗
  
  if (isLegitimateDomainEmbedded(domain, legitimateDomain) && domain !== legitimateDomain) {
    // STEP 1: First check if this is a LEGITIMATE subdomain
    // Legitimate subdomains END with the legitimate domain
    // Examples: particulares.santander.pt, login.cgd.pt, secure.millenniumbcp.pt
    
    if (domain.endsWith('.' + legitimateDomain)) {
      // This is a legitimate subdomain - domain ends with .legitimateDomain
      // Example: particulares.santander.pt ends with .santander.pt ✓
      // Do NOT flag as subdomain abuse - this is legitimate
      // patterns.subdomainAbuse remains false
    }
    
    // STEP 2: Check for MALICIOUS subdomain abuse patterns
    // Only flag if legitimate domain does NOT appear at the end
    
    // Pattern A: Legitimate domain followed by different root domain
    // Example: cgd.pt.secure-login.com (cgd.pt + different root)
    else if (domain.startsWith(legitimateDomain + '.')) {
      // Domain starts with legitimate domain but doesn't end with it
      // Check if there's a different root domain after
      const afterLegit = domain.substring(legitimateDomain.length + 1);
      const afterParts = afterLegit.split('.');
      
      // If there are 2+ parts after, it's a different root domain (MALICIOUS)
      // Example: cgd.pt.secure-login.com → after "cgd.pt" is "secure-login.com" (2 parts)
      if (afterParts.length >= 2) {
        patterns.subdomainAbuse = true;
      }
    }
    
    // Pattern B: Legitimate domain in middle with different root after
    // Example: login.cgd.pt.verify.com (cgd.pt in middle + different root)
    else if (domain.includes('.' + legitimateDomain + '.')) {
      // Legitimate domain appears in the middle
      const afterLegit = domain.substring(domain.indexOf('.' + legitimateDomain + '.') + legitimateDomain.length + 2);
      const afterParts = afterLegit.split('.');
      
      // If there are 2+ parts after, it's a different root domain (MALICIOUS)
      if (afterParts.length >= 2) {
        patterns.subdomainAbuse = true;
      }
    }
    
    // Pattern C: Hyphenated abuse (always suspicious)
    // Examples: www-cgd.pt.com, secure-bancobpi.pt.com, cgd-pt.com
    // Legitimate sites don't hyphenate their own domain name
    else if (domain.includes('-' + legitimateDomain)) {
      patterns.subdomainAbuse = true;
    }
    // Also check for legitimate domain with hyphen before it at the end
    // Example: secure-cgd.pt.com (ends with -cgd.pt.com, not .cgd.pt)
    else if (domain.match(new RegExp('-' + legitimateDomain.replace(/\./g, '\\.') + '\\.'))) {
      patterns.subdomainAbuse = true;
    }
  } 
  
  // Pattern 5: TLD/suffix substitution
  // Example: cgd.pt → cgd.com (same name, different TLD)
  // Uses PSL-based suffix parsing (public-suffix.js) instead of comparing the
  // last dot-separated label, so multi-label suffixes are handled correctly —
  // e.g. "justica.pt" vs "justica.gov.pt" is a suffix substitution ("pt" vs
  // "gov.pt") with an identical name, not a same-length coincidence (SIDE-24).
  const { name: domainName, suffix: domainSuffix } = splitNameAndSuffix(domain);
  const { name: legitName, suffix: legitSuffix } = splitNameAndSuffix(legitimateDomain);

  if (domainSuffix !== legitSuffix && domainName && legitName) {
    // Check if suffixes are different AND names are identical or highly similar
    // This catches combined attacks like:
    // - cgdd.com vs cgd.pt (addition + TLD substitution)
    // - bancopi.com vs bancobpi.pt (omission + TLD substitution)
    // - paypa1.net vs paypal.com (substitution + TLD substitution)
    const nameSimilarity = calculateSimilarity(domainName, legitName);

    // Detect TLD substitution if names are identical OR highly similar (85%+)
    if (domainName === legitName || nameSimilarity >= 85) {
      patterns.tldSubstitution = true;
    }
  }
  
  // Pattern 6: Homoglyph attack
  // Example: cgd.pt → cgd.com (visual similarity via homoglyphs)
  if (detectHomoglyphs(domain, legitimateDomain)) {
    patterns.homoglyphAttack = true;
  }
  
  return patterns;
}

/**
 * Main typosquatting detection function
 * @param {string} currentDomain - Domain currently being visited
 * @returns {object} - Detection result with risk assessment
 */

  function checkForTyposquatting(currentDomain) {
    const result = {
      suspicious: false,
      bankName: null,
      legitimateDomain: null,
      similarity: 0,
      patterns: {},
      riskLevel: 'low',
      confidence: 0
    };
    
    let bestMatch = null;
    let highestSimilarity = 0;
    
    // Check against all legitimate institutions
    for (const [legitDomain, institutionInfo] of Object.entries(legitimateInstitutions)) {
      // FIRST: Check if this is a legitimate subdomain
      // Legitimate subdomains end with .legitimateDomain (e.g., particulares.santander.pt)
      if (currentDomain.endsWith('.' + legitDomain)) {
        // This is a legitimate subdomain - return immediately as legitimate
        return {
          suspicious: false,
          status: 'legitimate',
          bankName: institutionInfo.name,
          legitimateDomain: legitDomain,
          similarity: 100,
          patterns: {},
          riskLevel: 'none',
          confidence: 100,
          reason: `Legitimate subdomain of ${legitDomain}`
        };
      }
      
      const similarity = calculateSimilarity(currentDomain, legitDomain);
      const patterns = detectTyposquattingPatterns(currentDomain, legitDomain);
      
      // Use dynamic threshold based on domain characteristics
      const threshold = getDynamicThreshold(legitDomain, patterns);
      const isSuspicious = (
        similarity > threshold && // Dynamic threshold instead of fixed 70
        (patterns.characterSubstitution || 
         patterns.characterOmission || 
         patterns.characterAddition || 
         patterns.subdomainAbuse || 
         patterns.tldSubstitution ||
         patterns.homoglyphAttack)
      );
      
      // Keep track of the best match
      if (isSuspicious && similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatch = {
          domain: legitDomain,
          info: institutionInfo,
          similarity: similarity,
          patterns: patterns
        };
      }
    }
    
// If we found a suspicious match, populate the result
if (bestMatch) {
    result.suspicious = true;
    result.bankName = bestMatch.info.name;
    result.legitimateDomain = bestMatch.domain;
    result.similarity = bestMatch.similarity;
    result.patterns = bestMatch.patterns;
    
    // Simplified risk assessment - all matches above 70% with patterns are fraud risk
    result.riskLevel = 'fraud';
    result.confidence = Math.round(bestMatch.similarity);
  }
    
    return result;
}
  
// Make functions available globally for Chrome extension
// (Chrome extensions don't support ES6 modules in content scripts)
window.checkForTyposquatting = checkForTyposquatting;
window.calculateSimilarity = calculateSimilarity;
window.levenshteinDistance = levenshteinDistance;
window.detectTyposquattingPatterns = detectTyposquattingPatterns;