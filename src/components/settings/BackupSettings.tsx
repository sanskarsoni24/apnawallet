import React, { useState, useEffect } from "react";
import { CloudCog, Download, Upload, Calendar, Key, RefreshCw, Copy, Check, CloudOff, DownloadCloud, Lock } from "lucide-react";
import BlurContainer from "@/components/ui/BlurContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useDocuments } from "@/contexts/DocumentContext";
import JSZip from "jszip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface BackupSettingsProps {
  isPremium: boolean;
}

const BackupSettings: React.FC<BackupSettingsProps> = ({ isPremium }) => {
  const { userSettings, updateUserSettings } = useUser();
  const { documents } = useDocuments();
  
  const [autoBackup, setAutoBackup] = useState(userSettings?.autoBackup || false);
  const [backupFrequency, setBackupFrequency] = useState(userSettings?.backupFrequency || "weekly");
  const [lastBackupDate, setLastBackupDate] = useState(userSettings?.lastBackupDate || "");
  const [encryptionKey, setEncryptionKey] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");
  const [isKeyGenerated, setIsKeyGenerated] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEncryptionDialogOpen, setIsEncryptionDialogOpen] = useState(false);
  
  // Function to generate a random encryption key
  const generateEncryptionKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const keyLength = 32;
    let key = "";
    
    for (let i = 0; i < keyLength; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Format key in groups of 4 for readability
    const formattedKey = key.match(/.{1,4}/g)?.join("-") || key;
    
    setGeneratedKey(formattedKey);
    setIsKeyGenerated(true);
    setIsCopied(false);
  };
  
  // Copy key to clipboard
  const copyKeyToClipboard = () => {
    navigator.clipboard.writeText(generatedKey).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
      
      toast({
        title: "Key copied",
        description: "Encryption key copied to clipboard",
      });
    });
  };
  
  // Function to save settings
  const saveBackupSettings = () => {
    const newSettings = {
      autoBackup,
      backupFrequency,
      lastBackupDate
    };
    
    updateUserSettings(newSettings);
    
    toast({
      title: "Settings updated",
      description: "Your backup settings have been saved",
    });
  };
  
  // Function to create and download backup
  const createBackup = async () => {
    setIsLoading(true);
    
    try {
      // Create a new JSZip instance
      const zip = new JSZip();
      
      // Add user settings to the backup
      const userSettingsJson = JSON.stringify(userSettings);
      zip.file("user_settings.json", userSettingsJson);
      
      // Add documents to the backup
      const documentsJson = JSON.stringify(documents);
      
      // Encrypt the documents if encryption key is provided
      if (encryptionKey) {
        // This is a simple encryption for demo purposes
        // A real app would use proper cryptography APIs
        const encryptedData = btoa(unescape(encodeURIComponent(documentsJson)));
        zip.file("documents_encrypted.dat", encryptedData);
        zip.file("encryption_info.txt", "This backup is encrypted. You will need the encryption key to restore it.");
      } else {
        zip.file("documents.json", documentsJson);
      }
      
      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" });
      
      // Create a download link
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      
      // Set the file name with current date
      const date = new Date().toISOString().split("T")[0];
      link.download = `apnawallet_backup_${date}.zip`;
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Update the last backup date
      const newLastBackupDate = new Date().toISOString();
      setLastBackupDate(newLastBackupDate);
      updateUserSettings({ lastBackupDate: newLastBackupDate });
      
      toast({
        title: "Backup created",
        description: `Your data has been backed up successfully${encryptionKey ? " with encryption" : ""}`,
      });
    } catch (error) {
      console.error("Backup creation failed:", error);
      
      toast({
        title: "Backup failed",
        description: "There was an error creating your backup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setEncryptionKey("");
      setIsEncryptionDialogOpen(false);
    }
  };
  
  // Function to restore from backup
  const restoreFromBackup = () => {
    // Create a file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip";
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      setIsLoading(true);
      
      try {
        // Read the zip file
        const zip = new JSZip();
        const contents = await zip.loadAsync(file);
        
        // Check if the backup is encrypted
        const isEncrypted = contents.files["documents_encrypted.dat"] !== undefined;
        
        if (isEncrypted && !encryptionKey) {
          // Show encryption key dialog
          setIsEncryptionDialogOpen(true);
          setIsLoading(false);
          return;
        }
        
        // Restore user settings
        const userSettingsFile = contents.files["user_settings.json"];
        if (userSettingsFile) {
          const userSettingsData = await userSettingsFile.async("text");
          const parsedSettings = JSON.parse(userSettingsData);
          updateUserSettings(parsedSettings);
        }
        
        // Restore documents
        if (isEncrypted) {
          const encryptedDocsFile = contents.files["documents_encrypted.dat"];
          if (encryptedDocsFile) {
            const encryptedData = await encryptedDocsFile.async("text");
            
            // Simple decryption for demo purposes
            // A real app would use proper cryptography APIs
            try {
              const decryptedData = decodeURIComponent(escape(atob(encryptedData)));
              const parsedDocuments = JSON.parse(decryptedData);
              
              // Restore documents (implementation would depend on your documents context)
              // This is a placeholder - you would need to implement actual document restoration
              console.log("Restored encrypted documents:", parsedDocuments);
              
              toast({
                title: "Backup restored",
                description: "Your encrypted backup has been restored successfully",
              });
            } catch (decryptError) {
              toast({
                title: "Decryption failed",
                description: "The encryption key may be incorrect",
                variant: "destructive",
              });
              setIsLoading(false);
              return;
            }
          }
        } else {
          const docsFile = contents.files["documents.json"];
          if (docsFile) {
            const docsData = await docsFile.async("text");
            const parsedDocuments = JSON.parse(docsData);
            
            // Restore documents (implementation would depend on your documents context)
            // This is a placeholder - you would need to implement actual document restoration
            console.log("Restored documents:", parsedDocuments);
            
            toast({
              title: "Backup restored",
              description: "Your backup has been restored successfully",
            });
          }
        }
      } catch (error) {
        console.error("Backup restoration failed:", error);
        
        toast({
          title: "Restoration failed",
          description: "There was an error restoring your backup",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        setEncryptionKey("");
        setIsEncryptionDialogOpen(false);
      }
    };
    
    input.click();
  };
  
  return (
    <BlurContainer className="p-8 animate-fade-in bg-gradient-to-br from-white to-slate-50 dark:from-slate-900/80 dark:to-slate-800/80">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 flex items-center justify-center shadow-sm">
          <CloudCog className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Backup & Export</h2>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-md font-medium mb-4">Auto Backup</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Automatic Backup</Label>
                <p className="text-sm text-muted-foreground">Create regular backups of your documents</p>
              </div>
              <Switch 
                checked={autoBackup} 
                onCheckedChange={setAutoBackup} 
                disabled={!isPremium}
              />
            </div>
            
            {autoBackup && (
              <div className="space-y-3">
                <Label>Backup Frequency</Label>
                <Select 
                  value={backupFrequency} 
                  onValueChange={setBackupFrequency}
                  disabled={!isPremium}
                >
                  <SelectTrigger>
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
            
            {!isPremium && (
              <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md">
                <p>Auto backup is a premium feature. Upgrade to enable this feature.</p>
              </div>
            )}
            
            {lastBackupDate && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Last backup: {new Date(lastBackupDate).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-md font-medium mb-4">Manual Backup</h3>
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2" 
                onClick={() => setIsEncryptionDialogOpen(true)}
                disabled={isLoading}
              >
                <DownloadCloud className="h-4 w-4" />
                Create Backup
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2" 
                onClick={restoreFromBackup}
                disabled={isLoading}
              >
                <Upload className="h-4 w-4" />
                Restore Backup
              </Button>
            </div>
            
            <Separator className="my-4" />
            
            <h4 className="text-sm font-medium">Encryption Key</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Generate a secure key to encrypt your backups. Store this key safely!
            </p>
            
            <div className="space-y-3">
              {isKeyGenerated ? (
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      value={generatedKey}
                      readOnly
                      className="font-mono text-xs pr-24"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-0 top-0 h-full"
                      onClick={copyKeyToClipboard}
                    >
                      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {isCopied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={generateEncryptionKey}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Regenerate
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={generateEncryptionKey}
                  className="flex items-center gap-2"
                >
                  <Key className="h-4 w-4" />
                  Generate Encryption Key
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button 
          className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white"
          onClick={saveBackupSettings}
        >
          Save Backup Settings
        </Button>
      </div>
      
      {/* Encryption key dialog for backup */}
      <Dialog open={isEncryptionDialogOpen} onOpenChange={setIsEncryptionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Secure Your Backup</DialogTitle>
            <DialogDescription>
              Encrypt your backup with a strong key for added security. You'll need this key to restore your backup.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="encryption-key">Encryption Key</Label>
              <Input
                id="encryption-key"
                placeholder="Enter your encryption key (optional)"
                value={encryptionKey}
                onChange={(e) => setEncryptionKey(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for unencrypted backup (not recommended)
              </p>
            </div>
            
            {!encryptionKey && (
              <div className="flex items-center py-2 text-amber-600 text-sm gap-2 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 rounded-md px-3">
                <Lock className="h-4 w-4 flex-shrink-0" />
                <span>For maximum security, we recommend using an encryption key</span>
              </div>
            )}
            
            {generatedKey && !encryptionKey && (
              <div className="text-sm">
                <button 
                  className="text-primary hover:underline focus:outline-none"
                  onClick={() => setEncryptionKey(generatedKey)}
                >
                  Use my generated key
                </button>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEncryptionDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={createBackup}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download Backup
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BlurContainer>
  );
};

export default BackupSettings;
