
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// import { SplashScreen } from "@capacitor/splash-screen"; // Commented out for web build

// Initialize Capacitor for native mobile functionality
document.addEventListener('DOMContentLoaded', () => {
  // Hide splash screen after app load (if running in Capacitor)
  try {
    // SplashScreen.hide(); // Uncomment when using Capacitor
    console.log('App loaded successfully');
  } catch (error) {
    console.error('Error during app initialization:', error);
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
