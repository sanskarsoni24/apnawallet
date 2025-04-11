
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useDocuments } from "@/contexts/DocumentContext";
import {
  FileText,
  FilePlus2,
  Lock,
  Unlock,
  FileSearch,
  SplitSquareVertical,
  Combine,
  Scissors,
  RotateCw,
  FileDown,
  Trash2,
  Loader2
} from "lucide-react";
import PdfViewer from "./PdfViewer";

const PdfTools = () => {
  const [selectedTab, setSelectedTab] = useState("view");
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pdfPassword, setPdfPassword] = useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordAction, setPasswordAction] = useState<"add" | "remove">("add");
  
  const { documents } = useDocuments();
  const { toast } = useToast();
  
  // Filter PDF documents only
  const pdfDocuments = documents.filter(doc => 
    doc.fileType?.toLowerCase().includes("pdf") ||
    doc.fileName?.toLowerCase().endsWith(".pdf")
  );
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file",
          variant: "destructive"
        });
        return;
      }
      
      setUploadedFile(file);
      
      // Simulate processing
      toast({
        title: "PDF Uploaded",
        description: `${file.name} has been uploaded and is ready for processing`
      });
    }
  };
  
  const handlePasswordAction = (action: "add" | "remove") => {
    setPasswordAction(action);
    setIsPasswordDialogOpen(true);
  };
  
  const performPasswordAction = () => {
    setIsProcessing(true);
    setProcessingMessage(passwordAction === "add" ? "Adding password protection..." : "Removing password protection...");
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProcessingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          toast({
            title: passwordAction === "add" ? "Password Added" : "Password Removed",
            description: passwordAction === "add" 
              ? "The PDF has been successfully password protected" 
              : "Password protection has been removed from the PDF"
          });
          setIsProcessing(false);
          setIsPasswordDialogOpen(false);
          setPdfPassword("");
        }, 500);
      }
    }, 300);
  };
  
  const handleSplitPdf = () => {
    if (!selectedDocumentId) {
      toast({
        title: "No Document Selected",
        description: "Please select a PDF document to split",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setProcessingMessage("Splitting PDF into individual pages...");
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setProcessingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          toast({
            title: "PDF Split Complete",
            description: "The PDF has been split into individual pages and saved to your documents"
          });
          setIsProcessing(false);
        }, 500);
      }
    }, 200);
  };
  
  const handleMergePdfs = () => {
    setIsProcessing(true);
    setProcessingMessage("Merging selected PDF documents...");
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      setProcessingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          toast({
            title: "PDFs Merged",
            description: "Selected PDF documents have been merged into a single file"
          });
          setIsProcessing(false);
        }, 500);
      }
    }, 150);
  };
  
  const handleRotatePdf = () => {
    if (!selectedDocumentId) {
      toast({
        title: "No Document Selected",
        description: "Please select a PDF document to rotate",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setProcessingMessage("Rotating PDF pages...");
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 8;
      setProcessingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          toast({
            title: "PDF Rotated",
            description: "The PDF has been rotated and saved"
          });
          setIsProcessing(false);
        }, 500);
      }
    }, 200);
  };
  
  const handleCompressPdf = () => {
    if (!selectedDocumentId) {
      toast({
        title: "No Document Selected",
        description: "Please select a PDF document to compress",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    setProcessingMessage("Compressing PDF...");
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 3;
      setProcessingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          toast({
            title: "PDF Compressed",
            description: "The PDF file size has been reduced by 60%"
          });
          setIsProcessing(false);
        }, 500);
      }
    }, 100);
  };
  
  const handleViewPdf = (docId: string) => {
    setSelectedDocumentId(docId);
    setIsViewerOpen(true);
  };
  
  const selectedDocument = selectedDocumentId 
    ? documents.find(doc => doc.id === selectedDocumentId)
    : null;
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FileText className="h-6 w-6 text-primary" />
        PDF Tools
      </h1>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full mb-6">
          <TabsTrigger value="view">View PDFs</TabsTrigger>
          <TabsTrigger value="edit">Edit & Transform</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="utilities">Utilities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your PDF Documents</CardTitle>
                  <CardDescription>
                    Select a PDF from your document library to view or edit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    {pdfDocuments.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-medium mb-1">No PDF Documents Found</h3>
                        <p className="text-muted-foreground mb-4">
                          Upload PDF documents to start using the PDF tools
                        </p>
                        <label className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 cursor-pointer">
                          Upload PDF
                          <input 
                            type="file" 
                            className="sr-only" 
                            accept=".pdf"
                            onChange={handleFileUpload}
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {pdfDocuments.map(doc => (
                          <div 
                            key={doc.id}
                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50 ${
                              selectedDocumentId === doc.id ? 'bg-accent border-primary' : ''
                            }`}
                            onClick={() => setSelectedDocumentId(doc.id)}
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-8 w-8 text-primary" />
                              <div>
                                <div className="font-medium">{doc.title}</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  {doc.fileSize && <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>}
                                  {doc.pdfPageCount && <span>• {doc.pdfPageCount} pages</span>}
                                  {doc.isPasswordProtected && (
                                    <span className="flex items-center gap-1 text-amber-500">
                                      <Lock className="h-3 w-3" /> Protected
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewPdf(doc.id);
                              }}
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Upload New PDF</CardTitle>
                  <CardDescription>
                    Add a new PDF document to your library
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <div className="mb-6 w-full">
                    <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                      <FilePlus2 className="h-10 w-10 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Drag and drop your PDF here or click to browse
                      </p>
                      <label className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 cursor-pointer">
                        Browse Files
                        <input 
                          type="file" 
                          className="sr-only" 
                          accept=".pdf"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  </div>
                  
                  {uploadedFile && (
                    <div className="w-full p-3 rounded-lg border bg-accent/30">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <div className="flex-1 overflow-hidden">
                          <div className="font-medium truncate">{uploadedFile.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {(uploadedFile.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="edit" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SplitSquareVertical className="h-5 w-5" />
                  Split PDF
                </CardTitle>
                <CardDescription>
                  Separate a PDF into individual pages or sections
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Split your PDF document into individual pages or extract specific page ranges.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  onClick={handleSplitPdf}
                  disabled={!selectedDocumentId}
                  className="w-full"
                >
                  Split Document
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Combine className="h-5 w-5" />
                  Merge PDFs
                </CardTitle>
                <CardDescription>
                  Combine multiple PDF files into a single document
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Select multiple PDF documents and merge them into a single file with custom ordering.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  onClick={handleMergePdfs}
                  className="w-full"
                >
                  Merge PDFs
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCw className="h-5 w-5" />
                  Rotate PDF
                </CardTitle>
                <CardDescription>
                  Change the orientation of your PDF pages
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Rotate all pages or specify individual pages to change their orientation.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  onClick={handleRotatePdf}
                  disabled={!selectedDocumentId}
                  className="w-full"
                >
                  Rotate PDF
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileDown className="h-5 w-5" />
                  Compress PDF
                </CardTitle>
                <CardDescription>
                  Reduce the file size of your PDF documents
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Optimize your PDF files to reduce their size while maintaining quality.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  onClick={handleCompressPdf}
                  disabled={!selectedDocumentId}
                  className="w-full"
                >
                  Compress PDF
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5" />
                  Extract Pages
                </CardTitle>
                <CardDescription>
                  Extract specific pages from your PDF document
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Select specific pages to extract and save as a new PDF document.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  disabled={!selectedDocumentId}
                  className="w-full"
                >
                  Extract Pages
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Password Protect
                </CardTitle>
                <CardDescription>
                  Add password protection to your PDF files
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Secure your sensitive documents with password protection to prevent unauthorized access.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  onClick={() => handlePasswordAction("add")}
                  disabled={!selectedDocumentId}
                  className="w-full"
                >
                  Add Password
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Unlock className="h-5 w-5" />
                  Remove Protection
                </CardTitle>
                <CardDescription>
                  Remove password protection from your PDF files
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Remove password security from your PDF documents (requires original password).
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  onClick={() => handlePasswordAction("remove")}
                  disabled={!selectedDocumentId}
                  className="w-full"
                >
                  Remove Password
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="utilities" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSearch className="h-5 w-5" />
                  PDF Text Search
                </CardTitle>
                <CardDescription>
                  Search for text within your PDF documents
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Quickly find specific text, phrases, or patterns within your PDF documents.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  disabled={!selectedDocumentId}
                  className="w-full"
                >
                  Search PDF
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Remove Metadata
                </CardTitle>
                <CardDescription>
                  Remove hidden information from your PDF files
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Clean your PDF from hidden metadata, author information, and other sensitive data.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="default" 
                  disabled={!selectedDocumentId}
                  className="w-full"
                >
                  Remove Metadata
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {passwordAction === "add" ? "Add Password Protection" : "Remove Password Protection"}
            </DialogTitle>
            <DialogDescription>
              {passwordAction === "add" 
                ? "Enter a password to protect your PDF document" 
                : "Enter the current password to remove protection"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pdf-password">
                {passwordAction === "add" ? "New Password" : "Current Password"}
              </Label>
              <Input
                id="pdf-password"
                type="password"
                value={pdfPassword}
                onChange={(e) => setPdfPassword(e.target.value)}
                placeholder={passwordAction === "add" ? "Create a strong password" : "Enter current password"}
              />
              {passwordAction === "add" && (
                <p className="text-xs text-muted-foreground">
                  The password must be at least 6 characters long.
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={performPasswordAction}
              disabled={pdfPassword.length < 6}
            >
              {passwordAction === "add" ? "Secure Document" : "Remove Protection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* PDF Viewer Dialog */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="sm:max-w-[80vw] h-[90vh] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {selectedDocument?.title || "PDF Viewer"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            {selectedDocument && (
              <PdfViewer 
                document={selectedDocument} 
                onClose={() => setIsViewerOpen(false)} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Processing Dialog */}
      <Dialog open={isProcessing} onOpenChange={(open) => {
        // Prevent closing while processing
        if (isProcessing && !open) return;
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Processing PDF</DialogTitle>
            <DialogDescription>
              {processingMessage}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="relative h-16 w-16 mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-dashed animate-spin-slow"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            </div>
            
            <div className="w-full bg-secondary h-2 rounded-full mb-2">
              <div 
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${processingProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground">
              {processingProgress}% complete
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PdfTools;
