
import React, { useState, useEffect } from "react";
import { Bell, VolumeX, Volume2, Calendar, Clock } from "lucide-react";
import BlurContainer from "@/components/ui/BlurContainer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { createNotification, speakNotification, testVoiceSettings, getAvailableVoices } from "@/services/NotificationService";

interface NotificationSettingsProps {
  settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    voiceReminders: boolean;
    reminderDays: number;
    voiceType?: string;
  };
  saveSettings: (settings: any) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  settings: initialSettings,
  saveSettings
}) => {
  const { email } = useUser();
  
  // Local state for settings
  const [settings, setSettings] = useState({ ...initialSettings });
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  // Load available voices
  useEffect(() => {
    // Wait for the browser's speech synthesis to initialize
    const loadVoices = () => {
      const availableVoices = getAvailableVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };
    
    // Load voices immediately if available
    loadVoices();
    
    // Also set up an event listener for when voices change
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      // Cleanup
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);
  
  // Handle setting changes
  const handleChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
  };
  
  // Test email notification
  const testEmailNotification = () => {
    if (!email) {
      toast({
        title: "Email not available",
        description: "Please set your email address in account settings",
        variant: "destructive"
      });
      return;
    }
    
    // Send a test email notification
    createNotification(
      "Test Notification",
      "This is a test notification from ApnaWallet. If you received this email, your notification settings are working correctly.",
      { variant: "default" }
    );
    
    // Show confirmation to user
    toast({
      title: "Test notification sent",
      description: `A test notification has been sent to ${email}`,
    });
  };
  
  // Test voice notification
  const testVoiceNotification = () => {
    if (settings.voiceReminders) {
      const success = testVoiceSettings();
      
      if (success) {
        toast({
          title: "Voice test successful",
          description: "Voice notifications are working correctly",
        });
      } else {
        toast({
          title: "Voice test failed",
          description: "Your browser may not support speech synthesis",
          variant: "destructive"
        });
      }
    } else {
      speakNotification("Voice notifications are currently disabled. Enable them in settings to use this feature.");
      toast({
        title: "Voice notifications disabled",
        description: "Enable voice notifications to test this feature",
        variant: "destructive"
      });
    }
  };
  
  // Save settings
  const handleSaveSettings = () => {
    // Call the parent's save function
    saveSettings(settings);
    
    // Persist settings in localStorage as a backup mechanism
    try {
      localStorage.setItem('notification_settings', JSON.stringify(settings));
    } catch (e) {
      console.error("Could not save notification settings to localStorage", e);
    }
    
    // Demo sending a test notification to verify email settings
    if (settings.emailNotifications && email) {
      // Create a test notification for new settings
      createNotification(
        "ApnaWallet - Email Notifications Enabled",
        `Hello,\n\nYour email notifications for ApnaWallet have been successfully enabled. You will now receive notifications about your documents.\n\nThank you for using ApnaWallet!`,
        { variant: "default" }
      );
    }
  };
  
  return (
    <BlurContainer className="p-8 animate-fade-in bg-gradient-to-br from-white to-slate-50 dark:from-slate-900/80 dark:to-slate-800/80">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 flex items-center justify-center shadow-sm">
          <Bell className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Notification Settings</h2>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-md font-medium mb-4">Email & Push Notifications</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive document reminders via email</p>
              </div>
              <Switch 
                checked={settings.emailNotifications} 
                onCheckedChange={(value) => handleChange('emailNotifications', value)} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
              </div>
              <Switch 
                checked={settings.pushNotifications} 
                onCheckedChange={(value) => handleChange('pushNotifications', value)}
              />
            </div>
            
            <div className="pt-2">
              <Button onClick={testEmailNotification} variant="outline" size="sm">
                Test Notification
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-md font-medium mb-4">Voice Reminders</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Voice Reminders</Label>
                <p className="text-sm text-muted-foreground">Spoken reminders for important documents</p>
              </div>
              <Switch 
                checked={settings.voiceReminders} 
                onCheckedChange={(value) => handleChange('voiceReminders', value)}
              />
            </div>
            
            {settings.voiceReminders && (
              <>
                <div className="space-y-3">
                  <Label>Voice Type</Label>
                  <Select 
                    value={settings.voiceType || "default"} 
                    onValueChange={(value) => handleChange('voiceType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a voice type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">System Default</SelectItem>
                      <SelectItem value="male">Male Voice</SelectItem>
                      <SelectItem value="female">Female Voice</SelectItem>
                      {voices.slice(0, 5).map((voice) => (
                        <SelectItem key={voice.name} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-2">
                  <Button onClick={testVoiceNotification} variant="outline" size="sm">
                    Test Voice
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-md font-medium mb-4">Reminder Settings</h3>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Days Before Due Date</Label>
                <span className="text-sm font-medium">{settings.reminderDays} days</span>
              </div>
              <Slider 
                min={1} 
                max={30} 
                step={1} 
                value={[settings.reminderDays]} 
                onValueChange={(value) => handleChange('reminderDays', value[0])}
              />
              <p className="text-sm text-muted-foreground">
                Receive reminders {settings.reminderDays} days before documents expire
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button 
          className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white"
          onClick={handleSaveSettings}
        >
          Save Notification Settings
        </Button>
      </div>
    </BlurContainer>
  );
};

export default NotificationSettings;
