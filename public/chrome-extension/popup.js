
// Main extension popup script

// App URL - update this to the actual URL when deployed
const APP_URL = 'https://aced323d-1714-48b5-848c-325f61a279c4.lovableproject.com';

// DOM elements
document.addEventListener('DOMContentLoaded', function() {
  const loginPrompt = document.getElementById('loginPrompt');
  const contentArea = document.getElementById('contentArea');
  const loadingState = document.getElementById('loadingState');
  const documentsList = document.getElementById('documentsList');
  const noDocuments = document.getElementById('noDocuments');
  const openWebAppBtn = document.getElementById('openWebApp');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const uploadBtn = document.getElementById('uploadBtn');
  const scanBtn = document.getElementById('scanBtn');
  const settingsBtn = document.getElementById('settingsBtn');

  // Open web app in new tab
  openWebAppBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: APP_URL });
  });

  // Login button
  loginBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: `${APP_URL}/sign-in` });
  });

  // Logout button
  logoutBtn.addEventListener('click', () => {
    chrome.storage.local.clear();
    showLoginPrompt();
  });

  // Upload document button
  uploadBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: `${APP_URL}/documents` });
  });

  // Scan document button
  scanBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: `${APP_URL}/documents` });
  });

  // Settings button
  settingsBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: `${APP_URL}/settings` });
  });

  // Show login prompt
  function showLoginPrompt() {
    loadingState.classList.add('hidden');
    contentArea.classList.add('hidden');
    loginPrompt.classList.remove('hidden');
  }

  // Show content area
  function showContent() {
    loadingState.classList.add('hidden');
    loginPrompt.classList.add('hidden');
    contentArea.classList.remove('hidden');
  }

  // Display documents in the list
  function displayDocuments(documents) {
    documentsList.innerHTML = ''; // Clear list
    
    // Sort documents by days remaining (closest first)
    const sortedDocs = documents.sort((a, b) => a.daysRemaining - b.daysRemaining);
    
    // Take only documents that are due soon or overdue (within 30 days)
    const filteredDocs = sortedDocs.filter(doc => doc.daysRemaining <= 30);
    
    if (filteredDocs.length === 0) {
      noDocuments.classList.remove('hidden');
    } else {
      noDocuments.classList.add('hidden');
      
      filteredDocs.forEach(doc => {
        // Determine importance class
        let importanceClass = 'low';
        if (doc.daysRemaining < 0) importanceClass = 'critical';
        else if (doc.daysRemaining <= 3) importanceClass = 'high';
        else if (doc.daysRemaining <= 7) importanceClass = 'medium';
        
        // Create document card
        const card = document.createElement('div');
        card.className = `doc-card ${importanceClass} px-3 py-2`;
        
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
  }

  // Sync documents from storage
  function checkLoginStatus() {
    chrome.storage.local.get(['documents', 'userEmail'], function(data) {
      if (data.documents && data.userEmail) {
        showContent();
        displayDocuments(data.documents);
      } else {
        showLoginPrompt();
      }
    });
  }

  // Load mock data for testing
  function loadMockData() {
    const mockDocuments = [
      {
        id: "1",
        title: "Car Insurance",
        type: "Invoice",
        dueDate: "April 15, 2025",
        daysRemaining: 3,
        description: "Annual premium payment",
        customReminderDays: 7
      },
      {
        id: "2",
        title: "Passport Renewal",
        type: "Document",
        dueDate: "April 30, 2025",
        daysRemaining: 18,
        description: "Expires soon"
      },
      {
        id: "3",
        title: "Property Tax",
        type: "Invoice",
        dueDate: "April 10, 2025",
        daysRemaining: -2,
        description: "County property tax",
        customCategory: "Tax Documents"
      }
    ];
    
    chrome.storage.local.set({
      documents: mockDocuments,
      userEmail: 'user@example.com',
      userSettings: {
        reminderDays: 7,
        emailNotifications: true
      }
    }, function() {
      showContent();
      displayDocuments(mockDocuments);
    });
  }

  // Try to get data from extension storage
  chrome.storage.local.get(['documents', 'userEmail'], function(data) {
    if (data.documents && data.userEmail) {
      showContent();
      displayDocuments(data.documents);
    } else {
      // If no data in storage, load mock data
      loadMockData();
    }
  });
  
  // Listen for sync messages
  chrome.runtime.onMessage.addListener(function(message) {
    if (message.action === 'documentsUpdated') {
      checkLoginStatus();
    }
  });
  
  // Force sync with web app
  chrome.runtime.sendMessage({action: 'syncDocuments'}, function(response) {
    console.log('Sync triggered', response);
  });
});

// Add content script to enable communication with web page
chrome.tabs.executeScript({
  code: `
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      if (message.action === "getLocalStorage") {
        try {
          const documents = JSON.parse(localStorage.getItem("documents") || "[]");
          const userSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
          sendResponse({documents, userSettings});
        } catch (e) {
          sendResponse({error: e.toString()});
        }
        return true;
      }
    });
  `
}, function() {
  if (chrome.runtime.lastError) {
    console.log('Content script injection failed:', chrome.runtime.lastError.message);
  }
});
