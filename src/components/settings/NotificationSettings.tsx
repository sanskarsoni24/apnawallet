import React from "react";
import BlurContainer from "@/components/ui/BlurContainer";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Clock, Volume } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [localSettings, setLocalSettings] = React.useState(settings);
  
  const handleSettingChange = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSaveSettings = () => {
    saveSettings(localSettings);
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated."
    });
  };
  
  const handleSendTestEmail = () => {
    // Logic to send test email
    try {
      // Mock API call
      setTimeout(() => {
        toast({
          title: "Test email sent",
          description: "Please check your inbox for the test notification email."
        });
      }, 1000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send test email",
        description: "Please try again or contact support."
      });
    }
  };

  return (
    <BlurContainer variant="default" className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Notification Settings</h2>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-500" />
              <h3 className="text-lg font-medium">Email Notifications</h3>
            </div>
            <Switch 
              checked={localSettings.emailNotifications} 
              onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
            />
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Receive document expiration reminders and important updates via email
          </p>
          
          {localSettings.emailNotifications && (
            <div className="mt-4 flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSendTestEmail}
              >
                Send test email
              </Button>
              <span className="text-xs text-muted-foreground">
                Check if notifications are working properly
              </span>
            </div>
          )}
          
          {!localSettings.emailNotifications && !localSettings.pushNotifications && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>No notifications enabled</AlertTitle>
              <AlertDescription>
                You won't receive any alerts about document expirations. We recommend enabling at least one notification method.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <Separator />
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              <h3 className="text-lg font-medium">Push Notifications</h3>
            </div>
            <Switch 
              checked={localSettings.pushNotifications} 
              onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
            />
          </div>
          
          <p className="text-sm text-muted-foreground">
            Receive browser push notifications for important alerts
          </p>
        </div>
        
        <Separator />
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Volume className="h-5 w-5 text-indigo-500" />
              <h3 className="text-lg font-medium">Voice Reminders</h3>
            </div>
            <Switch 
              checked={localSettings.voiceReminders} 
              onCheckedChange={(checked) => handleSettingChange("voiceReminders", checked)}
            />
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Enable voice notifications when you visit the application
          </p>
          
          {localSettings.voiceReminders && (
            <div className="space-y-4 mt-4">
              <div>
                <Label className="mb-2 block">Voice Type</Label>
                <select 
                  className="w-full p-2 border rounded-md bg-background"
                  value={localSettings.voiceType}
                  onChange={(e) => handleSettingChange("voiceType", e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Reminder Settings</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <Label>Days before expiration to notify</Label>
                <span className="text-sm font-medium">
                  {localSettings.reminderDays} {localSettings.reminderDays === 1 ? 'day' : 'days'}
                </span>
              </div>
              <Slider 
                value={[localSettings.reminderDays]} 
                min={1}
                max={30}
                step={1}
                onValueChange={(values) => handleSettingChange("reminderDays", values[0])}
                className="my-4"
              />
              <p className="text-xs text-muted-foreground">
                You'll be notified {localSettings.reminderDays} {localSettings.reminderDays === 1 ? 'day' : 'days'} before your documents expire
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button onClick={handleSaveSettings}>
            Save notification settings
          </Button>
        </div>
      </div>
    </BlurContainer>
  );
};

export default NotificationSettings;
