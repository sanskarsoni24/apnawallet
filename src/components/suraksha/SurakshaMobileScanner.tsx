
import React, { useState, useEffect } from "react";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, QrCode, Smartphone, AlertTriangle, CheckCircle2, Copy, RefreshCw } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react"; // Fixed import

const deviceTypes = [
  { value: "android", label: "Android", icon: "📱" },
  { value: "iphone", label: "iPhone", icon: "📱" },
  { value: "ipad", label: "iPad", icon: "📱" },
  { value: "mac", label: "Mac", icon: "💻" },
  { value: "windows", label: "Windows", icon: "💻" },
  { value: "other", label: "Other", icon: "📱" },
];

type ScanningStatus = "waiting" | "scanning" | "success" | "error";

interface ScanResult {
  deviceId: string;
  timestamp: number;
  userCode?: string;
  deviceType?: string;
}

interface ScannerProps {
  onSuccess?: (result: ScanResult) => void;
}

const SurakshaMobileScanner = ({ onSuccess }: ScannerProps) => {
  const [isClient, setIsClient] = useState(false);
  const [scanningStatus, setScanningStatus] = useState<ScanningStatus>("waiting");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [qrValue, setQrValue] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [confirmingLink, setConfirmingLink] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string>(deviceTypes[0].value);
  const { user, updateUserSettings } = useUser();
  
  const isMobileLinked = user && user.mobileDeviceId;

  useEffect(() => {
    setIsClient(true);
    
    // Generate a unique QR code for this session
    if (!qrValue) {
      const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const userId = user?.email || "guest";
      const payload = {
        sessionId,
        userId,
        timestamp: Date.now(),
        action: "link_device"
      };
      setQrValue(JSON.stringify(payload));
    }
  }, [qrValue, user]);

  useEffect(() => {
    // Show connected device message if device already linked
    if (isMobileLinked) {
      setScanningStatus("success");
      setScanResult({
        deviceId: user.mobileDeviceId || "unknown",
        timestamp: Date.now(),
      });
    }
  }, [isMobileLinked, user]);

  const handleScanStart = () => {
    setScanningStatus("scanning");
    setShowScanner(true);
  };

  const refreshQrCode = () => {
    // Generate a new QR code
    const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const userId = user?.email || "guest";
    const payload = {
      sessionId,
      userId,
      timestamp: Date.now(),
      action: "link_device"
    };
    setQrValue(JSON.stringify(payload));
    toast({
      title: "QR Code Refreshed",
      description: "A new QR code has been generated.",
    });
  };

  const handleScanSuccess = (result: string) => {
    try {
      // Stop scanning
      setShowScanner(false);
      
      // Parse scan result
      const scanData = JSON.parse(result);
      
      if (!scanData.deviceId) {
        throw new Error("Invalid scan data: missing device ID");
      }
      
      // Set result and update status
      setScanResult(scanData);
      setScanningStatus("success");
      
      // Pass result to parent if callback provided
      if (onSuccess) {
        onSuccess(scanData);
      }
      
      // Update user settings with device info
      updateUserSettings({
        mobileDeviceId: scanData.deviceId,
        lastMobileSync: new Date().toISOString(),
      });
      
      toast({
        title: "Device Linked Successfully",
        description: "Your mobile device has been linked to your account.",
      });
      
    } catch (error) {
      console.error("QR scan error:", error);
      setScanningStatus("error");
      
      toast({
        title: "Scan Error",
        description: "Unable to process the QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleScanError = (error: Error) => {
    console.error("QR Scanner error:", error);
    setScanningStatus("error");
    
    toast({
      title: "Scanner Error",
      description: "There was a problem with the QR scanner. Please try again.",
      variant: "destructive",
    });
  };

  const handleConfirmLink = () => {
    setConfirmingLink(true);
    
    // Simulate device linking process
    setTimeout(() => {
      // Generate mock scan result
      const mockScanResult = {
        deviceId: `${selectedDevice}-${Date.now()}`,
        timestamp: Date.now(),
        deviceType: selectedDevice
      };
      
      // Set result and update status
      setScanResult(mockScanResult);
      setScanningStatus("success");
      
      // Update user settings with device info
      updateUserSettings({
        mobileDeviceId: mockScanResult.deviceId,
        lastMobileSync: new Date().toISOString(),
      });
      
      setConfirmingLink(false);
      
      toast({
        title: "Device Linked Successfully",
        description: "Your mobile device has been linked to your account.",
      });
      
    }, 1500);
  };

  const handleUnlinkDevice = () => {
    // Update user settings to remove device info
    updateUserSettings({
      mobileDeviceId: undefined,
      lastMobileSync: undefined,
    });
    
    // Reset scanner state
    setScanningStatus("waiting");
    setScanResult(null);
    setShowScanner(false);
    
    toast({
      title: "Device Unlinked",
      description: "Your mobile device has been unlinked from your account.",
    });
  };

  const copyLinkToClipboard = () => {
    // Create a shareable link that could be used to link devices
    const shareableLink = `https://apnawallet.com/link-device?code=${encodeURIComponent(qrValue)}`;
    
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        toast({
          title: "Link Copied",
          description: "Device link code copied to clipboard.",
        });
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Copy Failed",
          description: "Could not copy link to clipboard.",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <CardTitle>Mobile Device Connection</CardTitle>
            </div>
            
            {isMobileLinked && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleUnlinkDevice}
              >
                Unlink Device
              </Button>
            )}
          </div>
          <CardDescription>
            Connect your mobile device to access documents on the go
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {scanningStatus === "waiting" && (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center space-y-4 border border-dashed border-primary/20 rounded-lg p-6 bg-muted/30">
                <QRCodeSVG
                  value={qrValue}
                  size={200}
                  level="H"
                  includeMargin={true}
                  className="bg-white p-2 rounded-md"
                />
                
                <div className="text-center space-y-2">
                  <h3 className="font-medium">Scan this QR code with the ApnaWallet app</h3>
                  <p className="text-sm text-muted-foreground">
                    Open the app, go to Settings → Link Account and scan this code
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refreshQrCode}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh Code
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyLinkToClipboard}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </Button>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm font-medium mb-2">Don't have the app yet?</p>
                <Button asChild>
                  <a href="/mobile-app">Download the Mobile App</a>
                </Button>
              </div>
              
              <div className="border-t pt-4 mt-6">
                <p className="text-sm font-medium mb-3">Or connect by scanning a QR code from your mobile device:</p>
                
                <div className="flex justify-center">
                  <Button 
                    variant="secondary" 
                    onClick={handleScanStart}
                    className="flex items-center gap-2"
                  >
                    <QrCode className="h-4 w-4" />
                    Scan QR From Mobile
                  </Button>
                </div>
                
                <div className="text-center mt-6">
                  <p className="text-sm font-medium mb-2">Connect your device manually:</p>
                  
                  <div className="flex flex-col space-y-3 max-w-xs mx-auto">
                    <div className="grid grid-cols-3 gap-2">
                      {deviceTypes.map((device) => (
                        <Button
                          key={device.value}
                          variant={selectedDevice === device.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedDevice(device.value)}
                          className="flex flex-col items-center py-3 h-auto"
                        >
                          <span className="text-xl mb-1">{device.icon}</span>
                          <span className="text-xs">{device.label}</span>
                        </Button>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={handleConfirmLink}
                      disabled={confirmingLink}
                    >
                      {confirmingLink ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        'Connect Device'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {scanningStatus === "scanning" && showScanner && isClient && (
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="relative w-full max-w-sm mx-auto aspect-square border border-primary/20 rounded-lg overflow-hidden">
                <QrScanner
                  onDecode={handleScanSuccess}
                  onError={handleScanError}
                  scanDelay={500}
                  constraints={{
                    facingMode: 'environment'
                  }}
                  className="w-full h-full rounded-lg"
                />
                <div className="absolute inset-0 pointer-events-none border-2 border-primary/50 rounded-lg"></div>
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="font-medium">Scanning for QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  Position the QR code from your mobile device within the frame
                </p>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowScanner(false);
                  setScanningStatus("waiting");
                }}
              >
                Cancel
              </Button>
            </div>
          )}
          
          {scanningStatus === "success" && (
            <div className="space-y-4">
              <Alert variant="default" className="bg-green-500/10 border-green-500/50">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle>Device Connected</AlertTitle>
                <AlertDescription>
                  Your mobile device has been successfully linked to your account.
                </AlertDescription>
              </Alert>
              
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium">Device Information:</p>
                <div className="grid grid-cols-2 text-sm gap-1">
                  <span className="text-muted-foreground">Device ID:</span>
                  <span className="font-mono text-xs truncate">{scanResult?.deviceId || user?.mobileDeviceId}</span>
                  
                  <span className="text-muted-foreground">Last Synced:</span>
                  <span>{user?.lastMobileSync ? new Date(user.lastMobileSync).toLocaleString() : "Never"}</span>
                </div>
              </div>
              
              <div className="flex flex-col xs:flex-row justify-center gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleUnlinkDevice}
                >
                  Unlink Device
                </Button>
                
                <Button 
                  variant="default" 
                  size="sm"
                  asChild
                >
                  <a href="/settings">Manage Device Settings</a>
                </Button>
              </div>
            </div>
          )}
          
          {scanningStatus === "error" && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Connection Failed</AlertTitle>
                <AlertDescription>
                  There was a problem connecting your mobile device. Please try again.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-center">
                <Button 
                  onClick={() => setScanningStatus("waiting")}
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SurakshaMobileScanner;
