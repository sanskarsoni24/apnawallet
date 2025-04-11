
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Volume2, Calendar, Mail, MessageSquare, Shield } from "lucide-react";
import { useDocuments } from "@/contexts/DocumentContext";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

interface DocumentReminderSettingsProps {
  document: Document;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentReminderSettings: React.FC<DocumentReminderSettingsProps> = ({
  document,
  isOpen,
  onClose
}) => {
  const { updateDocument, setCustomReminderDays, moveToSecureVault, removeFromSecureVault } = useDocuments();
  const { userSettings } = useUser();
  
  const [reminderEnabled, setReminderEnabled] = useState(document.reminderSet || false);
  const [reminderDays, setReminderDays] = useState(document.customReminderDays || userSettings?.reminderDays || 7);
  const [notificationType, setNotificationType] = useState<string>("all");
  const [secureVault, setSecureVault] = useState(document.inSecureVault || false);
  
  const handleSaveSettings = () => {
    // Update document reminder settings
    updateDocument(document.id, {
      reminderSet: reminderEnabled
    });
    
    if (reminderEnabled) {
      setCustomReminderDays(document.id, reminderDays);
    }
    
    // Handle secure vault settings
    if (secureVault !== (document.inSecureVault || false)) {
      if (secureVault) {
        moveToSecureVault(document.id);
      } else {
        removeFromSecureVault(document.id);
      }
    }
    
    toast({
      title: "Settings Saved",
      description: "Document reminder settings have been updated.",
    });
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Document Settings</DialogTitle>
          <DialogDescription>
            Configure reminders and security for "{document.title}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Bell className="h-4 w-4 text-amber-500" />
              Reminder Settings
            </h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="reminder-toggle" className="cursor-pointer">Enable due date reminder</Label>
              <Switch 
                id="reminder-toggle" 
                checked={reminderEnabled}
                onCheckedChange={setReminderEnabled}
              />
            </div>
            
            {reminderEnabled && (
              <div className="space-y-4 mt-4 pl-4 border-l-2 border-muted animate-in fade-in">
                <div className="space-y-2">
                  <Label>Remind me {reminderDays} days before due date</Label>
                  <Slider
                    value={[reminderDays]}
                    min={1}
                    max={30}
                    step={1}
                    onValueChange={(value) => setReminderDays(value[0])}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    You'll receive a reminder {reminderDays} days before the document is due.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notification-type">Notification Type</Label>
                  <Select
                    value={notificationType}
                    onValueChange={setNotificationType}
                  >
                    <SelectTrigger id="notification-type">
                      <SelectValue placeholder="Select notification type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Notifications</SelectItem>
                      <SelectItem value="email">Email Only</SelectItem>
                      <SelectItem value="push">Push Notifications Only</SelectItem>
                      <SelectItem value="voice">Voice Reminder Only</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      <span>Email</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Push</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>Voice</span>
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Calendar</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4 pt-2">
            <h3 className="font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-500" />
              Security Settings
            </h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="secure-vault-toggle" className="cursor-pointer">Store in Secure Vault</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Documents in the secure vault require authentication to access
                </p>
              </div>
              <Switch 
                id="secure-vault-toggle" 
                checked={secureVault}
                onCheckedChange={setSecureVault}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentReminderSettings;
