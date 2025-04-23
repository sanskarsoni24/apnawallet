import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"

import Index from './pages/Index';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import UserProfile from './pages/UserProfile';
import SurakshaLocker from './components/suraksha/SurakshaLocker';
import MobileApp from './pages/MobileApp';
import DownloadApp from './pages/DownloadApp';
import Help from './pages/Help';
import { UserProvider } from './contexts/UserContext';
import { DocumentProvider } from './contexts/DocumentContext';
import UserSettingsProvider from './contexts/UserSettingsContext';
import MobileLayout from "@/components/layout/MobileLayout";
import { useMobile } from "@/hooks/use-mobile";

const App = () => {
  const { isMobile } = useMobile();
  
  useEffect(() => {
    // Set a flag in localStorage if the app is running in standalone mode
    if ((window.matchMedia('(display-mode: standalone)').matches) || (window.navigator as any).standalone) {
      localStorage.setItem('isStandalone', 'true');
    } else {
      localStorage.removeItem('isStandalone');
    }
  }, []);

  // Wrap routes with MobileLayout for mobile devices
  if (isMobile) {
    return (
      <UserProvider>
        <DocumentProvider>
          <UserSettingsProvider>
            <Routes>
              <Route path="/" element={<MobileLayout><Index /></MobileLayout>} />
              <Route path="/documents" element={<MobileLayout title="Documents"><Documents /></MobileLayout>} />
              <Route path="/locker" element={<MobileLayout title="Security Vault"><SurakshaLocker /></MobileLayout>} />
              <Route path="/settings" element={<MobileLayout title="Settings"><Settings /></MobileLayout>} />
              <Route path="/profile" element={<MobileLayout title="Profile"><UserProfile /></MobileLayout>} />
              <Route path="/mobile-app" element={<MobileLayout title="Mobile App"><MobileApp /></MobileLayout>} />
              <Route path="/download-app" element={<MobileLayout title="Download App"><DownloadApp /></MobileLayout>} />
              <Route path="/help" element={<MobileLayout title="Help"><Help /></MobileLayout>} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<MobileLayout><NotFound /></MobileLayout>} />
            </Routes>
            <Toaster />
          </UserSettingsProvider>
        </DocumentProvider>
      </UserProvider>
    );
  }

  return (
    <UserProvider>
      <DocumentProvider>
        <UserSettingsProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/locker" element={<SurakshaLocker />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/mobile-app" element={<MobileApp />} />
            <Route path="/download-app" element={<DownloadApp />} />
            <Route path="/help" element={<Help />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </UserSettingsProvider>
      </DocumentProvider>
    </UserProvider>
  );
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;
