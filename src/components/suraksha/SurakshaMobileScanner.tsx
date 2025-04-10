
import React, { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { AlertCircle, Smartphone, Check, Loader2, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";

type ScannerState = "waiting" | "scanning" | "success" | "error" | "pdf-scanning";

interface SurakshaMobileScannerProps {
  userSettings?: UserSettings;
  updateUserSettings?: (settings: Partial<UserSettings>) => void;
}

const SurakshaMobileScanner: React.FC<SurakshaMobileScannerProps> = ({
  userSettings,
  updateUserSettings
}) => {
  const [scannerState, setScannerState] = useState<ScannerState>("waiting");
  const [deviceName, setDeviceName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [pdfDocument, setPdfDocument] = useState<Blob | null>(null);
  const [pdfScanning, setPdfScanning] = useState(false);
  const [pdfName, setPdfName] = useState("Scanned Document");

  useEffect(() => {
    // Check if device is already paired
    if (userSettings?.mobileDeviceName) {
      setDeviceName(userSettings.mobileDeviceName);
      setScannerState("success");
    }
  }, [userSettings]);

  // Updated handler to match the API of the Scanner component
  const handleScan = (detectedCodes: any) => {
    // Extract the text value from the detected codes
    const result = detectedCodes && detectedCodes.length > 0 ? detectedCodes[0].rawValue : null;
    
    if (result) {
      try {
        // Parse QR code data
        const data = JSON.parse(result);
        
        if (data && data.deviceName) {
          // Simulate pairing process
          setScannerState("success");
          setDeviceName(data.deviceName);
          
          // Update user settings with device name
          if (updateUserSettings) {
            updateUserSettings({
              mobileDeviceName: data.deviceName
            });
          }
          
          toast({
            title: "Device connected",
            description: `Successfully paired with ${data.deviceName}`,
          });
        } else {
          throw new Error("Invalid QR code data");
        }
      } catch (err) {
        setScannerState("error");
        setError("Invalid QR code. Please try again.");
        
        toast({
          title: "Connection failed",
          description: "Could not read the QR code. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleError = (err: any) => {
    console.error("QR Scanner error:", err);
    setScannerState("error");
    setError("Failed to access camera. Please check permissions and try again.");
    
    toast({
      title: "Scanner error",
      description: "Couldn't access your camera. Please check camera permissions.",
      variant: "destructive"
    });
  };

  const startScanning = () => {
    setScannerState("scanning");
    setError(null);
  };
  
  const startPdfScanning = () => {
    setScannerState("pdf-scanning");
    setPdfScanning(true);
    setError(null);
  };

  const resetScanner = () => {
    setScannerState("waiting");
    setError(null);
    setPdfScanning(false);
    setPdfDocument(null);
  };

  const unpairDevice = () => {
    if (updateUserSettings) {
      updateUserSettings({
        mobileDeviceName: undefined
      });
    }
    
    setDeviceName("");
    setScannerState("waiting");
    
    toast({
      title: "Device unpaired",
      description: "Your mobile device has been disconnected",
    });
  };
  
  // Function to capture multiple images and convert to PDF
  const capturePdf = async () => {
    // This is a simulation; in a real app, it would capture multiple images
    setPdfScanning(true);
    toast({
      title: "Capturing document",
      description: "Processing images into PDF format...",
    });
    
    // Simulate PDF creation process
    setTimeout(() => {
      // In reality, this would be actual PDF data from captured images
      const mockPdfBlob = new Blob(["PDF content would be here"], { type: "application/pdf" });
      setPdfDocument(mockPdfBlob);
      setPdfScanning(false);
      
      toast({
        title: "PDF created",
        description: "Document has been converted to PDF successfully!",
      });
    }, 2000);
  };
  
  const downloadPdf = () => {
    if (!pdfDocument) return;
    
    const url = URL.createObjectURL(pdfDocument);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pdfName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "PDF downloaded",
      description: "Your scanned document has been downloaded successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Mobile Device Pairing</h2>
        <p className="text-muted-foreground">
          Pair your mobile device with SurakshitLocker to access your documents on the go.
        </p>
      </div>
      
      {scannerState === "success" && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Device Connected</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your account is linked with <span className="font-medium">{deviceName}</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <Button
                  variant="default"
                  onClick={() => window.open("/documents", "_blank")}
                  className="flex-1"
                >
                  View Documents
                </Button>
                <Button 
                  variant="outline" 
                  onClick={unpairDevice}
                  className="flex-1"
                >
                  Disconnect
                </Button>
              </div>
              
              <div className="mt-6 pt-4 border-t w-full">
                <h4 className="font-medium mb-3">Document Scanning Features</h4>
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mx-auto">
                  <Button
                    variant="outline"
                    onClick={startPdfScanning}
                    className="flex-1 flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Scan to PDF
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {scannerState === "waiting" && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <Smartphone className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Connect Mobile Device</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Scan the QR code from your SurakshitLocker mobile app to connect your account
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={startScanning}>
                  Start Scanner
                </Button>
                <Button variant="outline" onClick={startPdfScanning} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Scan to PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {scannerState === "scanning" && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <h3 className="text-xl font-medium">Scan QR Code</h3>
              <p className="text-sm text-muted-foreground text-center mb-2">
                Open the SurakshitLocker mobile app and scan the QR code shown on your screen
              </p>
              
              <div className="relative w-full max-w-sm overflow-hidden rounded-lg border">
                <Scanner
                  onDecode={handleScan}
                  onError={handleError}
                  containerStyle={{ borderRadius: '0.5rem' }}
                />
                <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-primary opacity-50 rounded-lg"></div>
              </div>
              
              <Button variant="outline" onClick={resetScanner}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {scannerState === "pdf-scanning" && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <h3 className="text-xl font-medium">Scan Document to PDF</h3>
              <p className="text-sm text-muted-foreground text-center mb-2">
                Take multiple photos of document pages to create a PDF file
              </p>
              
              {!pdfDocument ? (
                <>
                  <div className="relative w-full max-w-sm overflow-hidden rounded-lg border bg-muted aspect-[3/4] flex items-center justify-center">
                    {pdfScanning ? (
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-sm font-medium">Processing document...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <FileText className="h-16 w-16 text-muted-foreground/50" />
                        <p className="text-sm">Position your document and tap capture</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="w-full max-w-sm">
                    <label className="text-sm font-medium mb-2 block">Document Name</label>
                    <input
                      type="text"
                      value={pdfName}
                      onChange={(e) => setPdfName(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md mb-4"
                      placeholder="Enter document name"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={resetScanner}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={capturePdf}
                      disabled={pdfScanning}
                      className="flex items-center gap-2"
                    >
                      {pdfScanning ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4" />
                          <span>Capture Document</span>
                        </>
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative w-full max-w-sm overflow-hidden rounded-lg border bg-muted p-6 flex flex-col items-center justify-center">
                    <FileText className="h-16 w-16 text-primary mb-3" />
                    <h4 className="font-medium text-lg mb-1">{pdfName}.pdf</h4>
                    <p className="text-sm text-muted-foreground">PDF document ready for download</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={resetScanner}>
                      New Scan
                    </Button>
                    <Button 
                      onClick={downloadPdf}
                      className="flex items-center gap-2"
                    >
                      Download PDF
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {scannerState === "error" && error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="border-t pt-6 mt-6">
        <h3 className="font-medium mb-4">About Mobile Device Connection</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <h4 className="font-medium text-sm">Access on Multiple Devices</h4>
            <p className="text-sm text-muted-foreground">
              Connect your account to access your documents securely from your smartphone or tablet.
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <h4 className="font-medium text-sm">End-to-End Encryption</h4>
            <p className="text-sm text-muted-foreground">
              All data transfers between devices are encrypted for maximum security.
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <h4 className="font-medium text-sm">Offline Access</h4>
            <p className="text-sm text-muted-foreground">
              Download documents to your mobile device for offline viewing.
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <h4 className="font-medium text-sm">Real-time Sync</h4>
            <p className="text-sm text-muted-foreground">
              Changes made on any device will automatically sync across all your connected devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurakshaMobileScanner;
