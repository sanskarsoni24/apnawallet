
import React, { useState, useEffect } from "react";
import Container from "@/components/layout/Container";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Download, Smartphone, Info, ExternalLink, Share2, Plus } from "lucide-react";
import BlurContainer from "@/components/ui/BlurContainer";
import { toast } from "@/hooks/use-toast";
import SurakshitLogo from "@/components/ui/SurakshitLogo";
import { Link } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";

const MobileApp = () => {
  const [downloadUrl, setDownloadUrl] = useState("");
  const [directApkUrl, setDirectApkUrl] = useState("");
  const [activeTab, setActiveTab] = useState<"android" | "ios">("android");
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  useEffect(() => {
    // Set download page URL for QR code
    const domain = window.location.origin;
    const downloadPage = `${domain}/download-app`;
    setDownloadUrl(downloadPage);

    // Set direct APK download URL
    const apkUrl = `${domain}/downloads/surakshitlocker.apk`;
    setDirectApkUrl(apkUrl);
    
    // Listen for PWA install prompt
    const handleInstallPrompt = (e) => {
      setShowInstallDialog(true);
    };
    
    document.addEventListener('showInstallPrompt', handleInstallPrompt);
    
    // Capture the deferred prompt event
    if (window.deferredPrompt) {
      setDeferredPrompt(window.deferredPrompt);
    }
    
    // Listen for future prompt events
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
    
    return () => {
      document.removeEventListener('showInstallPrompt', handleInstallPrompt);
    };
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(downloadUrl);
    toast({
      title: "Link copied",
      description: "Download page link copied to clipboard"
    });
  };

  const handleDirectDownload = () => {
    if (isMobile) {
      // Navigate to download page on mobile
      window.location.href = "/download-app";
      
      toast({
        title: "Redirecting to download page",
        description: "You'll be able to download the app directly"
      });
    } else {
      // On desktop, copy the link
      navigator.clipboard.writeText(downloadUrl);
      toast({
        title: "Link copied",
        description: "Download page link copied to clipboard. Share this with your mobile device."
      });
    }
  };

  // Install PWA function
  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      // If no deferred prompt is available, provide instructions
      setShowInstallDialog(true);
      return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    
    // Clear the deferred prompt variable
    setDeferredPrompt(null);
    window.deferredPrompt = null;
  };

  // New direct APK download function
  const handleDirectApkDownload = () => {
    // Only attempt direct download on mobile Android devices
    if (isMobile && /android/i.test(navigator.userAgent)) {
      console.log("Starting direct APK download from MobileApp");
    
      // Show loading toast
      toast({
        title: "Starting Download",
        description: "Preparing your APK file..."
      });
    
      try {
        // Create a temporary anchor element
        const link = document.createElement('a');
        link.href = directApkUrl;
        link.download = 'surakshitlocker.apk';
        link.setAttribute('type', 'application/vnd.android.package-archive');
        document.body.appendChild(link);
        
        // Trigger the click
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        
        // Show success toast
        toast({
          title: "Download Started",
          description: "The APK file is downloading. Check your notifications."
        });
      } catch (error) {
        console.error("Direct download error:", error);
        
        // Try alternative method with fetch
        fetch(directApkUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.blob();
          })
          .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'surakshitlocker.apk';
            a.setAttribute('type', 'application/vnd.android.package-archive');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
            
            toast({
              title: "Download Started (Alternative Method)",
              description: "The APK file is downloading with alternative method."
            });
          })
          .catch(err => {
            console.error("Fetch download failed:", err);
            toast({
              title: "Download Failed",
              description: "Redirecting to download page for better options.",
              variant: "destructive"
            });
            
            // Fallback to download page
            window.location.href = "/download-app";
          });
      }
    } else {
      // Non-Android mobile or desktop users get sent to download page
      window.location.href = "/download-app";
    }
  };

  // Function to add web app to home screen (iOS)
  const showAddToHomeScreenInstructions = () => {
    setShowInstallDialog(true);
  };

  const detectOS = () => {
    const userAgent = navigator.userAgent || navigator.vendor;
    
    if (/android/i.test(userAgent)) {
      return "android";
    }
    
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return "ios";
    }
    
    return "android"; // Default
  };

  useEffect(() => {
    setActiveTab(detectOS());
  }, []);

  return (
    <Container>
      <div className="max-w-4xl mx-auto">
        <BlurContainer variant="elevated" className="p-8 mb-8">
          <div className="flex flex-col items-center text-center mb-8">
            <SurakshitLogo size="lg" className="mb-4" />
            <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-4">
              <Smartphone className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Download SurakshitLocker Mobile App</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access your secure documents and passwords on the go. Scan the QR code or use the direct download link below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-col items-center justify-center p-8">
              {/* QR Code that links to the download page */}
              <QRCodeSVG 
                value={downloadUrl} 
                size={isMobile ? 200 : 250}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
                includeMargin={true}
              />
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Scan this QR code with your device's camera to go to the download page
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 flex-1 justify-center"
                  onClick={handleCopyLink}
                >
                  <Share2 className="h-4 w-4" />
                  <span>Copy Link</span>
                </Button>
                
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2 flex-1 justify-center"
                  onClick={handleDirectDownload}
                >
                  <Download className="h-4 w-4" />
                  <span>{isMobile ? "Download Now" : "Copy Download Link"}</span>
                </Button>
              </div>
              
              {/* Direct link to download page and direct APK download for mobile devices */}
              {isMobile && (
                <div className="mt-4 text-center space-y-3 w-full">
                  <Link 
                    to="/download-app" 
                    className="inline-block bg-indigo-600 text-white rounded-lg px-4 py-2 w-full hover:bg-indigo-700 flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Go to Download Page</span>
                  </Link>
                  
                  {/android/i.test(navigator.userAgent) && (
                    <a 
                      href={directApkUrl}
                      download="surakshitlocker.apk"
                      className="inline-block bg-green-600 text-white rounded-lg px-4 py-2 w-full hover:bg-green-700 flex items-center justify-center gap-2"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDirectApkDownload();
                      }}
                    >
                      <Download className="h-4 w-4" />
                      <span>Download APK Directly</span>
                    </a>
                  )}
                  
                  {/* Add to Home Screen button */}
                  <Button
                    onClick={isMobile ? showAddToHomeScreenInstructions : handleCopyLink}
                    className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add to Home Screen</span>
                  </Button>
                </div>
              )}
              
              {/* Manual alternative links */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 w-full">
                <p className="text-sm font-medium mb-2">Alternative Methods:</p>
                <div className="flex flex-col gap-2">
                  <Link 
                    to="/download-app" 
                    className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>Go to download page</span>
                  </Link>
                  
                  {isMobile && /android/i.test(navigator.userAgent) && (
                    <a 
                      href={directApkUrl}
                      download="surakshitlocker.apk"
                      className="text-green-600 dark:text-green-400 hover:underline text-sm flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      <span>Direct APK download link</span>
                    </a>
                  )}
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <Tabs 
                value={activeTab} 
                onValueChange={(v) => setActiveTab(v as "android" | "ios")}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="android">Android</TabsTrigger>
                  <TabsTrigger value="ios">iOS</TabsTrigger>
                </TabsList>
                
                <TabsContent value="android" className="mt-4 space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-900/50">
                    <h3 className="font-semibold text-green-800 dark:text-green-400 mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      <span>Android Installation</span>
                    </h3>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-green-700 dark:text-green-300">
                      <li>Scan the QR code with your Android device</li>
                      <li>Tap <strong>Download Now</strong> on the download page</li>
                      <li>When download completes, tap the APK file to install</li>
                      <li>Allow installation from unknown sources if prompted</li>
                      <li>Follow the installation prompts</li>
                      <li>Launch SurakshitLocker from your app drawer</li>
                    </ol>
                  </div>
                  
                  {/* Add to Home Screen Instructions for Android */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-900/50">
                    <h3 className="font-semibold text-purple-800 dark:text-purple-400 mb-2 flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span>Add Web App to Home Screen</span>
                    </h3>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-purple-700 dark:text-purple-300">
                      <li>Open SurakshitLocker in Chrome browser</li>
                      <li>Tap the menu icon (three dots) in the top right</li>
                      <li>Select <strong>Add to Home screen</strong> or <strong>Install app</strong></li>
                      <li>Confirm by tapping <strong>Add</strong> or <strong>Install</strong></li>
                      <li>The app icon will appear on your home screen</li>
                      <li>Tap the icon to launch the web app in standalone mode</li>
                    </ol>
                  </div>
                  
                  {/* Manual download button for mobile devices */}
                  {isMobile && /android/i.test(navigator.userAgent) && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg text-center">
                      <p className="text-indigo-700 dark:text-indigo-300 mb-3">
                        Tap below for direct installation:
                      </p>
                      <Button
                        className="bg-green-600 hover:bg-green-700 w-full flex items-center justify-center gap-2"
                        onClick={handleDirectApkDownload}
                      >
                        <Download className="h-4 w-4" />
                        <span>Download APK File</span>
                      </Button>
                    </div>
                  )}
                  
                  {isMobile && !/android/i.test(navigator.userAgent) && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg text-center">
                      <p className="text-indigo-700 dark:text-indigo-300 mb-3">
                        Tap below to visit the download page:
                      </p>
                      <Link 
                        to="/download-app" 
                        className="inline-block bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 w-full flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Go to Download Page</span>
                      </Link>
                    </div>
                  )}
                  
                  {/* Only show this on desktop */}
                  {!isMobile && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg text-center">
                      <p className="font-medium mb-2">Using Desktop?</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        Share this link or visit this page on your Android device:
                      </p>
                      <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                        <code className="text-xs break-all">{downloadUrl}</code>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="ios" className="mt-4 space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900/50">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      <span>iOS Installation</span>
                    </h3>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-blue-700 dark:text-blue-300">
                      <li>Scan the QR code with your iOS device camera</li>
                      <li>Tap the notification that appears</li>
                      <li>Follow the on-screen installation prompts</li>
                      <li>If prompted, trust the developer in Settings</li>
                      <li>Launch SurakshitLocker from your home screen</li>
                    </ol>
                  </div>
                  
                  {/* Add to Home Screen Instructions for iOS */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-900/50">
                    <h3 className="font-semibold text-purple-800 dark:text-purple-400 mb-2 flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span>Add Web App to Home Screen</span>
                    </h3>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-purple-700 dark:text-purple-300">
                      <li>Open SurakshitLocker in Safari browser</li>
                      <li>Tap the Share icon (rectangle with arrow) at the bottom</li>
                      <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
                      <li>Customize the name if desired, then tap <strong>Add</strong></li>
                      <li>The app icon will appear on your home screen</li>
                      <li>Tap the icon to launch the web app in standalone mode</li>
                    </ol>
                  </div>
                  
                  {isMobile && /iPad|iPhone|iPod/i.test(navigator.userAgent) && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                      <p className="text-blue-700 dark:text-blue-300 mb-3">
                        Tap below to visit the download page:
                      </p>
                      <Link 
                        to="/download-app" 
                        className="inline-block bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 w-full flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Go to Download Page</span>
                      </Link>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium mb-2">App Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                    <span>Secure document storage and management</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                    <span>Password vault with end-to-end encryption</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                    <span>Document reminders and notifications</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                    <span>Offline access to your important information</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </BlurContainer>
      </div>
      
      {/* Add to Home Screen Dialog */}
      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Home Screen</DialogTitle>
            <DialogDescription>
              Add SurakshitLocker to your home screen for quick access.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/iPad|iPhone|iPod/i.test(navigator.userAgent) ? (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">iOS Installation Steps:</h3>
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  <li>Tap the Share icon <span className="inline-block bg-gray-200 rounded-md px-1">📤</span> at the bottom of the screen</li>
                  <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
                  <li>Tap <strong>Add</strong> in the top right corner</li>
                </ol>
                <img 
                  src="https://developer.apple.com/design/human-interface-guidelines/foundations/app-icons/images/app-icon-anatomy_2x.png" 
                  alt="iOS Add to Home Screen" 
                  className="max-w-full rounded-md border border-gray-300 dark:border-gray-700"
                />
              </div>
            ) : /Android/i.test(navigator.userAgent) ? (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Android Installation Steps:</h3>
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  <li>Tap the menu icon <span className="inline-block bg-gray-200 rounded-md px-1">⋮</span> in Chrome</li>
                  <li>Tap <strong>Add to Home screen</strong> or <strong>Install app</strong></li>
                  <li>Follow the on-screen prompts</li>
                </ol>
                <Button 
                  onClick={handleInstallPWA} 
                  disabled={!deferredPrompt}
                  className="w-full"
                >
                  Install Web App
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  {!deferredPrompt ? "Your browser doesn't support automatic installation. Please follow the manual steps above." : "Click to install the app on your device"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Desktop Installation:</h3>
                <p className="text-sm">
                  Visit this page on your mobile device to install the app, or scan the QR code from the main page.
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md text-center">
                  <code className="text-xs break-all">{window.location.href}</code>
                </div>
                <Button onClick={handleCopyLink} className="w-full">
                  Copy Link to Share
                </Button>
              </div>
            )}
          </div>
          <div className="flex justify-center border-t pt-4">
            <Button 
              onClick={() => setShowInstallDialog(false)}
              variant="outline"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default MobileApp;
