
// Main extension popup script for SurakshitLocker

// App URL - update this to the actual URL when deployed
const APP_URL = 'https://aced323d-1714-48b5-848c-325f61a279c4.lovableproject.com';

// DOM elements
document.addEventListener('DOMContentLoaded', function() {
  // UI elements
  const loginPrompt = document.getElementById('loginPrompt');
  const contentArea = document.getElementById('contentArea');
  const loadingState = document.getElementById('loadingState');
  const documentsList = document.getElementById('documentsList');
  const noDocuments = document.getElementById('noDocuments');
  const lastSyncTime = document.getElementById('lastSyncTime');
  
  // Action buttons
  const openWebAppBtn = document.getElementById('openWebApp');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const uploadBtn = document.getElementById('uploadBtn');
  const scanBtn = document.getElementById('scanBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const syncBtn = document.getElementById('syncBtn');
  
  // Set up button actions
  if (openWebAppBtn) {
    openWebAppBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: APP_URL });
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: `${APP_URL}/sign-in` });
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      chrome.storage.local.clear();
      showLoginPrompt();
    });
  }

  if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: `${APP_URL}/documents` });
    });
  }

  if (scanBtn) {
    scanBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: `${APP_URL}/documents?action=scan` });
    });
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: `${APP_URL}/settings` });
    });
  }
  
  if (syncBtn) {
    syncBtn.addEventListener('click', () => {
      loadingState.classList.remove('hidden');
      contentArea.classList.add('hidden');
      loginPrompt.classList.add('hidden');
      
      // Force sync with web app
      chrome.runtime.sendMessage({action: 'syncDocuments'}, function(response) {
        setTimeout(() => {
          checkLoginStatus();
          updateLastSyncTime();
        }, 1000);
      });
    });
  }

  // Show login prompt
  function showLoginPrompt() {
    if (loadingState) loadingState.classList.add('hidden');
    if (contentArea) contentArea.classList.add('hidden');
    if (loginPrompt) loginPrompt.classList.remove('hidden');
  }

  // Show content area
  function showContent() {
    if (loadingState) loadingState.classList.add('hidden');
    if (loginPrompt) loginPrompt.classList.add('hidden');
    if (contentArea) contentArea.classList.remove('hidden');
  }

  // Display documents in the list
  function displayDocuments(documents) {
    if (!documentsList) return;
    
    documentsList.innerHTML = ''; // Clear list
    
    // Sort documents by days remaining (closest first)
    const sortedDocs = documents.sort((a, b) => {
      // First sort by overdues
      if (a.daysRemaining < 0 && b.daysRemaining >= 0) return -1;
      if (a.daysRemaining >= 0 && b.daysRemaining < 0) return 1;
      // Then sort by days remaining
      return a.daysRemaining - b.daysRemaining;
    });
    
    // Show no documents message if needed
    if (noDocuments) {
      if (sortedDocs.length === 0) {
        noDocuments.classList.remove('hidden');
      } else {
        noDocuments.classList.add('hidden');
      }
    }
    
    // Create document items
    sortedDocs.forEach(doc => {
      // Determine importance class
      let importanceClass = 'low';
      if (doc.daysRemaining < 0) importanceClass = 'critical';
      else if (doc.daysRemaining <= 3) importanceClass = 'high';
      else if (doc.daysRemaining <= 7) importanceClass = 'medium';
      
      // Create document card
      const card = document.createElement('div');
      card.className = `doc-card ${importanceClass} px-3 py-2 mb-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors`;
      
      // Format due date text
      let dueDateText = '';
      if (doc.daysRemaining < 0) {
        dueDateText = `<span class="text-red-600 font-medium">Overdue by ${Math.abs(doc.daysRemaining)} days</span>`;
      } else if (doc.daysRemaining === 0) {
        dueDateText = '<span class="text-red-600 font-medium">Due today</span>';
      } else if (doc.daysRemaining === 1) {
        dueDateText = '<span class="text-orange-500 font-medium">Due tomorrow</span>';
      } else {
        dueDateText = `<span class="${doc.daysRemaining <= 3 ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'}">Due in ${doc.daysRemaining} days</span>`;
      }
      
      // Show custom reminder if set
      let reminderText = '';
      if (doc.customReminderDays !== undefined) {
        reminderText = `<span class="text-xs text-indigo-500">Custom reminder: ${doc.customReminderDays} days</span>`;
      }
      
      // Format category/type display
      const typeDisplay = doc.customCategory ? doc.customCategory : doc.type;
      
      card.innerHTML = `
        <div class="flex justify-between items-center">
          <h3 class="font-medium text-sm">${doc.title}</h3>
          <span class="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">${typeDisplay}</span>
        </div>
        <div class="flex justify-between items-center mt-1">
          <p class="text-xs text-gray-500 dark:text-gray-400">${doc.description || ''}</p>
          <p class="text-xs">${dueDateText}</p>
        </div>
        ${reminderText ? `<div class="mt-1">${reminderText}</div>` : ''}
      `;
      
      card.addEventListener('click', () => {
        chrome.tabs.create({ url: `${APP_URL}/documents?doc=${doc.id}` });
      });
      
      documentsList.appendChild(card);
    });
  }

  // Update last sync time
  function updateLastSyncTime() {
    if (!lastSyncTime) return;
    
    chrome.storage.local.get(['lastSyncTime'], function(data) {
      if (data.lastSyncTime) {
        const syncDate = new Date(data.lastSyncTime);
        const now = new Date();
        const diffMinutes = Math.round((now - syncDate) / (1000 * 60));
        
        let timeDisplay;
        if (diffMinutes < 1) {
          timeDisplay = 'Just now';
        } else if (diffMinutes < 60) {
          timeDisplay = `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
        } else {
          const hours = Math.floor(diffMinutes / 60);
          timeDisplay = `${hours} hour${hours === 1 ? '' : 's'} ago`;
        }
        
        lastSyncTime.textContent = timeDisplay;
      } else {
        lastSyncTime.textContent = 'Never';
      }
    });
  }

  // Sync documents from storage
  function checkLoginStatus() {
    chrome.storage.local.get(['documents', 'userEmail'], function(data) {
      if (data.documents && data.userEmail) {
        showContent();
        displayDocuments(data.documents);
        updateLastSyncTime();
      } else {
        showLoginPrompt();
      }
    });
  }

  // Load initial data
  chrome.storage.local.get(['documents', 'userEmail'], function(data) {
    if (data.documents && data.userEmail) {
      showContent();
      displayDocuments(data.documents);
      updateLastSyncTime();
    } else {
      // If no data in storage, request sync
      chrome.runtime.sendMessage({action: 'syncDocuments'}, function(response) {
        setTimeout(checkLoginStatus, 1000);
      });
    }
  });
  
  // Listen for sync messages
  chrome.runtime.onMessage.addListener(function(message) {
    if (message.action === 'documentsUpdated') {
      chrome.storage.local.get(['documents'], function(data) {
        if (data.documents) {
          showContent();
          displayDocuments(data.documents);
          updateLastSyncTime();
        }
      });
    }
  });
  
  // Update when popup is opened
  updateLastSyncTime();
});

// Utility function to format file sizes
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  const kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(1) + ' KB';
  const mb = kb / 1024;
  return mb.toFixed(1) + ' MB';
}
