
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Download, Share2 } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DocumentSharing from "./DocumentSharing";

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
  const [shareLoading, setShareLoading] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<{email: string, access: string}[]>([]);
  
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
    
    setShareLoading(true);
    
    // Simulate API call to share document
    setTimeout(() => {
      // Add user to shared users list
      setSharedUsers([
        ...sharedUsers,
        {
          email: shareEmail, 
          access: allowEdit ? "edit" : "view"
        }
      ]);
      
      toast({
        title: "Document shared",
        description: `${documentName} has been shared with ${shareEmail}${allowEdit ? ' with edit permissions' : ''}`,
      });
      
      setShareEmail("");
      setAllowEdit(false);
      setShareLoading(false);
    }, 1000);
  };

  const removeSharedUser = (email: string) => {
    setSharedUsers(sharedUsers.filter(user => user.email !== email));
    
    toast({
      title: "Access revoked",
      description: `${email} no longer has access to this document`,
    });
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
      
      {/* Replace the old sharing dialog with the new DocumentSharing component */}
      <DocumentSharing 
        documentId={documentId} 
        documentName={documentName} 
        isPremium={userIsPremium} 
      />
      
      <Button variant="outline" size="sm" className="gap-2 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-900/30" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  );
};

export default DocumentActions;
