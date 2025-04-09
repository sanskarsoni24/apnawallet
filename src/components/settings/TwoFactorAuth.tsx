
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/contexts/UserContext";
import { QRCodeSVG } from "qrcode.react";

const TwoFactorAuth = () => {
  const { userSettings, enableTwoFactor, disableTwoFactor } = useUser();
  const [showQRCode, setShowQRCode] = useState(false);
  
  const isTwoFactorEnabled = userSettings?.twoFactorEnabled || false;
  
  const handleToggle = () => {
    if (isTwoFactorEnabled) {
      disableTwoFactor();
      setShowQRCode(false);
    } else {
      enableTwoFactor();
      setShowQRCode(true);
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
                value={`otpauth://totp/ApnaWallet:${userSettings?.email}?secret=DEMOSECRETKEY&issuer=ApnaWallet`}
                size={200}
              />
            </div>
            <p className="text-sm text-center mt-4 text-muted-foreground">
              This is a demo QR code. In a real app, a unique secret would be generated for your account.
            </p>
          </div>
        )}
      </CardContent>
      {isTwoFactorEnabled && (
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
