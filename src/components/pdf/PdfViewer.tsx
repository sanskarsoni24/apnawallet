import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Lock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import PdfToolbar from "./PdfToolbar";
import { useUser } from "@/contexts/UserContext";
import { useDocuments } from "@/contexts/DocumentContext";
import type { Document } from "@/types/Document"; // Fixed import

interface PdfViewerProps {
  document: Document;
  onClose?: () => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ document, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [annotationMode, setAnnotationMode] = useState<"none" | "highlight" | "pen" | "text" | "select">("none");
  const { userSettings } = useUser();
  const { updateDocument } = useDocuments();
  const { toast } = useToast();
  
  // Simulated PDF loading
  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        
        // Simulate checking if PDF is password protected
        if (document.isPasswordProtected && !document.pdfPassword) {
          setPasswordRequired(true);
          setLoading(false);
          return;
        }
        
        // Simulate loading PDF
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Set default page if remembered
        if (document.pdfLastPage && userSettings.pdfRememberLastPage) {
          setCurrentPage(document.pdfLastPage);
        }
        
        // Simulated values
        setTotalPages(document.pdfPageCount || 10);
        setPasswordRequired(false);
        setError(null);
        
        // Apply user preferences from settings
        if (userSettings.pdfDefaultZoom) {
          setZoom(userSettings.pdfDefaultZoom);
        }
        
        setShowThumbnails(userSettings.pdfShowThumbnails !== false);
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError("Failed to load PDF document");
      } finally {
        setLoading(false);
      }
    };
    
    loadPdf();
    
    // Save last viewed page on unmount
    return () => {
      if (userSettings.pdfRememberLastPage && currentPage > 0) {
        updateDocument(document.id, { pdfLastPage: currentPage });
      }
    };
  }, [document.id, document.isPasswordProtected, document.pdfPassword, document.pdfLastPage, document.pdfPageCount, userSettings.pdfDefaultZoom, userSettings.pdfRememberLastPage, updateDocument, userSettings.pdfShowThumbnails]);
  
  const handlePasswordSubmit = () => {
    if (!passwordInput.trim()) {
      toast({
        title: "Password Required",
        description: "Please enter the PDF password",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate password check
    setTimeout(() => {
      if (passwordInput === "correct") { // In a real app, this would check the actual password
        updateDocument(document.id, { pdfPassword: passwordInput });
        setPasswordRequired(false);
        // Reload PDF
        setLoading(true);
        setTimeout(() => {
          setTotalPages(document.pdfPageCount || 10);
          setLoading(false);
        }, 1000);
      } else {
        toast({
          title: "Incorrect Password",
          description: "The password you entered is incorrect",
          variant: "destructive"
        });
      }
    }, 800);
  };
  
  const handleDownload = () => {
    toast({
      title: "Downloading PDF",
      description: `${document.title}.pdf is being downloaded`
    });
    
    // In a real app, this would trigger the actual download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${document.title}.pdf has been downloaded`
      });
    }, 1500);
  };
  
  const handlePrint = () => {
    toast({
      title: "Print Dialog",
      description: "Opening print dialog..."
    });
    
    // In a real app, this would open the browser print dialog
    // window.print();
  };
  
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };
  
  const handleToggleFullscreen = () => {
    if (fullscreen) {
      document.exitFullscreen().catch(console.error);
      setFullscreen(false);
    } else if (containerRef.current) {
      containerRef.current.requestFullscreen().catch(console.error);
      setFullscreen(true);
    }
  };
  
  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);
  
  // Handle annotation changes
  const handleAnnotationModeChange = (mode: "none" | "highlight" | "pen" | "text" | "select") => {
    setAnnotationMode(prev => prev === mode ? "none" : mode);
  };
  
  if (passwordRequired) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-[80vh]">
        <div className="w-full max-w-md p-6 bg-background border rounded-lg shadow-md">
          <div className="flex items-center justify-center mb-6">
            <Lock className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-center">Protected Document</h2>
          <p className="text-muted-foreground mb-6 text-center">
            This PDF is password protected. Please enter the password to view it.
          </p>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter PDF password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handlePasswordSubmit();
              }}
            />
            <div className="flex justify-end gap-2">
              {onClose && (
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              )}
              <Button onClick={handlePasswordSubmit}>
                Unlock Document
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-[80vh]">
        <div className="text-destructive text-xl mb-4">Error loading PDF</div>
        <p className="text-muted-foreground mb-6">{error}</p>
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef} 
      className={`flex flex-col w-full h-full ${fullscreen ? 'fixed inset-0 z-50 bg-background' : 'relative h-[80vh]'}`}
    >
      <PdfToolbar
        currentPage={currentPage}
        totalPages={totalPages}
        zoom={zoom}
        onZoomChange={setZoom}
        onPageChange={setCurrentPage}
        onDownload={handleDownload}
        onPrint={handlePrint}
        onRotate={handleRotate}
        fullscreen={fullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        showThumbnails={showThumbnails}
        onToggleThumbnails={() => setShowThumbnails(!showThumbnails)}
        annotationMode={annotationMode}
        onAnnotationModeChange={handleAnnotationModeChange}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {showThumbnails && (
          <div className="w-48 border-r bg-muted/30">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <div 
                    key={i}
                    className={`cursor-pointer border rounded-md overflow-hidden transition-all ${
                      currentPage === i + 1 ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {/* Page thumbnail (simulated) */}
                    <div className="bg-background aspect-[3/4] flex items-center justify-center">
                      <div className="text-xs text-muted-foreground">Page {i + 1}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
        
        <div className="flex-1 overflow-auto bg-muted/20 flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
              <p className="text-muted-foreground">Loading PDF document...</p>
            </div>
          ) : (
            <div 
              className="relative mx-auto my-4 bg-white shadow-lg transition-all"
              style={{ 
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                width: '595px', // A4 width in pixels at 72dpi
                height: '842px', // A4 height in pixels at 72dpi
              }}
            >
              {/* Simulated PDF page */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-400">
                  Page {currentPage} of {totalPages} (Sample PDF View)
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
