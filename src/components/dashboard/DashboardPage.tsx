import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";
import DashboardRecent from "./DashboardRecent";

interface DashboardPageProps {
  tab: string;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ tab }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();
  
  return (
    <div className="w-full">
      {/* Add PDF Tools Button for quick access */}
      {isLoggedIn && (
        <div className="mb-6 p-4 bg-primary/10 rounded-lg">
          <h3 className="text-lg font-medium mb-2">New Feature: PDF Tools</h3>
          <p className="text-muted-foreground mb-3">
            Try our new PDF tools to view, edit, secure, and manage your PDF documents.
          </p>
          <Button 
            onClick={() => navigate("/pdf-tools")}
            className="flex items-center gap-2"
          >
            <FileIcon className="h-5 w-5" />
            Access PDF Tools
          </Button>
        </div>
      )}
      
      {/* Recent documents section */}
      <DashboardRecent />

      {/* Rest of the dashboard content would go here based on tab */}
      {tab === "locker" && (
        <div className="mt-6">
          {/* Locker-specific content would go here */}
          <h2 className="text-2xl font-semibold mb-4">Secure Document Locker</h2>
          <p className="text-muted-foreground">
            Your most sensitive documents are stored securely in the locker.
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
