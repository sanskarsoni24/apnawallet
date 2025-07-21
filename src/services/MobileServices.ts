// Mobile Services with mock implementations for web development
// Install and uncomment Capacitor imports when building for mobile

// Mock implementations that work in the browser
export const isMobileApp = async (): Promise<boolean> => {
  return false; // Always false for web version
};

export const takePhoto = async (): Promise<string | null> => {
  console.log('Camera functionality - install @capacitor/camera for mobile');
  return null;
};

export const saveFile = async (
  data: string,
  fileName: string,
  mimeType: string
): Promise<string | null> => {
  console.log('File save functionality - install @capacitor/filesystem for mobile');
  return null;
};

export const requestPushPermissions = async (): Promise<boolean> => {
  console.log('Push notification permissions - install @capacitor/push-notifications for mobile');
  return false;
};

export const showToast = async (message: string): Promise<void> => {
  console.log('Toast message:', message);
  // Fallback to browser notification for web
  if ('Notification' in window) {
    new Notification('Mark-25', { body: message });
  }
};

export const scheduleNotification = async (
  id: number,
  title: string,
  body: string,
  triggerDate: Date
): Promise<void> => {
  console.log('Schedule notification:', { id, title, body, triggerDate });
};

export const shareContent = async (
  title: string,
  text: string,
  url?: string
): Promise<void> => {
  console.log('Share content:', { title, text, url });
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
    } catch (error) {
      console.log('Share cancelled or failed');
    }
  }
};

export const hideSplashScreen = async (): Promise<void> => {
  console.log('Hide splash screen - install @capacitor/splash-screen for mobile');
};

export const vibrateDevice = async (): Promise<void> => {
  console.log('Vibrate device - install @capacitor/haptics for mobile');
  if (navigator.vibrate) {
    navigator.vibrate(200);
  }
};

export const getDeviceInfo = async (): Promise<any> => {
  return {
    platform: 'web',
    model: 'Browser',
    operatingSystem: 'web',
    osVersion: 'unknown',
    manufacturer: 'Browser',
    isVirtual: false
  };
};

export const initMobileServices = async (): Promise<void> => {
  console.log('Mobile services initialized for web development');
  console.log('Install Capacitor plugins when building for mobile');
};