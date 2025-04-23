
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Device } from '@capacitor/device';
import { PushNotifications } from '@capacitor/push-notifications';
import { Toast } from '@capacitor/toast';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Share } from '@capacitor/share';
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

// Check if app is running on mobile device
export const isMobileApp = async (): Promise<boolean> => {
  try {
    const info = await Device.getInfo();
    return info.platform !== 'web';
  } catch (error) {
    console.error('Error checking device platform:', error);
    return false;
  }
};

// Take photo using device camera
export const takePhoto = async (): Promise<string | null> => {
  try {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 90,
      width: 1000
    });

    if (!photo.webPath) {
      throw new Error('No photo path available');
    }

    return photo.webPath;
  } catch (error) {
    console.error('Error taking photo:', error);
    return null;
  }
};

// Save file to device
export const saveFile = async (
  data: string,
  fileName: string,
  mimeType: string
): Promise<string | null> => {
  try {
    const result = await Filesystem.writeFile({
      path: fileName,
      data: data,
      directory: Directory.Documents,
      recursive: true
    });
    
    return result.uri;
  } catch (error) {
    console.error('Error saving file:', error);
    return null;
  }
};

// Request push notification permissions
export const requestPushPermissions = async (): Promise<boolean> => {
  try {
    const result = await PushNotifications.requestPermissions();
    return result.receive === 'granted';
  } catch (error) {
    console.error('Error requesting push permissions:', error);
    return false;
  }
};

// Show toast message
export const showToast = async (message: string): Promise<void> => {
  try {
    await Toast.show({
      text: message,
      duration: 'short'
    });
  } catch (error) {
    console.error('Error showing toast:', error);
    // Fallback to browser alert for web
    alert(message);
  }
};

// Schedule local notification
export const scheduleNotification = async (
  id: number,
  title: string,
  body: string,
  triggerDate: Date
): Promise<void> => {
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          id,
          title,
          body,
          schedule: { at: triggerDate },
          sound: 'default',
          actionTypeId: '',
          extra: null
        }
      ]
    });
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

// Share content
export const shareContent = async (
  title: string,
  text: string,
  url?: string
): Promise<void> => {
  try {
    await Share.share({
      title,
      text,
      url,
      dialogTitle: 'Share with friends'
    });
  } catch (error) {
    console.error('Error sharing content:', error);
  }
};

// Hide splash screen
export const hideSplashScreen = async (): Promise<void> => {
  try {
    await SplashScreen.hide();
  } catch (error) {
    console.error('Error hiding splash screen:', error);
  }
};

// Vibrate device
export const vibrateDevice = async (style: ImpactStyle = ImpactStyle.Medium): Promise<void> => {
  try {
    await Haptics.impact({ style });
  } catch (error) {
    console.error('Error vibrating device:', error);
  }
};

// Get device info
export const getDeviceInfo = async (): Promise<any> => {
  try {
    const info = await Device.getInfo();
    return info;
  } catch (error) {
    console.error('Error getting device info:', error);
    return null;
  }
};

// Initialize mobile services
export const initMobileServices = async (): Promise<void> => {
  try {
    // Check if we're running on a mobile device
    const isMobile = await isMobileApp();
    if (!isMobile) return;

    // Register for push notifications
    await PushNotifications.register();
    
    // Add handler for push notifications
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token:', token.value);
    });
    
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on registration:', error);
    });
    
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received:', notification);
    });
    
    // Add handlers for app lifecycle events
    App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active?', isActive);
    });
    
    App.addListener('backButton', () => {
      console.log('Back button pressed');
    });
    
    // Hide splash screen with delay
    setTimeout(() => {
      hideSplashScreen();
    }, 2000);
    
  } catch (error) {
    console.error('Error initializing mobile services:', error);
  }
};
