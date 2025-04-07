
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import BlurContainer from "@/components/ui/BlurContainer";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface NotificationSettingsProps {
  settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    voiceReminders: boolean;
    reminderDays: number;
    voiceType: string;
  };
  saveSettings: (settings: any) => void;
}

const NotificationSettings = ({ settings, saveSettings }: NotificationSettingsProps) => {
  // Initialize localSettings with default values if props are undefined
  const [localSettings, setLocalSettings] = useState({
    emailNotifications: settings?.emailNotifications !== undefined ? settings.emailNotifications : true,
    pushNotifications: settings?.pushNotifications !== undefined ? settings.pushNotifications : false,
    voiceReminders: settings?.voiceReminders !== undefined ? settings.voiceReminders : false,
    reminderDays: settings?.reminderDays !== undefined ? settings.reminderDays : 3,
    voiceType: settings?.voiceType || "default"
  });
  
  useEffect(() => {
    if (settings) {
      setLocalSettings({
        emailNotifications: settings.emailNotifications !== undefined ? settings.emailNotifications : localSettings.emailNotifications,
        pushNotifications: settings.pushNotifications !== undefined ? settings.pushNotifications : localSettings.pushNotifications,
        voiceReminders: settings.voiceReminders !== undefined ? settings.voiceReminders : localSettings.voiceReminders,
        reminderDays: settings.reminderDays !== undefined ? settings.reminderDays : localSettings.reminderDays,
        voiceType: settings.voiceType || localSettings.voiceType
      });
    }
  }, [settings]);

  const handleChange = (key: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSave = () => {
    saveSettings(localSettings);
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated successfully.",
    });
  };

  const requestPushPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        handleChange('pushNotifications', true);
        new Notification("Push Notifications Enabled", { 
          body: "You'll now receive important document notifications" 
        });
        
        // Save settings immediately after permission is granted
        saveSettings({
          ...localSettings,
          pushNotifications: true
        });
      } else {
        handleChange('pushNotifications', false);
      }
    }
  };

  return (
    <BlurContainer className="p-6 animate-fade-in dark:bg-slate-800/70 dark:border-slate-700" style={{ animationDelay: "0.2s" }}>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-medium">Notification Settings</h2>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium dark:text-white">Email Notifications</h3>
            <p className="text-sm text-muted-foreground dark:text-slate-300">Get notified when documents expire</p>
          </div>
          <Switch 
            checked={localSettings.emailNotifications} 
            onCheckedChange={(checked) => handleChange('emailNotifications', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium dark:text-white">Push Notifications</h3>
            <p className="text-sm text-muted-foreground dark:text-slate-300">Receive browser push notifications</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch 
              checked={localSettings.pushNotifications} 
              onCheckedChange={(checked) => {
                if (checked) {
                  requestPushPermission();
                } else {
                  handleChange('pushNotifications', false);
                }
              }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium dark:text-white">Voice Reminders</h3>
            <p className="text-sm text-muted-foreground dark:text-slate-300">Audio alerts for important documents</p>
          </div>
          <Switch 
            checked={localSettings.voiceReminders} 
            onCheckedChange={(checked) => handleChange('voiceReminders', checked)}
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium dark:text-white">Global Reminder Days</h3>
          <p className="text-sm text-muted-foreground dark:text-slate-300">Days before expiry to notify by default</p>
          <Select 
            value={String(localSettings.reminderDays)} 
            onValueChange={(value) => handleChange('reminderDays', Number(value))}
          >
            <SelectTrigger className="w-full dark:bg-slate-700 dark:border-slate-600">
              <SelectValue placeholder="Select days" />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-800">
              <SelectItem value="1">1 day before</SelectItem>
              <SelectItem value="3">3 days before</SelectItem>
              <SelectItem value="7">7 days before</SelectItem>
              <SelectItem value="14">14 days before</SelectItem>
              <SelectItem value="30">30 days before</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground dark:text-slate-400 mt-1">
            This is your default setting. You can customize reminder days for each document individually.
          </p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium dark:text-white">Voice Type</h3>
          <p className="text-sm text-muted-foreground dark:text-slate-300">Choose voice type for audio alerts</p>
          <Select 
            value={localSettings.voiceType} 
            onValueChange={(value) => handleChange('voiceType', value)}
            disabled={!localSettings.voiceReminders}
          >
            <SelectTrigger className="w-full dark:bg-slate-700 dark:border-slate-600">
              <SelectValue placeholder="Select voice type" />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-800">
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="robot">Robot</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={handleSave} className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white">
          Save Notification Settings
        </Button>
      </div>
    </BlurContainer>
  );
};

export default NotificationSettings;
