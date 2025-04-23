
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
  
  // Recent documents
  recentDocuments?: string[];
  recentDocumentsMaxCount?: number;
  lastViewedDocument?: string;

  // Backup settings
  lastBackup?: string;
  lastBackupStatus?: 'success' | 'failed' | 'in-progress';
  backupSize?: number;
  backupEncrypted?: boolean;
  lastAutoBackupAttempt?: string;
  backupPassword?: string;
  
  // Extension settings
  extensionConnected?: boolean;
  extensionLastSync?: string;
  
  // Mobile settings
  mobileDeviceName?: string;
  googleEmail?: string;
  googleConnected?: boolean;

  allowDocumentSharing: boolean;
  defaultDocumentView: 'grid' | 'list' | 'calendar';
  biometricAuth?: {
    enabled: boolean;
    type: string;
    lastVerified?: string;
    requiredForSensitive?: boolean;
    faceIdEnabled?: boolean;
    fingerprintEnabled?: boolean;
  };
  recoveryKeys?: string[];
  recoveryKeyUsageHistory?: { key: string; date: string; success: boolean }[];
  recoveryKeyLastGenerated?: string;
  autoTagging: boolean;
  rememberSort: boolean;
  calendarStartDay: 0 | 1 | 6;
  reminders: {
    enabled: boolean;
    daysInAdvance: number[];
  };
  desktopAppInstalled?: boolean;
  desktopAppVersion?: string;
  desktopAppLastSync?: string;
  desktopNotifications?: boolean;
  desktopAutoStart?: boolean;
  desktopMinimizeToTray?: boolean;
  desktopKeepAwake?: boolean;
  desktopSyncFrequency?: 'realtime' | 'hourly' | 'daily';
  desktopDownloadPath?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  voiceReminders?: boolean;
  reminderDays?: number;
  voiceType?: string;
  displayName?: string;
  email?: string;
  isLoggedIn?: boolean;
  lastLogin?: string;
  subscriptionPlan?: 'free' | 'basic' | 'premium' | 'enterprise';
  documentLimit?: number;
  documentSizeLimit?: number;
  twoFactorEnabled?: boolean;
  recoveryEmail?: string;
  backupKeyCreated?: boolean;
  backupKeyLocation?: string;
  autoBackup?: boolean;
  cloudExportProviders?: string[];
  summary?: string;
}
