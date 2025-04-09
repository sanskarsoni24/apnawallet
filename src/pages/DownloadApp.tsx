
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Check, CheckCircle, Download, FileDown, Smartphone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DownloadApp = () => {
  const navigate = useNavigate();
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  
  // Check if already downloaded
  useEffect(() => {
    const alreadyDownloaded = localStorage.getItem("app-downloaded") === "true";
    if (alreadyDownloaded) {
      setIsDownloaded(true);
      setDownloadProgress(100);
    }
  }, []);
  
  const handleDownload = () => {
    setIsDownloading(true);
    setDownloadError(false);
    setDownloadProgress(0);
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 15);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          setIsDownloaded(true);
          localStorage.setItem("app-downloaded", "true");
          
          // Trigger the actual file download
          const link = document.createElement('a');
          link.href = '/downloads/surakshitlocker.apk';
          link.download = 'surakshitlocker.apk';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast({
            title: "Download complete",
            description: "The app has been downloaded successfully"
          });
          
          return 100;
        }
        
        return newProgress;
      });
    }, 400);
    
    // For demo purposes, we'll simulate a 50% chance of error
    const shouldError = false; // Set to false for demo readiness
    
    if (shouldError) {
      setTimeout(() => {
        clearInterval(interval);
        setIsDownloading(false);
        setDownloadError(true);
        setDownloadProgress(32); // Stuck progress
        
        toast({
          title: "Download failed",
          description: "There was an error downloading the app. Please try again.",
          variant: "destructive"
        });
      }, 3000);
    }
  };
  
  const handleOpenApp = () => {
    // In a real app, this might use deep linking to open the installed app
    toast({
      title: "Opening app",
      description: "If the app is installed, it would open now"
    });
    
    // For demo purposes, we'll navigate to the mobile app page
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };
  
  const getDownloadStatusText = () => {
    if (isDownloading) return "Downloading...";
    if (isDownloaded) return "Downloaded";
    if (downloadError) return "Download failed";
    return "Ready to download";
  };
  
  return (
    <Container className="max-w-2xl py-10">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/mobile-app")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to App Page
      </Button>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Download SurakshitLocker</h1>
        <p className="text-muted-foreground">
          Get our secure document management app for your device
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            SurakshitLocker Mobile App
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <img
                src="/android-chrome-192x192.png"
                alt="App icon"
                className="w-12 h-12"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-lg">SurakshitLocker</h3>
              <p className="text-sm text-muted-foreground">Version 1.0.3</p>
              <div className="flex items-center mt-1 text-sm">
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  Verified Publisher
                </span>
                <span className="mx-2">•</span>
                <span>15MB</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{getDownloadStatusText()}</span>
              <span>{downloadProgress}%</span>
            </div>
            <Progress value={downloadProgress} className="h-2" />
          </div>
          
          {downloadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Download Failed</AlertTitle>
              <AlertDescription>
                There was an error downloading the app. Please check your connection and try again.
              </AlertDescription>
            </Alert>
          )}
          
          {isDownloaded && !downloadError && (
            <Alert className="bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-800 dark:text-green-400">Download Complete</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300">
                The app has been downloaded successfully. Please follow the installation instructions below.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex gap-3">
          {!isDownloaded ? (
            <Button 
              className="flex-1" 
              onClick={handleDownload} 
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Now
                </>
              )}
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleDownload}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Download Again
              </Button>
              <Button 
                className="flex-1"
                onClick={handleOpenApp}
              >
                <Smartphone className="mr-2 h-4 w-4" />
                Open App
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
      
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">Installation Instructions</h2>
        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
          <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Android Instructions</h3>
          <ol className="text-blue-700 dark:text-blue-400 text-sm space-y-2 list-decimal list-inside">
            <li>After downloading, open the APK file</li>
            <li>If prompted, allow installation from unknown sources</li>
            <li>Follow the on-screen instructions to complete installation</li>
            <li>Once installed, open the app and sign in with your account</li>
          </ol>
        </div>
      </div>
      
      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          Need help with installation? Contact our support team.
        </p>
        <Button variant="outline" onClick={() => navigate("/help")}>
          Get Help With Installation
        </Button>
      </div>
    </Container>
  );
};

export default DownloadApp;
