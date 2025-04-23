
import { useState, useEffect } from "react";

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobileApp, setIsMobileApp] = useState(false);

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    // Check if running as a Capacitor app
    const checkIfMobileApp = () => {
      const isCapacitor = window.location.href.includes('capacitor://') || 
                          window.location.href.includes('localhost:8080');
      setIsMobileApp(isCapacitor);
    };

    updateDeviceType();
    checkIfMobileApp();

    window.addEventListener("resize", updateDeviceType);
    return () => window.removeEventListener("resize", updateDeviceType);
  }, []);

  return { isMobile, isTablet, isDesktop, isMobileApp };
}
