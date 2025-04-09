
import { isPlatform } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { App } from '@capacitor/app';
import { Device } from '@capacitor/device';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { toast } from '@/hooks/use-toast';

/**
 * Utility to check if running on mobile device via Capacitor
 */
export const isMobileApp = (): boolean => {
  return isPlatform('ios') || isPlatform('android');
};

/**
 * Initialize mobile-specific functionality
 */
export const initMobileApp = async (): Promise<void> => {
  if (!isMobileApp()) return;

  // Set up back button handling
  App.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
      App.exitApp();
    } else {
      window.history.back();
    }
  });

  // Get device info
  try {
    const info = await Device.getInfo();
    console.log('Running on:', info.platform, info.operatingSystem);
    
    // Store device info in localStorage for analytics
    localStorage.setItem('device_info', JSON.stringify({
      platform: info.platform,
      osVersion: info.osVersion,
      model: info.model,
      webViewVersion: info.webViewVersion
    }));
  } catch (err) {
    console.error('Error getting device info', err);
  }
};

/**
 * Initialize push notifications for mobile
 */
export const initPushNotifications = async (): Promise<void> => {
  if (!isMobileApp()) return;

  try {
    // Request permission
    const permission = await PushNotifications.requestPermissions();
    
    if (permission.receive === 'granted') {
      // Register with FCM/APNS
      await PushNotifications.register();
      
      // Setup notification handlers
      PushNotifications.addListener('registration', (token) => {
        // Send token to your server
        console.log('Push registration token:', token.value);
        localStorage.setItem('push_token', token.value);
      });
      
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        // Show notification while app is open
        toast({
          title: notification.title || 'New Notification',
          description: notification.body || 'You have a new notification',
        });
      });
      
      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        // Handle notification click
        if (notification.notification?.data?.documentId) {
          // Navigate to specific document
          window.location.href = `/documents?doc=${notification.notification.data.documentId}`;
        }
      });
    }
  } catch (err) {
    console.error('Error setting up push notifications:', err);
  }
};

/**
 * Save a document for offline access
 */
export const saveDocumentOffline = async (document: any): Promise<boolean> => {
  if (!isMobileApp()) return false;
  
  try {
    // Save document metadata
    await Filesystem.writeFile({
      path: `documents/${document.id}.json`,
      data: JSON.stringify(document),
      directory: Directory.Documents,
      recursive: true
    });
    
    toast({
      title: 'Document Saved Offline',
      description: 'This document is now available offline',
    });
    
    return true;
  } catch (err) {
    console.error('Error saving document offline:', err);
    return false;
  }
};

/**
 * Get all offline documents
 */
export const getOfflineDocuments = async (): Promise<any[]> => {
  if (!isMobileApp()) return [];
  
  try {
    const result = await Filesystem.readdir({
      path: 'documents',
      directory: Directory.Documents
    });
    
    const documents = [];
    for (const file of result.files) {
      if (file.name.endsWith('.json')) {
        const content = await Filesystem.readFile({
          path: `documents/${file.name}`,
          directory: Directory.Documents
        });
        
        documents.push(JSON.parse(content.data));
      }
    }
    
    return documents;
  } catch (err) {
    console.error('Error reading offline documents:', err);
    return [];
  }
};

/**
 * Delete an offline document
 */
export const deleteOfflineDocument = async (documentId: string): Promise<boolean> => {
  if (!isMobileApp()) return false;
  
  try {
    await Filesystem.deleteFile({
      path: `documents/${documentId}.json`,
      directory: Directory.Documents
    });
    
    return true;
  } catch (err) {
    console.error('Error deleting offline document:', err);
    return false;
  }
};

/**
 * Check if the app needs to update
 */
export const checkAppUpdate = async (): Promise<{hasUpdate: boolean, updateUrl?: string}> => {
  if (!isMobileApp()) return { hasUpdate: false };
  
  try {
    const appInfo = await App.getInfo();
    
    // In a real app, you'd check against a server endpoint
    // This is a simplified example
    const serverCheck = await fetch('https://api.example.com/app-version-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: appInfo.version,
        build: appInfo.build,
        platform: (await Device.getInfo()).platform
      })
    });
    
    const result = await serverCheck.json();
    return {
      hasUpdate: result.hasUpdate,
      updateUrl: result.updateUrl
    };
  } catch (err) {
    console.error('Error checking for updates:', err);
    return { hasUpdate: false };
  }
};
