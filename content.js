// Safe Web Domains - Content Script
// Main orchestrator for fraud detection on web pages

console.log('[SW-Domains] Content script loaded on:', window.location.hostname);

/**
 * Clean domain by removing common prefixes
 * @param {string} hostname - Raw hostname
 * @returns {string} - Cleaned domain
 */
function cleanDomain(hostname) {
  return hostname.replace(/^www\./, '').toLowerCase();
}

/**
 * Check if domain should be skipped for detection
 * @param {string} domain - Domain to check
 * @returns {boolean} - Whether to skip
 */
function shouldSkipDomain(domain) {
  const skipPatterns = [
    'localhost', '127.0.0.1', 'chrome-extension://', 'moz-extension://',
    'about:', 'chrome://', 'file://', 'data:', 'blob:',
    '.local', '.dev', '.test',
    // Major platforms to avoid false positives
    'google.com', 'google.pt', 'github.com', 'stackoverflow.com'
  ];
  
  return skipPatterns.some(pattern => 
    domain.includes(pattern) || domain.endsWith(pattern)
  );
}

/**
 * Main fraud detection function
 */
function performFraudDetection() {
  try {
    const rawDomain = window.location.hostname;
    const currentDomain = cleanDomain(rawDomain);
    
    console.log('[SW-Domains] Analyzing domain:', currentDomain);
    
    // Skip detection for certain domains
    if (shouldSkipDomain(currentDomain)) {
      console.log('[SW-Domains] Skipping detection for:', currentDomain);
      return;
    }
    
    // Check if dependencies are loaded
    if (typeof legitimateInstitutions === 'undefined') {
      console.error('[SW-Domains] Institutions database not loaded');
      return;
    }
    
    if (typeof checkForTyposquatting === 'undefined') {
      console.error('[SW-Domains] Typosquatting detector not loaded');
      return;
    }
    
    // Check if it's a legitimate institution
    if (legitimateInstitutions.hasOwnProperty(currentDomain)) {
      console.log('[SW-Domains] ✅ Legitimate institution detected:', 
                  legitimateInstitutions[currentDomain].name);
      
      // Store positive verification for popup
      storeVerificationResult({
        domain: currentDomain,
        status: 'legitimate',
        institutionInfo: legitimateInstitutions[currentDomain],
        timestamp: Date.now()
      });
      
    } else {
      console.log('[SW-Domains] Domain not in database, checking for typosquatting...');
      
      // Check for typosquatting
      const result = checkForTyposquatting(currentDomain);
      
      if (result.suspicious) {
        console.log('[SW-Domains] ⚠️ Suspicious domain detected:', result);
        
        // Store suspicious detection for popup
        storeVerificationResult({
          domain: currentDomain,
          status: 'suspicious',
          detectionResult: result,
          timestamp: Date.now()
        });
        
        // Create warning message
        const message = createWarningMessage(result);
        
        // Show warning banner (will be implemented in next step)
        if (typeof createWarningBanner === 'function') {
          createWarningBanner(message, result.riskLevel, result);
        } else {
          console.warn('[SW-Domains] Warning banner system not loaded');
        }
        
      } else {
        console.log('[SW-Domains] Domain appears safe');
        
        // Store neutral result
        storeVerificationResult({
          domain: currentDomain,
          status: 'unknown',
          timestamp: Date.now()
        });
      }
    }
    
  } catch (error) {
    console.error('[SW-Domains] Error during fraud detection:', error);
  }
}

/**
 * Create warning message based on detection result
 * @param {object} result - Detection result
 * @returns {string} - Warning message
 */
function createWarningMessage(result) {
    const message = `
    Risco de fraude: apesar das semelhanças, este domínio não parece ser legítimo. A página web oficial do ${result.bankName} é ${result.legitimateDomain}. Nunca introduza dados pessoais, passwords ou informações bancárias sem confirmar a legitimidade da página web.
  `;
  
  return message;
}

/**
 * Store verification result for popup access and update extension icon
 * @param {object} result - Verification result
 */
function storeVerificationResult(result) {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      // Store data for popup
      chrome.storage.local.set({
        'sw-domains-current-result': result
      });
      
      // Send message to background script to update icon
      chrome.runtime.sendMessage({
        type: 'updateIcon',
        status: result.status
      });
      
      console.log(`[SW-Domains] Stored result and updated icon: ${result.status}`);
    }
  } catch (error) {
    console.error('[SW-Domains] Failed to store result or update icon:', error);
  }
}

// Initialize fraud detection when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', performFraudDetection);
} else {
  // Page already loaded, run detection
  performFraudDetection();
}

// Handle single-page application navigation
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log('[SW-Domains] URL changed, re-running detection');
    setTimeout(performFraudDetection, 1000);
  }
}).observe(document, { subtree: true, childList: true });