
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { CloudCog, Download, Database, Key, Lock, Cloud, Shield, ShieldCheck, ShieldAlert, FileX, Check, DownloadCloud, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TwoFactorAuth from "./TwoFactorAuth";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface BackupSettingsProps {
  isPremium: boolean;
}

const BackupSettings: React.FC<BackupSettingsProps> = ({ isPremium }) => {
  const { userSettings, updateUserSettings, createBackupKey, restoreFromBackupKey } = useUser();
  const [backupKey, setBackupKey] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");
  const [isRestoring, setIsRestoring] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [backingUpFiles, setBackingUpFiles] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<Record<string, 'syncing' | 'synced' | 'error'>>({});
  const [cloudSyncProgress, setCloudSyncProgress] = useState<Record<string, number>>({});
  
  const autoBackup = userSettings?.autoBackup || false;
  const backupFrequency = userSettings?.backupFrequency || "weekly";
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
    setIsGeneratingKey(true);
    
    // Generate a random key for demo
    const keyChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newKey = '';
    for (let i = 0; i < 32; i++) {
      newKey += keyChars.charAt(Math.floor(Math.random() * keyChars.length));
      if (i % 8 === 7 && i < 31) newKey += '-';
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsGeneratingKey(false);
      setGeneratedKey(newKey);
      createBackupKey();
      
      toast({
        title: "Backup key created",
        description: "Keep this key in a safe place. You'll need it to restore your data.",
      });
    }, 2000);
  };
  
  // Restore from backup key
  const handleRestore = () => {
    if (!backupKey.trim()) {
      toast({
        title: "Key required",
        description: "Please enter your backup key to restore",
        variant: "destructive"
      });
      return;
    }
    
    setIsRestoring(true);
    
    // Simulate API call
    setTimeout(() => {
      const success = restoreFromBackupKey(backupKey);
      setIsRestoring(false);
      
      if (success) {
        setBackupKey("");
      }
    }, 2000);
  };
  
  // Toggle cloud provider
  const toggleCloudProvider = (provider: string) => {
    let updatedProviders: string[];
    
    if (cloudExportProviders.includes(provider)) {
      updatedProviders = cloudExportProviders.filter(p => p !== provider);
      
      // Remove sync status
      const newStatus = { ...cloudSyncStatus };
      delete newStatus[provider];
      setCloudSyncStatus(newStatus);
      
      const newProgress = { ...cloudSyncProgress };
      delete newProgress[provider];
      setCloudSyncProgress(newProgress);
    } else {
      updatedProviders = [...cloudExportProviders, provider];
      
      // Add initial sync status
      setCloudSyncStatus({
        ...cloudSyncStatus,
        [provider]: 'syncing'
      });
      
      setCloudSyncProgress({
        ...cloudSyncProgress,
        [provider]: 0
      });
      
      // Simulate sync process
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          setCloudSyncStatus({
            ...cloudSyncStatus,
            [provider]: 'synced'
          });
        }
        
        setCloudSyncProgress({
          ...cloudSyncProgress,
          [provider]: progress
        });
      }, 500);
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
    setIsBackingUp(true);
    setBackupProgress(0);
    
    toast({
      title: "Backup started",
      description: "Your documents are being backed up.",
    });
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 10) + 5;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsBackingUp(false);
            toast({
              title: "Backup completed",
              description: "All your documents have been successfully backed up.",
            });
          }, 500);
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
  };
  
  // Handle cloud sync now
  const handleCloudSyncNow = () => {
    // Reset all syncs to 0
    const initialProgress: Record<string, number> = {};
    const initialStatus: Record<string, 'syncing' | 'synced' | 'error'> = {};
    
    cloudExportProviders.forEach(provider => {
      initialProgress[provider] = 0;
      initialStatus[provider] = 'syncing';
    });
    
    setCloudSyncProgress(initialProgress);
    setCloudSyncStatus(initialStatus);
    setBackingUpFiles(true);
    
    toast({
      title: "Cloud sync started",
      description: "Synchronizing your documents with cloud storage providers.",
    });
    
    // Simulate sync process for each provider
    cloudExportProviders.forEach(provider => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5;
        
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          setCloudSyncStatus(prev => ({
            ...prev,
            [provider]: 'synced'
          }));
          
          // Check if all are done
          setTimeout(() => {
            const allDone = cloudExportProviders.every(p => 
              cloudSyncProgress[p] >= 100 || cloudSyncProgress[p] === undefined
            );
            
            if (allDone) {
              setBackingUpFiles(false);
              toast({
                title: "Cloud sync completed",
                description: "All your documents have been synced to cloud storage.",
              });
            }
          }, 500);
        }
        
        setCloudSyncProgress(prev => ({
          ...prev,
          [provider]: progress
        }));
      }, 500 + Math.random() * 300);
    });
  };
  
  // Download export
  const handleDownloadExport = () => {
    toast({
      title: "Preparing export",
      description: "Your data export is being prepared for download.",
    });
    
    // Simulate download preparation
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      link.download = 'docuninja_export_' + new Date().toISOString().split('T')[0] + '.zip';
      link.click();
      
      toast({
        title: "Export downloaded",
        description: "Your data has been exported successfully.",
      });
    }, 2000);
  };
  
  // Reset generated key when tab changes
  useEffect(() => {
    setGeneratedKey("");
  }, []);

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
              
              {isBackingUp && (
                <div className="space-y-2 mt-4 rounded-md bg-slate-50 dark:bg-slate-800/50 p-4">
                  <div className="flex justify-between items-center">
                    <Label>Backup Progress</Label>
                    <span className="text-xs text-muted-foreground">{backupProgress}%</span>
                  </div>
                  <Progress value={backupProgress} className="h-2" />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleBackupNow}
                disabled={!isPremium || isBackingUp}
              >
                {isBackingUp ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></span>
                    Backing up...
                  </>
                ) : (
                  <>
                    <CloudCog className="mr-2 h-4 w-4" />
                    Backup Now
                  </>
                )}
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
              
              {generatedKey && (
                <Alert className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800">
                  <ShieldCheck className="h-4 w-4 text-green-500 dark:text-green-400" />
                  <AlertTitle>Your Backup Key</AlertTitle>
                  <AlertDescription>
                    <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs break-all text-center">
                      {generatedKey}
                    </div>
                    <p className="text-xs mt-2 text-amber-600 dark:text-amber-400">
                      ⚠️ Store this key securely! It cannot be recovered if lost. Copy and save it now.
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedKey);
                        toast({
                          title: "Copied to clipboard",
                          description: "Backup key has been copied to your clipboard.",
                        });
                      }}
                    >
                      Copy to Clipboard
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
              
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
                  {isRestoring ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      Restoring...
                    </>
                  ) : (
                    "Restore from Key"
                  )}
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant={userSettings?.backupKeyCreated ? "outline" : "default"} 
                className="w-full"
                onClick={handleCreateBackupKey}
                disabled={isGeneratingKey}
              >
                {isGeneratingKey ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></span>
                    Generating Key...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    {userSettings?.backupKeyCreated ? "Regenerate Backup Key" : "Create Backup Key"}
                  </>
                )}
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
              <Button className="w-full" onClick={handleDownloadExport}>
                <Download className="mr-2 h-4 w-4" />
                Export as ZIP
              </Button>
              <Button variant="outline" className="w-full" onClick={handleDownloadExport}>
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
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 text-blue-600">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 7h-3V6h-4v3H7v4h3v8h4v-8h3V9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Google Drive</p>
                      <p className="text-sm text-muted-foreground">Connect to Google Drive</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(cloudSyncStatus['google'] === 'syncing' || cloudSyncStatus['google'] === 'synced') && (
                      <div className="flex-col items-end hidden sm:flex">
                        <div className="flex items-center gap-1">
                          {cloudSyncStatus['google'] === 'synced' ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <svg className="animate-spin h-3 w-3 text-slate-500" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          )}
                          <span className="text-xs">
                            {cloudSyncStatus['google'] === 'synced' ? 'Synced' : `${cloudSyncProgress['google'] || 0}%`}
                          </span>
                        </div>
                        {cloudSyncStatus['google'] === 'syncing' && (
                          <Progress value={cloudSyncProgress['google'] || 0} className="h-1 w-16" />
                        )}
                      </div>
                    )}
                    <Switch 
                      checked={cloudExportProviders.includes("google")} 
                      onCheckedChange={() => toggleCloudProvider("google")}
                      disabled={!isPremium || backingUpFiles}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 text-blue-600">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.61 8.49l-7.07 7.07-4.24-4.24 1.41-1.41 2.83 2.83 5.66-5.66 1.41 1.41z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Dropbox</p>
                      <p className="text-sm text-muted-foreground">Connect to Dropbox</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(cloudSyncStatus['dropbox'] === 'syncing' || cloudSyncStatus['dropbox'] === 'synced') && (
                      <div className="flex-col items-end hidden sm:flex">
                        <div className="flex items-center gap-1">
                          {cloudSyncStatus['dropbox'] === 'synced' ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <svg className="animate-spin h-3 w-3 text-slate-500" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          )}
                          <span className="text-xs">
                            {cloudSyncStatus['dropbox'] === 'synced' ? 'Synced' : `${cloudSyncProgress['dropbox'] || 0}%`}
                          </span>
                        </div>
                        {cloudSyncStatus['dropbox'] === 'syncing' && (
                          <Progress value={cloudSyncProgress['dropbox'] || 0} className="h-1 w-16" />
                        )}
                      </div>
                    )}
                    <Switch 
                      checked={cloudExportProviders.includes("dropbox")} 
                      onCheckedChange={() => toggleCloudProvider("dropbox")}
                      disabled={!isPremium || backingUpFiles}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 text-blue-600">
                        <path fill="currentColor" d="M8.01 18.02l2 2L20.88 9.14l-2-2L8.01 18.02zM5.59 13.43l2 2L13.45 9.6l-2-2L5.59 13.43zM2 22l3.41-1.4-2-2L2 22z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">OneDrive</p>
                      <p className="text-sm text-muted-foreground">Connect to OneDrive</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(cloudSyncStatus['onedrive'] === 'syncing' || cloudSyncStatus['onedrive'] === 'synced') && (
                      <div className="flex-col items-end hidden sm:flex">
                        <div className="flex items-center gap-1">
                          {cloudSyncStatus['onedrive'] === 'synced' ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <svg className="animate-spin h-3 w-3 text-slate-500" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          )}
                          <span className="text-xs">
                            {cloudSyncStatus['onedrive'] === 'synced' ? 'Synced' : `${cloudSyncProgress['onedrive'] || 0}%`}
                          </span>
                        </div>
                        {cloudSyncStatus['onedrive'] === 'syncing' && (
                          <Progress value={cloudSyncProgress['onedrive'] || 0} className="h-1 w-16" />
                        )}
                      </div>
                    )}
                    <Switch 
                      checked={cloudExportProviders.includes("onedrive")} 
                      onCheckedChange={() => toggleCloudProvider("onedrive")}
                      disabled={!isPremium || backingUpFiles}
                    />
                  </div>
                </div>
              </div>
              
              {isPremium && cloudExportProviders.length > 0 && backingUpFiles && (
                <div className="mt-4 rounded-md bg-slate-50 dark:bg-slate-800/50 p-4 space-y-4">
                  <h4 className="text-sm font-medium flex items-center">
                    <DownloadCloud className="h-4 w-4 mr-2 text-blue-500" />
                    Syncing with cloud services
                  </h4>
                  
                  {cloudExportProviders.map(provider => (
                    <div key={provider} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs capitalize">{provider}</Label>
                        <span className="text-xs text-muted-foreground">{cloudSyncProgress[provider] || 0}%</span>
                      </div>
                      <Progress value={cloudSyncProgress[provider] || 0} className="h-1.5" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            {isPremium && cloudExportProviders.length > 0 && (
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleCloudSyncNow}
                  disabled={backingUpFiles}
                >
                  {backingUpFiles ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></span>
                      Syncing...
                    </>
                  ) : (
                    <>
                      <Cloud className="mr-2 h-4 w-4" />
                      Sync Cloud Storage Now
                    </>
                  )}
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
