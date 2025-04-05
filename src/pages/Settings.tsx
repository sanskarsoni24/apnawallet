
import React, { useState, useEffect } from "react";
import Container from "@/components/layout/Container";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import AccountSettings from "@/components/settings/AccountSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import ChromeExtensionDownload from "@/components/settings/ChromeExtensionDownload";

const Settings = () => {
  const { displayName, email, updateProfile, userSettings, updateUserSettings } = useUser();
  const [localDisplayName, setLocalDisplayName] = useState(displayName || "");
  const [localEmail, setLocalEmail] = useState(email || "");
  const [theme, setTheme] = useState(userSettings.theme || "light");
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: userSettings.emailNotifications !== false,
    pushNotifications: userSettings.pushNotifications || false,
    voiceReminders: userSettings.voiceReminders || false,
    reminderDays: userSettings.reminderDays || 3,
    voiceType: userSettings.voiceType || "default"
  });

  // Load settings from localStorage on initial render
  useEffect(() => {
    setLocalDisplayName(displayName || "");
    setLocalEmail(email || "");
    setTheme(userSettings.theme || "light");
    setNotificationSettings({
      emailNotifications: userSettings.emailNotifications !== false,
      pushNotifications: userSettings.pushNotifications || false,
      voiceReminders: userSettings.voiceReminders || false,
      reminderDays: userSettings.reminderDays || 3,
      voiceType: userSettings.voiceType || "default"
    });
  }, [displayName, email, userSettings]);

  // Apply theme to document
  const applyTheme = (selectedTheme: string) => {
    document.documentElement.classList.remove("light", "dark");
    if (selectedTheme === "system") {
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.add(isDarkMode ? "dark" : "light");
    } else {
      document.documentElement.classList.add(selectedTheme);
    }
  };

  // Save account settings
  const saveAccountSettings = () => {
    // Update context state
    updateProfile(localDisplayName, localEmail);
    
    toast({
      title: "Settings saved",
      description: "Your account settings have been updated successfully."
    });
  };

  // Save notification settings
  const saveNotificationSettings = (settings: any) => {
    setNotificationSettings(settings);
    
    // Update user settings in context
    updateUserSettings({
      emailNotifications: settings.emailNotifications,
      pushNotifications: settings.pushNotifications,
      voiceReminders: settings.voiceReminders,
      reminderDays: settings.reminderDays,
      voiceType: settings.voiceType
    });
    
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved."
    });
  };

  // Save theme setting
  const saveTheme = (selectedTheme: string) => {
    setTheme(selectedTheme);
    
    // Update user settings in context
    updateUserSettings({
      theme: selectedTheme
    });
    
    // Apply theme to document
    applyTheme(selectedTheme);
    
    toast({
      title: "Theme updated",
      description: `Application theme set to ${selectedTheme}.`
    });
  };

  return (
    <Container>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your preferences and account settings.
          </p>
        </div>
        
        {/* Chrome Extension Download */}
        <ChromeExtensionDownload />
        
        <div className="grid gap-6 md:grid-cols-2">
          <AccountSettings 
            localDisplayName={localDisplayName}
            setLocalDisplayName={setLocalDisplayName}
            localEmail={localEmail}
            setLocalEmail={setLocalEmail}
            saveAccountSettings={saveAccountSettings}
          />
          
          <NotificationSettings 
            settings={notificationSettings}
            saveSettings={saveNotificationSettings}
          />
          
          <AppearanceSettings theme={theme} saveTheme={saveTheme} />
        </div>
      </div>
    </Container>
  );
};

export default Settings;
