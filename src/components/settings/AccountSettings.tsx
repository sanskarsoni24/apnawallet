
import React from "react";
import { User, Save, Mail, Shield } from "lucide-react";
import BlurContainer from "@/components/ui/BlurContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

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
              <Button 
                variant="outline"
                size="sm"
                className="border-indigo-200 hover:border-indigo-300 dark:border-indigo-800 dark:hover:border-indigo-700"
              >
                Change Password
              </Button>
            </div>
            
            <Separator className="my-4 dark:bg-slate-700" />
            
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Two-Factor Authentication</p>
              <Button
                variant="outline"
                size="sm"
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
