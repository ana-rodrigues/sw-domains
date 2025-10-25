// Background script for Safe Web Domains

console.log('[SW-Domains] Background script loaded');

// Track the last domain for each tab to detect real navigation
let tabDomains = {};

/**
 * Update extension icon based on risk status
 * @param {number} tabId - ID of the tab
 * @param {string} status - Risk status: 'legitimate', 'suspicious', 'unknown'
 */
function updateExtensionIcon(tabId, status) {
  // Define default icon path once
  const defaultIconPath = {
    "16": "icons/icon-default-16.png",
    "32": "icons/icon-default-32.png", 
    "48": "icons/icon-default-48.png",
    "128": "icons/icon-default-128.png"
  };
  
  let iconPath;
  
  switch (status) {
    case 'legitimate':
      iconPath = {
        "16": "icons/icon-legitimate-16.png",
        "32": "icons/icon-legitimate-32.png",
        "48": "icons/icon-legitimate-48.png",
        "128": "icons/icon-legitimate-128.png"
      };
      break;
    case 'suspicious':
      iconPath = {
        "16": "icons/icon-suspicious-16.png",
        "32": "icons/icon-suspicious-32.png",
        "48": "icons/icon-suspicious-48.png",
        "128": "icons/icon-suspicious-128.png"
      };
      break;
    case 'unknown':
    default:
      iconPath = defaultIconPath;
      break;
  }
  
  chrome.action.setIcon({
    tabId: tabId,
    path: iconPath
  });
  
  console.log(`[SW-Domains] Icon updated for tab ${tabId}: ${status}`);
}


// Event listeners

/**
 * Listen for icon update requests from content scripts
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // IF message type == updateIcon, change icon according to result
    if (message.type === 'updateIcon' && sender.tab) {
      console.log('[SW-Domains] Received icon update request:', message.status);
      updateExtensionIcon(sender.tab.id, message.status);
    }
    
    // If message type == storeResult, store per-tab result
    if (message.type === 'storeResult' && sender.tab) {
      const tabKey = `sw-domains-result-${sender.tab.id}`;
      chrome.storage.local.set({ [tabKey]: message.result }, () => {
        console.log(`[SW-Domains] Stored result for tab ${sender.tab.id}`);
        // Open the modal popup only after storage is updated and only for suspicious results
        if (message.result && message.result.status === 'suspicious') {
          setTimeout(() => {
            chrome.tabs.sendMessage(sender.tab.id, { type: 'show-popup-modal' });
          }, 1000);
          console.log(`[SW-Domains] Auto-opened modal after storing suspicious result on tab ${sender.tab.id}`);
        }
      });
    }
  });
  
  // Clean up storage when tabs are closed
  chrome.tabs.onRemoved.addListener((tabId) => {
    const tabKey = `sw-domains-result-${tabId}`;
    chrome.storage.local.remove(tabKey);
    delete tabDomains[tabId];
    console.log(`[SW-Domains] Cleaned up storage for closed tab ${tabId}`);
  });

/**
 * Reset icon to default when user navigates to a NEW page
 * Only reset if the domain actually changed (not just resource loading)
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only check when URL changes (not on every loading event)
  if (changeInfo.url) {
    try {
      const newDomain = new URL(changeInfo.url).hostname;
      const previousDomain = tabDomains[tabId];
      
      // Only reset icon if navigating to a different domain
      if (newDomain !== previousDomain) {
        console.log(`[SW-Domains] Navigation detected: ${previousDomain} → ${newDomain}`);
        updateExtensionIcon(tabId, 'unknown');
        tabDomains[tabId] = newDomain;
      }
    } catch (error) {
      // Invalid URL (chrome://, about:, etc.) - ignore
      console.log('[SW-Domains] Could not parse URL:', changeInfo.url);
    }
  }
});

/**
 * Listen for extension icon clicks and show modal popup
 * Note: This only fires when there is NO default_popup in manifest
 */
chrome.action.onClicked.addListener((tab) => {
  console.log('[SW-Domains] Extension icon clicked, showing modal');
  chrome.tabs.sendMessage(tab.id, { type: 'show-popup-modal' });
});