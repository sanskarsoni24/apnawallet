
/**
 * This utility helps detect and interact with the Chrome extension
 */

// Define extension detection function
export const detectExtension = (): boolean => {
  return typeof window.__DOCU_NINJA_EXTENSION__ !== 'undefined';
};

// Function to check if extension is connected
export const isExtensionConnected = (): boolean => {
  return localStorage.getItem('extensionConnected') === 'true';
};

// Function to get last sync time
export const getLastExtensionSync = (): string | null => {
  try {
    const syncData = localStorage.getItem('extensionSyncData');
    if (syncData) {
      return JSON.parse(syncData).lastSync;
    }
  } catch (e) {
    console.error('Error parsing extension sync data:', e);
  }
  return null;
};

// Function to manually sync with extension
export const syncWithExtension = (): { success: boolean, error?: string } => {
  try {
    if (typeof window.__DOCU_NINJA_EXTENSION__ !== 'undefined' && 
        typeof window.__DOCU_NINJA_EXTENSION__.syncWithWebApp === 'function') {
      return window.__DOCU_NINJA_EXTENSION__.syncWithWebApp();
    }
    
    // If direct function call is not available, try window function
    if (typeof window.syncWithExtension === 'function') {
      return window.syncWithExtension();
    }
    
    // If no extension functions are available, trigger a custom event
    const event = new CustomEvent('DocuNinjaSync', {
      detail: { timestamp: new Date().toISOString() }
    });
    document.dispatchEvent(event);
    
    // Create a manual data sync for demo purposes
    const userData = {
      userId: localStorage.getItem("userId") || "demo-user",
      userEmail: localStorage.getItem("userEmail") || "demo@example.com",
      documents: JSON.parse(localStorage.getItem("documents") || "[]"),
      userSettings: JSON.parse(localStorage.getItem("userSettings") || "{}")
    };
    
    localStorage.setItem("extensionSyncData", JSON.stringify({
      lastSync: new Date().toISOString(),
      syncedData: userData
    }));
    
    return { success: true };
  } catch (e) {
    console.error('Error syncing with extension:', e);
    return { success: false, error: e.toString() };
  }
};

// Add type declarations for global window object
declare global {
  interface Window {
    __DOCU_NINJA_EXTENSION__?: {
      isConnected: boolean;
      version: string;
      connect: (userData: any) => { success: boolean };
      disconnect: () => { success: boolean };
      syncWithWebApp: () => { success: boolean, error?: string };
      isExtensionConnected: () => boolean;
    };
    syncWithExtension?: () => { success: boolean, error?: string };
    checkExtensionStatus?: () => {
      installed: boolean;
      connected: boolean;
      lastSync: string | null;
    };
  }
}
