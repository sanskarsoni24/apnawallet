
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

const Settings = () => {
  const [currentTab, setCurrentTab] = useState("account");
  const { email, displayName, userSettings, updateUserSettings, updateUserProfile } = useUser();
  
  // Account settings state
  const [localDisplayName, setLocalDisplayName] = useState(displayName || "");
  const [localEmail, setLocalEmail] = useState(email || "");
  
  // Theme settings
  const [theme, setTheme] = useState(userSettings.theme || "system");
  
  useEffect(() => {
    // Update local state when user data changes
    setLocalDisplayName(displayName || "");
    setLocalEmail(email || "");
    setTheme(userSettings.theme || "system");
  }, [displayName, email, userSettings]);
  
  // Save account settings
  const saveAccountSettings = () => {
    updateUserProfile({
      displayName: localDisplayName,
      email: localEmail
    });
    
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
  
  return (
    <Container>
      <div className="mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Settings</h1>
        <p className="text-muted-foreground dark:text-slate-400">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue="account" value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full md:w-auto mb-6 bg-slate-100 dark:bg-slate-800/70">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AccountSettings 
              localDisplayName={localDisplayName}
              setLocalDisplayName={setLocalDisplayName}
              localEmail={localEmail}
              setLocalEmail={setLocalEmail}
              saveAccountSettings={saveAccountSettings}
            />
            <ChromeExtensionDownload />
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettings 
            settings={userSettings} 
            saveSettings={saveSettings} 
          />
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <AppearanceSettings 
            theme={theme}
            saveTheme={saveTheme}
          />
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <SurakshaLocker />
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default Settings;
