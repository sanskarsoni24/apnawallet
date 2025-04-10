
import React, { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ScanFace, Fingerprint, LockKeyhole } from "lucide-react";

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
  
  // Function to check if device supports biometric authentication
  const checkBiometricSupport = () => {
    // In a real app, this would use the Web Authentication API
    // For demo purposes, we'll assume support is available
    return true;
  };
  
  // Enable or disable biometric authentication
  const handleBiometricToggle = (enabled: boolean) => {
    setBiometricsEnabled(enabled);
    
    if (enabled) {
      // If enabling, check device support
      const supported = checkBiometricSupport();
      
      if (!supported) {
        toast({
          title: "Device not supported",
          description: "Your device doesn't support biometric authentication",
          variant: "destructive",
        });
        setBiometricsEnabled(false);
        return;
      }
    }
    
    // If disabling, also disable specific methods
    if (!enabled) {
      setFaceIdEnabled(false);
      setFingerprintEnabled(false);
    }
    
    updateUserSettings({
      biometricAuth: {
        enabled,
        faceIdEnabled: enabled ? faceIdEnabled : false,
        fingerprintEnabled: enabled ? fingerprintEnabled : false,
        lastVerified: enabled ? new Date().toISOString() : undefined,
      }
    });
    
    toast({
      title: enabled ? "Biometric authentication enabled" : "Biometric authentication disabled",
      description: enabled 
        ? "You can now use biometric authentication to access your vault" 
        : "Biometric authentication has been turned off",
    });
  };
  
  // Enable or disable face ID
  const handleFaceIdToggle = (enabled: boolean) => {
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
  
  // Configure biometric authentication
  const configureBiometrics = () => {
    // In a real app, this would trigger the device's biometric enrollment flow
    toast({
      title: "Biometric setup",
      description: "This would normally trigger your device's biometric enrollment flow",
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
          />
        </div>
        
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
                  disabled={!biometricsEnabled}
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
                  disabled={!biometricsEnabled}
                />
              </div>
              
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={configureBiometrics}
                  disabled={!biometricsEnabled}
                  className="w-full"
                >
                  Configure Biometric Authentication
                </Button>
              </div>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 p-3 rounded-md text-sm text-amber-800 dark:text-amber-300">
              <p>
                <strong>Note:</strong> Biometric authentication relies on your device's hardware 
                capabilities. This feature works best on mobile devices and may not be available 
                on all desktop browsers.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BiometricSettings;
