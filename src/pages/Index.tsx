
import React, { useState } from "react";
import Container from "@/components/layout/Container";
import Dashboard from "@/components/dashboard/Dashboard";
import LandingPage from "@/components/landing/LandingPage";
import { useUser } from "@/contexts/UserContext";
import SurakshaLocker from "@/components/suraksha/SurakshaLocker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, LayoutDashboard, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { isLoggedIn } = useUser();
  const [activeTab, setActiveTab] = useState("locker");
  
  if (!isLoggedIn) {
    return (
      <Container>
        <LandingPage />
      </Container>
    );
  }
  
  return (
    <Container>
      {/* Hero Section for Suraksha Locker */}
      <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold">Suraksha Locker</h1>
            </div>
            <p className="text-lg text-white/90 max-w-xl">
              Your private vault for securing sensitive information. Store passwords, notes, and documents with end-to-end encryption.
            </p>
          </div>
          
          <Button 
            className="bg-white text-indigo-700 hover:bg-white/90 hover:text-indigo-800 px-6 py-6 h-auto text-lg font-semibold shadow-lg"
            onClick={() => setActiveTab("locker")}
          >
            Open Secure Locker
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6 bg-slate-100 dark:bg-slate-800/70">
          <TabsTrigger value="locker" className="group flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-600 group-data-[state=active]:text-white" />
              <span>Suraksha Locker</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="group flex items-center gap-2">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4 text-indigo-600 group-data-[state=active]:text-white" />
              <span>Dashboard</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="locker">
          <SurakshaLocker />
        </TabsContent>
        
        <TabsContent value="dashboard">
          <div className="mb-6">
            <h1 className="text-3xl font-bold dark:text-white">Your Dashboard</h1>
            <p className="text-muted-foreground dark:text-slate-400">
              Manage your documents and track upcoming deadlines
            </p>
          </div>
          <Dashboard />
        </TabsContent>
      </Tabs>
      
      {/* Quick Access Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="p-6 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-lg">Upcoming Deadlines</h3>
          </div>
          <p className="text-muted-foreground mb-4">Keep track of document due dates and never miss important deadlines.</p>
          <Button 
            onClick={() => setActiveTab("dashboard")} 
            variant="outline" 
            className="border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 w-full"
          >
            View Calendar
          </Button>
        </div>
        
        <div className="p-6 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <Shield className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-lg">Secure Storage</h3>
          </div>
          <p className="text-muted-foreground mb-4">Store sensitive information securely in your encrypted private vault.</p>
          <Button 
            onClick={() => setActiveTab("locker")} 
            variant="outline" 
            className="border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 w-full"
          >
            Access Locker
          </Button>
        </div>
        
        <div className="p-6 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-lg">Custom Reminders</h3>
          </div>
          <p className="text-muted-foreground mb-4">Set personalized reminders for important documents and deadlines.</p>
          <Button 
            onClick={() => setActiveTab("dashboard")} 
            variant="outline" 
            className="border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 w-full"
          >
            Manage Reminders
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Index;
