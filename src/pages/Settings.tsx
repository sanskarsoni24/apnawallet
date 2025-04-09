
import React, { useState } from "react";
import Container from "@/components/layout/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Palette, Shield, CloudCog } from "lucide-react";
import AccountSettings from "@/components/settings/AccountSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import ChromeExtensionDownload from "@/components/settings/ChromeExtensionDownload";
import BackupSettings from "@/components/settings/BackupSettings";
import PremiumFeatures from "@/components/premium/PremiumFeatures";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const isPremiumUser = false; // This would be determined by the user's subscription
  
  return (
    <Container>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-2 p-1 sm:p-0 sm:gap-0 sm:h-10">
            <TabsTrigger value="account" className="text-xs sm:text-sm flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="backup" className="text-xs sm:text-sm flex items-center gap-1">
              <CloudCog className="h-4 w-4" />
              <span className="hidden sm:inline">Backup & Export</span>
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
            <AccountSettings />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings />
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
            <AppearanceSettings />
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
