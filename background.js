// Background script for Safe Web Domains

console.log('[SW-Domains] Background script loaded');


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
      chrome.storage.local.set({
        [tabKey]: message.result
      });
      console.log(`[SW-Domains] Stored result for tab ${sender.tab.id}`);
    }

    // If message type == openPop, trigger pop up
    if (message.type === 'openPopup' && sender.tab) {
        chrome.action.openPopup();
        console.log(`[SW-Domains] Auto-opened popup for suspicious domain on tab ${sender.tab.id}`);
    }
    });
  
  // Clean up storage when tabs are closed
  chrome.tabs.onRemoved.addListener((tabId) => {
    const tabKey = `sw-domains-result-${tabId}`;
    chrome.storage.local.remove(tabKey);
    console.log(`[SW-Domains] Cleaned up storage for closed tab ${tabId}`);
  });

/**
 * Reset icon to default when user navigates to new page
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    updateExtensionIcon(tabId, 'unknown');
  }
});