
import React, { useState, useEffect } from 'react';
import { Camera, QrCode, FlipHorizontal, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';
import BlurContainer from '../ui/BlurContainer';

// Define the interface for scanner props
interface IScannerProps {
  onScan: (result: string) => void; // Changed from onResult to onScan
  onError?: (error: any) => void;
  containerStyle?: React.CSSProperties;
}

// Mock QR scanner component for demo purposes
const QRScanner: React.FC<IScannerProps> = ({ onScan, onError, containerStyle }) => {
  const [cameraSwitched, setCameraSwitched] = useState(false);
  const [scanning, setScanning] = useState(true);
  
  // Simulate QR code detection
  useEffect(() => {
    if (scanning) {
      const timer = setTimeout(() => {
        const mockQRContent = `SURAKSHA:DOC:${Math.random().toString(36).substring(2, 15)}`;
        onScan(mockQRContent);
        setScanning(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [scanning, onScan]);
  
  return (
    <div style={{ position: 'relative', ...containerStyle }}>
      <div className="relative overflow-hidden" style={{ height: '250px', background: '#000' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          {scanning ? (
            <>
              <div className="absolute inset-0 bg-black opacity-80 z-0"></div>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-3/4 h-3/4 border-2 border-white/50 rounded-lg relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary -translate-x-1 -translate-y-1"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary translate-x-1 -translate-y-1"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary -translate-x-1 translate-y-1"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary translate-x-1 translate-y-1"></div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="animate-pulse text-primary">
                  <QrCode className="h-8 w-8" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-4 text-center text-white text-sm z-20">
                Position QR code in the frame
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <QrCode className="h-12 w-12 text-primary" />
              <div className="text-white text-sm">QR code detected!</div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setScanning(true)}
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
              >
                Scan Again
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-2 right-2 z-20">
        <Button
          variant="outline"
          size="icon"
          className="bg-black/50 border-white/20 text-white rounded-full w-8 h-8"
          onClick={() => setCameraSwitched(!cameraSwitched)}
        >
          <FlipHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// File uploader component
const QRFileUploader = ({ onScan, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileSelect = (file) => {
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      if (onError) onError(new Error("Invalid file type"));
      return;
    }
    
    // In a real app, we would use a QR code library to decode the image
    // For demo purposes, we'll simulate a successful decode after a delay
    setTimeout(() => {
      const mockQRContent = `SURAKSHA:UPLOAD:${file.name}:${Math.random().toString(36).substring(2, 15)}`;
      onScan(mockQRContent);
      
      toast({
        title: "QR Code detected",
        description: "Successfully scanned QR code from image",
      });
    }, 1500);
  };
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };
  
  return (
    <div 
      className={`border-2 border-dashed rounded-md p-6 transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-700'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <p className="font-medium text-center">Upload QR code image</p>
        <p className="text-sm text-muted-foreground text-center">
          Drag and drop an image, or click to browse
        </p>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          id="qr-file-input" 
          onChange={handleFileInput}
        />
        <Button 
          variant="outline"
          onClick={() => document.getElementById('qr-file-input').click()}
          className="mt-2"
        >
          Select Image
        </Button>
      </div>
    </div>
  );
};

// Main component
const SurakshaMobileScanner = ({ onDetected }) => {
  const [scanMethod, setScanMethod] = useState('camera');
  
  const handleCodeDetection = (detectedCode) => {
    if (onDetected) onDetected(detectedCode);
  };
  
  const handleScanError = (err) => {
    console.error('Scanning error:', err);
    toast({
      title: "Scanning Error",
      description: "An error occurred while scanning. Please try again.",
      variant: "destructive"
    });
  };
  
  return (
    <BlurContainer className="p-5 animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <QrCode className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-medium">Suraksha QR Scanner</h3>
        </div>
        
        <div className="flex rounded-lg overflow-hidden border divide-x">
          <Button 
            variant={scanMethod === 'camera' ? 'default' : 'ghost'}
            size="sm"
            className={`rounded-none ${scanMethod === 'camera' ? '' : 'text-muted-foreground'}`}
            onClick={() => setScanMethod('camera')}
          >
            <Camera className="h-4 w-4 mr-1" />
            Camera
          </Button>
          <Button 
            variant={scanMethod === 'upload' ? 'default' : 'ghost'}
            size="sm"
            className={`rounded-none ${scanMethod === 'upload' ? '' : 'text-muted-foreground'}`}
            onClick={() => setScanMethod('upload')}
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>
        </div>
      </div>
      
      {scanMethod === 'camera' ? (
        <QRScanner 
          onScan={handleCodeDetection}
          onError={handleScanError}
          containerStyle={{ borderRadius: '0.5rem' }}
        />
      ) : (
        <QRFileUploader
          onScan={handleCodeDetection}
          onError={handleScanError}
        />
      )}
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Scan a Suraksha QR code to quickly access your secure documents.</p>
      </div>
    </BlurContainer>
  );
};

export default SurakshaMobileScanner;
