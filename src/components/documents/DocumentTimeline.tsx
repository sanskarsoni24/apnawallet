
import React from "react";
import BlurContainer from "../ui/BlurContainer";
import { Badge } from "../ui/badge";
import { useDocuments } from "@/contexts/DocumentContext";

const TimelineItem = ({ title, type, dueDate, daysRemaining }) => {
  const getStatusColor = () => {
    if (daysRemaining < 0) return "destructive";
    if (daysRemaining < 7) return "default";
    return "secondary";
  };

  return (
    <div className="flex gap-4 pb-5 relative">
      <div className="flex flex-col items-center">
        <div className={`h-3 w-3 rounded-full ${daysRemaining < 0 ? "bg-destructive" : "bg-primary"} ring-4 ring-background`} />
        <div className="h-full w-px bg-border" />
      </div>
      
      <div className="flex flex-1 flex-col pb-2">
        <BlurContainer className="p-4 rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="outline">{type}</Badge>
              <h4 className="text-sm font-medium mt-1">{title}</h4>
            </div>
            <Badge variant={getStatusColor()}>
              {daysRemaining < 0 
                ? "Overdue" 
                : daysRemaining === 0 
                  ? "Today" 
                  : `${daysRemaining} days`}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{dueDate}</p>
        </BlurContainer>
      </div>
    </div>
  );
};

const DocumentTimeline = () => {
  const { documents } = useDocuments();
  
  // Get documents due in the next 30 days, sorted by due date
  const upcomingDocuments = [...documents]
    .filter(doc => doc.daysRemaining >= -7 && doc.daysRemaining <= 30)
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 4);

  return (
    <BlurContainer className="p-5">
      <h3 className="text-base font-medium mb-4">Upcoming Deadlines</h3>
      {upcomingDocuments.length > 0 ? (
        <div className="mt-2">
          {upcomingDocuments.map((item) => (
            <TimelineItem key={item.id} {...item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          <p>No upcoming deadlines</p>
        </div>
      )}
    </BlurContainer>
  );
};

export default DocumentTimeline;
