import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import Index from "@/pages/Index";
import Documents from "@/pages/Documents";
import Settings from "@/pages/Settings";
import Authentication from "@/pages/Authentication";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { Toaster } from "@/components/ui/toaster";
import DesktopAppPage from "@/pages/DesktopAppPage";

const AppContent: React.FC = () => {
  const { isLoggedIn, isInitialized } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isInitialized) {
      setLoading(false);
    }
  }, [isInitialized]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/auth" element={isLoggedIn ? <Navigate to="/" /> : <Authentication />} />
      <Route path="/" element={isLoggedIn ? <Index /> : <Navigate to="/auth" />} />
      <Route path="/documents" element={isLoggedIn ? <Documents /> : <Navigate to="/auth" />} />
      <Route path="/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/auth" />} />
      <Route path="/desktop-app" element={<DesktopAppPage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="surakshit-theme">
      <UserProvider>
        <Router>
          <AppContent />
        </Router>
        <Toaster />
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
