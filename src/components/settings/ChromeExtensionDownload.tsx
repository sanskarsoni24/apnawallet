
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import BlurContainer from '@/components/ui/BlurContainer';
import { Download, Check, Chrome, AlertCircle, ExternalLink, RefreshCw, Bell, FileText, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import JSZip from 'jszip';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useUser } from '@/contexts/UserContext';

// Properly define the Chrome extension interface for TypeScript
declare global {
  interface Window {
    chrome?: {
      runtime?: {
        sendMessage?: (extensionId: string, message: any, callback: (response?: any) => void) => void;
      };
    };
  }
}

const ChromeExtensionDownload = () => {
  const { userSettings } = useUser();
  const [downloading, setDownloading] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [chromeDetected, setChromeDetected] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [documentSync, setDocumentSync] = useState(true);
  const [reminderSync, setReminderSync] = useState(true);
  const [extensionStatus, setExtensionStatus] = useState<'not_installed' | 'installed' | 'connected'>('not_installed');
  
  useEffect(() => {
    // Check if using Chrome browser
    const isChrome = navigator.userAgent.indexOf("Chrome") > -1;
    setChromeDetected(isChrome);
    
    // Check if extension is potentially installed
    const hasExtensionDownloaded = localStorage.getItem("surakshitlocker-extension-installed") === "true";
    setInstalled(hasExtensionDownloaded);
    
    if (hasExtensionDownloaded) {
      setExtensionStatus('installed');
      
      // Simulate extension connecting after a delay
      setTimeout(() => {
        setExtensionStatus('connected');
        toast({
          title: "Extension Connected",
          description: "Chrome extension is now syncing with your account"
        });
      }, 3000);
    }
    
    // Check for Chrome extension API
    if (typeof window !== 'undefined' && window.chrome && window.chrome.runtime) {
      try {
        // We can try to detect if our extension is installed
        const extensionId = "our-extension-id"; 
        if (window.chrome.runtime.sendMessage) {
          window.chrome.runtime.sendMessage(extensionId, { action: 'ping' }, function(response) {
            if (response && response.action === 'pong') {
              setInstalled(true);
              localStorage.setItem("surakshitlocker-extension-installed", "true");
            }
          });
        }
      } catch (e) {
        // Extension not installed or error checking
        console.log("Error checking extension:", e);
      }
    }
  }, []);
  
  // Function to download the Chrome extension ZIP file
  const downloadExtension = () => {
    setDownloading(true);
    
    // Create a ZIP folder with all necessary files
    const zip = new JSZip();
      
    // Fetch all required files in parallel
    Promise.all([
      fetch('/chrome-extension/manifest.json').then(res => res.json()),
      fetch('/chrome-extension/popup.html').then(res => res.text()),
      fetch('/chrome-extension/popup.js').then(res => res.text()),
      fetch('/chrome-extension/background.js').then(res => res.text()),
      fetch('/chrome-extension/content.js').then(res => res.text())
    ])
    .then(([manifest, popupHtml, popupJs, backgroundJs, contentJs]) => {
      // Add files to zip
      zip.file("manifest.json", JSON.stringify(manifest, null, 2));
      zip.file("popup.html", popupHtml);
      zip.file("popup.js", popupJs);
      zip.file("background.js", backgroundJs);
      zip.file("content.js", contentJs);
      
      // Add the icons to the zip
      return Promise.all([16, 32, 48, 128].map(size => {
        return fetch(`/chrome-extension/icon-${size}.png`)
          .then(response => response.blob())
          .then(blob => {
            zip.file(`icon-${size}.png`, blob);
          });
      })).then(() => {
        // Generate the zip file
        return zip.generateAsync({type: "blob"});
      });
    })
    .then(content => {
      // Create a download link
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = "docuninja-chrome-extension.zip";
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      // Show success message
      setDownloading(false);
      setInstalled(true);
      setExtensionStatus('installed');
      
      // Store in localStorage that we've downloaded the extension
      window.localStorage.setItem("surakshitlocker-extension-installed", "true");
      
      toast({
        title: "Chrome Extension Downloaded",
        description: "Follow the instructions below to install the extension."
      });
      
      // Simulate extension connecting after a delay
      setTimeout(() => {
        setExtensionStatus('connected');
        toast({
          title: "Extension Connected",
          description: "Chrome extension is now syncing with your account"
        });
      }, 5000);
    })
    .catch(error => {
      console.error("Error generating extension ZIP:", error);
      setDownloading(false);
      toast({
        title: "Download Failed",
        description: "Could not download extension. Please try again.",
        variant: "destructive"
      });
    });
  };

  return (
    <BlurContainer className="p-8 mb-6 col-span-2 dark:bg-slate-800/70 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900/80 dark:to-slate-800/80">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-400/20">
          <Chrome className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Browser Extension</h3>
          <p className="text-muted-foreground text-sm dark:text-slate-300">Get document alerts and quick access right in your browser</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between my-6 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm">
        <div className="flex-1">
          <h4 className="font-medium mb-1.5 text-lg dark:text-white">DocuNinja Browser Extension</h4>
          <p className="text-sm text-muted-foreground dark:text-slate-300 max-w-md">
            Get notifications, view upcoming deadlines, and access your documents directly from your browser.
          </p>
          
          {extensionStatus === 'connected' && (
            <div className="mt-3 flex items-center text-sm text-green-600 dark:text-green-400">
              <Check className="h-4 w-4 mr-1.5" /> Extension connected and syncing
            </div>
          )}
          
          {extensionStatus === 'installed' && extensionStatus !== 'connected' && (
            <div className="mt-3 flex items-center text-sm text-amber-600 dark:text-amber-400">
              <Clock className="h-4 w-4 mr-1.5" /> Extension installed, waiting for connection...
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          {installed && (
            <Button
              variant="outline"
              onClick={downloadExtension}
              className="gap-2 whitespace-nowrap border-slate-200 dark:border-slate-700"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Re-download</span>
            </Button>
          )}
          
          <Button
            onClick={downloadExtension}
            className="gap-2 whitespace-nowrap min-w-[140px] bg-gradient-to-r from-blue-500 to-indigo-500 hover:shadow-md hover:from-blue-600 hover:to-indigo-600"
            disabled={downloading}
          >
            {downloading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                <span>Downloading...</span>
              </>
            ) : installed ? (
              <>
                <Download className="h-4 w-4" />
                <span>Download Again</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download</span>
              </>
            )}
          </Button>
        </div>
      </div>
      
      {extensionStatus === 'connected' && (
        <div className="mb-8">
          <Card className="border border-green-100 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 border-green-200 dark:border-green-800">
                  Connected
                </Badge>
                <p className="text-sm text-green-700 dark:text-green-400">Extension is active and syncing with DocuNinja</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                    <Label htmlFor="notifications" className="cursor-pointer">
                      Browser Notifications
                    </Label>
                  </div>
                  <Switch 
                    id="notifications" 
                    checked={notifications} 
                    onCheckedChange={setNotifications} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                    <Label htmlFor="document-sync" className="cursor-pointer">
                      Document Sync
                    </Label>
                  </div>
                  <Switch 
                    id="document-sync" 
                    checked={documentSync} 
                    onCheckedChange={setDocumentSync} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                    <Label htmlFor="reminder-sync" className="cursor-pointer">
                      Reminder Sync
                    </Label>
                  </div>
                  <Switch 
                    id="reminder-sync" 
                    checked={reminderSync} 
                    onCheckedChange={setReminderSync} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Button 
            variant="link" 
            onClick={() => setShowDemo(!showDemo)} 
            className="mt-2 p-0 h-auto text-blue-600 dark:text-blue-400"
          >
            {showDemo ? "Hide Demo Notifications" : "Show Demo Notifications"}
          </Button>
          
          {showDemo && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div className="bg-white dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Passport expires soon</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Your passport will expire in 30 days</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">2 minutes ago</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New document shared</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Tax Return 2022 was shared with you</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">10 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="bg-slate-50 dark:bg-slate-800/70 p-6 rounded-xl dark:border dark:border-slate-700 shadow-sm">
        <h4 className="font-medium flex items-center mb-4 dark:text-white">
          <AlertCircle className="h-4 w-4 mr-2 text-indigo-500" />
          Installation Instructions
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <div className="flex justify-center items-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-3 font-medium">1</div>
            <h5 className="font-medium mb-2 dark:text-white">Download & Extract</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400">Download the extension zip file and extract it to a folder on your computer</p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <div className="flex justify-center items-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-3 font-medium">2</div>
            <h5 className="font-medium mb-2 dark:text-white">Open Extensions Page</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400">Navigate to <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-xs">chrome://extensions</span> and enable "Developer mode"</p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <div className="flex justify-center items-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-3 font-medium">3</div>
            <h5 className="font-medium mb-2 dark:text-white">Load Extension</h5>
            <p className="text-sm text-slate-600 dark:text-slate-400">Click "Load unpacked" and select the extracted folder to install</p>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <h4 className="font-medium mb-3 dark:text-white flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
            Troubleshooting
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground dark:text-slate-300 ml-1">
              <li>Make sure all extension files were extracted properly</li>
              <li>If you don't see notifications, check your browser notification permissions</li>
              <li>For security reasons, you may need to reload your DocuNinja web app after installing</li>
            </ul>
            
            <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground dark:text-slate-300 ml-1">
              <li>The extension needs access to save document data locally</li>
              <li>If sync isn't working, try logging out and back into the web app</li>
              <li>Ensure you're using a supported browser (Chrome or Chrome-based)</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="link" 
            className="text-blue-600 dark:text-blue-400 p-0 h-auto flex items-center gap-1 hover:text-blue-700 dark:hover:text-blue-300"
            onClick={() => window.open('https://developer.chrome.com/docs/extensions/develop', '_blank')}
          >
            <span>Chrome Extensions Guide</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </BlurContainer>
  );
};

export default ChromeExtensionDownload;
