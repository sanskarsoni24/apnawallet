
import React, { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import BlurContainer from "@/components/ui/BlurContainer";
import SurakshitLogo from "@/components/ui/SurakshitLogo";
import { toast } from "@/hooks/use-toast";

const DownloadApp = () => {
  const [platform, setPlatform] = useState<"android" | "ios" | "unknown">("unknown");
  const [appLink, setAppLink] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Detect the user's platform
    const userAgent = navigator.userAgent || navigator.vendor;
    
    if (/android/i.test(userAgent)) {
      setPlatform("android");
      setAppLink("/downloads/surakshitlocker.apk");
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      setPlatform("ios");
      setAppLink("https://testflight.apple.com/join/surakshitlocker");
    } else {
      setPlatform("unknown");
    }
  }, []);

  const handleDownload = () => {
    setDownloading(true);
    
    if (platform === "android") {
      try {
        // For direct file download (better approach for binary files)
        fetch(appLink)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.blob();
          })
          .then(blob => {
            // Create a temporary URL for the blob
            const url = window.URL.createObjectURL(
              new Blob([blob], { type: 'application/vnd.android.package-archive' })
            );
            
            // Create a link element and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = "surakshitlocker.apk";
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            setTimeout(() => {
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            }, 100);
            
            toast({
              title: "Download Started",
              description: "The APK file is downloading to your device."
            });
          })
          .catch(error => {
            console.error("Download failed:", error);
            toast({
              title: "Download Failed",
              description: "There was an error downloading the APK. Please try again.",
              variant: "destructive"
            });
          })
          .finally(() => {
            setDownloading(false);
          });
      } catch (error) {
        console.error("Download error:", error);
        toast({
          title: "Download Error",
          description: "There was an error preparing the download. Please try again.",
          variant: "destructive"
        });
        setDownloading(false);
      }
    } else if (platform === "ios") {
      // For iOS, we redirect to the TestFlight or App Store link
      window.location.href = appLink;
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
            Please scan the QR code using a mobile device to download the app.
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
        <p className="text-sm text-muted-foreground mt-4">
          {platform === "android" 
            ? "This will download the SurakshitLocker APK to your device."
            : "This will redirect you to TestFlight to download the app."}
        </p>
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
              to="/" 
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Dashboard
            </Link>
          </div>
        </BlurContainer>
      </div>
    </Container>
  );
};

export default DownloadApp;
