import React, { useState, useEffect, useRef } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { CheckCircle, Copy, RefreshCw, Smartphone } from "lucide-react";
import { useTheme } from 'next-themes';

interface MobileScannerProps {
  onScanSuccess: (data: string) => void;
  onScanError: (error: Error) => void;
}

const SurakshaMobileScanner: React.FC<MobileScannerProps> = ({ onScanSuccess, onScanError }) => {
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<Event | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const qrScannerRef = useRef<QrScanner>(null);
  const { theme } = useTheme();
  const { userSettings } = useUser();
  
  useEffect(() => {
    // Check if the user is on a mobile device
    const mobileCheck = () => {
      return /Android|iOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    };
    
    setIsMobile(mobileCheck());
    
    // Check if the user is on iOS
    const iOSCheck = () => {
      return /iOS|iPhone|iPad|iPod/i.test(navigator.userAgent) && !!navigator.platform;
    };
    
    setIsIOS(iOSCheck());
    
    // Check if the app is installed (PWA)
    const checkAppInstalled = () => {
      if ((navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches) {
        setIsAppInstalled(true);
      } else {
        setIsAppInstalled(false);
      }
    };
    
    checkAppInstalled();
    
    // Listen for the appinstalled event
    window.addEventListener('appinstalled', () => {
      setIsAppInstalled(true);
    });
    
    // Detect theme changes
    setIsDarkTheme(theme === 'dark');
    
    // Listen for theme changes
    const handleThemeChange = () => {
      setIsDarkTheme(theme === 'dark');
    };
    
    return () => {
      window.removeEventListener('appinstalled', () => {
        setIsAppInstalled(true);
      });
    };
  }, [theme]);
  
  useEffect(() => {
    // Check for PWA installation prompt
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPromptEvent(event);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  useEffect(() => {
    // Get available media devices
    const getDevices = async () => {
      try {
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = deviceList.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        
        // Set default device if available
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
          setDeviceId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error("Error enumerating devices:", error);
        toast({
          title: "Camera access error",
          description: "Failed to access camera devices. Please check your permissions.",
          variant: "destructive"
        });
      }
    };
    
    // Check camera permission
    const checkCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasPermission(true);
        stream.getTracks().forEach(track => track.stop());
        
        // Get devices after permission is granted
        await getDevices();
      } catch (error: any) {
        console.error("Camera permission denied:", error);
        setHasPermission(false);
        toast({
          title: "Camera permission denied",
          description: "Please grant camera permission to use the scanner.",
          variant: "destructive"
        });
      }
    };
    
    checkCameraPermission();
  }, []);
  
  const handleScan = (result: any) => {
    if (result) {
      setIsScanning(false);
      setIsCodeValid(true);
      onScanSuccess(result?.text);
      
      toast({
        title: "Scan successful",
        description: "Code scanned successfully!",
      });
    }
  };
  
  const handleError = (error: Error) => {
    console.error("Scan error:", error);
    onScanError(error);
    toast({
      title: "Scan error",
      description: "An error occurred while scanning. Please try again.",
      variant: "destructive"
    });
  };
  
  const toggleFacingMode = () => {
    setFacingMode(facingMode === 'environment' ? 'user' : 'environment');
  };
  
  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDeviceId = e.target.value;
    setSelectedDeviceId(newDeviceId);
    setDeviceId(newDeviceId);
  };
  
  const startScanning = async () => {
    setIsScanning(true);
    setIsCodeValid(false);
    
    // Check camera permission again before starting
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (error: any) {
      console.error("Camera permission denied:", error);
      setHasPermission(false);
      setIsScanning(false);
      toast({
        title: "Camera permission denied",
        description: "Please grant camera permission to use the scanner.",
        variant: "destructive"
      });
      return;
    }
    
    // Ensure deviceId is set before starting
    if (!deviceId && devices.length > 0) {
      setDeviceId(devices[0].deviceId);
    }
  };
  
  const stopScanning = () => {
    setIsScanning(false);
  };
  
  const handleManualCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setManualCode(code);
    setIsCodeValid(code.length > 0);
  };
  
  const submitManualCode = () => {
    if (manualCode.length > 0) {
      onScanSuccess(manualCode);
      setIsManualEntryOpen(false);
      setIsCodeValid(true);
      toast({
        title: "Code submitted",
        description: "Manual code submitted successfully!",
      });
    } else {
      toast({
        title: "Invalid code",
        description: "Please enter a valid code.",
        variant: "destructive"
      });
    }
  };
  
  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(manualCode)
      .then(() => {
        setIsCodeCopied(true);
        toast({
          title: "Code copied",
          description: "Code copied to clipboard!",
        });
        setTimeout(() => setIsCodeCopied(false), 2000);
      })
      .catch(err => {
        console.error("Failed to copy code: ", err);
        toast({
          title: "Copy failed",
          description: "Failed to copy code to clipboard.",
          variant: "destructive"
        });
      });
  };
  
  const installApp = async () => {
    if (installPromptEvent) {
      (installPromptEvent as any).prompt();
      const choiceResult = await (installPromptEvent as any).userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setInstallPromptEvent(null);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-xl font-semibold mb-4">
        {isMobile ? "Mobile Scanner" : "Desktop Scanner"}
      </h2>
      
      {isMobile && !isAppInstalled && installPromptEvent && (
        <div className="mb-4 p-3 rounded-md bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            <p className="text-sm">
              Install the app for a better experience!
              <Button variant="link" onClick={installApp} className="ml-2">
                Install Now
              </Button>
            </p>
          </div>
        </div>
      )}
      
      {hasPermission ? (
        <>
          {devices.length > 1 && (
            <div className="mb-4">
              <Label htmlFor="cameraSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Camera:
              </Label>
              <select
                id="cameraSelect"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                onChange={handleDeviceChange}
                value={selectedDeviceId}
              >
                {devices.map(device => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${devices.indexOf(device) + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {isScanning ? (
            <div className="relative">
              <QrScanner
                ref={qrScannerRef}
                delay={300}
                onError={handleError}
                onScan={handleScan}
                facingMode={facingMode}
                deviceId={deviceId}
                className="w-full aspect-square rounded-md overflow-hidden"
              />
              <button
                onClick={stopScanning}
                className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Button onClick={startScanning} disabled={isScanning} className="mb-4">
              {isScanning ? "Scanning..." : "Start Scanning"}
            </Button>
          )}
          
          <Button variant="outline" onClick={toggleFacingMode} disabled={!isScanning}>
            Switch Camera
          </Button>
        </>
      ) : (
        <p className="text-red-500">Camera permission denied. Please enable it in your browser settings.</p>
      )}
      
      <Dialog open={isManualEntryOpen} onOpenChange={setIsManualEntryOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="mt-4">Enter Code Manually</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Code Manually</DialogTitle>
            <DialogDescription>
              Enter the code you want to submit
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code
              </Label>
              <Input
                type="text"
                id="code"
                value={manualCode}
                onChange={handleManualCodeChange}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-between">
            <Button type="button" variant="secondary" onClick={() => setIsManualEntryOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={submitManualCode} disabled={!isCodeValid}>
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {isCodeValid && (
        <div className="mt-4 p-3 rounded-md bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <p className="text-sm">Code is valid!</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
              {manualCode || "Code scanned successfully!"}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyCodeToClipboard}
              disabled={isCodeCopied}
            >
              {isCodeCopied ? "Copied!" : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}
      
      {userSettings?.mobileDeviceName ? (
        <div className="mt-4 p-3 rounded-md bg-gray-50 border border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-300">
          <p className="text-sm">
            Connected Device: {userSettings?.mobileDeviceName || 'Unknown Device'}
          </p>
        </div>
      ) : (
        <div className="mt-4 p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300">
          <p className="text-sm">No device connected.</p>
        </div>
      )}
    </div>
  );
};

export default SurakshaMobileScanner;
