
import React, { useState, useEffect, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Smartphone, FileText, Eye, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import Container from "@/components/layout/Container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import ScannerConnection from "@/components/scanner/ScannerConnection";
import { v4 as uuidv4 } from "uuid";

const ScanToPdf = () => {
  const [sessionId] = useState(() => uuidv4());
  const [isConnected, setIsConnected] = useState(false);
  const [scannedDocuments, setScannedDocuments] = useState<Array<{id: string, name: string, url: string}>>([]);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate connection data for QR code
  const connectionData = JSON.stringify({
    sessionId,
    action: "scan-to-pdf",
    serverUrl: window.location.origin,
    timestamp: new Date().toISOString()
  });

  // Function to simulate checking for new documents
  const checkForDocuments = useCallback(() => {
    if (!isConnected) return;
    
    // Simulate API call to check for documents
    // In a real implementation, this would be a WebSocket or polling endpoint
    const hasNewDocument = Math.random() > 0.8; // 20% chance of a new document for demo
    
    if (hasNewDocument) {
      const newDoc = {
        id: uuidv4(),
        name: `Document_${new Date().toLocaleTimeString().replace(/:/g, "-")}.pdf`,
        url: "/path/to/document.pdf" // In real implementation, this would be a real URL
      };
      
      setScannedDocuments(prev => [...prev, newDoc]);
      
      toast({
        title: "New document received",
        description: `Received ${newDoc.name} from your mobile device`,
      });
    }
  }, [isConnected]);

  // Set up polling for document updates
  useEffect(() => {
    if (!isConnected) return;
    
    setIsPolling(true);
    const interval = setInterval(checkForDocuments, 5000);
    
    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  }, [isConnected, checkForDocuments]);

  // Simulate successful connection after QR code scan
  const handleDeviceConnected = () => {
    setIsConnected(true);
    setError(null);
    toast({
      title: "Device connected",
      description: "Your smartphone is now connected. You can start scanning documents.",
    });
  };

  // Handle disconnection
  const handleDisconnect = () => {
    setIsConnected(false);
    toast({
      title: "Device disconnected",
      description: "Your smartphone has been disconnected",
    });
  };

  // Handle errors
  const handleConnectionError = (errorMessage: string) => {
    setError(errorMessage);
    setIsConnected(false);
    toast({
      title: "Connection error",
      description: errorMessage,
      variant: "destructive"
    });
  };

  // Download document
  const handleDownload = (document: {id: string, name: string, url: string}) => {
    // In a real implementation, this would download the actual file
    // For demo purposes, we'll just show a toast
    toast({
      title: "Download started",
      description: `Downloading ${document.name}`,
    });
    
    // Simulate successful download after a short delay
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: `${document.name} has been saved to your downloads folder`,
      });
    }, 2000);
  };

  // View document
  const handleView = (document: {id: string, name: string, url: string}) => {
    // In a real implementation, this would open the document in a new tab or viewer
    // For demo purposes, we'll just show a toast
    toast({
      title: "Opening document",
      description: `Opening ${document.name} in viewer`,
    });
    
    // We could implement a document viewer here
  };

  return (
    <Container className="max-w-4xl py-8">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Scan to PDF</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Scan documents from your smartphone to your browser
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className={`p-6 ${isConnected ? "border-muted" : "border-primary/50"}`}>
            <CardContent className="p-0 space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold">Step 1</h2>
                <p className="text-muted-foreground">
                  Use your smartphone's camera to scan this QR code
                </p>
              </div>
              
              <div className="flex justify-center py-4">
                <div className="p-3 bg-white rounded-lg">
                  <QRCodeCanvas
                    value={connectionData}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                    includeMargin={false}
                  />
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    // This would regenerate the session in a real app
                    toast({
                      title: "QR Code refreshed",
                      description: "Please scan the new QR code with your phone"
                    });
                  }}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh QR Code</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className={`p-6 ${isConnected ? "border-primary/50" : "border-muted"}`}>
            <CardContent className="p-0 space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold">Step 2</h2>
                <div className="flex justify-center items-center gap-2">
                  <span className={`${isConnected ? "text-green-600" : "text-muted-foreground"}`}>
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                  {isConnected ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
              
              {isConnected ? (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground">
                    To scan your documents, please follow the instructions on your mobile screen,
                    and tap <span className="font-semibold">Save</span> when you're done
                  </p>
                  
                  <div className="text-center font-medium text-amber-600 dark:text-amber-400">
                    Do not close this tab.
                  </div>
                  
                  <div className="flex justify-center pt-4">
                    <div className="relative w-32">
                      <Eye className="text-gray-400 w-16 h-16 absolute -left-12" />
                      <div className="w-24 h-1 bg-green-300/50 absolute top-8 left-4 animate-pulse"></div>
                      <Smartphone className="text-gray-400 w-16 h-16 absolute -right-4 rotate-12" />
                    </div>
                  </div>
                  
                  <div className="flex justify-center pt-2">
                    <Button 
                      variant="outline" 
                      onClick={handleDisconnect}
                      className="flex items-center gap-2 border-red-200 hover:border-red-300 text-red-600 hover:text-red-700"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground">
                    Awaiting connection from your smartphone...
                  </p>
                  
                  <ScannerConnection
                    sessionId={sessionId}
                    onConnected={handleDeviceConnected}
                    onError={handleConnectionError}
                  />
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Connection Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex justify-center pt-4 opacity-50">
                    <div className="relative w-32">
                      <Eye className="text-gray-400 w-16 h-16 absolute -left-12" />
                      <Smartphone className="text-gray-400 w-16 h-16 absolute -right-4 rotate-12" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Scanned Documents Section */}
        {isConnected && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold">Scanned Documents</h2>
            
            {scannedDocuments.length === 0 ? (
              <div className="text-center py-8 border rounded-lg bg-muted/20">
                <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No documents scanned yet</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Documents will appear here once scanned</p>
              </div>
            ) : (
              <div className="space-y-3">
                {scannedDocuments.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-indigo-600" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleView(doc)}
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleDownload(doc)}
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {isPolling && scannedDocuments.length === 0 && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span>Waiting for scanned documents...</span>
              </div>
            )}
          </div>
        )}
        
        {/* How It Works Section */}
        <div className="mt-12 space-y-4">
          <h2 className="text-xl font-semibold">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Connect</h3>
              <p className="text-sm text-muted-foreground">
                Scan the QR code with your smartphone to establish a secure connection
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.342a2 2 0 0 0-.602-1.43l-4.44-4.342A2 2 0 0 0 13.56 2H6a2 2 0 0 0-2 2z" />
                  <path d="M9 13h6" />
                  <path d="M9 17h3" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                </svg>
              </div>
              <h3 className="font-medium">Scan</h3>
              <p className="text-sm text-muted-foreground">
                Use your phone camera to capture documents and convert them to PDF
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <h3 className="font-medium">Save</h3>
              <p className="text-sm text-muted-foreground">
                Documents are instantly transferred to your browser where you can download them
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ScanToPdf;
