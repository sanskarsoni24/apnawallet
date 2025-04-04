
import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import BlurContainer from "@/components/ui/BlurContainer";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [localSettings, setLocalSettings] = useState(settings);
  
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleChange = (key: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSave = () => {
    saveSettings(localSettings);
  };

  return (
    <BlurContainer className="p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-medium">Notification Settings</h2>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Email Notifications</h3>
            <p className="text-sm text-muted-foreground">Get notified when documents expire</p>
          </div>
          <Switch 
            checked={localSettings.emailNotifications} 
            onCheckedChange={(checked) => handleChange('emailNotifications', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Push Notifications</h3>
            <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
          </div>
          <Switch 
            checked={localSettings.pushNotifications} 
            onCheckedChange={(checked) => handleChange('pushNotifications', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Voice Reminders</h3>
            <p className="text-sm text-muted-foreground">Audio alerts for important documents</p>
          </div>
          <Switch 
            checked={localSettings.voiceReminders} 
            onCheckedChange={(checked) => handleChange('voiceReminders', checked)}
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Reminder Days</h3>
          <p className="text-sm text-muted-foreground">Days before expiry to notify</p>
          <Select 
            value={String(localSettings.reminderDays)} 
            onValueChange={(value) => handleChange('reminderDays', Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 day before</SelectItem>
              <SelectItem value="3">3 days before</SelectItem>
              <SelectItem value="7">7 days before</SelectItem>
              <SelectItem value="14">14 days before</SelectItem>
              <SelectItem value="30">30 days before</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Voice Type</h3>
          <p className="text-sm text-muted-foreground">Choose voice type for audio alerts</p>
          <Select 
            value={localSettings.voiceType} 
            onValueChange={(value) => handleChange('voiceType', value)}
            disabled={!localSettings.voiceReminders}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select voice type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="robot">Robot</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={handleSave} className="w-full">
          Save Notification Settings
        </Button>
      </div>
    </BlurContainer>
  );
};

export default NotificationSettings;
