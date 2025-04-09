
import React, { useState, useEffect } from "react";
import Container from "@/components/layout/Container";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Download, Smartphone, Info } from "lucide-react";
import BlurContainer from "@/components/ui/BlurContainer";
import { toast } from "@/hooks/use-toast";
import SurakshitLogo from "@/components/ui/SurakshitLogo";
import { Link } from "react-router-dom";

const MobileApp = () => {
  const [directApkLink, setDirectApkLink] = useState("");
  const [activeTab, setActiveTab] = useState<"android" | "ios">("android");
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  useEffect(() => {
    // Get current domain for QR code
    const domain = window.location.origin;
    const apkLink = `${domain}/downloads/surakshitlocker.apk`;
    setDirectApkLink(apkLink);
    
    console.log("Direct APK link:", apkLink);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directApkLink);
    toast({
      title: "Link copied",
      description: "Direct APK download link copied to clipboard"
    });
  };

  const handleDirectDownload = () => {
    if (isMobile) {
      // On mobile, directly go to the APK
      window.location.href = directApkLink;
      toast({
        title: "Download Started",
        description: "The app is downloading now. Check your notifications."
      });
    } else {
      // On desktop, copy the link
      navigator.clipboard.writeText(directApkLink);
      toast({
        title: "Link copied",
        description: "Direct APK link copied to clipboard. Share this with your mobile device."
      });
    }
  };

  const detectOS = () => {
    const userAgent = navigator.userAgent || navigator.vendor;
    
    if (/android/i.test(userAgent)) {
      return "android";
    }
    
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return "ios";
    }
    
    return "android"; // Default
  };

  useEffect(() => {
    setActiveTab(detectOS());
  }, []);

  return (
    <Container>
      <div className="max-w-4xl mx-auto">
        <BlurContainer variant="elevated" className="p-8 mb-8">
          <div className="flex flex-col items-center text-center mb-8">
            <SurakshitLogo size="lg" className="mb-4" />
            <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-4">
              <Smartphone className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Download SurakshitLocker Mobile App</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Access your secure documents and passwords on the go. Scan the QR code or use the direct download link below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-col items-center justify-center p-8">
              {/* QR Code that links directly to the APK file */}
              <QRCodeSVG 
                value={directApkLink} 
                size={isMobile ? 200 : 250}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
                includeMargin={true}
              />
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Scan this QR code with your device's camera to download the app
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleCopyLink}
                >
                  <Download className="h-4 w-4" />
                  Copy Link
                </Button>
                
                {activeTab === "android" && (
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
                    onClick={handleDirectDownload}
                  >
                    <Download className="h-4 w-4" />
                    {isMobile ? "Download Now" : "Copy Direct Link"}
                  </Button>
                )}
              </div>
              
              {/* Direct download links */}
              {isMobile && activeTab === "android" && (
                <div className="mt-4 text-center">
                  <a 
                    href={directApkLink} 
                    download="surakshitlocker.apk" 
                    className="inline-block bg-indigo-600 text-white rounded-lg px-4 py-2 mt-2 hover:bg-indigo-700"
                  >
                    Direct Download
                  </a>
                </div>
              )}
            </Card>

            <div className="space-y-6">
              <Tabs 
                value={activeTab} 
                onValueChange={(v) => setActiveTab(v as "android" | "ios")}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="android">Android</TabsTrigger>
                  <TabsTrigger value="ios">iOS</TabsTrigger>
                </TabsList>
                
                <TabsContent value="android" className="mt-4 space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-900/50">
                    <h3 className="font-semibold text-green-800 dark:text-green-400 mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Android Installation
                    </h3>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-green-700 dark:text-green-300">
                      <li>Scan the QR code with your Android device</li>
                      <li>Tap to download the APK file</li>
                      <li>Tap on the download notification when complete</li>
                      <li>Allow installation from unknown sources if prompted</li>
                      <li>Open the APK file and install the app</li>
                      <li>Launch SurakshitLocker from your app drawer</li>
                    </ol>
                  </div>
                  
                  {/* Manual download button for mobile devices */}
                  {isMobile && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg text-center">
                      <p className="text-indigo-700 dark:text-indigo-300 mb-3">
                        If scanning doesn't work, download directly:
                      </p>
                      <a 
                        href={directApkLink} 
                        download="surakshitlocker.apk" 
                        className="inline-block bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700"
                      >
                        Download APK File
                      </a>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="ios" className="mt-4 space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900/50">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      iOS Installation
                    </h3>
                    <ol className="list-decimal pl-5 space-y-2 text-sm text-blue-700 dark:text-blue-300">
                      <li>Scan the QR code with your iOS device camera</li>
                      <li>Tap the notification that appears</li>
                      <li>Follow the on-screen installation prompts</li>
                      <li>If prompted, trust the developer in Settings</li>
                      <li>Launch SurakshitLocker from your home screen</li>
                    </ol>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-medium mb-2">App Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                    Secure document storage and management
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                    Password vault with end-to-end encryption
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                    Document reminders and notifications
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                    Offline access to your important information
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </BlurContainer>
      </div>
    </Container>
  );
};

export default MobileApp;
