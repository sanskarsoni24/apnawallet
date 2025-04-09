
// SurakshitLocker Chrome Extension Content Script
// This script runs in the context of the web page and communicates with the extension

// Initialize global namespace to avoid conflicts
window.__DOCU_NINJA_EXTENSION__ = {
  isConnected: false,
  version: '1.0.0',
  
  // Method to connect the extension to the web app
  connect: function(userData) {
    console.log('Extension connect called with user data:', userData);
    
    // Store user data in local storage for the extension
    localStorage.setItem('extension_user_data', JSON.stringify(userData));
    localStorage.setItem('extensionConnected', 'true');
    
    // Trigger connection event
    const event = new CustomEvent('extensionConnected', {
      detail: { timestamp: new Date().toISOString() }
    });
    document.dispatchEvent(event);
    
    this.isConnected = true;
    
    // Trigger initial sync
    this.syncWithWebApp();
    
    return { success: true };
  },
  
  // Method to disconnect the extension
  disconnect: function() {
    localStorage.removeItem('extension_user_data');
    localStorage.setItem('extensionConnected', 'false');
    
    const event = new CustomEvent('extensionDisconnected', {
      detail: { timestamp: new Date().toISOString() }
    });
    document.dispatchEvent(event);
    
    this.isConnected = false;
    
    return { success: true };
  },
  
  // Method to sync data with the web app
  syncWithWebApp: function() {
    try {
      // Get data from local storage
      const documents = JSON.parse(localStorage.getItem('documents') || '[]');
      const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
      const userEmail = localStorage.getItem('userEmail') || '';
      const userId = localStorage.getItem('userId') || '';
      
      // Create sync data object
      const syncData = {
        documents,
        userSettings,
        userEmail,
        userId,
        timestamp: new Date().toISOString()
      };
      
      // Store sync data for the extension
      localStorage.setItem('extensionSyncData', JSON.stringify({
        lastSync: new Date().toISOString(),
        syncedData: syncData
      }));
      
      // Send a message to the extension background script
      chrome.runtime.sendMessage({
        action: 'syncData',
        data: syncData
      });
      
      return { success: true };
    } catch (e) {
      console.error('Error syncing with web app:', e);
      return { success: false, error: e.toString() };
    }
  },
  
  // Method to check if the extension is connected
  isExtensionConnected: function() {
    return localStorage.getItem('extensionConnected') === 'true';
  }
};

// Notify the page that the extension is available
const extensionReadyEvent = new CustomEvent('extensionInstalled', {
  detail: { version: window.__DOCU_NINJA_EXTENSION__.version }
});
document.dispatchEvent(extensionReadyEvent);

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getLocalStorage") {
    try {
      const documents = JSON.parse(localStorage.getItem("documents") || "[]");
      const userSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
      const userEmail = localStorage.getItem("userEmail") || "";
      const backupHistory = JSON.parse(localStorage.getItem("backup_history") || "[]");
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const userId = localStorage.getItem("userId") || "";
      
      sendResponse({
        documents,
        userSettings,
        userEmail,
        backupHistory,
        isLoggedIn,
        userId,
        success: true
      });
    } catch (e) {
      sendResponse({error: e.toString()});
    }
    return true; // Keep message channel open for async response
  }
  
  if (message.action === "navigateToProfile") {
    // Redirect to profile page
    window.location.href = "/profile";
    sendResponse({success: true});
    return true;
  }

  if (message.action === "syncData") {
    try {
      // Sync data between extension and web app
      if (message.data) {
        let dataChanged = false;
        
        if (message.data.userSettings) {
          localStorage.setItem("userSettings", JSON.stringify(message.data.userSettings));
          dataChanged = true;
        }
        
        if (message.data.documents) {
          localStorage.setItem("documents", JSON.stringify(message.data.documents));
          dataChanged = true;
        }
        
        // Handle any custom data from the extension
        if (message.data.customData) {
          localStorage.setItem("extension_data", JSON.stringify(message.data.customData));
          dataChanged = true;
        }
        
        // Handle user profile data
        if (message.data.userProfile) {
          localStorage.setItem("user_profile", JSON.stringify(message.data.userProfile));
          if (message.data.userProfile.email) {
            localStorage.setItem("userEmail", message.data.userProfile.email);
          }
          dataChanged = true;
        }
        
        // Sync login state
        if (message.data.isLoggedIn !== undefined) {
          localStorage.setItem("isLoggedIn", message.data.isLoggedIn);
          dataChanged = true;
        }
        
        // Store the last sync time
        localStorage.setItem("extensionSyncData", JSON.stringify({
          lastSync: new Date().toISOString(),
          syncedData: message.data
        }));
        
        // Notify the page that data was updated if changes occurred
        if (dataChanged) {
          const event = new CustomEvent('DocuNinjaDataSync', {
            detail: { source: 'extension', timestamp: new Date().toISOString() }
          });
          document.dispatchEvent(event);
        }
        
        sendResponse({success: true, message: "Data synced successfully", dataChanged});
      }
    } catch (e) {
      sendResponse({error: e.toString()});
    }
    return true;
  }
  
  if (message.action === "checkAuthentication") {
    // Check if the user is logged in
    try {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const userSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
      const userEmail = localStorage.getItem("userEmail") || "";
      const userId = localStorage.getItem("userId") || "";
      
      sendResponse({
        isLoggedIn,
        userSettings,
        userEmail,
        userId,
        success: true
      });
    } catch (e) {
      sendResponse({error: e.toString()});
    }
    return true;
  }
  
  if (message.action === "notifyUser") {
    // Display a notification to the user
    try {
      const { title, message, type } = message;
      
      // Create a toast-like notification
      const toastContainer = document.createElement('div');
      toastContainer.style.position = 'fixed';
      toastContainer.style.bottom = '20px';
      toastContainer.style.right = '20px';
      toastContainer.style.padding = '10px 20px';
      toastContainer.style.backgroundColor = type === 'error' ? '#ef4444' : '#10b981';
      toastContainer.style.color = 'white';
      toastContainer.style.borderRadius = '5px';
      toastContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      toastContainer.style.zIndex = '9999';
      toastContainer.style.opacity = '0';
      toastContainer.style.transition = 'opacity 0.3s ease-in-out';
      
      toastContainer.innerHTML = `
        <div style="font-weight: bold;">${title}</div>
        <div>${message}</div>
      `;
      
      document.body.appendChild(toastContainer);
      
      // Fade in
      setTimeout(() => {
        toastContainer.style.opacity = '1';
      }, 10);
      
      // Remove after 5 seconds
      setTimeout(() => {
        toastContainer.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(toastContainer);
        }, 300);
      }, 5000);
      
      sendResponse({success: true});
    } catch (e) {
      sendResponse({error: e.toString()});
    }
    return true;
  }
  
  if (message.action === "updateDocuments") {
    // Update documents from the extension
    try {
      const { documents } = message;
      if (documents) {
        localStorage.setItem("documents", JSON.stringify(documents));
        
        const event = new CustomEvent('DocumentsUpdated', {
          detail: { source: 'extension', timestamp: new Date().toISOString() }
        });
        document.dispatchEvent(event);
        
        sendResponse({success: true});
      } else {
        sendResponse({success: false, error: "No documents provided"});
      }
    } catch (e) {
      sendResponse({error: e.toString()});
    }
    return true;
  }
});

