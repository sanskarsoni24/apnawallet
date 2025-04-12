
import React from "react";
import { useDocuments } from "@/contexts/DocumentContext";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Archive
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DocumentStatusSelectorProps {
  documentId: string;
  currentStatus?: string;
  compact?: boolean;
}

const DocumentStatusSelector: React.FC<DocumentStatusSelectorProps> = ({
  documentId,
  currentStatus = "active",
  compact = false
}) => {
  const { updateDocument } = useDocuments();

  const handleStatusChange = (newStatus: "active" | "expired" | "pending" | "completed" | "deleted") => {
    updateDocument(documentId, { status: newStatus });
    
    const statusMessages = {
      active: "Document marked as active",
      expired: "Document marked as expired",
      pending: "Document marked as pending",
      completed: "Document marked as completed",
      deleted: "Document moved to trash"
    };
    
    toast({
      title: "Status Updated",
      description: statusMessages[newStatus]
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "expired":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "deleted":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "expired":
        return "Expired";
      case "pending":
        return "Pending";
      case "completed":
        return "Completed";
      case "deleted":
        return "Deleted";
      default:
        return "Active";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "expired":
        return "destructive";
      case "pending":
        return "warning";
      case "completed":
        return "success";
      case "deleted":
        return "outline";
      default:
        return "default";
    }
  };

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
            {getStatusIcon(currentStatus)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem onClick={() => handleStatusChange("active")}>
            <Clock className="mr-2 h-4 w-4 text-blue-500" />
            <span>Active</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
            <Clock className="mr-2 h-4 w-4 text-amber-500" />
            <span>Pending</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            <span>Completed</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("expired")}>
            <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
            <span>Expired</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("deleted")}>
            <Archive className="mr-2 h-4 w-4 text-gray-500" />
            <span>Move to Trash</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Status</span>
        <Badge variant={getStatusBadgeVariant(currentStatus) as any} className="flex items-center gap-1">
          {getStatusIcon(currentStatus)}
          <span>{getStatusLabel(currentStatus)}</span>
        </Badge>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            Change Status
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem onClick={() => handleStatusChange("active")}>
            <Clock className="mr-2 h-4 w-4 text-blue-500" />
            <span>Active</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
            <Clock className="mr-2 h-4 w-4 text-amber-500" />
            <span>Pending</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            <span>Completed</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("expired")}>
            <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
            <span>Expired</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusChange("deleted")}>
            <Archive className="mr-2 h-4 w-4 text-gray-500" />
            <span>Move to Trash</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DocumentStatusSelector;
