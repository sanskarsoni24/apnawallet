
import React, { useState, useEffect } from "react";
import Header from "./Header";
import MobileBanner from "@/components/ui/MobileBanner";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  const [showMobileBanner, setShowMobileBanner] = useState<boolean>(false);
  const location = useLocation();
  
  useEffect(() => {
    // Check if the user is on a mobile device
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    // Don't show the banner on the mobile app page itself or if already dismissed
    // or if the user has already been shown the banner
    const shouldShowBanner = 
      isMobileDevice && 
      !location.pathname.includes("/mobile-app") &&
      !location.pathname.includes("/download-app") &&
      localStorage.getItem('mobile_banner_dismissed') !== 'true' &&
      localStorage.getItem('mobile_banner_shown') !== 'true';
    
    setShowMobileBanner(shouldShowBanner);
    
    // Mark that we've shown the banner to this user
    if (shouldShowBanner) {
      localStorage.setItem('mobile_banner_shown', 'true');
    }
    
    // First time mobile visitors get redirected to mobile app page after a delay
    // but only once and only on first visit
    const isFirstVisit = !localStorage.getItem('visited_before');
    
    if (isFirstVisit && isMobileDevice && location.pathname === "/") {
      localStorage.setItem('visited_before', 'true');
    }
  }, [location.pathname]);

  const handleDismissBanner = () => {
    setShowMobileBanner(false);
    localStorage.setItem("mobile_banner_dismissed", "true");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={cn("flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full", className)}>
        {children}
      </main>
      {showMobileBanner && <MobileBanner onDismiss={handleDismissBanner} />}
    </div>
  );
};

export default Container;
