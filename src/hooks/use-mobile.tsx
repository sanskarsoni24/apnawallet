
import { useState, useEffect } from 'react';
import { isMobileApp } from '../utils/capacitor';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';

// Custom hook to detect mobile browser
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  return isMobile;
}

// Keep for backward compatibility 
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// Hook to check if running in native app via Capacitor
export function useIsNativeApp() {
  const [isNative, setIsNative] = useState(false);
  
  useEffect(() => {
    setIsNative(isMobileApp());
  }, []);
  
  return isNative;
}

// Hook for mobile-optimized platform detection
export function usePlatform() {
  const [platform, setPlatform] = useState<'web' | 'android' | 'ios' | 'desktop'>('web');
  
  useEffect(() => {
    const detectPlatform = async () => {
      // Check if native mobile app
      if (Capacitor.isNativePlatform()) {
        try {
          const info = await Device.getInfo();
          setPlatform(info.platform as 'android' | 'ios');
        } catch (err) {
          console.error('Error detecting mobile platform:', err);
          setPlatform('web');
        }
        return;
      }
      
      // Check if desktop or mobile web
      if (window.innerWidth >= 1024) {
        setPlatform('desktop');
      } else {
        setPlatform('web');
      }
    };
    
    detectPlatform();
  }, []);
  
  return platform;
}
