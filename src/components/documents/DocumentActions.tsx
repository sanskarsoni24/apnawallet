
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Download, Share2 } from "lucide-react";
import DocumentSharing from "./DocumentSharing";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Switch } from "@/components/ui/switch";

interface DocumentActionsProps {
  documentId: string;
  documentName: string;
  onEdit: () => void;
  onDelete: () => void;
  onDownload: () => void;
  isPremium?: boolean;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  documentId,
  documentName,
  onEdit,
  onDelete,
  onDownload,
  isPremium = false
}) => {
  const { userSettings } = useUser();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [allowEdit, setAllowEdit] = useState(false);
  
  const userIsPremium = isPremium || userSettings?.subscriptionPlan === 'premium' || userSettings?.subscriptionPlan === 'enterprise';
  
  const handleShare = () => {
    if (!shareEmail) {
      toast({
        title: "Email required",
        description: "Please enter an email address to share with",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate sharing document
    toast({
      title: "Document shared",
      description: `${documentName} has been shared with ${shareEmail}${allowEdit ? ' with edit permissions' : ''}`,
    });
    
    setShareEmail("");
    setAllowEdit(false);
    setShowShareDialog(false);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" className="gap-2" onClick={onEdit}>
        <Pencil className="h-4 w-4" />
        Edit
      </Button>
      
      <Button variant="outline" size="sm" className="gap-2" onClick={onDownload}>
        <Download className="h-4 w-4" />
        Download
      </Button>
      
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share "{documentName}"</DialogTitle>
            <DialogDescription>
              Share this document with others via email
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="allow-edit"
                checked={allowEdit}
                onCheckedChange={setAllowEdit}
                disabled={!userIsPremium}
              />
              <div>
                <Label htmlFor="allow-edit" className="cursor-pointer">Allow editing</Label>
                {!userIsPremium && (
                  <p className="text-xs text-muted-foreground">
                    Requires Premium subscription
                  </p>
                )}
              </div>
            </div>
            
            {userIsPremium && (
              <div className="rounded-md bg-muted p-4">
                <div className="text-sm font-medium">Premium sharing options</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  As a premium user, you can share documents with edit permissions and track document access.
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowShareDialog(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleShare}>
              Share Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Button variant="outline" size="sm" className="gap-2 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-900/30" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  );
};

export default DocumentActions;
