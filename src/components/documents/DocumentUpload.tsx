import React, { useState, useRef } from "react";
import { Upload, Camera, ArrowRight, Loader2, ScanSearch } from "lucide-react";
import BlurContainer from "../ui/BlurContainer";
import { toast } from "@/hooks/use-toast";
import { useDocuments } from "@/contexts/DocumentContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "../ui/form";
import { useForm } from "react-hook-form";
import { processDocument } from "@/services/DocumentProcessingService";
import { format, parse, isValid } from "date-fns";

const documentTypes = ["Invoice", "Warranty", "Subscription", "Boarding Pass", "Other"];

const DocumentUpload = () => {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addDocument } = useDocuments();
  
  const form = useForm({
    defaultValues: {
      title: "",
      type: "Invoice",
      dueDate: "",
      description: "",
    }
  });
  
  const resetForm = () => {
    form.reset();
    setSelectedFile(null);
    setIsProcessing(false);
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
      const file = e.dataTransfer.files[0];
      await handleFile(file);
    }
  };
  
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await handleFile(file);
    }
  };
  
  const handleFile = async (file: File) => {
    setSelectedFile(file);
    setIsDialogOpen(true);
    setIsProcessing(true);
    
    try {
      // Process document to extract information
      const extractedInfo = await processDocument(file);
      
      // Update form with extracted info
      if (extractedInfo.title) {
        form.setValue('title', extractedInfo.title);
      }
      
      if (extractedInfo.category && documentTypes.includes(extractedInfo.category)) {
        form.setValue('type', extractedInfo.category);
      }
      
      if (extractedInfo.description) {
        form.setValue('description', extractedInfo.description);
      }
      
      if (extractedInfo.dueDate) {
        // Try to parse the date in various formats
        let dateObj = null;
        const dateFormats = [
          'MMMM d, yyyy',
          'MMM d, yyyy',
          'yyyy-MM-dd',
          'MM/dd/yyyy',
          'dd/MM/yyyy'
        ];
        
        for (const format of dateFormats) {
          try {
            dateObj = parse(extractedInfo.dueDate, format, new Date());
            if (isValid(dateObj)) break;
          } catch (e) {
            // Continue trying other formats
          }
        }
        
        if (dateObj && isValid(dateObj)) {
          form.setValue('dueDate', format(dateObj, 'yyyy-MM-dd'));
        }
      }
      
    } catch (error) {
      console.error("Error processing document:", error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSubmit = form.handleSubmit((data) => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
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
    const fileURL = URL.createObjectURL(selectedFile);
    
    addDocument({
      title: data.title,
      type: data.type,
      dueDate: format(dueDate, "MMMM d, yyyy"),
      daysRemaining: diffDays,
      file: selectedFile,
      fileURL,
      description: data.description,
    });
    
    toast({
      title: "Document uploaded",
      description: `${data.title} has been uploaded successfully.`,
    });
    
    resetForm();
    setIsDialogOpen(false);
  });
  
  // Start document scanner using device camera
  const startScanner = async () => {
    try {
      setIsScannerActive(true);
      
      // Check if browser supports camera
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser");
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Could not access device camera. Please check permissions.",
        variant: "destructive",
      });
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
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob
    try {
      canvas.toBlob(async (blob) => {
        if (blob) {
          const capturedFile = new File([blob], "scanned-document.jpg", { type: 'image/jpeg' });
          
          // Stop camera stream
          stopScanner();
          
          // Process captured image
          await handleFile(capturedFile);
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error("Error capturing image:", error);
      toast({
        title: "Capture Error",
        description: "Failed to capture image from camera",
        variant: "destructive",
      });
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
            <label className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer">
              Select documents
              <input 
                type="file" 
                className="sr-only" 
                onChange={handleInputChange} 
                accept=".pdf,.jpg,.jpeg,.png,.tiff"
              />
            </label>
            
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={startScanner}
            >
              <Camera className="h-4 w-4" />
              <span>Scan</span>
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Supports PDF, JPG, PNG, TIFF
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
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-full aspect-[4/3] bg-black rounded-lg overflow-hidden">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 border-4 border-primary/50 pointer-events-none" />
            </div>
            
            <canvas ref={canvasRef} className="hidden"></canvas>
            
            <div className="flex justify-center gap-4 w-full">
              <Button
                variant="outline"
                onClick={stopScanner}
              >
                Cancel
              </Button>
              <Button
                onClick={captureDocument}
                className="flex items-center gap-2"
              >
                <ScanSearch className="h-4 w-4" />
                <span>Capture</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Document Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
          </DialogHeader>
          
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Processing document...<br />
                Extracting information and categorizing
              </p>
            </div>
          ) : (
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
                      <FormLabel>Document Type</FormLabel>
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
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter document description or notes" 
                          className="min-h-20" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex items-center gap-2">
                    <span>Save Document</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentUpload;
