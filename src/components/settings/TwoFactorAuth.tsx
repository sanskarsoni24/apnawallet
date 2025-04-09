
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/contexts/UserContext";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Shield, Copy, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const TwoFactorAuth = () => {
  const { userSettings, enableTwoFactor, disableTwoFactor, email } = useUser();
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [backupCodesCopied, setBackupCodesCopied] = useState(false);
  
  const isTwoFactorEnabled = userSettings?.twoFactorEnabled || false;
  
  // Reset error when form state changes
  useEffect(() => {
    setError("");
  }, [verificationCode]);
  
  // Generate backup codes when enabling 2FA
  useEffect(() => {
    if (showQRCode && !backupCodes.length) {
      generateBackupCodes();
    }
  }, [showQRCode]);
  
  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 8; i++) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      codes.push(code);
    }
    setBackupCodes(codes);
  };
  
  const handleToggle = () => {
    if (isTwoFactorEnabled) {
      disableTwoFactor();
      setShowQRCode(false);
      setVerificationCode("");
      setBackupCodes([]);
      setShowBackupCodes(false);
      toast({
        title: "Two-factor authentication disabled",
        description: "Your account is now less secure but easier to access"
      });
    } else {
      enableTwoFactor();
      setShowQRCode(true);
      generateBackupCodes();
      toast({
        title: "Two-factor authentication setup started",
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
        setShowBackupCodes(true);
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
  
  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    setBackupCodesCopied(true);
    toast({
      title: "Backup codes copied",
      description: "Store these codes in a safe place"
    });
    
    setTimeout(() => {
      setBackupCodesCopied(false);
    }, 3000);
  };
  
  const getSecretKey = () => {
    // In a real app, this would be a cryptographically secure key
    return "DEMO" + Math.random().toString(36).substring(2, 10).toUpperCase();
  };
  
  const getProgressValue = () => {
    if (!verificationCode) return 0;
    return Math.min(verificationCode.length * 16.6, 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-indigo-500" />
          Two-Factor Authentication
        </CardTitle>
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
                value={`otpauth://totp/SurakshitLocker:${userSettings?.email || email}?secret=${getSecretKey()}&issuer=SurakshitLocker`}
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
                className="font-mono text-center text-lg tracking-widest"
              />
              
              <Progress value={getProgressValue()} className="h-1.5 mt-1" />
              
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
          </div>
        )}
        
        {showBackupCodes && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
            <div className="mb-4">
              <h4 className="font-medium mb-2">Backup Codes</h4>
              <p className="text-sm text-muted-foreground">
                Save these backup codes in a secure place. You can use these codes to access your account if you lose your authentication device.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-4 rounded border grid grid-cols-2 gap-2">
              {backupCodes.map((code, index) => (
                <div key={index} className="font-mono text-sm p-2 bg-gray-50 dark:bg-gray-900 rounded">
                  {code}
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-4 flex items-center justify-center gap-2"
              onClick={copyBackupCodes}
            >
              {backupCodesCopied ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Codes Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Backup Codes</span>
                </>
              )}
            </Button>
            
            <p className="text-xs text-center mt-4 text-muted-foreground">
              Each code can only be used once. New codes can be generated in settings.
            </p>
          </div>
        )}
      </CardContent>
      {isTwoFactorEnabled && !showQRCode && !showBackupCodes && (
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setShowQRCode(!showQRCode)}
          >
            {showQRCode ? "Hide QR Code" : "Show QR Code"}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              generateBackupCodes();
              setShowBackupCodes(true);
            }}
          >
            Generate New Backup Codes
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TwoFactorAuth;