// Inform extension when document data changes in the web app
window.addEventListener("storage", function(e) {
  if (e.key === "documents" || e.key === "userSettings" || e.key === "backup_history" || e.key === "user_profile" || e.key === "isLoggedIn" || e.key === "userEmail" || e.key === "userId") {
    chrome.runtime.sendMessage({
      action: "webAppDataChanged",
      key: e.key,
      data: e.newValue,
      timestamp: new Date().toISOString()
    });
  }
});

// Send a message to the extension that the content script is loaded
chrome.runtime.sendMessage({
  action: "contentScriptLoaded",
  url: window.location.href,
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  userEmail: localStorage.getItem("userEmail") || ""
});

// Listen for custom events from the web application
document.addEventListener('DocuNinjaEvent', function(e) {
  const detail = e.detail || {};
  
  // Forward relevant events to the extension
  if (detail.type === 'documentUpdate' || detail.type === 'userSettingsUpdate' || detail.type === 'userProfileUpdate') {
    chrome.runtime.sendMessage({
      action: "webAppEvent",
      eventType: detail.type,
      data: detail.data,
      timestamp: new Date().toISOString()
    });
  }
});

// Define global functions to expose extension functionality
window.syncWithExtension = function() {
  if (window.__DOCU_NINJA_EXTENSION__) {
    return window.__DOCU_NINJA_EXTENSION__.syncWithWebApp();
  }
  return { success: false, error: "Extension not available" };
};

window.checkExtensionStatus = function() {
  return {
    installed: typeof window.__DOCU_NINJA_EXTENSION__ !== 'undefined',
    connected: localStorage.getItem('extensionConnected') === 'true',
    lastSync: localStorage.getItem('extensionSyncData') 
      ? JSON.parse(localStorage.getItem('extensionSyncData')).lastSync 
      : null
  };
};

// Initialize sync with extension
setTimeout(() => {
  // Simulate initial data sync
  chrome.runtime.sendMessage({
    action: "initialSync",
    url: window.location.href,
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
    userEmail: localStorage.getItem("userEmail") || "",
    userId: localStorage.getItem("userId") || ""
  });
}, 2000);

// Add a listener for when the user logs in or out
document.addEventListener('userAuthChanged', function(e) {
  const detail = e.detail || {};
  
  chrome.runtime.sendMessage({
    action: "authStatusChanged",
    isLoggedIn: detail.isLoggedIn,
    userEmail: detail.userEmail || "",
    userId: detail.userId || "",
    timestamp: new Date().toISOString()
  });
});

// Create a chrome extension ZIP file for download
function createExtensionZip() {
  console.log("Creating extension zip file...");
  // This is a mock function that would be implemented in a real scenario
  // In a production environment, this would create a ZIP file with the extension files
  return true;
}

// Execute initialization
createExtensionZip();
