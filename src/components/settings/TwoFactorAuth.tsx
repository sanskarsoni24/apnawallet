
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/contexts/UserContext";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TwoFactorAuth = () => {
  const { userSettings, enableTwoFactor, disableTwoFactor } = useUser();
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  
  const isTwoFactorEnabled = userSettings?.twoFactorEnabled || false;
  
  // Reset error when form state changes
  useEffect(() => {
    setError("");
  }, [verificationCode]);
  
  const handleToggle = () => {
    if (isTwoFactorEnabled) {
      disableTwoFactor();
      setShowQRCode(false);
      setVerificationCode("");
      toast({
        title: "Two-factor authentication disabled",
        description: "Your account is now less secure but easier to access"
      });
    } else {
      enableTwoFactor();
      setShowQRCode(true);
      toast({
        title: "Two-factor authentication enabled",
        description: "Scan the QR code with your authenticator app to complete setup"
      });
    }
  };
  
  const handleVerify = () => {
    setVerifying(true);
    setError("");
    
    // For demo purposes, accept any 6-digit code
    if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
      // Success scenario
      setTimeout(() => {
        setVerifying(false);
        toast({
          title: "Verification successful",
          description: "Two-factor authentication has been fully configured"
        });
      }, 1500);
    } else {
      // Error scenario
      setTimeout(() => {
        setVerifying(false);
        setError("Invalid code. Please enter a 6-digit verification code.");
      }, 1000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-Factor Authentication</CardTitle>
        <CardDescription>
          Add an extra layer of security to your account with two-factor authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Enable Two-Factor Authentication</p>
            <p className="text-sm text-muted-foreground">
              Require a verification code when signing in
            </p>
          </div>
          <Switch checked={isTwoFactorEnabled} onCheckedChange={handleToggle} />
        </div>
        
        {showQRCode && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
            <p className="text-sm text-center mb-4">
              Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
            </p>
            <div className="flex justify-center bg-white p-4 rounded-md">
              <QRCodeSVG
                value={`otpauth://totp/DocuNinja:${userSettings?.email}?secret=DEMOSECRETKEY&issuer=DocuNinja`}
                size={200}
              />
            </div>
            
            <div className="mt-6 space-y-3">
              <Label htmlFor="verification-code">Enter the 6-digit code from your app</Label>
              <Input 
                id="verification-code"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="font-mono text-center"
              />
              
              {error && (
                <Alert variant="destructive" className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Verification Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                className="w-full" 
                onClick={handleVerify} 
                disabled={verificationCode.length !== 6 || verifying}
              >
                {verifying ? "Verifying..." : "Verify Code"}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Note: For this demo, any 6-digit code will work
              </p>
            </div>
            
            <p className="text-sm text-center mt-4 text-muted-foreground">
              This is a demo QR code. In a real app, a unique secret would be generated for your account.
            </p>
          </div>
        )}
      </CardContent>
      {isTwoFactorEnabled && !showQRCode && (
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setShowQRCode(!showQRCode)}
          >
            {showQRCode ? "Hide QR Code" : "Show QR Code"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TwoFactorAuth;
