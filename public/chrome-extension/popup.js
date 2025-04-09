
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
        
        // Add click event to open document
        docElement.addEventListener('click', () => {
          openDocument(doc.id);
        });
        
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
        moreElement.addEventListener('click', openWebApp);
        documentList.appendChild(moreElement);
      }
    } else {
      documentList.innerHTML = '<div class="no-documents">No documents found</div>';
    }
    
    // Enable or disable sync button based on login status
    syncButton.disabled = !(data.userSettings && data.userSettings.isLoggedIn);
    
    // Show backup status if available
    if (data.backupStatus) {
      const backupStatusElement = document.createElement('div');
      backupStatusElement.className = 'backup-status';
      backupStatusElement.innerHTML = `
        <div class="backup-title">Last Backup</div>
        <div class="backup-info">${new Date(data.backupStatus.lastBackup).toLocaleDateString()}</div>
      `;
      
      // Insert before settings button
      document.querySelector('.footer').insertBefore(backupStatusElement, settingsButton);
    }
  }
  
  // Open document in web app
  function openDocument(docId) {
    chrome.tabs.create({ url: `https://lovableproject.com/documents/${docId}` });
  }
  
  // Show error message
  function showError(message) {
    documentList.innerHTML = `<div class="error-message">${message}</div>`;
  }
  
  // Sync with web app
  function syncWithWebApp() {
    syncButton.disabled = true;
    syncButton.textContent = 'Syncing...';
    
    // Show sync animation
    document.body.classList.add('syncing');
    
    chrome.runtime.sendMessage({ action: 'syncDocuments' }, function(response) {
      setTimeout(() => {
        syncButton.disabled = false;
        syncButton.textContent = 'Sync Now';
        document.body.classList.remove('syncing');
        
        if (response && response.success) {
          // Update UI with new data
          updateUI(response.data);
          
          // Show success message
          const successMessage = document.createElement('div');
          successMessage.className = 'sync-success';
          successMessage.textContent = 'Sync completed successfully!';
          document.body.appendChild(successMessage);
          
          // Remove message after 3 seconds
          setTimeout(() => {
            successMessage.remove();
          }, 3000);
        } else {
          showError('Sync failed. Please try again later.');
        }
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
  document.getElementById('add-document').addEventListener('click', function() {
    chrome.tabs.create({ url: 'https://lovableproject.com/documents/new' });
  });
  
  // Add context menu for quick actions
  document.addEventListener('contextmenu', function(e) {
    if (e.target.closest('.document-item')) {
      e.preventDefault();
      const docItem = e.target.closest('.document-item');
      const docIndex = Array.from(documentList.children).indexOf(docItem);
      const doc = JSON.parse(localStorage.getItem('cachedDocuments'))[docIndex];
      
      if (doc) {
        showContextMenu(e.clientX, e.clientY, doc);
      }
    }
  });
  
  // Create and show context menu
  function showContextMenu(x, y, doc) {
    // Remove any existing context menus
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }
    
    // Create new context menu
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    
    menu.innerHTML = `
      <div class="menu-item" data-action="open">Open Document</div>
      <div class="menu-item" data-action="share">Share Document</div>
      <div class="menu-item" data-action="download">Download</div>
      <div class="menu-item danger" data-action="delete">Delete</div>
    `;
    
    // Add event listeners to menu items
    menu.addEventListener('click', function(e) {
      const action = e.target.dataset.action;
      if (action) {
        handleContextMenuAction(action, doc);
        menu.remove();
      }
    });
    
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    document.addEventListener('click', function closeMenu() {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    }, { once: true });
  }
  
  // Handle context menu actions
  function handleContextMenuAction(action, doc) {
    switch (action) {
      case 'open':
        openDocument(doc.id);
        break;
      case 'share':
        chrome.tabs.create({ url: `https://lovableproject.com/documents/${doc.id}/share` });
        break;
      case 'download':
        chrome.runtime.sendMessage({ 
          action: 'downloadDocument', 
          documentId: doc.id 
        });
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete "${doc.name}"?`)) {
          chrome.runtime.sendMessage({ 
            action: 'deleteDocument', 
            documentId: doc.id 
          }, function(response) {
            if (response && response.success) {
              loadData(); // Refresh the list
            }
          });
        }
        break;
    }
  }
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'documentsUpdated') {
      loadData();
    }
  });
  
  // Check for updates when extension opens
  chrome.runtime.sendMessage({ action: 'checkForUpdates' });
  
  // Initial load
  loadData();
  
  // Cache documents for context menu
  chrome.runtime.sendMessage({ action: 'getDocuments' }, function(response) {
    if (response && response.documents) {
      localStorage.setItem('cachedDocuments', JSON.stringify(response.documents));
    }
  });
});
