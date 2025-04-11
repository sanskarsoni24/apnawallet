
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
  
  // Recent documents tracking
  recentDocuments?: string[];
  recentDocumentsMaxCount?: number;
  lastViewedDocument?: string;
  
  // Biometric authentication
  biometricAuth?: {
    enabled: boolean;
    faceIdEnabled?: boolean;
    fingerprintEnabled?: boolean;
    lastVerified?: string;
  };
  
  // Google integration
  googleEmail?: string;
  googleProfilePicture?: string;
  googleId?: string;
  
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
  
  // PDF settings
  defaultPdfView?: 'single' | 'double' | 'continuous';
  pdfTextSelection?: boolean;
  pdfAnnotationEnabled?: boolean;
  pdfDefaultZoom?: number;
  pdfHighlightColor?: string;
  pdfRememberLastPage?: boolean;
  pdfShowThumbnails?: boolean;
  
  // Mobile app settings
  mobileDeviceName?: string;
  lastKeyBackup?: string;
}
