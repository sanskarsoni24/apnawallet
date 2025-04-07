
import React, { useState } from "react";
import Container from "@/components/layout/Container";
import AccountSettings from "@/components/settings/AccountSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import ChromeExtensionDownload from "@/components/settings/ChromeExtensionDownload";
import SurakshaLocker from "@/components/suraksha/SurakshaLocker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const [currentTab, setCurrentTab] = useState("account");
  
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
            <AccountSettings />
            <ChromeExtensionDownload />
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <AppearanceSettings />
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <SurakshaLocker />
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default Settings;
