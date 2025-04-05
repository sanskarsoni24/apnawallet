
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import BlurContainer from '@/components/ui/BlurContainer';
import { Download, Check, Chrome, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ChromeExtensionDownload = () => {
  const [downloading, setDownloading] = useState(false);
  const [installed, setInstalled] = useState(false);
  
  // Function to download the Chrome extension ZIP file
  const downloadExtension = () => {
    setDownloading(true);
    
    // Create a ZIP folder with all necessary files
    import('jszip').then((JSZip) => {
      const zip = new JSZip.default();
      
      // Add all the necessary files to the ZIP
      const manifestContent = JSON.stringify({
        "manifest_version": 3,
        "name": "DocuNinja Document Manager",
        "description": "Manage and track your important documents with DocuNinja",
        "version": "1.0",
        "icons": {
          "16": "icon-16.png",
          "32": "icon-32.png",
          "48": "icon-48.png",
          "128": "icon-128.png"
        },
        "action": {
          "default_popup": "popup.html",
          "default_icon": {
            "16": "icon-16.png",
            "32": "icon-32.png", 
            "48": "icon-48.png",
            "128": "icon-128.png"
          }
        },
        "permissions": ["storage", "notifications", "alarms"],
        "host_permissions": [
          "https://*.lovableproject.com/*"
        ],
        "background": {
          "service_worker": "background.js"
        }
      }, null, 2);
      
      // Add manifest.json to the zip
      zip.file("manifest.json", manifestContent);
      
      // Add popup.html to the zip
      fetch('/chrome-extension/popup.html')
        .then(response => response.text())
        .then(content => {
          zip.file("popup.html", content);
          
          // Add popup.js to the zip
          return fetch('/chrome-extension/popup.js');
        })
        .then(response => response.text())
        .then(content => {
          zip.file("popup.js", content);
          
          // Add background.js to the zip
          return fetch('/chrome-extension/background.js');
        })
        .then(response => response.text())
        .then(content => {
          zip.file("background.js", content);
          
          // Add the icons to the zip
          const iconPromises = [16, 32, 48, 128].map(size => {
            return fetch(`/chrome-extension/icon-${size}.png`)
              .then(response => response.blob())
              .then(blob => {
                zip.file(`icon-${size}.png`, blob);
              });
          });
          
          return Promise.all(iconPromises);
        })
        .then(() => {
          // Generate the zip file
          return zip.generateAsync({type: "blob"});
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
    }).catch(error => {
      console.error("Error loading JSZip:", error);
      setDownloading(false);
      toast({
        title: "Download Failed",
        description: "Could not load ZIP generator. Please try again.",
        variant: "destructive"
      });
    });
  };

  return (
    <BlurContainer className="p-6 mb-6 col-span-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">
          <Chrome className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Chrome Extension</h3>
          <p className="text-muted-foreground text-sm">Get document alerts and quick access right in your browser</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between my-6">
        <div className="flex-1">
          <h4 className="font-medium mb-1">DocuNinja Browser Extension</h4>
          <p className="text-sm text-muted-foreground">
            Get notifications, view upcoming deadlines, and access your documents directly from your browser.
          </p>
        </div>
        
        <Button
          onClick={downloadExtension}
          className="gap-2 whitespace-nowrap min-w-[140px] bg-gradient-to-r from-indigo-500 to-blue-500 hover:shadow-md hover:from-indigo-600 hover:to-blue-600"
          disabled={downloading}
          loading={downloading}
        >
          {installed ? (
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
      
      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium flex items-center mb-2">
          <AlertCircle className="h-4 w-4 mr-2 text-indigo-500" />
          Installation Instructions
        </h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground ml-1">
          <li>Download and unzip the extension file</li>
          <li>Open Chrome and navigate to <span className="font-mono bg-background px-1 py-0.5 rounded">chrome://extensions</span></li>
          <li>Enable "Developer mode" in the top-right corner</li>
          <li>Click "Load unpacked" and select the unzipped folder</li>
          <li>The DocuNinja extension icon will appear in your toolbar</li>
        </ol>
      </div>
    </BlurContainer>
  );
};

export default ChromeExtensionDownload;
