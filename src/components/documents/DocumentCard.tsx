import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, FileText, Trash2, Download, ExternalLink, Pencil, Bell, AlertTriangle, Clock, Share2, Mail, MessageSquare, Facebook, Twitter, Linkedin, Copy, CheckCircle, FileWarning, Shield, ShieldOff } from "lucide-react";
import BlurContainer from "../ui/BlurContainer";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useDocuments, Document } from "@/contexts/DocumentContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { speakNotification } from "@/services/NotificationService";
import DocumentReminderSettings from "./DocumentReminderSettings";
import { useUser } from "@/contexts/UserContext";
import DocumentStatusSelector from "./DocumentStatusSelector";

interface DocumentCardProps extends Document {
  className?: string;
}

const DocumentCard = ({
  id,
  title,
  type,
  dueDate,
  daysRemaining,
  description,
  fileURL,
  className,
  importance = "medium", // Default importance
  customReminderDays,
  status = "active", // Default status
  inSecureVault = false,
}: DocumentCardProps) => {
  const { updateDocument, deleteDocument, moveToSecureVault, removeFromSecureVault } = useDocuments();
  const { userSettings, updateUserSettings } = useUser();
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [notes, setNotes] = useState(description || "");
  const [showSharePopover, setShowSharePopover] = useState(false);
  const [showCalendarPopover, setShowCalendarPopover] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(dueDate ? new Date(dueDate) : undefined);
  const [showReminderSettings, setShowReminderSettings] = useState(false);
  
  const [isCopied, setIsCopied] = useState(false);
  
  // Add document to recent list when card is clicked
  const addToRecentDocuments = () => {
    const maxRecentDocs = userSettings.recentDocumentsMaxCount || 5;
    const currentRecent = userSettings.recentDocuments || [];
    
    // Remove the document from its current position (if it exists)
    let updatedRecent = currentRecent.filter(docId => docId !== id);
    
    // Add to the beginning of the array
    updatedRecent.unshift(id);
    
    // Limit the number of recent documents
    if (updatedRecent.length > maxRecentDocs) {
      updatedRecent = updatedRecent.slice(0, maxRecentDocs);
    }
    
    // Update user settings
    updateUserSettings({
      recentDocuments: updatedRecent,
      lastViewedDocument: id
    });
  };
  
  const handleCardClick = () => {
    setShowPreview(true);
    addToRecentDocuments();
  };
  
  const handleEditNotes = () => {
    updateDocument(id, { description: notes });
    toast({
      title: "Notes Updated",
      description: "Your notes have been updated",
    });
  };
  
  const handleDeleteDocument = () => {
    deleteDocument(id);
    setShowDeleteAlert(false);
    toast({
      title: "Document Deleted",
      description: "This document has been permanently deleted",
    });
    
    // Also remove from recent documents if it exists there
    if (userSettings.recentDocuments?.includes(id)) {
      const updatedRecent = userSettings.recentDocuments.filter(docId => docId !== id);
      updateUserSettings({
        recentDocuments: updatedRecent
      });
    }
  };
  
  const handleDownloadDocument = () => {
    // Trigger the download by creating a temporary link
    const link = document.createElement('a');
    link.href = fileURL;
    link.download = title; // Set the filename for the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: "Your download should start automatically",
    });
  };
  
  const handleShareLink = () => {
    navigator.clipboard.writeText(fileURL);
    setIsCopied(true);
    toast({
      title: "Link Copied",
      description: "The document link has been copied to your clipboard",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setShowCalendarPopover(false);
    
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      updateDocument(id, { dueDate: formattedDate, daysRemaining: daysRemaining });
      
      toast({
        title: "Due Date Updated",
        description: `The due date has been updated to ${format(date, "PPP")}`,
      });
    }
  };
  
  const getCardBorderStyle = () => {
    switch (importance) {
      case "low":
        return "border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/10";
      case "medium":
        return "border-l-4 border-l-amber-400 bg-amber-50 dark:bg-amber-900/10";
      case "high":
        return "border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/10";
      case "critical":
        return "border-l-4 border-l-red-600 bg-red-50 dark:bg-red-900/10";
      default:
        return "";
    }
  };

  // Handle moving document to secure vault
  const handleMoveToSecureVault = (e: React.MouseEvent) => {
    e.stopPropagation();
    moveToSecureVault(id);
    setShowPreview(false); // Close any open preview
    toast({
      title: "Document Protected",
      description: "Document moved to secure vault"
    });
  };

  // Handle removing document from secure vault
  const handleRemoveFromSecureVault = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromSecureVault(id);
    toast({
      title: "Document Unprotected",
      description: "Document removed from secure vault"
    });
  };
  
  // Check if this document is in recent documents
  const isRecent = userSettings.recentDocuments?.includes(id);

  // Get status icon for display in card
  const getStatusIcon = () => {
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
        return <Trash2 className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>; // Changed from "warning" to "secondary"
      case "deleted":
        return <Badge variant="destructive">Deleted</Badge>;
      default:
        return <Badge variant="outline">Undefined</Badge>;
    }
  };

  return (
    <>
      <BlurContainer 
        className={cn(
          "document-card document-card-hover cursor-pointer p-4 transition-all duration-300", 
          className,
          getCardBorderStyle(),
          status === "completed" && "opacity-75",
          inSecureVault && "border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-900/10",
          isRecent && "ring-2 ring-blue-200 dark:ring-blue-800"
        )}
        hover
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="animate-pulse-subtle">
                {type}
              </Badge>
              {inSecureVault && (
                <span className="text-purple-500"><Shield className="h-4 w-4" /></span>
              )}
              {isRecent && (
                <span className="text-blue-500"><Clock className="h-4 w-4" /></span>
              )}
              {status && (
                <Badge variant={
                  status === "completed" ? "default" : 
                  status === "expired" ? "destructive" : 
                  status === "pending" ? "warning" : 
                  "outline"
                } className={status === "completed" ? "bg-green-500 text-white" : ""}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon()}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </Badge>
              )}
              {daysRemaining !== undefined && daysRemaining <= 7 && status !== "completed" && (
                <Badge variant="destructive">
                  {daysRemaining === 0 ? "Due Today" : `Due in ${daysRemaining} Days`}
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold line-clamp-1">{title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description || "No description provided"}
              </p>
            </div>
          </div>
          {fileURL ? (
            <a href={fileURL} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          ) : (
            <FileWarning className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        
        <div className="mt-3 flex justify-end gap-2">
          {dueDate && status !== "completed" && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Due Date: {format(new Date(dueDate), "PPP")}
              </p>
              {daysRemaining !== undefined && (
                <p className="text-xs text-muted-foreground">
                  {daysRemaining >= 0 ? `${daysRemaining} days remaining` : "Overdue"}
                </p>
              )}
            </div>
          )}
          {status === "completed" && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Completed
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-3 flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-8 w-8 p-0 rounded-full ${
              inSecureVault 
                ? "bg-purple-100 text-purple-600 hover:text-purple-800 hover:bg-purple-200" 
                : "bg-violet-100 text-violet-600 hover:text-violet-800 hover:bg-violet-200"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              inSecureVault ? handleRemoveFromSecureVault(e) : handleMoveToSecureVault(e);
            }}
            title={inSecureVault ? "Remove from Secure Vault" : "Move to Secure Vault"}
          >
            {inSecureVault ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
            <span className="sr-only">{inSecureVault ? "Remove from Secure Vault" : "Move to Secure Vault"}</span>
          </Button>
          
          {/* Status selector (compact mode) */}
          <DocumentStatusSelector documentId={id} currentStatus={status} compact={true} />
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full bg-blue-100 text-blue-600 hover:text-blue-800 hover:bg-blue-200" onClick={(e) => {e.stopPropagation(); setShowReminderSettings(true)}}>
            <Bell className="h-4 w-4" />
            <span className="sr-only">Edit Reminder Settings</span>
          </Button>
        </div>
      </BlurContainer>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              View document details and manage settings
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Document Details</h3>
                <p><strong>Type:</strong> {type}</p>
                <p>
                  <strong>Importance:</strong>{" "}
                  {importance === "low" && <Badge variant="secondary">Low</Badge>}
                  {importance === "medium" && <Badge variant="outline">Medium</Badge>}
                  {importance === "high" && <Badge variant="destructive">High</Badge>}
                  {importance === "critical" && <Badge variant="destructive">Critical</Badge>}
                </p>
                {dueDate && (
                  <p><strong>Due Date:</strong> {format(new Date(dueDate), "PPP")}</p>
                )}
                {daysRemaining !== undefined && (
                  <p><strong>Days Remaining:</strong> {daysRemaining}</p>
                )}
                {inSecureVault && (
                  <p><strong>Vault:</strong> <span className="text-purple-500">Secured <Shield className="inline-block h-4 w-4 ml-1 align-text-bottom" /></span></p>
                )}
                {isRecent && (
                  <p><strong>Recently Viewed:</strong> <span className="text-blue-500">Yes <Clock className="inline-block h-4 w-4 ml-1 align-text-bottom" /></span></p>
                )}
              </div>
              
              {/* Add the document status selector in full size variant */}
              <DocumentStatusSelector documentId={id} currentStatus={status} />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Notes</h3>
                <Textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="Add notes about this document..." 
                />
                <Button onClick={handleEditNotes}>Update Notes</Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Actions</h3>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" onClick={handleDownloadDocument}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Document
                  </Button>
                  
                  <Popover open={showSharePopover} onOpenChange={setShowSharePopover}>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Document
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Share Link</h4>
                          <div className="flex items-center">
                            <Input value={fileURL} readOnly className="mr-2" />
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              onClick={handleShareLink}
                              disabled={isCopied}
                            >
                              {isCopied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                              {isCopied ? "Copied!" : "Copy"}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Share via</h4>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Facebook className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Twitter className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Linkedin className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Popover open={showCalendarPopover} onOpenChange={setShowCalendarPopover}>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Set Due Date
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Button variant="destructive" onClick={() => setShowDeleteAlert(true)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Document
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your document from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteAlert(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDocument}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <DocumentReminderSettings 
        document={
          {
            id,
            title,
            type,
            dueDate,
            daysRemaining,
            description,
            fileURL,
            importance,
            customReminderDays,
            status,
            inSecureVault
          }
        }
        isOpen={showReminderSettings}
        onClose={() => setShowReminderSettings(false)}
      />
    </>
  );
};

export default DocumentCard;
