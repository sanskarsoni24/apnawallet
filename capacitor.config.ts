
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
      spinnerColor: "#5f5cff"
    }
  },
  android: {
    buildOptions: {
      releaseType: "APK"
    }
  },
  ios: {
    contentInset: "always",
    scheme: "SurakshitLocker",
    backgroundColor: "#ffffff"
  },
  // Add permissions configuration for Android
  androidPermissions: {
    permissions: [
      "android.permission.INTERNET",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.REQUEST_INSTALL_PACKAGES",
      "android.permission.DOWNLOAD_WITHOUT_NOTIFICATION"
    ]
  }
};

export default config;
