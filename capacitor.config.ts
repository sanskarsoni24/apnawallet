
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
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#171717",
      showSpinner: true,
      spinnerColor: "#5f5cff"
    }
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
      keystorePassword: null,
      keystoreAliasPassword: null,
      releaseType: "APK"
    }
  },
  ios: {
    contentInset: "always",
    scheme: "SurakshitLocker",
    backgroundColor: "#ffffff"
  }
};

export default config;
