
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
} else {
  console.log("Desktop device detected. Optimizing experience...");
}
