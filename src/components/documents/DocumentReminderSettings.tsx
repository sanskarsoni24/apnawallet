
import React, { useState } from "react";
import { Document } from "@/types/Document";
import { useDocuments } from "@/contexts/DocumentContext";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Calendar, Clock, Volume2 } from "lucide-react";
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
import { speakNotification } from "@/services/NotificationService";
import VoicePreview from "./VoicePreview";
import { Slider } from "@/components/ui/slider";

interface DocumentReminderSettingsProps {
  document: Document;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentReminderSettings = ({ document, isOpen, onClose }: DocumentReminderSettingsProps) => {
  const { updateDocument } = useDocuments();
  const { userSettings } = useUser();
  
  // Ensure we have a default value even if userSettings is undefined
  const defaultReminderDays = userSettings?.reminderDays ?? 3;
  
  const [reminderDays, setReminderDays] = useState<number>(
    document.customReminderDays !== undefined 
      ? document.customReminderDays 
      : defaultReminderDays
  );
  
  const [customDays, setCustomDays] = useState<number>(
    document.customReminderDays !== undefined && ![1, 3, 7, 14, 30].includes(document.customReminderDays) 
      ? document.customReminderDays 
      : 5
  );
  
  const [useCustomDays, setUseCustomDays] = useState<boolean>(
    document.customReminderDays !== undefined && ![1, 3, 7, 14, 30].includes(document.customReminderDays)
  );

  const [showVoicePreview, setShowVoicePreview] = useState(false);

  const handleSave = () => {
    const finalDays = useCustomDays ? customDays : reminderDays;
    updateDocument(document.id, { customReminderDays: finalDays });
    toast({
      title: "Reminder settings updated",
      description: `Custom reminder for "${document.title}" set to ${finalDays} days before expiry.`,
    });
    onClose();
  };
  
  const handleSelectChange = (value: string) => {
    if (value === "custom") {
      setUseCustomDays(true);
    } else {
      setUseCustomDays(false);
      setReminderDays(Number(value));
    }
  };
  
  const handleCustomDaysChange = (value: number[]) => {
    setCustomDays(value[0]);
  };

  const handlePreviewVoice = () => {
    setShowVoicePreview(true);
  };
  
  // Create the notification text for the document
  const getNotificationText = () => {
    const daysWord = document.daysRemaining === 1 ? "day" : "days";
    return `Reminder: ${document.title} is due in ${document.daysRemaining} ${daysWord}. Don't forget to review this ${document.type.toLowerCase()} document before the deadline.`;
  };

  return (
    <>
      <Dialog open={isOpen && !showVoicePreview} onOpenChange={onClose}>
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

          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                <label className="text-sm font-medium dark:text-white">Days before expiry to notify</label>
              </div>
              <p className="text-xs text-muted-foreground dark:text-slate-400 mb-2">
                This setting overrides your global reminder preference for this document only.
              </p>
              <Select 
                value={useCustomDays ? "custom" : String(reminderDays)} 
                onValueChange={handleSelectChange}
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
                  <SelectItem value="custom">Custom days...</SelectItem>
                </SelectContent>
              </Select>
              
              {useCustomDays && (
                <div className="space-y-3 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground dark:text-slate-400">
                      Custom reminder days: <span className="font-medium text-foreground dark:text-white">{customDays}</span>
                    </span>
                  </div>
                  <Slider
                    defaultValue={[customDays]}
                    min={1}
                    max={60}
                    step={1}
                    onValueChange={handleCustomDaysChange}
                    className="dark:bg-slate-800"
                  />
                  <p className="text-xs text-muted-foreground dark:text-slate-400">
                    Choose any value between 1 and 60 days
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                <span className="text-sm font-medium dark:text-white">Voice Preview</span>
              </div>
              <Button 
                variant="outline" 
                onClick={handlePreviewVoice} 
                className="w-full justify-start bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
              >
                <Volume2 className="h-4 w-4 mr-2 text-indigo-500" />
                Preview Voice Notification
              </Button>
            </div>
            
            <div className="pt-2 space-y-2 border-t dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                <p className="text-sm font-medium dark:text-white">Current Due Date</p>
              </div>
              <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded text-sm flex items-center justify-between">
                <span className="dark:text-slate-300">{document.dueDate}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  document.daysRemaining! < 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  document.daysRemaining! <= 3 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {document.daysRemaining! < 0 
                    ? `Overdue by ${Math.abs(document.daysRemaining!)} days` 
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
      
      {/* Voice Preview Dialog */}
      <Dialog open={showVoicePreview} onOpenChange={(open) => !open && setShowVoicePreview(false)}>
        <DialogContent className="sm:max-w-md dark:bg-slate-900 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle>Voice Notification Preview</DialogTitle>
            <DialogDescription>
              Preview how your voice notification will sound
            </DialogDescription>
          </DialogHeader>
          
          <VoicePreview 
            text={getNotificationText()} 
            onClose={() => setShowVoicePreview(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentReminderSettings;
