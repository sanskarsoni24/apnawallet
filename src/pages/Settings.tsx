
import React, { useState, useEffect } from "react";
import Container from "@/components/layout/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Palette, Shield, CloudCog } from "lucide-react";
import AccountSettings from "@/components/settings/AccountSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import ChromeExtensionDownload from "@/components/settings/ChromeExtensionDownload";
import BackupSettings from "@/components/settings/BackupSettings";
import PremiumFeatures from "@/components/premium/PremiumFeatures";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("backup"); // Changed default tab to backup
  const { userSettings, updateUserSettings, displayName, email, updateProfile } = useUser();
  
  // Account settings state
  const [localDisplayName, setLocalDisplayName] = useState(displayName);
  const [localEmail, setLocalEmail] = useState(email);
  
  // Update local state when user profile changes
  useEffect(() => {
    setLocalDisplayName(displayName);
    setLocalEmail(email);
  }, [displayName, email]);
  
  // Check if user has premium subscription
  const isPremiumUser = userSettings?.subscriptionPlan === 'premium' || userSettings?.subscriptionPlan === 'enterprise';
  
  // Save account settings
  const saveAccountSettings = () => {
    updateProfile(localDisplayName, localEmail);
    toast({
      title: "Settings saved",
      description: "Your account settings have been updated successfully.",
    });
  };
  
  // Save notification settings
  const saveSettings = (newSettings: any) => {
    updateUserSettings(newSettings);
    toast({
      title: "Settings saved",
      description: "Your notification settings have been updated successfully.",
    });
  };
  
  // Save theme
  const saveTheme = (theme: string) => {
    updateUserSettings({ theme });
    toast({
      title: "Theme updated",
      description: `Your theme has been set to ${theme}.`,
    });
  };

  // Handle premium upgrade
  const handleUpgrade = () => {
    updateUserSettings({ subscriptionPlan: 'premium' });
    toast({
      title: "Welcome to Premium!",
      description: "You've successfully upgraded to the Premium plan.",
    });
  };
  
  // Default notification settings for new users
  const defaultNotificationSettings = {
    emailNotifications: true,
    pushNotifications: false,
    voiceReminders: false,
    reminderDays: 3,
    voiceType: 'default'
  };
  
  // Create notification settings object based on userSettings or defaults
  const notificationSettings = {
    emailNotifications: userSettings?.emailNotifications ?? defaultNotificationSettings.emailNotifications,
    pushNotifications: userSettings?.pushNotifications ?? defaultNotificationSettings.pushNotifications,
    voiceReminders: userSettings?.voiceReminders ?? defaultNotificationSettings.voiceReminders,
    reminderDays: userSettings?.reminderDays ?? defaultNotificationSettings.reminderDays,
    voiceType: userSettings?.voiceType ?? defaultNotificationSettings.voiceType
  };
  
  return (
    <Container>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          {!isPremiumUser && (
            <button 
              onClick={handleUpgrade}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Upgrade to Premium
            </button>
          )}
          {isPremiumUser && (
            <div className="bg-gradient-to-r from-amber-200 to-amber-400 dark:from-amber-700 dark:to-amber-500 text-amber-900 dark:text-amber-100 px-4 py-2 rounded-md">
              Premium Account
            </div>
          )}
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-2 p-1 sm:p-0 sm:gap-0 sm:h-10">
            <TabsTrigger value="backup" className="text-xs sm:text-sm flex items-center gap-1">
              <CloudCog className="h-4 w-4" />
              <span className="hidden sm:inline">Backup & Export</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="text-xs sm:text-sm flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="text-xs sm:text-sm flex items-center gap-1">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="extensions" className="text-xs sm:text-sm flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Extensions</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <AccountSettings 
              localDisplayName={localDisplayName}
              setLocalDisplayName={setLocalDisplayName}
              localEmail={localEmail}
              setLocalEmail={setLocalEmail}
              saveAccountSettings={saveAccountSettings}
            />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings 
              settings={notificationSettings}
              saveSettings={saveSettings}
            />
          </TabsContent>
          
          <TabsContent value="backup" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-5">
              <div className="md:col-span-3">
                <BackupSettings isPremium={isPremiumUser} />
              </div>
              
              <div className="md:col-span-2">
                <PremiumFeatures showTitle={true} isPremium={isPremiumUser} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <AppearanceSettings 
              theme={userSettings?.theme || 'system'} 
              saveTheme={saveTheme} 
            />
          </TabsContent>

          <TabsContent value="extensions" className="space-y-6">
            <ChromeExtensionDownload />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default Settings;
