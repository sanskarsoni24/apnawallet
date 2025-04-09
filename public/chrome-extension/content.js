
// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getLocalStorage") {
    try {
      const documents = JSON.parse(localStorage.getItem("documents") || "[]");
      const userSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
      const userEmail = localStorage.getItem("userEmail") || "";
      const backupHistory = JSON.parse(localStorage.getItem("backup_history") || "[]");
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      
      sendResponse({
        documents,
        userSettings,
        userEmail,
        backupHistory,
        isLoggedIn,
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
        if (message.data.userSettings) {
          localStorage.setItem("userSettings", JSON.stringify(message.data.userSettings));
        }
        
        if (message.data.documents) {
          localStorage.setItem("documents", JSON.stringify(message.data.documents));
        }
        
        // Handle any custom data from the extension
        if (message.data.customData) {
          localStorage.setItem("extension_data", JSON.stringify(message.data.customData));
        }
        
        // Handle user profile data
        if (message.data.userProfile) {
          localStorage.setItem("user_profile", JSON.stringify(message.data.userProfile));
          if (message.data.userProfile.email) {
            localStorage.setItem("userEmail", message.data.userProfile.email);
          }
        }
        
        // Sync login state
        if (message.data.isLoggedIn !== undefined) {
          localStorage.setItem("isLoggedIn", message.data.isLoggedIn);
        }
        
        // Notify the page that data was updated
        const event = new CustomEvent('DocuNinjaDataSync', {
          detail: { source: 'extension', timestamp: new Date().toISOString() }
        });
        document.dispatchEvent(event);
        
        sendResponse({success: true, message: "Data synced successfully"});
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
      
      sendResponse({
        isLoggedIn,
        userSettings,
        userEmail,
        success: true
      });
    } catch (e) {
      sendResponse({error: e.toString()});
    }
    return true;
  }
});

// Inform extension when document data changes in the web app
window.addEventListener("storage", function(e) {
  if (e.key === "documents" || e.key === "userSettings" || e.key === "backup_history" || e.key === "user_profile" || e.key === "isLoggedIn" || e.key === "userEmail") {
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
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true"
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

// Add event listener for test user profile click
document.addEventListener('DOMContentLoaded', () => {
  // This will be handled by the router but adding extra handler for extension context
  const profileElements = document.querySelectorAll('[data-profile-link="true"]');
  profileElements.forEach(el => {
    el.addEventListener('click', () => {
      window.location.href = "/profile";
    });
  });
  
  // Inject notification badge for demo purposes
  injectNotificationBadge();
});

// Inject a notification badge for demo purposes
function injectNotificationBadge() {
  // Check if there are notifications to show
  const notificationCount = 3; // For demo purposes
  
  if (notificationCount > 0) {
    // Find the notification icon in the app
    setTimeout(() => {
      const notificationIcons = document.querySelectorAll('[data-notification-icon="true"]');
      notificationIcons.forEach(icon => {
        const badge = document.createElement('span');
        badge.className = 'notification-badge';
        badge.textContent = notificationCount.toString();
        badge.style.position = 'absolute';
        badge.style.top = '-5px';
        badge.style.right = '-5px';
        badge.style.backgroundColor = '#ef4444';
        badge.style.color = 'white';
        badge.style.borderRadius = '50%';
        badge.style.width = '16px';
        badge.style.height = '16px';
        badge.style.fontSize = '10px';
        badge.style.display = 'flex';
        badge.style.alignItems = 'center';
        badge.style.justifyContent = 'center';
        badge.style.fontWeight = 'bold';
        
        // Make sure the icon has position relative for absolute positioning of the badge
        icon.style.position = 'relative';
        icon.appendChild(badge);
      });
    }, 1000);
  }
}

// Function to expose data to the extension
window.exposeDataToExtension = function() {
  // This function can be called from the web app to manually trigger data sharing
  const documents = JSON.parse(localStorage.getItem("documents") || "[]");
  const userSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
  const userEmail = localStorage.getItem("userEmail") || "";
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  
  chrome.runtime.sendMessage({
    action: "manualDataSync",
    documents,
    userSettings,
    userEmail,
    isLoggedIn,
    timestamp: new Date().toISOString()
  });
  
  return true;
};

// Initialize sync with extension
setTimeout(() => {
  // Simulate initial data sync
  chrome.runtime.sendMessage({
    action: "initialSync",
    url: window.location.href,
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
    userEmail: localStorage.getItem("userEmail") || ""
  });
}, 2000);

// Add a listener for when the user logs in or out
document.addEventListener('userAuthChanged', function(e) {
  const detail = e.detail || {};
  
  chrome.runtime.sendMessage({
    action: "authStatusChanged",
    isLoggedIn: detail.isLoggedIn,
    userEmail: detail.userEmail || "",
    timestamp: new Date().toISOString()
  });
});
