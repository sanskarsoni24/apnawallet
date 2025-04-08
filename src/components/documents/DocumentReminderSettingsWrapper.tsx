
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Document, useDocuments } from "@/contexts/DocumentContext";
import { Bell, Calendar, Volume2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { speakNotification } from "@/services/NotificationService";
import VoicePreview from "./VoicePreview";

interface DocumentReminderSettingsWrapperProps {
  document: Document;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentReminderSettingsWrapper: React.FC<DocumentReminderSettingsWrapperProps> = ({ 
  document, 
  isOpen, 
  onClose 
}) => {
  const { setCustomReminderDays } = useDocuments();
  const [selectedDays, setSelectedDays] = useState(document.customReminderDays || 3);
  const [showVoicePreview, setShowVoicePreview] = useState(false);

  const reminderOptions = [
    { value: 1, label: "1 day before" },
    { value: 3, label: "3 days before" },
    { value: 7, label: "1 week before" },
    { value: 14, label: "2 weeks before" },
    { value: 30, label: "1 month before" }
  ];

  const handleSaveReminder = () => {
    setCustomReminderDays(document.id, selectedDays);
    toast({
      title: "Reminder Updated",
      description: `You'll be reminded ${selectedDays} days before this document is due.`
    });
    onClose();
  };

  const handlePreviewNotification = () => {
    setShowVoicePreview(true);
  };
  
  // Create the notification text for the document
  const getNotificationText = () => {
    const daysWord = document.daysRemaining === 1 ? "day" : "days";
    return `Reminder: ${document.title} is due in ${document.daysRemaining} ${daysWord}. Don't forget to review this ${document.type.toLowerCase()} document before the deadline.`;
  };

  return (
    <>
      <Dialog open={isOpen && !showVoicePreview} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Document Reminder</DialogTitle>
            <DialogDescription>
              Set when you want to be reminded about "{document.title}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium">Due date reminder</h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified before the document is due
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2 pt-2">
                {reminderOptions.map(option => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={selectedDays === option.value ? "default" : "outline"}
                    className={`justify-start ${
                      selectedDays === option.value ? "bg-indigo-600 text-white" : ""
                    }`}
                    onClick={() => setSelectedDays(option.value)}
                  >
                    <span className="flex items-center gap-2">
                      {selectedDays === option.value && (
                        <span className="h-2 w-2 rounded-full bg-current" />
                      )}
                      {option.label}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Volume2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Voice notification</h4>
                  <p className="text-sm text-muted-foreground">
                    Customize how your reminders sound
                  </p>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full justify-start bg-purple-50 border-purple-100 text-purple-800 hover:bg-purple-100"
                onClick={handlePreviewNotification}
              >
                <Volume2 className="h-4 w-4 mr-2" />
                <span>Preview Voice Notification</span>
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveReminder} className="bg-indigo-600 hover:bg-indigo-700">
              Save Reminder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Voice Preview Dialog */}
      <Dialog open={showVoicePreview} onOpenChange={(open) => !open && setShowVoicePreview(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Voice Notification Preview</DialogTitle>
            <DialogDescription>
              Customize how your voice notifications will sound
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

export default DocumentReminderSettingsWrapper;
