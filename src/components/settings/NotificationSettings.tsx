
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import BlurContainer from '@/components/ui/BlurContainer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Volume2, VolumeX } from 'lucide-react';
import { speakNotification } from '@/services/NotificationService';
import { toast } from '@/hooks/use-toast';

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
  const [localSettings, setLocalSettings] = useState({
    emailNotifications: settings.emailNotifications,
    pushNotifications: settings.pushNotifications,
    voiceReminders: settings.voiceReminders,
    reminderDays: settings.reminderDays.toString(),
    voiceType: settings.voiceType
  });
  
  const handleCheck = (field: string, value: boolean) => {
    setLocalSettings({ ...localSettings, [field]: value });
  };
  
  const handleChange = (field: string, value: string) => {
    setLocalSettings({ ...localSettings, [field]: value });
  };
  
  const handleSave = () => {
    saveSettings({
      emailNotifications: localSettings.emailNotifications,
      pushNotifications: localSettings.pushNotifications,
      voiceReminders: localSettings.voiceReminders,
      reminderDays: parseInt(localSettings.reminderDays),
      voiceType: localSettings.voiceType
    });
    
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    });
    
    if (localSettings.pushNotifications && Notification.permission !== 'granted') {
      requestNotificationPermission();
    }
  };
  
  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          toast({
            title: "Notifications Enabled",
            description: "You'll now receive push notifications for document reminders."
          });
        } else {
          toast({
            title: "Notifications Declined",
            description: "Push notifications were not allowed by your browser.",
            variant: "destructive"
          });
          
          // Update local state to reflect actual status
          setLocalSettings(prev => ({...prev, pushNotifications: false}));
        }
      });
    }
  };
  
  const previewVoice = () => {
    const previewText = "This is a preview of your voice reminder. Your documents are due soon!";
    const success = speakNotification(previewText, localSettings.voiceType);
    
    if (!success) {
      toast({
        title: "Voice Preview Failed",
        description: "Your browser may not support speech synthesis.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Playing Voice Preview",
        description: "Listen to your selected voice type."
      });
    }
  };
  
  return (
    <BlurContainer className="p-6 dark:bg-slate-800/70">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
          <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-medium dark:text-white">Notification Settings</h2>
          <p className="text-sm text-muted-foreground dark:text-slate-400">Configure how you want to be notified about document expiries</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="emailNotifications"
            checked={localSettings.emailNotifications}
            onCheckedChange={(checked) => handleCheck('emailNotifications', checked as boolean)}
          />
          <div className="grid gap-1.5">
            <label
              htmlFor="emailNotifications"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white"
            >
              Email Notifications
            </label>
            <p className="text-sm text-muted-foreground dark:text-slate-400">
              Receive email notifications for important document reminders
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Checkbox
            id="pushNotifications"
            checked={localSettings.pushNotifications}
            onCheckedChange={(checked) => handleCheck('pushNotifications', checked as boolean)}
          />
          <div className="grid gap-1.5">
            <label
              htmlFor="pushNotifications"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white"
            >
              Push Notifications
            </label>
            <p className="text-sm text-muted-foreground dark:text-slate-400">
              Receive browser notifications when documents are about to expire
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Checkbox
            id="voiceReminders"
            checked={localSettings.voiceReminders}
            onCheckedChange={(checked) => handleCheck('voiceReminders', checked as boolean)}
          />
          <div className="grid gap-1.5">
            <label
              htmlFor="voiceReminders"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white"
            >
              Voice Reminders
            </label>
            <p className="text-sm text-muted-foreground dark:text-slate-400">
              Get spoken reminders for urgent document deadlines
            </p>
          </div>
        </div>
        
        <div className="space-y-3 border-t dark:border-slate-700 pt-4">
          <label className="text-sm font-medium dark:text-white">Reminder Days</label>
          <p className="text-sm text-muted-foreground dark:text-slate-400">
            How many days before expiry should we notify you?
          </p>
          <Select value={localSettings.reminderDays} onValueChange={(value) => handleChange('reminderDays', value)}>
            <SelectTrigger className="w-full md:w-[180px]">
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
        
        {localSettings.voiceReminders && (
          <div className="space-y-3 border-t dark:border-slate-700 pt-4">
            <label className="text-sm font-medium dark:text-white">Voice Type</label>
            <p className="text-sm text-muted-foreground dark:text-slate-400">
              Choose a voice for your spoken reminders
            </p>
            <div className="space-y-4">
              <div className="flex flex-col space-y-3">
                <Select value={localSettings.voiceType} onValueChange={(value) => handleChange('voiceType', value)}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="robot">Robot</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={previewVoice}
                    disabled={!localSettings.voiceReminders}
                  >
                    <Volume2 className="h-4 w-4" />
                    Play Voice Preview
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-2 text-muted-foreground"
                    onClick={() => window.speechSynthesis?.cancel()}
                  >
                    <VolumeX className="h-4 w-4" />
                    Stop
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Save Settings
        </Button>
      </div>
    </BlurContainer>
  );
};

export default NotificationSettings;
