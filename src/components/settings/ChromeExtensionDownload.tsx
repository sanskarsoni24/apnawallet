
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import BlurContainer from '@/components/ui/BlurContainer';
import { Download, Check, Chrome, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import JSZip from 'jszip';

const ChromeExtensionDownload = () => {
  const [downloading, setDownloading] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [chromeDetected, setChromeDetected] = useState(false);
  
  useEffect(() => {
    // Check if using Chrome browser
    const isChrome = navigator.userAgent.indexOf("Chrome") > -1;
    setChromeDetected(isChrome);
    
    // Check if extension is potentially installed
    const hasExtensionDownloaded = localStorage.getItem("docuninja-extension-installed") === "true";
    setInstalled(hasExtensionDownloaded);
    
    // Check for Chrome extension API
    if (typeof window !== 'undefined' && window.chrome && 'runtime' in window.chrome) {
      try {
        // We can try to detect if our extension is installed
        const extensionId = "our-extension-id"; 
        // Using type assertion to handle Chrome API
        (window.chrome as any).runtime.sendMessage(extensionId, { action: 'ping' }, function(response: any) {
          if (response && response.action === 'pong') {
            setInstalled(true);
            localStorage.setItem("docuninja-extension-installed", "true");
          }
        });
      } catch (e) {
        // Extension not installed or error checking
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
      
      // Store in localStorage that we've downloaded the extension
      window.localStorage.setItem("docuninja-extension-installed", "true");
      
      toast({
        title: "Chrome Extension Downloaded",
        description: "Follow the instructions below to install the extension."
      });
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
    <BlurContainer className="p-6 mb-6 col-span-2 dark:bg-slate-800/70 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">
          <Chrome className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-lg font-semibold dark:text-white">Chrome Extension</h3>
          <p className="text-muted-foreground text-sm dark:text-slate-300">Get document alerts and quick access right in your browser</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between my-6">
        <div className="flex-1">
          <h4 className="font-medium mb-1 dark:text-white">DocuNinja Browser Extension</h4>
          <p className="text-sm text-muted-foreground dark:text-slate-300">
            Get notifications, view upcoming deadlines, and access your documents directly from your browser.
          </p>
        </div>
        
        <Button
          onClick={downloadExtension}
          className="gap-2 whitespace-nowrap min-w-[140px] bg-gradient-to-r from-indigo-500 to-blue-500 hover:shadow-md hover:from-indigo-600 hover:to-blue-600"
          disabled={downloading}
        >
          {downloading ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              <span>Downloading...</span>
            </>
          ) : installed ? (
            <>
              <Check className="h-4 w-4" />
              <span>Downloaded</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Download</span>
            </>
          )}
        </Button>
      </div>
      
      <div className="bg-muted/50 p-4 rounded-lg dark:bg-slate-900/70 dark:border dark:border-slate-700">
        <h4 className="font-medium flex items-center mb-2 dark:text-white">
          <AlertCircle className="h-4 w-4 mr-2 text-indigo-500" />
          Installation Instructions
        </h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground dark:text-slate-300 ml-1">
          <li>Download and unzip the extension file</li>
          <li>Open Chrome and navigate to <span className="font-mono bg-background dark:bg-slate-800 px-1 py-0.5 rounded">chrome://extensions</span></li>
          <li>Enable "Developer mode" in the top-right corner</li>
          <li>Click "Load unpacked" and select the unzipped folder</li>
          <li>The DocuNinja extension icon will appear in your toolbar</li>
        </ol>
        
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <h4 className="font-medium mb-2 dark:text-white">Troubleshooting</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground dark:text-slate-300 ml-1">
            <li>Make sure all extension files were extracted properly</li>
            <li>If you don't see notifications, check your browser notification permissions</li>
            <li>For security reasons, you may need to reload your DocuNinja web app after installing</li>
          </ul>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="link" 
            className="text-indigo-600 dark:text-indigo-400 p-0 h-auto flex items-center gap-1 hover:text-indigo-700 dark:hover:text-indigo-300"
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
