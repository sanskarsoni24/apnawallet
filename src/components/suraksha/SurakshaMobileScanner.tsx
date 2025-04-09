
import React, { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { AlertCircle, Smartphone, Check, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";

type ScannerState = "waiting" | "scanning" | "success" | "error";

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

  useEffect(() => {
    // Check if device is already paired
    if (userSettings?.mobileDeviceName) {
      setDeviceName(userSettings.mobileDeviceName);
      setScannerState("success");
    }
  }, [userSettings]);

  const handleScan = (result: string | null) => {
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

  const resetScanner = () => {
    setScannerState("waiting");
    setError(null);
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
              
              <Button onClick={startScanning}>
                Start Scanner
              </Button>
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
                  onResult={handleScan}
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
