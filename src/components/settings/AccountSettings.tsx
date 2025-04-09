
import React, { useState } from "react";
import { User, Save, Mail, Shield, KeyRound } from "lucide-react";
import BlurContainer from "@/components/ui/BlurContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/contexts/UserContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface AccountSettingsProps {
  localDisplayName: string;
  setLocalDisplayName: (value: string) => void;
  localEmail: string;
  setLocalEmail: (value: string) => void;
  saveAccountSettings: () => void;
}

const AccountSettings = ({ 
  localDisplayName, 
  setLocalDisplayName, 
  localEmail, 
  setLocalEmail, 
  saveAccountSettings 
}: AccountSettingsProps) => {
  const { email } = useUser();
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  
  const handlePasswordChange = () => {
    // Basic validation
    if (!currentPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would be an API call
    // Get the mock users from localStorage
    try {
      const mockUsersJson = localStorage.getItem("mockUsers");
      if (mockUsersJson) {
        const mockUsers = JSON.parse(mockUsersJson);
        
        // Check if the user exists and if the current password matches
        if (email in mockUsers) {
          if (mockUsers[email].password === currentPassword) {
            // Update the password
            mockUsers[email].password = newPassword;
            localStorage.setItem("mockUsers", JSON.stringify(mockUsers));
            
            toast({
              title: "Success",
              description: "Your password has been updated successfully"
            });
            
            // Reset form and close dialog
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setIsChangePasswordDialogOpen(false);
          } else {
            toast({
              title: "Error",
              description: "Current password is incorrect",
              variant: "destructive"
            });
          }
        }
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating your password",
        variant: "destructive"
      });
    }
  };
  
  // Handle enabling two-factor authentication
  const handleEnable2FA = () => {
    toast({
      title: "2FA Enabled",
      description: "Two-factor authentication has been enabled for your account."
    });
    
    // In a real app, you would set up 2FA with a service like Authy or Google Authenticator
    localStorage.setItem(`2fa_enabled_${email}`, 'true');
  };
  
  return (
    <BlurContainer className="p-8 animate-fade-in bg-gradient-to-br from-white to-slate-50 dark:from-slate-900/80 dark:to-slate-800/80" style={{ animationDelay: "0.1s" }}>
      <div className="mb-6 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 flex items-center justify-center shadow-sm">
          <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Account Settings</h2>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-md font-medium mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-indigo-500" />
            Personal Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block text-slate-700 dark:text-slate-300">Display Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                className="transition-all focus-within:ring-2 focus-within:ring-indigo-500 border-slate-300 dark:border-slate-600"
                value={localDisplayName}
                onChange={(e) => setLocalDisplayName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1.5 block text-slate-700 dark:text-slate-300">Email Address</label>
              <Input
                type="email"
                placeholder="john@example.com"
                className="transition-all focus-within:ring-2 focus-within:ring-indigo-500 border-slate-300 dark:border-slate-600"
                value={localEmail}
                onChange={(e) => setLocalEmail(e.target.value)}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">This email will be used for document notifications and account recovery.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-md font-medium mb-4 flex items-center gap-2">
            <Mail className="h-4 w-4 text-indigo-500" />
            Email Preferences
          </h3>
          
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Control how you receive emails from SurakshitLocker.
          </p>
          
          <div className="space-y-2">
            {["Document Notifications", "Security Alerts", "Feature Updates"].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input type="checkbox" id={`email-pref-${index}`} defaultChecked={index < 2} className="rounded text-indigo-600 focus:ring-indigo-500" />
                <label htmlFor={`email-pref-${index}`} className="text-sm text-slate-700 dark:text-slate-300">{item}</label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <h3 className="text-md font-medium mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-indigo-500" />
            Account Security
          </h3>
          
          <div className="space-y-4">
            <div>
              <Dialog open={isChangePasswordDialogOpen} onOpenChange={setIsChangePasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-indigo-200 hover:border-indigo-300 dark:border-indigo-800 dark:hover:border-indigo-700 flex items-center gap-2"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <KeyRound className="h-5 w-5 text-indigo-500" />
                      Change Password
                    </DialogTitle>
                    <DialogDescription>
                      Update your account password to maintain security
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="current-password" className="text-sm font-medium">
                        Current Password
                      </label>
                      <Input 
                        id="current-password" 
                        type="password" 
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="new-password" className="text-sm font-medium">
                        New Password
                      </label>
                      <Input 
                        id="new-password" 
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="confirm-password" className="text-sm font-medium">
                        Confirm New Password
                      </label>
                      <Input 
                        id="confirm-password" 
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setCurrentPassword("");
                        setNewPassword("");
                        setConfirmNewPassword("");
                        setIsChangePasswordDialogOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handlePasswordChange}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                    >
                      Update Password
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <Separator className="my-4 dark:bg-slate-700" />
            
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
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button 
          className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white flex gap-2 py-2 px-4 shadow-md"
          onClick={saveAccountSettings}
        >
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </BlurContainer>
  );
};

export default AccountSettings;
