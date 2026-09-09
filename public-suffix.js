// Public Suffix List (PSL) based domain parsing
//
// Implements the standard PSL algorithm (https://publicsuffix.org/list/) so
// registrable-domain (eTLD+1) extraction works correctly for multi-label
// TLDs like .co.uk or .com.br, instead of the ad-hoc string ops this file
// replaces. Rule data lives in public-suffix-list.js (loaded before this
// file — see manifest.json), vendored from the official list.

/**
 * Parse the raw PSL rule string into a lookup structure.
 * Each rule is stored keyed by its label count, mapping the
 * dot-joined reversed labels to whether it's a wildcard/exception rule.
 * @param {string} rawRules - space-separated PSL rules
 * @returns {{ exceptions: Set<string>, wildcards: Set<string>, normal: Set<string> }}
 */
function parsePSLRules(rawRules) {
  const exceptions = new Set();
  const wildcards = new Set();
  const normal = new Set();

  for (const rule of rawRules.split(' ')) {
    if (!rule) continue;
    if (rule.startsWith('!')) {
      exceptions.add(rule.slice(1));
    } else if (rule.startsWith('*.')) {
      wildcards.add(rule.slice(2));
    } else {
      normal.add(rule);
    }
  }

  return { exceptions, wildcards, normal };
}

let pslRulesCache = null;
function getPSLRules() {
  if (!pslRulesCache) {
    pslRulesCache = parsePSLRules(window.PSL_RULES_RAW || '');
  }
  return pslRulesCache;
}

/**
 * Find the public suffix (eTLD) for a hostname's labels, per the
 * publicsuffix.org algorithm:
 *   1. Find the matching rule with the most labels.
 *   2. Exception rules win over wildcard rules with the same suffix.
 *   3. If no rule matches, the suffix is just the last label ("*" implicit rule).
 * @param {string[]} labels - hostname split on '.', e.g. ['www', 'bbc', 'co', 'uk']
 * @returns {number} - number of trailing labels that make up the public suffix
 */
function findPublicSuffixLabelCount(labels) {
  const { exceptions, wildcards, normal } = getPSLRules();

  let bestMatchLabels = 1; // implicit "*" rule: unknown TLDs are a public suffix of one label
  let bestIsException = false;

  for (let start = 0; start < labels.length; start++) {
    const candidate = labels.slice(start).join('.');
    const labelCount = labels.length - start;

    if (exceptions.has(candidate)) {
      // Exception rule: the suffix is one label SHORTER than the rule itself
      if (labelCount - 1 > bestMatchLabels || !bestIsException) {
        bestMatchLabels = labelCount - 1;
        bestIsException = true;
      }
      continue;
    }
    if (!bestIsException && normal.has(candidate) && labelCount > bestMatchLabels) {
      bestMatchLabels = labelCount;
    }
    if (!bestIsException && wildcards.has(candidate) && labelCount + 1 > bestMatchLabels) {
      // Wildcard rule matches one label MORE than the rule itself
      bestMatchLabels = labelCount + 1;
    }
  }

  return Math.min(bestMatchLabels, labels.length);
}

/**
 * Extract the registrable domain (eTLD+1) from a hostname.
 * Example: "particulares.santander.pt" -> "santander.pt"
 *          "www.bbc.co.uk" -> "bbc.co.uk"
 *          "cgd.pt.evil.com" -> "evil.com"
 * @param {string} hostname
 * @returns {string|null} - the registrable domain, or null if the hostname
 *   IS a public suffix (or shorter), e.g. "co.uk" or "com"
 */
function getRegistrableDomain(hostname) {
  if (!hostname) return null;
  const labels = hostname.toLowerCase().split('.').filter(Boolean);
  if (labels.length === 0) return null;

  const suffixLabelCount = findPublicSuffixLabelCount(labels);
  const registrableLabelCount = suffixLabelCount + 1;

  if (labels.length < registrableLabelCount) {
    // hostname is the public suffix itself, or shorter — no registrable domain
    return null;
  }

  return labels.slice(labels.length - registrableLabelCount).join('.');
}

/**
 * Get the public suffix (eTLD) of a hostname, e.g. "bbc.co.uk" -> "co.uk",
 * "justica.gov.pt" -> "gov.pt", "justica.pt" -> "pt".
 * @param {string} hostname
 * @returns {string} - the public suffix (empty string for an empty hostname)
 */
function getPublicSuffix(hostname) {
  if (!hostname) return '';
  const labels = hostname.toLowerCase().split('.').filter(Boolean);
  if (labels.length === 0) return '';
  const suffixLabelCount = findPublicSuffixLabelCount(labels);
  return labels.slice(labels.length - suffixLabelCount).join('.');
}

/**
 * Split a fully-qualified domain into its name portion and its public suffix,
 * e.g. "justica.gov.pt" -> { name: "justica", suffix: "gov.pt" }.
 * @param {string} fqdn
 * @returns {{ name: string, suffix: string }}
 */
function splitNameAndSuffix(fqdn) {
  const suffix = getPublicSuffix(fqdn);
  if (!suffix) return { name: fqdn, suffix: '' };
  const name = fqdn.length > suffix.length
    ? fqdn.slice(0, fqdn.length - suffix.length - 1)
    : '';
  return { name, suffix };
}

/**
 * Split a hostname into { subdomain, registrableDomain } parts.
 * @param {string} hostname
 * @returns {{ subdomain: string, registrableDomain: string|null }}
 */
function parseDomain(hostname) {
  const registrableDomain = getRegistrableDomain(hostname);
  if (!registrableDomain) {
    return { subdomain: '', registrableDomain: null };
  }
  const subdomain = hostname.length > registrableDomain.length
    ? hostname.slice(0, hostname.length - registrableDomain.length - 1)
    : '';
  return { subdomain, registrableDomain };
}

// Make functions available globally for Chrome extension
// (Chrome extensions don't support ES6 modules in content scripts)
window.getRegistrableDomain = getRegistrableDomain;
window.parseDomain = parseDomain;
window.parsePSLRules = parsePSLRules;
window.getPublicSuffix = getPublicSuffix;
window.splitNameAndSuffix = splitNameAndSuffix;
