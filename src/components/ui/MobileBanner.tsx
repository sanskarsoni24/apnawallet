
import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MobileBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  useEffect(() => {
    // Check if this is a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    setIsMobileDevice(isMobile);
    
    // Only show banner on mobile devices and if it hasn't been dismissed
    const bannerDismissed = localStorage.getItem('mobile_banner_dismissed') === 'true';
    if (isMobile && !bannerDismissed) {
      // Delay showing the banner for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const dismissBanner = () => {
    setIsVisible(false);
    localStorage.setItem('mobile_banner_dismissed', 'true');
  };
  
  if (!isVisible || !isMobileDevice) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-indigo-600 text-white p-3 z-50 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3">📱</div>
          <p className="text-sm font-medium">Get our mobile app for the best experience!</p>
        </div>
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="bg-white/20 text-white hover:bg-white/30 mr-2">
                Learn More
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-xl">
              <div className="py-4">
                <h3 className="text-lg font-bold mb-4">SurakshitLocker Mobile App</h3>
                <p className="mb-4">Enjoy additional features with our dedicated mobile app:</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <span>Faster access to documents</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <span>Offline document viewing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <span>Biometric security features</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-500 mr-2">✓</span>
                    <span>Push notifications for document expiry</span>
                  </li>
                </ul>
                <div className="flex flex-col gap-2">
                  <Link to="/download-app">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Mobile App
                    </Button>
                  </Link>
                  {/android/i.test(navigator.userAgent) && (
                    <a 
                      href={`${window.location.origin}/downloads/surakshitlocker.apk`}
                      download="surakshitlocker.apk"
                      className="w-full"
                    >
                      <Button variant="secondary" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Direct APK Download
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <button onClick={dismissBanner} className="p-1 hover:bg-white/20 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileBanner;
