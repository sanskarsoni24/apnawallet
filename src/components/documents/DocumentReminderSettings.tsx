
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Shield, ShieldOff } from "lucide-react";
import { Document, useDocuments } from "@/contexts/DocumentContext";
import { toast } from "@/hooks/use-toast";
import { format, isValid, parseISO } from "date-fns";

interface DocumentReminderSettingsProps {
  document: Document;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentReminderSettings: React.FC<DocumentReminderSettingsProps> = ({
  document,
  isOpen,
  onClose,
}) => {
  const { updateDocument, moveToSecureVault, removeFromSecureVault } = useDocuments();
  
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(document.customReminderDays !== undefined);
  const [reminderDays, setReminderDays] = useState<number>(document.customReminderDays || 7);
  
  const handleSave = () => {
    updateDocument(document.id, {
      customReminderDays: reminderEnabled ? reminderDays : undefined
    });
    
    toast({
      title: "Reminder Settings Updated",
      description: reminderEnabled
        ? `You'll be reminded ${reminderDays} days before the due date.`
        : "Reminders have been disabled for this document."
    });
    
    onClose();
  };

  const handleVaultToggle = () => {
    if (document.inSecureVault) {
      removeFromSecureVault(document.id);
      toast({
        title: "Document Removed from Secure Vault",
        description: "This document is no longer in your secure vault."
      });
    } else {
      moveToSecureVault(document.id);
      toast({
        title: "Document Added to Secure Vault",
        description: "This document has been moved to your secure vault."
      });
    }
  };
  
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "Not set";
    
    try {
      const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
      return isValid(date) ? format(date, "MMMM d, yyyy") : "Invalid date";
    } catch {
      return "Invalid date";
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Document Reminder Settings
          </DialogTitle>
          <DialogDescription>
            Configure reminder settings for "{document.title}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {document.dueDate && (
            <div className="flex flex-col space-y-1.5">
              <Label>Due Date</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(document.dueDate)}</span>
                {document.daysRemaining !== undefined && document.daysRemaining >= 0 && (
                  <Badge variant={document.daysRemaining <= 3 ? "destructive" : "outline"}>
                    {document.daysRemaining === 0 ? "Today" : `${document.daysRemaining} days left`}
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reminder-toggle">Enable Reminder</Label>
              <p className="text-sm text-muted-foreground">
                Get notified before document expires
              </p>
            </div>
            <Switch
              id="reminder-toggle"
              checked={reminderEnabled}
              onCheckedChange={setReminderEnabled}
            />
          </div>
          
          {reminderEnabled && (
            <div className="space-y-2">
              <Label>Reminder Days</Label>
              <Slider
                value={[reminderDays]}
                min={1}
                max={30}
                step={1}
                onValueChange={(value) => setReminderDays(value[0])}
                className="py-4"
              />
              <p className="text-sm text-muted-foreground">
                Remind me {reminderDays} days before the due date
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-500" />
                Secure Vault
              </Label>
              <p className="text-sm text-muted-foreground">
                {document.inSecureVault 
                  ? "This document is stored in your secure vault" 
                  : "Move this document to your secure vault"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleVaultToggle}
              className={document.inSecureVault ? "text-purple-600" : ""}
            >
              {document.inSecureVault ? (
                <>
                  <ShieldOff className="h-4 w-4 mr-2" />
                  Remove
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Add to Vault
                </>
              )}
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentReminderSettings;
