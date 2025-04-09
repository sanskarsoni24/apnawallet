
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, DownloadCloud, Save, Shield, Upload, Key, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/UserContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface BackupSettingsProps {
  isPremium?: boolean;
}

const BackupSettings = ({ isPremium = false }: BackupSettingsProps) => {
  const { userSettings, updateUserSettings, createBackupKey, restoreFromBackupKey } = useUser();
  const [autoBackup, setAutoBackup] = useState(userSettings?.autoBackup || false);
  const [backupFrequency, setBackupFrequency] = useState(userSettings?.backupFrequency || "weekly");
  const [encryptionKeyBackup, setEncryptionKeyBackup] = useState(userSettings?.backupKeyCreated || false);
  const [cloudExport, setCloudExport] = useState<string[]>(userSettings?.cloudExportProviders || []);
  const [recoveryKey, setRecoveryKey] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState(userSettings?.recoveryEmail || "");
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [backupPassword, setBackupPassword] = useState("");
  const [confirmBackupPassword, setConfirmBackupPassword] = useState("");
  
  const handleManualBackup = () => {
    // Create backup data
    const documents = JSON.parse(localStorage.getItem("documents") || "[]");
    const backupData = {
      documents,
      userSettings,
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    };
    
    // Create backup name
    const date = new Date();
    const backupName = `surakshitlocker_backup_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    
    // Create backup history entry
    const backupHistory = JSON.parse(localStorage.getItem("backup_history") || "[]");
    backupHistory.push({
      name: backupName,
      timestamp: new Date().toISOString(),
      size: JSON.stringify(backupData).length
    });
    
    // Store backup history
    localStorage.setItem("backup_history", JSON.stringify(backupHistory));
    localStorage.setItem("latest_backup", JSON.stringify(backupData));
    
    // Create and download backup file
    const dataStr = JSON.stringify(backupData);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", `${backupName}.json`);
    linkElement.style.display = "none";
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    
    toast({
      title: "Backup complete",
      description: "Your documents have been backed up successfully.",
    });
  };
  
  const handleToggleAutoBackup = (checked: boolean) => {
    if (!isPremium) {
      toast({
        title: "Premium feature",
        description: "Automatic backups are a premium feature. Please upgrade to use this feature.",
        variant: "destructive",
      });
      return;
    }
    
    setAutoBackup(checked);
    
    // Save to user settings
    updateUserSettings({
      autoBackup: checked,
      backupFrequency
    });
    
    toast({
      title: checked ? "Automatic backups enabled" : "Automatic backups disabled",
      description: checked ? `Your documents will be backed up ${backupFrequency}.` : "Automatic backups have been disabled.",
    });
  };
  
  const handleBackupFrequencyChange = (frequency: string) => {
    setBackupFrequency(frequency);
    
    // Save to user settings
    updateUserSettings({
      backupFrequency: frequency
    });
    
    toast({
      title: "Backup frequency updated",
      description: `Your documents will now be backed up ${frequency}.`,
    });
  };
  
  const handleEncryptionKeyBackup = (checked: boolean) => {
    if (!isPremium) {
      toast({
        title: "Premium feature",
        description: "Encryption key backup is a premium feature. Please upgrade to use this feature.",
        variant: "destructive",
      });
      return;
    }
    
    setEncryptionKeyBackup(checked);
    
    if (checked) {
      setIsKeyDialogOpen(true);
    } else {
      updateUserSettings({
        backupKeyCreated: false
      });
      
      toast({
        title: "Encryption key backup disabled",
        description: "Your encryption key backup has been disabled.",
      });
    }
  };
  
  const handleSetupKeyBackup = () => {
    // Validate inputs
    if (backupPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Please use a password that is at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    if (backupPassword !== confirmBackupPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your password and confirmation match.",
        variant: "destructive",
      });
      return;
    }
    
    if (!recoveryEmail.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid recovery email address.",
        variant: "destructive",
      });
      return;
    }
    
    // Create backup key
    createBackupKey();
    
    // Save recovery email
    updateUserSettings({
      recoveryEmail,
      backupKeyCreated: true
    });
    
    // Close dialog
    setIsKeyDialogOpen(false);
    
    // Reset fields
    setBackupPassword("");
    setConfirmBackupPassword("");
    
    toast({
      title: "Recovery setup complete",
      description: "Your encryption key has been securely backed up.",
    });
  };
  
  const handleRestoreFromKey = () => {
    if (!recoveryKey) {
      toast({
        title: "Recovery key required",
        description: "Please enter your recovery key.",
        variant: "destructive",
      });
      return;
    }
    
    const success = restoreFromBackupKey(recoveryKey);
    
    if (success) {
      setIsRestoreDialogOpen(false);
      setRecoveryKey("");
    }
  };
  
  const handleCloudExport = (provider: string) => {
    if (!isPremium) {
      toast({
        title: "Premium feature",
        description: "Cloud export is a premium feature. Please upgrade to use this feature.",
        variant: "destructive",
      });
      return;
    }
    
    let newCloudExport: string[];
    
    if (cloudExport.includes(provider)) {
      newCloudExport = cloudExport.filter(p => p !== provider);
    } else {
      newCloudExport = [...cloudExport, provider];
    }
    
    setCloudExport(newCloudExport);
    
    // Save to user settings
    updateUserSettings({
      cloudExportProviders: newCloudExport
    });
    
    // Simulate export to cloud
    if (!cloudExport.includes(provider)) {
      // Create the backup data
      const documents = JSON.parse(localStorage.getItem("documents") || "[]");
      const backupData = {
        documents,
        userSettings,
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        provider
      };
      
      // Store the cloud backup data in localStorage for simulation
      localStorage.setItem(`cloud_backup_${provider}`, JSON.stringify(backupData));
      
      toast({
        title: `Connected to ${provider}`,
        description: `Your documents will now be backed up to ${provider}.`,
      });
    } else {
      // Remove the cloud backup data from localStorage
      localStorage.removeItem(`cloud_backup_${provider}`);
      
      toast({
        title: `Disconnected from ${provider}`,
        description: `Your documents will no longer be backed up to ${provider}.`,
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Backup & Export</h3>
        <p className="text-sm text-muted-foreground">
          Control how your documents are backed up and exported
        </p>
      </div>
      
      <Separator />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              Manual Backup
            </CardTitle>
            <CardDescription>
              Create an immediate backup of all your documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              This will create a secure, encrypted backup of all your documents. 
              The backup can be downloaded to your device or stored in your account.
            </p>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            <Button onClick={handleManualBackup}>
              <Download className="mr-2 h-4 w-4" />
              Create Backup Now
            </Button>
            
            <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Key className="mr-2 h-4 w-4" />
                  Restore from Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Restore from Recovery Key</DialogTitle>
                  <DialogDescription>
                    Enter your recovery key to restore your encrypted data.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="recovery-key">Recovery Key</Label>
                    <Input
                      id="recovery-key"
                      type="password"
                      value={recoveryKey}
                      onChange={(e) => setRecoveryKey(e.target.value)}
                      placeholder="Enter your recovery key"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsRestoreDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleRestoreFromKey}>Restore</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Automatic Backups
                </CardTitle>
                <CardDescription>
                  Schedule regular backups of your documents
                </CardDescription>
              </div>
              {!isPremium && (
                <Badge variant="outline" className="bg-primary/5 text-primary">Premium</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-backup" className="flex items-center gap-2">
                  Enable automatic backups
                </Label>
                <Switch
                  id="auto-backup"
                  checked={autoBackup}
                  onCheckedChange={handleToggleAutoBackup}
                  disabled={!isPremium}
                />
              </div>
              
              {autoBackup && (
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Backup frequency</Label>
                  <Select 
                    value={backupFrequency} 
                    onValueChange={handleBackupFrequencyChange}
                    disabled={!isPremium}
                  >
                    <SelectTrigger id="backup-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Encryption Key Backup
                </CardTitle>
                <CardDescription>
                  Create a secure backup of your encryption key
                </CardDescription>
              </div>
              {!isPremium && (
                <Badge variant="outline" className="bg-primary/5 text-primary">Premium</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="key-backup" className="flex items-center gap-2">
                  Enable encryption key backup
                </Label>
                <Switch
                  id="key-backup"
                  checked={encryptionKeyBackup}
                  onCheckedChange={handleEncryptionKeyBackup}
                  disabled={!isPremium}
                />
              </div>
              
              {encryptionKeyBackup && (
                <p className="text-sm text-muted-foreground">
                  Your encryption key is securely stored with additional protection.
                  {userSettings?.recoveryEmail && (
                    <span> Recovery email: {userSettings.recoveryEmail}</span>
                  )}
                </p>
              )}
            </div>
            
            <Dialog open={isKeyDialogOpen} onOpenChange={setIsKeyDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Up Key Backup</DialogTitle>
                  <DialogDescription>
                    Create a secure backup of your encryption key for account recovery
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="recovery-email">Recovery Email</Label>
                    <Input
                      id="recovery-email"
                      type="email"
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="Enter recovery email"
                    />
                    <p className="text-xs text-muted-foreground">
                      This email will be used to recover your account if you lose your password
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="backup-password">Backup Password</Label>
                    <Input
                      id="backup-password"
                      type="password"
                      value={backupPassword}
                      onChange={(e) => setBackupPassword(e.target.value)}
                      placeholder="Create a backup password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-backup-password">Confirm Backup Password</Label>
                    <Input
                      id="confirm-backup-password"
                      type="password"
                      value={confirmBackupPassword}
                      onChange={(e) => setConfirmBackupPassword(e.target.value)}
                      placeholder="Confirm backup password"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsKeyDialogOpen(false);
                    setEncryptionKeyBackup(false);
                  }}>Cancel</Button>
                  <Button onClick={handleSetupKeyBackup}>Set Up Key Backup</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
          {encryptionKeyBackup && (
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Lock className="mr-2 h-4 w-4" />
                    Manage Key Backup
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Manage Encryption Key Backup</DialogTitle>
                    <DialogDescription>
                      Your encryption key backup settings
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Recovery Email</Label>
                      <div className="flex items-center gap-2">
                        <Input value={userSettings?.recoveryEmail || ""} readOnly />
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Last Backup</Label>
                      <Input 
                        value={userSettings?.lastKeyBackup ? new Date(userSettings.lastKeyBackup).toLocaleString() : "Never"} 
                        readOnly 
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Button className="w-full">
                        Create New Backup Key
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          )}
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <DownloadCloud className="h-5 w-5" />
                  Cloud Export
                </CardTitle>
                <CardDescription>
                  Export documents to cloud storage providers
                </CardDescription>
              </div>
              {!isPremium && (
                <Badge variant="outline" className="bg-primary/5 text-primary">Premium</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Button 
                variant={cloudExport.includes("google") ? "default" : "outline"}
                className="h-auto py-4 px-3 flex flex-col items-center justify-center gap-2"
                onClick={() => handleCloudExport("google")}
                disabled={!isPremium}
              >
                <Upload className="h-6 w-6" />
                <span className="text-xs">Google Drive</span>
              </Button>
              
              <Button 
                variant={cloudExport.includes("dropbox") ? "default" : "outline"}
                className="h-auto py-4 px-3 flex flex-col items-center justify-center gap-2"
                onClick={() => handleCloudExport("dropbox")}
                disabled={!isPremium}
              >
                <Upload className="h-6 w-6" />
                <span className="text-xs">Dropbox</span>
              </Button>
              
              <Button 
                variant={cloudExport.includes("onedrive") ? "default" : "outline"}
                className="h-auto py-4 px-3 flex flex-col items-center justify-center gap-2"
                onClick={() => handleCloudExport("onedrive")}
                disabled={!isPremium}
              >
                <Upload className="h-6 w-6" />
                <span className="text-xs">OneDrive</span>
              </Button>
            </div>
            
            {cloudExport.length > 0 && isPremium && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Connected Providers</h4>
                <div className="space-y-2">
                  {cloudExport.map(provider => (
                    <div key={provider} className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4 text-primary" />
                        <span className="font-medium capitalize">{provider}</span>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Connected
                      </Badge>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    Configure Sync Settings
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BackupSettings;
