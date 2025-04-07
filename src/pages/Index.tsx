
import React, { useState } from "react";
import Container from "@/components/layout/Container";
import Dashboard from "@/components/dashboard/Dashboard";
import LandingPage from "@/components/landing/LandingPage";
import { useUser } from "@/contexts/UserContext";
import SurakshaLocker from "@/components/suraksha/SurakshaLocker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { isLoggedIn } = useUser();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  if (!isLoggedIn) {
    return (
      <Container>
        <LandingPage />
      </Container>
    );
  }
  
  return (
    <Container>
      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6 bg-slate-100 dark:bg-slate-800/70">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="locker" className="group">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500 group-data-[state=active]:animate-pulse"></span>
              Suraksha Locker
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <Dashboard />
        </TabsContent>
        
        <TabsContent value="locker">
          <div className="mb-6">
            <h1 className="text-3xl font-bold dark:text-white">Suraksha Locker</h1>
            <p className="text-muted-foreground dark:text-slate-400">
              Securely store your confidential information
            </p>
          </div>
          <SurakshaLocker />
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default Index;
