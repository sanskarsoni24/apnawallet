
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Document as PDFDocument } from "@/contexts/DocumentContext";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";
import { 
  FileText, ZoomIn, ZoomOut, RotateCw, Lock, Unlock, Bookmark, 
  PenTool, Edit3, Download, ChevronLeft, ChevronRight, 
  Maximize, Sun, Moon, Palette, Save, Eye, ArrowLeft, ArrowRight
} from "lucide-react";

interface PdfViewerProps {
  document: PDFDocument;
  onUpdateDocument?: (id: string, data: Partial<PDFDocument>) => void;
}

const PdfViewer = ({ document, onUpdateDocument }: PdfViewerProps) => {
  const { userSettings, updateUserSettings } = useUser();
  const [currentPage, setCurrentPage] = useState(document.pdfLastPage || 1);
  const [zoom, setZoom] = useState(userSettings.pdfDefaultZoom || 100);
  const [isPasswordProtected, setIsPasswordProtected] = useState(document.isPasswordProtected || false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(!document.isPasswordProtected);
  const [showControls, setShowControls] = useState(userSettings.pdfShowPageControls !== false);
  const [nightMode, setNightMode] = useState(userSettings.pdfNightMode || false);
  const [rotation, setRotation] = useState(document.pdfRotation || 0);
  const totalPages = document.pdfPageCount || 1;

  // Function to unlock a password-protected PDF
  const unlockPdf = () => {
    if (passwordInput === document.pdfPassword) {
      setIsUnlocked(true);
      toast({
        title: "PDF Unlocked",
        description: "You can now view and edit the document"
      });
    } else {
      toast({
        title: "Incorrect Password",
        description: "Please try again with the correct password",
        variant: "destructive"
      });
    }
  };

  // Function to save user PDF preferences
  const savePreferences = () => {
    updateUserSettings({
      pdfDefaultZoom: zoom,
      pdfNightMode: nightMode,
      pdfShowPageControls: showControls,
      pdfRememberLastPage: true
    });

    if (onUpdateDocument) {
      onUpdateDocument(document.id, {
        pdfLastPage: currentPage,
        pdfRotation: rotation
      });
    }

    toast({
      title: "PDF Preferences Saved",
      description: "Your PDF viewing preferences have been updated"
    });
  };

  // Navigation functions
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Rotation function
  const rotatePdf = () => {
    const newRotation = (rotation + 90) % 360 as 0 | 90 | 180 | 270;
    setRotation(newRotation);
    
    if (onUpdateDocument) {
      onUpdateDocument(document.id, {
        pdfRotation: newRotation
      });
    }
  };

  // Add bookmark function
  const addBookmark = () => {
    toast({
      title: "Bookmark Added",
      description: `Page ${currentPage} has been bookmarked`
    });
  };

  // Toggle password protection
  const togglePasswordProtection = () => {
    setIsPasswordProtected(!isPasswordProtected);
    
    if (onUpdateDocument) {
      onUpdateDocument(document.id, {
        isPasswordProtected: !isPasswordProtected,
        pdfPassword: !isPasswordProtected ? passwordInput : undefined
      });
    }
    
    toast({
      title: isPasswordProtected ? "Password Protection Removed" : "Password Protection Added",
      description: isPasswordProtected 
        ? "The document is now accessible without a password" 
        : "The document is now password-protected"
    });
  };

  // Placeholder for adding annotations
  const startAnnotation = () => {
    toast({
      title: "Annotation Mode",
      description: "You can now annotate the document"
    });
  };

  // Download the PDF
  const downloadPdf = () => {
    if (document.fileURL || document.fileUrl) {
      const link = document.createElement('a');
      link.href = document.fileURL || document.fileUrl;
      link.download = document.title || "document.pdf";
      link.click();
      
      toast({
        title: "Download Started",
        description: "Your PDF is downloading"
      });
    }
  };

  if (document.isPasswordProtected && !isUnlocked) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-red-500" />
            Password Protected PDF
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <Lock className="h-16 w-16 text-muted-foreground" />
          <p className="text-center">This PDF is password protected. Enter the password to view it.</p>
          <div className="w-full max-w-sm space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex gap-2">
              <input 
                id="password"
                type="password" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter PDF password" 
              />
              <Button onClick={unlockPdf}>Unlock</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${nightMode ? 'bg-gray-900 text-gray-100' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-red-500" />
            {document.title || "PDF Document"}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setNightMode(!nightMode)} title={nightMode ? "Light Mode" : "Night Mode"}>
              {nightMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={downloadPdf} title="Download PDF">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* PDF Display Area (Placeholder) */}
        <div 
          className={`pdf-container relative flex items-center justify-center border rounded-lg aspect-[3/4] ${nightMode ? 'bg-gray-800' : 'bg-gray-100'}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {document.fileURL || document.fileUrl ? (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-4">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">PDF Preview</p>
                  <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>
                  <Button className="mt-4" onClick={() => window.open(document.fileURL || document.fileUrl, "_blank")}>
                    Open PDF in Browser
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center p-4">
              <p>No PDF file available</p>
            </div>
          )}
        </div>
        
        {/* PDF Controls */}
        {showControls && (
          <div className="flex flex-wrap items-center justify-between gap-2 bg-muted p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage <= 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage >= totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))} title="Zoom Out">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm">{zoom}%</span>
              <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(200, zoom + 10))} title="Zoom In">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={rotatePdf} title="Rotate">
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Tools and Settings */}
        <Tabs defaultValue="tools" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="tools" className="flex-1">Tools</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
            <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tools" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button variant="outline" className="flex-col p-4 h-auto" onClick={addBookmark}>
                <Bookmark className="h-5 w-5 mb-1" />
                <span className="text-xs">Bookmark</span>
              </Button>
              <Button variant="outline" className="flex-col p-4 h-auto" onClick={startAnnotation}>
                <PenTool className="h-5 w-5 mb-1" />
                <span className="text-xs">Annotate</span>
              </Button>
              <Button variant="outline" className="flex-col p-4 h-auto">
                <FileText className="h-5 w-5 mb-1" />
                <span className="text-xs">Extract Text</span>
              </Button>
              <Button variant="outline" className="flex-col p-4 h-auto">
                <Edit3 className="h-5 w-5 mb-1" />
                <span className="text-xs">Edit PDF</span>
              </Button>
            </div>
            
            <div className="border p-3 rounded-lg bg-background">
              <h3 className="text-sm font-medium mb-2">Navigation</h3>
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={goToPreviousPage} disabled={currentPage <= 1}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous Page
                </Button>
                <span className="text-sm font-medium">
                  {currentPage} / {totalPages}
                </span>
                <Button variant="ghost" size="sm" onClick={goToNextPage} disabled={currentPage >= totalPages}>
                  Next Page
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="zoom-slider">Zoom ({zoom}%)</Label>
                <Slider 
                  id="zoom-slider"
                  min={50} 
                  max={200} 
                  step={10} 
                  value={[zoom]} 
                  onValueChange={(value) => setZoom(value[0])} 
                  className="w-[60%]" 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="night-mode">Night Mode</Label>
                <Switch 
                  id="night-mode" 
                  checked={nightMode} 
                  onCheckedChange={setNightMode} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-controls">Show Page Controls</Label>
                <Switch 
                  id="show-controls" 
                  checked={showControls} 
                  onCheckedChange={setShowControls} 
                />
              </div>
              
              <Button onClick={savePreferences} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="password-protect">Password Protect</Label>
                <Switch 
                  id="password-protect" 
                  checked={isPasswordProtected} 
                  onCheckedChange={() => togglePasswordProtection()} 
                />
              </div>
              
              {isPasswordProtected && (
                <div className="space-y-2">
                  <Label htmlFor="pdf-password">PDF Password</Label>
                  <input
                    id="pdf-password"
                    type="password"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Set PDF password"
                  />
                </div>
              )}
              
              <div className="flex justify-between items-center pt-2">
                <div>
                  <h3 className="text-sm font-medium">Document Security</h3>
                  <p className="text-xs text-muted-foreground">
                    {isPasswordProtected 
                      ? "This document is password protected"
                      : "This document is not password protected"}
                  </p>
                </div>
                {isPasswordProtected ? (
                  <Lock className="h-5 w-5 text-amber-500" />
                ) : (
                  <Unlock className="h-5 w-5 text-green-500" />
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PdfViewer;
