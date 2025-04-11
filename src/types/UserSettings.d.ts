
declare interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  language: string;
  timezone: string;
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
  lastBackup?: string;
  lastKeyBackup?: string;
  twoFactorEnabled: boolean;
  lastLoginMethod?: 'email' | 'google' | 'apple' | 'password';
  accountRecoveryEmail?: string;
  recoveryCodesGenerated?: boolean;
  recoveryCodesUsed?: number;
  lastLogin?: string;
  loginCount?: number;
  deviceHistory?: Array<any>;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  phoneNumber?: string;
  appNotificationsChannel?: 'all' | 'important' | 'none';
  documentReminders?: boolean;
  customReminderDefaults?: {
    days: number;
    enabled: boolean;
  };
  useSpeechSynthesis?: boolean;
  documentVoicePreview?: boolean;
  defaultDocumentPrivacy?: 'private' | 'shared' | 'public';
  defaultDocumentImportance?: 'low' | 'medium' | 'high' | 'critical';
  showDocumentOnCalendar?: boolean;
  dashboardView?: 'grid' | 'list' | 'timeline';
  recentSearches?: string[];
  favoriteCategories?: string[];
  importantDatesCalendarSync?: boolean;
  autoTagDocuments?: boolean;
  compactView?: boolean;
  documentSortOrder?: 'name' | 'date' | 'type' | 'importance';
  documentGrouping?: 'none' | 'category' | 'type' | 'importance';
  
  // Biometric authentication
  biometricAuth?: {
    enabled: boolean;
    faceIdEnabled?: boolean;
    fingerprintEnabled?: boolean;
    lastVerified?: string;
  };
  
  // Google integration properties
  googleEmail?: string;
  googleProfilePicture?: string;
  googleId?: string;
  googleConnected?: boolean;
  
  // Backup functionality
  backupEncrypted?: boolean;
  backupLocations?: ('local' | 'cloud' | 'external')[];
  backupPassword?: string;
  backupSize?: number;
  lastBackupStatus?: 'success' | 'failed' | 'pending';
  lastAutoBackupAttempt?: string;
  backupRetentionCount?: number;
  
  // Recovery keys
  recoveryKeys?: string[];
  recoveryKeyLastGenerated?: string;
  recoveryKeyUsageHistory?: {date: string, keyId: string}[];
  
  // Recent documents tracking
  recentDocuments?: string[];
  recentDocumentsMaxCount?: number;
  lastViewedDocument?: string;
  
  // Mobile device integration
  mobileDeviceName?: string;
  
  // PDF editing tools settings
  pdfMergeHistory?: string[];
  pdfSplitHistory?: string[];
  pdfSignaturePresets?: {name: string, image: string}[];
  pdfEditingPreferences?: {
    defaultPageSize: string;
    defaultOrientation: 'portrait' | 'landscape';
  };
  
  // Subscription information
  subscriptionPlan?: 'free' | 'basic' | 'premium' | 'enterprise';
  documentLimit?: number;
  documentSizeLimit?: number;
  
  // Voice settings
  voiceReminders?: boolean;
  reminderDays?: number;
  voiceType?: string;
}
