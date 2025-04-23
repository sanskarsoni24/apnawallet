import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Camera } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useDocuments } from "@/contexts/DocumentContext";
import { useUser } from "@/contexts/UserContext";
import { DocumentTable } from "@/components/documents/DocumentTable";
import { DocumentGrid } from "@/components/documents/DocumentGrid";
import { DocumentCalendar } from "@/components/documents/DocumentCalendar";
import { DocumentUpload } from "@/components/documents/DocumentUpload";
import { SearchBar } from "@/components/ui/search-bar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DocumentType } from "@/components/documents/DocumentType";
import { DocumentImportance } from "@/components/documents/DocumentImportance";
import { DocumentStatus } from "@/components/documents/DocumentStatus";
import { DocumentTimeline } from "@/components/documents/DocumentTimeline";
import Container from "@/components/layout/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocumentScanner from "@/components/mobile/DocumentScanner";
import { useMobile } from "@/hooks/use-mobile";

const Documents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { documents, addDocument, updateDocument, deleteDocument, documentTypes } = useDocuments();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedView, setSelectedView] = useState<"table" | "grid" | "calendar">("table");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editType, setEditType] = useState("");
  const [editIssueDate, setEditIssueDate] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editNotes, setEditNotes] = useState("");
  const [editImportance, setEditImportance] = useState<Document["importance"]>("medium");
  const [editStatus, setEditStatus] = useState<Document["status"]>("active");
  const [showTimeline, setShowTimeline] = useState(false);
  const { isMobile } = useMobile();
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (selectedDocument) {
      setEditTitle(selectedDocument.title);
      setEditDescription(selectedDocument.description || "");
      setEditType(selectedDocument.type);
      setEditIssueDate(selectedDocument.issueDate || "");
      setEditDueDate(selectedDocument.dueDate || "");
      setEditTags(selectedDocument.tags || []);
      setEditNotes(selectedDocument.notes || "");
      setEditImportance(selectedDocument.importance || "medium");
      setEditStatus(selectedDocument.status || "active");
    }
  }, [selectedDocument]);

  const handleDocumentUploaded = (newDocument: Document) => {
    addDocument(newDocument);
    toast({
      title: "Document uploaded",
      description: "Your document has been successfully uploaded.",
    });
  };

  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsDialogOpen(true);
  };

  const handleUpdateDocument = () => {
    if (!selectedDocument) return;

    const updatedDocument = {
      ...selectedDocument,
      title: editTitle,
      description: editDescription,
      type: editType,
      issueDate: editIssueDate,
      dueDate: editDueDate,
      tags: editTags,
      notes: editNotes,
      importance: editImportance,
      status: editStatus,
    };

    updateDocument(updatedDocument);
    setIsDialogOpen(false);
    setSelectedDocument(null);
    toast({
      title: "Document updated",
      description: "Your document has been successfully updated.",
    });
  };

  const handleDeleteDocument = (documentId: string) => {
    deleteDocument(documentId);
    toast({
      title: "Document deleted",
      description: "Your document has been successfully deleted.",
    });
  };

  const filteredDocuments = documents.filter((doc) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(searchTerm) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm)) ||
      doc.type.toLowerCase().includes(searchTerm) ||
      (doc.tags && doc.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
    );
  });

  return (
    <Container>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Documents</h1>
            <p className="text-muted-foreground">
              Manage and organize all your important documents
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {isMobile ? (
              <Button
                onClick={() => setShowScanner(true)}
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Scan Document
              </Button>
            ) : (
              <DocumentUpload onDocumentUploaded={handleDocumentUploaded} />
            )}
          </div>
        </div>
        
        {/* Mobile document scanner */}
        {isMobile && showScanner && (
          <Dialog open={showScanner} onOpenChange={setShowScanner}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Scan Document</DialogTitle>
              </DialogHeader>
              <DocumentScanner 
                onDocumentScanned={(doc) => {
                  setShowScanner(false);
                  // Handle scanned document
                  handleDocumentUploaded({
                    id: `doc-${Date.now()}`,
                    userId: "current-user",
                    title: doc.title || "Scanned Document",
                    type: doc.category as any || "other",
                    ...doc
                  });
                }}
              />
            </DialogContent>
          </Dialog>
        )}
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <SearchBar onSearch={setSearchQuery} />
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="space-x-2">
                  <span>View</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSelectedView("table")}>Table</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedView("grid")}>Grid</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedView("calendar")}>Calendar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setShowTimeline(!showTimeline)}>
              {showTimeline ? "Hide Timeline" : "Show Timeline"}
            </Button>
          </div>
        </div>

        {showTimeline && <DocumentTimeline />}

        {selectedView === "table" && (
          <DocumentTable
            documents={filteredDocuments}
            onEdit={handleEditDocument}
            onDelete={handleDeleteDocument}
          />
        )}
        {selectedView === "grid" && (
          <DocumentGrid
            documents={filteredDocuments}
            onEdit={handleEditDocument}
            onDelete={handleDeleteDocument}
          />
        )}
        {selectedView === "calendar" && <DocumentCalendar documents={filteredDocuments} />}

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Document</AlertDialogTitle>
              <AlertDialogDescription>
                Make changes to your document here. Click save when you're done.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <DocumentType value={editType} onChange={(value) => setEditType(value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="issueDate" className="text-right">
                  Issue Date
                </Label>
                <Input
                  type="date"
                  id="issueDate"
                  value={editIssueDate}
                  onChange={(e) => setEditIssueDate(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Input
                  type="date"
                  id="dueDate"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="importance" className="text-right">
                  Importance
                </Label>
                <DocumentImportance value={editImportance} onChange={(value) => setEditImportance(value as Document["importance"])} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <DocumentStatus value={editStatus} onChange={(value) => setEditStatus(value as Document["status"])} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Input
                  id="notes"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedDocument(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleUpdateDocument}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Container>
  );
};

export default Documents;
