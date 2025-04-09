
import React, { useState, useEffect } from 'react';
import { X, Download, ExternalLink } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface MobileBannerProps {
  onDismiss?: () => void;
}

const MobileBanner: React.FC<MobileBannerProps> = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [directApkUrl, setDirectApkUrl] = useState('');
  
  useEffect(() => {
    // Check if this is a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    setIsMobileDevice(isMobile);
    
    // Set direct APK download URL with absolute path
    const origin = window.location.origin;
    setDirectApkUrl(`${origin}/downloads/surakshitlocker.apk`);
    
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
    if (onDismiss) {
      onDismiss();
    }
  };
  
  const handleDirectApkDownload = (e) => {
    e.preventDefault();
    
    console.log("Starting direct APK download");
    
    // For Android devices, try multiple download methods
    if (/android/i.test(navigator.userAgent)) {
      toast({
        title: "Download Started",
        description: "The APK file is downloading. Check your notifications or downloads folder."
      });
      
      // Method 1: Fetch API with blob
      fetch(directApkUrl)
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.blob();
        })
        .then(blob => {
          // Create downloadable link from blob
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'surakshitlocker.apk';
          link.type = 'application/vnd.android.package-archive';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error('Fetch download failed:', error);
          // Fallback method: Direct anchor link
          const link = document.createElement('a');
          link.href = directApkUrl;
          link.download = 'surakshitlocker.apk';
          link.type = 'application/vnd.android.package-archive';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // If all else fails, open in new tab
          setTimeout(() => {
            window.open(directApkUrl, '_blank');
          }, 1000);
        });
    } else {
      // Non-Android devices go to download page
      window.location.href = "/download-app";
    }
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
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="bg-white/20 text-white hover:bg-white/30 h-8 px-2 whitespace-nowrap"
              >
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
                      href="/downloads/surakshitlocker.apk"
                      className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 inline-flex items-center justify-center rounded-md font-medium h-10 px-4 py-2"
                      onClick={handleDirectApkDownload}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Direct APK Download
                    </a>
                  )}
                  <a 
                    href="#"
                    className="w-full mt-2 bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-50 inline-flex items-center justify-center rounded-md font-medium h-10 px-4 py-2"
                    onClick={() => {
                      dismissBanner();
                      toast({
                        title: "Banner dismissed",
                        description: "You can always access the mobile app from the menu"
                      });
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Dismiss
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <button 
            onClick={dismissBanner} 
            className="p-1 hover:bg-white/20 rounded-full"
            aria-label="Dismiss banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileBanner;
