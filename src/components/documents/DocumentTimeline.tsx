
import React from "react";
import BlurContainer from "../ui/BlurContainer";
import Badge from "../ui/Badge";

interface TimelineItemProps {
  title: string;
  type: string;
  date: string;
  daysRemaining: number;
}

const TimelineItem = ({ title, type, date, daysRemaining }: TimelineItemProps) => {
  const getStatusColor = () => {
    if (daysRemaining < 0) return "destructive";
    if (daysRemaining < 7) return "default";
    return "secondary";
  };

  return (
    <div className="flex gap-4 pb-5 relative">
      <div className="flex flex-col items-center">
        <div className={`h-3 w-3 rounded-full bg-${getStatusColor() === "destructive" ? "destructive" : "primary"} ring-4 ring-background`} />
        <div className="h-full w-px bg-border" />
      </div>
      
      <div className="flex flex-1 flex-col pb-2">
        <BlurContainer className="p-4 rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <Badge size="sm" variant="outline">{type}</Badge>
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
          <p className="text-xs text-muted-foreground mt-2">{date}</p>
        </BlurContainer>
      </div>
    </div>
  );
};

const DocumentTimeline = () => {
  const timelineItems: TimelineItemProps[] = [
    {
      title: "Car Insurance Bill",
      type: "Invoice",
      date: "May 15, 2023",
      daysRemaining: 3,
    },
    {
      title: "Phone Warranty",
      type: "Warranty",
      date: "May 20, 2023",
      daysRemaining: 8,
    },
    {
      title: "Netflix Subscription",
      type: "Subscription",
      date: "May 25, 2023",
      daysRemaining: 13,
    },
    {
      title: "Flight to New York",
      type: "Boarding Pass",
      date: "June 1, 2023",
      daysRemaining: 20,
    },
  ];

  return (
    <BlurContainer className="p-5">
      <h3 className="text-base font-medium mb-4">Upcoming Deadlines</h3>
      <div className="mt-2">
        {timelineItems.map((item, index) => (
          <TimelineItem key={index} {...item} />
        ))}
      </div>
    </BlurContainer>
  );
};

export default DocumentTimeline;
