
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ScannerConnectionProps {
  sessionId: string;
  onConnected: () => void;
  onError: (error: string) => void;
}

const ScannerConnection: React.FC<ScannerConnectionProps> = ({ 
  sessionId, 
  onConnected,
  onError
}) => {
  const [connecting, setConnecting] = useState(true);

  useEffect(() => {
    // This simulates the connection process
    // In a real implementation, we would use WebSockets or some other form of real-time communication

    // Simulate connection delay
    const timer = setTimeout(() => {
      setConnecting(false);
      
      // 80% chance of successful connection for demo purposes
      const isSuccessful = Math.random() < 0.8;
      
      if (isSuccessful) {
        onConnected();
      } else {
        onError("Failed to establish connection with your device. Please try scanning the QR code again.");
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [sessionId, onConnected, onError]);

  return (
    <div className="flex justify-center items-center py-4">
      {connecting && (
        <div className="flex items-center gap-2 text-primary">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Connecting...</span>
        </div>
      )}
    </div>
  );
};

export default ScannerConnection;
