
import React, { useState } from "react";
import { Calendar, FileText, Trash2, Download, ExternalLink, Pencil } from "lucide-react";
import BlurContainer from "../ui/BlurContainer";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useDocuments, Document } from "@/contexts/DocumentContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

interface DocumentCardProps extends Document {
  className?: string;
}

const DocumentCard = ({
  id,
  title,
  type,
  dueDate,
  daysRemaining,
  description,
  fileURL,
  className,
}: DocumentCardProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description || "");
  const { deleteDocument, updateDocument } = useDocuments();
  
  const getStatusVariant = () => {
    if (daysRemaining < 0) return "destructive";
    if (daysRemaining < 7) return "default";
    return "secondary";
  };

  const getStatusText = () => {
    if (daysRemaining < 0) return "Overdue";
    if (daysRemaining === 0) return "Due today";
    if (daysRemaining === 1) return "Due tomorrow";
    return `${daysRemaining} days left`;
  };

  const handleDelete = () => {
    deleteDocument(id);
    setShowDeleteConfirm(false);
    toast({
      title: "Document deleted",
      description: `${title} has been removed.`,
    });
  };

  const handleCardClick = () => {
    setShowPreview(true);
  };

  const handleSaveEdit = () => {
    updateDocument(id, {
      title: editTitle,
      description: editDescription
    });
    setIsEditing(false);
    toast({
      title: "Document updated",
      description: "Your changes have been saved."
    });
  };

  const isPdfFile = fileURL?.toLowerCase().includes('.pdf');
  const isImageFile = fileURL?.toLowerCase().match(/\.(jpeg|jpg|gif|png|webp)$/);
  
  const openFileInNewTab = () => {
    if (fileURL) {
      window.open(fileURL, '_blank');
    }
  };

  return (
    <>
      <BlurContainer 
        className={cn("document-card document-card-hover cursor-pointer p-4", className)}
        hover
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <Badge variant="outline">
              {type}
            </Badge>
            <h3 className="text-base font-medium mt-2">{title}</h3>
            {description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
            )}
          </div>
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{dueDate}</span>
          </div>
          <Badge variant={getStatusVariant()}>
            {getStatusText()}
          </Badge>
        </div>
        
        <div className="mt-3 flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            onClick={(e) => {
              e.stopPropagation();
              setShowPreview(true);
              setIsEditing(true);
            }}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </BlurContainer>

      {/* Document Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Document" : title}</DialogTitle>
          </DialogHeader>
          
          {isEditing ? (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  value={editTitle} 
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Document title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description / Notes</label>
                <Textarea 
                  value={editDescription} 
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Add notes about this document..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              {fileURL ? (
                <div className="w-full max-h-[60vh] overflow-auto border rounded-md">
                  {isPdfFile ? (
                    <div className="p-8 text-center">
                      <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="mt-3 font-medium">PDF Document</p>
                      <p className="mt-1 text-sm text-muted-foreground">PDF preview is not available directly</p>
                      <div className="flex justify-center gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-2"
                          onClick={openFileInNewTab}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open PDF
                        </Button>
                        <Button 
                          variant="default" 
                          className="flex items-center gap-2"
                          onClick={() => {
                            if (fileURL) {
                              const link = document.createElement('a');
                              link.href = fileURL;
                              link.download = title || 'document.pdf';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }
                          }}
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : isImageFile ? (
                    <img 
                      src={fileURL} 
                      alt={title} 
                      className="w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Preview+Failed';
                      }}
                    />
                  ) : (
                    <div className="p-8 text-center">
                      <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="mt-3 font-medium">Document Preview</p>
                      <p className="mt-1 text-sm text-muted-foreground">This file type cannot be previewed</p>
                      <div className="flex justify-center gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-2"
                          onClick={openFileInNewTab}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open File
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center border rounded-md w-full">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="mt-3 font-medium">No document attached</p>
                  <div className="mt-4 text-left px-4 py-2 bg-muted/30 rounded-md">
                    <p className="mb-2"><strong>Document details:</strong></p>
                    <p><strong>Type:</strong> {type}</p>
                    <p><strong>Due Date:</strong> {dueDate}</p>
                    <p><strong>Status:</strong> {getStatusText()}</p>
                    {description && (
                      <div className="mt-3">
                        <p><strong>Notes:</strong></p>
                        <p className="whitespace-pre-wrap">{description}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 w-full mt-2">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                  Edit Details
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPreview(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the document "{title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DocumentCard;
