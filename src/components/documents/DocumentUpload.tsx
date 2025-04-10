import React, { useState, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useDocuments } from "@/contexts/DocumentContext";
import { Document, DocumentType } from "@/types/Document";
import { useUser } from "@/contexts/UserContext";
import { Loader2, Upload, File, X, Camera, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DocumentUploadProps {
  onClose?: () => void;
  onSuccess?: (document: Document) => void;
  defaultType?: string;
}

const DocumentUpload = ({ onClose, onSuccess, defaultType }: DocumentUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState(defaultType || "");
  const [documentDescription, setDocumentDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [isImportant, setIsImportant] = useState(false);
  const [newTypeDialog, setNewTypeDialog] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addDocument, documentTypes } = useDocuments();
  const { user } = useUser();

  // Check if user has reached document limit
  const hasReachedLimit = () => {
    if (!user || !user.documentLimit) return false;
    
    // This would need to be implemented based on your actual document count logic
    const currentDocumentCount = 0; // Replace with actual count
    return currentDocumentCount >= user.documentLimit;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (hasReachedLimit()) {
      toast({
        title: "Document limit reached",
        description: "You've reached your plan's document limit. Please upgrade to add more documents.",
        variant: "destructive",
      });
      return;
    }

    // Check file size
    const maxSize = user?.documentSizeLimit || 5 * 1024 * 1024; // Default 5MB
    const oversizedFiles = acceptedFiles.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: `Some files exceed the ${maxSize / (1024 * 1024)}MB limit for your plan.`,
        variant: "destructive",
      });
      
      // Filter out oversized files
      const validFiles = acceptedFiles.filter(file => file.size <= maxSize);
      setFiles(prev => [...prev, ...validFiles]);
    } else {
      setFiles(prev => [...prev, ...acceptedFiles]);
    }
    
    // Auto-fill document name if empty and only one file
    if (!documentName && acceptedFiles.length === 1) {
      // Remove file extension from name
      const fileName = acceptedFiles[0].name.replace(/\.[^/.]+$/, "");
      setDocumentName(fileName);
    }
    
    setUploadError(null);
  }, [documentName, user, hasReachedLimit]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    }
  });

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setUploadError("Please select at least one file to upload");
      return;
    }
    
    if (!documentName.trim()) {
      setUploadError("Please enter a document name");
      return;
    }
    
    if (!documentType) {
      setUploadError("Please select a document type");
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    try {
      // Simulate upload progress
      const totalSteps = 10;
      for (let i = 1; i <= totalSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress((i / totalSteps) * 100);
      }
      
      // Create document object
      const newDocument: Document = {
        id: `doc-${Date.now()}`,
        name: documentName,
        type: documentType as DocumentType,
        description: documentDescription,
        dateAdded: new Date().toISOString(),
        files: files.map(file => ({
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
        })),
        isImportant,
        expiryDate: expiryDate ? expiryDate.toISOString() : undefined,
      };
      
      // Add document to context
      addDocument(newDocument);
      
      // Show success message
      setUploadSuccess(true);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(newDocument);
      }
      
      toast({
        title: "Document uploaded successfully",
        description: "Your document has been added to your library.",
      });
      
      // Reset form after short delay
      setTimeout(() => {
        setFiles([]);
        setDocumentName("");
        setDocumentType("");
        setDocumentDescription("");
        setExpiryDate(undefined);
        setIsImportant(false);
        setUploading(false);
        setUploadProgress(0);
        setUploadSuccess(false);
        
        // Close dialog if onClose provided
        if (onClose) {
          onClose();
        }
      }, 1500);
      
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("An error occurred while uploading your document. Please try again.");
      setUploading(false);
    }
  };

  const handleAddNewType = () => {
    if (!newTypeName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the new document type",
        variant: "destructive",
      });
      return;
    }
    
    // Add new document type logic would go here
    // This is a simplified example
    
    toast({
      title: "New document type added",
      description: `"${newTypeName}" has been added to your document types.`,
    });
    
    setDocumentType(newTypeName);
    setNewTypeDialog(false);
    setNewTypeName("");
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setActiveTab("camera");
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to file
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const file = new File([blob], `scan-${Date.now()}.jpg`, { type: 'image/jpeg' });
      setFiles(prev => [...prev, file]);
      
      // Stop camera
      stopCamera();
      
      // Switch back to upload tab
      setActiveTab("upload");
      
      toast({
        title: "Image captured",
        description: "The scanned image has been added to your upload.",
      });
    }, 'image/jpeg', 0.95);
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            Add a new document to your secure storage
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto px-4">
            <TabsTrigger value="upload" onClick={() => stopCamera()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="camera" onClick={startCamera}>
              <Camera className="h-4 w-4 mr-2" />
              Scan Document
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-4">
              <TabsContent value="upload" className="mt-0 space-y-4">
                {uploadSuccess ? (
                  <Alert className="bg-green-500/10 border-green-500/50">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertTitle>Upload Successful</AlertTitle>
                    <AlertDescription>
                      Your document has been uploaded successfully.
                    </AlertDescription>
                  </Alert>
                ) : uploadError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Upload Failed</AlertTitle>
                    <AlertDescription>
                      {uploadError}
                    </AlertDescription>
                  </Alert>
                ) : null}
                
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Upload className="h-8 w-8 text-muted-foreground/50" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {isDragActive ? 'Drop the files here' : 'Drag & drop files here'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        or click to browse files
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Supports PDF, JPG, PNG, DOC, DOCX, TXT
                    </p>
                  </div>
                </div>
                
                {files.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Files</Label>
                    <div className="border rounded-md divide-y">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2">
                          <div className="flex items-center space-x-2">
                            <File className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {(file.size / 1024).toFixed(0)} KB
                            </Badge>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="camera" className="mt-0 space-y-4">
                <div className="relative aspect-video bg-black rounded-md overflow-hidden">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                  />
                  
                  {isCameraActive && (
                    <div className="absolute inset-0 border-2 border-primary/50 pointer-events-none"></div>
                  )}
                  
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                
                <div className="flex justify-center space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={stopCamera}
                  >
                    Cancel
                  </Button>
                  
                  <Button 
                    type="button" 
                    onClick={captureImage}
                    disabled={!isCameraActive}
                  >
                    Capture
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground text-center">
                  Position your document within the frame and ensure good lighting
                </p>
              </TabsContent>
              
              <div className="space-y-2">
                <Label htmlFor="documentName">Document Name</Label>
                <Input
                  id="documentName"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Enter document name"
                  disabled={uploading}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="documentType">Document Type</Label>
                  <Button 
                    type="button" 
                    variant="link" 
                    size="sm" 
                    className="h-auto p-0 text-xs"
                    onClick={() => setNewTypeDialog(true)}
                  >
                    + Add Type
                  </Button>
                </div>
                
                <Select 
                  value={documentType} 
                  onValueChange={setDocumentType}
                  disabled={uploading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="documentDescription">Description (Optional)</Label>
                <Textarea
                  id="documentDescription"
                  value={documentDescription}
                  onChange={(e) => setDocumentDescription(e.target.value)}
                  placeholder="Add notes or details about this document"
                  disabled={uploading}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                <DatePicker
                  date={expiryDate}
                  setDate={setExpiryDate}
                  disabled={uploading}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isImportant"
                  checked={isImportant}
                  onCheckedChange={setIsImportant}
                  disabled={uploading}
                />
                <Label htmlFor="isImportant">Mark as important document</Label>
              </div>
              
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Uploading...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              {onClose && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  disabled={uploading}
                >
                  Cancel
                </Button>
              )}
              
              <Button 
                type="submit" 
                disabled={uploading || uploadSuccess}
                className="ml-auto"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Tabs>
      </Card>
      
      <Dialog open={newTypeDialog} onOpenChange={setNewTypeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Document Type</DialogTitle>
            <DialogDescription>
              Create a custom document type to better organize your documents.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="newTypeName">Type Name</Label>
              <Input
                id="newTypeName"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                placeholder="e.g. Medical Records, Tax Documents"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setNewTypeDialog(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAddNewType}>
              Add Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentUpload;
