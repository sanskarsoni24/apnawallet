
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  userSettings: UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userSettings, setUserSettings] = useState<UserSettings>({
    theme: 'system',
    emailNotifications: true,
    pushNotifications: false,
    voiceReminders: false,
    reminderDays: 3,
    voiceType: 'default',
    subscriptionPlan: 'free',
    mobileDeviceName: undefined,
    googleConnected: false,
    googleEmail: undefined,
    googleProfilePicture: undefined,
    googleId: undefined,
    lastLoginMethod: undefined,
    defaultSharingPlatforms: ['email'],
    documentSummarization: true,
  });

  const updateUserSettings = (newSettings: Partial<UserSettings>) => {
    setUserSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <UserContext.Provider value={{ userSettings, updateUserSettings }}>
      {children}
    </UserContext.Provider>
  );
};
