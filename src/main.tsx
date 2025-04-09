
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UserProvider } from './contexts/UserContext';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './components/ui/theme-provider';
import './index.css';
import { initMobileApp, initPushNotifications } from './utils/capacitor';

// Initialize mobile functionality if running on a mobile device
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initMobileApp();
    await initPushNotifications();
  } catch (err) {
    console.error('Error initializing mobile app:', err);
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="suraksha-ui-theme">
        <UserProvider>
          <App />
          <Toaster />
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
