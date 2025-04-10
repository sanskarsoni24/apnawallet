
import React, { useState } from "react";
import { QrCode, X, Smartphone } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";

interface MobileQRCodeModalProps {
  deviceName?: string;
}

const MobileQRCodeModal: React.FC<MobileQRCodeModalProps> = ({ deviceName }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Generate a QR code with the current URL and a unique token
  const qrCodeData = JSON.stringify({
    appUrl: window.location.origin,
    deviceName: deviceName || "Chrome Mobile",
    timestamp: new Date().toISOString()
  });
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" title="Mobile Access">
          <Smartphone className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mobile Access</DialogTitle>
          <DialogDescription>
            Scan this QR code to access your vault on mobile
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-6">
          <div className="bg-white p-4 rounded-lg mb-4">
            <QRCodeSVG 
              value={qrCodeData}
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Scan this QR code using your mobile device to access your secure vault
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileQRCodeModal;
