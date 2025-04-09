
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, Smartphone, Mail, QrCode, Key } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import QRCode from "qrcode.react";

interface TwoFactorAuthProps {
  isPremium?: boolean;
}

const TwoFactorAuth = ({ isPremium = false }: TwoFactorAuthProps) => {
  const { userSettings, enableTwoFactor, disableTwoFactor } = useUser();
  const [enableDialogOpen, setEnableDialogOpen] = useState(false);
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationMethod, setVerificationMethod] = useState("app"); // "app" or "sms"

  const isTwoFactorEnabled = userSettings?.twoFactorEnabled || false;

  const generateQRCode = () => {
    // In a real app, this would be a proper TOTP secret
    const secret = "SURAKSHITLOCKERSECRETKEY" + Date.now().toString().substring(8);
    const appName = "SurakshitLocker";
    const username = userSettings?.email || "user@example.com";
    
    // Generate otpauth URL for TOTP
    const otpauthUrl = `otpauth://totp/${appName}:${username}?secret=${secret}&issuer=${appName}&algorithm=SHA1&digits=6&period=30`;
    
    return otpauthUrl;
  };

  const handleEnableTwoFactor = () => {
    if (!isPremium) {
      toast({
        title: "Premium feature",
        description: "Two-factor authentication is a premium feature. Please upgrade to enable it.",
        variant: "destructive",
      });
      return;
    }

    setEnableDialogOpen(true);
  };

  const handleVerifyAndEnable = () => {
    if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
      toast({
        title: "Invalid code",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we would validate the TOTP code here
    enableTwoFactor();
    setEnableDialogOpen(false);
    setVerificationCode("");
  };

  const handleDisableTwoFactor = () => {
    setDisableDialogOpen(true);
  };

  const handleConfirmDisable = () => {
    if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
      toast({
        title: "Invalid code",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we would validate the TOTP code here
    disableTwoFactor();
    setDisableDialogOpen(false);
    setVerificationCode("");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </div>
          {!isPremium && (
            <Badge variant="outline" className="bg-primary/5 text-primary">Premium</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <Label htmlFor="two-factor-auth" className="flex items-center gap-2">
            Enable two-factor authentication
          </Label>
          <Switch
            id="two-factor-auth"
            checked={isTwoFactorEnabled}
            onCheckedChange={isTwoFactorEnabled ? handleDisableTwoFactor : handleEnableTwoFactor}
            disabled={!isPremium}
          />
        </div>
        
        {isTwoFactorEnabled ? (
          <div className="space-y-4">
            <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4 border border-green-100 dark:border-green-900/50">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Two-factor authentication is enabled</h3>
                  <div className="mt-2 text-sm text-green-700 dark:text-green-400">
                    <p>Your account is protected with two-factor authentication. You'll need to enter a verification code when signing in.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Recovery options</Label>
              <div className="rounded-md border p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <span>Recovery keys</span>
                  </div>
                  <Button size="sm" variant="outline">View keys</Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>Recovery email</span>
                  </div>
                  <Button size="sm" variant="outline">Update</Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md bg-muted p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">Protect your account</h3>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to sign in.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Available methods</Label>
              <div className="grid gap-3">
                <div className="flex items-start p-3 border rounded-md">
                  <Smartphone className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Authenticator app</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use an authentication app like Google Authenticator, Authy, or 1Password to get verification codes.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 border rounded-md">
                  <Mail className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium">Email verification</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Receive verification codes via email when signing in from new devices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <Dialog open={enableDialogOpen} onOpenChange={setEnableDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set up two-factor authentication</DialogTitle>
              <DialogDescription>
                Enhance your account security by requiring a second verification step when you sign in.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-1 border rounded-md">
                  <QRCode
                    value={generateQRCode()}
                    size={180}
                    level="H"
                    includeMargin={true}
                    imageSettings={{
                      src: "//www.lovableproject.com/placeholder.svg", 
                      excavate: true,
                      width: 40,
                      height: 40
                    }}
                  />
                </div>
                <p className="text-sm text-center text-muted-foreground">
                  Scan this QR code with your authenticator app.<br />
                  <span className="font-medium">Don't share this QR code with anyone.</span>
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="verification-code">Enter verification code</Label>
                <Input
                  id="verification-code"
                  placeholder="6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEnableDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleVerifyAndEnable}>Enable</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={disableDialogOpen} onOpenChange={setDisableDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Disable two-factor authentication?</DialogTitle>
              <DialogDescription>
                This will make your account less secure. You'll only need your password to sign in.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="rounded-md bg-amber-50 dark:bg-amber-900/20 p-4 border border-amber-100 dark:border-amber-800/50">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Security warning</h3>
                    <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                      <p>Disabling two-factor authentication will reduce the security of your account. Only proceed if you're sure.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="disable-verification-code">Enter verification code to confirm</Label>
                <Input
                  id="disable-verification-code"
                  placeholder="6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDisableDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleConfirmDisable}>Disable</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
      
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Two-factor authentication adds an important second layer of security to your account. 
          It requires both something you know (your password) and something you have (a security code from your phone).
        </p>
      </CardFooter>
    </Card>
  );
};

export default TwoFactorAuth;
