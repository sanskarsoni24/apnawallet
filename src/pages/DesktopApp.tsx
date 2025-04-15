
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Download, CheckCircle, Monitor, Shield, Zap, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Container from "@/components/layout/Container";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import BlurContainer from "@/components/ui/BlurContainer";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DesktopApp = () => {
  const navigate = useNavigate();
  const { userSettings, updateUserSettings } = useUserSettings();
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [os, setOs] = useState<"windows" | "mac" | "linux" | "unknown">("unknown");
  
  useEffect(() => {
    // Detect operating system
    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf("Windows") !== -1) setOs("windows");
    else if (userAgent.indexOf("Mac") !== -1) setOs("mac");
    else if (userAgent.indexOf("Linux") !== -1) setOs("linux");
  }, []);
  
  const getDownloadUrl = () => {
    switch (os) {
      case "windows": return "/downloads/ApnaWallet-Setup-1.0.0.exe";
      case "mac": return "/downloads/ApnaWallet-1.0.0.dmg";
      case "linux": return "/downloads/ApnaWallet-1.0.0.AppImage";
      default: return "#";
    }
  };
  
  const getOsName = () => {
    switch (os) {
      case "windows": return "Windows";
      case "mac": return "macOS";
      case "linux": return "Linux";
      default: return "your computer";
    }
  };
  
  const handleDownload = () => {
    // Track download in user settings
    updateUserSettings({
      desktopAppInstalled: true,
      desktopAppVersion: "1.0.0",
      desktopAppLastSync: new Date().toISOString()
    });
    
    setDownloadStarted(true);
    
    // Simulate download - in a real app, this would be a real download
    const link = document.createElement('a');
    link.href = getDownloadUrl();
    link.download = `ApnaWallet-Setup-${os}.exe`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Container>
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4">ApnaWallet Desktop</h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Experience the power and security of ApnaWallet on your desktop with our native application.
          </p>
        </div>
        
        {downloadStarted && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <AlertTitle>Download Started</AlertTitle>
            <AlertDescription>
              Your download has started. If it doesn't begin automatically, <a href={getDownloadUrl()} className="underline font-medium">click here</a> to download manually.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <BlurContainer className="p-6 md:p-8 backdrop-blur-lg" variant="elevated">
            <div className="flex flex-col items-center">
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 mb-6 w-full">
                <AspectRatio ratio={16/9}>
                  <img 
                    src="https://via.placeholder.com/800x450?text=ApnaWallet+Desktop" 
                    alt="ApnaWallet Desktop Screenshot" 
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              </div>
              
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Download for {getOsName()}</h2>
                <p className="text-muted-foreground mb-4">Version 1.0.0 • Released April 15, 2025</p>
                
                <div className="flex justify-center gap-2 mb-4">
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                    Latest Version
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                    Free
                  </Badge>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="w-full mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-5 w-5" />
                Download for {getOsName()}
              </Button>
              
              <div className="text-sm text-muted-foreground">
                By downloading, you agree to our <a href="#" className="underline hover:text-foreground">Terms of Service</a> and <a href="#" className="underline hover:text-foreground">Privacy Policy</a>
              </div>
            </div>
          </BlurContainer>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Why ApnaWallet Desktop?</CardTitle>
                <CardDescription>Enhance your document management experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Faster Performance</h4>
                    <p className="text-sm text-muted-foreground">Native application optimized for your operating system</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Monitor className="h-5 w-5 text-indigo-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Offline Access</h4>
                    <p className="text-sm text-muted-foreground">Access your documents even without internet connection</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-emerald-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Enhanced Security</h4>
                    <p className="text-sm text-muted-foreground">Local encryption and biometric authentication options</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <RefreshCw className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Automatic Syncing</h4>
                    <p className="text-sm text-muted-foreground">Keep your documents in sync across all your devices</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>System Requirements</CardTitle>
                <CardDescription>Minimum specifications needed for optimal experience</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={os !== "unknown" ? os : "windows"} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="windows">Windows</TabsTrigger>
                    <TabsTrigger value="mac">macOS</TabsTrigger>
                    <TabsTrigger value="linux">Linux</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="windows" className="space-y-2">
                    <p>• Windows 10 64-bit or later</p>
                    <p>• 4GB RAM (8GB recommended)</p>
                    <p>• 500MB free disk space</p>
                    <p>• Intel Core i3 or equivalent</p>
                  </TabsContent>
                  
                  <TabsContent value="mac" className="space-y-2">
                    <p>• macOS 11.0 (Big Sur) or later</p>
                    <p>• 4GB RAM (8GB recommended)</p>
                    <p>• 500MB free disk space</p>
                    <p>• Intel or Apple Silicon processor</p>
                  </TabsContent>
                  
                  <TabsContent value="linux" className="space-y-2">
                    <p>• Ubuntu 20.04, Fedora 34, or compatible</p>
                    <p>• 4GB RAM (8GB recommended)</p>
                    <p>• 500MB free disk space</p>
                    <p>• x86_64 processor</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4 mr-2" /> Performance may vary depending on your system specifications
              </CardFooter>
            </Card>
          </div>
        </div>
        
        <BlurContainer 
          className="p-8 backdrop-blur-md mb-12" 
          variant="subtle"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Is the desktop app free?</h3>
              <p className="text-muted-foreground">Yes, the ApnaWallet desktop application is free to download and use with your existing account.</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">How do I sync my documents?</h3>
              <p className="text-muted-foreground">Syncing happens automatically when you're connected to the internet, but you can also trigger manual syncs.</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Can I use the app offline?</h3>
              <p className="text-muted-foreground">Yes, you can access previously synced documents without an internet connection.</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">How secure is my data?</h3>
              <p className="text-muted-foreground">We use AES-256 encryption for all stored data, and the encryption keys never leave your device.</p>
            </div>
          </div>
        </BlurContainer>
        
        <div className="flex flex-col items-center text-center mb-12">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default DesktopApp;
