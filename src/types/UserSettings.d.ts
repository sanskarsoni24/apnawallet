
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
  biometricAuth?: {
    enabled: boolean;
    faceIdEnabled?: boolean;
    fingerprintEnabled?: boolean;
    lastVerified?: string;
  };
  // Added properties for Google integration
  googleEmail?: string;
  googleProfilePicture?: string;
  googleId?: string;
}
