
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DocumentsProvider } from './contexts/DocumentContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Help from './pages/Help';
import MobileApp from './pages/MobileApp';
import DownloadApp from './pages/DownloadApp';
import LandingPage from './components/landing/LandingPage';
import ScanToPdf from './pages/ScanToPdf';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <DocumentsProvider>
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<Help />} />
                <Route path="/mobile-app" element={<MobileApp />} />
                <Route path="/download-app" element={<DownloadApp />} />
                <Route path="/scan-to-pdf" element={<ScanToPdf />} />
              </Routes>
            </Router>
          </DocumentsProvider>
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
