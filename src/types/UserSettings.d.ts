
interface UserSettings {
  id?: string;
  userId?: string;
  displayName?: string;
  email?: string;
  pushNotifications?: boolean;
  emailNotifications?: boolean;
  reminderDays?: number;
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  currency?: string;
  timezone?: string;
  dateFormat?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  subscriptionExpiry?: string;
  lastLogin?: string;
  mobileDeviceName?: string;
  mobileDeviceId?: string;
  mobileDeviceType?: string;
  notificationPreferences?: {
    documents?: boolean;
    accounts?: boolean;
    security?: boolean;
    expiry?: boolean;
    marketing?: boolean;
  };
  autoBackup?: boolean;
  backupFrequency?: number;
  lastBackup?: string;
  backupLocation?: string;
  createdAt?: string;
  updatedAt?: string;
}
