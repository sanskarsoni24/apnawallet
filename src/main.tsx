
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

// Generate a unique device ID if not exists
const getDeviceId = () => {
  let deviceId = localStorage.getItem("device_id");
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem("device_id", deviceId);
  }
  console.log("Existing session detected with device ID:", deviceId);
  return deviceId;
};

if (isMobileDevice) {
  console.log("Mobile device detected. Optimizing mobile experience...");
  // Store device information in localStorage for responsive adjustments
  localStorage.setItem("device_type", "mobile");
  
  // Add mobile-specific meta tags programmatically
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  }
  
  // Add mobile app banner class to body
  document.body.classList.add('mobile-view');
  
  // Generate device ID
  getDeviceId();
} else {
  console.log("Desktop device detected. Optimizing experience...");
  localStorage.setItem("device_type", "desktop");
  
  // Generate device ID
  getDeviceId();
}

// Add information about the mobile app availability
console.log(
  "%cMobile App Available",
  "color: #5f5cff; font-size: 18px; font-weight: bold;"
);
console.log(
  "Scan the QR code from the Mobile App page to download the app."
);
