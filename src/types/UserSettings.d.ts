
declare interface UserSettings {
  displayName?: string;
  email?: string;
  isLoggedIn?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  voiceReminders?: boolean;
  reminderDays?: number;
  theme?: string;
  lastLogin?: string;
  voiceType?: string;
  subscriptionPlan?: 'free' | 'basic' | 'premium' | 'enterprise';
  documentLimit?: number;
  documentSizeLimit?: number;
  twoFactorEnabled?: boolean;
  recoveryEmail?: string;
  backupKeyCreated?: boolean;
  backupKeyLocation?: string;
  lastKeyBackup?: string;
  autoBackup?: boolean;
  backupFrequency?: string;
  cloudExportProviders?: string[];
  mobileDeviceName?: string;
  googleConnected?: boolean;
  biometricAuth?: {
    enabled: boolean;
    type?: 'fingerprint' | 'face' | 'pin' | 'pattern';
    lastVerified?: string;
    registeredDevices?: string[];
    failedAttempts?: number;
    locked?: boolean;
  };
}
