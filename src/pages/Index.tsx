
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@/components/layout/Container";
import Dashboard from "@/components/dashboard/Dashboard";
import LandingPage from "@/components/landing/LandingPage";
import { useUser } from "@/contexts/UserContext";
import SurakshaLocker from "@/components/suraksha/SurakshaLocker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, LayoutDashboard, Calendar, Clock, ArrowRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import SurakshitLogo from "@/components/ui/SurakshitLogo";
import BlurContainer from "@/components/ui/BlurContainer";
import FullScreenCalendar from "@/components/calendar/FullScreenCalendar";

interface IndexProps {
  defaultTab?: "dashboard" | "locker" | "calendar";
}

const Index = ({ defaultTab = "dashboard" }: IndexProps) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();
  const [activeTab, setActiveTab] = useState<"dashboard" | "locker" | "calendar">(defaultTab);
  const [guideDismissed, setGuideDismissed] = useState<boolean>(false);
  
  // Set the active tab when defaultTab changes
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);
  
  // Check if user has seen the guide before
  useEffect(() => {
    const dismissed = localStorage.getItem("guide_dismissed") === "true";
    setGuideDismissed(dismissed);
  }, []);

  // Effect to navigate to full calendar when "calendar" tab is selected
  useEffect(() => {
    if (activeTab === "calendar") {
      // We'll show the calendar directly in this component instead of navigating
    }
  }, [activeTab, navigate]);
  
  if (!isLoggedIn) {
    return (
      <Container>
        <LandingPage />
      </Container>
    );
  }

  // If calendar tab is active, render the full-screen calendar
  if (activeTab === "calendar") {
    return <FullScreenCalendar />;
  }
  
  return (
    <Container>
      {/* Hero Section for ApnaWallet */}
      <div className="mb-10 relative overflow-hidden">
        <BlurContainer variant="dark" className="p-8 md:p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 -z-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                <SurakshitLogo size="lg" />
                <h1 className="text-3xl md:text-4xl font-bold text-white">ApnaWallet</h1>
              </div>
              <p className="text-lg text-white/80 max-w-xl leading-relaxed">
                Your private vault for securing sensitive information. Store passwords, notes, and documents with enterprise-grade end-to-end encryption.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                  <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                  <span className="text-sm text-white/80">End-to-end Encrypted</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                  <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                  <span className="text-sm text-white/80">Zero-knowledge Architecture</span>
                </div>
              </div>
            </div>
          </div>
        </BlurContainer>
      </div>
      
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "dashboard" | "locker" | "calendar")} 
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-xl mx-auto mb-8 bg-slate-100 dark:bg-slate-800/70 rounded-lg overflow-hidden">
          <TabsTrigger value="dashboard" className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white py-3 rounded-none">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4 text-indigo-600 group-data-[state=active]:text-white" />
              <span>Dashboard</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="locker" className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white py-3 rounded-none">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-600 group-data-[state=active]:text-white" />
              <span>Security Vault</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white py-3 rounded-none">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-indigo-600 group-data-[state=active]:text-white" />
              <span>Calendar</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="locker" className="animate-fade-in">
          <SurakshaLocker />
        </TabsContent>
        
        <TabsContent value="dashboard" className="animate-fade-in">
          <Dashboard />
        </TabsContent>

        {/* Calendar tab content is rendered in full screen mode */}
      </Tabs>
      
      {/* Quick Access Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <BlurContainer 
          className="p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300" 
          variant="elevated"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-semibold text-lg">Upcoming Deadlines</h3>
          </div>
          <p className="text-muted-foreground mb-6">Keep track of document due dates and never miss important deadlines.</p>
          <Button 
            onClick={() => setActiveTab("calendar")} 
            variant="outline" 
            className="w-full bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800/30 text-amber-700 dark:text-amber-400 hover:from-amber-100 hover:to-amber-200 dark:hover:from-amber-900/30 dark:hover:to-amber-800/30"
          >
            View Calendar
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </BlurContainer>
        
        <BlurContainer 
          className="p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300" 
          variant="elevated"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-semibold text-lg">Secure Storage</h3>
          </div>
          <p className="text-muted-foreground mb-6">Store sensitive information securely in your encrypted private vault.</p>
          <Button 
            onClick={() => setActiveTab("locker")} 
            variant="outline" 
            className="w-full bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-800/30 text-indigo-700 dark:text-indigo-400 hover:from-indigo-100 hover:to-indigo-200 dark:hover:from-indigo-900/30 dark:hover:to-indigo-800/30"
          >
            Access Locker
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </BlurContainer>
        
        <BlurContainer 
          className="p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300" 
          variant="elevated"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Upload className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-semibold text-lg">Upload Documents</h3>
          </div>
          <p className="text-muted-foreground mb-6">Upload and securely store your important documents and files.</p>
          <Button 
            onClick={() => navigate("/documents")} 
            variant="outline" 
            className="w-full bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800/30 text-emerald-700 dark:text-emerald-400 hover:from-emerald-100 hover:to-emerald-200 dark:hover:from-emerald-900/30 dark:hover:to-emerald-800/30"
          >
            Upload Documents
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </BlurContainer>
      </div>
    </Container>
  );
};

export default Index;
