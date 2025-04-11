
import React, { useState } from 'react';
import { Document, useDocuments } from '@/contexts/DocumentContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Bell } from 'lucide-react';

export interface DocumentReminderSettingsProps {
  document: Document;
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
}

const DocumentReminderSettings = ({ document, open, isOpen, onOpenChange, onClose }: DocumentReminderSettingsProps) => {
  const { updateDocument } = useDocuments();
  
  // Default to document's current settings or 7 days
  const [reminderOption, setReminderOption] = useState<string>(
    document.customReminderDays !== undefined ? 'custom' : 'default'
  );
  const [customDays, setCustomDays] = useState<number>(
    document.customReminderDays !== undefined ? document.customReminderDays : 7
  );
  
  // Handle dialog state - supports both new and old prop patterns
  const [internalOpen, setInternalOpen] = useState(open !== undefined ? open : isOpen);
  
  const handleOpenChange = (newOpen: boolean) => {
    setInternalOpen(newOpen);
    
    // Call the appropriate callback based on which props are provided
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else if (onClose && !newOpen) {
      onClose();
    }
  };
  
  const handleSave = () => {
    const newSettings = {
      reminderSet: true,
      customReminderDays: reminderOption === 'custom' ? customDays : undefined
    };
    
    updateDocument(document.id, newSettings);
    
    toast({
      title: "Reminder settings updated",
      description: reminderOption === 'custom'
        ? `You'll be reminded ${customDays} days before this document is due.`
        : "Default reminder settings applied.",
    });
    
    handleOpenChange(false);
  };
  
  // Determine the actual open state from props or internal state
  const dialogOpen = open !== undefined ? open : (isOpen !== undefined ? isOpen : internalOpen);
  
  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> Reminder Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <h4 className="text-sm font-medium">Set reminder for "{document.title}"</h4>
          
          <RadioGroup 
            className="space-y-3" 
            value={reminderOption} 
            onValueChange={setReminderOption}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="default" />
              <Label htmlFor="default">Default (use system settings)</Label>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="custom" id="custom" className="mt-1" />
              <div className="grid gap-1.5">
                <Label htmlFor="custom">Custom notification time</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={90}
                    className="w-20"
                    value={customDays}
                    onChange={(e) => setCustomDays(parseInt(e.target.value, 10) || 1)}
                    disabled={reminderOption !== 'custom'}
                  />
                  <span className="text-sm text-muted-foreground">days before due date</span>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentReminderSettings;
