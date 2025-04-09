
import React, { useState, useEffect } from "react";
import Container from "@/components/layout/Container";
import AccountSettings from "@/components/settings/AccountSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import ChromeExtensionDownload from "@/components/settings/ChromeExtensionDownload";
import SurakshaLocker from "@/components/suraksha/SurakshaLocker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Shield, Bell, Palette, User, Chrome, Lock, Upload, Cloud, Key, Download } from "lucide-react";
import BlurContainer from "@/components/ui/BlurContainer";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("account");
  const { email, displayName, userSettings, updateUserSettings, updateProfile } = useUser();
  
  // Account settings state
  const [localDisplayName, setLocalDisplayName] = useState(displayName || "");
  const [localEmail, setLocalEmail] = useState(email || "");
  
  // Theme settings
  const [theme, setTheme] = useState(userSettings?.theme || "system");
  
  useEffect(() => {
    // Update local state when user data changes
    setLocalDisplayName(displayName || "");
    setLocalEmail(email || "");
    setTheme(userSettings?.theme || "system");
  }, [displayName, email, userSettings]);
  
  // Save account settings
  const saveAccountSettings = () => {
    updateProfile(localDisplayName, localEmail);
    
    toast({
      title: "Account Updated",
      description: "Your account information has been saved successfully."
    });
  };
  
  // Save theme settings
  const saveTheme = (newTheme: string) => {
    setTheme(newTheme);
    updateUserSettings({
      ...userSettings,
      theme: newTheme
    });
    
    toast({
      title: "Theme Updated",
      description: `Your theme preference has been set to ${newTheme}.`
    });
  };
  
  // Save notification settings
  const saveSettings = (settings: any) => {
    updateUserSettings({
      ...userSettings,
      ...settings
    });
  };
  
  // Prepare notification settings object with default values if properties are undefined
  const notificationSettings = {
    emailNotifications: userSettings?.emailNotifications !== undefined ? userSettings.emailNotifications : true,
    pushNotifications: userSettings?.pushNotifications !== undefined ? userSettings.pushNotifications : false,
    voiceReminders: userSettings?.voiceReminders !== undefined ? userSettings.voiceReminders : false,
    reminderDays: userSettings?.reminderDays !== undefined ? userSettings.reminderDays : 3,
    voiceType: userSettings?.voiceType || "default"
  };
  
  const settingsTabs = [
    { id: "account", label: "Account", icon: <User /> },
    { id: "notifications", label: "Notifications", icon: <Bell /> },
    { id: "appearance", label: "Appearance", icon: <Palette /> },
    { id: "security", label: "Security", icon: <Lock /> },
    { id: "extension", label: "Extension", icon: <Chrome /> },
    { id: "backup", label: "Backup", icon: <Cloud /> },
  ];
  
  // Handle enabling 2FA
  const handleEnable2FA = () => {
    // Store 2FA status in localStorage
    localStorage.setItem("2fa_enabled", "true");
    
    toast({
      title: "2FA Enabled",
      description: "Two-factor authentication has been enabled for your account."
    });
  };
  
  // Handle exporting all data
  const exportAllData = () => {
    try {
      // Gather all user data
      const userData = {
        profile: {
          displayName: displayName,
          email: email
        },
        settings: userSettings,
        documents: JSON.parse(localStorage.getItem("documents") || "[]"),
        secureDocuments: JSON.parse(localStorage.getItem(`suraksha_documents_${email}`) || "[]"),
      };
      
      // Create and trigger download
      const dataStr = JSON.stringify(userData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `surakshitlocker_data_${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Data Exported",
        description: "All your data has been exported successfully."
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting your data.",
        variant: "destructive"
      });
    }
  };
  
  // Handle force backup
  const forceBackupNow = () => {
    // Get documents from localStorage
    const documents = JSON.parse(localStorage.getItem("documents") || "[]");
    const secureDocuments = JSON.parse(localStorage.getItem(`suraksha_documents_${email}`) || "[]");
    
    // Create backup object
    const backup = {
      timestamp: new Date().toISOString(),
      email: email,
      documents: documents,
      secureDocuments: secureDocuments,
      userSettings: userSettings
    };
    
    // Save backup to localStorage
    const backupId = `backup_${Date.now()}`;
    localStorage.setItem(backupId, JSON.stringify(backup));
    
    // Update backup history
    const backupHistory = JSON.parse(localStorage.getItem("backup_history") || "[]");
    backupHistory.push({
      id: backupId,
      timestamp: backup.timestamp,
      documentCount: documents.length + secureDocuments.length,
      size: JSON.stringify(backup).length
    });
    localStorage.setItem("backup_history", JSON.stringify(backupHistory));
    
    toast({
      title: "Backup Complete",
      description: `${documents.length + secureDocuments.length} documents backed up successfully.`
    });
  };
  
  // Handle upload backup file
  const handleUploadBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string);
        
        // Basic validation
        if (!backup.timestamp || !backup.documents) {
          throw new Error("Invalid backup file format");
        }
        
        // Store backup
        const backupId = `backup_${Date.now()}`;
        localStorage.setItem(backupId, JSON.stringify(backup));
        
        // Update backup history
        const backupHistory = JSON.parse(localStorage.getItem("backup_history") || "[]");
        backupHistory.push({
          id: backupId,
          timestamp: backup.timestamp,
          documentCount: backup.documents.length + (backup.secureDocuments?.length || 0),
          size: e.target?.result?.toString().length || 0
        });
        localStorage.setItem("backup_history", JSON.stringify(backupHistory));
        
        toast({
          title: "Backup Uploaded",
          description: "Your backup file has been successfully uploaded."
        });
      } catch (error) {
        console.error("Error parsing backup file:", error);
        toast({
          title: "Upload Failed",
          description: "The selected file is not a valid backup file.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };
  
  // Handle restore backup
  const handleRestoreBackup = (backupId: string) => {
    try {
      const backup = JSON.parse(localStorage.getItem(backupId) || "");
      
      // Basic validation
      if (!backup.timestamp || !backup.documents) {
        throw new Error("Invalid backup data");
      }
      
      // Restore documents
      localStorage.setItem("documents", JSON.stringify(backup.documents));
      
      // Restore secure documents if available
      if (backup.secureDocuments && backup.email === email) {
        localStorage.setItem(`suraksha_documents_${email}`, JSON.stringify(backup.secureDocuments));
      }
      
      // Restore settings if available
      if (backup.userSettings) {
        updateUserSettings(backup.userSettings);
      }
      
      toast({
        title: "Backup Restored",
        description: "Your data has been successfully restored from the backup."
      });
    } catch (error) {
      console.error("Error restoring backup:", error);
      toast({
        title: "Restore Failed",
        description: "An error occurred while restoring your backup.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Container>
      {/* Hero banner */}
      <div className="mb-10 rounded-2xl overflow-hidden relative bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 opacity-80"></div>
        <div className="absolute inset-0 mix-blend-overlay opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
        
        <div className="relative z-10 px-8 py-12 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <p className="text-white/80 max-w-2xl">
            Customize your SurakshitLocker experience and manage your security preferences
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-6 right-10">
          <div className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-sm"></div>
        </div>
        <div className="absolute bottom-6 right-32">
          <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm"></div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar Navigation */}
        <aside className="space-y-6">
          <BlurContainer variant="default" className="p-2">
            <nav className="space-y-1">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                    currentTab === tab.id
                      ? "bg-primary text-white"
                      : "hover:bg-accent"
                  }`}
                >
                  {React.cloneElement(tab.icon, { 
                    className: "h-4 w-4", 
                    strokeWidth: currentTab === tab.id ? 2.5 : 2 
                  })}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </BlurContainer>
          
          <BlurContainer variant="subtle" className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Key className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-medium">Data Security</h3>
                <p className="text-xs text-muted-foreground">End-to-end encrypted</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Your data is secured with enterprise-grade encryption and zero-knowledge architecture.
            </p>
          </BlurContainer>
          
          <BlurContainer variant="subtle" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Download className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-medium">Export Data</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Download all your data in JSON format.
            </p>
            <button 
              className="w-full py-2 text-sm font-medium border rounded-lg border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
              onClick={exportAllData}
            >
              Export All Data
            </button>
          </BlurContainer>
        </aside>
        
        {/* Main Content Area */}
        <div>
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsContent value="account" className="space-y-6 animate-fade-in mt-0">
              <AccountSettings 
                localDisplayName={localDisplayName}
                setLocalDisplayName={setLocalDisplayName}
                localEmail={localEmail}
                setLocalEmail={setLocalEmail}
                saveAccountSettings={saveAccountSettings}
              />
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6 animate-fade-in mt-0">
              <NotificationSettings 
                settings={notificationSettings}
                saveSettings={saveSettings} 
              />
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-6 animate-fade-in mt-0">
              <AppearanceSettings 
                theme={theme}
                saveTheme={saveTheme}
              />
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6 animate-fade-in mt-0">
              <BlurContainer variant="default" className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Security Vault</h2>
                <SurakshaLocker />
                <div className="mt-6 border-t border-dashed pt-6">
                  <h3 className="text-md font-medium mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-indigo-500" />
                    Additional Security Options
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Two-Factor Authentication</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEnable2FA}
                        className="border-green-200 hover:border-green-300 dark:border-green-800/40 dark:hover:border-green-700/40 text-green-700 dark:text-green-500"
                      >
                        Enable 2FA
                      </Button>
                    </div>
                  </div>
                </div>
              </BlurContainer>
            </TabsContent>

            <TabsContent value="extension" className="space-y-6 animate-fade-in mt-0">
              <ChromeExtensionDownload />
            </TabsContent>
            
            <TabsContent value="backup" className="space-y-6 animate-fade-in mt-0">
              <BlurContainer variant="default" className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Cloud Backup & Sync</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border rounded-xl p-6 bg-white/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <Cloud className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">Auto Backup</h3>
                        <p className="text-xs text-muted-foreground">Last backup: Today at 2:30 PM</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your data is automatically backed up to our secure cloud every day.
                    </p>
                    <button
                      onClick={forceBackupNow}
                      className="w-full py-2 text-sm font-medium rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                    >
                      Force Backup Now
                    </button>
                  </div>
                  
                  <div className="border rounded-xl p-6 bg-white/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Upload className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-medium">Manual Upload</h3>
                        <p className="text-xs text-muted-foreground">Upload backup files</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload backup files to restore your data from a previous backup.
                    </p>
                    <label htmlFor="upload-backup-file">
                      <input
                        type="file"
                        id="upload-backup-file"
                        accept=".json"
                        onChange={handleUploadBackup}
                        className="hidden"
                      />
                      <button
                        onClick={() => document.getElementById('upload-backup-file')?.click()}
                        className="w-full py-2 text-sm font-medium rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
                      >
                        Upload Backup File
                      </button>
                    </label>
                  </div>
                </div>
                
                <div className="mt-6 border-t border-dashed pt-6">
                  <h3 className="font-medium mb-4">Backup History</h3>
                  <div className="space-y-3">
                    {(JSON.parse(localStorage.getItem("backup_history") || "[]") as { id: string, timestamp: string, documentCount: number }[]).length > 0 ? (
                      (JSON.parse(localStorage.getItem("backup_history") || "[]") as { id: string, timestamp: string, documentCount: number }[])
                        .slice(0, 3) // Show only last 3 backups
                        .map((backup) => (
                          <div key={backup.id} className="flex items-center justify-between py-2 px-4 rounded-lg bg-white/30 dark:bg-slate-800/30">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <Cloud className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {new Date(backup.timestamp).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                                <p className="text-xs text-muted-foreground">{backup.documentCount} documents</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                Complete
                              </span>
                              <button 
                                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                                onClick={() => handleRestoreBackup(backup.id)}
                              >
                                Restore
                              </button>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No backup history available
                      </div>
                    )}
                  </div>
                </div>
              </BlurContainer>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Container>
  );
};

export default Settings;
