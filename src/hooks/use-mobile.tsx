
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Ensure consistent initial value
    onChange()
    
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState<boolean>(false)

  React.useEffect(() => {
    const media = window.matchMedia(query)
    
    // Set initial state
    setMatches(media.matches)
    
    // Define callback for media query change events
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }
    
    // Add event listener
    media.addEventListener("change", listener)
    
    // Cleanup
    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}

// Detect if the device is a mobile device (based on user agent)
export function useIsMobileDevice() {
  const [isMobileDevice, setIsMobileDevice] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkMobileDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      return mobileRegex.test(userAgent.toLowerCase());
    };
    
    setIsMobileDevice(checkMobileDevice());
  }, [])

  return isMobileDevice;
}

// Helper to get unique device ID for session persistence
export function useMobileDeviceId() {
  const [deviceId, setDeviceId] = React.useState<string>('')
  
  React.useEffect(() => {
    // Try to get existing device ID from localStorage
    let storedDeviceId = localStorage.getItem('mobile_device_id');
    
    // If not found, generate a new one
    if (!storedDeviceId) {
      storedDeviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('mobile_device_id', storedDeviceId);
    }
    
    setDeviceId(storedDeviceId);
  }, []);
  
  return deviceId;
}

// Add an alias export to prevent future imports from breaking
export const useMobile = useIsMobile;
