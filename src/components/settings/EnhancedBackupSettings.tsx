
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Save, Download, Cloud, Database, Lock, AlertTriangle, Calendar, Check, History, Key } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const EnhancedBackupSettings = () => {
  const { userSettings, updateUserSettings, createBackupKey, restoreFromBackupKey } = useUser();
  const [backupPassword, setBackupPassword] = useState("");
  const [restoreKey, setRestoreKey] = useState("");
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [recoveryKeyInput, setRecoveryKeyInput] = useState("");
  const [generatingKey, setGeneratingKey] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  
  const handleCreateBackup = () => {
    setIsCreatingBackup(true);
    
    // Simulate backup creation process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setBackupProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsCreatingBackup(false);
        
        // Update backup information
        const now = new Date().toISOString();
        updateUserSettings({
          lastBackup: now,
          lastBackupStatus: 'success',
          backupSize: Math.floor(Math.random() * 10) + 1, // random size between 1-10 MB
          backupEncrypted: userSettings.backupPassword ? true : false
        });
        
        toast({
          title: "Backup Created Successfully",
          description: "Your data has been backed up securely"
        });
      }
    }, 300);
  };
  
  const handleToggleAutoBackup = (enabled: boolean) => {
    updateUserSettings({
      autoBackup: enabled,
      lastAutoBackupAttempt: enabled ? new Date().toISOString() : userSettings.lastAutoBackupAttempt
    });
    
    toast({
      title: enabled ? "Automatic Backup Enabled" : "Automatic Backup Disabled",
      description: enabled ? "Your data will be backed up automatically" : "Automatic backup has been turned off"
    });
  };
  
  const handleBackupFrequencyChange = (value: string) => {
    updateUserSettings({
      backupFrequency: value as 'daily' | 'weekly' | 'monthly' | 'never'
    });
    
    toast({
      title: "Backup Frequency Updated",
      description: `Automatic backups set to ${value}`
    });
  };
  
  const handleSetEncryptionPassword = () => {
    if (backupPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Encryption password must be at least 8 characters",
        variant: "destructive"
      });
      return;
    }
    
    updateUserSettings({
      backupPassword: backupPassword,
      backupEncrypted: true
    });
    
    setShowPasswordDialog(false);
    
    toast({
      title: "Encryption Password Set",
      description: "Your backups will now be encrypted with this password"
    });
  };
  
  const handleGenerateRecoveryKey = () => {
    setGeneratingKey(true);
    
    // Simulate key generation process
    setTimeout(() => {
      createBackupKey();
      setGeneratingKey(false);
      
      // Update recovery key information
      const now = new Date().toISOString();
      const newKey = generateRandomKey();
      const currentKeys = userSettings.recoveryKeys || [];
      
      updateUserSettings({
        recoveryKeys: [...currentKeys, newKey],
        recoveryKeyLastGenerated: now
      });
      
      toast({
        title: "Recovery Key Generated",
        description: "Keep this key safe for account recovery"
      });
    }, 1500);
  };
  
  const handleRestoreFromKey = () => {
    if (!recoveryKeyInput) {
      toast({
        title: "Recovery Key Required",
        description: "Please enter a recovery key",
        variant: "destructive"
      });
      return;
    }
    
    const success = restoreFromBackupKey(recoveryKeyInput);
    
    if (success) {
      // Add to usage history
      const usageHistory = userSettings.recoveryKeyUsageHistory || [];
      const now = new Date().toISOString();
      
      updateUserSettings({
        recoveryKeyUsageHistory: [...usageHistory, {date: now, keyId: recoveryKeyInput.substring(0, 8)}]
      });
      
      setShowRestoreDialog(false);
      setRecoveryKeyInput("");
    }
  };
  
  // Helper function to generate a random key
  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let key = '';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    try {
      return format(new Date(dateString), 'PPP p');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <Tabs defaultValue="backups">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="backups">Backup Management</TabsTrigger>
        <TabsTrigger value="recovery">Recovery Keys</TabsTrigger>
      </TabsList>
      
      <TabsContent value="backups">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              Enhanced Backup Management
            </CardTitle>
            <CardDescription>
              Secure your data with regular backups and encryption
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Backup Status */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Last Backup</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  {formatDate(userSettings.lastBackup)}
                  {userSettings.lastBackupStatus && (
                    <Badge className="ml-2" variant={
                      userSettings.lastBackupStatus === 'success' ? 'default' : 
                      userSettings.lastBackupStatus === 'failed' ? 'destructive' : 'outline'
                    }>
                      {userSettings.lastBackupStatus}
                    </Badge>
                  )}
                </div>
                {userSettings.backupSize && (
                  <div className="text-xs text-muted-foreground">
                    Size: {userSettings.backupSize} MB
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {userSettings.backupEncrypted && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Lock className="h-3 w-3 mr-1" />
                    Encrypted
                  </Badge>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCreateBackup}
                  disabled={isCreatingBackup}
                >
                  {isCreatingBackup ? "Creating..." : "Create Backup"}
                </Button>
              </div>
            </div>
            
            {isCreatingBackup && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Backup in progress...</div>
                <Progress value={backupProgress} />
              </div>
            )}
            
            {/* Auto Backup Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically backup your data on a schedule
                  </p>
                </div>
                <Switch
                  checked={userSettings.autoBackup}
                  onCheckedChange={handleToggleAutoBackup}
                />
              </div>
              
              {userSettings.autoBackup && (
                <div className="grid gap-2">
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <Select
                    defaultValue={userSettings.backupFrequency || 'weekly'}
                    onValueChange={handleBackupFrequencyChange}
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
                  
                  {userSettings.lastAutoBackupAttempt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Last automatic backup attempt: {formatDate(userSettings.lastAutoBackupAttempt)}
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {/* Backup Encryption */}
            <div className="space-y-2">
              <Label className="text-base">Backup Encryption</Label>
              <p className="text-sm text-muted-foreground">
                Set a password to encrypt your backups for additional security
              </p>
              
              {userSettings.backupEncrypted ? (
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Lock className="h-3 w-3 mr-1" />
                      Encryption Enabled
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowPasswordDialog(true)}>
                    Change Password
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setShowPasswordDialog(true)}
                  className="mt-2"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Set Encryption Password
                </Button>
              )}
            </div>
          </CardContent>
          
          <CardFooter>
            <Alert className="mt-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                We recommend enabling backup encryption and saving your recovery keys in a secure location.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="recovery">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Recovery Keys Management
            </CardTitle>
            <CardDescription>
              Generate and manage recovery keys for account restoration
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Recovery Keys</h3>
                <Badge variant="outline">
                  {userSettings.recoveryKeys?.length || 0} Keys
                </Badge>
              </div>
              
              {userSettings.recoveryKeyLastGenerated && (
                <p className="text-sm text-muted-foreground mb-4">
                  Last key generated: {formatDate(userSettings.recoveryKeyLastGenerated)}
                </p>
              )}
              
              <div className="flex flex-col gap-2 mb-4">
                {userSettings.recoveryKeys?.map((key, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                    <code>•••••••••••{key.substring(key.length - 8)}</code>
                    <Badge variant={index === 0 ? "default" : "outline"}>
                      {index === 0 ? "Primary" : `Key ${index + 1}`}
                    </Badge>
                  </div>
                ))}
                
                {(!userSettings.recoveryKeys || userSettings.recoveryKeys.length === 0) && (
                  <p className="text-sm text-muted-foreground">No recovery keys generated yet.</p>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleGenerateRecoveryKey} 
                  disabled={generatingKey}
                  variant="outline"
                >
                  {generatingKey ? "Generating..." : "Generate New Key"}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowRestoreDialog(true)}
                >
                  Restore Using Key
                </Button>
              </div>
            </div>
            
            {userSettings.recoveryKeyUsageHistory && userSettings.recoveryKeyUsageHistory.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Recovery Key Usage History
                </h3>
                <div className="rounded-lg border">
                  {userSettings.recoveryKeyUsageHistory.map((usage, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border-b last:border-b-0">
                      <span className="text-sm">Key ID: {usage.keyId}...</span>
                      <span className="text-xs text-muted-foreground">{formatDate(usage.date)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <Alert className="mt-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Recovery Key Security</AlertTitle>
              <AlertDescription>
                Store recovery keys in a secure location. Anyone with access to your recovery keys can restore your account.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      </TabsContent>
      
      {/* Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Encryption Password</DialogTitle>
            <DialogDescription>
              This password will be used to encrypt your backups.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="encryption-password">Encryption Password</Label>
              <Input
                id="encryption-password"
                type="password"
                value={backupPassword}
                onChange={(e) => setBackupPassword(e.target.value)}
                placeholder="Enter a strong password"
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters. Use a mix of letters, numbers, and symbols.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSetEncryptionPassword}>
              Set Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Restore Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Restore Using Recovery Key</DialogTitle>
            <DialogDescription>
              Enter your recovery key to restore your account.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="recovery-key">Recovery Key</Label>
              <Input
                id="recovery-key"
                value={recoveryKeyInput}
                onChange={(e) => setRecoveryKeyInput(e.target.value)}
                placeholder="Enter your recovery key"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRestoreFromKey}>
              Restore
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
};

export default EnhancedBackupSettings;
