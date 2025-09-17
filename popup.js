/**
 * Popup script
 * Handles the display of domain risk status
 */

// Basic popup setup
console.log('[SW-Domains] Popup loaded');

// DOM elements (just the ones we need)
let riskDisplay, riskMessage;

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

  // Get domain for current active tab
  chrome.tabs.query({active:true, currentWindow:true}, function(tabs) {
    if (tabs[0]) {
      const currentTab = tabs[0];
      const url = new URL(currentTab.url);
      const domain = cleanDomain(url.hostname);
      console.log('[SW-Domains] Current domain:', domain);
      
      // Get stored domain analysis (sw-domains-current-result) from content.js
      chrome.storage.local.get(['sw-domains-current-result'], function(result) {
        console.log('[SW-Domains] Storage result:', result);
        
        if (result['sw-domains-current-result']) {
          displayRiskStatus(result['sw-domains-current-result'], domain);
        } else {
          displayUnknownRisk(domain);
        }
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
  riskMessage.textContent = `Não foi possível determinar o nível de risco do domínio ${domain}.`;
}

/**
 * Display legitimate institution status
 * @param {object} result - Analysis result with institution info
 */
function showLegitimateRisk(result, domain) {
  riskDisplay.className = 'legitimate';
  
  if (result.institutionInfo) {
    riskMessage.textContent = `O domínio ${domain} é reconhecido como legítimo para ${result.institutionInfo.name}`;
  } else {
    riskMessage.textContent = `O domínio ${domain} é reconhecido como legítimo`;
  }
}

/**
 * Display suspicious domain warning
 * @param {object} result - Analysis result with detection details
 */
function showSuspiciousRisk(result, domain) {
  riskDisplay.className = 'suspicious';
  
  if (result.detectionResult && result.detectionResult.bankName) {
    riskMessage.textContent = `Risco de fraude: apesar das semelhanças, o domínio ${domain} não parece ser legítimo. A página web oficial do ${result.detectionResult.bankName} é ${result.detectionResult.legitimateDomain}.`;
  } else {
    riskMessage.textContent = `Risco de fraude: o domínio ${domain} não parece ser legítimo.`;
  }
}