
import React, { useState, useEffect } from "react";
import BlurContainer from "@/components/ui/BlurContainer";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Clock, Volume, Check, Globe, Mail, DeviceTablet, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NotificationSettingsProps {
  settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    voiceReminders: boolean;
    reminderDays: number;
    voiceType: string;
    deviceTokens?: string[];
    emailAddress?: string;
  };
  saveSettings: (settings: any) => void;
}

const NotificationSettings = ({ settings, saveSettings }: NotificationSettingsProps) => {
  const [localSettings, setLocalSettings] = React.useState(settings);
  const [sendingTest, setSendingTest] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [email, setEmail] = useState(settings.emailAddress || '');
  const [testSent, setTestSent] = useState<'success' | 'error' | null>(null);
  
  // Demo devices
  const [devices] = useState([
    { id: 'device-1', name: 'iPhone 12', type: 'mobile', lastActive: 'Today, 2:30 PM' },
    { id: 'device-2', name: 'Chrome', type: 'browser', lastActive: 'Just now' },
  ]);
  
  useEffect(() => {
    // Reset the test notification state after 5 seconds
    if (testSent) {
      const timer = setTimeout(() => {
        setTestSent(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [testSent]);
  
  const handleSettingChange = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSaveSettings = () => {
    // Update email address
    const updatedSettings = {
      ...localSettings,
      emailAddress: email
    };
    
    saveSettings(updatedSettings);
    
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated."
    });
    
    // Show a sample notification to demonstrate it works
    if (updatedSettings.pushNotifications) {
      setTimeout(() => {
        toast({
          title: "Sample notification",
          description: "This is how your notifications will look",
        });
      }, 1000);
    }
  };
  
  const handleSendTestEmail = () => {
    setSendingTest(true);
    
    // Mock API call to send test email
    setTimeout(() => {
      setSendingTest(false);
      setTestSent('success');
      
      toast({
        title: "Test email sent",
        description: "Please check your inbox for the test notification email.",
      });
      
      // Log that we're sending an email notification
      console.log("[Email Notification] Sending email to:", email);
      console.log("[Email Notification] Subject: ApnaWallet - Email Notifications Enabled");
      console.log("[Email Notification] Body: Hello,\n\nYour email notifications for ApnaWallet have been successfully enabled. You will now receive notifications about your documents.\n\nThank you for using ApnaWallet!\n");
    }, 1500);
  };
  
  const handleSendTestPush = () => {
    setSendingTest(true);
    
    // Mock API call to send test push notification
    setTimeout(() => {
      setSendingTest(false);
      setTestSent('success');
      
      toast({
        title: "Push notification sent",
        description: "You should see a browser notification shortly.",
      });
      
      // Simulate native notification (won't work unless permission granted)
      try {
        if ('Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification('SurakshitLocker Test Notification', {
              body: 'Your push notifications are working correctly!',
              icon: '/android-chrome-192x192.png'
            });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                new Notification('SurakshitLocker Test Notification', {
                  body: 'Your push notifications are now enabled!',
                  icon: '/android-chrome-192x192.png'
                });
              }
            });
          }
        }
      } catch (error) {
        console.error('Error sending native notification:', error);
      }
    }, 1500);
  };

  return (
    <BlurContainer variant="default" className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Notification Settings</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6 mt-6">
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
                <Globe className="h-5 w-5 text-indigo-500" />
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
            
            {localSettings.pushNotifications && (
              <div className="mt-4 flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSendTestPush}
                  disabled={sendingTest}
                >
                  {sendingTest ? 'Sending...' : 'Send test notification'}
                </Button>
                <span className="text-xs text-muted-foreground">
                  Check if notifications are working properly
                </span>
              </div>
            )}
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
              <div className="space-y-4 mt-4 bg-slate-50 dark:bg-slate-800/80 rounded-md p-4">
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
                <Alert className="bg-indigo-50 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-900/30">
                  <Info className="h-4 w-4 text-indigo-500" />
                  <AlertTitle className="text-indigo-700 dark:text-indigo-300">Demo feature</AlertTitle>
                  <AlertDescription className="text-indigo-600 dark:text-indigo-400">
                    Voice will announce when documents are about to expire when you open the app.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              Reminder Settings
            </h3>
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
        </TabsContent>
        
        <TabsContent value="email" className="space-y-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Mail className="h-5 w-5 text-indigo-500" />
              Email Preferences
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email address for notifications</Label>
              <Input 
                id="email" 
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This is where we'll send all notification emails
              </p>
            </div>
            
            {localSettings.emailNotifications && (
              <div className="space-y-4 mt-6">
                <h4 className="font-medium">Email Notification Types</h4>
                
                <div className="space-y-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Document Expiry Reminders</p>
                      <p className="text-xs text-muted-foreground">Notifications when documents are about to expire</p>
                    </div>
                    <Switch checked={true} onCheckedChange={() => {}} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Document Sharing</p>
                      <p className="text-xs text-muted-foreground">Notifications when someone shares a document with you</p>
                    </div>
                    <Switch checked={true} onCheckedChange={() => {}} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Security Alerts</p>
                      <p className="text-xs text-muted-foreground">Notifications about account security and login attempts</p>
                    </div>
                    <Switch checked={true} onCheckedChange={() => {}} />
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSendTestEmail}
                    disabled={sendingTest}
                  >
                    {sendingTest ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary" />
                        Sending...
                      </span>
                    ) : (
                      'Send test email'
                    )}
                  </Button>
                  
                  {testSent === 'success' && (
                    <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
                      <Check className="mr-1 h-3 w-3" /> Sent
                    </Badge>
                  )}
                  
                  {testSent === 'error' && (
                    <Badge variant="destructive">Failed</Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="devices" className="space-y-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <DeviceTablet className="h-5 w-5 text-indigo-500" />
              Connected Devices
            </h3>
            
            <p className="text-sm text-muted-foreground">
              Manage which devices receive push notifications
            </p>
            
            <div className="space-y-3">
              {devices.map(device => (
                <div key={device.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {device.type === 'mobile' ? (
                        <Smartphone className="h-5 w-5 text-primary" />
                      ) : (
                        <Globe className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{device.name}</p>
                      <p className="text-xs text-muted-foreground">Last active: {device.lastActive}</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
            
            <Alert className="bg-indigo-50 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-900/30 mt-4">
              <Info className="h-4 w-4 text-indigo-500" />
              <AlertDescription className="text-indigo-700 dark:text-indigo-300">
                Install our mobile app to receive notifications on your phone even when you're offline.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => navigate("/mobile-app")}
                className="text-primary"
              >
                Download Mobile App
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end pt-4">
        <Button onClick={handleSaveSettings}>
          Save notification settings
        </Button>
      </div>
    </BlurContainer>
  );
};

export default NotificationSettings;
