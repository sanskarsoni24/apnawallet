
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.surakshitlocker.secure',
  appName: 'SurakshitLocker',
  webDir: 'dist',
  server: {
    url: 'https://aced323d-1714-48b5-848c-325f61a279c4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#171717",
      showSpinner: true,
      spinnerColor: "#5f5cff",
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small"
    },
    CapacitorUpdater: {
      autoUpdate: true
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    LocalNotifications: {
      smallIcon: "ic_stat_document",
      iconColor: "#5f5cff"
    },
    CapacitorHttp: {
      enabled: true
    },
    App: {
      appId: "app.surakshitlocker.secure",
      appName: "SurakshitLocker",
      webDir: "dist",
      bundledWebRuntime: false,
      backgroundColor: "#171717" 
    }
  },
  android: {
    buildOptions: {
      releaseType: "APK"
    },
    backgroundColor: "#171717",
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  ios: {
    contentInset: "always",
    scheme: "SurakshitLocker",
    backgroundColor: "#171717",
    preferredContentMode: "mobile"
  },
  // Add permissions configuration for Android
  androidPermissions: {
    permissions: [
      "android.permission.INTERNET",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.REQUEST_INSTALL_PACKAGES",
      "android.permission.DOWNLOAD_WITHOUT_NOTIFICATION",
      "android.permission.CAMERA",
      "android.permission.RECORD_AUDIO",
      "android.permission.MODIFY_AUDIO_SETTINGS",
      "android.permission.VIBRATE",
      "android.permission.RECEIVE_BOOT_COMPLETED"
    ]
  }
};

export default config;
