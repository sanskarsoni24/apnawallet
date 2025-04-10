
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
  "%cApnaWallet Document Manager",
  "color: #5f5cff; font-size: 24px; font-weight: bold;"
);
console.log(
  "%cSecurely manage all your important documents.",
  "font-size: 14px;"
);

// Check if running in Electron environment
const isElectron = !!window.navigator.userAgent.match(/Electron/i);
if (isElectron) {
  console.log("Running in desktop app mode with enhanced capabilities");
  document.body.classList.add('electron-app');
  localStorage.setItem("app_mode", "desktop");
  
  // Store device information for responsive adjustments
  localStorage.setItem("device_type", "desktop");
}

// Enhanced device detection for better user experience
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);

// Chrome mobile optimizations
const isChromeMobile = isMobileDevice && /Chrome/i.test(navigator.userAgent);

if (isMobileDevice) {
  console.log("Mobile device detected. Optimizing mobile experience...");
  // Store device information in localStorage for responsive adjustments
  localStorage.setItem("device_type", "mobile");
  
  // Add mobile-specific meta tags programmatically
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  }
  
  // Chrome mobile specific optimizations
  if (isChromeMobile) {
    // Set theme-color for Chrome's address bar
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', '#5f5cff');
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      meta.setAttribute('content', '#5f5cff');
      document.head.appendChild(meta);
    }
    
    // Add Chrome mobile-specific class
    document.body.classList.add('chrome-mobile');
    
    // Optimize for Chrome's pull-to-refresh feature
    document.addEventListener('touchstart', function(e) {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
    
    // Improve scrolling performance on Chrome mobile
    document.addEventListener('touchmove', function(e) {
      // Allow scrolling but optimize performance
    }, { passive: true });
    
    // Set home screen icon for Chrome
    const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (!appleTouchIcon) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'apple-touch-icon');
      link.setAttribute('href', '/apple-touch-icon.png');
      document.head.appendChild(link);
    }
    
    // Add fullscreen mode capability for Chrome PWA
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'manifest');
      link.setAttribute('href', '/manifest.json');
      document.head.appendChild(link);
    }
  }
  
  // Add mobile app banner class to body
  document.body.classList.add('mobile-view');
} else {
  console.log("Desktop device detected. Optimizing experience...");
  localStorage.setItem("device_type", "desktop");
}

// Create a "standalone" display mode detection
const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                    (window.navigator as any).standalone ||
                    document.referrer.includes('android-app://');

if (isStandalone) {
  document.body.classList.add('standalone-mode');
  localStorage.setItem("app_mode", "standalone");
}

// Add information about the mobile app availability
console.log(
  "%cMobile App Available",
  "color: #5f5cff; font-size: 18px; font-weight: bold;"
);
console.log(
  "Scan the QR code from the Mobile App page to download the app."
);

// Add information about the desktop app
console.log(
  "%cDesktop App Available",
  "color: #5f5cff; font-size: 18px; font-weight: bold;"
);
console.log(
  "Visit the Desktop App page to download the desktop version for enhanced features."
);

// Set up automatic redirection to dashboard for returning users
const isReturningUser = localStorage.getItem("returning_user") === "true";
if (isReturningUser && window.location.pathname === "/") {
  window.location.href = "/dashboard";
} else if (window.location.pathname !== "/sign-in" && window.location.pathname !== "/sign-up") {
  // Mark as returning user after first visit
  localStorage.setItem("returning_user", "true");
}
