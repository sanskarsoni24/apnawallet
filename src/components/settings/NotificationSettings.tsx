import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import BlurContainer from '@/components/ui/BlurContainer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Volume2, VolumeX, Save, Mail, AlertCircle } from 'lucide-react';
import { speakNotification, getAvailableVoices, updateVoiceSettings, getVoiceSettings, sendEmailNotification, verifyEmailNotifications } from '@/services/NotificationService';
import { toast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useUser } from '@/contexts/UserContext';

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
  
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceVolume, setVoiceVolume] = useState(0.8);
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [showEmailTest, setShowEmailTest] = useState(false);
  const { email } = useUser();
  
  useEffect(() => {
    // Get available voices
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Some browsers need a timeout to properly load the voices
      setTimeout(() => {
        const voices = getAvailableVoices();
        setAvailableVoices(voices);
      }, 200);
      
      // Load current voice settings
      const currentSettings = getVoiceSettings();
      setVoiceVolume(currentSettings.volume);
      setVoiceRate(currentSettings.rate);
      setVoicePitch(currentSettings.pitch);
    }
    
    // Check if email notification was recently enabled
    if (localSettings.emailNotifications) {
      setShowEmailTest(true);
    }
  }, [localSettings.emailNotifications]);
  
  const handleCheck = (field: string, value: boolean) => {
    setLocalSettings({ ...localSettings, [field]: value });
    
    // Show email test option when email notifications are enabled
    if (field === 'emailNotifications' && value) {
      setShowEmailTest(true);
    }
  };
  
  const handleChange = (field: string, value: string) => {
    setLocalSettings({ ...localSettings, [field]: value });
  };
  
  const handleSave = () => {
    // Save notification settings
    saveSettings({
      emailNotifications: localSettings.emailNotifications,
      pushNotifications: localSettings.pushNotifications,
      voiceReminders: localSettings.voiceReminders,
      reminderDays: parseInt(localSettings.reminderDays),
      voiceType: localSettings.voiceType
    });
    
    // Save voice settings
    updateVoiceSettings({
      volume: voiceVolume,
      rate: voiceRate,
      pitch: voicePitch,
      voiceName: localSettings.voiceType
    });
    
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated.",
    });
    
    if (localSettings.pushNotifications && Notification.permission !== 'granted') {
      requestNotificationPermission();
    }
    
    // Send test email notification if email notifications are enabled and we have a valid email
    if (localSettings.emailNotifications && email && showEmailTest) {
      sendTestEmailNotification();
      setShowEmailTest(false); // Don't show test option again until re-enabled
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
  
  const sendTestEmailNotification = () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please add an email address in your account settings.",
        variant: "destructive",
      });
      return;
    }
    
    const emailBody = `
Dear SurakshitLocker User,

This is a test email to confirm that your email notifications are working correctly.

You will now receive important notifications about your documents, including:
- Documents that are due soon
- Documents that have expired
- Important security alerts

Thank you for using SurakshitLocker!
    `;
    
    const success = sendEmailNotification(
      email,
      "SurakshitLocker - Email Notifications Test",
      emailBody
    );
    
    if (success) {
      toast({
        title: "Test Email Sent",
        description: `A test notification has been sent to ${email}`,
      });
    }
  };
  
  const previewVoice = () => {
    const previewText = "This is a preview of your voice reminder from SurakshitLocker. Your documents are due soon!";
    
    // Pass proper voice options
    const voiceOptions = {
      voiceName: localSettings.voiceType,
      volume: voiceVolume,
      rate: voiceRate,
      pitch: voicePitch
    };
    
    const success = speakNotification(previewText, voiceOptions);
    
    if (!success) {
      toast({
        title: "Voice Preview Failed",
        description: "Your browser may not support speech synthesis.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Playing Voice Preview",
        description: "Listen to your selected voice settings."
      });
    }
  };
  
  return (
    <BlurContainer className="p-8 dark:bg-slate-800/70 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900/80 dark:to-slate-800/80">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 flex items-center justify-center shadow-sm">
          <Bell className="h-6 w-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">Notification Settings</h2>
          <p className="text-sm text-muted-foreground dark:text-slate-400">Configure how you want to be notified about document expiries</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="font-medium mb-4 text-slate-800 dark:text-slate-200">Notification Channels</h3>
          
          <div className="space-y-4">
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
            
            {localSettings.emailNotifications && showEmailTest && (
              <div className="ml-7 mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={sendTestEmailNotification}
                  className="flex items-center gap-2 text-sm"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Send Test Email
                </Button>
                <p className="text-xs text-muted-foreground mt-1 dark:text-slate-400">
                  {email ? `A test notification will be sent to ${email}` : "Please add an email in account settings"}
                </p>
              </div>
            )}
            
            {localSettings.emailNotifications && !email && (
              <Alert variant="warning" className="ml-7 mt-2 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/30">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="text-amber-800 dark:text-amber-300">Email address required</AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-400">
                  Please add an email address in your account settings to receive email notifications.
                </AlertDescription>
              </Alert>
            )}
            
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
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="font-medium mb-4 text-slate-800 dark:text-slate-200">Reminder Settings</h3>
          
          <div className="space-y-4">
            <div className="space-y-3">
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
          </div>
        </div>
        
        {localSettings.voiceReminders && (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h3 className="font-medium mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <Volume2 className="h-4 w-4 text-amber-500" />
              Voice Settings
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium dark:text-white">Voice Type</label>
                <Select 
                  value={localSettings.voiceType} 
                  onValueChange={(value) => handleChange('voiceType', value)}
                >
                  <SelectTrigger className="w-full md:w-[300px]">
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    {availableVoices.map((voice, index) => (
                      <SelectItem key={index} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-6 pt-2">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium dark:text-white">Volume</label>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{Math.round(voiceVolume * 100)}%</span>
                  </div>
                  <Slider
                    defaultValue={[voiceVolume * 100]}
                    max={100}
                    step={10}
                    onValueChange={(value) => setVoiceVolume(value[0] / 100)}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium dark:text-white">Speed</label>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{voiceRate.toFixed(1)}x</span>
                  </div>
                  <Slider
                    defaultValue={[voiceRate * 50]}
                    max={100}
                    step={5}
                    onValueChange={(value) => setVoiceRate(value[0] / 50)}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium dark:text-white">Pitch</label>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{voicePitch.toFixed(1)}</span>
                  </div>
                  <Slider
                    defaultValue={[voicePitch * 50]}
                    max={100}
                    step={5}
                    onValueChange={(value) => setVoicePitch(value[0] / 50)}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="pt-2 flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={previewVoice}
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
        )}
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleSave}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white flex gap-2"
        >
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </BlurContainer>
  );
};

export default NotificationSettings;
