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
      // Use document-specific reminder days if available, otherwise use global settings
      const daysThreshold = doc.customReminderDays !== undefined 
        ? doc.customReminderDays 
        : (settings.reminderDays || 3);
        
      return doc.daysRemaining > 0 && doc.daysRemaining <= daysThreshold;
    });
    
    if (dueSoonDocs.length > 0) {
      // Create a notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon-48.png',
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

// Set up alarms for checking documents
chrome.alarms.create('checkDocuments', { periodInMinutes: 1440 }); // Once per day
chrome.alarms.create('quickCheck', { periodInMinutes: 60 }); // Quick check every hour

// Listen for alarms
chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === 'checkDocuments' || alarm.name === 'quickCheck') {
    checkForDocumentDeadlines();
  }
});

// Check immediately when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function() {
  // Create extension icons if they don't exist
  chrome.storage.local.set({ lastSyncTime: null });
  
  // Create a welcome notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon-48.png',
    title: 'DocuNinja Extension Installed',
    message: 'DocuNinja is ready to help you manage your important documents',
    priority: 2
  });
  
  // Run initial check
  checkForDocumentDeadlines();
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'syncDocuments') {
    // This would fetch documents from the web app in a real implementation
    // For now, just check local storage
    checkForDocumentDeadlines();
    sendResponse({ success: true });
  }
});

// Sync with web app periodically (mock implementation)
function syncWithWebApp() {
  console.log('Syncing with web app...');
  // In a real extension, this would make API calls to your web app 
  // to get the latest documents
  
  // For demo purposes, we'll keep the existing documents
}

// Set up periodic sync (every 30 minutes)
setInterval(syncWithWebApp, 30 * 60 * 1000);
