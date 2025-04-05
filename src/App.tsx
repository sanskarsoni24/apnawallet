
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
import { checkForDueDocuments, createAppNotification } from "./services/NotificationService";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import StripeCheckout from "./pages/StripeCheckout";

const queryClient = new QueryClient();

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
          title: "Welcome to DocuNinja",
          description: "Upload and manage your important documents with ease.",
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
    
    // Remove the demo notifications that were creating too much noise
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, [documents, email, userSettings]);

  return null;
};

const App = () => {
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
                <Route path="/" element={<Index />} />
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
