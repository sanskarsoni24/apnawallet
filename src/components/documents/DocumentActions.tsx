
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Download, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
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
  const userIsPremium = isPremium || userSettings?.subscriptionPlan === 'premium' || userSettings?.subscriptionPlan === 'enterprise';
  
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
