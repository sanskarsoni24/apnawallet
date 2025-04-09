
document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const contentArea = document.getElementById('contentArea');
  const loginPrompt = document.getElementById('loginPrompt');
  const loadingState = document.getElementById('loadingState');
  const documentsList = document.getElementById('documentsList');
  const noDocuments = document.getElementById('noDocuments');
  const lastSyncTime = document.getElementById('lastSyncTime');
  const syncBtn = document.getElementById('syncBtn');
  const openWebApp = document.getElementById('openWebApp');
  const loginBtn = document.getElementById('loginBtn');
  const uploadBtn = document.getElementById('uploadBtn');
  const scanBtn = document.getElementById('scanBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  
  // State
  let isLoggedIn = false;
  let userData = null;
  let documents = [];
  
  // Initialize
  init();
  
  function init() {
    // Show loading state initially
    showLoadingState();
    
    // Check authentication status
    checkAuthStatus();
    
    // Set up event listeners
    setupEventListeners();
  }
  
  function showLoadingState() {
    contentArea.classList.add('hidden');
    loginPrompt.classList.add('hidden');
    loadingState.classList.remove('hidden');
  }
  
  function showContent() {
    contentArea.classList.remove('hidden');
    loginPrompt.classList.add('hidden');
    loadingState.classList.add('hidden');
  }
  
  function showLoginPrompt() {
    contentArea.classList.add('hidden');
    loginPrompt.classList.remove('hidden');
    loadingState.classList.add('hidden');
  }
  
  function checkAuthStatus() {
    chrome.runtime.sendMessage({ action: 'getDocuments' }, function(response) {
      if (response) {
        // Check if user is logged in
        isLoggedIn = response.isLoggedIn || false;
        
        if (isLoggedIn) {
          // User is logged in, show content
          userData = {
            documents: response.documents || [],
            userSettings: response.userSettings || {},
            lastSyncTime: response.lastSyncTime || new Date().toISOString()
          };
          
          updateUI(userData);
          showContent();
        } else {
          // User is not logged in, show login prompt
          showLoginPrompt();
        }
      } else {
        // No response from background script, show login prompt
        showLoginPrompt();
      }
    });
  }
  
  function updateUI(data) {
    // Update document list
    updateDocumentList(data.documents || []);
    
    // Update last sync time
    if (data.lastSyncTime) {
      updateSyncTime(data.lastSyncTime);
    }
  }
  
  function updateDocumentList(docs) {
    documents = docs;
    
    if (docs.length === 0) {
      // No documents available
      documentsList.innerHTML = '';
      noDocuments.classList.remove('hidden');
      return;
    }
    
    // Sort documents by expiry date
    const sortedDocs = [...docs].sort((a, b) => {
      if (!a.expiryDate) return 1;
      if (!b.expiryDate) return -1;
      return new Date(a.expiryDate) - new Date(b.expiryDate);
    });
    
    // Filter documents that are expiring soon
    const today = new Date();
    const expiringDocs = sortedDocs.filter(doc => {
      if (!doc.expiryDate) return false;
      
      const expiryDate = new Date(doc.expiryDate);
      const daysDiff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      
      return daysDiff <= 30; // Documents expiring within 30 days
    });
    
    if (expiringDocs.length === 0) {
      // No expiring documents
      documentsList.innerHTML = '';
      noDocuments.classList.remove('hidden');
      return;
    }
    
    // Hide no documents message
    noDocuments.classList.add('hidden');
    
    // Create document items
    documentsList.innerHTML = '';
    
    expiringDocs.slice(0, 5).forEach(doc => {
      const docItem = createDocumentItem(doc);
      documentsList.appendChild(docItem);
    });
  }
  
  function createDocumentItem(doc) {
    const docElement = document.createElement('div');
    docElement.className = 'doc-card p-3';
    
    // Determine priority class based on days remaining
    let priorityClass = 'low';
    let daysText = '';
    
    if (doc.expiryDate) {
      const expiryDate = new Date(doc.expiryDate);
      const today = new Date();
      const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
      
      daysText = daysRemaining <= 0 
        ? 'Expired!' 
        : daysRemaining === 1 
          ? '1 day left' 
          : `${daysRemaining} days left`;
      
      if (daysRemaining <= 0) {
        priorityClass = 'critical';
      } else if (daysRemaining <= 7) {
        priorityClass = 'high';
      } else if (daysRemaining <= 14) {
        priorityClass = 'medium';
      }
    }
    
    // Add priority class
    docElement.classList.add(priorityClass);
    
    // Create document item content
    docElement.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <h3 class="font-medium text-sm">${doc.name || 'Untitled Document'}</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">${doc.type || 'Document'}</p>
        </div>
        <span class="text-xs font-medium ${priorityClass === 'critical' ? 'text-red-600 dark:text-red-400' : ''}">${daysText}</span>
      </div>
    `;
    
    // Add click event
    docElement.addEventListener('click', () => {
      openDocument(doc.id);
    });
    
    return docElement;
  }
  
  function updateSyncTime(timestamp) {
    const syncDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now - syncDate;
    const diffMins = Math.floor(diffMs / 60000);
    
    let timeText = '';
    
    if (diffMins < 1) {
      timeText = 'Just now';
    } else if (diffMins < 60) {
      timeText = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      timeText = `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      timeText = syncDate.toLocaleString();
    }
    
    lastSyncTime.textContent = timeText;
  }
  
  function setupEventListeners() {
    // Open web app button
    openWebApp.addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://lovableproject.com' });
    });
    
    // Login button
    loginBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://lovableproject.com/signin' });
    });
    
    // Sync button
    syncBtn.addEventListener('click', syncNow);
    
    // Upload button
    uploadBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://lovableproject.com/documents?upload=true' });
    });
    
    // Scan button
    scanBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://lovableproject.com/scan' });
    });
    
    // Settings button
    settingsBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://lovableproject.com/settings' });
    });
    
    // Logout button
    logoutBtn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'logout' }, function() {
        showLoginPrompt();
      });
    });
  }
  
  function syncNow() {
    // Add syncing animation
    syncBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
      </svg>
      Syncing...
    `;
    
    chrome.runtime.sendMessage({ action: 'syncDocuments', force: true }, function(response) {
      setTimeout(() => {
        if (response && response.success) {
          // Success
          updateUI(response.data || {});
          
          // Reset sync button
          syncBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
              <path d="M3 22v-6h6"></path>
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
            </svg>
            Sync Now
          `;
          
          // Show success indicator
          const successIndicator = document.createElement('div');
          successIndicator.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md text-sm font-medium';
          successIndicator.textContent = 'Sync completed';
          document.body.appendChild(successIndicator);
          
          setTimeout(() => {
            successIndicator.remove();
          }, 3000);
        } else {
          // Error
          syncBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
              <path d="M3 22v-6h6"></path>
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
            </svg>
            Retry Sync
          `;
          
          // Show error indicator
          const errorIndicator = document.createElement('div');
          errorIndicator.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium';
          errorIndicator.textContent = 'Sync failed';
          document.body.appendChild(errorIndicator);
          
          setTimeout(() => {
            errorIndicator.remove();
          }, 3000);
        }
      }, 1500);
    });
  }
  
  function openDocument(docId) {
    chrome.tabs.create({ url: `https://lovableproject.com/documents/${docId}` });
  }
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'documentsUpdated') {
      updateUI(message.data || {});
    } else if (message.action === 'authStatusChanged') {
      checkAuthStatus();
    }
  });
});
