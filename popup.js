/**
 * Popup script
 * Handles the display of domain risk status
 */

// Basic popup setup
console.log('[SW-Domains] Popup loaded');

// i18n helper: returns localized string or empty if missing
function t(key, subs = []) {
  try {
    return chrome.i18n.getMessage(key, subs) || '';
  } catch {
    return '';
  }
}

// DOM elements
let riskDisplay, riskMessage, riskHeadingEl;
// Track current tab id, domain shown in heading, storage listener flag, and fallback timer
let currentTabId = null;
let storageListenerAdded = false;
let fallbackTimer = null;
let currentDomain = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('[SW-Domains] DOM ready');
  
  // Get element references
  // Match popup.html container id
  riskDisplay = document.getElementById('riskPopup');
  riskHeadingEl = document.getElementById('riskHeading');
  riskMessage = document.getElementById('riskMessage');
  
  // Pre-populate heading with the active tab domain for responsiveness
  chrome.tabs.query({active:true, currentWindow:true}, function(tabs) {
    const tab = tabs && tabs[0];
    if (tab && tab.url) {
      try {
        const url = new URL(tab.url);
        updateHeadingDomain(cleanDomain(url.hostname));
      } catch (e) {
        // ignore invalid URLs
      }
    }
  });
  
  // Load the domain risk status
  loadDomainRisk();
});

/**
 * Load and display a domain risk status
 */
function loadDomainRisk() {
  console.log('[SW-Domains] Loading domain risk');

  // Show loading state while we fetch the result
  showLoadingState();

  // Get current active tab id (no need to read tab URL)
  chrome.tabs.query({active:true, currentWindow:true}, function(tabs) {
    if (tabs[0]) {
      const currentTab = tabs[0];
      currentTabId = currentTab.id;
      console.log('[SW-Domains] Current tab id:', currentTabId);
      addStorageListener();
      startFallbackTimer(2500);
      
      // Get stored domain analysis using per-tab storage key
      chrome.storage.local.get([`sw-domains-result-${currentTab.id}`], function(result) {
        console.log('[SW-Domains] Storage result:', result);
        
        const tabResult = result[`sw-domains-result-${currentTab.id}`];
        if (tabResult) {
          // Prefer domain from stored result
          displayRiskStatus(tabResult, tabResult.domain);
          clearFallbackTimer();
        } // else: keep loading; listener + fallback will handle unknown
      });
    }
  });
}

/**
 * Clean domain name (remove www.)
 * @param {string} hostname - Raw hostname
 * @returns {string} - Cleaned domain
 */
function cleanDomain(hostname) {
  return hostname.replace(/^www\./, '').toLowerCase();
}

/**
 * Update the heading with the current domain (safe text only)
 * @param {string} domain
 */
function updateHeadingDomain(domain) {
  if (!domain || domain === 'este domínio') return; // avoid placeholder
  currentDomain = domain;
  if (riskHeadingEl) {
    riskHeadingEl.textContent = currentDomain;
  }
}

/**
 * Show loading state
 */
function showLoadingState() {
  riskDisplay.className = 'loading';
  riskMessage.textContent = t('loading_analyzing');
}


/**
 * Display risk status based on analysis result
 * @param {object} analysisResult - Result from content script
 */
function displayRiskStatus(analysisResult, domain) {
  console.log('[SW-Domains] Displaying risk:', analysisResult);
  
  //Uses switch statement to compare the result against multiple possible cases 
  switch (analysisResult.status) {
    case 'legitimate':
      showLegitimateRisk(analysisResult, domain);
      break;
    case 'suspicious':
      showSuspiciousRisk(analysisResult, domain);
      break;
    case 'unknown':
    default:
      displayUnknownRisk(domain);
      break;
  }
}

/**
 * Display unknown risk status as fallback case
 */
function displayUnknownRisk(domain) {
  riskDisplay.className = 'unknown';
  if (domain) updateHeadingDomain(domain);
  if (domain) {
    riskMessage.textContent = t('unknown_info', [domain]);
  } else {
    riskMessage.textContent = t('unknown_generic');
  }
}

/**
 * Display legitimate institution status
 * @param {object} result - Analysis result with institution info
 */
function showLegitimateRisk(result, domain) {
  riskDisplay.className = 'legitimate';
  
  const d = result.domain || domain || 'este domínio';
  updateHeadingDomain(d);
  if (result.institutionInfo) {
    riskMessage.textContent = t('legitimate_info', [d, result.institutionInfo.name]);
  } else {
    riskMessage.textContent = t('legitimate_generic', [d]);
  }
}

/**
 * Display suspicious domain warning
 * @param {object} result - Analysis result with detection details
 */
function showSuspiciousRisk(result, domain) {
  riskDisplay.className = 'suspicious';
  
  const d = result.domain || domain || 'este domínio';
  updateHeadingDomain(d);
  if (result.detectionResult && result.detectionResult.bankName) {
    riskMessage.textContent = t('suspicious_info', [
      d,
      result.detectionResult.bankName,
      result.detectionResult.legitimateDomain || ''
    ]);
  } else {
    riskMessage.textContent = t('suspicious_generic', [d]);
  }
}

/**
 * Start a fallback timer to show unknown if result doesn't arrive in time
 */
function startFallbackTimer(timeoutMs = 200) {
  clearFallbackTimer();
  fallbackTimer = setTimeout(() => {
    displayUnknownRisk(); // generic unknown if no domain yet
  }, timeoutMs);
}

/**
 * Clear any active fallback timer
 */
function clearFallbackTimer() {
  if (fallbackTimer) {
    clearTimeout(fallbackTimer);
    fallbackTimer = null;
  }
}

/**
 * Listen to chrome.storage changes and update the popup reactively
 */
function addStorageListener() {
  if (storageListenerAdded) return;
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local' || !currentTabId) return;
    const key = `sw-domains-result-${currentTabId}`;
    if (Object.prototype.hasOwnProperty.call(changes, key)) {
      const newValue = changes[key].newValue;
      if (newValue) {
        displayRiskStatus(newValue, newValue.domain);
        clearFallbackTimer();
      }
    }
  });
  storageListenerAdded = true;
}

// Cleanup on popup close
window.addEventListener('unload', () => {
  clearFallbackTimer();
});