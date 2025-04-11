
import React from "react";
import DashboardPage from "@/components/dashboard/DashboardPage";
import Header from "@/components/layout/Header";

interface IndexProps {
  defaultTab?: string;
}

const Index: React.FC<IndexProps> = ({ defaultTab = "dashboard" }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <DashboardPage tab={defaultTab} />
      </main>
    </div>
  );
};

export default Index;
