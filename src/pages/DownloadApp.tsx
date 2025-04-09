
import React, { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, ArrowLeft, Info, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import BlurContainer from "@/components/ui/BlurContainer";
import SurakshitLogo from "@/components/ui/SurakshitLogo";
import { toast } from "@/hooks/use-toast";

const DownloadApp = () => {
  const [platform, setPlatform] = useState<"android" | "ios" | "unknown">("unknown");
  const [downloading, setDownloading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  useEffect(() => {
    // Detect the user's platform
    const userAgent = navigator.userAgent || navigator.vendor;
    
    if (/android/i.test(userAgent)) {
      setPlatform("android");
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      setPlatform("ios");
    } else {
      setPlatform("unknown");
    }

    // Set the direct download URL
    const origin = window.location.origin;
    setDownloadUrl(`${origin}/downloads/surakshitlocker.apk`);
    
    console.log("Download URL set to:", `${origin}/downloads/surakshitlocker.apk`);
  }, []);

  const handleDownload = () => {
    setDownloading(true);
    console.log("Starting download from URL:", downloadUrl);
    
    try {
      if (platform === "android") {
        // Create a blob URL for the APK to ensure proper MIME type
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'surakshitlocker.apk';
        link.setAttribute('type', 'application/vnd.android.package-archive');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Download Started",
          description: "The APK file is downloading. Check your downloads folder to install."
        });
        
        // Secondary download method for mobile browsers
        setTimeout(() => {
          window.location.href = downloadUrl;
        }, 500);
      } else if (platform === "ios") {
        // For iOS, redirect to TestFlight (placeholder URL)
        window.location.href = "https://testflight.apple.com/join/surakshitlocker";
        
        toast({
          title: "Redirecting to iOS Download",
          description: "You'll be redirected to download the app via TestFlight."
        });
      }
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "There was a problem downloading the app. Try the direct links below.",
        variant: "destructive"
      });
    } finally {
      setDownloading(false);
    }
  };

  const renderDownloadButton = () => {
    if (platform === "unknown") {
      return (
        <div className="text-center p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-amber-800 dark:text-amber-400">
            Desktop Device Detected
          </h3>
          <p className="text-amber-700 dark:text-amber-300 mb-4">
            Please visit this page from a mobile device or scan the QR code from the Mobile App page.
          </p>
          <Button
            variant="outline"
            className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      );
    }

    return (
      <div className="text-center">
        <Button 
          size="lg" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-7 h-auto text-lg font-semibold"
          onClick={handleDownload}
          disabled={downloading}
        >
          <Download className="mr-2 h-5 w-5" />
          {downloading ? "Starting Download..." : `Download for ${platform === "android" ? "Android" : "iOS"}`}
        </Button>
        
        {platform === "android" && (
          <>
            <p className="text-sm text-muted-foreground mt-4">
              This will download the SurakshitLocker APK directly to your device.
            </p>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
              <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">Installation Instructions:</h4>
              <ol className="text-sm text-blue-700 dark:text-blue-300 list-decimal pl-5">
                <li>After downloading, tap on the file in your downloads folder</li>
                <li>If prompted, allow installation from unknown sources</li>
                <li>Follow the installation prompts</li>
                <li>Once installed, open SurakshitLocker from your app drawer</li>
              </ol>
            </div>
            
            <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-6">
              <h4 className="font-medium mb-4">Direct Download Links:</h4>
              <div className="flex flex-col gap-4">
                <a 
                  href={downloadUrl}
                  download="surakshitlocker.apk"
                  className="bg-indigo-600 text-white rounded-md px-4 py-3 inline-flex items-center justify-center gap-2 hover:bg-indigo-700"
                  onClick={() => {
                    toast({
                      title: "Download Started",
                      description: "The APK file is downloading. Check your downloads folder to install."
                    });
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download APK File
                </a>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-amber-700 dark:text-amber-300 mb-1">Download Troubleshooting</h5>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mb-2">
                        If the download doesn't start automatically:
                      </p>
                      <ol className="text-xs text-amber-600 dark:text-amber-400 list-decimal pl-4 space-y-1">
                        <li>Try opening this page in Chrome or your default browser</li>
                        <li>Long-press the Download APK button and select "Download link" or "Save link"</li>
                        <li>Check your Downloads folder after download completes</li>
                        <li>Make sure you have enough storage space available</li>
                      </ol>
                    </div>
                  </div>
                </div>
                
                <a 
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-md px-4 py-3 inline-flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in Browser
                </a>
              </div>
            </div>
          </>
        )}
        
        {platform === "ios" && (
          <p className="text-sm text-muted-foreground mt-4">
            This will redirect you to TestFlight to download the app.
          </p>
        )}
      </div>
    );
  };

  return (
    <Container>
      <div className="max-w-xl mx-auto py-12">
        <BlurContainer 
          variant="elevated" 
          className="p-8 flex flex-col items-center text-center"
        >
          <SurakshitLogo size="lg" className="mb-4" />
          <h1 className="text-3xl font-bold mb-2">SurakshitLocker Mobile App</h1>
          <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center my-6">
            <Smartphone className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-lg mb-8 text-muted-foreground">
            Your secure document vault, now available on your mobile device.
          </p>
          
          {renderDownloadButton()}
          
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 w-full">
            <Link 
              to="/mobile-app" 
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Mobile App Page
            </Link>
          </div>
        </BlurContainer>
      </div>
    </Container>
  );
};

export default DownloadApp;
