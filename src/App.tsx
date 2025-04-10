
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Toaster } from "./components/ui/toaster";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import MobileApp from "./pages/MobileApp";
import DownloadApp from "./pages/DownloadApp";
import Help from "./pages/Help";
import UserProfile from "./pages/UserProfile";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import DocumentScannerPage from "./pages/DocumentScanner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MobileResponsive from "./components/ui/mobile-responsive";

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <MobileResponsive />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/mobile-app" element={<MobileApp />} />
            <Route path="/download-app" element={<DownloadApp />} />
            <Route path="/help" element={<Help />} />
            <Route path="/user-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/document-scanner" element={<ProtectedRoute><DocumentScannerPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
