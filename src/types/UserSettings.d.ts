
interface UserSettings {
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  pushNotifications: boolean;
  voiceReminders: boolean;
  reminderDays: number;
  twoFactorEnabled: boolean;
  autoBackup: boolean;
  backupFrequency: "daily" | "weekly" | "monthly" | "never";
  sharePreferences: {
    defaultExpiry: number;
    requirePassword: boolean;
  };
  biometricAuth: {
    enabled: boolean;
    faceIdEnabled: boolean;
    fingerprintEnabled: boolean;
    lastVerified?: string;
  };
  // Additional properties needed by the app
  subscriptionPlan?: string;
  documentLimit?: number;
  documentSizeLimit?: number;
  email?: string;
  cloudExportProviders?: string[];
  backupKeyCreated?: boolean;
  lastKeyBackup?: string;
  
  // Mobile integration properties
  mobileDeviceName?: string;
  
  // Google integration properties
  googleEmail?: string;
  googleProfilePicture?: string;
  googleId?: string;
  googleConnected?: boolean;
  lastLoginMethod?: string;
  
  // Voice settings
  voiceType?: string;
}
