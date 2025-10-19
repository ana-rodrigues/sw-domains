// Typosquatting Detection Algorithm
// Detects domains attempting to impersonate legitimate Portuguese institutions

/**
 * Calculate Levenshtein distance between two strings
 * This is the core algorithm for measuring string similarity
 * @param {string} str1 - First string to compare
 * @param {string} str2 - Second string to compare  
 * @returns {number} - Minimum number of edits needed
 */

// Homoglyph mapping: visually similar characters from different alphabets
const HOMOGLYPH_MAP = {
  'a': ['а', 'ɑ', 'α', 'ạ', 'ă'],  // Latin a vs Cyrillic/Greek/Vietnamese
  'c': ['с', 'ϲ', 'ⅽ'],             // Latin c vs Cyrillic/Greek
  'e': ['е', 'ė', 'ē', 'ę', 'ě'],   // Latin e vs Cyrillic/accented
  'i': ['і', 'ı', 'ï', 'í', 'ì'],   // Latin i vs Cyrillic/Turkish
  'o': ['о', 'ο', 'ọ', 'ő', '0'],   // Latin o vs Cyrillic/Greek/digit
  'p': ['р', 'ρ', 'þ'],             // Latin p vs Cyrillic/Greek
  's': ['ѕ', 'ś', 'š'],             // Latin s vs Cyrillic/accented
  'd': ['ԁ', 'ď'],                  // Latin d vs Cyrillic
  'g': ['ɡ', 'ġ'],                  // Latin g variants
  'h': ['һ', 'ḥ'],                  // Latin h vs Cyrillic
  'n': ['ո', 'ñ', 'ń'],             // Latin n variants
  't': ['τ', 'ţ', 'ť'],             // Latin t vs Greek
  'u': ['υ', 'ս', 'ü', 'ú'],        // Latin u variants
  'v': ['ν', 'ѵ'],                  // Latin v vs Greek/Cyrillic
  'x': ['х', 'χ'],                  // Latin x vs Cyrillic/Greek
  'y': ['у', 'ý', 'ÿ'],             // Latin y vs Cyrillic
};

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
  let normalized = domain;
  
  // For each character in the domain
  for (let i = 0; i < domain.length; i++) {
    const char = domain[i];
    
    // Check if this character is a homoglyph of any Latin character
    for (const [latinChar, homoglyphs] of Object.entries(HOMOGLYPH_MAP)) {
      if (homoglyphs.includes(char)) {
        // Replace with the Latin equivalent
        normalized = normalized.replace(char, latinChar);
        break;
      }
    }
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
    if (domain.length === legitimateDomain.length + 1) {
      patterns.characterAddition = true;
    }
    
    // Pattern 4: Subdomain abuse
    // Example: cgd.pt.malicious.com (legitimate domain as subdomain)
    if (domain.includes(legitimateDomain) && domain !== legitimateDomain) {
      patterns.subdomainAbuse = true;
    }
    
    // Pattern 5: TLD substitution
    // Example: cgd.pt → cgd.com (same name, different TLD)
    const domainParts = domain.split('.');
    const legitParts = legitimateDomain.split('.');
    
    if (domainParts.length === legitParts.length && domainParts.length >= 2) {
      const domainName = domainParts.slice(0, -1).join('.');
      const legitName = legitParts.slice(0, -1).join('.');
      const domainTLD = domainParts[domainParts.length - 1];
      const legitTLD = legitParts[legitParts.length - 1];
      
      if (domainName === legitName && domainTLD !== legitTLD) {
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
      const similarity = calculateSimilarity(currentDomain, legitDomain);
      const patterns = detectTyposquattingPatterns(currentDomain, legitDomain);
      
      // Determine if this match is suspicious
      const isSuspicious = (
        similarity > 70 && // High similarity threshold
        (patterns.characterSubstitution || 
         patterns.characterOmission || 
         patterns.characterAddition || 
         patterns.subdomainAbuse || 
         patterns.tldSubstitution)
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