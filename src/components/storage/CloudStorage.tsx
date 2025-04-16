
import React, { useState, useEffect } from "react";
import { Cloud, Upload, Download, RefreshCw, Settings, HardDrive, X, Check, Info } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useDocuments } from "@/contexts/DocumentContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import BlurContainer from "@/components/ui/BlurContainer";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CloudStorage = () => {
  const { userSettings, updateUserSettings } = useUser();
  const { documents } = useDocuments();
  const [syncingStatus, setSyncingStatus] = useState<"idle" | "syncing" | "complete" | "error">("idle");
  const [syncingProgress, setSyncingProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [cloudProvider, setCloudProvider] = useState<"internal" | "google" | "dropbox" | "onedrive">(
    userSettings.cloudStorage?.provider || "internal"
  );
  const [autoSync, setAutoSync] = useState(userSettings.cloudStorage?.autoSync || false);
  const [syncFrequency, setSyncFrequency] = useState<"realtime" | "hourly" | "daily">(
    userSettings.cloudStorage?.syncFrequency || "daily"
  );
  
  // Initialize cloud storage settings if they don't exist
  useEffect(() => {
    if (!userSettings.cloudStorage) {
      updateUserSettings({
        cloudStorage: {
          enabled: true,
          provider: "internal",
          usedSpace: 0,
          totalSpace: 1024 * 1024 * 1024, // 1GB free storage
          autoSync: false,
          syncFrequency: "daily"
        }
      });
    }
  }, [userSettings, updateUserSettings]);
  
  // Calculate storage usage based on document files
  const calculateStorageUsage = () => {
    let totalUsed = 0;
    documents.forEach(doc => {
      if (doc.fileSize) {
        totalUsed += doc.fileSize;
      } else {
        // If no fileSize is available, estimate based on content (50KB per document)
        totalUsed += 50 * 1024;
      }
    });
    
    return totalUsed;
  };
  
  // Format bytes to human readable format
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  // Get current storage usage
  const storageUsed = userSettings.cloudStorage?.usedSpace || calculateStorageUsage();
  const storageTotal = userSettings.cloudStorage?.totalSpace || 1024 * 1024 * 1024; // 1GB
  const storagePercentage = Math.min(100, Math.floor((storageUsed / storageTotal) * 100));
  
  // Handle manual sync
  const handleSync = () => {
    setSyncingStatus("syncing");
    setSyncingProgress(0);
    
    // Simulate syncing progress
    const interval = setInterval(() => {
      setSyncingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setSyncingStatus("complete");
            
            // Update last sync time
            updateUserSettings({
              cloudStorage: {
                ...userSettings.cloudStorage,
                lastSync: new Date().toISOString(),
                usedSpace: calculateStorageUsage()
              }
            });
            
            toast({
              title: "Sync Complete",
              description: "All your documents have been synced to cloud storage.",
            });
            
            // Reset status after a delay
            setTimeout(() => setSyncingStatus("idle"), 3000);
          }, 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15);
      });
    }, 300);
    
    return () => clearInterval(interval);
  };
  
  // Save cloud storage settings
  const saveCloudSettings = () => {
    updateUserSettings({
      cloudStorage: {
        ...userSettings.cloudStorage,
        provider: cloudProvider,
        autoSync: autoSync,
        syncFrequency: syncFrequency
      }
    });
    
    setShowSettings(false);
    
    toast({
      title: "Settings Saved",
      description: "Your cloud storage settings have been updated.",
    });
  };
  
  // Get last sync time in readable format
  const getLastSyncTime = () => {
    if (!userSettings.cloudStorage?.lastSync) return "Never";
    
    const lastSync = new Date(userSettings.cloudStorage.lastSync);
    const now = new Date();
    const diffMs = now.getTime() - lastSync.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };
  
  return (
    <BlurContainer className="p-5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Cloud className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-medium">Cloud Storage</h3>
        </div>
        
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cloud Storage Settings</DialogTitle>
              <DialogDescription>
                Configure your cloud storage preferences.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Storage Provider</label>
                <Select value={cloudProvider} onValueChange={(value: any) => setCloudProvider(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">ApnaWallet Cloud</SelectItem>
                    <SelectItem value="google" disabled>Google Drive (Premium)</SelectItem>
                    <SelectItem value="dropbox" disabled>Dropbox (Premium)</SelectItem>
                    <SelectItem value="onedrive" disabled>OneDrive (Premium)</SelectItem>
                  </SelectContent>
                </Select>
                {cloudProvider !== "internal" && (
                  <p className="text-xs text-muted-foreground">
                    External cloud providers require a premium subscription.
                  </p>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Auto Sync</label>
                  <p className="text-xs text-muted-foreground">
                    Automatically sync documents to cloud
                  </p>
                </div>
                <Switch checked={autoSync} onCheckedChange={setAutoSync} />
              </div>
              
              {autoSync && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Sync Frequency</label>
                  <Select value={syncFrequency} onValueChange={(value: any) => setSyncFrequency(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time (Premium)</SelectItem>
                      <SelectItem value="hourly">Hourly (Premium)</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                  {(syncFrequency === "realtime" || syncFrequency === "hourly") && (
                    <p className="text-xs text-muted-foreground">
                      Higher frequency sync requires a premium subscription.
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSettings(false)}>Cancel</Button>
              <Button onClick={saveCloudSettings}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4">
        {/* Storage usage progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Storage Used: {formatBytes(storageUsed)}</span>
            <span>{formatBytes(storageTotal)} Total</span>
          </div>
          <Progress value={storagePercentage} className="h-2" />
        </div>
        
        {/* Cloud sync status */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <HardDrive className="h-4 w-4" />
            <span>Last synced: {getLastSyncTime()}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <span>{userSettings.cloudStorage?.provider === "internal" ? "ApnaWallet Cloud" : userSettings.cloudStorage?.provider}</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="pt-3 grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleSync}
            disabled={syncingStatus === "syncing"}
          >
            {syncingStatus === "idle" && <RefreshCw className="h-4 w-4" />}
            {syncingStatus === "syncing" && (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="animate-pulse">Syncing {syncingProgress}%</span>
              </>
            )}
            {syncingStatus === "complete" && <Check className="h-4 w-4 text-green-500" />}
            {syncingStatus === "error" && <X className="h-4 w-4 text-red-500" />}
            {syncingStatus === "idle" && "Sync Now"}
            {syncingStatus === "complete" && "Sync Complete"}
            {syncingStatus === "error" && "Sync Error"}
          </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button disabled className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upgrade Storage
                </Button>
              </TooltipTrigger>
              <TooltipContent className="w-80">
                <p>Upgrade to Premium to get 10GB of cloud storage and integration with external providers.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Info box */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-start gap-2 text-sm">
          <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-muted-foreground">
            All free accounts get 1GB of secure cloud storage for document backups. Upgrade to premium for 10GB storage and external cloud provider integration.
          </p>
        </div>
      </div>
    </BlurContainer>
  );
};

export default CloudStorage;
