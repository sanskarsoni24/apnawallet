import React, { useState, useEffect } from "react";
import { Shield, LockKeyhole, Plus, FileText, Key, Trash2, Eye, EyeOff, Lock, ScanFace, Fingerprint, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BlurContainer from "@/components/ui/BlurContainer";
import MobileQRCodeModal from "@/components/mobile/MobileQRCodeModal";
import PasswordRecovery from "@/components/security/PasswordRecovery";
import ForgotPassword from "@/components/auth/ForgotPassword";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";

interface SecretItem {
  id: string;
  title: string;
  value: string;
  type: "password" | "note" | "key";
  dateAdded: string;
}

const SurakshaLocker: React.FC = () => {
  const { userSettings } = useUser();
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("passwords");
  const [secrets, setSecrets] = useState<SecretItem[]>([
    {
      id: "1",
      title: "Gmail Password",
      value: "••••••••••••",
      type: "password",
      dateAdded: "2023-10-15",
    },
    {
      id: "2",
      title: "Backup Recovery Key",
      value: "XXXX-XXXX-XXXX-XXXX",
      type: "key",
      dateAdded: "2023-09-22",
    },
    {
      id: "3",
      title: "Travel Notes",
      value: "Passport Number: A123456789\nEmergency Contact: +1-555-123-4567",
      type: "note",
      dateAdded: "2023-10-01",
    },
  ]);
  
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemValue, setNewItemValue] = useState("");
  const [showBiometricOptions, setShowBiometricOptions] = useState(false);
  const [biometricProcessing, setBiometricProcessing] = useState(false);
  const [biometricsSupported, setBiometricsSupported] = useState(false);
  const [faceIdSupported, setFaceIdSupported] = useState(false);
  const [fingerprintSupported, setFingerprintSupported] = useState(false);
  
  const [isInIframe, setIsInIframe] = useState(false);
  
  // Check if biometric auth is enabled in user settings
  const biometricEnabled = userSettings?.biometricAuth?.enabled || false;
  const faceIdEnabled = userSettings?.biometricAuth?.faceIdEnabled || false;
  const fingerprintEnabled = userSettings?.biometricAuth?.fingerprintEnabled || false;
  
  // Check if device supports biometrics
  useEffect(() => {
    // Check if running in an iframe
    try {
      setIsInIframe(window.self !== window.top);
    } catch (e) {
      // If we can't access window.top due to cross-origin restrictions, we're in an iframe
      setIsInIframe(true);
    }

    const checkBiometricSupport = async () => {
      if (window.PublicKeyCredential) {
        try {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setBiometricsSupported(available && !isInIframe);
          
          if (available && !isInIframe) {
            // Most modern laptops and phones with biometrics will return true here
            // We're making educated guesses about specific capabilities
            
            // Check if device likely has fingerprint support (most biometric devices do)
            setFingerprintSupported(true);
            
            // Check if device likely has facial recognition (many modern laptops and phones do)
            const isMac = /Mac/.test(navigator.platform);
            const isWindows = /Win/.test(navigator.platform);
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            
            // Modern Macs have Face ID, Windows has Windows Hello, many mobile devices have face unlock
            setFaceIdSupported(isMac || isWindows || isMobile);
            
            console.log("Biometric authentication is supported on this device");
          } else {
            console.log(isInIframe ? 
              "Biometric authentication is not available in iframes due to security restrictions" : 
              "Biometric authentication is not supported on this device");
          }
        } catch (error) {
          console.error("Error checking biometric support:", error);
          setBiometricsSupported(false);
        }
      } else {
        console.log("Web Authentication API is not supported in this browser");
        setBiometricsSupported(false);
      }
    };
    
    checkBiometricSupport();
  }, []);
  
  useEffect(() => {
    // Check if vault has been unlocked in this session
    const isVaultUnlocked = sessionStorage.getItem("vaultUnlocked") === "true";
    if (isVaultUnlocked) {
      setIsLocked(false);
    }
  }, []);
  
  // Create a credential validation function
  const verifyBiometricCredential = async () => {
    if (!window.PublicKeyCredential || isInIframe) {
      if (isInIframe) {
        // In iframe, simulate success for demo purposes
        return true;
      }
      throw new Error("Web Authentication API not supported");
    }
    
    try {
      // Generate a random challenge
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      
      // Create the credential request options
      const publicKeyCredentialRequestOptions = {
        challenge,
        rpId: window.location.hostname,
        userVerification: "required" as UserVerificationRequirement,
        timeout: 60000,
      };
      
      // Request the credential - this will trigger the device's biometric prompt
      await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      });
      
      return true;
    } catch (error) {
      console.error("Biometric verification failed:", error);
      throw error;
    }
  };
  
  const handleUnlock = () => {
    // This is a simplified authentication. In a real app, you would verify against stored credentials
    if (password === "password123" || password === "1234") {
      setIsLocked(false);
      sessionStorage.setItem("vaultUnlocked", "true");
      toast({
        title: "Vault unlocked",
        description: "You now have access to your secure vault",
      });
    } else {
      toast({
        title: "Access denied",
        description: "The password you entered is incorrect",
        variant: "destructive",
      });
    }
  };
  
  const handleBiometricAuth = async (type: 'face' | 'fingerprint') => {
    if (!biometricsSupported && !isInIframe) {
      toast({
        title: "Not supported",
        description: "Your device doesn't support biometric authentication",
        variant: "destructive",
      });
      return;
    }
    
    // Check if the specific method is supported
    if (type === 'face' && !faceIdSupported && !isInIframe) {
      toast({
        title: "Face ID not available",
        description: "Your device doesn't support facial recognition",
        variant: "destructive", 
      });
      return;
    }
    
    if (type === 'fingerprint' && !fingerprintSupported && !isInIframe) {
      toast({
        title: "Fingerprint not available",
        description: "Your device doesn't support fingerprint recognition",
        variant: "destructive",
      });
      return;
    }
    
    // Show processing state and hide options
    setBiometricProcessing(true);
    setShowBiometricOptions(false);
    
    if (isInIframe) {
      toast({
        title: `${type === 'face' ? 'Face' : 'Fingerprint'} scan simulated`,
        description: "In the preview environment, biometric authentication is simulated",
      });
      
      // Simulate success after a brief delay
      setTimeout(() => {
        setIsLocked(false);
        sessionStorage.setItem("vaultUnlocked", "true");
        
        toast({
          title: "Biometric authentication successful",
          description: "You now have access to your secure vault",
        });
        
        setBiometricProcessing(false);
      }, 1500);
      
      return;
    }
    
    toast({
      title: `${type === 'face' ? 'Face' : 'Fingerprint'} scan initiated`,
      description: "Please respond to the biometric prompt from your device",
    });
    
    try {
      // This will trigger the actual biometric verification using the platform's API
      const success = await verifyBiometricCredential();
      
      if (success) {
        setIsLocked(false);
        sessionStorage.setItem("vaultUnlocked", "true");
        
        toast({
          title: "Biometric authentication successful",
          description: "You now have access to your secure vault",
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Biometric verification failed",
        variant: "destructive",
      });
    } finally {
      setBiometricProcessing(false);
    }
  };
  
  const handleLock = () => {
    setIsLocked(true);
    setPassword("");
    sessionStorage.removeItem("vaultUnlocked");
    toast({
      title: "Vault locked",
      description: "Your secure vault has been locked",
    });
  };
  
  const handleAddItem = () => {
    if (newItemTitle && newItemValue) {
      const newItem: SecretItem = {
        id: Date.now().toString(),
        title: newItemTitle,
        value: newItemValue,
        type: activeTab === "passwords" ? "password" : activeTab === "notes" ? "note" : "key",
        dateAdded: new Date().toISOString().split("T")[0],
      };
      
      setSecrets([...secrets, newItem]);
      setNewItemTitle("");
      setNewItemValue("");
    }
  };
  
  const handleDeleteItem = (id: string) => {
    setSecrets(secrets.filter(item => item.id !== id));
  };

  if (isLocked) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Secure Vault</h2>
          </div>
          <div className="flex items-center gap-2">
            <MobileQRCodeModal deviceName="Chrome Mobile" />
          </div>
        </div>
        
        <BlurContainer>
          <Card className="border-none shadow-none">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                <Lock className="h-5 w-5 text-primary" />
                Password Protected
              </CardTitle>
              <CardDescription>
                Enter your vault password to access your secure information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter vault password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnlock();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                <Button 
                  onClick={handleUnlock} 
                  className="w-full"
                >
                  Unlock Vault
                </Button>
                
                {/* Biometric authentication options */}
                {biometricEnabled && (faceIdEnabled || fingerprintEnabled) && (
                  <div className="mt-4">
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        onClick={() => setShowBiometricOptions(!showBiometricOptions)}
                        className="text-sm"
                        disabled={biometricProcessing}
                      >
                        Use biometric authentication
                      </Button>
                    </div>
                    
                    {showBiometricOptions && (
                      <div className="flex justify-center gap-3 mt-4 animate-fade-in">
                        {faceIdEnabled && (
                          <Button
                            variant="outline"
                            onClick={() => handleBiometricAuth('face')}
                            className="flex flex-col items-center p-4 h-auto gap-2"
                            disabled={biometricProcessing || !biometricsSupported || !faceIdSupported}
                          >
                            <ScanFace className="h-10 w-10 text-primary" />
                            <span>Face ID</span>
                          </Button>
                        )}
                        
                        {fingerprintEnabled && (
                          <Button
                            variant="outline"
                            onClick={() => handleBiometricAuth('fingerprint')}
                            className="flex flex-col items-center p-4 h-auto gap-2"
                            disabled={biometricProcessing || !biometricsSupported || !fingerprintSupported}
                          >
                            <Fingerprint className="h-10 w-10 text-primary" />
                            <span>Fingerprint</span>
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {biometricProcessing && (
                      <div className="text-center mt-4 text-primary animate-pulse">
                        <p>Waiting for biometric verification...</p>
                      </div>
                    )}
                    
                    {!biometricsSupported && showBiometricOptions && (
                      <div className="flex items-start space-x-2 rounded-md bg-amber-50 dark:bg-amber-950/20 p-3 mt-4 text-amber-800 dark:text-amber-300">
                        <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Biometric authentication {isInIframe ? "in preview mode" : "not available"}</p>
                          <p className="text-sm">
                            {isInIframe ? 
                              "Biometric authentication is simulated in the preview. It will work properly in the deployed app." :
                              "Your device or browser doesn't support the Web Authentication API needed for secure biometric authentication."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="text-center mt-2">
                  <ForgotPassword />
                </div>
              </div>
            </CardContent>
          </Card>
        </BlurContainer>
        
        <div className="space-y-1 mt-4">
          <PasswordRecovery />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Secure Vault</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleLock}>
            <Lock className="h-4 w-4 mr-2" />
            Lock Vault
          </Button>
          <MobileQRCodeModal deviceName="Chrome Mobile" />
        </div>
      </div>
      
      <BlurContainer className="overflow-hidden p-0">
        <Tabs 
          defaultValue="passwords" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <TabsList className="flex justify-start px-6 pt-4 w-full border-b border-gray-100 dark:border-gray-800 gap-1 bg-transparent">
            <TabsTrigger 
              value="passwords" 
              className="data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-t-lg data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <LockKeyhole className="h-4 w-4 mr-2" />
              Passwords
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className="data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-t-lg data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <FileText className="h-4 w-4 mr-2" />
              Secure Notes
            </TabsTrigger>
            <TabsTrigger 
              value="keys" 
              className="data-[state=active]:bg-primary/10 dark:data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-t-lg data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <Key className="h-4 w-4 mr-2" />
              Recovery Keys
            </TabsTrigger>
          </TabsList>
          
          <div className="p-6">
            <div className="mb-6 flex flex-col sm:flex-row gap-2">
              <Input
                placeholder={`New ${activeTab === "passwords" ? "password title" : activeTab === "notes" ? "note title" : "recovery key name"}`}
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder={`${activeTab === "passwords" ? "Password value" : activeTab === "notes" ? "Note content" : "Recovery key"}`}
                type={activeTab === "passwords" ? "password" : "text"}
                value={newItemValue}
                onChange={(e) => setNewItemValue(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            
            <div className="space-y-4">
              {secrets
                .filter(item => 
                  (activeTab === "passwords" && item.type === "password") ||
                  (activeTab === "notes" && item.type === "note") ||
                  (activeTab === "keys" && item.type === "key")
                )
                .map(item => (
                  <div 
                    key={item.id} 
                    className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {item.type === "password" && <LockKeyhole className="h-5 w-5 text-blue-500" />}
                        {item.type === "note" && <FileText className="h-5 w-5 text-green-500" />}
                        {item.type === "key" && <Key className="h-5 w-5 text-amber-500" />}
                        <h3 className="font-medium">{item.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="ml-7">
                      <p className={`text-sm ${item.type === "password" ? "font-mono" : ""}`}>
                        {item.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Added: {item.dateAdded}
                      </p>
                    </div>
                  </div>
                ))}
                
              {secrets.filter(item => 
                (activeTab === "passwords" && item.type === "password") ||
                (activeTab === "notes" && item.type === "note") ||
                (activeTab === "keys" && item.type === "key")
              ).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No {activeTab === "passwords" ? "passwords" : activeTab === "notes" ? "notes" : "recovery keys"} found.
                    Add one to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </BlurContainer>
      
      <div className="space-y-1">
        <PasswordRecovery />
      </div>
    </div>
  );
};

export default SurakshaLocker;
