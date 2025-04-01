
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { DocumentProvider, useDocuments } from "./contexts/DocumentContext";
import { UserProvider, useUser } from "./contexts/UserContext";
import { toast } from "@/hooks/use-toast";
import { checkForDueDocuments } from "./services/NotificationService";

const queryClient = new QueryClient();

// NotificationCheck component to handle notifications
// This is a separate component to use the hooks inside the providers
const NotificationCheck = () => {
  const { documents } = useDocuments();
  const { email } = useUser();

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
      const userSettings = localStorage.getItem("userSettings");
      if (userSettings) {
        try {
          const settings = JSON.parse(userSettings);
          const preferences = {
            emailNotifications: settings.emailNotifications !== false,
            pushNotifications: settings.pushNotifications || false,
            voiceReminders: settings.voiceReminders || false,
            reminderDays: settings.reminderDays || 3
          };
          
          // Check for documents due soon and send notifications
          checkForDueDocuments(documents, email, preferences);
        } catch (e) {
          console.error("Failed to parse user settings:", e);
        }
      }
    };

    // Check for notifications after a delay
    setTimeout(checkNotificationPreferences, 3000);
    
    // Set up a daily check for notifications
    const intervalId = setInterval(() => {
      checkNotificationPreferences();
    }, 24 * 60 * 60 * 1000); // Once every 24 hours
    
    return () => clearInterval(intervalId);
  }, [documents, email]);

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
                <Route path="/documents" element={<Documents />} />
                <Route path="/settings" element={<Settings />} />
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
