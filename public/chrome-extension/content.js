
// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getLocalStorage") {
    try {
      const documents = JSON.parse(localStorage.getItem("documents") || "[]");
      const userSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
      const userEmail = localStorage.getItem("userEmail") || "";
      
      sendResponse({
        documents,
        userSettings,
        userEmail
      });
    } catch (e) {
      sendResponse({error: e.toString()});
    }
    return true; // Keep message channel open for async response
  }
});

// Inform extension when document data changes in the web app
window.addEventListener("storage", function(e) {
  if (e.key === "documents" || e.key === "userSettings") {
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
