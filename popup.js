/**
 * Popup script
 * Handles the display of domain risk status
 */

// Basic popup setup
console.log('[SW-Domains] Popup loaded');

// DOM elements (just the ones we need)
let riskDisplay, riskMessage;
// Track current tab id, storage listener flag, and fallback timer
let currentTabId = null;
let storageListenerAdded = false;
let fallbackTimer = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('[SW-Domains] DOM ready');
  
  // Get element references
  riskDisplay = document.getElementById('riskDisplay');
  riskMessage = document.getElementById('riskMessage');
  
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
 * Show loading state
 */
function showLoadingState() {
  riskDisplay.className = 'loading';
  riskMessage.textContent = 'A analisar...';
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
  if (domain) {
    riskMessage.textContent = `Não foi possível determinar o nível de risco do domínio ${domain}.`;
  } else {
    riskMessage.textContent = `Não foi possível determinar o nível de risco deste domínio.`;
  }
}

/**
 * Display legitimate institution status
 * @param {object} result - Analysis result with institution info
 */
function showLegitimateRisk(result, domain) {
  riskDisplay.className = 'legitimate';
  
  const d = result.domain || domain || 'este domínio';
  if (result.institutionInfo) {
    riskMessage.textContent = `O domínio ${d} é reconhecido como legítimo para ${result.institutionInfo.name}`;
  } else {
    riskMessage.textContent = `O domínio ${d} é reconhecido como legítimo`;
  }
}

/**
 * Display suspicious domain warning
 * @param {object} result - Analysis result with detection details
 */
function showSuspiciousRisk(result, domain) {
  riskDisplay.className = 'suspicious';
  
  const d = result.domain || domain || 'este domínio';
  if (result.detectionResult && result.detectionResult.bankName) {
    riskMessage.textContent = `Risco de fraude: apesar das semelhanças, o domínio ${d} não parece ser legítimo. A página web oficial do ${result.detectionResult.bankName} é ${result.detectionResult.legitimateDomain}.`;
  } else {
    riskMessage.textContent = `Risco de fraude: o domínio ${d} não parece ser legítimo.`;
  }
}

/**
 * Start a fallback timer to show unknown if result doesn't arrive in time
 */
function startFallbackTimer(timeoutMs = 800) {
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