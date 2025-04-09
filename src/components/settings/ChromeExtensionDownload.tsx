import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const ChromeExtensionDownload = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = () => {
    // Check if the user is using Chrome
    const isChrome = navigator.userAgent.indexOf("Chrome") > -1;
    
    if (!isChrome) {
      setError("This extension is only available for Google Chrome.");
      return;
    }
    
    // Simulate download
    setDownloading(true);
    
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      
      toast({
        title: "Extension downloaded",
        description: "The Chrome extension has been downloaded successfully.",
      });
    }, 1500);
  };

  return (
    <div>
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}
      
      {!downloaded ? (
        <Button 
          onClick={handleDownload} 
          disabled={downloading}
        >
          {downloading ? "Downloading..." : "Download Chrome Extension"}
        </Button>
      ) : (
        <div className="text-green-500">
          Extension downloaded! Check your downloads folder.
        </div>
      )}
    </div>
  );
};

export default ChromeExtensionDownload;
