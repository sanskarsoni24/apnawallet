
// Background script for SurakshitLocker Chrome Extension

// Global variables
let lastSyncTime = null;
let syncInterval = 30 * 60 * 1000; // 30 minutes default
let documentCache = [];
let userSettings = null;
let isUserLoggedIn = false;
let userId = null;
let userEmail = null;

// Initialize the extension
function initializeExtension() {
  console.log('Initializing SurakshitLocker extension...');
  
  // Load saved data
  chrome.storage.local.get(['lastSyncTime', 'documents', 'userSettings', 'isLoggedIn', 'userId', 'userEmail'], function(data) {
    if (data.lastSyncTime) {
      lastSyncTime = new Date(data.lastSyncTime);
    }
    
    if (data.documents) {
      documentCache = data.documents;
    }
    
    if (data.userSettings) {
      userSettings = data.userSettings;
    }
    
    isUserLoggedIn = data.isLoggedIn || false;
    userId = data.userId || null;
    userEmail = data.userEmail || null;
    
    // Check for document deadlines
    checkForDocumentDeadlines();
    
    // Start sync if user is logged in
    if (isUserLoggedIn) {
      syncWithWebApp(true);
    }
  });
}

// Check for document deadlines and send notifications
function checkForDocumentDeadlines() {
  chrome.storage.local.get(['documents', 'userSettings'], function(data) {
    if (!data.documents || !data.userSettings) return;
    
    const today = new Date();
    const documents = data.documents;
    const settings = data.userSettings;
    
    // Find documents that are due soon based on settings
    const daysThreshold = settings.reminderDays || 7;
    
    const dueSoonDocs = documents.filter(doc => {
      if (!doc.expiryDate) return false;
      
      const expiryDate = new Date(doc.expiryDate);
      const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      
      // Use document-specific reminder days if available, otherwise use global settings
      const docThreshold = doc.customReminderDays !== undefined 
        ? doc.customReminderDays 
        : daysThreshold;
        
      return daysRemaining > 0 && daysRemaining <= docThreshold;
    });
    
    const overdueDocs = documents.filter(doc => {
      if (!doc.expiryDate) return false;
      
      const expiryDate = new Date(doc.expiryDate);
      const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      
      return daysRemaining < 0;
    });
    
    // Calculate total docs to show in badge
    const totalAlertDocs = dueSoonDocs.length + overdueDocs.length;
    
    if (totalAlertDocs > 0) {
      // Create a notification
      if (settings.pushNotifications !== false && !chrome.notifications.getAll) {
        const notificationOptions = {
          type: 'basic',
          iconUrl: 'icon-48.png',
          title: 'SurakshitLocker Document Reminder',
          message: `You have ${totalAlertDocs} document${totalAlertDocs > 1 ? 's' : ''} that require attention`,
          priority: 2
        };
        
        chrome.notifications.create('documentReminder', notificationOptions);
      }
      
      // Update badge
      chrome.action.setBadgeText({ text: totalAlertDocs.toString() });
      chrome.action.setBadgeBackgroundColor({ color: overdueDocs.length > 0 ? '#ef4444' : '#f59e0b' });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  });
}

// Perform full sync with web app
function syncWithWebApp(force = false) {
  console.log('Syncing with SurakshitLocker web app...');
  
  // Check if we need to sync based on time passed
  const now = new Date();
  if (!force && lastSyncTime && (now.getTime() - lastSyncTime.getTime() < syncInterval)) {
    console.log('Skipping sync, last sync was too recent');
    return;
  }
  
  // Try to fetch data from open tabs first
  chrome.tabs.query({url: "*://*.lovableproject.com/*"}, function(tabs) {
    if (tabs.length > 0) {
      // Try each tab until we get data
      let syncAttempted = false;
      
      tabs.forEach(tab => {
        if (syncAttempted) return;
        
        chrome.tabs.sendMessage(tab.id, {action: "getLocalStorage"}, function(response) {
          if (chrome.runtime.lastError) {
            console.log('Error connecting to tab:', chrome.runtime.lastError);
            return;
          }
          
          if (response && (response.documents || response.userSettings)) {
            syncAttempted = true;
            processWebAppData(response);
          }
        });
      });
      
      // If we didn't get data from tabs, use cached data
      setTimeout(() => {
        if (!syncAttempted) {
          console.log('No data from tabs, using cached data');
          useCachedData();
        }
      }, 1000);
    } else {
      // No tabs open, use cached data
      useCachedData();
    }
  });
  
  // Update last sync time
  lastSyncTime = now;
  chrome.storage.local.set({ lastSyncTime: now.toISOString() });
}

// Process data from web app
function processWebAppData(data) {
  console.log('Processing web app data:', data);
  
  // Update user login status
  isUserLoggedIn = data.isLoggedIn || false;
  userId = data.userId || null;
  userEmail = data.userEmail || null;
  
  // Get only what we need to avoid storage limits
  const processedData = {
    documents: data.documents || [],
    userSettings: data.userSettings || {},
    userEmail: data.userEmail || '',
    userId: data.userId || '',
    isLoggedIn: data.isLoggedIn || false,
    lastSyncTime: new Date().toISOString()
  };
  
  // Update our cache
  documentCache = processedData.documents;
  userSettings = processedData.userSettings;
  
  // Store in extension storage
  chrome.storage.local.set(processedData);
  
  // Check for documents that need attention
  checkForDocumentDeadlines();
  
  // Notify popup that documents were updated
  chrome.runtime.sendMessage({ 
    action: 'documentsUpdated',
    data: processedData
  });
  
  return processedData;
}

// Use cached data when we can't connect to web app
function useCachedData() {
  chrome.storage.local.get(['documents', 'userSettings', 'isLoggedIn', 'userId', 'userEmail'], function(data) {
    if (!data.documents) {
      // Create demo documents if none exist
      const demoDocuments = [
        {
          id: 'doc1',
          name: 'Passport',
          type: 'Identity',
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        },
        {
          id: 'doc2',
          name: 'Insurance Policy',
          type: 'Insurance',
          expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days from now
        },
        {
          id: 'doc3',
          name: 'Driver\'s License',
          type: 'Identity',
          expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago (expired)
        }
      ];
      
      chrome.storage.local.set({ documents: demoDocuments });
      documentCache = demoDocuments;
    } else {
      documentCache = data.documents;
    }
    
    if (!data.userSettings) {
      // Create demo user settings if none exist
      const demoSettings = {
        displayName: 'Demo User',
        email: data.userEmail || 'demo@example.com',
        pushNotifications: true,
        reminderDays: 7,
        theme: 'system'
      };
      
      chrome.storage.local.set({ userSettings: demoSettings });
      userSettings = demoSettings;
    } else {
      userSettings = data.userSettings;
    }
    
    isUserLoggedIn = data.isLoggedIn || false;
    userId = data.userId || null;
    userEmail = data.userEmail || null;
    
    // Check for document deadlines
    checkForDocumentDeadlines();
    
    return {
      documents: documentCache,
      userSettings: userSettings,
      isLoggedIn: isUserLoggedIn,
      userId: userId,
      userEmail: userEmail,
      lastSyncTime: lastSyncTime ? lastSyncTime.toISOString() : new Date().toISOString()
    };
  });
}

// Set up extension on install or update
function setupExtension() {
  // Initialize sync data
  chrome.storage.local.set({
    lastSyncTime: new Date().toISOString(),
    initialSetup: true
  });
  
  // Create a welcome notification
  chrome.notifications.create('welcome', {
    type: 'basic',
    iconUrl: 'icon-48.png',
    title: 'SurakshitLocker Extension Installed',
    message: 'SurakshitLocker is ready to help you manage your important documents',
    priority: 2
  });
  
  // Run initial sync
  syncWithWebApp(true);
}

// Set up alarms for checking documents and syncing
chrome.alarms.create('checkDocuments', { periodInMinutes: 1440 }); // Once per day
chrome.alarms.create('quickCheck', { periodInMinutes: 60 }); // Quick check every hour
chrome.alarms.create('syncDocuments', { periodInMinutes: 30 }); // Sync every 30 minutes

// Listen for alarms
chrome.alarms.onAlarm.addListener(function(alarm) {
  console.log('Alarm triggered:', alarm.name);
  
  if (alarm.name === 'checkDocuments' || alarm.name === 'quickCheck') {
    checkForDocumentDeadlines();
  } else if (alarm.name === 'syncDocuments') {
    syncWithWebApp();
  }
});

// Check immediately when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function(details) {
  console.log('Extension installed or updated:', details.reason);
  
  if (details.reason === 'install') {
    setupExtension();
  } else if (details.reason === 'update') {
    initializeExtension();
  }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log('Message received:', message);
  
  if (message.action === 'syncDocuments') {
    // Start syncing process
    const syncData = syncWithWebApp(true);
    sendResponse({ success: true, message: 'Sync started', data: syncData });
    return true; // Keep the messaging channel open for async response
  } 
  
  if (message.action === 'getDocuments') {
    // Return documents directly
    chrome.storage.local.get(['documents', 'userSettings', 'lastSyncTime', 'isLoggedIn', 'userId', 'userEmail'], function(data) {
      sendResponse({ 
        documents: data.documents || [],
        userSettings: data.userSettings || {},
        lastSyncTime: data.lastSyncTime || new Date().toISOString(),
        isLoggedIn: data.isLoggedIn || false,
        userId: data.userId || null,
        userEmail: data.userEmail || null
      });
    });
    return true; // Keep the messaging channel open for async response
  } 
  
  if (message.action === 'updateSettings') {
    // Update settings
    chrome.storage.local.get(['userSettings'], function(data) {
      const updatedSettings = { ...(data.userSettings || {}), ...message.settings };
      chrome.storage.local.set({ userSettings: updatedSettings });
      
      // Update our cache
      userSettings = updatedSettings;
      
      sendResponse({ success: true, message: 'Settings updated' });
    });
    return true; // Keep the messaging channel open for async response
  }
  
  if (message.action === 'logout') {
    // Log out user
    isUserLoggedIn = false;
    userId = null;
    userEmail = null;
    
    chrome.storage.local.set({
      isLoggedIn: false,
      userId: null,
      userEmail: null
    });
    
    sendResponse({ success: true, message: 'Logged out' });
    return true;
  }
  
  if (message.action === 'login') {
    // Log in user
    isUserLoggedIn = true;
    userId = message.userId;
    userEmail = message.userEmail;
    
    chrome.storage.local.set({
      isLoggedIn: true,
      userId: message.userId,
      userEmail: message.userEmail
    });
    
    // Sync with web app
    syncWithWebApp(true);
    
    sendResponse({ success: true, message: 'Logged in' });
    return true;
  }
  
  if (message.action === 'webAppDataChanged' || message.action === 'webAppEvent') {
    // Web app data changed, trigger sync
    syncWithWebApp(true);
    return true;
  }
  
  if (message.action === 'initialSync') {
    // Initial sync from content script
    if (message.isLoggedIn) {
      isUserLoggedIn = true;
      userEmail = message.userEmail;
      userId = message.userId;
      
      chrome.storage.local.set({
        isLoggedIn: true,
        userEmail: message.userEmail,
        userId: message.userId
      });
      
      // Notify popup about auth status change
      chrome.runtime.sendMessage({
        action: 'authStatusChanged',
        isLoggedIn: true,
        userEmail: message.userEmail,
        userId: message.userId
      });
      
      // Sync with web app
      syncWithWebApp(true);
    }
    return true;
  }
});

// Adding listeners for tab updates to sync when the web app is open
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('lovableproject.com')) {
    console.log('SurakshitLocker web app detected, syncing...');
    // Wait a moment for the page to initialize localStorage
    setTimeout(() => {
      syncWithWebApp(true);
    }, 2000);
  }
});

// Initial setup when background script loads
initializeExtension();
