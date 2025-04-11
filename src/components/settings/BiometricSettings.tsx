
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";
import { ScanFace, Fingerprint, Shield, AlertTriangle, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BiometricSettings = () => {
  const { userSettings, updateUserSettings } = useUser();
  
  // Get biometric settings with fallbacks
  const biometricEnabled = userSettings?.biometricAuth?.enabled || false;
  const faceIdEnabled = userSettings?.biometricAuth?.faceIdEnabled || false;
  const fingerprintEnabled = userSettings?.biometricAuth?.fingerprintEnabled || false;
  
  const [isInIframe, setIsInIframe] = useState(false);
  const [biometricsSupported, setBiometricsSupported] = useState(false);
  const [faceIdSupported, setFaceIdSupported] = useState(false);
  const [fingerprintSupported, setFingerprintSupported] = useState(false);
  const [verifyingBiometrics, setVerifyingBiometrics] = useState(false);
  
  // Check if environment supports biometrics
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
  }, [isInIframe]);
  
  // Function to handle changes to biometric settings
  const handleBiometricToggle = (enabled: boolean) => {
    if (enabled && !biometricsSupported && !isInIframe) {
      toast({
        title: "Biometrics Not Supported",
        description: "Your device or browser doesn't support biometric authentication.",
        variant: "destructive",
      });
      return;
    }
    
    if (enabled) {
      // Verify biometrics first before enabling
      verifyBiometrics().then(success => {
        if (success) {
          updateUserSettings({
            biometricAuth: {
              enabled: true,
              faceIdEnabled: faceIdSupported,
              fingerprintEnabled: fingerprintSupported,
              lastVerified: new Date().toISOString()
            }
          });
          
          toast({
            title: "Biometric Authentication Enabled",
            description: "You can now use biometrics to unlock your secure vault.",
          });
        }
      });
    } else {
      // Just disable without verification
      updateUserSettings({
        biometricAuth: {
          enabled: false,
          faceIdEnabled: false,
          fingerprintEnabled: false
        }
      });
      
      toast({
        title: "Biometric Authentication Disabled",
        description: "Biometric authentication has been turned off.",
      });
    }
  };
  
  // Toggle specific biometric methods
  const toggleFaceId = (enabled: boolean) => {
    if (!faceIdSupported && !isInIframe) {
      toast({
        title: "Face ID Not Available",
        description: "Your device doesn't appear to support facial recognition.",
        variant: "destructive",
      });
      return;
    }
    
    updateUserSettings({
      biometricAuth: {
        ...userSettings?.biometricAuth,
        enabled: enabled || fingerprintEnabled,
        faceIdEnabled: enabled
      }
    });
    
    toast({
      title: enabled ? "Face ID Enabled" : "Face ID Disabled",
      description: enabled 
        ? "You can now use facial recognition to unlock your secure vault." 
        : "Face ID has been turned off.",
    });
  };
  
  const toggleFingerprint = (enabled: boolean) => {
    if (!fingerprintSupported && !isInIframe) {
      toast({
        title: "Fingerprint Not Available",
        description: "Your device doesn't appear to support fingerprint recognition.",
        variant: "destructive",
      });
      return;
    }
    
    updateUserSettings({
      biometricAuth: {
        ...userSettings?.biometricAuth,
        enabled: enabled || faceIdEnabled,
        fingerprintEnabled: enabled
      }
    });
    
    toast({
      title: enabled ? "Fingerprint Enabled" : "Fingerprint Disabled",
      description: enabled 
        ? "You can now use fingerprint recognition to unlock your secure vault." 
        : "Fingerprint authentication has been turned off.",
    });
  };
  
  // Create a credential validation function
  const verifyBiometrics = async (): Promise<boolean> => {
    setVerifyingBiometrics(true);
    
    if (isInIframe) {
      // In iframe, simulate success for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      setVerifyingBiometrics(false);
      return true;
    }
    
    if (!window.PublicKeyCredential) {
      setVerifyingBiometrics(false);
      toast({
        title: "Not Supported",
        description: "Your browser doesn't support the Web Authentication API needed for biometric verification.",
        variant: "destructive",
      });
      return false;
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
      
      setVerifyingBiometrics(false);
      return true;
    } catch (error) {
      console.error("Biometric verification failed:", error);
      setVerifyingBiometrics(false);
      
      toast({
        title: "Verification Failed",
        description: "Biometric verification was unsuccessful. Please try again.",
        variant: "destructive",
      });
      
      return false;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Biometric Authentication
        </CardTitle>
        <CardDescription>
          Use your device's biometric features to unlock your secure vault
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!biometricsSupported && !isInIframe && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Not Supported</AlertTitle>
            <AlertDescription>
              Your device or browser doesn't support the Web Authentication API needed for biometric authentication.
            </AlertDescription>
          </Alert>
        )}
        
        {isInIframe && (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Preview Mode</AlertTitle>
            <AlertDescription>
              Biometric authentication features are simulated in this preview environment. They will work properly when deployed.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-medium">Enable Biometric Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Use biometrics instead of password to unlock your secure vault
            </p>
          </div>
          <Switch 
            checked={biometricEnabled} 
            onCheckedChange={handleBiometricToggle}
            disabled={verifyingBiometrics}
          />
        </div>
        
        {biometricEnabled && (
          <>
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <ScanFace className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Face ID</h3>
                    <p className="text-sm text-muted-foreground">Use facial recognition</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-muted-foreground">
                    {faceIdSupported || isInIframe ? "Available on this device" : "Not available"}
                  </p>
                  <Switch 
                    checked={faceIdEnabled} 
                    onCheckedChange={toggleFaceId}
                    disabled={!faceIdSupported && !isInIframe}
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-3 p-4 border rounded-lg hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Fingerprint className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">Fingerprint</h3>
                    <p className="text-sm text-muted-foreground">Use fingerprint recognition</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-muted-foreground">
                    {fingerprintSupported || isInIframe ? "Available on this device" : "Not available"}
                  </p>
                  <Switch 
                    checked={fingerprintEnabled} 
                    onCheckedChange={toggleFingerprint}
                    disabled={!fingerprintSupported && !isInIframe}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                variant="outline" 
                onClick={() => verifyBiometrics()}
                disabled={verifyingBiometrics}
                className="w-full"
              >
                {verifyingBiometrics ? (
                  "Verifying..."
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" /> 
                    Test Biometric Authentication
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BiometricSettings;
