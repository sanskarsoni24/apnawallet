
type UserSettings = {
  theme?: 'light' | 'dark' | 'system';
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  voiceReminders?: boolean;
  reminderDays?: number;
  voiceType?: string;
  subscriptionPlan?: 'free' | 'premium' | 'enterprise';
  mobileDeviceName?: string;
};
