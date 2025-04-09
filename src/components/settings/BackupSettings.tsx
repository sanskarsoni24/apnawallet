
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, DownloadCloud, Save, Shield, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface BackupSettingsProps {
  isPremium?: boolean;
}

const BackupSettings = ({ isPremium = false }: BackupSettingsProps) => {
  const [autoBackup, setAutoBackup] = useState(false);
  const [backupFrequency, setBackupFrequency] = useState("weekly");
  const [encryptionKeyBackup, setEncryptionKeyBackup] = useState(false);
  const [cloudExport, setCloudExport] = useState<string[]>([]);
  
  const handleManualBackup = () => {
    toast({
      title: "Backup started",
      description: "Your backup is now being created. This may take a few moments.",
    });
    
    // Simulate backup process
    setTimeout(() => {
      toast({
        title: "Backup complete",
        description: "Your documents have been backed up successfully.",
      });
    }, 2000);
  };
  
  const handleCloudExport = (provider: string) => {
    if (cloudExport.includes(provider)) {
      setCloudExport(cloudExport.filter(p => p !== provider));
    } else {
      setCloudExport([...cloudExport, provider]);
    }
    
    if (!isPremium) {
      toast({
        title: "Premium feature",
        description: "Cloud export is a premium feature. Please upgrade to use this feature.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: `Connected to ${provider}`,
      description: `Your documents will now be backed up to ${provider}.`,
    });
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
          <CardFooter>
            <Button onClick={handleManualBackup}>
              <Download className="mr-2 h-4 w-4" />
              Create Backup Now
            </Button>
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
                  onCheckedChange={setAutoBackup}
                  disabled={!isPremium}
                />
              </div>
              
              {autoBackup && (
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Backup frequency</Label>
                  <Select 
                    value={backupFrequency} 
                    onValueChange={setBackupFrequency}
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
                  onCheckedChange={setEncryptionKeyBackup}
                  disabled={!isPremium}
                />
              </div>
              
              {encryptionKeyBackup && (
                <p className="text-sm text-muted-foreground">
                  Your encryption key will be securely stored with additional protection.
                  You will need to set up a separate recovery password.
                </p>
              )}
            </div>
          </CardContent>
          {encryptionKeyBackup && (
            <CardFooter>
              <Button disabled={!isPremium}>
                Set Up Key Backup
              </Button>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BackupSettings;
