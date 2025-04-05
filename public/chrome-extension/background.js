
// Background script for DocuNinja Chrome Extension

// Check for document deadlines and send notifications
function checkForDocumentDeadlines() {
  chrome.storage.local.get(['documents', 'userSettings'], function(data) {
    if (!data.documents || !data.userSettings) return;
    
    const today = new Date();
    const documents = data.documents;
    const settings = data.userSettings;
    
    // Find documents that are due soon based on settings
    const dueSoonDocs = documents.filter(doc => {
      const daysThreshold = doc.customReminderDays || settings.reminderDays || 3;
      return doc.daysRemaining > 0 && doc.daysRemaining <= daysThreshold;
    });
    
    if (dueSoonDocs.length > 0) {
      // Create a notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon-128.png',
        title: 'DocuNinja Document Reminder',
        message: `You have ${dueSoonDocs.length} document${dueSoonDocs.length > 1 ? 's' : ''} due soon`,
        priority: 2
      });
      
      // Update badge
      chrome.action.setBadgeText({ text: dueSoonDocs.length.toString() });
      chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  });
}

// Set up a daily alarm to check documents
chrome.alarms.create('checkDocuments', { periodInMinutes: 1440 }); // Once per day

// Listen for the alarm
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === 'checkDocuments') {
    checkForDocumentDeadlines();
  }
});

// Check immediately when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({ lastSyncTime: null });
  
  // Create a welcome notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon-128.png',
    title: 'DocuNinja Extension Installed',
    message: 'DocuNinja is ready to help you manage your important documents',
    priority: 2
  });
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'syncDocuments') {
    // This would be implemented to sync with the web app
    sendResponse({ success: true });
    checkForDocumentDeadlines();
  }
});
