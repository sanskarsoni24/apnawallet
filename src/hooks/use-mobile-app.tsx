
import { useEffect, useState } from 'react';
import { isMobileApp } from '@/services/MobileServices';
import { useIsMobile } from './use-mobile';

export function useMobileApp() {
  const [isCapacitorApp, setIsCapacitorApp] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const isMobileDevice = useIsMobile();

  useEffect(() => {
    const checkIfMobileApp = async () => {
      try {
        const result = await isMobileApp();
        setIsCapacitorApp(result);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error checking if mobile app:', error);
        setIsCapacitorApp(false);
        setIsInitialized(true);
      }
    };

    checkIfMobileApp();
  }, []);

  return {
    isCapacitorApp,
    isMobileDevice,
    isInitialized,
    isRunningInBrowser: isInitialized && !isCapacitorApp
  };
}

export default useMobileApp;
