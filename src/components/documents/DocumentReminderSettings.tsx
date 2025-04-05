
import React, { useState } from "react";
import { Document, useDocuments } from "@/contexts/DocumentContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { useUser } from "@/contexts/UserContext";

interface DocumentReminderSettingsProps {
  document: Document;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentReminderSettings = ({ document, isOpen, onClose }: DocumentReminderSettingsProps) => {
  const { setCustomReminderDays } = useDocuments();
  const { userSettings } = useUser();
  const [reminderDays, setReminderDays] = useState<number>(
    document.customReminderDays !== undefined 
      ? document.customReminderDays 
      : (userSettings.reminderDays || 3)
  );

  const handleSave = () => {
    setCustomReminderDays(document.id, reminderDays);
    toast({
      title: "Reminder settings updated",
      description: `Custom reminder for "${document.title}" set to ${reminderDays} days before expiry.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" /> 
            Document Reminder Settings
          </DialogTitle>
          <DialogDescription>
            Customize when you want to be reminded about "{document.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Days before expiry to notify</label>
            <p className="text-xs text-muted-foreground mb-2">
              This setting overrides your global reminder preference for this document only.
            </p>
            <Select 
              value={String(reminderDays)} 
              onValueChange={(value) => setReminderDays(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day before</SelectItem>
                <SelectItem value="3">3 days before</SelectItem>
                <SelectItem value="7">7 days before</SelectItem>
                <SelectItem value="14">14 days before</SelectItem>
                <SelectItem value="30">30 days before</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentReminderSettings;
