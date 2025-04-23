
import React, { useState } from "react";
import Container from "@/components/layout/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Copy, Key, Lock, Mail, ShieldAlert, User, Moon, Sun, Laptop, Smartphone } from "lucide-react";
import MobileAppSettings from "@/components/settings/MobileAppSettings";
import { useMobile } from "@/hooks/use-mobile";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [theme, setTheme] = useState("system");
  const [fontSize, setFontSize] = useState("medium");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [backupEnabled, setBackupEnabled] = useState(false);
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [securityLevel, setSecurityLevel] = useState("standard");
  const [autoLogoutTime, setAutoLogoutTime] = useState(30);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [backupPassword, setBackupPassword] = useState("");
  const [autoBackup, setAutoBackup] = useState(true);
  const [cloudExportProviders, setCloudExportProviders] = useState(["google_drive", "dropbox"]);
  const [isBackupPasswordVisible, setIsBackupPasswordVisible] = useState(false);
  const [isRecoveryKeyVisible, setIsRecoveryKeyVisible] = useState(false);
  const [isBackupKeyCreated, setIsBackupKeyCreated] = useState(false);
  const [isBackupKeyLocation, setIsBackupKeyLocation] = useState("");
  
  // Instead of having hundreds of state variables, we will have just these few
  // and refactor the component into smaller components if needed
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useUser();
  const { userSettings, updateUserSettings } = useUserSettings();
  const { isMobile } = useMobile();

  const handleUpdateSettings = (settings: Partial<UserSettings>) => {
    updateUserSettings(settings);
    toast({
      title: "Settings updated",
      description: "Your settings have been saved successfully.",
    });
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
    handleUpdateSettings({ theme: value as "light" | "dark" | "system" });
  };

  const handleFontSizeChange = (value: string) => {
    setFontSize(value);
    handleUpdateSettings({ fontSize: value as "small" | "medium" | "large" });
  };

  const handleSecurityLevelChange = (value: string) => {
    setSecurityLevel(value);
    handleUpdateSettings({ securityLevel: value as "standard" | "enhanced" | "maximum" });
  };

  const handleBackupFrequencyChange = (value: string) => {
    setBackupFrequency(value);
    handleUpdateSettings({ backupFrequency: value as "daily" | "weekly" | "monthly" });
  };

  const handleTwoFactorAuthChange = (checked: boolean) => {
    setTwoFactorAuth(checked);
    handleUpdateSettings({ twoFactorAuth: checked });
  };

  const handleAutoLogoutTimeChange = (value: number[]) => {
    const minutes = value[0];
    setAutoLogoutTime(minutes);
    handleUpdateSettings({ autoLogoutTime: minutes });
  };

  const handleEmailNotificationsChange = (checked: boolean) => {
    setEmailNotifications(checked);
    handleUpdateSettings({ emailNotifications: checked });
  };

  const handlePushNotificationsChange = (checked: boolean) => {
    setPushNotifications(checked);
    handleUpdateSettings({ pushNotifications: checked });
  };

  const handleBackupEnabledChange = (checked: boolean) => {
    setBackupEnabled(checked);
    handleUpdateSettings({ backupEnabled: checked });
  };

  return (
    <Container>
      <div className="space-y-6 pb-16">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Security
            </TabsTrigger>
            {isMobile && (
              <TabsTrigger value="mobile" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Mobile
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="account" className="space-y-4">
            {/* Account settings content */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your account information and email address.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={displayName || userSettings?.displayName || user?.displayName || ""}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email || userSettings?.email || user?.email || ""}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={() => {
                  handleUpdateSettings({
                    displayName: displayName || userSettings?.displayName || user?.displayName || "",
                    email: email || userSettings?.email || user?.email || "",
                  });
                }}>
                  Save Account Information
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            {/* Appearance settings content */}
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the appearance of the application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex items-center space-x-4">
                    <div
                      className={`flex flex-col items-center justify-center rounded-md border-2 p-2 cursor-pointer ${
                        theme === "light" ? "border-primary" : "border-muted"
                      }`}
                      onClick={() => handleThemeChange("light")}
                    >
                      <Sun className="h-6 w-6 mb-1" />
                      <span className="text-sm">Light</span>
                    </div>
                    <div
                      className={`flex flex-col items-center justify-center rounded-md border-2 p-2 cursor-pointer ${
                        theme === "dark" ? "border-primary" : "border-muted"
                      }`}
                      onClick={() => handleThemeChange("dark")}
                    >
                      <Moon className="h-6 w-6 mb-1" />
                      <span className="text-sm">Dark</span>
                    </div>
                    <div
                      className={`flex flex-col items-center justify-center rounded-md border-2 p-2 cursor-pointer ${
                        theme === "system" ? "border-primary" : "border-muted"
                      }`}
                      onClick={() => handleThemeChange("system")}
                    >
                      <Laptop className="h-6 w-6 mb-1" />
                      <span className="text-sm">System</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <Select
                    value={fontSize}
                    onValueChange={handleFontSizeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            {/* Notifications settings content */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={handleEmailNotificationsChange}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications on your device
                    </p>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={handlePushNotificationsChange}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            {/* Security settings content */}
            <Card>
              <CardHeader>
                <CardTitle>Security Level</CardTitle>
                <CardDescription>
                  Configure the security level for your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={securityLevel}
                  onValueChange={handleSecurityLevelChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a security level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="enhanced">Enhanced</SelectItem>
                    <SelectItem value="maximum">Maximum</SelectItem>
                  </SelectContent>
                </Select>
                <div className="p-4 border rounded-md bg-muted/50">
                  {securityLevel === "standard" && (
                    <div className="space-y-2">
                      <p className="font-medium">Standard Security</p>
                      <p className="text-sm text-muted-foreground">
                        Basic account protection with password-based login.
                      </p>
                    </div>
                  )}
                  {securityLevel === "enhanced" && (
                    <div className="space-y-2">
                      <p className="font-medium">Enhanced Security</p>
                      <p className="text-sm text-muted-foreground">
                        Additional protection with two-factor authentication and session monitoring.
                      </p>
                    </div>
                  )}
                  {securityLevel === "maximum" && (
                    <div className="space-y-2">
                      <p className="font-medium">Maximum Security</p>
                      <p className="text-sm text-muted-foreground">
                        Full protection with biometric verification, encrypted storage, and advanced threat detection.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Enable two-factor authentication to add an extra layer of security.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require a verification code in addition to your password
                    </p>
                  </div>
                  <Switch
                    checked={twoFactorAuth}
                    onCheckedChange={handleTwoFactorAuthChange}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Auto-Logout</CardTitle>
                <CardDescription>
                  Set the time period of inactivity before automatic logout.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Logout after inactivity</Label>
                    <span className="text-sm font-medium">
                      {autoLogoutTime} minutes
                    </span>
                  </div>
                  <Slider
                    defaultValue={[autoLogoutTime]}
                    max={120}
                    min={5}
                    step={5}
                    onValueChange={handleAutoLogoutTimeChange}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {isMobile && (
            <TabsContent value="mobile" className="space-y-4">
              <MobileAppSettings />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Container>
  );
};

export default Settings;
