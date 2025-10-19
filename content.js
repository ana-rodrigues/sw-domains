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
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      // Send result to background script for per-tab storage
      chrome.runtime.sendMessage({
        type: 'storeResult',
        result: result
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
    setTimeout(performFraudDetection, 300);
  }
}).observe(document, { subtree: true, childList: true });

/**
 * Modal Popup System
 * Creates an injected modal with rounded corners as an alternative to Chrome's default popup
 */

/**
 * Show the popup modal with rounded corners
 */
function showPopupModal() {
  // Prevent duplicate modals
  if (document.getElementById('sw-domains-modal')) {
    console.log('[SW-Domains] Modal already exists');
    return;
  }
  
  console.log('[SW-Domains] Creating popup modal');
  
  // Inject CSS variables into page context if not already present
  injectModalStyles();
  
  // Create dialog element with rounded corners
  const modal = document.createElement('dialog');
  modal.id = 'sw-domains-modal';
  modal.className = 'sw-domains-modal';
  
  // Create iframe to load popup.html
  const iframe = document.createElement('iframe');
  iframe.id = 'sw-domains-iframe';
  iframe.className = 'sw-domains-iframe';
  iframe.src = chrome.runtime.getURL('popup.html');
  
  modal.appendChild(iframe);
  document.body.appendChild(modal);
  
  // Show the modal
  modal.showModal();
  
  console.log('[SW-Domains] Modal displayed');
  
  // Close modal when clicking backdrop
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      initiateModalClose(modal, iframe);
    }
  });
  
  // Close modal on Escape key
  modal.addEventListener('cancel', (event) => {
    event.preventDefault(); // Prevent default close
    initiateModalClose(modal, iframe);
  });
}

/**
 * Inject modal styles with CSS variables into the page
 * This ensures our design tokens work even when injected into external pages
 */
function injectModalStyles() {
  // Check if styles already injected
  if (document.getElementById('sw-domains-modal-styles')) {
    return;
  }
  const styleEl = document.createElement('style');
  styleEl.id = 'sw-domains-modal-styles';
  styleEl.textContent = `
    /* SW-Domains Modal CSS Variables */
    :root {
      --sw-domains-radius-lg: 12px;
    }
    
    /* Backdrop animations */
    @keyframes backdropEnter {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    
    @keyframes backdropExit {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
    
    /* Import modal styles from extension */
    .sw-domains-modal {
      position: fixed !important;
      left: auto !important;
      right: 8px !important;
      top: 8px !important;
      border: none !important;
      border-radius: var(--sw-domains-radius-lg) !important;
      padding: 0 !important;
      margin: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      z-index: 2147483647 !important;
      max-width: none !important;
      max-height: none !important;
      min-height: auto !important; 
      transform: none !important;
      overflow: hidden !important;
    }
    
    .sw-domains-modal::backdrop {
      background: rgba(0, 0, 0, 0.05) !important;
      backdrop-filter: blur(2px) !important;
      animation: backdropEnter 150ms ease-in-out forwards !important;
    }
    
    .sw-domains-modal.exiting::backdrop {
      animation: backdropExit 500ms ease-in-out forwards 250ms !important;
    }
    
    .sw-domains-iframe {
      width: 300px !important;
      max-height: none !important;
      min-height: 320px !important;
      height: 100% !important; 
      border: none !important;
      border-radius: var(--sw-domains-radius-lg) !important;
      display: block !important;
      background: transparent !important;
      box-shadow: none !important;
    }
  `;
  
  document.head.appendChild(styleEl);
  console.log('[SW-Domains] Modal styles injected');
}

/**
 * Initiate modal close with exit animations
 * Triggers exit animation on iframe content, then closes modal
 * @param {HTMLDialogElement} modal - The modal element
 * @param {HTMLIFrameElement} iframe - The iframe element
 */
function initiateModalClose(modal, iframe) {
  if (!modal) return;
  
  // Add exiting class to modal (for backdrop animation)
  modal.classList.add('exiting');
  
  // Trigger exit animation on iframe content
  try {
    const iframeWindow = iframe.contentWindow;
    const riskPopup = iframeWindow.document.getElementById('riskPopup');
    if (riskPopup) {
      riskPopup.classList.add('exiting');
    }
  } catch (error) {
    console.warn('[SW-Domains] Could not access iframe content:', error);
  }
  
  setTimeout(() => {
    modal.close();
    modal.remove();
    console.log('[SW-Domains] Modal closed and removed');
  }); // Match animation duration
}

function closePopupModal() {
  const modal = document.getElementById('sw-domains-modal');
  const iframe = document.getElementById('sw-domains-iframe');
  if (modal) {
    modal.classList.add('exiting');
    
    setTimeout(() => {
      modal.close();
      modal.remove();
      console.log('[SW-Domains] Modal closed and removed');
    });
  }
}

/**
 * Listen for messages from background script to show modal
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'show-popup-modal') {
    showPopupModal();
    sendResponse({ success: true });
  }
  return true; // Keep message channel open for async response
});

/**
 * Listen for messages from popup (inside iframe) to close modal
 */
window.addEventListener('message', (event) => {
  // Only accept messages with our close-modal type
  if (event.data && event.data.type === 'close-modal') {
    closePopupModal();
  }
});