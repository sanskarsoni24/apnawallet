
// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getLocalStorage") {
    try {
      const documents = JSON.parse(localStorage.getItem("documents") || "[]");
      const userSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
      const userEmail = localStorage.getItem("userEmail") || "";
      const backupHistory = JSON.parse(localStorage.getItem("backup_history") || "[]");
      
      sendResponse({
        documents,
        userSettings,
        userEmail,
        backupHistory
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
});

// Inform extension when document data changes in the web app
window.addEventListener("storage", function(e) {
  if (e.key === "documents" || e.key === "userSettings" || e.key === "backup_history" || e.key === "user_profile") {
    chrome.runtime.sendMessage({
      action: "webAppDataChanged",
      key: e.key,
      data: e.newValue
    });
  }
});

// Send a message to the extension that the content script is loaded
chrome.runtime.sendMessage({
  action: "contentScriptLoaded",
  url: window.location.href
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
});
