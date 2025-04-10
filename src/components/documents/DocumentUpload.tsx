import React, { useState, useRef } from "react";
import { Upload, Camera, ArrowRight, Loader2, ScanSearch, Plus, X, FileIcon, FileText, Info } from "lucide-react";
import BlurContainer from "../ui/BlurContainer";
import { toast } from "@/hooks/use-toast";
import { useDocuments, Document } from "@/contexts/DocumentContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "../ui/form";
import { useForm } from "react-hook-form";
import { processDocument, parseMultiFormatDate, extractTextFromImage, generateDocumentSummary } from "@/services/DocumentProcessingService";
import { format, parse, isValid } from "date-fns";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const DocumentUpload = () => {
  const [dragging, setDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scanStatus, setScanStatus] = useState("");
  const [customReminderDays, setCustomReminderDays] = useState<number>(3); // Default 3 days
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [newDocumentType, setNewDocumentType] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [bulkUploadMode, setBulkUploadMode] = useState(false);
  const [documentSummary, setDocumentSummary] = useState<string>("");
  const [extractedText, setExtractedText] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addDocument, documentTypes, addDocumentType } = useDocuments();
  
  const form = useForm({
    defaultValues: {
      title: "",
      type: "Invoice",
      dueDate: "",
      description: "",
      summary: ""
    }
  });
  
  const resetForm = () => {
    form.reset();
    setIsProcessing(false);
    setScanStatus("");
    setCustomReminderDays(3);
    setDocumentSummary("");
    setExtractedText("");
  };
  
  const resetUpload = () => {
    setSelectedFiles([]);
    setCurrentFileIndex(0);
    setUploadProgress([]);
    resetForm();
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  
  const handleDragLeave = () => {
    setDragging(false);
  };
  
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      
      // If multiple files, enter bulk upload mode
      if (files.length > 1) {
        setBulkUploadMode(true);
        setSelectedFiles(files);
        setUploadProgress(new Array(files.length).fill(0));
        await handleFile(files[0], 0);
      } else {
        setBulkUploadMode(false);
        setSelectedFiles([files[0]]);
        await handleFile(files[0], 0);
      }
    }
  };
  
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // If multiple files, enter bulk upload mode
      if (files.length > 1) {
        setBulkUploadMode(true);
        setSelectedFiles(files);
        setUploadProgress(new Array(files.length).fill(0));
        await handleFile(files[0], 0);
      } else {
        setBulkUploadMode(false);
        setSelectedFiles([files[0]]);
        await handleFile(files[0], 0);
      }
    }
  };
  
  const handleFile = async (file: File, fileIndex: number) => {
    setCurrentFileIndex(fileIndex);
    setIsDialogOpen(true);
    setIsProcessing(true);
    
    // Create a more visual processing experience
    setScanStatus("Analyzing document...");
    
    // Update progress for this file
    setUploadProgress(prev => {
      const newProgress = [...prev];
      newProgress[fileIndex] = 10;
      return newProgress;
    });
    
    try {
      // Simulate document processing steps
      await new Promise(resolve => setTimeout(resolve, 800));
      setScanStatus("Extracting text...");
      
      setUploadProgress(prev => {
        const newProgress = [...prev];
        newProgress[fileIndex] = 30;
        return newProgress;
      });
      
      // Extract text from the document
      const text = await extractTextFromImage(file);
      setExtractedText(text);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      setScanStatus("Identifying document type...");
      
      setUploadProgress(prev => {
        const newProgress = [...prev];
        newProgress[fileIndex] = 50;
        return newProgress;
      });
      
      // Process document to extract information
      const extractedInfo = await processDocument(file);
      
      setUploadProgress(prev => {
        const newProgress = [...prev];
        newProgress[fileIndex] = 70;
        return newProgress;
      });
      
      await new Promise(resolve => setTimeout(resolve, 600));
      setScanStatus("Generating document summary...");
      
      // Generate a summary of the document
      const summary = await generateDocumentSummary(text, extractedInfo.category);
      setDocumentSummary(summary);
      
      setUploadProgress(prev => {
        const newProgress = [...prev];
        newProgress[fileIndex] = 90;
        return newProgress;
      });
      
      // Update form with extracted info
      if (extractedInfo.title) {
        form.setValue('title', extractedInfo.title);
      } else {
        // Use filename as title if no title detected
        form.setValue('title', file.name.split('.')[0]);
      }
      
      if (extractedInfo.category && documentTypes.includes(extractedInfo.category)) {
        form.setValue('type', extractedInfo.category);
      }
      
      if (extractedInfo.description) {
        form.setValue('description', extractedInfo.description);
      }
      
      if (summary) {
        form.setValue('summary', summary);
      }
      
      if (extractedInfo.dueDate) {
        // Improved date parsing for multiple formats
        let parsedDate: Date | null = null;
        
        // Try direct Date parsing first
        parsedDate = new Date(extractedInfo.dueDate);
        
        // If that didn't work, try various formats
        if (isNaN(parsedDate.getTime())) {
          const dateFormats = [
            'MMMM d, yyyy', // May 15, 2025
            'MMM d, yyyy',  // May 15, 2025
            'yyyy-MM-dd',   // 2025-05-15
            'MM/dd/yyyy',   // 05/15/2025
            'dd/MM/yyyy'    // 15/05/2025
          ];
          
          for (const dateFormat of dateFormats) {
            try {
              const tempDate = parse(extractedInfo.dueDate, dateFormat, new Date());
              if (isValid(tempDate)) {
                parsedDate = tempDate;
                break;
              }
            } catch (e) {
              // Continue trying other formats
            }
          }
        }
        
        // If we successfully parsed the date
        if (parsedDate && isValid(parsedDate)) {
          // Format as YYYY-MM-DD for the input
          form.setValue('dueDate', format(parsedDate, 'yyyy-MM-dd'));
        }
      }
      
      setUploadProgress(prev => {
        const newProgress = [...prev];
        newProgress[fileIndex] = 100;
        return newProgress;
      });
      
      toast({
        title: "Document Processed",
        description: "Document information extracted and summarized successfully!",
      });
      
    } catch (error) {
      console.error("Error processing document:", error);
      toast({
        title: "Processing Failed",
        description: "Could not extract information from document.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setScanStatus("");
    }
  };
  
  const handleSubmit = form.handleSubmit((data) => {
    const currentFile = selectedFiles[currentFileIndex];
    
    if (!currentFile) {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate days remaining
    const dueDate = new Date(data.dueDate);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Create file URL for preview
    const fileURL = URL.createObjectURL(currentFile);
    
    // Create document object with proper typing
    const newDocument: Document = {
      id: "", // This will be set in addDocument
      title: data.title,
      type: data.type,
      dueDate: format(dueDate, "MMMM d, yyyy"),
      daysRemaining: diffDays,
      fileURL: fileURL,
      description: data.description,
      customReminderDays: customReminderDays,
      summary: documentSummary
    };
    
    addDocument(newDocument);
    
    toast({
      title: "Document uploaded",
      description: `${data.title} has been uploaded successfully.`,
    });
    
    // If there are more files to process in bulk mode
    if (bulkUploadMode && currentFileIndex < selectedFiles.length - 1) {
      // Reset form for next file
      resetForm();
      
      // Process the next file
      const nextIndex = currentFileIndex + 1;
      handleFile(selectedFiles[nextIndex], nextIndex);
    } else {
      // We're done with all files
      resetForm();
      setIsDialogOpen(false);
      resetUpload();
    }
  });
  
  const handleSkipCurrentFile = () => {
    // If there are more files to process
    if (bulkUploadMode && currentFileIndex < selectedFiles.length - 1) {
      // Reset form for next file
      resetForm();
      
      // Process the next file
      const nextIndex = currentFileIndex + 1;
      handleFile(selectedFiles[nextIndex], nextIndex);
    } else {
      // We're done with all files or skipping the only file
      resetForm();
      setIsDialogOpen(false);
      resetUpload();
    }
    
    toast({
      title: "File skipped",
      description: "Skipped processing this file",
    });
  };
  
  // Start document scanner using device camera
  const startScanner = async () => {
    try {
      setIsScannerActive(true);
      setScanStatus("Initializing camera...");
      
      // Check if browser supports camera
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser");
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanStatus("Camera active. Position document in frame and tap Capture.");
      }
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Could not access device camera. Please check permissions.",
        variant: "destructive",
      });
      setScanStatus("");
      setIsScannerActive(false);
    }
  };
  
  // Stop scanner
  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanStatus("");
    setIsScannerActive(false);
  };
  
  // Capture image from scanner
  const captureDocument = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Visual feedback
    setScanStatus("Capturing image...");
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob
    try {
      setScanStatus("Processing captured image...");
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          const capturedFile = new File([blob], "scanned-document.jpg", { type: 'image/jpeg' });
          
          // Stop camera stream
          stopScanner();
          
          // Process captured image
          setBulkUploadMode(false);
          setSelectedFiles([capturedFile]);
          setCurrentFileIndex(0);
          await handleFile(capturedFile, 0);
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error("Error capturing image:", error);
      toast({
        title: "Capture Error",
        description: "Failed to capture image from camera",
        variant: "destructive",
      });
      setScanStatus("");
    }
  };
  
  // Handle adding a new document type
  const handleAddDocumentType = () => {
    if (!newDocumentType.trim()) {
      toast({
        title: "Type Required",
        description: "Please enter a document type name",
        variant: "destructive",
      });
      return;
    }
    
    addDocumentType(newDocumentType.trim());
    setNewDocumentType("");
    setIsTypeDialogOpen(false);
    
    // Set the newly added type as the current type in the form
    form.setValue("type", newDocumentType.trim());
  };
  
  // Get file icon based on file type
  const getFileIcon = (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (!extension) return <FileIcon className="h-4 w-4" />;
    
    switch(extension) {
      case 'pdf':
        return <FileIcon className="h-4 w-4 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileIcon className="h-4 w-4 text-blue-500" />;
      case 'doc':
      case 'docx':
        return <FileIcon className="h-4 w-4 text-indigo-500" />;
      case 'xls':
      case 'xlsx':
        return <FileIcon className="h-4 w-4 text-green-500" />;
      default:
        return <FileIcon className="h-4 w-4" />;
    }
  };
  
  return (
    <>
      <BlurContainer 
        className={`border-2 border-dashed transition-all duration-300 ${
          dragging ? "border-primary bg-primary/5" : "border-border"
        } rounded-xl p-8 text-center`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        id="upload-documents"
      >
        <div className="mx-auto flex max-w-xs flex-col items-center gap-3">
          <div className={`rounded-full p-3 ${
            dragging ? "bg-primary/20" : "bg-primary/10"
          } transition-colors duration-300`}>
            <Upload className={`h-6 w-6 ${
              dragging ? "text-primary" : "text-primary/80"
            } transition-colors duration-300`} />
          </div>
          
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-medium">Upload documents</h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop your documents or click to browse
            </p>
          </div>
          
          <div className="flex gap-2">
            <label className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
              Upload
              <input 
                ref={fileInputRef}
                type="file" 
                className="sr-only" 
                onChange={handleInputChange} 
                accept=".pdf,.jpg,.jpeg,.png,.tiff"
                multiple
              />
            </label>
            
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-blue-100 text-indigo-700"
              onClick={startScanner}
            >
              <Camera className="h-4 w-4" />
              <span>Scan</span>
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Supports PDF, JPG, PNG, TIFF. Multiple files allowed.
          </p>
        </div>
      </BlurContainer>
      
      {/* Document Scanner Dialog */}
      <Dialog open={isScannerActive} onOpenChange={(open) => {
        if (!open) stopScanner();
        setIsScannerActive(open);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Document Scanner</DialogTitle>
            {scanStatus && (
              <DialogDescription>{scanStatus}</DialogDescription>
            )}
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-full aspect-[4/3] bg-black rounded-lg overflow-hidden">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 border-4 border-indigo-400/50 pointer-events-none" />
              
              {/* Scanning animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-1 bg-indigo-500/30 w-full absolute animate-scanning-line" />
              </div>
              
              {/* Visual guides for document positioning */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="border-2 border-white/20 border-dashed m-8 h-[calc(100%-64px)]"></div>
              </div>
            </div>
            
            <canvas ref={canvasRef} className="hidden"></canvas>
            
            <div className="flex justify-center gap-4 w-full">
              <Button
                variant="outline"
                onClick={stopScanner}
                className="bg-white dark:bg-background"
              >
                Cancel
              </Button>
              <Button
                onClick={captureDocument}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <ScanSearch className="h-4 w-4" />
                <span>Capture</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add New Document Type Dialog */}
      <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Document Type</DialogTitle>
            <DialogDescription>
              Create a custom document type to better organize your documents
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Enter new document type"
                value={newDocumentType}
                onChange={(e) => setNewDocumentType(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newDocumentType.trim()) {
                    handleAddDocumentType();
                  }
                }}
              />
              <Button 
                onClick={handleAddDocumentType}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsTypeDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Document Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open) {
          resetForm();
          // Don't reset selected files here, only close the dialog
        }
        setIsDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {bulkUploadMode ? (
                <span className="flex items-center gap-2">
                  Document Details 
                  <Badge variant="outline" className="ml-2">
                    {currentFileIndex + 1} of {selectedFiles.length}
                  </Badge>
                </span>
              ) : (
                "Document Details"
              )}
            </DialogTitle>
            {scanStatus && (
              <DialogDescription>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {scanStatus}
                </div>
              </DialogDescription>
            )}
          </DialogHeader>
          
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative h-20 w-20">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-200 border-dashed animate-spin-slow"></div>
                <div className="absolute inset-2 rounded-full border-b-2 border-indigo-600 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                </div>
              </div>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                {scanStatus || "Processing document..."}
              </p>
              
              {/* Progress bar for bulk uploads */}
              {bulkUploadMode && (
                <div className="w-full mt-4">
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 transition-all duration-300"
                      style={{ width: `${uploadProgress[currentFileIndex]}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-center mt-1 text-muted-foreground">
                    Processing file {currentFileIndex + 1} of {selectedFiles.length}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* File preview */}
              {selectedFiles.length > 0 && currentFileIndex < selectedFiles.length && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md mb-4">
                  {getFileIcon(selectedFiles[currentFileIndex])}
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">
                      {selectedFiles[currentFileIndex].name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFiles[currentFileIndex].size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              )}
              
              {/* Document summary */}
              {documentSummary && (
                <div className="mb-4 p-3 bg-secondary/40 border border-border rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-medium">Document Summary</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{documentSummary}</p>
                </div>
              )}
              
              {/* Multiple files indicator */}
              {bulkUploadMode && (
                <div className="mb-4">
                  <ScrollArea className="h-24">
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div 
                          key={index}
                          className={`flex items-center gap-2 p-2 rounded-md ${index === currentFileIndex ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800' : ''}`}
                        >
                          {getFileIcon(file)}
                          <div className="flex-1 overflow-hidden">
                            <p className="text-xs truncate">
                              {file.name}
                            </p>
                          </div>
                          <Badge variant={index === currentFileIndex ? "default" : "outline"}>
                            {uploadProgress[index] === 100 ? "Done" : 
                             index < currentFileIndex ? "Done" : 
                             index === currentFileIndex ? "Current" : "Pending"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
              
              <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Document Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Car Insurance" {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel>Document Type</FormLabel>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs text-indigo-600"
                            onClick={() => setIsTypeDialogOpen(true)}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add Type
                          </Button>
                        </div>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            {...field}
                          >
                            {documentTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <FormLabel>Custom Reminder</FormLabel>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={customReminderDays}
                      onChange={(e) => setCustomReminderDays(Number(e.target.value))}
                    >
                      <option value="1">1 day before</option>
                      <option value="3">3 days before</option>
                      <option value="7">7 days before</option>
                      <option value="14">14 days before</option>
                      <option value="30">30 days before</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Select when you want to be reminded about this document
                    </p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Document Summary</FormLabel>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Auto-generated summary of the document</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <FormControl>
                          <Textarea 
                            placeholder="Auto-generated summary of this document" 
                            className="min-h-20" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter additional notes or comments" 
                            className="min-h-20" 
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2 pt-2">
                    {bulkUploadMode ? (
                      <>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleSkipCurrentFile}
                        >
                          Skip
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          <span>
                            {currentFileIndex < selectedFiles.length - 1 ? "Save & Continue" : "Save & Finish"}
                          </span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            resetForm();
                            setIsDialogOpen(false);
                            resetUpload();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          <span>Save Document</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </form>
              </Form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentUpload;
