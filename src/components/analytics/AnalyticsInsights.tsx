
import React from "react";
import { useDocuments } from "@/contexts/DocumentContext";
import { Clock, AlertCircle, CheckCircle2, Info, FileSearch, Megaphone, Calendar, Tag, FileCheck, RotateCw, FolderOpen } from "lucide-react";
import BlurContainer from "../ui/BlurContainer";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { format } from "date-fns";

const AnalyticsInsights: React.FC = () => {
  const { 
    documents, 
    markDocumentComplete, 
    markDocumentExpired, 
    scheduleRenewal,
    updateDocument
  } = useDocuments();
  const { toast } = useToast();
  const [showRenewalDialog, setShowRenewalDialog] = React.useState(false);
  const [selectedDocument, setSelectedDocument] = React.useState<string | null>(null);
  const [renewalDate, setRenewalDate] = React.useState<Date | undefined>(undefined);
  const [showDocumentsToOrganize, setShowDocumentsToOrganize] = React.useState(false);
  
  // Calculate insights
  const expiringDocuments = documents.filter(doc => 
    doc.daysRemaining !== undefined && 
    doc.daysRemaining >= 0 && 
    doc.daysRemaining <= 30 &&
    doc.status !== 'expired' &&
    doc.status !== 'completed'
  );
  
  const expiredDocuments = documents.filter(doc => 
    (doc.daysRemaining !== undefined && doc.daysRemaining < 0) ||
    doc.status === 'expired'
  );
  
  const healthyDocuments = documents.filter(doc => 
    (!doc.expiryDate || 
    (doc.daysRemaining !== undefined && doc.daysRemaining > 30)) &&
    doc.status !== 'expired' &&
    doc.status !== 'completed'
  );
  
  const mostCommonType = React.useMemo(() => {
    const typeCount: Record<string, number> = {};
    documents.forEach(doc => {
      typeCount[doc.type] = (typeCount[doc.type] || 0) + 1;
    });
    
    let maxType = "";
    let maxCount = 0;
    
    for (const [type, count] of Object.entries(typeCount)) {
      if (count > maxCount) {
        maxType = type;
        maxCount = count;
      }
    }
    
    return { type: maxType, count: maxCount };
  }, [documents]);
  
  const getIncompleteDocuments = () => {
    return documents.filter(doc => 
      !doc.category || 
      !doc.tags || 
      doc.tags.length === 0 || 
      !doc.notes
    );
  };
  
  const incompleteDocuments = getIncompleteDocuments();
  const incompleteCount = incompleteDocuments.length;
  
  const handleActionClick = (action: string, docId?: string) => {
    if (action === "Schedule renewal" && docId) {
      setSelectedDocument(docId);
      setShowRenewalDialog(true);
    } else if (action === "Organize documents") {
      setShowDocumentsToOrganize(true);
    } else {
      toast({
        title: "Action Triggered",
        description: `You've initiated the "${action}" action.`,
        variant: "default",
      });
    }
  };
  
  const handleScheduleRenewal = () => {
    if (selectedDocument && renewalDate) {
      const formattedDate = format(renewalDate, "MMMM d, yyyy");
      scheduleRenewal(selectedDocument, formattedDate);
      setShowRenewalDialog(false);
      setSelectedDocument(null);
      setRenewalDate(undefined);
    }
  };
  
  const handleMarkDocumentComplete = (docId: string) => {
    markDocumentComplete(docId);
  };
  
  const handleMarkDocumentExpired = (docId: string) => {
    markDocumentExpired(docId);
  };
  
  const handleOrganizeDocument = (docId: string, updates: Partial<Document>) => {
    updateDocument(docId, updates);
    toast({
      title: "Document Organized",
      description: "The document metadata has been updated.",
    });
  };
  
  const calculateCompletion = () => {
    if (documents.length === 0) return 100;
    return Math.round(((documents.length - incompleteCount) / documents.length) * 100);
  };

  const documentCompletionPercentage = calculateCompletion();
  
  const insights = [
    {
      title: "Expiring Soon",
      description: `You have ${expiringDocuments.length} documents expiring in the next 30 days.`,
      icon: Calendar,
      color: "text-amber-500",
      bg: "bg-amber-100 dark:bg-amber-900/30",
      action: expiringDocuments.length > 0 ? "Schedule renewal" : null,
      documents: expiringDocuments,
      priority: expiringDocuments.length > 0 ? "high" : "normal"
    },
    {
      title: "Expired Documents",
      description: `You have ${expiredDocuments.length} expired documents that need attention.`,
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-100 dark:bg-red-900/30",
      action: expiredDocuments.length > 0 ? "Renew documents" : null,
      documents: expiredDocuments,
      priority: expiredDocuments.length > 0 ? "critical" : "normal"
    },
    {
      title: "Healthy Documents",
      description: `${healthyDocuments.length} documents are in good standing with no immediate action needed.`,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      action: null,
      documents: healthyDocuments,
      priority: "normal"
    },
    {
      title: "Document Organization",
      description: incompleteCount > 0 
        ? `${incompleteCount} documents are missing categories, tags or notes.` 
        : "All documents are well-organized with categories, tags and notes.",
      icon: Tag,
      color: incompleteCount > 0 ? "text-blue-500" : "text-emerald-500",
      bg: incompleteCount > 0 ? "bg-blue-100 dark:bg-blue-900/30" : "bg-emerald-100 dark:bg-emerald-900/30",
      action: incompleteCount > 0 ? "Organize documents" : null,
      documents: incompleteDocuments,
      priority: incompleteCount > 0 ? "medium" : "normal"
    }
  ];
  
  if (documents.length === 0) {
    return null;
  }
  
  return (
    <>
      <BlurContainer variant="default" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Insights & Recommendations</h2>
          </div>
          <div className="text-sm flex items-center gap-2">
            <span className="text-muted-foreground">Document completion:</span>
            <span className="font-medium">{documentCompletionPercentage}%</span>
            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${documentCompletionPercentage === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${documentCompletionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {insights.map((insight, index) => (
            <Card key={index} className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
              insight.priority === "critical" ? "border-l-4 border-l-red-500" :
              insight.priority === "high" ? "border-l-4 border-l-amber-500" :
              insight.priority === "medium" ? "border-l-4 border-l-blue-500" :
              "border-l-4 border-l-emerald-500"
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`${insight.bg} p-2.5 rounded-md shrink-0`}>
                    <insight.icon className={`h-5 w-5 ${insight.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    
                    {insight.documents && insight.documents.length > 0 && (
                      <div className="mb-3 text-xs text-muted-foreground">
                        <div className="max-h-24 overflow-y-auto pr-2 space-y-1">
                          {insight.documents.slice(0, 5).map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
                              <span className="truncate mr-2">{doc.title}</span>
                              <div className="flex gap-1">
                                {insight.title === "Expired Documents" && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-5 w-5 p-0" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleActionClick("Schedule renewal", doc.id);
                                    }}
                                  >
                                    <RotateCw className="h-3 w-3 text-green-500" />
                                  </Button>
                                )}
                                
                                {insight.title === "Healthy Documents" && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-5 w-5 p-0" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMarkDocumentComplete(doc.id);
                                    }}
                                  >
                                    <FileCheck className="h-3 w-3 text-green-500" />
                                  </Button>
                                )}
                                
                                {insight.title === "Expiring Soon" && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-5 w-5 p-0" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleActionClick("Schedule renewal", doc.id);
                                    }}
                                  >
                                    <Calendar className="h-3 w-3 text-amber-500" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                          {insight.documents.length > 5 && (
                            <div className="text-center text-xs text-muted-foreground pt-1">
                              + {insight.documents.length - 5} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {insight.action && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`px-3 py-1 h-auto text-xs ${insight.color} hover:bg-muted/50`}
                        onClick={() => handleActionClick(insight.action as string)}
                      >
                        {insight.action}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {mostCommonType.type && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center gap-3 mb-2">
              <FileSearch className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium">Document Trend</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your most common document type is <span className="font-medium text-foreground">{mostCommonType.type}</span> with {mostCommonType.count} documents.
            </p>
          </div>
        )}
      </BlurContainer>
      
      {/* Schedule Renewal Dialog */}
      <Dialog open={showRenewalDialog} onOpenChange={setShowRenewalDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Document Renewal</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4 text-sm text-center">
              Select a new due date for this document
            </div>
            
            <div className="flex flex-col items-center">
              <CalendarComponent
                mode="single"
                selected={renewalDate}
                onSelect={setRenewalDate}
                className="border rounded-md p-3"
                disabled={(date) => date < new Date()}
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowRenewalDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleRenewal} disabled={!renewalDate}>
                Schedule Renewal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Organize Documents Dialog */}
      <Dialog open={showDocumentsToOrganize} onOpenChange={setShowDocumentsToOrganize}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Organize Documents</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4 text-sm">
              These documents need organization. Add missing metadata to improve your document organization:
            </div>
            
            <div className="max-h-[400px] overflow-y-auto space-y-4">
              {incompleteDocuments.map(doc => (
                <div key={doc.id} className="p-3 border rounded-md">
                  <div className="font-medium mb-2">{doc.title}</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${!doc.category ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {!doc.category ? 'Missing category' : 'Has category'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${!doc.tags || doc.tags.length === 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {!doc.tags || doc.tags.length === 0 ? 'Missing tags' : 'Has tags'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${!doc.notes ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {!doc.notes ? 'Missing notes' : 'Has notes'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex gap-1.5 items-center"
                      onClick={() => {
                        // In a real app, this would open a form to add metadata
                        const simulatedUpdates: Partial<Document> = {
                          category: doc.category || "General",
                          tags: doc.tags || ["document"],
                          notes: doc.notes || "Added via document organization"
                        };
                        handleOrganizeDocument(doc.id, simulatedUpdates);
                      }}
                    >
                      <FolderOpen className="h-3.5 w-3.5" />
                      Organize
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AnalyticsInsights;
