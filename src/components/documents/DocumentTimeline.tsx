
import React from "react";
import BlurContainer from "../ui/BlurContainer";
import { Badge } from "../ui/badge";
import { useDocuments } from "@/contexts/DocumentContext";
import { format } from "date-fns";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";

const TimelineItem = ({ title, type, dueDate, daysRemaining, status }) => {
  const getStatusColor = () => {
    if (status === "expired" || daysRemaining < 0) return "destructive";
    if (status === "completed") return "secondary";
    if (daysRemaining < 7) return "default";
    return "secondary";
  };

  const getStatusIcon = () => {
    if (status === "expired" || daysRemaining < 0) return <AlertTriangle className="h-3 w-3" />;
    if (status === "completed") return <CheckCircle className="h-3 w-3" />;
    return <Clock className="h-3 w-3" />;
  };

  return (
    <div className="flex gap-4 pb-5 relative">
      <div className="flex flex-col items-center">
        <div className={`h-3 w-3 rounded-full ${
          status === "completed" ? "bg-green-500" : 
          status === "expired" || daysRemaining < 0 ? "bg-destructive" : 
          "bg-primary"
        } ring-4 ring-background`} />
        <div className="h-full w-px bg-border" />
      </div>
      
      <div className="flex flex-1 flex-col pb-2">
        <BlurContainer className="p-4 rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="outline">{type}</Badge>
              <h4 className="text-sm font-medium mt-1">{title}</h4>
            </div>
            <Badge variant={getStatusColor()} className="flex items-center gap-1">
              {getStatusIcon()}
              {status === "completed" ? "Completed" : 
               status === "expired" || daysRemaining < 0 ? "Overdue" : 
               daysRemaining === 0 ? "Today" : 
               `${daysRemaining} days`}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {dueDate ? format(new Date(dueDate), "PPP") : "No due date"}
          </p>
        </BlurContainer>
      </div>
    </div>
  );
};

const DocumentTimeline = () => {
  const { documents } = useDocuments();
  
  // Get documents for timeline, prioritize by status and due date
  const getTimelineDocuments = () => {
    // First get all non-vault documents
    const nonVaultDocs = documents.filter(doc => !doc.inSecureVault);
    
    // Get overdue documents
    const overdueDocs = nonVaultDocs.filter(doc => 
      doc.status !== "completed" && 
      doc.daysRemaining !== undefined && 
      doc.daysRemaining < 0
    );
    
    // Get documents due soon
    const dueSoonDocs = nonVaultDocs.filter(doc => 
      doc.status !== "completed" && 
      doc.daysRemaining !== undefined && 
      doc.daysRemaining >= 0 && 
      doc.daysRemaining <= 7
    );
    
    // Get recently completed documents
    const completedDocs = nonVaultDocs.filter(doc => 
      doc.status === "completed"
    ).slice(0, 2);
    
    // Combine and sort by priority (overdue first, then due soon, then completed)
    // Sort overdue by most overdue first
    const sortedOverdue = [...overdueDocs].sort((a, b) => (a.daysRemaining ?? 0) - (b.daysRemaining ?? 0));
    
    // Sort due soon by earliest due date
    const sortedDueSoon = [...dueSoonDocs].sort((a, b) => (a.daysRemaining ?? 0) - (b.daysRemaining ?? 0));
    
    // Combine all documents
    return [...sortedOverdue, ...sortedDueSoon, ...completedDocs].slice(0, 5);
  };

  const timelineDocuments = getTimelineDocuments();

  return (
    <BlurContainer className="p-5">
      <h3 className="text-base font-medium mb-4">Document Timeline</h3>
      {timelineDocuments.length > 0 ? (
        <div className="mt-2">
          {timelineDocuments.map((item) => (
            <TimelineItem 
              key={item.id} 
              title={item.title} 
              type={item.type} 
              dueDate={item.dueDate} 
              daysRemaining={item.daysRemaining} 
              status={item.status} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          <p>No documents to display in timeline</p>
        </div>
      )}
    </BlurContainer>
  );
};

export default DocumentTimeline;
