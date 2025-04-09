
document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  const syncButton = document.getElementById('sync-button');
  const lastSyncElement = document.getElementById('last-sync');
  const documentList = document.getElementById('document-list');
  const settingsButton = document.getElementById('settings-button');
  const accountInfo = document.getElementById('account-info');
  const accountStatus = document.getElementById('account-status');
  
  // Load data from extension storage
  function loadData() {
    chrome.runtime.sendMessage({ action: 'getDocuments' }, function(response) {
      if (response) {
        updateUI(response);
      } else {
        showError('No data available. Try syncing with the web app.');
      }
    });
  }
  
  // Update the UI with data
  function updateUI(data) {
    // Update last sync time
    if (data.lastSyncTime) {
      const syncDate = new Date(data.lastSyncTime);
      lastSyncElement.textContent = syncDate.toLocaleString();
    }
    
    // Update account info
    if (data.userSettings) {
      const settings = data.userSettings;
      
      // Set user name and email
      if (settings.displayName) {
        accountInfo.textContent = settings.displayName;
      }
      
      // Set subscription status
      if (settings.subscriptionPlan) {
        const plan = settings.subscriptionPlan.charAt(0).toUpperCase() + settings.subscriptionPlan.slice(1);
        accountStatus.textContent = `${plan} Plan`;
        
        if (plan === 'Premium' || plan === 'Enterprise') {
          accountStatus.classList.add('premium-badge');
        } else {
          accountStatus.classList.remove('premium-badge');
        }
      }
    }
    
    // Update document list
    if (data.documents && data.documents.length > 0) {
      documentList.innerHTML = '';
      
      // Sort documents by expiry date (if available)
      const sortedDocs = [...data.documents].sort((a, b) => {
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(a.expiryDate) - new Date(b.expiryDate);
      });
      
      // Display up to 5 documents
      const docsToShow = sortedDocs.slice(0, 5);
      
      docsToShow.forEach(doc => {
        const docElement = document.createElement('div');
        docElement.className = 'document-item';
        
        // Calculate days remaining if expiry date exists
        let daysRemainingText = '';
        if (doc.expiryDate) {
          const expiryDate = new Date(doc.expiryDate);
          const today = new Date();
          const daysRemaining = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
          
          if (daysRemaining < 0) {
            daysRemainingText = `<span class="overdue">Expired</span>`;
          } else if (daysRemaining <= 30) {
            daysRemainingText = `<span class="expiring-soon">${daysRemaining} days left</span>`;
          } else {
            daysRemainingText = `<span class="days-remaining">${daysRemaining} days left</span>`;
          }
        }
        
        docElement.innerHTML = `
          <div class="doc-title">${doc.name}</div>
          <div class="doc-meta">
            <span class="doc-type">${doc.type || 'Document'}</span>
            ${daysRemainingText}
          </div>
        `;
        
        documentList.appendChild(docElement);
      });
      
      // Show total count if there are more documents
      if (data.documents.length > 5) {
        const moreElement = document.createElement('div');
        moreElement.className = 'more-documents';
        moreElement.textContent = `+ ${data.documents.length - 5} more documents`;
        documentList.appendChild(moreElement);
      }
    } else {
      documentList.innerHTML = '<div class="no-documents">No documents found</div>';
    }
  }
  
  // Show error message
  function showError(message) {
    documentList.innerHTML = `<div class="error-message">${message}</div>`;
  }
  
  // Sync with web app
  function syncWithWebApp() {
    syncButton.disabled = true;
    syncButton.textContent = 'Syncing...';
    
    chrome.runtime.sendMessage({ action: 'syncDocuments' }, function(response) {
      setTimeout(() => {
        syncButton.disabled = false;
        syncButton.textContent = 'Sync Now';
        loadData();
      }, 1000);
    });
  }
  
  // Open the web app
  function openWebApp() {
    chrome.tabs.create({ url: 'https://lovableproject.com' });
  }
  
  // Open settings page
  function openSettings() {
    chrome.tabs.create({ url: 'https://lovableproject.com/settings' });
  }
  
  // Add event listeners
  syncButton.addEventListener('click', syncWithWebApp);
  settingsButton.addEventListener('click', openSettings);
  
  document.getElementById('view-all').addEventListener('click', openWebApp);
  document.getElementById('add-document').addEventListener('click', openWebApp);
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'documentsUpdated') {
      loadData();
    }
  });
  
  // Initial load
  loadData();
});
