
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Fingerprint, ScanFace, Shield, ShieldAlert, InfoIcon, Check, X } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const BiometricSettings = () => {
  const { userSettings, updateUserSettings } = useUser();
  
  // Check if biometric auth is enabled in user settings
  const biometricEnabled = userSettings?.biometricAuth?.enabled || false;
  const faceIdEnabled = userSettings?.biometricAuth?.faceIdEnabled || false;
  const fingerprintEnabled = userSettings?.biometricAuth?.fingerprintEnabled || false;
  
  const [isSupported, setIsSupported] = useState(false);
  const [faceIdSupported, setFaceIdSupported] = useState(false);
  const [fingerprintSupported, setFingerprintSupported] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  
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
          setIsSupported(available && !isInIframe);
          
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
          } else {
            console.log(isInIframe ? 
              "Biometric authentication is not available in iframes due to security restrictions" : 
              "Biometric authentication is not supported on this device");
          }
        } catch (error) {
          console.error("Error checking biometric support:", error);
          setIsSupported(false);
        }
      } else {
        console.log("Web Authentication API is not supported in this browser");
        setIsSupported(false);
      }
    };
    
    checkBiometricSupport();
  }, []);
  
  const handleToggleBiometric = async (enabled: boolean) => {
    if (enabled && (!isSupported && !isInIframe)) {
      toast({
        title: "Not Supported",
        description: "Your device or browser doesn't support biometric authentication",
        variant: "destructive",
      });
      return;
    }
    
    if (enabled) {
      setIsEnrolling(true);
      
      try {
        // In a real app, this would set up WebAuthn with the server
        // For our demo, we'll simulate enrollment
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        toast({
          title: "Biometric Authentication Enabled",
          description: "You can now use biometrics to access your secure vault",
        });
        
        // Update user settings
        updateUserSettings({
          biometricAuth: {
            enabled: true,
            faceIdEnabled: faceIdSupported,
            fingerprintEnabled: fingerprintSupported,
            lastVerified: new Date().toISOString(),
          }
        });
      } catch (error) {
        console.error("Enrollment error:", error);
        toast({
          title: "Enrollment Failed",
          description: "Unable to set up biometric authentication",
          variant: "destructive",
        });
      } finally {
        setIsEnrolling(false);
      }
    } else {
      // Disable biometric authentication
      updateUserSettings({
        biometricAuth: {
          enabled: false,
          faceIdEnabled: false,
          fingerprintEnabled: false,
        }
      });
      
      toast({
        title: "Biometric Authentication Disabled",
        description: "Biometric access to your vault has been turned off",
      });
    }
  };
  
  const handleToggleFaceId = (enabled: boolean) => {
    if (!biometricEnabled) {
      toast({
        title: "Enable Biometrics First",
        description: "You need to enable biometric authentication before configuring specific methods",
        variant: "default",
      });
      return;
    }
    
    if (enabled && !faceIdSupported && !isInIframe) {
      toast({
        title: "Face ID Not Supported",
        description: "Your device doesn't appear to support facial recognition",
        variant: "default",
      });
      return;
    }
    
    updateUserSettings({
      biometricAuth: {
        ...userSettings?.biometricAuth,
        faceIdEnabled: enabled,
      }
    });
    
    toast({
      title: enabled ? "Face ID Enabled" : "Face ID Disabled",
      description: enabled ? "You can now use facial recognition to unlock your vault" : "Facial recognition access has been turned off",
    });
  };
  
  const handleToggleFingerprint = (enabled: boolean) => {
    if (!biometricEnabled) {
      toast({
        title: "Enable Biometrics First",
        description: "You need to enable biometric authentication before configuring specific methods",
        variant: "default",
      });
      return;
    }
    
    if (enabled && !fingerprintSupported && !isInIframe) {
      toast({
        title: "Fingerprint Not Supported",
        description: "Your device doesn't appear to support fingerprint recognition",
        variant: "default",
      });
      return;
    }
    
    updateUserSettings({
      biometricAuth: {
        ...userSettings?.biometricAuth,
        fingerprintEnabled: enabled,
      }
    });
    
    toast({
      title: enabled ? "Fingerprint Enabled" : "Fingerprint Disabled",
      description: enabled ? "You can now use fingerprint recognition to unlock your vault" : "Fingerprint access has been turned off",
    });
  };
  
  const handleResetBiometrics = async () => {
    // In a real app, this would invalidate existing credentials with the server
    setIsEnrolling(true);
    
    try {
      // Simulate server communication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Disable all biometric settings
      updateUserSettings({
        biometricAuth: {
          enabled: false,
          faceIdEnabled: false,
          fingerprintEnabled: false,
        }
      });
      
      toast({
        title: "Biometrics Reset",
        description: "All biometric credentials have been reset. You can enroll again if needed.",
      });
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: "Unable to reset biometric credentials",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint className="h-5 w-5" />
          Biometric Authentication
        </CardTitle>
        <CardDescription>
          Use your device's biometric capabilities to securely access your vault
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isSupported && !isInIframe ? (
          <Alert variant="default">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Not Supported</AlertTitle>
            <AlertDescription>
              Your device or browser doesn't support biometric authentication.
              You'll need to use password authentication to access your secure vault.
            </AlertDescription>
          </Alert>
        ) : isInIframe ? (
          <Alert className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Preview Mode</AlertTitle>
            <AlertDescription>
              In the preview environment, biometric authentication is simulated.
              When deployed, it will use your actual device biometrics if available.
            </AlertDescription>
          </Alert>
        ) : null}
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">Enable Biometric Authentication</div>
            <div className="text-xs text-muted-foreground">
              Use your biometric data to unlock your secure vault
            </div>
          </div>
          <Switch
            checked={biometricEnabled}
            onCheckedChange={handleToggleBiometric}
            disabled={isEnrolling}
          />
        </div>
        
        {biometricEnabled && (
          <>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <ScanFace className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Face ID / Facial Recognition</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Use facial recognition to unlock your vault
                </div>
              </div>
              <Switch 
                checked={faceIdEnabled} 
                onCheckedChange={handleToggleFaceId}
                disabled={isEnrolling || (!faceIdSupported && !isInIframe)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Fingerprint Recognition</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Use fingerprint recognition to unlock your vault
                </div>
              </div>
              <Switch 
                checked={fingerprintEnabled} 
                onCheckedChange={handleToggleFingerprint} 
                disabled={isEnrolling || (!fingerprintSupported && !isInIframe)}
              />
            </div>
            
            <div className="pt-4">
              <Button 
                variant="outline" 
                onClick={handleResetBiometrics}
                disabled={isEnrolling}
                className="w-full"
              >
                Reset Biometric Credentials
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BiometricSettings;
