
import React, { useEffect, useState } from 'react';
import { initMobileServices, getDeviceInfo } from '@/services/MobileServices';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import { toast } from '@/hooks/use-toast';
import useMobileApp from '@/hooks/use-mobile-app';

export const MobileInitializer: React.FC = () => {
  const { isCapacitorApp } = useMobileApp();
  const [isInitialized, setIsInitialized] = useState(false);
  const { userSettings, updateUserSettings } = useUserSettings();

  useEffect(() => {
    const setupMobileApp = async () => {
      if (!isCapacitorApp) return;
      
      try {
        // Initialize mobile services
        await initMobileServices();
        
        // Get device info and update settings
        const deviceInfo = await getDeviceInfo();
        if (deviceInfo) {
          const deviceName = `${deviceInfo.manufacturer} ${deviceInfo.model}`;
          
          // Only update if the device name has changed or isn't set
          if (!userSettings.mobileDeviceName || userSettings.mobileDeviceName !== deviceName) {
            updateUserSettings({
              mobileDeviceName: deviceName
            });
          }
        }
        
        setIsInitialized(true);
        
        // Show toast notification
        toast({
          title: "Mobile app initialized",
          description: "SurakshitLocker mobile features are ready to use"
        });
        
      } catch (error) {
        console.error('Error initializing mobile app:', error);
        toast({
          title: "Mobile initialization failed",
          description: "There was an error setting up mobile features",
          variant: "destructive"
        });
      }
    };
    
    setupMobileApp();
  }, [isCapacitorApp, updateUserSettings, userSettings.mobileDeviceName]);
  
  // This component doesn't render anything, it just initializes mobile services
  return null;
};

export default MobileInitializer;
