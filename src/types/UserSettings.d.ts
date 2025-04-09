
type UserSettings = {
  theme?: 'light' | 'dark' | 'system';
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  voiceReminders?: boolean;
  reminderDays?: number;
  voiceType?: string;
  subscriptionPlan?: 'free' | 'premium' | 'enterprise';
  mobileDeviceName?: string;
  googleConnected?: boolean;
  googleEmail?: string;
  googleProfilePicture?: string;
  googleId?: string;
  lastLoginMethod?: 'password' | 'google';
};
