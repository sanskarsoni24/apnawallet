
import React, { useEffect } from 'react';
import { useIsMobileDevice, useMobileDeviceId } from '@/hooks/use-mobile';
import { useUser } from '@/contexts/UserContext';

/**
 * This component ensures mobile devices are properly detected and
 * user session is consistent across devices
 */
const MobileResponsive: React.FC = () => {
  const isMobileDevice = useIsMobileDevice();
  const deviceId = useMobileDeviceId();
  const { isLoggedIn, updateUserSettings } = useUser();
  
  useEffect(() => {
    // Add mobile-specific classes to the body
    if (isMobileDevice) {
      document.body.classList.add('mobile-device');
    } else {
      document.body.classList.remove('mobile-device');
    }
    
    // Register the device if user is logged in
    if (isLoggedIn && isMobileDevice) {
      updateUserSettings({
        mobileDeviceName: navigator.userAgent,
        mobileDeviceId: deviceId,
        lastMobileSync: new Date().toISOString()
      });
    }
    
    // Add mobile viewport meta tag if needed
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (isMobileDevice && viewportMeta) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Add CSS that improves touch targets on mobile
    if (isMobileDevice) {
      const style = document.createElement('style');
      style.id = 'mobile-adjustments';
      style.innerHTML = `
        /* Increase tap target sizes */
        button, .btn, a, input, select, .form-control {
          min-height: 44px;
        }
        
        /* Improve form spacing on mobile */
        @media (max-width: 768px) {
          .form-group, .form-item {
            margin-bottom: 1.5rem;
          }
          
          input, select, textarea {
            font-size: 16px !important; /* Prevent iOS zoom */
          }
        }
      `;
      
      // Only add if not already present
      if (!document.getElementById('mobile-adjustments')) {
        document.head.appendChild(style);
      }
    }
    
    return () => {
      // Clean up
      const styleElement = document.getElementById('mobile-adjustments');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [isMobileDevice, isLoggedIn, deviceId, updateUserSettings]);
  
  // This component doesn't render anything visible
  return null;
};

export default MobileResponsive;
