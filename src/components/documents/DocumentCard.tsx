
import React from "react";
import { Calendar, FileText } from "lucide-react";
import BlurContainer from "../ui/BlurContainer";
import Badge from "../ui/Badge";
import { cn } from "@/lib/utils";

interface DocumentCardProps {
  title: string;
  type: string;
  dueDate: string;
  daysRemaining: number;
  className?: string;
}

const DocumentCard = ({
  title,
  type,
  dueDate,
  daysRemaining,
  className,
}: DocumentCardProps) => {
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

  return (
    <BlurContainer 
      className={cn("document-card document-card-hover", className)}
      hover
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <Badge size="sm" variant="outline">
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
    </BlurContainer>
  );
};

export default DocumentCard;
