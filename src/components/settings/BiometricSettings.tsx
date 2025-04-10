
import React, { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ScanFace, Fingerprint, LockKeyhole, AlertTriangle } from "lucide-react";

const BiometricSettings = () => {
  const { userSettings, updateUserSettings } = useUser();
  
  // Get current settings or default to false
  const [biometricsEnabled, setBiometricsEnabled] = useState(
    userSettings?.biometricAuth?.enabled || false
  );
  const [faceIdEnabled, setFaceIdEnabled] = useState(
    userSettings?.biometricAuth?.faceIdEnabled || false
  );
  const [fingerprintEnabled, setFingerprintEnabled] = useState(
    userSettings?.biometricAuth?.fingerprintEnabled || false
  );
  
  const [biometricsSupported, setBiometricsSupported] = useState(false);
  const [faceIdSupported, setFaceIdSupported] = useState(false);
  const [fingerprintSupported, setFingerprintSupported] = useState(false);
  
  // Check if biometric authentication is supported
  useEffect(() => {
    const checkBiometricSupport = async () => {
      // Check if the Web Authentication API is available
      if (window.PublicKeyCredential) {
        try {
          // Check if platform authenticator is available
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setBiometricsSupported(available);
          
          if (available) {
            // Most modern laptops and phones with biometrics will return true here
            // We're making educated guesses about specific capabilities
            
            // Check if device likely has fingerprint support (most biometric devices do)
            setFingerprintSupported(true);
            
            // Check if device likely has facial recognition (many modern laptops and phones do)
            // This is an approximation as the Web Authentication API doesn't specify the exact method
            const isMac = /Mac/.test(navigator.platform);
            const isWindows = /Win/.test(navigator.platform);
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            
            // Modern Macs have Face ID, Windows has Windows Hello, many mobile devices have face unlock
            setFaceIdSupported(isMac || isWindows || isMobile);
            
            console.log("Biometric authentication is supported on this device");
          } else {
            console.log("Biometric authentication is not supported on this device");
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
  
  // Enable or disable biometric authentication
  const handleBiometricToggle = async (enabled: boolean) => {
    if (enabled && !biometricsSupported) {
      toast({
        title: "Device not supported",
        description: "Your device doesn't support biometric authentication",
        variant: "destructive",
      });
      return;
    }
    
    setBiometricsEnabled(enabled);
    
    // If disabling, also disable specific methods
    if (!enabled) {
      setFaceIdEnabled(false);
      setFingerprintEnabled(false);
    }
    
    // Register a credential for biometric auth (simplified for demo)
    if (enabled) {
      try {
        await testBiometricRegistration();
        
        updateUserSettings({
          biometricAuth: {
            enabled,
            faceIdEnabled: enabled ? faceIdEnabled : false,
            fingerprintEnabled: enabled ? fingerprintEnabled : false,
            lastVerified: enabled ? new Date().toISOString() : undefined,
          }
        });
        
        toast({
          title: "Biometric authentication enabled",
          description: "You can now use biometric authentication to access your vault",
        });
      } catch (error) {
        console.error("Error registering biometric:", error);
        setBiometricsEnabled(false);
        
        toast({
          title: "Biometric setup failed",
          description: "There was an error setting up biometric authentication",
          variant: "destructive",
        });
      }
    } else {
      updateUserSettings({
        biometricAuth: {
          enabled: false,
          faceIdEnabled: false,
          fingerprintEnabled: false,
          lastVerified: undefined,
        }
      });
      
      toast({
        title: "Biometric authentication disabled",
        description: "Biometric authentication has been turned off",
      });
    }
  };
  
  // Test biometric registration to verify it works
  const testBiometricRegistration = async () => {
    // Only try if Web Authentication API is available
    if (!window.PublicKeyCredential) {
      throw new Error("Web Authentication API not supported");
    }
    
    try {
      // This is a simplified version of WebAuthn registration
      // In a real app, you'd need a proper server challenge
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      
      const publicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "Surakshit Locker",
          id: window.location.hostname,
        },
        user: {
          id: new Uint8Array([1, 2, 3, 4]),
          name: "user@example.com",
          displayName: "Test User",
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 }, // ES256
          { type: "public-key", alg: -257 }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
      };
      
      // This will trigger the device's biometric prompt
      await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions as any
      });
      
      return true;
    } catch (error) {
      console.error("Biometric test failed:", error);
      throw error;
    }
  };
  
  // Enable or disable face ID
  const handleFaceIdToggle = (enabled: boolean) => {
    if (enabled && !faceIdSupported) {
      toast({
        title: "Face ID not supported",
        description: "Your device doesn't appear to support facial recognition",
        variant: "destructive",
      });
      return;
    }
    
    setFaceIdEnabled(enabled);
    
    updateUserSettings({
      biometricAuth: {
        enabled: biometricsEnabled,
        faceIdEnabled: enabled,
        fingerprintEnabled,
        lastVerified: new Date().toISOString(),
      }
    });
    
    toast({
      title: enabled ? "Face ID enabled" : "Face ID disabled",
      description: enabled 
        ? "You can now use Face ID to access your vault" 
        : "Face ID has been turned off",
    });
  };
  
  // Enable or disable fingerprint
  const handleFingerprintToggle = (enabled: boolean) => {
    if (enabled && !fingerprintSupported) {
      toast({
        title: "Fingerprint not supported",
        description: "Your device doesn't appear to support fingerprint recognition",
        variant: "destructive",
      });
      return;
    }
    
    setFingerprintEnabled(enabled);
    
    updateUserSettings({
      biometricAuth: {
        enabled: biometricsEnabled,
        faceIdEnabled,
        fingerprintEnabled: enabled,
        lastVerified: new Date().toISOString(),
      }
    });
    
    toast({
      title: enabled ? "Fingerprint recognition enabled" : "Fingerprint recognition disabled",
      description: enabled 
        ? "You can now use fingerprint recognition to access your vault" 
        : "Fingerprint recognition has been turned off",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Biometric Authentication</CardTitle>
        <CardDescription>
          Use your device's biometric features to securely access your vault
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-full bg-primary/10">
              <LockKeyhole className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Label htmlFor="biometric-auth" className="font-medium">
                Biometric Authentication
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable biometric authentication for your vault
              </p>
            </div>
          </div>
          <Switch
            id="biometric-auth"
            checked={biometricsEnabled}
            onCheckedChange={handleBiometricToggle}
            disabled={!biometricsSupported}
          />
        </div>
        
        {!biometricsSupported && (
          <div className="flex items-start space-x-2 rounded-md bg-amber-50 dark:bg-amber-950/20 p-3 text-amber-800 dark:text-amber-300">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Biometric authentication not available</p>
              <p className="text-sm">
                Your device or browser doesn't support the Web Authentication API needed for secure biometric authentication.
              </p>
            </div>
          </div>
        )}
        
        {biometricsEnabled && (
          <>
            <div className="pl-14 space-y-4 border-l-2 border-primary/10 ml-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
                    <ScanFace className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <Label htmlFor="face-id" className="font-medium">
                      Face Recognition
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Use your face to unlock your vault
                    </p>
                  </div>
                </div>
                <Switch
                  id="face-id"
                  checked={faceIdEnabled}
                  onCheckedChange={handleFaceIdToggle}
                  disabled={!biometricsEnabled || !faceIdSupported}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20">
                    <Fingerprint className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <Label htmlFor="fingerprint" className="font-medium">
                      Fingerprint Recognition
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Use your fingerprint to unlock your vault
                    </p>
                  </div>
                </div>
                <Switch
                  id="fingerprint"
                  checked={fingerprintEnabled}
                  onCheckedChange={handleFingerprintToggle}
                  disabled={!biometricsEnabled || !fingerprintSupported}
                />
              </div>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 p-3 rounded-md text-sm text-amber-800 dark:text-amber-300">
              <p>
                <strong>Note:</strong> Biometric authentication relies on your device's hardware 
                capabilities and your browser's support for the Web Authentication API. For best 
                results, use Chrome, Edge, or Safari on devices with built-in biometric sensors.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BiometricSettings;
