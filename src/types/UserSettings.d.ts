
declare interface UserSettings {
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  pushNotifications: boolean;
  voiceReminders: boolean;
  reminderDays: number;
  twoFactorEnabled: boolean;
  autoBackup: boolean;
  backupFrequency: "daily" | "weekly" | "monthly" | "never";
  lastBackupDate?: string;
  sharePreferences: {
    defaultExpiry: number;
    requirePassword: boolean;
  };
  googleEmail?: string;
  googleProfilePicture?: string;
  googleId?: string;
  lastLoginMethod?: string;
  mobileDeviceName?: string;
  voiceType?: "default" | "male" | "female";
  biometricAuth?: {
    enabled: boolean;
    faceIdEnabled: boolean;
    fingerprintEnabled: boolean;
    lastVerified?: string;
  };
}
