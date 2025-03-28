
import React from "react";
import { Calendar, FileText, Trash2 } from "lucide-react";
import BlurContainer from "../ui/BlurContainer";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useDocuments, Document } from "@/contexts/DocumentContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { toast } from "@/hooks/use-toast";

interface DocumentCardProps extends Document {
  className?: string;
}

const DocumentCard = ({
  id,
  title,
  type,
  dueDate,
  daysRemaining,
  fileURL,
  className,
}: DocumentCardProps) => {
  const [showPreview, setShowPreview] = React.useState(false);
  const { deleteDocument } = useDocuments();
  
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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteDocument(id);
    toast({
      title: "Document deleted",
      description: `${title} has been removed.`,
    });
  };

  const handleCardClick = () => {
    setShowPreview(true);
  };

  return (
    <>
      <BlurContainer 
        className={cn("document-card document-card-hover cursor-pointer", className)}
        hover
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <Badge variant="outline">
              {type}
            </Badge>
            <h3 className="text-base font-medium mt-2">{title}</h3>
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
        
        <div className="mt-3 flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </BlurContainer>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-2">
            {fileURL ? (
              <div className="max-h-[60vh] overflow-auto border rounded-md">
                {fileURL.includes("pdf") ? (
                  <div className="p-8 text-center">
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                    <p className="mt-2">PDF preview not available</p>
                    <a 
                      href={fileURL} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-primary hover:underline mt-2 block"
                    >
                      Open PDF
                    </a>
                  </div>
                ) : (
                  <img 
                    src={fileURL} 
                    alt={title} 
                    className="max-w-full object-contain"
                  />
                )}
              </div>
            ) : (
              <div className="p-8 text-center border rounded-md w-full">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="mt-2">No document preview available</p>
                <p className="text-sm text-muted-foreground mt-1">Document details:</p>
                <div className="mt-2 text-left px-4">
                  <p><strong>Type:</strong> {type}</p>
                  <p><strong>Due Date:</strong> {dueDate}</p>
                  <p><strong>Status:</strong> {getStatusText()}</p>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 w-full">
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentCard;
