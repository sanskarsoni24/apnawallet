
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useDocuments } from "@/contexts/DocumentContext";
import BlurContainer from "../ui/BlurContainer";
import { format, isToday, isSameDay, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { FileText, Bell, Clock } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import DocumentReminderSettings from "../documents/DocumentReminderSettings";

// Helper function to parse date strings
const parseDocumentDate = (dateString: string): Date | null => {
  try {
    // Try standard ISO format first
    let parsedDate = new Date(dateString);
    
    // If invalid, try parsing as ISO
    if (isNaN(parsedDate.getTime())) {
      try {
        parsedDate = parseISO(dateString);
      } catch (e) {
        // If that fails, try manual parsing
        const formats = [
          // Format: "May 15, 2023"
          (str: string) => {
            const months = {
              Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
              Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
            };
            const parts = str.split(" ");
            if (parts.length === 3) {
              const month = Object.entries(months).find(([key]) => 
                parts[0].includes(key)
              )?.[1] as number;
              const day = parseInt(parts[1].replace(",", ""));
              const year = parseInt(parts[2]);
              
              if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
                return new Date(year, month, day);
              }
            }
            return null;
          },
          
          // Add more format parsers if needed
        ];
        
        // Try each format parser until one works
        for (const formatParser of formats) {
          const result = formatParser(dateString);
          if (result && !isNaN(result.getTime())) {
            parsedDate = result;
            break;
          }
        }
      }
    }
    
    // Final validation
    return !isNaN(parsedDate.getTime()) ? parsedDate : null;
  } catch (error) {
    console.error("Error parsing date:", dateString, error);
    return null;
  }
};

const DocumentCalendar = () => {
  const { documents } = useDocuments();
  const { email } = useUser();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showDocuments, setShowDocuments] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [showReminderSettings, setShowReminderSettings] = useState(false);
  const [documentDates, setDocumentDates] = useState<Array<any>>([]);
  
  // Process documents and parse their dates
  useEffect(() => {
    const processedDocs = documents.map(doc => {
      const dateObj = parseDocumentDate(doc.dueDate);
      return { ...doc, dateObj };
    }).filter(doc => doc.dateObj !== null);
    
    setDocumentDates(processedDocs);
  }, [documents]);
  
  // Function to find documents due on a selected date
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
              let dotSize = "h-1 w-1";
              if (docsOnDay.length > 0) {
                if (docsOnDay.some(doc => doc.daysRemaining < 0)) {
                  dotColor = "bg-red-500";
                  dotSize = "h-1.5 w-1.5";
                } else if (docsOnDay.some(doc => doc.daysRemaining >= 0 && doc.daysRemaining <= 3)) {
                  dotColor = "bg-orange-500";
                  dotSize = "h-1.5 w-1.5";
                } else {
                  dotColor = "bg-green-500";
                }
              }
              
              return (
                <div className="relative flex h-9 w-9 items-center justify-center">
                  <div className={`flex items-center justify-center h-7 w-7 rounded-full ${getDayClassNames(dayDate)}`}>
                    {dayDate.getDate()}
                  </div>
                  {docsOnDay.length > 0 && (
                    <div className="absolute -bottom-0.5 flex items-center justify-center gap-0.5">
                      <span className={`${dotSize} rounded-full ${dotColor} animate-pulse`} />
                      {docsOnDay.length > 1 && (
                        <span className="text-xs font-medium text-muted-foreground">+{docsOnDay.length}</span>
                      )}
                    </div>
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
                  
                  <div className="mt-3 flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 border-indigo-200"
                      onClick={() => {
                        setSelectedDoc(doc.id);
                        setShowReminderSettings(true);
                      }}
                    >
                      <Clock className="h-4 w-4 text-indigo-600" />
                      <span className="whitespace-nowrap">Set Reminder</span>
                    </Button>
                    <Link to={`/documents?id=${doc.id}`}>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="whitespace-nowrap"
                      >
                        View Details
                      </Button>
                    </Link>
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
