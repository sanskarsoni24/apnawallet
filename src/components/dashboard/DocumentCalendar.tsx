
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useDocuments } from "@/contexts/DocumentContext";
import BlurContainer from "../ui/BlurContainer";
import { format, isToday, isSameDay } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { FileText, Bell } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import DocumentReminderSettings from "../documents/DocumentReminderSettings";

const DocumentCalendar = () => {
  const { documents } = useDocuments();
  const { email } = useUser();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showDocuments, setShowDocuments] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [showReminderSettings, setShowReminderSettings] = useState(false);
  
  // Parse dates from documents for highlighting in the calendar
  const documentDates = documents.map(doc => {
    // Convert string dates like "May 15, 2023" to Date objects
    try {
      // First try direct parsing
      let dateObj = new Date(doc.dueDate);
      
      // If invalid, try parsing with a format like "May 15, 2023"
      if (isNaN(dateObj.getTime())) {
        // Simple parsing for date strings in "Month Day, Year" format
        const parts = doc.dueDate.split(" ");
        if (parts.length === 3) {
          const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            .findIndex(m => parts[0].includes(m)) + 1;
          const day = parseInt(parts[1].replace(",", ""));
          const year = parseInt(parts[2]);
          if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
            dateObj = new Date(year, month - 1, day);
          }
        }
      }
      
      return { ...doc, dateObj };
    } catch (error) {
      console.error("Error parsing date:", doc.dueDate, error);
      return { ...doc, dateObj: null };
    }
  }).filter(doc => doc.dateObj && !isNaN(doc.dateObj.getTime()));
  
  // Function to find documents due on a selected date
  // Only show documents belonging to the current user
  const getDocumentsForDate = (selectedDate: Date) => {
    return documentDates.filter(doc => 
      doc.dateObj && isSameDay(doc.dateObj, selectedDate) && doc.userId === email
    );
  };
  
  // Documents for the currently selected date
  const selectedDateDocuments = date ? getDocumentsForDate(date) : [];
  
  // Get the specific document for reminder settings
  const getDocumentById = (id: string) => {
    return documents.find(doc => doc.id === id);
  };
  
  // Function to render dots under dates with documents
  const getDayClassNames = (day: Date) => {
    const docsOnDay = documentDates.filter(doc => 
      doc.dateObj && isSameDay(doc.dateObj, day) && doc.userId === email
    );
    
    if (docsOnDay.length > 0) {
      // Check if any document on this day is overdue/urgent
      const hasOverdue = docsOnDay.some(doc => doc.daysRemaining < 0);
      const hasUrgent = docsOnDay.some(doc => doc.daysRemaining >= 0 && doc.daysRemaining <= 3);
      
      if (hasOverdue) return "bg-destructive/10 border-destructive/50 font-medium";
      if (hasUrgent) return "bg-primary/10 border-primary/50 font-medium";
      return "bg-secondary/20 border-secondary/50";
    }
    
    return "";
  };
  
  return (
    <>
      <BlurContainer className="p-5">
        <h3 className="text-base font-medium mb-4">Document Calendar</h3>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate);
            if (newDate) {
              const docsOnDay = getDocumentsForDate(newDate);
              if (docsOnDay.length > 0) {
                setShowDocuments(true);
              }
            }
          }}
          className="rounded-md border p-3 pointer-events-auto"
          modifiersClassNames={{
            today: "bg-accent text-accent-foreground",
            selected: "bg-primary text-primary-foreground",
          }}
          modifiersStyles={{
            today: { fontWeight: "bold" }
          }}
          components={{
            DayContent: ({ date: dayDate }) => {
              // Get documents due on this day
              const docsOnDay = documentDates.filter(doc => 
                doc.dateObj && isSameDay(doc.dateObj, dayDate) && doc.userId === email
              );
              
              // Determine status color
              let dotColor = "";
              if (docsOnDay.length > 0) {
                if (docsOnDay.some(doc => doc.daysRemaining < 0)) {
                  dotColor = "bg-destructive";
                } else if (docsOnDay.some(doc => doc.daysRemaining >= 0 && doc.daysRemaining <= 3)) {
                  dotColor = "bg-primary";
                } else {
                  dotColor = "bg-secondary";
                }
              }
              
              return (
                <div className="relative flex h-9 w-9 items-center justify-center p-0">
                  <span className={`${getDayClassNames(dayDate)}`}>
                    {dayDate.getDate()}
                  </span>
                  {docsOnDay.length > 0 && (
                    <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${dotColor}`} />
                  )}
                </div>
              );
            }
          }}
        />
        
        {selectedDateDocuments.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">
                {date && `${format(date, "MMMM d, yyyy")}`}
              </p>
              <Badge variant="outline">{selectedDateDocuments.length} document(s)</Badge>
            </div>
            <BlurContainer className="p-3 border border-border/50">
              <ul className="space-y-2">
                {selectedDateDocuments.slice(0, 3).map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        doc.daysRemaining < 0 ? "bg-destructive" :
                        doc.daysRemaining <= 3 ? "bg-primary" : "bg-secondary"
                      }`} />
                      <span className="font-medium">{doc.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.customReminderDays !== undefined && (
                        <span className="text-xs text-muted-foreground">
                          {doc.customReminderDays}d reminder
                        </span>
                      )}
                      <Badge variant="outline">{doc.type}</Badge>
                    </div>
                  </li>
                ))}
                {selectedDateDocuments.length > 3 && (
                  <li className="text-xs text-muted-foreground text-center pt-1">
                    + {selectedDateDocuments.length - 3} more
                  </li>
                )}
              </ul>
            </BlurContainer>
          </div>
        )}
        
        <div className="mt-3 text-center">
          <Link to="/documents">
            <Button variant="outline" size="sm" className="w-full text-xs">View All Documents</Button>
          </Link>
        </div>
      </BlurContainer>
      
      {/* Dialog for showing documents on a specific date */}
      <Dialog open={showDocuments} onOpenChange={setShowDocuments}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {date && `Documents due on ${format(date, "MMMM d, yyyy")}`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 mt-2">
            {selectedDateDocuments.length > 0 ? (
              selectedDateDocuments.map((doc) => (
                <BlurContainer key={doc.id} className="p-4 hover:bg-accent/20 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{doc.type}</Badge>
                        <Badge 
                          variant={doc.daysRemaining < 0 ? "destructive" : 
                                  doc.daysRemaining <= 3 ? "default" : "secondary"}
                        >
                          {doc.daysRemaining < 0 ? "Overdue" : 
                           doc.daysRemaining === 0 ? "Due today" :
                           doc.daysRemaining === 1 ? "Due tomorrow" : 
                           `${doc.daysRemaining} days left`}
                        </Badge>
                        {doc.customReminderDays !== undefined && (
                          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                            {doc.customReminderDays}d reminder
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium mt-2">{doc.title}</h4>
                      {doc.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {doc.description}
                        </p>
                      )}
                    </div>
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        setSelectedDoc(doc.id);
                        setShowReminderSettings(true);
                      }}
                    >
                      <Bell className="h-4 w-4" />
                      Set Reminder
                    </Button>
                  </div>
                </BlurContainer>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No documents due on this date</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Document Reminder Settings Dialog */}
      {selectedDoc && (
        <DocumentReminderSettings 
          document={getDocumentById(selectedDoc)!}
          isOpen={showReminderSettings}
          onClose={() => {
            setShowReminderSettings(false);
            setSelectedDoc(null);
          }}
        />
      )}
    </>
  );
};

export default DocumentCalendar;
