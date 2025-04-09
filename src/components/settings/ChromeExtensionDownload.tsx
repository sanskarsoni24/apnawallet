
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, Download, Loader2, XCircle } from "lucide-react";

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
  
  const installExtension = () => {
    setIsInstalling(true);
    
    // Create a download link for the extension package
    const link = document.createElement('a');
    link.href = '/chrome-extension.zip';
    link.download = 'surakshitlocker-extension.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Open the Chrome extensions page with instructions
    window.open('chrome://extensions', '_blank');
    
    // Simulate installing the extension
    setTimeout(() => {
      setIsInstalled(true);
      setIsInstalling(false);
      setExtensionStatus("installed");
      
      toast({
        title: "Extension downloaded",
        description: "Please follow the instructions to install the SurakshitLocker Chrome extension.",
      });
    }, 3000);
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
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Chrome Extension</h2>
      <p className="text-muted-foreground">
        Enhance your SurakshitLocker experience with our Chrome extension.
      </p>
      
      {extensionStatus === "not_installed" && (
        <div className="rounded-md border p-4">
          <div className="flex items-center gap-4">
            <Download className="h-5 w-5 text-blue-500" />
            <div>
              <h3 className="font-medium">Install the Chrome Extension</h3>
              <p className="text-sm text-muted-foreground">
                Download our Chrome extension for seamless document management.
              </p>
            </div>
          </div>
          <Button 
            onClick={installExtension}
            disabled={isInstalling}
            className="w-full mt-4"
          >
            {isInstalling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Installing...
              </>
            ) : (
              'Download & Install'
            )}
          </Button>
        </div>
      )}
      
      {extensionStatus === "installed" && (
        <div className="rounded-md border p-4">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div>
              <h3 className="font-medium">Extension Installed</h3>
              <p className="text-sm text-muted-foreground">
                The SurakshitLocker Chrome extension is installed.
              </p>
            </div>
          </div>
          
          <Button 
            onClick={connectExtension}
            disabled={isInstalling || isConnecting}
            className="w-full mt-4"
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : 'Connect Extension'}
          </Button>
        </div>
      )}
      
      {extensionStatus === "connected" && (
        <div className="rounded-md border p-4">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <div>
              <h3 className="font-medium">Extension Connected</h3>
              <p className="text-sm text-muted-foreground">
                The SurakshitLocker Chrome extension is connected to your account.
              </p>
              
              {localStorage.getItem("extensionSyncData") && (
                <p className="text-xs text-muted-foreground mt-1">
                  Last synced: {new Date(JSON.parse(localStorage.getItem("extensionSyncData") || "{}").lastSync || new Date()).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
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
              className="flex-1"
            >
              Sync Now
            </Button>
            <Button 
              onClick={disconnectExtension}
              disabled={isConnecting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Disconnect
            </Button>
          </div>
        </div>
      )}
      
      {isInstalled && extensionStatus !== "connected" && (
        <div className="rounded-md border p-4 bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200">
          <div className="flex items-center gap-4">
            <XCircle className="h-5 w-5" />
            <div>
              <h3 className="font-medium">Extension Not Connected</h3>
              <p className="text-sm">
                Please connect the extension to sync your documents.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChromeExtensionDownload;
