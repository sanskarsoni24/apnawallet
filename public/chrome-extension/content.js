
// Content script for SurakshitLocker Chrome Extension

// Listen for messages from the extension
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // Get data from localStorage when requested
  if (message.action === "getLocalStorage") {
    try {
      const documents = JSON.parse(localStorage.getItem("documents") || "[]");
      const userSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
      const userEmail = localStorage.getItem("userEmail") || "";
      sendResponse({documents, userSettings, userEmail});
    } catch (e) {
      console.error("Error accessing localStorage:", e);
      sendResponse({error: e.toString()});
    }
    return true; // Keep the messaging channel open for async response
  }

  // Watch for file downloads and detect document types
  if (message.action === "analyzeDownload") {
    try {
      analyzeDocument(message.fileData)
        .then(result => sendResponse(result))
        .catch(error => sendResponse({error: error.toString()}));
      return true; // Keep the messaging channel open for async response
    } catch (e) {
      sendResponse({error: e.toString()});
      return true;
    }
  }
});

// Document type detection patterns
const documentPatterns = {
  invoice: [/invoice/i, /bill/i, /payment/i, /due/i, /amount/i, /tax/i, /receipt/i],
  insurance: [/insurance/i, /policy/i, /coverage/i, /premium/i, /claim/i],
  license: [/license/i, /permit/i, /certification/i, /registry/i, /registration/i],
  personalId: [/passport/i, /driver['']?s? license/i, /id card/i, /identification/i, /aadhar/i],
  medical: [/medical/i, /health/i, /doctor/i, /prescription/i, /hospital/i, /clinic/i]
};

// Check text content for due dates and document type
async function analyzeDocument(fileData) {
  // For the demo, we're implementing pattern matching. In a real app, you'd use AI or more sophisticated parsing.
  const text = fileData.textContent || '';
  const fileName = fileData.name || '';
  const fileType = fileData.type || '';
  
  // Detect document type
  let detectedType = 'Document';
  const matchTypes = Object.keys(documentPatterns);
  
  for (const type of matchTypes) {
    const patterns = documentPatterns[type];
    if (patterns.some(pattern => pattern.test(text) || pattern.test(fileName))) {
      detectedType = type.charAt(0).toUpperCase() + type.slice(1);
      break;
    }
  }
  
  // Try to find due dates in text
  const dueDatePatterns = [
    /due\s+(?:date|by|on)?:?\s*(\d{1,2}[-./]\d{1,2}[-./]\d{2,4})/i,
    /expir(?:es|y)\s+(?:date|on)?:?\s*(\d{1,2}[-./]\d{1,2}[-./]\d{2,4})/i,
    /valid until:?\s*(\d{1,2}[-./]\d{1,2}[-./]\d{2,4})/i,
    /payment due:?\s*(\d{1,2}[-./]\d{1,2}[-./]\d{2,4})/i,
    /renewal(?:\s+date)?:?\s*(\d{1,2}[-./]\d{1,2}[-./]\d{2,4})/i
  ];
  
  let dueDate = null;
  
  for (const pattern of dueDatePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      // Attempt to parse the matched date
      const dateParts = match[1].split(/[-./]/);
      if (dateParts.length === 3) {
        // Adjust for different date formats (MM/DD/YYYY or DD/MM/YYYY)
        // For simplicity, we'll assume MM/DD/YYYY here
        const month = parseInt(dateParts[0], 10) - 1;
        const day = parseInt(dateParts[1], 10);
        let year = parseInt(dateParts[2], 10);
        
        // Handle 2-digit years
        if (year < 100) {
          year += 2000;
        }
        
        const parsedDate = new Date(year, month, day);
        if (!isNaN(parsedDate.getTime())) {
          dueDate = parsedDate.toISOString();
          break;
        }
      }
    }
  }
  
  // Calculate days remaining if due date is found
  let daysRemaining = null;
  if (dueDate) {
    const today = new Date();
    const dueDateTime = new Date(dueDate);
    const timeDiff = dueDateTime.getTime() - today.getTime();
    daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  
  return {
    documentInfo: {
      title: fileName,
      type: detectedType,
      dueDate: dueDate ? new Date(dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null,
      daysRemaining: daysRemaining,
      description: `Auto-detected ${detectedType}`,
      fileType: fileName.split('.').pop()?.toLowerCase()
    },
    success: true
  };
}

// Watch for document downloads
document.addEventListener('DOMContentLoaded', function() {
  // We can't directly intercept downloads in content scripts
  // But we can watch for specific download actions in the web app
  console.log('SurakshitLocker content script initialized');
});

// Notify the background script that the content script is loaded
chrome.runtime.sendMessage({ action: 'contentScriptLoaded' });
