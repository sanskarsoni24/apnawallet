
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { DocumentProvider, useDocuments } from "./contexts/DocumentContext";
import { UserProvider, useUser } from "./contexts/UserContext";
import { toast } from "@/hooks/use-toast";
import { checkForDueDocuments, createAppNotification } from "./services/NotificationService";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

// NotificationCheck component to handle notifications
// This is a separate component to use the hooks inside the providers
const NotificationCheck = () => {
  const { documents } = useDocuments();
  const { email, userSettings } = useUser();

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

    // Check user notification preferences
    const checkNotificationPreferences = () => {
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
    };

    // Check for notifications after a delay
    setTimeout(checkNotificationPreferences, 3000);
    
    // Set up a daily check for notifications
    const intervalId = setInterval(() => {
      checkNotificationPreferences();
    }, 24 * 60 * 60 * 1000); // Once every 24 hours
    
    // Set up an interval to create periodic test notifications (for demo purposes)
    // This would be removed in a production environment
    const demoNotificationId = setInterval(() => {
      const demoMessages = [
        { title: "Document Due Soon", desc: "Your Car Insurance expires in 5 days" },
        { title: "New Document Available", desc: "Your utility bill is ready for review" },
        { title: "Reminder", desc: "Don't forget to renew your subscription" }
      ];
      
      const randomMsg = demoMessages[Math.floor(Math.random() * demoMessages.length)];
      createAppNotification(randomMsg.title, randomMsg.desc);
    }, 60000); // Create a demo notification every minute
    
    return () => {
      clearInterval(intervalId);
      clearInterval(demoNotificationId);
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
