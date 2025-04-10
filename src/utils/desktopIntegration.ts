
/**
 * Desktop integration utilities for Electron environment
 * These utilities provide a safe way to interact with Electron's APIs
 */

// Check if running in Electron
export const isElectron = (): boolean => {
  return window.navigator.userAgent.includes('Electron');
};

// Safe wrapper for IPC communication with the main process
export const callDesktopApi = async (channel: string, data?: any): Promise<any> => {
  if (!isElectron()) {
    console.warn('Desktop API call attempted in non-desktop environment');
    return null;
  }
  
  // @ts-ignore - Electron APIs will be available at runtime in Electron environment
  const electron = window.electron;
  
  if (!electron || !electron.ipcRenderer) {
    console.error('Electron IPC not available');
    return null;
  }
  
  try {
    return await electron.ipcRenderer.invoke(channel, data);
  } catch (error) {
    console.error(`Error calling desktop API ${channel}:`, error);
    throw error;
  }
};

// Desktop biometric authentication
export const authenticateWithBiometrics = async (): Promise<boolean> => {
  if (!isElectron()) {
    console.warn('Biometric authentication attempted in non-desktop environment');
    return false;
  }
  
  try {
    const result = await callDesktopApi('auth:biometric');
    return result?.success === true;
  } catch (error) {
    console.error('Biometric authentication failed:', error);
    return false;
  }
};

// Check if biometric authentication is available
export const isBiometricAvailable = async (): Promise<boolean> => {
  if (!isElectron()) return false;
  
  try {
    const result = await callDesktopApi('auth:biometric:available');
    return result?.available === true;
  } catch (error) {
    console.error('Error checking biometric availability:', error);
    return false;
  }
};

// Get offline documents
export const getOfflineDocuments = async (): Promise<any[]> => {
  if (!isElectron()) return [];
  
  try {
    const result = await callDesktopApi('documents:offline:get');
    return result?.documents || [];
  } catch (error) {
    console.error('Error fetching offline documents:', error);
    return [];
  }
};

// Save document for offline access
export const saveDocumentOffline = async (document: any): Promise<boolean> => {
  if (!isElectron()) return false;
  
  try {
    const result = await callDesktopApi('documents:offline:save', { document });
    return result?.success === true;
  } catch (error) {
    console.error('Error saving document offline:', error);
    return false;
  }
};

// Show desktop notification
export const showDesktopNotification = (title: string, body: string, options?: any): void => {
  if (!isElectron()) return;
  
  callDesktopApi('notification:show', { title, body, ...options });
};

// Check for desktop app updates
export const checkForUpdates = async (): Promise<{available: boolean, version?: string}> => {
  if (!isElectron()) return { available: false };
  
  try {
    return await callDesktopApi('app:check-updates');
  } catch (error) {
    console.error('Error checking for updates:', error);
    return { available: false };
  }
};

// Get system information for desktop app
export const getSystemInfo = async (): Promise<any> => {
  if (!isElectron()) return {};
  
  try {
    return await callDesktopApi('system:info');
  } catch (error) {
    console.error('Error getting system information:', error);
    return {};
  }
};
