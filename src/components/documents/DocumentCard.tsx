import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, File, Lock, ShieldAlert, ShieldCheck, FileText } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from "react-router-dom";

interface DocumentCardProps {
  id: string;
  title: string;
  description?: string;
  type: string;
  dueDate?: string;
  expiryDate?: string;
  daysRemaining?: number;
  fileURL?: string;
  fileUrl?: string;
  inSecureVault?: boolean;
  status?: "active" | "expired" | "pending" | "completed" | "deleted";
  importance?: "low" | "medium" | "high" | "critical";
  dateAdded?: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  id,
  title,
  description,
  type,
  dueDate,
  expiryDate,
  daysRemaining,
  fileURL,
  fileUrl,
  inSecureVault,
  status,
  importance,
  dateAdded
}) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/document/${id}`);
  };
  
  let statusColor = "neutral";
  if (status === "completed") {
    statusColor = "success";
  } else if (status === "expired") {
    statusColor = "destructive";
  } else if (status === "pending") {
    statusColor = "warning";
  }
  
  let importanceColor = "neutral";
  if (importance === "critical") {
    importanceColor = "destructive";
  } else if (importance === "high") {
    importanceColor = "warning";
  } else if (importance === "medium") {
    importanceColor = "info";
  }
  
  const getDaysRemainingText = () => {
    if (daysRemaining === undefined) {
      return "No due date";
    } else if (daysRemaining < 0) {
      return `Overdue by ${Math.abs(daysRemaining)} days`;
    } else if (daysRemaining === 0) {
      return "Due today";
    } else if (daysRemaining === 1) {
      return "Due tomorrow";
    } else {
      return `Due in ${daysRemaining} days`;
    }
  };
  
  const formatDateDistance = (dateString: string | undefined): string => {
    if (!dateString) return 'No date available';
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, {
        addSuffix: true,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  };

  return (
    <Card className="bg-muted/50 hover:bg-muted/80 transition-colors cursor-pointer" onClick={handleCardClick}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold line-clamp-1">{title}</CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-2">
          {description || "No description"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{type}</span>
        </div>
        {dueDate && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{getDaysRemainingText()}</span>
          </div>
        )}
        {dateAdded && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Added {formatDateDistance(dateAdded)}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          {inSecureVault && (
            <Badge variant="outline" className="bg-secondary text-secondary-foreground">
              <Lock className="h-3 w-3 mr-1" />
              Vault
            </Badge>
          )}
          {importance && (
            <Badge variant="outline" className={`text-white ${
              importance === "critical" ? "bg-red-500" :
              importance === "high" ? "bg-orange-500" :
              importance === "medium" ? "bg-blue-500" :
              "bg-green-500"
            }`}>
              {importance}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {status === "completed" && (
            <Badge variant="secondary" className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              Completed
            </Badge>
          )}
          {status === "expired" && (
            <Badge variant="destructive" className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              Expired
            </Badge>
          )}
          {status === "pending" && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              Pending
            </Badge>
          )}
          {inSecureVault && (
            <ShieldCheck className="h-4 w-4 text-green-500" />
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
