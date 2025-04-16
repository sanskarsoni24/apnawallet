
declare interface UserSettings {
  id: string;
  userId: string;
  theme: "light" | "dark" | "system";
  fontSize: "small" | "medium" | "large";
  colorMode: "default" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";
  notificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  emailFrequency: "instant" | "daily" | "weekly";
  pushNotificationsEnabled: boolean;
  timezone: string;
  language: string;
  dateFormat: string;
  defaultReminderDays: number;
  recentDocuments?: string[];
  recentDocumentsMaxCount?: number;
  biometricAuth?: {
    enabled: boolean;
    lastAuthenticated?: string;
    preferFaceID?: boolean;
  };
  extensionConnected?: boolean;
  extensionLastSync?: string;
  lastBackup?: string;
  lastKeyBackup?: string;
  lastBackupStatus?: "success" | "failed" | "in_progress";
  backupSize?: number;
  backupPassword?: string;
  backupEncrypted?: boolean;
  lastAutoBackupAttempt?: string;
  recoveryKeys?: string[];
  recoveryKeyUsageHistory?: {
    keyId: string;
    usedAt: string;
    ipAddress: string;
    deviceInfo: string;
  }[];
  googleEmail?: string;
}
