
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Initialize the app
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(<App />);

// Initialize PWA elements for Capacitor
defineCustomElements(window);

// Display a message in the console
console.log(
  "%cSurakshitLocker Document Manager",
  "color: #5f5cff; font-size: 24px; font-weight: bold;"
);
console.log(
  "%cSecurely manage all your important documents.",
  "font-size: 14px;"
);

// Enhanced device detection for better user experience
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);

if (isMobileDevice) {
  console.log("Mobile device detected. Optimizing mobile experience...");
  // Store a persistent device ID for session continuity
  if (!localStorage.getItem('mobile_device_id')) {
    const deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('mobile_device_id', deviceId);
  }
  
  // Store device information in localStorage for responsive adjustments
  localStorage.setItem("device_type", "mobile");
  
  // Add mobile-specific meta tags programmatically
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  }
  
  // Add mobile app banner class to body
  document.body.classList.add('mobile-view');
} else {
  console.log("Desktop device detected. Optimizing experience...");
  localStorage.setItem("device_type", "desktop");
}

// Ensure proper session management
const checkExistingSession = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const deviceId = localStorage.getItem("mobile_device_id");
  
  if (isLoggedIn && deviceId) {
    console.log("Existing session detected with device ID:", deviceId);
    
    // Ensure we have proper user settings in localStorage
    try {
      const userSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
      if (!userSettings.mobileDeviceId && deviceId) {
        userSettings.mobileDeviceId = deviceId;
        userSettings.mobileDeviceName = navigator.userAgent;
        userSettings.lastMobileSync = new Date().toISOString();
        localStorage.setItem("userSettings", JSON.stringify(userSettings));
      }
    } catch (e) {
      console.error("Error parsing user settings:", e);
    }
  }
};

// Run session check
checkExistingSession();

// Add information about the mobile app availability
console.log(
  "%cMobile App Available",
  "color: #5f5cff; font-size: 18px; font-weight: bold;"
);
console.log(
  "Scan the QR code from the Mobile App page to download the app."
);

// Set up automatic redirection to dashboard for returning users
const isReturningUser = localStorage.getItem("returning_user") === "true";
if (isReturningUser && window.location.pathname === "/") {
  window.location.href = "/dashboard";
} else if (window.location.pathname !== "/sign-in" && window.location.pathname !== "/sign-up") {
  // Mark as returning user after first visit
  localStorage.setItem("returning_user", "true");
}
