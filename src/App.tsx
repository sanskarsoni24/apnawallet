
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Help from "@/pages/Help";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import Documents from "@/pages/Documents";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { UserProvider } from "@/contexts/UserContext";
import UserSettingsProvider from "@/contexts/UserSettingsContext";
import Settings from "@/pages/Settings";
import UserProfile from "@/pages/UserProfile";
import { DocumentProvider } from "@/contexts/DocumentContext";
import { Toaster } from "@/components/ui/sonner";
import { MobileBanner } from "@/components/ui/MobileBanner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MobileApp from "./pages/MobileApp";
import DownloadApp from "./pages/DownloadApp";
import DesktopApp from "./pages/DesktopApp";
import Monetization from "./pages/Monetization";
import StripeCheckout from "./pages/StripeCheckout";
import MobileInitializer from "@/components/mobile/MobileInitializer";

// Create a new query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const [isBannerDismissed, setIsBannerDismissed] = useState(() => {
    return localStorage.getItem("mobile_banner_dismissed") === "true";
  });

  const handleDismissBanner = () => {
    localStorage.setItem("mobile_banner_dismissed", "true");
    setIsBannerDismissed(true);
  };

  const showBanner = !isBannerDismissed && localStorage.getItem("mobile_banner_shown") === "true";

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <UserSettingsProvider>
          <DocumentProvider>
            <Router>
              {/* Initialize mobile services */}
              <MobileInitializer />
              
              {/* Banner for mobile app download */}
              {showBanner && <MobileBanner onDismiss={handleDismissBanner} />}
              
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/help" element={<Help />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/mobile-app" element={<MobileApp />} />
                <Route path="/download-app" element={<DownloadApp />} />
                <Route path="/desktop-app" element={<DesktopApp />} />
                <Route path="/pricing" element={<Monetization />} />
                <Route path="/checkout/:plan" element={<StripeCheckout />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<UserProfile />} />
                </Route>
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </Router>
          </DocumentProvider>
        </UserSettingsProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
