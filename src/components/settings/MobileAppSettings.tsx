
import React, { useState } from "react";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Camera, FileText, Bell, Download, Smartphone, Trash2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useMobile } from "@/hooks/use-mobile";

const MobileAppSettings = () => {
  const { userSettings, updateUserSettings } = useUserSettings();
  const { isMobileApp } = useMobile();
  const [clearingCache, setClearingCache] = useState(false);
  
  const handleTogglePushNotifications = (enabled: boolean) => {
    updateUserSettings({ pushNotifications: enabled });
    
    toast({
      title: enabled ? "Push notifications enabled" : "Push notifications disabled",
      description: enabled
        ? "You will receive notifications for important document updates"
        : "You will no longer receive push notifications",
    });
  };
  
  const handleToggleOfflineAccess = (enabled: boolean) => {
    updateUserSettings({ 
      mobileSettings: {
        ...userSettings.mobileSettings,
        offlineAccess: enabled
      }
    });
    
    toast({
      title: enabled ? "Offline access enabled" : "Offline access disabled",
      description: enabled
        ? "Documents will be available offline (requires storage space)"
        : "Documents will only be accessible with an internet connection",
    });
  };
  
  const handleClearCache = () => {
    setClearingCache(true);
    
    // Simulate cache clearing
    setTimeout(() => {
      setClearingCache(false);
      toast({
        title: "Cache cleared",
        description: "All temporary files have been removed",
      });
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Mobile App Settings</h2>
        <p className="text-muted-foreground">
          Configure how SurakshitLocker works on your mobile device
        </p>
      </div>
      
      {!isMobileApp && (
        <Alert>
          <AlertTitle>Using browser version</AlertTitle>
          <AlertDescription>
            You're currently using the web version. Some mobile app settings may only take effect in the native app.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Configure how you receive notifications on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts about document deadlines and updates
              </p>
            </div>
            <Switch
              checked={userSettings.pushNotifications || false}
              onCheckedChange={handleTogglePushNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Document Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get reminders before documents expire
              </p>
            </div>
            <Select
              value={String(userSettings.reminderDays || 3)}
              onValueChange={(value) => updateUserSettings({ reminderDays: Number(value) })}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Days before" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Storage & Offline Access</CardTitle>
          <CardDescription>
            Manage how documents are stored on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Offline Access</Label>
              <p className="text-sm text-muted-foreground">
                Download documents for offline viewing
              </p>
            </div>
            <Switch
              checked={userSettings.mobileSettings?.offlineAccess || false}
              onCheckedChange={handleToggleOfflineAccess}
            />
          </div>
          
          <div>
            <Label className="text-base mb-2 block">Document Storage</Label>
            <div className="bg-secondary/50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Storage Used</span>
                <span className="text-sm font-medium">24.3 MB</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "15%" }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                15% of 250 MB quota used
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleClearCache}
              disabled={clearingCache}
            >
              {clearingCache ? (
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Clear App Cache
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Document Capture</CardTitle>
          <CardDescription>
            Configure document scanning and capture settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Auto Document Detection</Label>
              <p className="text-sm text-muted-foreground">
                Automatically detect document edges when scanning
              </p>
            </div>
            <Switch
              checked={userSettings.mobileSettings?.autoDocDetection || true}
              onCheckedChange={(value) => 
                updateUserSettings({ 
                  mobileSettings: {
                    ...userSettings.mobileSettings,
                    autoDocDetection: value
                  }
                })
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">High-Quality Scanning</Label>
              <p className="text-sm text-muted-foreground">
                Use higher resolution for document scans (uses more storage)
              </p>
            </div>
            <Switch
              checked={userSettings.mobileSettings?.highQualityScan || false}
              onCheckedChange={(value) => 
                updateUserSettings({ 
                  mobileSettings: {
                    ...userSettings.mobileSettings,
                    highQualityScan: value
                  }
                })
              }
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button variant="outline" className="flex items-center gap-2 justify-center">
              <Camera className="h-4 w-4" />
              Test Camera
            </Button>
            <Button variant="outline" className="flex items-center gap-2 justify-center">
              <FileText className="h-4 w-4" />
              Test Scan
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>App Information</CardTitle>
          <CardDescription>
            Details about the SurakshitLocker mobile application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">App Version</span>
              <span className="text-sm font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Platform</span>
              <span className="text-sm font-medium">
                {navigator.platform || "Web"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Last Updated</span>
              <span className="text-sm font-medium">April 23, 2025</span>
            </div>
            
            <div className="pt-3 mt-3 border-t">
              <Button variant="outline" className="w-full flex items-center gap-2 justify-center">
                <Smartphone className="h-4 w-4" />
                Check for Updates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileAppSettings;
