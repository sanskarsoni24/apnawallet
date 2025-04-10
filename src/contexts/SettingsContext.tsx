
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<UserSettings>({
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

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
