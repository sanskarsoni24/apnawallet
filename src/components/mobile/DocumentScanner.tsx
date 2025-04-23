
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Image, FileText, Loader2, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { processDocument } from "@/services/DocumentProcessingService";
import { useDocuments } from "@/contexts/DocumentContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMobile } from "@/hooks/use-mobile";

interface DocumentScannerProps {
  onDocumentScanned?: (documentData: Partial<Document>) => void;
}

const DocumentScanner: React.FC<DocumentScannerProps> = ({ onDocumentScanned }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const { addDocument } = useDocuments();
  const { isMobileApp } = useMobile();
  
  const handleOpenCamera = () => {
    setIsCameraOpen(true);
    
    // In a real implementation, this would access the device camera
    // For this demo, we'll simulate capturing an image
    setTimeout(() => {
      setIsCameraOpen(false);
      simulateImageCapture();
    }, 2000);
  };
  
  const simulateImageCapture = () => {
    setIsScanning(true);
    
    // Simulate camera capture
    setTimeout(() => {
      // In a real app, this would be an actual camera capture
      // For demo purposes, we'll use a placeholder
      setScannedImage("/placeholder.svg");
      setIsScanning(false);
    }, 1500);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setScannedImage(event.target.result);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const processScannedDocument = async () => {
    if (!scannedImage) return;
    
    setIsProcessing(true);
    
    try {
      // In a real app, this would process the actual image
      // For demo purposes, we'll create a simulated File object
      const dummyFile = new File([""], "scanned_document.jpg", { type: "image/jpeg" });
      
      // Process the document using our document processing service
      const documentData = await processDocument(dummyFile);
      
      // Add mobile-specific metadata
      const enhancedDocumentData = {
        ...documentData,
        scanSource: "camera" as const,
        scanDate: new Date().toISOString(),
        ocrProcessed: true,
        isAvailableOffline: true
      };
      
      // Add the document to our collection
      if (onDocumentScanned) {
        onDocumentScanned(enhancedDocumentData);
      } else {
        const newDocId = `doc-${Date.now()}`;
        addDocument({
          id: newDocId,
          userId: "current-user",
          title: documentData.title || "Scanned Document",
          type: "other",
          ...enhancedDocumentData
        });
        
        toast({
          title: "Document scanned successfully",
          description: "Your document has been processed and added to your library.",
        });
      }
      
      // Reset state
      setScannedImage(null);
      
    } catch (error) {
      console.error("Error processing document:", error);
      toast({
        title: "Processing failed",
        description: "There was an error processing your document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCancel = () => {
    setScannedImage(null);
  };
  
  return (
    <div>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Document Scanner</CardTitle>
        </CardHeader>
        
        <CardContent>
          {scannedImage ? (
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-xs h-64 bg-muted rounded-lg overflow-hidden mb-4">
                <img
                  src={scannedImage}
                  alt="Scanned document"
                  className="object-contain w-full h-full"
                />
                {isProcessing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              
              <div className="text-center space-y-1 mb-4">
                <h3 className="font-medium">Document preview</h3>
                <p className="text-sm text-muted-foreground">
                  Review the scanned document
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8">
              {isScanning ? (
                <div className="flex flex-col items-center">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  </div>
                  <p className="text-sm text-muted-foreground">Capturing document...</p>
                </div>
              ) : (
                <>
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Camera className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Scan a document using your camera or upload from gallery
                  </p>
                </>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <div className="flex flex-col w-full gap-3">
            {scannedImage ? (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleCancel}
                  disabled={isProcessing}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  className="flex items-center gap-2"
                  onClick={processScannedDocument}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Process
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleOpenCamera}
                  disabled={isScanning}
                >
                  <Camera className="h-4 w-4" />
                  Camera
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={isScanning}
                >
                  <label
                    htmlFor="imageUpload"
                    className="flex items-center gap-2 cursor-pointer w-full justify-center"
                  >
                    <Image className="h-4 w-4" />
                    Gallery
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={isScanning}
                    />
                  </label>
                </Button>
              </div>
            )}
            
            {!scannedImage && (
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                disabled={isScanning}
              >
                <FileText className="h-4 w-4" />
                Import PDF
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      {/* Camera Dialog */}
      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="p-0 max-w-sm">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Camera</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-[3/4] bg-black flex items-center justify-center">
            {/* This would be the camera feed in a real application */}
            <p className="text-white text-sm">Camera simulation</p>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white h-14 w-14"
                onClick={() => simulateImageCapture()}
              >
                <span className="h-10 w-10 rounded-full border-2 border-black"></span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentScanner;
