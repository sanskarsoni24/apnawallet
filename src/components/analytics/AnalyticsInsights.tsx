
import React, { useState } from "react";
import { useDocuments } from "@/contexts/DocumentContext";
import { Clock, AlertCircle, CheckCircle2, Info, FileSearch, Megaphone, Calendar, Tag, FileCheck, RotateCw, FolderOpen, Flame, Archive, TrendingUp, FileWarning, Shield } from "lucide-react";
import BlurContainer from "../ui/BlurContainer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { format } from "date-fns";
import { useUser } from "@/contexts/UserContext";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const AnalyticsInsights: React.FC = () => {
  const { 
    documents, 
    markDocumentComplete, 
    markDocumentExpired, 
    scheduleRenewal,
    updateDocument,
    categories,
    addCategory,
  } = useDocuments();
  
  const { userSettings } = useUser();
  const { toast } = useToast();
  const [showRenewalDialog, setShowRenewalDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [renewalDate, setRenewalDate] = useState<Date | undefined>(undefined);
  const [showDocumentsToOrganize, setShowDocumentsToOrganize] = useState(false);
  const [selectedTab, setSelectedTab] = useState("insights");
  
  // For document organization
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [docCategory, setDocCategory] = useState("");
  const [docTags, setDocTags] = useState("");
  const [docNotes, setDocNotes] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  
  // Calculate insights
  const expiringDocuments = documents.filter(doc => 
    doc.daysRemaining !== undefined && 
    doc.daysRemaining >= 0 && 
    doc.daysRemaining <= 30 &&
    doc.status !== 'expired' &&
    doc.status !== 'completed'
  );
  
  const expiredDocuments = documents.filter(doc => 
    doc.status === 'expired' ||
    (doc.daysRemaining !== undefined && doc.daysRemaining < 0 && doc.status !== 'completed')
  );
  
  const completedDocuments = documents.filter(doc => 
    doc.status === 'completed'
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
  
  const handleSelectDocToOrganize = (docId: string) => {
    setSelectedDocId(docId);
    
    // Find the document
    const doc = documents.find(d => d.id === docId);
    if (doc) {
      setDocCategory(doc.category || "");
      setDocTags(doc.tags ? doc.tags.join(", ") : "");
      setDocNotes(doc.notes || "");
    }
  };
  
  const handleSaveDocOrganization = () => {
    if (!selectedDocId) return;
    
    const updates: Partial<Document> = {
      category: docCategory,
      tags: docTags.split(",").map(tag => tag.trim()).filter(tag => tag !== ""),
      notes: docNotes
    };
    
    updateDocument(selectedDocId, updates);
    
    toast({
      title: "Document Organized",
      description: "The document metadata has been updated.",
    });
    
    setSelectedDocId(null);
  };
  
  const handleAddCustomCategory = () => {
    if (customCategory.trim()) {
      addCategory(customCategory.trim());
      setDocCategory(customCategory.trim());
      setCustomCategory("");
    }
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
      icon: FileWarning,
      color: "text-red-500",
      bg: "bg-red-100 dark:bg-red-900/30",
      action: expiredDocuments.length > 0 ? "Renew documents" : null,
      documents: expiredDocuments,
      priority: expiredDocuments.length > 0 ? "critical" : "normal"
    },
    {
      title: "Completed Documents",
      description: `You have ${completedDocuments.length} completed documents in your archive.`,
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-900/30",
      action: null,
      documents: completedDocuments,
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
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Insights & Recommendations</h2>
            </div>
            <div className="flex items-center gap-2">
              <TabsList>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="status">Document Status</TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          <div className="text-sm flex items-center gap-2 mb-6">
            <span className="text-muted-foreground">Document completion:</span>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden flex-1">
              <div 
                className={`h-full ${documentCompletionPercentage === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${documentCompletionPercentage}%` }}
              ></div>
            </div>
            <span className="font-medium">{documentCompletionPercentage}%</span>
          </div>
          
          <TabsContent value="insights">
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
                                    
                                    {(insight.title === "Healthy Documents" || insight.title === "Expiring Soon") && (
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {mostCommonType.type && (
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 pb-2">
                    <div className="flex items-center gap-3">
                      <FileSearch className="h-5 w-5 text-blue-500" />
                      <CardTitle className="text-base">Document Trend</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">
                      Your most common document type is <span className="font-medium text-foreground">{mostCommonType.type}</span> with {mostCommonType.count} documents.
                    </p>
                  </CardContent>
                </Card>
              )}
              
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 pb-2">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-indigo-500" />
                    <CardTitle className="text-base">Account Status</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Subscription Plan:</span>
                    <Badge className="capitalize bg-indigo-500">
                      {userSettings.subscriptionPlan || "free"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Document Limit:</span>
                    <span className="text-sm font-medium">
                      {documents.length} / {userSettings.documentLimit || 10}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="status">
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-amber-500" />
                      Active
                    </CardTitle>
                    <Badge variant="secondary">{healthyDocuments.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="max-h-[300px] overflow-y-auto">
                  {healthyDocuments.length > 0 ? (
                    <div className="space-y-2">
                      {healthyDocuments.map(doc => (
                        <div key={doc.id} className="p-2 text-sm border-b flex items-center justify-between">
                          <span className="truncate mr-2">{doc.title}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleMarkDocumentComplete(doc.id)}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                              <span className="sr-only">Mark Complete</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-sm text-muted-foreground py-8">No active documents</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Flame className="h-4 w-4 text-red-500" />
                      Expired
                    </CardTitle>
                    <Badge variant="secondary">{expiredDocuments.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="max-h-[300px] overflow-y-auto">
                  {expiredDocuments.length > 0 ? (
                    <div className="space-y-2">
                      {expiredDocuments.map(doc => (
                        <div key={doc.id} className="p-2 text-sm border-b flex items-center justify-between">
                          <span className="truncate mr-2">{doc.title}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleActionClick("Schedule renewal", doc.id)}
                            >
                              <RotateCw className="h-3.5 w-3.5 text-blue-500" />
                              <span className="sr-only">Renew</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-sm text-muted-foreground py-8">No expired documents</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Archive className="h-4 w-4 text-green-500" />
                      Completed
                    </CardTitle>
                    <Badge variant="secondary">{completedDocuments.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="max-h-[300px] overflow-y-auto">
                  {completedDocuments.length > 0 ? (
                    <div className="space-y-2">
                      {completedDocuments.map(doc => (
                        <div key={doc.id} className="p-2 text-sm border-b flex items-center justify-between">
                          <span className="truncate mr-2">{doc.title}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => updateDocument(doc.id, { status: 'active' })}
                            >
                              <RotateCw className="h-3.5 w-3.5 text-blue-500" />
                              <span className="sr-only">Reactivate</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-sm text-muted-foreground py-8">No completed documents</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </BlurContainer>
      
      {/* Schedule Renewal Dialog */}
      <Dialog open={showRenewalDialog} onOpenChange={setShowRenewalDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Document Renewal</DialogTitle>
            <DialogDescription>
              Select a new due date for this document to mark it as active again.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex flex-col items-center">
              <CalendarComponent
                mode="single"
                selected={renewalDate}
                onSelect={setRenewalDate}
                className="border rounded-md p-3"
                disabled={(date) => date < new Date()}
              />
            </div>
            
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setShowRenewalDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleScheduleRenewal} disabled={!renewalDate}>
                Schedule Renewal
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Organize Documents Dialog */}
      <Dialog open={showDocumentsToOrganize} onOpenChange={setShowDocumentsToOrganize}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Organize Documents</DialogTitle>
            <DialogDescription>
              Add missing metadata to improve your document organization
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 border-r pr-4">
                <h4 className="font-medium text-sm mb-2">Documents to Organize</h4>
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {incompleteDocuments.map(doc => (
                    <div 
                      key={doc.id} 
                      className={`p-2 text-sm border rounded-md cursor-pointer 
                        ${selectedDocId === doc.id ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'}`}
                      onClick={() => handleSelectDocToOrganize(doc.id)}
                    >
                      <div className="font-medium truncate">{doc.title}</div>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {!doc.category && (
                          <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
                            No category
                          </Badge>
                        )}
                        {(!doc.tags || doc.tags.length === 0) && (
                          <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
                            No tags
                          </Badge>
                        )}
                        {!doc.notes && (
                          <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
                            No notes
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:col-span-2">
                {selectedDocId ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <div className="flex gap-2">
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={docCategory}
                          onChange={(e) => setDocCategory(e.target.value)}
                        >
                          <option value="">Select category...</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="custom-category">Add Custom Category</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="custom-category"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="New category name"
                        />
                        <Button 
                          onClick={handleAddCustomCategory}
                          disabled={!customCategory.trim()}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input 
                        id="tags"
                        value={docTags}
                        onChange={(e) => setDocTags(e.target.value)}
                        placeholder="Invoice, Important, Tax"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea 
                        id="notes"
                        value={docNotes}
                        onChange={(e) => setDocNotes(e.target.value)}
                        placeholder="Add notes about this document..."
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setSelectedDocId(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveDocOrganization}>
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-10">
                    <FolderOpen className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-center text-muted-foreground">
                      Select a document from the list to organize it
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AnalyticsInsights;
