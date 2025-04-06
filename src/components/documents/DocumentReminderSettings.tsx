
import React, { useState } from "react";
import { Document, useDocuments } from "@/contexts/DocumentContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Calendar, Clock } from "lucide-react";
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
      <DialogContent className="sm:max-w-[400px] dark:bg-slate-900 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/60">
              <Bell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> 
            </div>
            <span className="dark:text-white">Document Reminder Settings</span>
          </DialogTitle>
          <DialogDescription className="dark:text-slate-300">
            Customize when you want to be reminded about "{document.title}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
              <label className="text-sm font-medium dark:text-white">Days before expiry to notify</label>
            </div>
            <p className="text-xs text-muted-foreground dark:text-slate-400 mb-2">
              This setting overrides your global reminder preference for this document only.
            </p>
            <Select 
              value={String(reminderDays)} 
              onValueChange={(value) => setReminderDays(Number(value))}
            >
              <SelectTrigger className="dark:bg-slate-800 dark:border-slate-700">
                <SelectValue placeholder="Select days" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-800">
                <SelectItem value="1">1 day before</SelectItem>
                <SelectItem value="3">3 days before</SelectItem>
                <SelectItem value="7">7 days before</SelectItem>
                <SelectItem value="14">14 days before</SelectItem>
                <SelectItem value="30">30 days before</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-2 space-y-2 border-t dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
              <p className="text-sm font-medium dark:text-white">Current Due Date</p>
            </div>
            <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded text-sm flex items-center justify-between">
              <span className="dark:text-slate-300">{document.dueDate}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                document.daysRemaining < 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                document.daysRemaining <= 3 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              }`}>
                {document.daysRemaining < 0 
                  ? `Overdue by ${Math.abs(document.daysRemaining)} days` 
                  : document.daysRemaining === 0 
                    ? 'Due today'
                    : document.daysRemaining === 1 
                      ? 'Due tomorrow'
                      : `${document.daysRemaining} days remaining`}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-700 dark:hover:bg-indigo-600"
          >
            Save Reminder Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentReminderSettings;
