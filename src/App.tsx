
import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from 'sonner';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import Documents from './pages/Documents';
import Dashboard from './components/dashboard/Dashboard';
import UserProfile from './pages/UserProfile';
import Help from './pages/Help';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import DownloadApp from './pages/DownloadApp';
import { useUser } from './contexts/UserContext';
import MobileApp from './pages/MobileApp';
import StripeCheckout from './pages/StripeCheckout';
import Monetization from './pages/Monetization';
import DashboardPDFTools from './components/dashboard/DashboardPDFTools';
import PDFTools from './pages/PDFTools';

function App() {
  const { isLoggedIn, userSettings } = useUser();

  // Set theme based on user preference
  useEffect(() => {
    if (userSettings.theme) {
      const root = window.document.documentElement;
      
      if (userSettings.theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.remove('light', 'dark');
        root.classList.add(systemTheme);
      } else {
        root.classList.remove('light', 'dark');
        root.classList.add(userSettings.theme);
      }
    }
  }, [userSettings.theme]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster richColors closeButton position="bottom-right" />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/signin" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <SignIn />} />
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/download" element={<DownloadApp />} />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
              <DashboardPDFTools />
            </ProtectedRoute>
          } />
          <Route path="/pdf-tools" element={<ProtectedRoute><PDFTools /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
          <Route path="/mobile" element={<ProtectedRoute><MobileApp /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><StripeCheckout /></ProtectedRoute>} />
          <Route path="/premium" element={<ProtectedRoute><Monetization /></ProtectedRoute>} />

          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
