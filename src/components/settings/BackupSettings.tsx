
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { CloudCog, Download, Database, Key, Lock, Cloud } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TwoFactorAuth from "./TwoFactorAuth";

interface BackupSettingsProps {
  isPremium: boolean;
}

const BackupSettings: React.FC<BackupSettingsProps> = ({ isPremium }) => {
  const { userSettings, updateUserSettings, createBackupKey, restoreFromBackupKey } = useUser();
  const [backupKey, setBackupKey] = useState("");
  const [isRestoring, setIsRestoring] = useState(false);
  
  const autoBackup = userSettings?.autoBackup || false;
  const backupFrequency = userSettings?.backupFrequency || "weekly";
  const twoFactorEnabled = userSettings?.twoFactorEnabled || false;
  const cloudExportProviders = userSettings?.cloudExportProviders || [];
  
  // Toggle auto backup
  const handleToggleAutoBackup = () => {
    updateUserSettings({
      autoBackup: !autoBackup,
    });
    
    toast({
      title: !autoBackup ? "Auto backup enabled" : "Auto backup disabled",
      description: !autoBackup ? "Your documents will be automatically backed up." : "Auto backup has been disabled.",
    });
  };
  
  // Change backup frequency
  const handleBackupFrequencyChange = (value: string) => {
    updateUserSettings({
      backupFrequency: value,
    });
    
    toast({
      title: "Backup frequency updated",
      description: `Your documents will be backed up ${value}.`,
    });
  };
  
  // Create new backup key
  const handleCreateBackupKey = () => {
    createBackupKey();
  };
  
  // Restore from backup key
  const handleRestore = () => {
    setIsRestoring(true);
    
    setTimeout(() => {
      const success = restoreFromBackupKey(backupKey);
      setIsRestoring(false);
      
      if (success) {
        setBackupKey("");
      }
    }, 1500);
  };
  
  // Toggle cloud provider
  const toggleCloudProvider = (provider: string) => {
    let updatedProviders: string[];
    
    if (cloudExportProviders.includes(provider)) {
      updatedProviders = cloudExportProviders.filter(p => p !== provider);
    } else {
      updatedProviders = [...cloudExportProviders, provider];
    }
    
    updateUserSettings({
      cloudExportProviders: updatedProviders,
    });
    
    toast({
      title: cloudExportProviders.includes(provider) ? `${provider} disconnected` : `${provider} connected`,
      description: cloudExportProviders.includes(provider) 
        ? `Your documents will no longer be backed up to ${provider}.` 
        : `Your documents will now be backed up to ${provider}.`,
    });
  };
  
  // Handle backup now
  const handleBackupNow = () => {
    toast({
      title: "Backup started",
      description: "Your documents are being backed up.",
    });
    
    setTimeout(() => {
      toast({
        title: "Backup completed",
        description: "All your documents have been successfully backed up.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="backup">
        <TabsList>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="cloud">Cloud Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="backup" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Automatic Backup</CardTitle>
              <CardDescription>
                Configure automatic backup settings for your documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-backup" className="font-medium">Enable Auto Backup</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically backup your documents
                  </p>
                </div>
                <Switch 
                  id="auto-backup"
                  checked={autoBackup} 
                  onCheckedChange={handleToggleAutoBackup}
                  disabled={!isPremium}
                />
              </div>
              
              {!isPremium && (
                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm text-muted-foreground">
                    Auto backup is a premium feature. Upgrade to enable this feature.
                  </p>
                </div>
              )}
              
              {autoBackup && (
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <Select value={backupFrequency} onValueChange={handleBackupFrequencyChange}>
                    <SelectTrigger id="backup-frequency">
                      <SelectValue placeholder="Select backup frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleBackupNow}
                disabled={!isPremium}
              >
                <CloudCog className="mr-2 h-4 w-4" />
                Backup Now
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Backup Encryption Key</CardTitle>
              <CardDescription>
                Create or restore from an encryption key
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <div className="flex items-start">
                  <Key className="h-5 w-5 mr-2 mt-0.5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">Backup Key Status</p>
                    <p className="text-sm text-muted-foreground">
                      {userSettings?.backupKeyCreated 
                        ? "You have a backup key created. Keep it safe!" 
                        : "No backup key found. Create one to secure your backups."}
                    </p>
                    {userSettings?.lastKeyBackup && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Last backup: {new Date(userSettings.lastKeyBackup).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Restore from Backup Key</h4>
                <div className="space-y-2">
                  <Label htmlFor="backup-key">Enter your backup key</Label>
                  <Input
                    id="backup-key"
                    value={backupKey}
                    onChange={(e) => setBackupKey(e.target.value)}
                    placeholder="Enter your backup key"
                    className="font-mono"
                  />
                </div>
                <Button 
                  className="w-full mt-4" 
                  disabled={!backupKey || isRestoring} 
                  onClick={handleRestore}
                >
                  {isRestoring ? "Restoring..." : "Restore from Key"}
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant={userSettings?.backupKeyCreated ? "outline" : "default"} 
                className="w-full"
                onClick={handleCreateBackupKey}
              >
                <Lock className="mr-2 h-4 w-4" />
                {userSettings?.backupKeyCreated ? "Regenerate Backup Key" : "Create Backup Key"}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>
                Download all your documents and data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm text-muted-foreground">
                  You can export all your data as a ZIP file. This includes your documents, settings, and metadata.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export as ZIP
              </Button>
              <Button variant="outline" className="w-full">
                <Database className="mr-2 h-4 w-4" />
                Export JSON Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4 mt-4">
          <TwoFactorAuth />
        </TabsContent>
        
        <TabsContent value="cloud" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Cloud Storage Providers</CardTitle>
              <CardDescription>
                Connect to cloud storage services for automatic backup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isPremium && (
                <div className="rounded-md bg-muted p-4 mb-4">
                  <p className="text-sm text-muted-foreground">
                    Cloud export is a premium feature. Upgrade to enable this feature.
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-600">
                      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 7h-3V6h-4v3H7v4h3v8h4v-8h3V9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Google Drive</p>
                    <p className="text-sm text-muted-foreground">Connect to Google Drive</p>
                  </div>
                </div>
                <Switch 
                  checked={cloudExportProviders.includes("google")} 
                  onCheckedChange={() => toggleCloudProvider("google")}
                  disabled={!isPremium}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-600">
                      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.61 8.49l-7.07 7.07-4.24-4.24 1.41-1.41 2.83 2.83 5.66-5.66 1.41 1.41z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Dropbox</p>
                    <p className="text-sm text-muted-foreground">Connect to Dropbox</p>
                  </div>
                </div>
                <Switch 
                  checked={cloudExportProviders.includes("dropbox")} 
                  onCheckedChange={() => toggleCloudProvider("dropbox")}
                  disabled={!isPremium}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-blue-600">
                      <path fill="currentColor" d="M8.01 18.02l2 2L20.88 9.14l-2-2L8.01 18.02zM5.59 13.43l2 2L13.45 9.6l-2-2L5.59 13.43zM2 22l3.41-1.4-2-2L2 22z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">OneDrive</p>
                    <p className="text-sm text-muted-foreground">Connect to OneDrive</p>
                  </div>
                </div>
                <Switch 
                  checked={cloudExportProviders.includes("onedrive")} 
                  onCheckedChange={() => toggleCloudProvider("onedrive")}
                  disabled={!isPremium}
                />
              </div>
            </CardContent>
            {isPremium && cloudExportProviders.length > 0 && (
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <Cloud className="mr-2 h-4 w-4" />
                  Sync Cloud Storage Now
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackupSettings;
