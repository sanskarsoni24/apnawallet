import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import DocumentActions from "./DocumentActions";
import { toast } from "@/hooks/use-toast";

interface DocumentCardProps {
  id: string;
  title: string;
  type: string;
  date: string;
  daysRemaining: number;
  importance?: "low" | "medium" | "high" | "critical";
  isPremium?: boolean;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  id,
  title,
  type,
  date,
  daysRemaining,
  importance = "medium",
  isPremium = false,
}) => {
  const handleEdit = () => {
    toast({
      title: "Edit Document",
      description: `Editing document: ${title}`,
    });
  };

  const handleDelete = () => {
    toast({
      title: "Delete Document",
      description: `Document "${title}" has been deleted`,
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download Document",
      description: `Downloading document: ${title}`,
    });
  };

  const getImportanceColor = () => {
    switch (importance) {
      case "critical":
        return "text-red-500 bg-red-50 dark:bg-red-950 dark:text-red-400";
      case "high":
        return "text-orange-500 bg-orange-50 dark:bg-orange-950 dark:text-orange-400";
      case "medium":
        return "text-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400";
      case "low":
        return "text-green-500 bg-green-50 dark:bg-green-950 dark:text-green-400";
      default:
        return "text-blue-500 bg-blue-50 dark:bg-blue-950 dark:text-blue-400";
    }
  };

  const getDaysRemainingText = () => {
    if (daysRemaining < 0) {
      return "Expired";
    }
    if (daysRemaining === 0) {
      return "Due today";
    }
    if (daysRemaining === 1) {
      return "Due tomorrow";
    }
    return `${daysRemaining} days remaining`;
  };

  const getDaysRemainingColor = () => {
    if (daysRemaining < 0) {
      return "text-red-500";
    }
    if (daysRemaining <= 3) {
      return "text-orange-500";
    }
    if (daysRemaining <= 7) {
      return "text-yellow-500";
    }
    return "text-green-500";
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1.5">
          <Badge variant="outline" className="font-normal">
            {type}
          </Badge>
          <h3 className="font-medium leading-none">{title}</h3>
        </div>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <FileText className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Added {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </span>
          <Badge
            variant="secondary"
            className={`font-normal ${getImportanceColor()}`}
          >
            {importance.charAt(0).toUpperCase() + importance.slice(1)}
          </Badge>
        </div>

        {daysRemaining !== undefined && (
          <div className="mt-3 flex items-center gap-1.5">
            <AlertCircle
              className={`h-4 w-4 ${getDaysRemainingColor()}`}
            />
            <span
              className={`text-xs font-medium ${getDaysRemainingColor()}`}
            >
              {getDaysRemainingText()}
            </span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <DocumentActions
          documentId={id}
          documentName={title}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDownload={handleDownload}
          isPremium={isPremium}
        />
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
