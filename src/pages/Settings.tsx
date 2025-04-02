
import React, { useState, useEffect } from "react";
import Container from "@/components/layout/Container";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import AccountSettings from "@/components/settings/AccountSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";

const Settings = () => {
  const { displayName, email, updateProfile, userSettings } = useUser();
  const [localDisplayName, setLocalDisplayName] = useState(displayName);
  const [localEmail, setLocalEmail] = useState(email);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [voiceReminders, setVoiceReminders] = useState(false);
  const [reminderFrequency, setReminderFrequency] = useState("1 day before");
  const [theme, setTheme] = useState("light");
  const [notificationPermission, setNotificationPermission] = useState("default");

  // Load settings from localStorage on initial render
  useEffect(() => {
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setLocalDisplayName(settings.displayName || displayName);
        setLocalEmail(settings.email || email);
        setEmailNotifications(settings.emailNotifications !== false);
        setPushNotifications(settings.pushNotifications || false);
        setVoiceReminders(settings.voiceReminders || false);
        
        // Handle reminder days setting
        const reminderDays = settings.reminderDays || 1;
        setReminderFrequency(`${reminderDays} day${reminderDays > 1 ? 's' : ''} before`);
        
        setTheme(settings.theme || "light");
      } catch (e) {
        console.error("Failed to parse saved settings:", e);
      }
    }
    
    // Check current notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, [displayName, email, userSettings]);

  // Save account settings
  const saveAccountSettings = () => {
    // Update context state
    updateProfile(localDisplayName, localEmail);
    
    // Save to localStorage
    const existingSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
    localStorage.setItem("userSettings", JSON.stringify({
      ...existingSettings,
      displayName: localDisplayName,
      email: localEmail
    }));
    
    toast({
      title: "Settings saved",
      description: "Your account settings have been updated successfully."
    });
  };

  // Save notification settings
  const saveNotificationSettings = (key: string, value: any) => {
    // Save to localStorage
    const existingSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
    const updatedSettings = {
      ...existingSettings,
      [key]: value
    };
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
    
    toast({
      title: "Settings updated",
      description: `Your ${key} setting has been updated.`
    });
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Push Notifications Unavailable",
        description: "Your browser doesn't support push notifications.",
        variant: "destructive"
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        setPushNotifications(true);
        saveNotificationSettings("pushNotifications", true);
        
        // Send a test notification
        new Notification("DocuNinja Notifications", {
          body: "You have successfully enabled push notifications!",
          icon: "/favicon.ico"
        });
      } else {
        setPushNotifications(false);
        saveNotificationSettings("pushNotifications", false);
        
        toast({
          title: "Permission Denied",
          description: "You need to allow notifications in your browser settings.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast({
        title: "Error",
        description: "There was an error enabling push notifications.",
        variant: "destructive"
      });
    }
  };

  // Save theme setting
  const saveTheme = (selectedTheme: string) => {
    setTheme(selectedTheme);
    
    // Save to localStorage
    const existingSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
    localStorage.setItem("userSettings", JSON.stringify({
      ...existingSettings,
      theme: selectedTheme
    }));
    
    // Apply theme to document
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(selectedTheme === "system" 
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") 
      : selectedTheme);
    
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
        
        <div className="grid gap-6 md:grid-cols-2">
          <AccountSettings 
            localDisplayName={localDisplayName}
            setLocalDisplayName={setLocalDisplayName}
            localEmail={localEmail}
            setLocalEmail={setLocalEmail}
            saveAccountSettings={saveAccountSettings}
          />
          
          <NotificationSettings 
            emailNotifications={emailNotifications}
            setEmailNotifications={setEmailNotifications}
            pushNotifications={pushNotifications}
            setPushNotifications={setPushNotifications}
            voiceReminders={voiceReminders}
            setVoiceReminders={setVoiceReminders}
            reminderFrequency={reminderFrequency}
            setReminderFrequency={setReminderFrequency}
            notificationPermission={notificationPermission}
            requestNotificationPermission={requestNotificationPermission}
            saveNotificationSettings={saveNotificationSettings}
          />
          
          <AppearanceSettings theme={theme} saveTheme={saveTheme} />
        </div>
      </div>
    </Container>
  );
};

export default Settings;
