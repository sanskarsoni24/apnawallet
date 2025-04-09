
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import Monetization from "./pages/Monetization";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { DocumentProvider, useDocuments } from "./contexts/DocumentContext";
import { UserProvider, useUser } from "./contexts/UserContext";
import { toast } from "@/hooks/use-toast";
import { checkForDueDocuments, createNotification } from "./services/NotificationService";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import StripeCheckout from "./pages/StripeCheckout";
import UserProfile from "./pages/UserProfile";

const queryClient = new QueryClient();

// Set up theme based on localStorage or system preference
const initializeTheme = () => {
  // Check localStorage first
  const storedTheme = localStorage.getItem('theme');
  
  // If value in localStorage, use that
  if (storedTheme) {
    document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    return;
  }
  
  // If no value in localStorage, check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', prefersDark);
  
  // Store the inferred preference
  localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
};

// NotificationCheck component to handle notifications
// This is a separate component to use the hooks inside the providers
const NotificationCheck = () => {
  const { documents } = useDocuments();
  const { email, userSettings } = useUser();
  const [lastNotificationCheck, setLastNotificationCheck] = useState<string | null>(null);

  useEffect(() => {
    const firstVisit = localStorage.getItem("firstVisit") !== "false";
    
    if (firstVisit) {
      setTimeout(() => {
        toast({
          title: "Welcome to SurakshitLocker",
          description: "Your secure vault for managing important documents.",
        });
        localStorage.setItem("firstVisit", "false");
      }, 1000);
    }

    // Check user notification preferences - only once per hour
    const checkNotificationPreferences = () => {
      const now = new Date().toISOString();
      const lastCheck = localStorage.getItem("lastNotificationCheck");
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      
      if (!lastCheck || new Date(lastCheck) < oneHourAgo) {
        // Get preferences from user settings
        const preferences = {
          emailNotifications: userSettings.emailNotifications !== false,
          pushNotifications: userSettings.pushNotifications || false,
          voiceReminders: userSettings.voiceReminders || false,
          reminderDays: userSettings.reminderDays || 3,
          voiceType: userSettings.voiceType || "default"
        };
        
        // Check for documents due soon and send notifications
        checkForDueDocuments(documents, email, preferences);
        
        // Update last check time
        localStorage.setItem("lastNotificationCheck", now);
        setLastNotificationCheck(now);
      }
    };

    // Check for notifications after a short delay
    const initialTimeout = setTimeout(checkNotificationPreferences, 3000);
    
    // Set up checks every 2 hours
    const intervalId = setInterval(checkNotificationPreferences, 2 * 60 * 60 * 1000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, [documents, email, userSettings]);

  return null;
};

const App = () => {
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <DocumentProvider>
            <Toaster />
            <Sonner />
            <NotificationCheck />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Index defaultTab="dashboard" />} />
                <Route path="/locker" element={<Index defaultTab="locker" />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route 
                  path="/documents" 
                  element={
                    <ProtectedRoute>
                      <Documents />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/pricing" element={<Monetization />} />
                <Route path="/checkout" element={<StripeCheckout />} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </DocumentProvider>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
