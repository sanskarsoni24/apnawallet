
import React, { useState } from "react";
import Header from "./Header";
import MobileBanner from "@/components/ui/MobileBanner";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  const [showMobileBanner, setShowMobileBanner] = useState<boolean>(
    localStorage.getItem('mobile_banner_dismissed') !== 'true' &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );

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
