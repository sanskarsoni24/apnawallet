
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.aced323d171448b5848c325f61a279c4',
  appName: 'SurakshitLocker',
  webDir: 'dist',
  server: {
    url: 'https://aced323d-1714-48b5-848c-325f61a279c4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1e293b",
      showSpinner: true,
      spinnerColor: "#6366f1"
    }
  },
};

export default config;
