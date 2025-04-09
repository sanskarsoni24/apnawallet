
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize the app
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(<App />);

// Display a message in the console
console.log(
  "%cSurakshitLocker Document Manager",
  "color: #5f5cff; font-size: 24px; font-weight: bold;"
);
console.log(
  "%cSecurely manage all your important documents.",
  "font-size: 14px;"
);

// Device detection for better user experience
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);

if (isMobileDevice) {
  console.log("Mobile device detected. Optimizing experience...");
  // Store device information in localStorage for responsive adjustments
  localStorage.setItem("device_type", "mobile");
} else {
  console.log("Desktop device detected. Optimizing experience...");
  localStorage.setItem("device_type", "desktop");
}

// Set up automatic redirection to dashboard for returning users
const isReturningUser = localStorage.getItem("returning_user") === "true";
if (isReturningUser && window.location.pathname === "/") {
  window.location.href = "/dashboard";
} else if (window.location.pathname !== "/sign-in" && window.location.pathname !== "/sign-up") {
  // Mark as returning user after first visit
  localStorage.setItem("returning_user", "true");
}
