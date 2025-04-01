
import React from "react";
import { Bell } from "lucide-react";
import BlurContainer from "@/components/ui/BlurContainer";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { speakNotification } from "@/services/NotificationService";

interface NotificationSettingsProps {
  emailNotifications: boolean;
  setEmailNotifications: (value: boolean) => void;
  pushNotifications: boolean;
  setPushNotifications: (value: boolean) => void;
  voiceReminders: boolean;
  setVoiceReminders: (value: boolean) => void;
  reminderFrequency: string;
  setReminderFrequency: (value: string) => void;
  notificationPermission: string;
  requestNotificationPermission: () => void;
  saveNotificationSettings: (key: string, value: any) => void;
}

const NotificationSettings = ({
  emailNotifications,
  setEmailNotifications,
  pushNotifications,
  setPushNotifications,
  voiceReminders,
  setVoiceReminders,
  reminderFrequency,
  setReminderFrequency,
  notificationPermission,
  requestNotificationPermission,
  saveNotificationSettings
}: NotificationSettingsProps) => {
  
  // Toggle voice reminders
  const toggleVoiceReminders = () => {
    // Test if speech synthesis is available
    if (!voiceReminders && 'speechSynthesis' in window) {
      const success = speakNotification("Voice reminders have been enabled.");
      if (success) {
        setVoiceReminders(true);
        saveNotificationSettings("voiceReminders", true);
      } else {
        toast({
          title: "Voice Reminders Unavailable",
          description: "Your browser doesn't support voice synthesis.",
          variant: "destructive"
        });
      }
    } else if (!('speechSynthesis' in window)) {
      toast({
        title: "Voice Reminders Unavailable",
        description: "Your browser doesn't support voice synthesis.",
        variant: "destructive"
      });
    } else {
      setVoiceReminders(false);
      saveNotificationSettings("voiceReminders", false);
    }
  };

  // Toggle push notifications
  const togglePushNotifications = () => {
    if (!pushNotifications) {
      requestNotificationPermission();
    } else {
      setPushNotifications(false);
      saveNotificationSettings("pushNotifications", false);
    }
  };
  
  return (
    <BlurContainer className="p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-medium">Notification Settings</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <div>
            <h3 className="text-sm font-medium">Email Notifications</h3>
            <p className="text-xs text-muted-foreground">
              Receive email notifications for upcoming deadlines.
            </p>
          </div>
          <label className="inline-flex items-center">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={emailNotifications}
              onChange={() => {
                setEmailNotifications(!emailNotifications);
                saveNotificationSettings("emailNotifications", !emailNotifications);
              }}
            />
            <div className="relative h-5 w-10 cursor-pointer rounded-full bg-muted peer-checked:bg-primary transition-colors">
              <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-all peer-checked:left-5" />
            </div>
          </label>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div>
            <h3 className="text-sm font-medium">Push Notifications</h3>
            <p className="text-xs text-muted-foreground">
              Receive push notifications on your devices.
            </p>
          </div>
          <label className="inline-flex items-center">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={pushNotifications}
              onChange={togglePushNotifications}
            />
            <div className="relative h-5 w-10 cursor-pointer rounded-full bg-muted peer-checked:bg-primary transition-colors">
              <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-all peer-checked:left-5" />
            </div>
          </label>
        </div>
        
        {notificationPermission === 'denied' && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription>
              Notification permission denied. You need to allow notifications in your browser settings.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center justify-between py-2">
          <div>
            <h3 className="text-sm font-medium">Voice Reminders</h3>
            <p className="text-xs text-muted-foreground">
              Enable spoken reminders for upcoming deadlines.
            </p>
          </div>
          <label className="inline-flex items-center">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={voiceReminders}
              onChange={toggleVoiceReminders}
            />
            <div className="relative h-5 w-10 cursor-pointer rounded-full bg-muted peer-checked:bg-primary transition-colors">
              <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-all peer-checked:left-5" />
            </div>
          </label>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div>
            <h3 className="text-sm font-medium">Reminder Days</h3>
            <p className="text-xs text-muted-foreground">
              How many days before due date should we remind you?
            </p>
          </div>
          <select 
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
            value={reminderFrequency}
            onChange={(e) => {
              setReminderFrequency(e.target.value);
              saveNotificationSettings("reminderDays", e.target.value.split(" ")[0]);
            }}
          >
            <option>1 day before</option>
            <option>3 days before</option>
            <option>5 days before</option>
            <option>7 days before</option>
          </select>
        </div>
      </div>
    </BlurContainer>
  );
};

export default NotificationSettings;
