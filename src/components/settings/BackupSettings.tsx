import React, { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { CloudCog, Download, Upload, Lock, Key, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BackupSettingsProps {
  isPremium: boolean;
}

const BackupSettings: React.FC<BackupSettingsProps> = ({ isPremium }) => {
  const { userSettings, updateUserSettings, createBackupKey, restoreFromBackupKey } = useUser();
  const [backupKey, setBackupKey] = useState("");
  const [restoreKey, setRestoreKey] = useState("");
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showBackupKey, setShowBackupKey] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [backupDialogOpen, setBackupDialogOpen] = useState(false);
  
  const updateBackupFrequency = (frequency: "daily" | "weekly" | "monthly" | "never") => {
    updateUserSettings({
      backupFrequency: frequency
    });
    
    toast({
      title: "Backup frequency updated",
      description: `Your documents will now be backed up ${frequency}.`,
    });
  };
  
  const toggleAutoBackup = (enabled: boolean) => {
    updateUserSettings({
      autoBackup: enabled
    });
    
    toast({
      title: enabled ? "Auto backup enabled" : "Auto backup disabled",
      description: enabled 
        ? "Your documents will be automatically backed up." 
        : "Automatic backups have been disabled.",
    });
  };
  
  const handleGenerateBackupKey = async () => {
    setIsGeneratingKey(true);
    try {
      if (createBackupKey) {
        const key = await createBackupKey();
        setBackupKey(key);
        setShowBackupKey(false);
        setBackupDialogOpen(true);
      }
    } catch (error) {
      toast({
        title: "Error generating backup key",
        description: "There was a problem generating your backup key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingKey(false);
    }
  };
  
  const handleRestoreFromKey = async () => {
    if (!restoreKey.trim()) {
      toast({
        title: "Backup key required",
        description: "Please enter a valid backup key to restore your data.",
        variant: "destructive",
      });
      return;
    }
    
    setIsRestoring(true);
    try {
      if (restoreFromBackupKey) {
        const success = await restoreFromBackupKey(restoreKey);
        if (success) {
          toast({
            title: "Restore successful",
            description: "Your data has been successfully restored from the backup key.",
          });
          setRestoreKey("");
        } else {
          throw new Error("Restore failed");
        }
      }
    } catch (error) {
      toast({
        title: "Restore failed",
        description: "The backup key is invalid or the restore process failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRestoring(false);
    }
  };
  
  const copyBackupKey = () => {
    navigator.clipboard.writeText(backupKey);
    toast({
      title: "Backup key copied",
      description: "The backup key has been copied to your clipboard.",
    });
  };
  
  const handleExportData = () => {
    setIsExporting(true);
    setExportProgress(0);
    
    // Simulate export process
    const interval = setInterval(() => {
      setExportProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          
          // Create a mock JSON file for download
          const mockData = {
            userSettings,
            documents: [
              { id: "doc1", title: "Sample Document 1", type: "passport" },
              { id: "doc2", title: "Sample Document 2", type: "id_card" }
            ]
          };
          
          const dataStr = JSON.stringify(mockData, null, 2);
          const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
          
          const exportFileDefaultName = `surakshit-backup-${new Date().toISOString().slice(0, 10)}.json`;
          
          const linkElement = document.createElement('a');
          linkElement.setAttribute('href', dataUri);
          linkElement.setAttribute('download', exportFileDefaultName);
          linkElement.click();
          
          toast({
            title: "Export complete",
            description: "Your data has been exported successfully.",
          });
        }
        return newProgress;
      });
    }, 300);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudCog className="h-5 w-5" />
            Backup Settings
          </CardTitle>
          <CardDescription>
            Configure how and when your documents are backed up
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-backup" className="text-base">Automatic Backup</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically backup your documents to secure cloud storage
                </p>
              </div>
              <Switch 
                id="auto-backup" 
                checked={userSettings?.autoBackup} 
                onCheckedChange={toggleAutoBackup}
              />
            </div>
            
            {userSettings?.autoBackup && (
              <div className="space-y-2 pt-2">
                <Label className="text-sm">Backup Frequency</Label>
                <RadioGroup 
                  defaultValue={userSettings?.backupFrequency || "weekly"}
                  onValueChange={(value) => updateBackupFrequency(value as "daily" | "weekly" | "monthly" | "never")}
                  className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                >
                  <div>
                    <RadioGroupItem 
                      value="daily" 
                      id="daily" 
                      className="peer sr-only" 
                      disabled={!isPremium}
                    />
                    <Label
                      htmlFor="daily"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="text-sm font-medium">Daily</span>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem 
                      value="weekly" 
                      id="weekly" 
                      className="peer sr-only" 
                    />
                    <Label
                      htmlFor="weekly"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <span className="text-sm font-medium">Weekly</span>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem 
                      value="monthly" 
                      id="monthly" 
                      className="peer sr-only" 
                    />
                    <Label
                      htmlFor="monthly"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <span className="text-sm font-medium">Monthly</span>
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem 
                      value="never" 
                      id="never" 
                      className="peer sr-only" 
                    />
                    <Label
                      htmlFor="never"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <span className="text-sm font-medium">Never</span>
                    </Label>
                  </div>
                </RadioGroup>
                
                {!isPremium && (
                  <p className="text-xs text-muted-foreground">
                    Daily backups are available with Premium subscription
                  </p>
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <div>
              <h3 className="text-base font-medium mb-1">Manual Backup & Restore</h3>
              <p className="text-sm text-muted-foreground">
                Export your data or restore from a previous backup
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleExportData}
                disabled={isExporting}
              >
                <Download className="h-4 w-4" />
                {isExporting ? "Exporting..." : "Export Data"}
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Import Data
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Data</DialogTitle>
                    <DialogDescription>
                      Upload a backup file to restore your data
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="backup-file">Backup File</Label>
                      <Input id="backup-file" type="file" accept=".json" />
                    </div>
                    
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Warning</AlertTitle>
                      <AlertDescription>
                        Importing data will overwrite your current settings and documents. This action cannot be undone.
                      </AlertDescription>
                    </Alert>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                    <Button type="button">
                      Import
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {isExporting && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Exporting data...</span>
                  <span>{exportProgress}%</span>
                </div>
                <Progress value={exportProgress} className="h-2" />
              </div>
            )}
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <div>
              <h3 className="text-base font-medium mb-1">Backup Key</h3>
              <p className="text-sm text-muted-foreground">
                Generate a backup key to restore your data on any device
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleGenerateBackupKey}
                disabled={isGeneratingKey}
              >
                <Key className="h-4 w-4" />
                {isGeneratingKey ? "Generating..." : "Generate Backup Key"}
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Restore from Key
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Restore from Backup Key</DialogTitle>
                    <DialogDescription>
                      Enter your backup key to restore your data
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="restore-key">Backup Key</Label>
                      <Input 
                        id="restore-key" 
                        value={restoreKey}
                        onChange={(e) => setRestoreKey(e.target.value)}
                        placeholder="Enter your backup key"
                      />
                    </div>
                    
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Warning</AlertTitle>
                      <AlertDescription>
                        Restoring from a backup key will overwrite your current settings and documents. This action cannot be undone.
                      </AlertDescription>
                    </Alert>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="button" 
                      onClick={handleRestoreFromKey}
                      disabled={isRestoring || !restoreKey.trim()}
                    >
                      {isRestoring ? "Restoring..." : "Restore"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {userSettings?.backupKeyCreated && (
              <div className="text-sm">
                <p className="text-muted-foreground">
                  Last backup key created: {userSettings.lastKeyBackup ? new Date(userSettings.lastKeyBackup).toLocaleDateString() : "Unknown"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={backupDialogOpen} onOpenChange={setBackupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Backup Key</DialogTitle>
            <DialogDescription>
              Save this key in a secure location. You'll need it to restore your data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="relative">
              <Input 
                value={backupKey}
                readOnly
                type={showBackupKey ? "text" : "password"}
                className="pr-20"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-10"
                onClick={() => setShowBackupKey(!showBackupKey)}
              >
                {showBackupKey ? "Hide" : "Show"}
              </Button>
            </div>
            
            <Alert>
              <Key className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                This key will not be shown again. Please copy it and store it securely.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button type="button" onClick={copyBackupKey}>
              Copy Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BackupSettings;
