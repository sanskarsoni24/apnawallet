
// Background script for SurakshitLocker Chrome Extension

// Check for document deadlines and send notifications
function checkForDocumentDeadlines() {
  chrome.storage.local.get(['documents', 'userSettings'], function(data) {
    if (!data.documents || !data.userSettings) return;
    
    const today = new Date();
    const documents = data.documents;
    const settings = data.userSettings;
    
    // Find documents that are due soon based on settings
    const daysThreshold = settings.reminderDays || 3;
    const dueSoonDocs = documents.filter(doc => {
      // Use document-specific reminder days if available, otherwise use global settings
      const docThreshold = doc.customReminderDays !== undefined 
        ? doc.customReminderDays 
        : daysThreshold;
        
      return doc.daysRemaining > 0 && doc.daysRemaining <= docThreshold;
    });
    
    const overdueDocs = documents.filter(doc => doc.daysRemaining < 0);
    
    // Calculate total docs to show in badge
    const totalAlertDocs = dueSoonDocs.length + overdueDocs.length;
    
    if (totalAlertDocs > 0) {
      // Create a notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon-48.png',
        title: 'SurakshitLocker Document Reminder',
        message: `You have ${totalAlertDocs} document${totalAlertDocs > 1 ? 's' : ''} that require attention`,
        priority: 2
      });
      
      // Update badge
      chrome.action.setBadgeText({ text: totalAlertDocs.toString() });
      chrome.action.setBadgeBackgroundColor({ color: overdueDocs.length > 0 ? '#ef4444' : '#f59e0b' });
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

// Monitor downloads and detect document types
chrome.downloads.onDeterminingFilename.addListener(function(downloadItem, suggest) {
  // Only process certain file types
  const fileExtension = downloadItem.filename.split('.').pop()?.toLowerCase();
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'jpg', 'jpeg', 'png'];
  
  if (documentExtensions.includes(fileExtension)) {
    // Get the file content for analysis (this is limited by Chrome's security model)
    // In a real extension, you might need user to upload or select the file
    setTimeout(() => {
      // Notify user of potential document detected
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon-48.png',
        title: 'Document Downloaded',
        message: `We detected a potential document: ${downloadItem.filename}. Click to add to SurakshitLocker.`,
        priority: 2,
        buttons: [
          { title: 'Add to SurakshitLocker' }
        ]
      }, function(notificationId) {
        // Store the download info to be used when the notification is clicked
        chrome.storage.local.set({
          ['pending_document_' + notificationId]: {
            filename: downloadItem.filename,
            url: downloadItem.url,
            fileType: fileExtension,
            mimeType: downloadItem.mime,
            fileSize: downloadItem.fileSize,
            downloadTime: new Date().toISOString()
          }
        });
      });
    }, 1000);
  }
  
  // Continue with the download
  suggest();
});

// Handle notification clicks
chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
  if (buttonIndex === 0) {
    chrome.storage.local.get(['pending_document_' + notificationId], function(data) {
      const documentInfo = data['pending_document_' + notificationId];
      if (documentInfo) {
        // Open popup to add document
        chrome.tabs.create({ url: `popup.html?action=add_document&filename=${encodeURIComponent(documentInfo.filename)}` });
        
        // Clean up storage
        chrome.storage.local.remove(['pending_document_' + notificationId]);
      }
    });
  }
});

// Check immediately when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function() {
  // Initialize sync data on install
  chrome.storage.local.set({
    lastSyncTime: new Date().toISOString(),
    initialSync: true
  });
  
  // Request downloads permission
  chrome.permissions.request({
    permissions: ['downloads']
  }, function(granted) {
    if (granted) {
      console.log('Downloads permission granted');
    } else {
      console.log('Downloads permission denied');
    }
  });
  
  // Create a welcome notification
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon-48.png',
    title: 'SurakshitLocker Extension Installed',
    message: 'SurakshitLocker is ready to help you manage your important documents',
    priority: 2
  });
  
  // Run initial check
  checkForDocumentDeadlines();
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'syncDocuments') {
    // Start syncing process
    syncWithWebApp();
    sendResponse({ success: true, message: 'Sync started' });
    return true; // Keep the messaging channel open for async response
  } else if (message.action === 'getDocuments') {
    // Return documents directly
    chrome.storage.local.get(['documents'], function(data) {
      sendResponse({ documents: data.documents || [] });
    });
    return true; // Keep the messaging channel open for async response
  } else if (message.action === 'analyzeDocument') {
    // Send to active tab's content script for analysis
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'analyzeDownload',
          fileData: message.fileData
        }, function(response) {
          sendResponse(response);
        });
      } else {
        sendResponse({ success: false, error: 'No active tab found' });
      }
    });
    return true;
  }
});

// Sync with web app
function syncWithWebApp() {
  console.log('Syncing with SurakshitLocker web app...');
  
  // For demo purposes, we'll check if data exists in localStorage via the content script
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0] && tabs[0].url && tabs[0].url.includes('lovableproject.com')) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "getLocalStorage"}, function(response) {
        if (response && response.documents) {
          chrome.storage.local.set({
            documents: response.documents,
            userSettings: response.userSettings || {},
            userEmail: response.userEmail || 'user@example.com',
            lastSyncTime: new Date().toISOString()
          });
          
          // Check for due documents after sync
          checkForDocumentDeadlines();
          
          // Notify popup that documents were updated
          chrome.runtime.sendMessage({ action: 'documentsUpdated' });
        } else {
          console.log('No documents found or error getting local storage');
          // Try using mock data if necessary in real deployment
        }
      });
    } else {
      console.log('No active tab with the web app');
      // Try to use stored data or mock data
    }
  });
}

// Set up periodic sync (every 30 minutes)
setInterval(syncWithWebApp, 30 * 60 * 1000);

// Adding listeners for tab updates to sync when the web app is open
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('lovableproject.com')) {
    // Wait a moment for the page to initialize localStorage
    setTimeout(() => {
      syncWithWebApp();
    }, 2000);
  }
});
