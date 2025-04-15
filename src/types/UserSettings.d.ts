
interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  emailFrequency: 'daily' | 'weekly' | 'immediately';
  backupEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  lastKeyBackup?: string;
  lastBackup?: string;
  lastBackupStatus?: 'success' | 'failed' | 'in-progress';
  backupSize?: number;
  backupEncrypted?: boolean;
  lastAutoBackupAttempt?: string;
  documentCategoriesOrder: string[];
  customCategories: {
    id: string;
    name: string;
    color: string;
    icon: string;
  }[];
  documentOrder: 'name' | 'date' | 'category' | 'custom';
  showDocumentTags: boolean;
  showDocumentDates: boolean;
  adminNotifications: boolean;
  securityLevel: 'standard' | 'enhanced' | 'maximum';
  twoFactorAuth: boolean;
  autoLogoutTime: number;
  autoLockVault: boolean;
  recentDocuments?: string[];
  recentDocumentsMaxCount?: number;
  allowDocumentSharing: boolean;
  defaultDocumentView: 'grid' | 'list' | 'calendar';
  biometricAuth?: {
    enabled: boolean;
    type: string;
    lastVerified?: string;
    requiredForSensitive?: boolean;
  };
  recoveryKeys?: string[];
  recoveryKeyUsageHistory?: { key: string; date: string; success: boolean }[];
  backupPassword?: string;
  extensionConnected?: boolean;
  extensionLastSync?: string;
  autoTagging: boolean;
  rememberSort: boolean;
  calendarStartDay: 0 | 1 | 6;
  reminders: {
    enabled: boolean;
    daysInAdvance: number[];
  };
  googleEmail?: string;
  desktopAppInstalled?: boolean;
  desktopAppVersion?: string;
  desktopAppLastSync?: string;
  desktopNotifications?: boolean;
  desktopAutoStart?: boolean;
  desktopMinimizeToTray?: boolean;
  desktopKeepAwake?: boolean;
  desktopSyncFrequency?: 'realtime' | 'hourly' | 'daily';
  desktopDownloadPath?: string;
  recoveryKeyLastGenerated?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  voiceReminders?: boolean;
  reminderDays?: number;
  voiceType?: string;
}
