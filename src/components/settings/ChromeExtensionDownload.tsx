import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, Download, Loader2, XCircle } from "lucide-react";

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
    } else {
      setExtensionStatus("installed");
    }
  }, []);
  
  const installExtension = () => {
    setIsInstalling(true);
    
    // Simulate installing the extension
    setTimeout(() => {
      setIsInstalled(true);
      setIsInstalling(false);
      setExtensionStatus("installed");
      
      toast({
        title: "Extension installed",
        description: "The SurakshitLocker Chrome extension has been successfully installed.",
      });
    }, 3000);
  };
  
  const connectExtension = () => {
    setIsConnecting(true);
    
    // Simulate connecting to the extension
    setTimeout(() => {
      setIsConnecting(false);
      setExtensionStatus("connected");
      localStorage.setItem("extensionConnected", "true");
      
      toast({
        title: "Extension connected",
        description: "The SurakshitLocker Chrome extension is now connected to your account.",
      });
    }, 2000);
  };
  
  const disconnectExtension = () => {
    setIsConnecting(false);
    setExtensionStatus("installed");
    localStorage.removeItem("extensionConnected");
    
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
          
          {extensionStatus === "installed" && (
            <Button 
              onClick={connectExtension}
              disabled={isInstalling || isConnecting}
              className="w-full mt-4"
            >
              {isConnecting ? 'Connecting...' : 'Connect Extension'}
            </Button>
          )}
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
            </div>
          </div>
          <Button 
            onClick={disconnectExtension}
            disabled={isConnecting}
            className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white"
          >
            {isConnecting ? 'Disconnecting...' : 'Disconnect Extension'}
          </Button>
        </div>
      )}
      
      {isInstalled && extensionStatus !== "connected" && (
        <div className="rounded-md border p-4 bg-yellow-50 border-yellow-200 text-yellow-800">
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
