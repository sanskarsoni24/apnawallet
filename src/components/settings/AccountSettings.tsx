
import React from "react";
import { User } from "lucide-react";
import BlurContainer from "@/components/ui/BlurContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <BlurContainer className="p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-medium">Account Settings</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Display Name</label>
          <Input
            type="text"
            placeholder="John Doe"
            className="transition-all focus:ring-2 focus:ring-primary"
            value={localDisplayName}
            onChange={(e) => setLocalDisplayName(e.target.value)}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Email Address</label>
          <Input
            type="email"
            placeholder="john@example.com"
            className="transition-all focus:ring-2 focus:ring-primary"
            value={localEmail}
            onChange={(e) => setLocalEmail(e.target.value)}
          />
        </div>
        
        <Button 
          className="hover:bg-primary/90 transition-colors"
          onClick={saveAccountSettings}
        >
          Save Changes
        </Button>
      </div>
    </BlurContainer>
  );
};

export default AccountSettings;
