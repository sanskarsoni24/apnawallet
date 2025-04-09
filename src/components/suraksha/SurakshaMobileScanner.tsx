import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";
import { Smartphone, CheckCircle, Clock, Scan } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SurakshaMobileScanner = () => {
  const { userSettings } = useUser();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [scanCode, setScanCode] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    // Generate a random connection code for the QR code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setScanCode(code);
    
    // For demo, check if a mobile connection exists in localStorage
    const mobileConnected = localStorage.getItem("surakshit-mobile-connected") === "true";
    setIsConnected(mobileConnected);
  }, []);
  
  const handleConnectMobile = () => {
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      localStorage.setItem("surakshit-mobile-connected", "true");
      
      toast({
        title: "Mobile device connected",
        description: "Your mobile device is now linked to your account"
      });
    }, 3000);
  };
  
  const handleDisconnectMobile = () => {
    setIsConnected(false);
    localStorage.removeItem("surakshit-mobile-connected");
    
    toast({
      title: "Mobile device disconnected",
      description: "Your mobile device has been unlinked from your account"
    });
  };
  
  const simulateReceiveScan = () => {
    toast({
      title: "Document received from mobile",
      description: "Passport scan has been added to your account"
    });
    
    setTimeout(() => {
      navigate("/documents");
    }, 1500);
  };
  
  const getConnectionUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/mobile-connect?code=${scanCode}&user=${encodeURIComponent(userSettings?.email || "user")}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scan className="h-5 w-5 text-indigo-500" />
          Mobile Scanner
        </CardTitle>
        <CardDescription>
          Connect your mobile device to scan and upload documents directly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConnected ? (
          <div className="flex flex-col items-center space-y-6">
            <div className="p-2 bg-white rounded-lg shadow-sm w-full max-w-[260px] mx-auto">
              <QRCodeSVG
                value={getConnectionUrl()}
                size={240}
                includeMargin={true}
                className="w-full h-auto"
              />
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">Your connection code:</p>
              <div className="font-mono text-xl tracking-wide bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                {scanCode}
              </div>
              <p className="text-xs text-muted-foreground">
                Scan with your mobile device or enter this code manually
              </p>
            </div>
            
            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
              <AlertDescription className="text-sm text-blue-800 dark:text-blue-300">
                1. Download the SurakshitLocker mobile app
                <br />
                2. Open the app and tap "Connect to Desktop"
                <br />
                3. Scan this QR code or enter the connection code
              </AlertDescription>
            </Alert>
            
            <div className="w-full">
              <Button 
                className="w-full"
                onClick={handleConnectMobile}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Smartphone className="mr-2 h-4 w-4" />
                    Connect Mobile Device
                  </>
                )}
              </Button>
              <p className="text-xs text-center mt-2 text-muted-foreground">
                Note: For this demo, pressing the button will simulate a connection
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
              <CheckCircle className="h-10 w-10 text-green-500" />
              <div>
                <h3 className="font-medium text-green-800 dark:text-green-300">Mobile Device Connected</h3>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Your mobile device is linked and ready to scan
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Connected Device</h3>
              <div className="flex items-center gap-3">
                <Smartphone className="h-6 w-6 text-indigo-500" />
                <div>
                  <p className="font-medium">{userSettings?.mobileDeviceName || "Mobile Device"}</p>
                  <p className="text-sm text-muted-foreground">
                    Last active: {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button className="w-full" onClick={simulateReceiveScan}>
                <Scan className="mr-2 h-4 w-4" />
                Simulate Receiving Scan
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 dark:border-red-900"
                onClick={handleDisconnectMobile}
              >
                Disconnect Mobile Device
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          variant="link" 
          onClick={() => navigate("/mobile-app")}
          className="text-indigo-500"
        >
          Download Mobile App
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SurakshaMobileScanner;
