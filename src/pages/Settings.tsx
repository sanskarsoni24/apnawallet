
import React, { useState, useEffect } from "react";
import Container from "@/components/layout/Container";
import AccountSettings from "@/components/settings/AccountSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import ChromeExtensionDownload from "@/components/settings/ChromeExtensionDownload";
import SurakshaLocker from "@/components/suraksha/SurakshaLocker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Shield, Bell, Palette, User, Chrome, Lock } from "lucide-react";

const Settings = () => {
  const [currentTab, setCurrentTab] = useState("account");
  const { email, displayName, userSettings, updateUserSettings, updateProfile } = useUser();
  
  // Account settings state
  const [localDisplayName, setLocalDisplayName] = useState(displayName || "");
  const [localEmail, setLocalEmail] = useState(email || "");
  
  // Theme settings
  const [theme, setTheme] = useState(userSettings?.theme || "system");
  
  useEffect(() => {
    // Update local state when user data changes
    setLocalDisplayName(displayName || "");
    setLocalEmail(email || "");
    setTheme(userSettings?.theme || "system");
  }, [displayName, email, userSettings]);
  
  // Save account settings
  const saveAccountSettings = () => {
    updateProfile(localDisplayName, localEmail);
    
    toast({
      title: "Account Updated",
      description: "Your account information has been saved successfully."
    });
  };
  
  // Save theme settings
  const saveTheme = (newTheme: string) => {
    setTheme(newTheme);
    updateUserSettings({
      ...userSettings,
      theme: newTheme
    });
    
    toast({
      title: "Theme Updated",
      description: `Your theme preference has been set to ${newTheme}.`
    });
  };
  
  // Save notification settings
  const saveSettings = (settings: any) => {
    updateUserSettings({
      ...userSettings,
      ...settings
    });
  };
  
  // Prepare notification settings object with default values if properties are undefined
  const notificationSettings = {
    emailNotifications: userSettings?.emailNotifications !== undefined ? userSettings.emailNotifications : true,
    pushNotifications: userSettings?.pushNotifications !== undefined ? userSettings.pushNotifications : false,
    voiceReminders: userSettings?.voiceReminders !== undefined ? userSettings.voiceReminders : false,
    reminderDays: userSettings?.reminderDays !== undefined ? userSettings.reminderDays : 3,
    voiceType: userSettings?.voiceType || "default"
  };
  
  return (
    <Container>
      <div className="mb-8 relative">
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl -z-10" />
        
        <div className="pt-8 pb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Settings</h1>
          <p className="text-muted-foreground dark:text-slate-400 mt-2">
            Customize your SurakshitLocker experience
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="account" value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full mb-8 bg-slate-100 dark:bg-slate-800/70 rounded-xl p-1">
          <TabsTrigger value="account" className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-slate-700">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-slate-700">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-slate-700">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-slate-700">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="extension" className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600 dark:data-[state=active]:bg-slate-700">
            <Chrome className="h-4 w-4" />
            <span className="hidden sm:inline">Extension</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4 animate-fadeIn">
          <AccountSettings 
            localDisplayName={localDisplayName}
            setLocalDisplayName={setLocalDisplayName}
            localEmail={localEmail}
            setLocalEmail={setLocalEmail}
            saveAccountSettings={saveAccountSettings}
          />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 animate-fadeIn">
          <NotificationSettings 
            settings={notificationSettings}
            saveSettings={saveSettings} 
          />
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4 animate-fadeIn">
          <AppearanceSettings 
            theme={theme}
            saveTheme={saveTheme}
          />
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4 animate-fadeIn">
          <SurakshaLocker />
        </TabsContent>

        <TabsContent value="extension" className="space-y-4 animate-fadeIn">
          <ChromeExtensionDownload />
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default Settings;
