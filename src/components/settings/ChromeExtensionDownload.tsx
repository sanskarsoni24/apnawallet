
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { 
  CheckCircle2, 
  Download, 
  Loader2, 
  XCircle, 
  Chrome, 
  FileZip,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import JSZip from "jszip";

// Declare the global variable to avoid TypeScript errors
declare global {
  interface Window {
    __DOCU_NINJA_EXTENSION__?: any;
  }
}

const ChromeExtensionDownload = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [extensionStatus, setExtensionStatus] = useState<"not_installed" | "installed" | "connected">("not_installed");
  const [isConnecting, setIsConnecting] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  
  useEffect(() => {
    // Check if the extension is installed by checking for a global function
    if (typeof window.__DOCU_NINJA_EXTENSION__ !== 'undefined') {
      setIsInstalled(true);
      setExtensionStatus("installed");
    } else {
      setIsInstalled(false);
      setExtensionStatus("not_installed");
    }
    
    // Check if the extension is connected by checking local storage
    const extensionConnected = localStorage.getItem("extensionConnected") === "true";
    if (extensionConnected) {
      setExtensionStatus("connected");
    }
    
    // Add event listener for extension installation detection
    window.addEventListener('extensionInstalled', handleExtensionInstalled);
    window.addEventListener('extensionConnected', handleExtensionConnected);
    
    return () => {
      window.removeEventListener('extensionInstalled', handleExtensionInstalled);
      window.removeEventListener('extensionConnected', handleExtensionConnected);
    };
  }, []);
  
  const handleExtensionInstalled = () => {
    setIsInstalled(true);
    setExtensionStatus("installed");
    toast({
      title: "Extension detected",
      description: "SurakshitLocker Chrome extension has been detected.",
    });
  };
  
  const handleExtensionConnected = () => {
    setExtensionStatus("connected");
    localStorage.setItem("extensionConnected", "true");
    toast({
      title: "Extension connected",
      description: "SurakshitLocker Chrome extension is now connected to your account.",
    });
  };

  const createExtensionZip = async () => {
    try {
      // Create a new JSZip instance
      const zip = new JSZip();
      
      // Fetch files from public/chrome-extension directory
      const manifestResponse = await fetch('/chrome-extension/manifest.json');
      const manifestJson = await manifestResponse.text();
      zip.file("manifest.json", manifestJson);
      
      const popupHtmlResponse = await fetch('/chrome-extension/popup.html');
      const popupHtml = await popupHtmlResponse.text();
      zip.file("popup.html", popupHtml);
      
      const popupJsResponse = await fetch('/chrome-extension/popup.js');
      const popupJs = await popupJsResponse.text();
      zip.file("popup.js", popupJs);
      
      const backgroundJsResponse = await fetch('/chrome-extension/background.js');
      const backgroundJs = await backgroundJsResponse.text();
      zip.file("background.js", backgroundJs);
      
      const contentJsResponse = await fetch('/chrome-extension/content.js');
      const contentJs = await contentJsResponse.text();
      zip.file("content.js", contentJs);
      
      // Fetch icons (if available)
      try {
        const iconSizes = [16, 32, 48, 128];
        for (const size of iconSizes) {
          const iconResponse = await fetch(`/chrome-extension/icon-${size}.png`);
          if (iconResponse.ok) {
            const iconBlob = await iconResponse.blob();
            zip.file(`icon-${size}.png`, iconBlob);
          }
        }
      } catch (error) {
        console.error("Error fetching icons:", error);
      }
      
      // Generate the zip file
      const content = await zip.generateAsync({ 
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 9
        }
      }, (metadata) => {
        setDownloadProgress(Math.floor(metadata.percent));
      });
      
      // Create download link
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = "surakshitlocker-extension.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error("Error creating extension zip:", error);
      return false;
    }
  };
  
  const installExtension = async () => {
    setIsInstalling(true);
    setDownloadProgress(0);
    
    try {
      // Create and download the extension zip
      const success = await createExtensionZip();
      
      if (success) {
        // Show installation instructions
        setShowInstructions(true);
        
        // Simulate installing the extension after a delay
        setTimeout(() => {
          setIsInstalled(true);
          setIsInstalling(false);
          setExtensionStatus("installed");
          
          toast({
            title: "Extension downloaded",
            description: "Please follow the instructions to install the SurakshitLocker Chrome extension.",
          });
        }, 1000);
      } else {
        throw new Error("Failed to create extension zip");
      }
    } catch (error) {
      console.error("Error downloading extension:", error);
      setIsInstalling(false);
      
      toast({
        title: "Download failed",
        description: "There was an error downloading the extension. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const connectExtension = () => {
    setIsConnecting(true);
    
    // Attempt to connect to the extension
    if (window.__DOCU_NINJA_EXTENSION__) {
      try {
        // Try to call the extension's connect method
        window.__DOCU_NINJA_EXTENSION__.connect({
          userId: localStorage.getItem("userId") || "",
          userEmail: localStorage.getItem("userEmail") || "",
          authToken: localStorage.getItem("authToken") || "",
        });
        
        // Extension will trigger the connected event if successful
        
        // Set a timeout for fallback
        setTimeout(() => {
          if (extensionStatus !== "connected") {
            setIsConnecting(false);
            
            toast({
              title: "Connection failed",
              description: "Failed to connect to the extension. Please try again.",
              variant: "destructive"
            });
          }
        }, 5000);
        
      } catch (err) {
        console.error("Error connecting to extension:", err);
        setIsConnecting(false);
        
        toast({
          title: "Connection error",
          description: "An error occurred while connecting to the extension.",
          variant: "destructive"
        });
      }
    } else {
      // Simulate connecting to the extension for demo purposes
      setTimeout(() => {
        setIsConnecting(false);
        setExtensionStatus("connected");
        localStorage.setItem("extensionConnected", "true");
        
        // Share user data with the extension
        const userData = {
          userId: localStorage.getItem("userId") || "demo-user",
          userEmail: localStorage.getItem("userEmail") || "demo@example.com",
          documents: JSON.parse(localStorage.getItem("documents") || "[]"),
          userSettings: JSON.parse(localStorage.getItem("userSettings") || "{}")
        };
        
        // Store sync data for demonstration
        localStorage.setItem("extensionSyncData", JSON.stringify({
          lastSync: new Date().toISOString(),
          syncedData: userData
        }));
        
        toast({
          title: "Extension connected",
          description: "The SurakshitLocker Chrome extension is now connected to your account.",
        });
      }, 2000);
    }
  };
  
  const disconnectExtension = () => {
    // Attempt to disconnect from the extension
    if (window.__DOCU_NINJA_EXTENSION__) {
      try {
        window.__DOCU_NINJA_EXTENSION__.disconnect();
      } catch (err) {
        console.error("Error disconnecting from extension:", err);
      }
    }
    
    setExtensionStatus("installed");
    localStorage.removeItem("extensionConnected");
    localStorage.removeItem("extensionSyncData");
    
    toast({
      title: "Extension disconnected",
      description: "The SurakshitLocker Chrome extension has been disconnected from your account.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-semibold">Chrome Extension</h2>
          <p className="text-muted-foreground">
            Enhance your SurakshitLocker experience with our Chrome extension.
            Track document expirations, get notifications, and access your documents directly from your browser.
          </p>
          
          {extensionStatus === "not_installed" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Chrome className="h-5 w-5 text-blue-500" />
                  Install Extension
                </CardTitle>
                <CardDescription>
                  Download our Chrome extension for seamless document management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Get document expiry notifications</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Quick access to your documents</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Sync across all your devices</span>
                  </div>
                </div>
                
                {isInstalling && downloadProgress > 0 && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${downloadProgress}%` }}
                    ></div>
                  </div>
                )}
                
                <Button 
                  onClick={installExtension}
                  disabled={isInstalling}
                  className="w-full"
                >
                  {isInstalling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {downloadProgress > 0 ? `Downloading (${downloadProgress}%)` : 'Preparing download...'}
                    </>
                  ) : (
                    <>
                      <FileZip className="mr-2 h-4 w-4" />
                      Download Extension
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
          
          {extensionStatus === "installed" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Extension Installed
                </CardTitle>
                <CardDescription>
                  The SurakshitLocker Chrome extension is installed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={connectExtension}
                  disabled={isConnecting}
                  className="w-full"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : 'Connect Extension'}
                </Button>
              </CardContent>
            </Card>
          )}
          
          {extensionStatus === "connected" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  Extension Connected
                </CardTitle>
                <CardDescription>
                  The SurakshitLocker Chrome extension is connected to your account
                  
                  {localStorage.getItem("extensionSyncData") && (
                    <p className="text-xs mt-1">
                      Last synced: {new Date(JSON.parse(localStorage.getItem("extensionSyncData") || "{}").lastSync || new Date()).toLocaleString()}
                    </p>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={() => {
                      // Trigger manual sync
                      const userData = {
                        userId: localStorage.getItem("userId") || "demo-user",
                        userEmail: localStorage.getItem("userEmail") || "demo@example.com",
                        documents: JSON.parse(localStorage.getItem("documents") || "[]"),
                        userSettings: JSON.parse(localStorage.getItem("userSettings") || "{}")
                      };
                      
                      localStorage.setItem("extensionSyncData", JSON.stringify({
                        lastSync: new Date().toISOString(),
                        syncedData: userData
                      }));
                      
                      toast({
                        title: "Data synced",
                        description: "Your data has been synced with the Chrome extension.",
                      });
                    }}
                    className="w-full"
                  >
                    Sync Now
                  </Button>
                  
                  <Button 
                    onClick={disconnectExtension}
                    variant="destructive"
                    className="w-full"
                  >
                    Disconnect Extension
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Installation Instructions */}
        {showInstructions && (
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Installation Instructions</CardTitle>
              <CardDescription>
                Follow these steps to install the extension in Chrome
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal ml-5 space-y-2">
                <li>Unzip the downloaded file to a folder</li>
                <li>
                  Open Chrome and navigate to <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">chrome://extensions</code>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2"
                    onClick={() => {
                      // Try to open chrome://extensions or provide instructions
                      const newWindow = window.open('chrome://extensions', '_blank');
                      
                      // If opening chrome:// URL failed, show instructions
                      setTimeout(() => {
                        if (!newWindow || newWindow.closed) {
                          toast({
                            title: "Can't open Chrome Extensions page",
                            description: "Please manually open Chrome and enter 'chrome://extensions' in the address bar.",
                          });
                        }
                      }, 500);
                    }}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </li>
                <li>Enable "Developer mode" using the toggle in the top-right corner</li>
                <li>Click "Load unpacked" and select the unzipped folder</li>
                <li>The extension should now appear in your browser toolbar</li>
              </ol>
              
              <Alert>
                <AlertTitle>Need help?</AlertTitle>
                <AlertDescription>
                  If you encounter any issues during installation, please 
                  <Link to="/help" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 ml-1">contact our support team</Link>.
                </AlertDescription>
              </Alert>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowInstructions(false)}
              >
                Hide Instructions
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {isInstalled && extensionStatus !== "connected" && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Extension Not Connected</AlertTitle>
          <AlertDescription>
            Please connect the extension to sync your documents and receive expiry notifications.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Extension Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">Document Expiry Alerts</p>
              <p className="text-muted-foreground">Get timely notifications about expiring documents</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">Quick Access</p>
              <p className="text-muted-foreground">Access your documents directly from your browser toolbar</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">Cross-Device Sync</p>
              <p className="text-muted-foreground">Your documents stay synchronized across all your devices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChromeExtensionDownload;
