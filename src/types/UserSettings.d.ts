
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
  };
  // Additional properties needed by the app
  subscriptionPlan?: string;
  documentLimit?: number;
  documentSizeLimit?: number;
  email?: string;
  cloudExportProviders?: string[];
  backupKeyCreated?: boolean;
  lastKeyBackup?: string;
}
