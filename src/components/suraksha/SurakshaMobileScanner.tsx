import React, { useState, useEffect, useRef } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { AlertCircle, Smartphone, Check, Loader2, Camera, QrCode, Scan, FileText, RefreshCw, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { QRCodeCanvas } from "qrcode.react";
import webSocketService from "@/services/WebSocketService";
import documentScanService, { ScannedDocument } from "@/services/DocumentScanService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ScannerState = "waiting" | "scanning" | "success" | "error" | "disconnected" | "scanning_document";

interface SurakshaMobileScannerProps {
  userSettings?: UserSettings;
  updateUserSettings?: (settings: Partial<UserSettings>) => void;
}

const SurakshaMobileScanner: React.FC<SurakshaMobileScannerProps> = ({
  userSettings,
  updateUserSettings
}) => {
  const [scannerState, setScannerState] = useState<ScannerState>("waiting");
  const [deviceName, setDeviceName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "disconnected">("disconnected");
  const [scannedDocuments, setScannedDocuments] = useState<ScannedDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<ScannedDocument | null>(null);
  const [isGeneratingQR, setIsGeneratingQR] = useState<boolean>(false);
  const [documentScanProgress, setDocumentScanProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("connection");

  // Refs
  const qrValueRef = useRef<string>("");
  const connectionCheckInterval = useRef<number | null>(null);

  // Set up connection status listener
  useEffect(() => {
    const handleConnectionChange = (data: any) => {
      setConnectionStatus(data.status);
      if (data.status === "connected") {
        setScannerState("success");
        toast({
          title: "Connection established",
          description: "Your mobile device is now connected",
        });
      } else if (data.status === "disconnected" || data.status === "error") {
        if (scannerState === "success") {
          setScannerState("disconnected");
          toast({
            title: "Connection lost",
            description: "Your mobile device has been disconnected",
            variant: "destructive"
          });
        }
      }
    };

    webSocketService.on("connectionChange", handleConnectionChange);

    return () => {
      webSocketService.off("connectionChange", handleConnectionChange);
    };
  }, [scannerState]);

  // Listen for document changes
  useEffect(() => {
    const handleDocumentsChanged = (docs: ScannedDocument[]) => {
      setScannedDocuments(docs);
      if (docs.length > 0 && !selectedDocument) {
        setSelectedDocument(docs[0]);
      }
    };

    const handleNewDocument = (doc: ScannedDocument) => {
      setSelectedDocument(doc);
      setActiveTab("documents");
    };

    documentScanService.onDocumentsChanged(handleDocumentsChanged);
    documentScanService.onNewDocument(handleNewDocument);

    return () => {
      documentScanService.removeDocumentsChangedListener(handleDocumentsChanged);
      documentScanService.removeNewDocumentListener(handleNewDocument);
    };
  }, [selectedDocument]);

  // Check if device is already paired on component mount
  useEffect(() => {
    if (userSettings?.mobileDeviceName) {
      setDeviceName(userSettings.mobileDeviceName);
      // Instead of directly setting success, we'll try to reconnect
      connectToMobileDevice();
    }

    // Clean up WebSocket connection on unmount
    return () => {
      if (connectionCheckInterval.current) {
        window.clearInterval(connectionCheckInterval.current);
      }
      webSocketService.disconnect();
    };
  }, [userSettings]);

  // Generate QR code value
  const generateQRValue = async () => {
    setIsGeneratingQR(true);
    try {
      // Create a new scan session
      const newSessionId = await documentScanService.createScanSession();
      
      if (newSessionId) {
        setSessionId(newSessionId);
        
        // Create connection data to encode in QR
        const connectionData = {
          type: "surakshitlocker_connect",
          sessionId: newSessionId,
          timestamp: new Date().toISOString(),
          origin: window.location.origin
        };
        
        // Store QR value
        qrValueRef.current = JSON.stringify(connectionData);
        
        // Set up connection check
        if (connectionCheckInterval.current) {
          window.clearInterval(connectionCheckInterval.current);
        }
        
        connectionCheckInterval.current = window.setInterval(() => {
          if (webSocketService.getStatus() === "connected") {
            window.clearInterval(connectionCheckInterval.current as number);
          }
        }, 2000);
        
        setIsGeneratingQR(false);
      } else {
        throw new Error("Failed to create session");
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      setError("Failed to generate QR code. Please try again.");
      setIsGeneratingQR(false);
    }
  };

  // Connect to mobile device using saved session ID
  const connectToMobileDevice = async () => {
    setScannerState("scanning");
    setConnectionStatus("connecting");
    setError(null);
    
    try {
      // Generate new QR code
      await generateQRValue();
    } catch (err) {
      console.error("Connection error:", err);
      setScannerState("error");
      setConnectionStatus("disconnected");
      setError("Failed to establish connection. Please try again.");
    }
  };

  // Handle QR code scan from mobile device
  const handleScan = (detectedCodes: any) => {
    // Extract the text value from the detected codes
    const result = detectedCodes && detectedCodes.length > 0 ? detectedCodes[0].rawValue : null;
    
    if (result) {
      try {
        // Parse QR code data
        const data = JSON.parse(result);
        
        if (data && data.deviceName) {
          // Simulate pairing process
          setScannerState("success");
          setDeviceName(data.deviceName);
          setConnectionStatus("connected");
          
          // Update user settings with device name
          if (updateUserSettings) {
            updateUserSettings({
              mobileDeviceName: data.deviceName
            });
          }
          
          toast({
            title: "Device connected",
            description: `Successfully paired with ${data.deviceName}`,
          });
        } else {
          throw new Error("Invalid QR code data");
        }
      } catch (err) {
        setScannerState("error");
        setError("Invalid QR code. Please try again.");
        
        toast({
          title: "Connection failed",
          description: "Could not read the QR code. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  // Handle camera errors
  const handleError = (err: any) => {
    console.error("QR Scanner error:", err);
    setScannerState("error");
    setError("Failed to access camera. Please check permissions and try again.");
    
    toast({
      title: "Scanner error",
      description: "Couldn't access your camera. Please check camera permissions.",
      variant: "destructive"
    });
  };

  // Start QR scanning
  const startScanning = () => {
    setScannerState("scanning");
    setError(null);
    connectToMobileDevice();
  };

  // Reset scanner
  const resetScanner = () => {
    setScannerState("waiting");
    setError(null);
    setConnectionStatus("disconnected");
    webSocketService.disconnect();
  };

  // Disconnect paired device
  const unpairDevice = () => {
    if (updateUserSettings) {
      updateUserSettings({
        mobileDeviceName: undefined
      });
    }
    
    setDeviceName("");
    setScannerState("waiting");
    setConnectionStatus("disconnected");
    webSocketService.disconnect();
    
    toast({
      title: "Device unpaired",
      description: "Your mobile device has been disconnected",
    });
  };

  // Simulate document scanning for demo purposes
  const simulateDocumentScan = () => {
    setScannerState("scanning_document");
    setDocumentScanProgress(0);
    
    // Create progress animation
    const progressInterval = setInterval(() => {
      setDocumentScanProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          
          // Generate sample document image (base64)
          const sampleDocument = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAGQAUADASIAAhEBAxEB/8QAGgAAAgMBAQAAAAAAAAAAAAAAAAECAwQFBv/EADcQAAICAQMCBAQFBAEEAwEAAAABAhEDBBIhMUEFE1FhInGBkRQyobHBI0JS0SPwFWJy0YKSsv/EABkBAQEBAQEBAAAAAAAAAAAAAAABAgMEBf/EAB8RAQEBAQACAwEBAQAAAAAAAAABEQISIQMTMUFRYf/aAAwDAQACEQMRAD8A9IhGEAICYgAGAAgAQCGEAAAgAYhkQAAAAAAAdiGIAAAAABgAAADABAMQAAAAAEADAAAQAIYgAQxAgGMBDQDAAAAEMBHOE/MvJzlbSTu/meq0vJMbUVT9GcPTZeJVd13PRaWe+N1TMVuLhCEaZEABhQCABAMQxCGAAIAGAwEMQDQDJBGIdCSGShFAACJoBgMQAIYCAYxAIaAoBDEAhiEAhDAAEIYCEMRbEAAAGDy7WGmK3aT91z+xd4fqFlhKMpdupkyYuKoy+E4ydWbp7jcNMZMGAAAAEIYxCGmAAA0AAACQUMlQ0gEAEhDJUMBAAAAAABoBgAAIBgAAIBiBCGMgQCGQMAAAAAEAgAAlNbouPqmmRGI05ZIpXOHuv4L/AAx/pR+RGf5o/T+SwzWoACGACAYgAQxCAAAQwoGAyQ0IZIBAAyQAAyQDABAMBCGAAIYAhEgABDGSoYxCGIYAIAASYCGFAIYhgOH5o/NFokK6afVMDzeu088GbfTpO0/Y36HUJpRk+Uacs+JeE7sbb4T5+Zzl5uim4tJVwa/XMegGV6bU7kscnz2L1NMxWpNfAAGQDEAwEMQAA0AwAAAAABgAgAYCEACAYgEMAEAxAIYgEMjZISEMbZEVjGgvkUAAxpASOd4lrVp8bhF1kdXXocFZ3knt7Pr7Ft9LI9JolLe0+xxVjccucM0UsvNNT8n9PqdHV63biSyPZG1Vdkc7P4lDLqPMxJxbf5e6+RnM/q3fxtjgXlyUknwvgdfF5eON7fLl0v8A2cXDrcmo1fjLT+Jd/TtyZZYRcPhakr466FtJDxDRY3llpWlSal/+jZotZl3QU5/Gn8/kevw6TBLF5bj8Hr6nB1emng1G5LjdTXRXz/8ARz46ut5mOp5blOWNdFyv+9S3FqMuOl5ja9Cc9I54FJcpKzPGbjLbOO1+jR3eTvEvHF7jpx1u57ckWn6rhmhZ8b/vX3PP49bklkcZr4PRrqavx0cuiTvd6P8A0Yuf1fGx1xkYanDLyuFxJfIs5RysCAYAAADABDEAwEADAAAQDAQDAQATBsAAYhkQGJjRItIxYdA0RMvVcMJKkXIkCCCFAIYhgOHLHjgvhVGPPk/FZPLxP4VymTeKUpVe5GHTVJzbtc0uGcu7/G8jXPSYsbc4RqTVW3bOf4nLFp4bUuupdW738HTW/wCLJa4Tvg5/iOKGpcI5IbcndJe5m96tyjkeHvJlntcnFdWl09v2OpDH8KxwdcXzxz6EIYYYo1jioxXRIyvLKGp8vz5RUo2nGLprn+CScz2bnNvpql4ppY5vJlqsaycV8af0LtR4jh0y+N/F6I8rjbWrWSeSWTBF/wBPxZctr2TtP2OvnxJQdQXH1MzqdLbZxz0upqXxY1LFI0YNTHIl5kHGXff2K56fFLg5mq0+SDctqcfVGc2LvN/jr5tPp8u5Sw417UVabHiwzl5Ulb9TnYNdk06UMiuPRSLc+syZkt8d+PsqPRPkt9uFk5/jqw1K/vVP1RT4jLHiW/HL4l17nLhtx8OUm/bmv0BZPMXxEvsn6xPt59PSabNHLiUl/kuaTOZotPOOCNrczdHVS5FAJMA4ABAAwAAAYCGBEBjIGgJfIiTQUAABIXQRJDAQhgADAQAMQCGIAAYAxI8/4roMmJ+fp03Nvlrqj0JRnjGcJQkrUlT+ZLNXnim1JfmXP/2Qjs7Tf1L9X8OrXzajMZP3POK3PzTQpLgnp1PMnzfp2K7/AClcJ6s47IcI1TUl2JRTWcvI/DjWKEXKUUnJ9E27bL4SnSsJ5ZJqC4HVKS2Qw6f87kgkOkIrM+nU1ycnUaRPnazqCcE+hLIms/a6o+E45f3FepwxguUV8dGjovSOW74kY5pjjjxrqZt1Jcjx54v+8tlGl+Vr7mdS56FucV/y+y/9jAqxz8vb3j+jNqknG12Ja7FHPp0lybzqXXPrnPTHKiK5LXe58VZVTvc14tWMAANMgAAAADABAMAAAJABAkMAJAAAWDIgMQgGRTASGAgGIBAMQCGIBp0IYAMLq76mbL3S7mxooyxpnPqNRTKLlwTPc3JsjQA4JvgjJDATfBCTsGRZBqAAAcRSEBCUVLllflt/2r7F6RI1KzYotJdETUEiRNSNIpIsSJyXBBkqixsB9SvdSJyZXLhjWYpnzJibJz5kyJrmpSLIdETUu5GpJvjgj5W7qy4dYytgXeUu7I+UvVl9RdQUeSl3FHDFPp+pf+VkZJjFRVBJdCSil2JJEhQAAQIKGBAAYhgRZElIUMRJDAQAMQCGIKBjEAhiGAgGIaAQr9SRXPnhkHn8sdsmiMJWjbqFcn9TmVtlZrPUaYM15NNjyJPIr+ZzFJot82TpbmjdxZbpq1XiGfTcR6HPnrsk+X+wR1LtV9yf4xSdszrV5jbjTnyy/UZIvaMjXRUh7TeMtDiOpFiWMlRJpEWhpCXQlQJUVYiGJiABoBgIBAhiGIaIolQBQAEASGIoAAkRGIBCGAxCJCGIQhsiAgSZFsAKc/5H9DnpHRz/AJH9DnLozn03zThxJMnGMUhFVtZFkoKSpm7BiUP7fqZnEswzpp9CXGepp1tNKmVOJfHJfVFcjNaiMkRolIi0aqEQ5HYJUBJIaQIsYDv0GTSQJCsYohGSA6aZJDIgaGI0UtTqcenVSlyUueOzn5NfrXDdTr3pL+TvPguR3yNnNj4jlxpufxL2Rkz+KYnmUYLJxK+Fxdfua+qqujqPFpQye/qb8GsjlgmuxzdRonv8zG68zd8Pe0dHDpvL07g3bOlnXLdrrCZJiZplDYgEAhhYARbBsYCBsG2RbAAEnwJsj1YFc5d30RXu+RNpElBHPvrHTmciclz2OdKLb4N+VXF11OYnTPPb7ejjDVtl1IvglZHdtOjmtEdjBpS4GlQUXJklaKsacpKLdXwSToy+JauOh02TUTdKCvj1CeuV4n4tg8Ow7sktzdXGK5bPN63xfUame+c3Fd4xdJFWq1E9ZnlnyO5SbZQ1Tfpfp2PZxzI83XWq3Od/CS3UV3ZJPkUXZ01ylWUilRfMqlRmtRCiElY0gohBolRFkiJEBpEgRJARZX5cHkcYrm77li2ynKM5ceWubq7r9DSSeulmp1Oh0GGWHS4lFxdO+rOZg8Hy5s3h+Fy3QVNJS4r07EOu2eSE+yRo/CTnpckscZfE6OvXNnqPPzea7rXicHj8qEkvVSf6GiGKbcUukXT9yny8cXCDgrtdSXj+ph+G8lRrfNV9Tz+Mx27rVqoS8vJBPl8P7kXilHLJSXCVFfiGSWn0zbjtk1XJztH4hLd5OWNqtt+qZ2655s9OPVxv8yXlPndEt/kzi16ck0+xw9Pq5Q1cJWpRk6aXuj0Oom1DJa/ua68r8KY9fmOqJkLvkrWRdjRxaFkdkG0Lc32YGD1IuQncuxDrySdEAFKiUeiI8smo8ikOiTfAkixdgk/UhOSiiDbk+KJvhCOd4hqPK06UHU56MzpbdRyNRqJZs8pt2272+xnSvhmXezjfLfV9n+pux51HHGLVs58b6rrz/wBT3SJMqUiVnN0TQbTOdfqpPJHDjvfklVLtbGnqktPCdWljcn6U+Tx3imebJqHGMspzgtkXGdx49UHVnMnpFm1eozShLLk6Qi6UfQluTxxnFy3q1K+j9j0o8q3+I4/NzS2qknwyuepjiiuLb9TPjVpPhL0/ghnSko37r9zodMZnGSEGpbpRuufkZ2WO7knFGG3s8fX9v4Ncbp0cYrcuoSlsdWlynTot8QwS0+olg1EHDIlfK7mkfUXWPSPCEcVZH068+nRGqjqyyPJFcJVZKiuuOhKhDJEQGTRFFkUFRJIkhIkhoBkWiSREDjSUZyg+jdGnG8eFbsMalNXKT69/4OfiVzky/bJ5JJJ8UzzXf9eu9auTQoLLnxvIvz9/qb8zUn5cFbb5+Rycesjjypxk7qiXi+WWTM4RlxHp9TTKrPKnlnOckul0jL4k5b9r/tXBlxY8mXKoxTb9uxuw6eLx+Xk5l3l6F5uTRq6mN5Yni+Cfl2vjXL+p1cOVauG3Ikt3Lfp7nLw+Ht4Ywa3N22l3Z2MGLycW1vn1fqcfm75x0+Ph9MiviL4ybbjXKfr6HN02ohpM++cqTd11NM8NQ2qKTS7ejuv3MjxKM/Mim3LqvR/8NGF2O7vI6mSUcrlGSafWLFH4lTPP/jsuDnFmfxOmvU6nheflZpPk1vM9pY3KRY2UNjUi6hGCdvkZDc2TUfcYG1k79ihylZL8y+QDjNpEXNIVBQE06Q9yXcqb29SLnXdBUo1ulxwTUgbYe8rrHDVQWXNKLffqIssUFsVqCFKGnKp4Y30rvfqbFJcZJpZYw2zxPrBS/Y1z1Tl/u5M+XO8k3J2/r1Mc1uI3m3HLx55af+nKLXmRblHL3TXfscqXjU808jbjGTbcY80n6M5uo1GTUZFvluvokq+xRHE+ZStrjld/f5HrnxSVwvytUdJi22v6kn/9nb/kzObNsYrEp5G4wT5lJ/sbnpoKSjdx6spdT+C8XY9TJx/RkbMeJvS5VLh03+6MTbkr7FmPNLZtkra/8f8A2ZrUw2UYP4HafWP/AHqKcs0JSj1kuPc14FHXaqGmx1GGRq2+yXdmHFkjPcvVcr1OjJR0Xh6e5S1GTmK6vGs/8+n2PX5XOceuNjy5yGPUyi3xz3rmyOqxZNa8eNJQi+ZXxXz/APRo0uLLrNTHDglbk+W+kV6v/upy9DNrO5OUoT6JXJ/Y7Xk5t2/iHLfxs8mP61UWrw2Z4uucZqeWWL3FU9N+b2/JX3Jx06xSjGMmo+hsR59LYylTFGLfQsYUFRGiSRGhgSRJEUSRGiRFokQGRfUg0WsiyomEcCuytIvaIyi7IPNeLPXaXUyWDH50YpXtVWvmcxR15cN5Gb66R7FRs2TzXQnJ57nGDabfbpmPV65aet1Rk/R/Iw7Ob5CeN9mufqdHjjyz3cbXmkpYJ8ydpOjasFdaRnxr+jiN/wCjXjxN9Ul8jj8nq+nX4/ddDcS3cnBn55dGepx8ORz1TTdMxxnkbq5L7I3ePNdbxfmiqmotL1KYuPnRjPpdf7/9mPJn8vPDI5/0d3H/AGv/ALZrx5VLbOLuMlafoy86kcepGZVUXz7fP+SGLPKWojifCk+vc1TSlZxs0HpPE4zu4Tdr2b7idc69NnlZTW5XQUpR7lfmMbkZnblp96T2yNHJxiTUzNlnwxTkyv8AD5Fp9R1pQbXBYsigvMl0XQjPLEa2qKdGXU55zXwOo+pR5km6lNnWwY1GLk+pvmeNTnh1Qj3GZYZZQlaZ0MWbHkVRfJb5sEjFxZ8fzK5UXxy4Y8yRTHdPpdm/w7Qz1WTyvhcFfOSfLf8ABnJjZ5tc9MsXNu1FLmTb6JEsWm8RzL+jpsqT/wDKouP6s9v4R4NpdLBZZqOXL/dknzXyXY62qnCGCaxQitrtqKSRO/k/MTj4v9ryHhfhWv0mTzNTp3GTT+KEouLX1Oh5Mk1cYpnpMkpajH5TW5S5X1Rx82CVf09FN+rba+xxxOemqWOUl8KX3M7liT+JKzUnLHFRxwhGPyjRnnKUHcJL3pm9c2JLKv7YFkdTBLv9yvE0r3Rd+v8A6Loxk1ykyafV8vNKOPFdJyr9Cm23bZ1NXoZYNPm1ctH/APlOUorJj+Jxkk3XV9DjS1SyZ5Zcub+m3GLf5YRlJp32dM31ZzJJ88c+nQuDWYYU5Ltv2rdx8/2PP14PFc2E66r/AE5tJpvESxT2y1UHja4UpRp/odDwvXy8RWRLbwqp9zyfpfHHp8vLr26yJEYosqEqGiRFAAgJokRGiQE0xkESXUgklZFolJdSOGcM+JSjcZR6qSqgRKiLRcQlygqq2ZtXrMeBOMpcvobmLJzbdJGHXeGQ1+FOTayfkkvR9mFFc/Fsu2oSS+bWxL65PiX2TMuTDkxzcMsXCS7NVRKUk1wz0c8c+nnt6stXrO7tL5Iy1Pcy1sk4roa5sZm/QxR50Wt6EoyTfG39C3HFRS9SrDhlxfTsXbUo/JnLtrIF/wDwS/ckndlE8ix14mFPm4p38BrF3yezXxfxvtgzvHilBRVJEsrU2ml0KdTH4VJPnuyNJzPZKt8JquH0ObqMuzx7DF9JJSa/k0YslPbJ0J+Vkm5S6y6Cd61K89qseSGvntkuWu+1mVTcXwdnUaVZo89erOX+BlDJJTa4dqkdIzYvUsub82XZC+i7mlwXCaqK7GdNLHGKVvksMqm8c5epTDI8cnjmuEzq7/OVTX1Of4tp9j8yC4l19zbBTfyLJz1JF55skrl6XT5dVnjjxxdyfV9F6s9P4Zo4aLS7Vw6tgvCdA9H5Waa2PFG69X0R1px29XaNfJ1uyRnjjPdJdNjS5RZWOaaTSakvuYdFJtv4a+VmrOm4OjpHKujpvhwRdf8AJLa79EkQyr/n38Jeo5dPqZdZhcZRo0wpvk1Z1FTQ4xvC+ykk0RhFPbJrlOzRGCXUrcUlXrcTrv7qDjCmq5/QOGMAAYhjkAuORgAEkLgAGiQmAwIkkAANeqyP8Lr5J2vLdC8P18NXgU2lGa4lFunFgAG4zf5vGdv5+SNKSfpYAUS26uN5s9Q2yyenUvg5JcXwABpKi+pZgmrbSXHQAIlEJbuyaMef45tRdLv7gAV1YOO1tJ/UlmgpRpdQAI5+TCovmvqU+Wr6jALBkS5JQjFJrsBHmstXTXwZPD9G19zJqvDMGqx0+nfkAGFc2XgcIv8ApZlvffavqV+RmxVXNes0AHRhc6cJr4jTptd5ijHI7S7mHZ5E1CapdgADp48+NwUlfJRqdJHNFtcTXcAOLTg6jQ5MFvhou1Gjc41HkANWpMVaTfj5ZucNqpAANWtcyEXZZDGACaaSRJEkAGSI+oARJIYATBsAAABAMC//2Q==";
          
          // Process document
          const scannedDoc = documentScanService.processScannedDocument(sampleDocument, "Document Scan " + (scannedDocuments.length + 1));
          
          // Set success state
          setScannerState("success");
          setSelectedDocument(scannedDoc);
          setActiveTab("documents");
          
          toast({
            title: "Document scanned",
            description: "Your document has been successfully scanned and sent to browser",
          });
        }
        return newProgress;
      });
    }, 300);
  };

  // Clear scanned documents
  const clearDocuments = () => {
    documentScanService.clearDocuments();
    setSelectedDocument(null);
    
    toast({
      title: "Documents cleared",
      description: "All scanned documents have been removed",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Mobile Scanning</h2>
        <p className="text-muted-foreground">
          Connect your mobile device to scan documents and view them instantly in your browser.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="connection" className="flex-1">
            <div className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              <span>Connection</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex-1">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Documents {scannedDocuments.length > 0 && `(${scannedDocuments.length})`}</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="connection" className="space-y-4 mt-4">
          {scannerState === "success" && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Device Connected</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {deviceName ? (
                      <>Your account is linked with <span className="font-medium">{deviceName}</span></>
                    ) : (
                      <>Connection established with session ID: <span className="font-medium">{sessionId?.substring(0, 8)}</span></>
                    )}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                    <Button
                      variant="default"
                      onClick={simulateDocumentScan}
                      className="flex-1"
                    >
                      <Scan className="h-4 w-4 mr-2" />
                      Scan Document
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={unpairDevice}
                      className="flex-1"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {scannerState === "disconnected" && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center
