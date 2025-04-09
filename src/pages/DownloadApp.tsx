
import React, { useEffect, useState } from "react";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import BlurContainer from "@/components/ui/BlurContainer";
import SurakshitLogo from "@/components/ui/SurakshitLogo";

const DownloadApp = () => {
  const [platform, setPlatform] = useState<"android" | "ios" | "unknown">("unknown");
  const [appLink, setAppLink] = useState("");

  useEffect(() => {
    // Detect the user's platform
    const userAgent = navigator.userAgent || navigator.vendor;
    
    if (/android/i.test(userAgent)) {
      setPlatform("android");
      // This would be the actual link to your Android APK file once uploaded
      setAppLink("/downloads/surakshitlocker.apk");
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      setPlatform("ios");
      // This would be the actual link to your iOS app store or TestFlight
      setAppLink("https://testflight.apple.com/join/surakshitlocker");
    } else {
      setPlatform("unknown");
    }
  }, []);

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
          onClick={() => window.location.href = appLink}
        >
          <Download className="mr-2 h-5 w-5" />
          Download for {platform === "android" ? "Android" : "iOS"}
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          This will download the SurakshitLocker app to your device.
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
