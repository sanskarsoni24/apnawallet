
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, ExternalLink, Laptop, Shield, Fingerprint, Coffee, Zap, Wifi, WifiOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import BlurContainer from "@/components/ui/BlurContainer";

const DesktopApp: React.FC = () => {
  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your desktop app will be downloaded shortly."
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Surakshit Locker Desktop</h1>
          <p className="text-muted-foreground mt-1">Enhanced security and offline access for your documents</p>
        </div>
        <Button onClick={handleDownload} className="bg-gradient-to-r from-primary to-primary/80">
          <Download className="mr-2 h-4 w-4" />
          Download for Desktop
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/20 border-blue-200 dark:border-blue-800/50">
          <CardHeader>
            <Fingerprint className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
            <CardTitle>Native Biometrics</CardTitle>
            <CardDescription>Use your device's hardware security</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Unlock your vault with Windows Hello, Touch ID, or other platform-specific biometric authentication for maximum security.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/20 border-purple-200 dark:border-purple-800/50">
          <CardHeader>
            <WifiOff className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
            <CardTitle>Offline Access</CardTitle>
            <CardDescription>Access your documents anywhere</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              View and manage your important documents even without an internet connection. Changes sync automatically when back online.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-800/50">
          <CardHeader>
            <Zap className="h-8 w-8 text-emerald-600 dark:text-emerald-400 mb-2" />
            <CardTitle>Enhanced Performance</CardTitle>
            <CardDescription>Speed up your document management</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Experience faster document loading, rendering, and processing with our optimized native desktop application.
            </p>
          </CardContent>
        </Card>
      </div>

      <BlurContainer>
        <Tabs defaultValue="features">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="features">Key Features</TabsTrigger>
            <TabsTrigger value="requirements">System Requirements</TabsTrigger>
            <TabsTrigger value="installation">Installation Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="features" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Enhanced Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Hardware-level encryption and biometric authentication integration.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <WifiOff className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Full Offline Capability</h3>
                  <p className="text-sm text-muted-foreground">
                    Access and modify all your documents without an internet connection.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Wifi className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Automatic Syncing</h3>
                  <p className="text-sm text-muted-foreground">
                    Changes sync across all your devices when internet connectivity is restored.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Laptop className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">System Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Integrates with your operating system for notifications and quick access.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="requirements">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Windows</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
                  <li>Windows 10 or later (64-bit)</li>
                  <li>4GB RAM minimum (8GB recommended)</li>
                  <li>500MB of available storage space</li>
                  <li>Windows Hello compatible device (for biometric features)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium">macOS</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
                  <li>macOS 10.15 (Catalina) or later</li>
                  <li>4GB RAM minimum (8GB recommended)</li>
                  <li>500MB of available storage space</li>
                  <li>Touch ID compatible Mac (for biometric features)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium">Linux</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
                  <li>Ubuntu 20.04, Fedora 34, or equivalent</li>
                  <li>4GB RAM minimum (8GB recommended)</li>
                  <li>500MB of available storage space</li>
                  <li>libfprint compatible device (for biometric features)</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="installation">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">1. Download the Installer</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose the appropriate installer for your operating system from the download button above.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">2. Run the Installer</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Double-click the downloaded file and follow the on-screen instructions to install the application.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">3. First-time Setup</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Sign in with your existing Surakshit Locker account to sync your documents. If this is your first time, create a new account.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">4. Set Up Biometric Access</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Follow the prompts to configure biometric authentication using your device's capabilities.
                </p>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="text-sm" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Installer
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </BlurContainer>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950/40 dark:to-slate-900/20 p-6 rounded-lg border border-slate-200 dark:border-slate-800/50">
          <h3 className="text-xl font-medium mb-3 flex items-center">
            <Coffee className="h-5 w-5 mr-2 text-amber-600" />
            Developer Mode
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            For developers who want to build or contribute to the desktop application.
          </p>
          
          <div className="bg-black/90 text-white p-4 rounded-md font-mono text-xs overflow-auto">
            <p className="text-green-400"># Clone the repository</p>
            <p className="opacity-90">git clone https://github.com/surakshit/desktop-app.git</p>
            <p className="text-green-400 mt-2"># Install dependencies</p>
            <p className="opacity-90">cd desktop-app && npm install</p>
            <p className="text-green-400 mt-2"># Start the development server</p>
            <p className="opacity-90">npm run dev</p>
            <p className="text-green-400 mt-2"># Build the application</p>
            <p className="opacity-90">npm run build</p>
          </div>
          
          <Button variant="outline" size="sm" className="mt-4">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Source Code
          </Button>
        </div>
        
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950/40 dark:to-slate-900/20 p-6 rounded-lg border border-slate-200 dark:border-slate-800/50">
          <h3 className="text-xl font-medium mb-3">Frequently Asked Questions</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Will my data sync across devices?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, all changes made in the desktop app will automatically sync with the web and mobile versions when you're online.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">Is biometric authentication secure?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, we use your device's native biometric APIs which store authentication data securely in your device's hardware.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">Can I use the app without internet?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, after initial setup, you can access all your synced documents offline. Changes will sync when connectivity is restored.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">How do I get updates?</h4>
              <p className="text-sm text-muted-foreground">
                The app automatically checks for updates and will prompt you when a new version is available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopApp;
