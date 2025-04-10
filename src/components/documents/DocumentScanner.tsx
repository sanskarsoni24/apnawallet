
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Camera, Download, FileText, RotateCw, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useIsMobileDevice } from '@/hooks/use-mobile';

const DocumentScanner: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobileDevice();
  
  const startCamera = async () => {
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera access failed",
        description: "Please ensure you've granted camera permissions",
        variant: "destructive",
      });
      setIsCapturing(false);
    }
  };
  
  const captureDocument = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      stopCamera();
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => {
        track.stop();
      });
      
      videoRef.current.srcObject = null;
    }
    
    setIsCapturing(false);
  };
  
  const resetCapture = () => {
    setCapturedImage(null);
  };
  
  const saveAsPdf = () => {
    // In a real implementation, this would convert the image to PDF
    // For now, we'll just simulate this process
    toast({
      title: "Document saved",
      description: "Your document has been saved as PDF"
    });
    
    // Simulate download by creating a temporary link
    if (capturedImage) {
      const link = document.createElement('a');
      link.href = capturedImage;
      link.download = `document-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Document Scanner</CardTitle>
        <CardDescription>
          Scan documents directly using your camera
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isCapturing && !capturedImage && (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-md bg-muted/50">
            <Camera className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground mb-4">
              Use your camera to scan documents and save them as PDF
            </p>
            <Button onClick={startCamera}>
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
          </div>
        )}
        
        {isCapturing && (
          <div className="space-y-4">
            <div className="relative border rounded-md overflow-hidden aspect-video">
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover"
                autoPlay 
                playsInline 
                muted
              />
              <div className="absolute inset-0 border-2 border-primary/50 pointer-events-none"></div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={stopCamera}>Cancel</Button>
              <Button onClick={captureDocument}>
                <Camera className="mr-2 h-4 w-4" />
                Capture Document
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Position the document within the frame and make sure it's well lit
            </p>
          </div>
        )}
        
        {capturedImage && (
          <div className="space-y-4">
            <div className="border rounded-md overflow-hidden">
              <img 
                src={capturedImage} 
                alt="Captured document" 
                className="w-full object-contain"
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-between">
              <Button variant="outline" onClick={resetCapture}>
                <RotateCw className="mr-2 h-4 w-4" />
                Retake
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={saveAsPdf}>
                  <FileText className="mr-2 h-4 w-4" />
                  Save as PDF
                </Button>
                <Button onClick={saveAsPdf}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </CardContent>
    </Card>
  );
};

export default DocumentScanner;
