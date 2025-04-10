
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, Laptop, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { isElectron } from "@/utils/desktopIntegration";
import { useNavigate } from "react-router-dom";

const DesktopIntegration: React.FC = () => {
  const navigate = useNavigate();
  const isRunningInElectron = isElectron();

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your desktop app will be downloaded shortly."
    });
    
    // In a real implementation, this would trigger the appropriate download
    // based on the user's operating system
    const userAgent = navigator.userAgent.toLowerCase();
    let downloadUrl = "";
    
    if (userAgent.includes("windows")) {
      downloadUrl = "/downloads/surakshit-locker-win.exe";
    } else if (userAgent.includes("mac")) {
      downloadUrl = "/downloads/surakshit-locker-mac.dmg";
    } else if (userAgent.includes("linux")) {
      downloadUrl = "/downloads/surakshit-locker-linux.AppImage";
    } else {
      // Default to Windows if we can't detect
      downloadUrl = "/downloads/surakshit-locker-win.exe";
    }
    
    // Simulate download - in a real app, this would be a real download link
    window.open(downloadUrl, "_blank");
  };

  const goToDesktopPage = () => {
    navigate("/desktop-app");
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Laptop className="h-5 w-5 text-primary" />
          Desktop Application
        </CardTitle>
        <CardDescription>
          Access your documents offline with enhanced security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isRunningInElectron ? (
          <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <Laptop className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle>You're using the desktop app!</AlertTitle>
            <AlertDescription>
              You're currently using the Surakshit Locker desktop application. Enjoy enhanced security and offline access.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Experience enhanced security features and offline access with our desktop application.
              Download for your platform and enjoy biometric authentication, offline document access, and more.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleDownload} className="bg-gradient-to-r from-primary to-primary/80">
                <Download className="mr-2 h-4 w-4" />
                Download Desktop App
              </Button>
              
              <Button variant="outline" onClick={goToDesktopPage}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Learn More
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DesktopIntegration;
