
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDocuments } from "@/contexts/DocumentContext";
import { Document } from "@/types/Document";
import { useUser } from "@/contexts/UserContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Shield, Lock, Fingerprint, FolderOpen, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import DocumentCard from "../documents/DocumentCard";

const SurakshaLocker = () => {
  const { getSecureVaultDocuments, documents, updateDocument } = useDocuments();
  const { userSettings } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secureDocuments, setSecureDocuments] = useState<Document[]>([]);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState("documents");
  
  // Check if biometric is enabled in user settings
  const biometricEnabled = userSettings?.biometricAuth?.enabled || false;
  const faceIdAvailable = userSettings?.biometricAuth?.faceIdEnabled || false;
  const fingerprintAvailable = userSettings?.biometricAuth?.fingerprintEnabled || false;
  
  useEffect(() => {
    // Load secure documents when authenticated
    if (isAuthenticated) {
      const docs = getSecureVaultDocuments();
      setSecureDocuments(docs);
    } else {
      setSecureDocuments([]);
    }
  }, [isAuthenticated, documents]);
  
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    toast({
      title: "Authentication successful",
      description: "You now have access to your secure vault",
    });
  };
  
  const handleLockVault = () => {
    setIsAuthenticated(false);
    toast({
      description: "Your secure vault has been locked",
    });
  };
  
  const simulateBiometricAuth = () => {
    // In a real app, this would use actual biometric APIs
    setTimeout(() => {
      handleAuthSuccess();
      setShowBiometricPrompt(false);
    }, 1500);
  };
  
  const removeFromSecureVault = (id: string) => {
    updateDocument(id, { inSecureVault: false });
    toast({
      title: "Document moved",
      description: "Document has been removed from the secure vault",
    });
    
    // Refresh the secure documents list
    const docs = getSecureVaultDocuments();
    setSecureDocuments(docs);
  };
  
  // If not authenticated, show auth screen
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <div className="w-full max-w-md">
          <Card className="border-primary/20 shadow-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Secure Vault</CardTitle>
              <CardDescription>
                Your documents in the secure vault are encrypted and require authentication to access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <Lock className="h-16 w-16 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Authentication required to view your secure documents
                </p>
              </div>
              
              <div className="space-y-2">
                {biometricEnabled ? (
                  <Button 
                    onClick={() => setShowBiometricPrompt(true)} 
                    variant="default" 
                    size="lg" 
                    className="w-full bg-primary"
                  >
                    {faceIdAvailable ? (
                      <>
                        <Fingerprint className="mr-2 h-4 w-4" />
                        Unlock with Face ID
                      </>
                    ) : fingerprintAvailable ? (
                      <>
                        <Fingerprint className="mr-2 h-4 w-4" />
                        Unlock with Fingerprint
                      </>
                    ) : (
                      <>
                        <Fingerprint className="mr-2 h-4 w-4" />
                        Unlock with Biometrics
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleAuthSuccess} 
                    variant="default" 
                    size="lg" 
                    className="w-full bg-primary"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Unlock Vault
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {showBiometricPrompt && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card border rounded-lg p-6 max-w-sm w-full shadow-lg">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Fingerprint className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-lg font-medium">Biometric Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Place your finger on the sensor or look at the camera to verify your identity
                </p>
                <div className="pt-4 space-x-2">
                  <Button variant="outline" onClick={() => setShowBiometricPrompt(false)}>
                    Cancel
                  </Button>
                  <Button onClick={simulateBiometricAuth}>
                    Simulate Successful Auth
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // When authenticated, show secure vault content
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">Secure Vault</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Unlocked
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Your encrypted and protected documents
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLockVault}
          className="flex items-center gap-1"
        >
          <Lock className="h-3.5 w-3.5" />
          Lock Vault
        </Button>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full mb-6"
      >
        <TabsList className="grid grid-cols-2 w-full max-w-sm">
          <TabsTrigger value="documents">Secure Documents</TabsTrigger>
          <TabsTrigger value="settings">Vault Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="space-y-6 mt-4">
          {secureDocuments.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {secureDocuments.map((doc) => (
                <DocumentCard key={doc.id} {...doc} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-2 border-muted py-8">
              <CardContent className="text-center flex flex-col items-center">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                  <FolderOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No secure documents</h3>
                <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">
                  You don't have any documents in your secure vault. You can move sensitive documents here for extra protection.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vault Security Settings</CardTitle>
              <CardDescription>
                Configure how your secure vault is protected
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Biometric Authentication</h4>
                  <p className="text-sm text-muted-foreground">Use your fingerprint or face to unlock the vault</p>
                </div>
                <Badge variant={biometricEnabled ? "default" : "outline"}>
                  {biometricEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto-Lock Timeout</h4>
                  <p className="text-sm text-muted-foreground">Automatically lock vault after period of inactivity</p>
                </div>
                <Badge variant="outline">5 minutes</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Document Previews</h4>
                  <p className="text-sm text-muted-foreground">Show document previews in secure vault</p>
                </div>
                <Badge variant="outline">Enabled</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto">
                Configure Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SurakshaLocker;
