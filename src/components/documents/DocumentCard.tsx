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
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description || "");
  const [date, setDate] = useState<Date | undefined>();
  const [showReminderSettings, setShowReminderSettings] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const { deleteDocument, updateDocument, updateDueDate, markDocumentComplete, markDocumentExpired, scheduleRenewal, moveToSecureVault, removeFromSecureVault } = useDocuments();
  
  // Update local state when props change
  useEffect(() => {
    setEditTitle(title);
    setEditDescription(description || "");
  }, [title, description]);

  const getStatusVariant = () => {
    if (status === "expired" || daysRemaining < 0) return "destructive";
    if (status === "completed") return "outline";
    if (daysRemaining < 3) return "default";
    return "secondary";
  };

  const getStatusText = () => {
    if (status === "expired") return "Expired";
    if (status === "completed") return "Completed";
    if (daysRemaining < 0) return "Overdue";
    if (daysRemaining === 0) return "Due today";
    if (daysRemaining === 1) return "Due tomorrow";
    return `${daysRemaining} days left`;
  };
  
  // Get importance based on due date
  const getImportance = () => {
    if (status === "completed") return "low";
    if (status === "expired" || daysRemaining < 0) return "critical"; // Overdue
    if (daysRemaining <= 3) return "high"; // Due soon
    if (daysRemaining <= 7) return "medium"; // Coming up
    return "low"; // Plenty of time
  };
  
  // Get importance badge color
  const getImportanceBadge = () => {
    const importance = getImportance();
    switch (importance) {
      case "critical": 
        return "bg-red-600 text-white";
      case "high": 
        return "bg-orange-500 text-white";
      case "medium": 
        return "bg-amber-400 text-black";
      default: 
        return "bg-green-500 text-white";
    }
  };

  const handleDelete = () => {
    deleteDocument(id);
    setShowDeleteConfirm(false);
    toast({
      title: "Document deleted",
      description: `${title} has been removed.`,
    });
  };

  const handleCardClick = () => {
    setShowPreview(true);
  };

  const handleSaveEdit = () => {
    updateDocument(id, {
      title: editTitle,
      description: editDescription
    });
    setIsEditing(false);
    toast({
      title: "Document updated",
      description: "Your changes have been saved."
    });
  };

  const isPdfFile = fileURL?.toLowerCase().includes('.pdf');
  const isImageFile = fileURL?.toLowerCase().match(/\.(jpeg|jpg|gif|png|webp)$/);
  
  const openFileInNewTab = () => {
    if (fileURL) {
      window.open(fileURL, '_blank');
    }
  };
  
  // Handle file download
  const handleDownload = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (fileURL) {
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = title || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: `${title} is being downloaded.`,
      });
    }
  };

  // Parse the dueDate string to a Date object for the calendar
  const parseDueDate = () => {
    try {
      // Try direct parsing first
      let dateObj = new Date(dueDate);
      
      // If invalid, try parsing "Month Day, Year" format
      if (isNaN(dateObj.getTime())) {
        const parts = dueDate.split(" ");
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
      
      return isNaN(dateObj.getTime()) ? undefined : dateObj;
    } catch (error) {
      console.error("Error parsing date:", error);
      return undefined;
    }
  };

  // Function to handle changing the due date
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      const formattedDate = format(newDate, "MMMM d, yyyy");
      updateDueDate(id, formattedDate);
      toast({
        title: "Due date updated",
        description: `The due date for ${title} has been changed to ${formattedDate}.`
      });
    }
  };

  // Function to handle changing document status
  const handleStatusChange = (newStatus: 'active' | 'expired' | 'completed') => {
    if (newStatus === 'completed') {
      markDocumentComplete(id);
    } else if (newStatus === 'expired') {
      markDocumentExpired(id);
    } else if (newStatus === 'active') {
      // Reactivate document
      const parsedDate = parseDueDate();
      if (parsedDate) {
        const formattedDate = format(parsedDate, "MMMM d, yyyy");
        scheduleRenewal(id, formattedDate);
      } else {
        updateDocument(id, { status: 'active' });
        toast({
          title: "Document Activated",
          description: `${title} has been marked as active.`
        });
      }
    }
    setShowStatusOptions(false);
  };

  // Function to handle voice reminder
  const handleVoiceReminder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const reminderText = `Reminder: ${title} is due in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}.`;
    const success = speakNotification(reminderText);
    
    if (success) {
      toast({
        title: "Voice Reminder",
        description: "Reminder has been spoken.",
      });
    } else {
      toast({
        title: "Voice Reminder Unavailable",
        description: "Your browser doesn't support speech synthesis.",
        variant: "destructive"
      });
    }
  };

  // Sharing functions
  const getShareUrl = () => {
    // In a real app, this would generate a unique sharing URL
    const baseUrl = window.location.origin;
    return `${baseUrl}/shared-document/${id}`;
  };

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(getShareUrl());
    toast({
      title: "Link copied",
      description: "Document link copied to clipboard",
    });
    setShowShareOptions(false);
  };

  const shareViaEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    const subject = encodeURIComponent(`Document Shared: ${title}`);
    const body = encodeURIComponent(`Check out this document: ${title}\n\n${getShareUrl()}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    setShowShareOptions(false);
  };

  const shareViaWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(`Check out this document: ${title} ${getShareUrl()}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowShareOptions(false);
  };

  const shareViaFacebook = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`, '_blank');
    setShowShareOptions(false);
  };

  const shareViaTwitter = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(`Check out this document: ${title}`);
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(getShareUrl())}&text=${text}`, '_blank');
    setShowShareOptions(false);
  };

  const shareViaLinkedIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`, '_blank');
    setShowShareOptions(false);
  };

  // Handle moving document to secure vault
  const handleMoveToSecureVault = (e: React.MouseEvent) => {
    e.stopPropagation();
    moveToSecureVault(id);
    setShowPreview(false); // Close any open preview
  };

  // Handle removing document from secure vault
  const handleRemoveFromSecureVault = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromSecureVault(id);
  };

  // Fix for DocumentReminderSettings - ensure document always has fileURL property
  const documentWithFileURL: Document = {
    id,
    title,
    type,
    dueDate,
    daysRemaining,
    description: description || "",
    customReminderDays,
    fileURL: fileURL || "",
    status,
    inSecureVault
  };

  // Determine card border color based on status
  const getCardBorderStyle = () => {
    if (status === "expired") return "border-l-4 border-l-red-500";
    if (status === "completed") return "border-l-4 border-l-green-500";
    if (getImportance() === "critical") return "border-l-4 border-l-red-500";
    if (getImportance() === "high") return "border-l-4 border-l-amber-500";
    if (getImportance() === "medium") return "border-l-4 border-l-indigo-500";
    return "border-l-4 border-l-teal-500";
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
              {status === "expired" && (
                <span className="text-red-500"><FileWarning className="h-4 w-4" /></span>
              )}
              {getImportance() === "critical" && status !== "expired" && status !== "completed" && (
                <span className="text-red-500"><AlertTriangle className="h-4 w-4" /></span>
              )}
            </div>
            <h3 className="text-base font-medium mt-2 hover:text-primary transition-colors">{title}</h3>
            {description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
            )}
            <div className="mt-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${getImportanceBadge()}`}>
                {getImportance().charAt(0).toUpperCase() + getImportance().slice(1)} Priority
              </span>
              {customReminderDays !== undefined && (
                <span className="ml-2 text-xs text-muted-foreground">
                  Reminder: {customReminderDays} days before
                </span>
              )}
            </div>
          </div>
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors">
            <FileText className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <CalendarIcon className="h-4 w-4" />
            <span>{dueDate}</span>
          </div>
          <Badge variant={getStatusVariant()} className="transition-all">
            {getStatusText()}
          </Badge>
        </div>
        
        <div className="mt-3 flex justify-end gap-2">
          
          {fileURL && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 rounded-full bg-blue-100 text-blue-600 hover:text-blue-800 hover:bg-blue-200"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              <span className="sr-only">Download</span>
            </Button>
          )}
          <Popover open={showStatusOptions} onOpenChange={setShowStatusOptions}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full bg-purple-100 text-purple-600 hover:text-purple-800 hover:bg-purple-200"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Clock className="h-4 w-4" />
                <span className="sr-only">Change Status</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium mb-1">Update Status</h4>
                <div className="grid grid-cols-1 gap-2">
                  {status !== "active" && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex justify-start gap-2 pl-2"
                      onClick={() => handleStatusChange('active')}
                    >
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>Mark as Active</span>
                    </Button>
                  )}
                  {status !== "completed" && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex justify-start gap-2 pl-2"
                      onClick={() => handleStatusChange('completed')}
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Mark as Completed</span>
                    </Button>
                  )}
                  {status !== "expired" && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex justify-start gap-2 pl-2"
                      onClick={() => handleStatusChange('expired')}
                    >
                      <FileWarning className="h-4 w-4 text-red-500" />
                      <span>Mark as Expired</span>
                    </Button>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 rounded-full bg-indigo-100 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-200"
            onClick={(e) => {
              e.stopPropagation();
              setShowReminderSettings(true);
            }}
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Reminder Settings</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 rounded-full bg-amber-100 text-amber-600 hover:text-amber-800 hover:bg-amber-200"
            onClick={handleVoiceReminder}
          >
            <Bell className="h-4 w-4" />
            <span className="sr-only">Voice Reminder</span>
          </Button>
          <Popover open={showShareOptions} onOpenChange={setShowShareOptions}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full bg-green-100 text-green-600 hover:text-green-800 hover:bg-green-200"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium mb-1">Share "{title}"</h4>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex flex-col items-center justify-center p-2 h-auto"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-5 w-5 mb-1" />
                    <span className="text-xs">Copy Link</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex flex-col items-center justify-center p-2 h-auto"
                    onClick={shareViaEmail}
                  >
                    <Mail className="h-5 w-5 mb-1" />
                    <span className="text-xs">Email</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex flex-col items-center justify-center p-2 h-auto"
                    onClick={shareViaWhatsApp}
                  >
                    <MessageSquare className="h-5 w-5 mb-1" />
                    <span className="text-xs">WhatsApp</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex flex-col items-center justify-center p-2 h-auto"
                    onClick={shareViaFacebook}
                  >
                    <Facebook className="h-5 w-5 mb-1" />
                    <span className="text-xs">Facebook</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex flex-col items-center justify-center p-2 h-auto"
                    onClick={shareViaTwitter}
                  >
                    <Twitter className="h-5 w-5 mb-1" />
                    <span className="text-xs">Twitter</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex flex-col items-center justify-center p-2 h-auto"
                    onClick={shareViaLinkedIn}
                  >
                    <Linkedin className="h-5 w-5 mb-1" />
                    <span className="text-xs">LinkedIn</span>
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
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
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 rounded-full bg-sky-100 text-sky-600 hover:text-sky-800 hover:bg-sky-200"
            onClick={(e) => {
              e.stopPropagation();
              setShowPreview(true);
              setIsEditing(true);
            }}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 rounded-full bg-red-100 text-red-600 hover:text-red-800 hover:bg-red-200"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </BlurContainer>

      {/* Document Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Document" : title}</DialogTitle>
            {!isEditing && status && (
              <DialogDescription>
                Status: <Badge variant={getStatusVariant()} className="ml-1">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
              </DialogDescription>
            )}
          </DialogHeader>
          
          {isEditing ? (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  value={editTitle} 
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Document title"
                  className="transition-all focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "MMMM d, yyyy") : dueDate}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date || parseDueDate()}
                      onSelect={handleDateChange}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description / Notes</label>
                <Textarea 
                  value={editDescription} 
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Add notes about this document..."
                  className="min-h-[100px] transition-all focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant={status === "active" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => updateDocument(id, { status: "active" })}
                  >
                    Active
                  </Button>
                  <Button 
                    type="button" 
                    variant={status === "completed" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => updateDocument(id, { status: "completed" })}
                  >
                    Completed
                  </Button>
                  <Button 
                    type="button" 
                    variant={status === "expired" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => updateDocument(id, { status: "expired" })}
                  >
                    Expired
                  </Button>
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)} className="hover:bg-secondary/80 transition-colors">
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} className="hover:bg-primary/90 transition-colors">
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              {fileURL ? (
                <div className="w-full max-h-[60vh] overflow-auto border rounded-md">
                  {isPdfFile ? (
                    <div className="p-8 text-center">
                      <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="mt-3 font-medium">PDF Document</p>
                      <p className="mt-1 text-sm text-muted-foreground">PDF preview is not available directly</p>
                      <div className="flex justify-center gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-2"
                          onClick={openFileInNewTab}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open PDF
                        </Button>
                        <Button 
                          variant="default" 
                          className="flex items-center gap-2"
                          onClick={handleDownload}
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : isImageFile ? (
                    <div className="relative">
                      <img 
                        src={fileURL} 
                        alt={title} 
                        className="w-full h-auto object-contain max-h-[400px]"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/600x400?text=Image+Preview+Failed';
                          target.onerror = null; // Prevent infinite loops
                        }}
                      />
                      <div className="absolute bottom-2 right-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleDownload}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                      <p className="mt-3 font-medium">Document Preview</p>
                      <p className="mt-1 text-sm text-muted-foreground">This file type cannot be previewed</p>
                      <div className="flex justify-center gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-2"
                          onClick={openFileInNewTab}
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open File
                        </Button>
                        <Button 
                          variant="default" 
                          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                          onClick={handleDownload}
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center border rounded-md w-full">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="mt-3 font-medium">No document attached</p>
                  <div className="mt-4 text-left px-4 py-2 bg-muted/30 rounded-md">
                    <p className="mb-2"><strong>Document details:</strong></p>
                    <p><strong>Type:</strong> {type}</p>
                    <p><strong>Due Date:</strong> {dueDate}</p>
                    <p><strong>Status:</strong> {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Active'}</p>
                    <p><strong>Priority:</strong> {getImportance().charAt(0).toUpperCase() + getImportance().slice(1)}</p>
                    {customReminderDays !== undefined && (
                      <p><strong>Custom reminder:</strong> {customReminderDays} days before due date</p>
                    )}
                    {description && (
                      <div className="mt-3">
                        <p><strong>Notes:</strong></p>
                        <p className="whitespace-pre-wrap">{description}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between w-full mt-2 flex-wrap gap-2">
                <div className="flex gap-2">
                  
                  <Button 
                    variant="outline" 
                    className={`flex items-center gap-2 ${status === 'active' ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
                    onClick={() => handleStatusChange('active')}
                    disabled={status === 'active'}
                  >
                    <Clock className="h-4 w-4" />
                    <span className="whitespace-nowrap">Mark Active</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`flex items-center gap-2 ${status === 'completed' ? 'bg-green-50 border-green-200 text-green-700' : ''}`}
                    onClick={() => handleStatusChange('completed')}
                    disabled={status === 'completed'}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span className="whitespace-nowrap">Mark Complete</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`flex items-center gap-2 ${status === 'expired' ? 'bg-red-50 border-red-200 text-red-700' : ''}`}
                    onClick={() => handleStatusChange('expired')}
                    disabled={status === 'expired'}
                  >
                    <FileWarning className="h-4 w-4" />
                    <span className="whitespace-nowrap">Mark Expired</span>
                  </Button>
