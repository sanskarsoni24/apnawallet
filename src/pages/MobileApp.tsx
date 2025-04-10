
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeCanvas } from "qrcode.react";
import { Share, Download, Smartphone, Tablet, Laptop, ArrowRight, PhoneCall, Scan, CheckCircle, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUser } from "@/contexts/UserContext";
import { useIsMobileDevice, useMobileDeviceId } from "@/hooks/use-mobile";

// Define a global type for the deferredPrompt
declare global {
  interface Window {
    deferredPrompt: any;
  }
}

const MobileApp = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("android");
  const [canInstall, setCanInstall] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const { isLoggedIn, userSettings, updateUserSettings } = useUser();
  const isMobileDevice = useIsMobileDevice();
  const deviceId = useMobileDeviceId();
  
  // Current page URL to create QR code
  const downloadUrl = `${window.location.origin}/download-app`;
  
  useEffect(() => {
    // Check if the app has been "downloaded" before (for demo purposes)
    const hasDownloaded = localStorage.getItem("app-downloaded") === "true";
    setDownloaded(hasDownloaded);
    
    // Check if the app can be installed as PWA
    if (window.deferredPrompt) {
      setCanInstall(true);
    }
    
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event so it can be triggered later
      window.deferredPrompt = e;
      setCanInstall(true);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Register the mobile device if logged in
    if (isLoggedIn && isMobileDevice) {
      // Update user settings with mobile device info
      updateUserSettings({
        mobileDeviceName: navigator.userAgent,
        mobileDeviceId: deviceId,
        lastMobileSync: new Date().toISOString()
      });
    }
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [isLoggedIn, isMobileDevice, deviceId, updateUserSettings]);
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'SurakshitLocker Mobile App',
          text: 'Check out the SurakshitLocker mobile app for secure document management!',
          url: downloadUrl,
        });
        toast({
          title: "Shared successfully",
          description: "The app download link has been shared",
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        navigator.clipboard.writeText(downloadUrl);
        toast({
          title: "Link copied to clipboard",
          description: "Share this link to download the mobile app",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to clipboard
      navigator.clipboard.writeText(downloadUrl);
      toast({
        title: "Link copied to clipboard",
        description: "Share this link to download the mobile app",
      });
    }
  };
  
  const handleInstallPWA = async () => {
    if (!window.deferredPrompt) {
      toast({
        title: "Installation not available",
        description: "Your browser doesn't support app installation or the app is already installed",
        variant: "destructive",
      });
      return;
    }
    
    // Show the install prompt
    window.deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await window.deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      toast({
        title: "Installation started",
        description: "The app is being installed on your device",
      });
    } else {
      toast({
        title: "Installation cancelled",
        description: "You can install the app later from the browser menu",
      });
    }
    
    // Clear the deferredPrompt so it can't be used again
    window.deferredPrompt = null;
    setCanInstall(false);
  };

  const handleDownloadApp = () => {
    setDownloading(true);
    
    // Simulate download for demo purposes
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      localStorage.setItem("app-downloaded", "true");
      
      // Show success message
      toast({
        title: "App downloaded successfully",
        description: "SurakshitLocker app has been downloaded to your device"
      });
      
      // Navigate to download app page
      navigate("/download-app");
    }, 2000);
  };

  return (
    <Container className="max-w-5xl">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            DocuNinja Mobile App
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Access your secure document vault on the go with our mobile app
          </p>
        </div>
        
        {isMobileDevice && isLoggedIn && (
          <Alert className="bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800 mb-6">
            <AlertTitle className="text-green-800 dark:text-green-300 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Mobile device detected
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-400">
              You're currently using the mobile version. Your session is synced with your account.
            </AlertDescription>
          </Alert>
        )}
        
        <Alert className="bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800 mb-6">
          <AlertTitle className="text-blue-800 dark:text-blue-300 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Cross-device scanning now available!
          </AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-400">
            Scan documents with your phone and they'll automatically appear in your vault. Try it now!
          </AlertDescription>
        </Alert>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Get Started Now</h2>
              <p className="text-muted-foreground">
                Download the SurakshitLocker app to securely access and manage your 
                important documents from anywhere.
              </p>
              
              <div className="grid grid-cols-3 gap-4 my-6">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Mobile</span>
                  <span className="text-xs text-muted-foreground">iOS & Android</span>
                </div>
                
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Tablet className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Tablet</span>
                  <span className="text-xs text-muted-foreground">iPad & Android</span>
                </div>
                
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Laptop className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Desktop</span>
                  <span className="text-xs text-muted-foreground">Windows & Mac</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="android">
                    Android
                  </TabsTrigger>
                  <TabsTrigger value="ios">
                    iOS
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="android" className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={handleDownloadApp}
                      size="lg" 
                      className="w-full"
                      disabled={downloading}
                    >
                      {downloading ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-5 w-5" />
                          Download APK
                        </>
                      )}
                    </Button>
                    
                    {canInstall && (
                      <Button 
                        onClick={handleInstallPWA} 
                        variant="outline" 
                        size="lg"
                        className="w-full"
                      >
                        <Smartphone className="mr-2 h-5 w-5" />
                        Install as App
                      </Button>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="ios" className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      On iOS, you can install the app directly from your Safari browser:
                    </p>
                    <ol className="list-decimal text-sm pl-5 space-y-2">
                      <li>Open this page in Safari</li>
                      <li>Tap the Share button</li>
                      <li>Scroll down and tap "Add to Home Screen"</li>
                      <li>Tap "Add" in the top-right corner</li>
                    </ol>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleShare} 
                  variant="outline" 
                  className="flex-1"
                >
                  <Share className="mr-2 h-4 w-4" />
                  Share App Link
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate("/help")}
                >
                  <PhoneCall className="mr-2 h-4 w-4" />
                  Need Help?
                </Button>
              </div>
            </div>
          </div>
          
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl">Scan to Download</CardTitle>
              <CardDescription>
                Use your phone's camera to scan this QR code
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-8">
              <div className="p-4 bg-white rounded-lg">
                <QRCodeCanvas
                  value={downloadUrl}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="L"
                  includeMargin={false}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <div className="flex flex-col gap-1 text-center">
                <p className="text-sm font-medium">Direct link:</p>
                <p className="text-xs text-muted-foreground break-all">
                  {downloadUrl}
                </p>
              </div>
              <Button 
                onClick={handleDownloadApp}
                className="w-full"
                variant="outline"
                disabled={downloading}
              >
                {downloading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></span>
                    Downloading...
                  </>
                ) : (
                  <>
                    Go to Download Page
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Scan className="h-5 w-5 text-primary" />
                Mobile Scanning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Easily scan documents with your phone camera and instantly add them to your secure vault.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Offline Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View and manage your important documents even when you're offline or have poor internet connection.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Share className="h-5 w-5 text-primary" />
                Secure Sharing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Share documents securely with anyone, anywhere, with end-to-end encryption and access controls.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default MobileApp;
