
import React from "react";
import DocumentTimeline from "../documents/DocumentTimeline";
import { useDocuments } from "@/contexts/DocumentContext";
import BlurContainer from "../ui/BlurContainer";
import RecentDocuments from "../documents/RecentDocuments";
import { Clock, Upload, AlertTriangle, CheckCircle, FileText } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import CloudStorage from "../storage/CloudStorage";

const Dashboard = () => {
  const { documents, filterDocumentsByType } = useDocuments();
  const navigate = useNavigate();
  
  // Filter out documents in the secure vault
  const nonVaultDocuments = documents.filter(doc => !doc.inSecureVault);
  
  // Get counts for different document statuses
  const overdueCount = nonVaultDocuments.filter(doc => doc.daysRemaining !== undefined && doc.daysRemaining < 0).length;
  const dueSoonCount = nonVaultDocuments.filter(doc => doc.daysRemaining !== undefined && doc.daysRemaining >= 0 && doc.daysRemaining <= 7).length;
  const completedCount = nonVaultDocuments.filter(doc => doc.status === "completed").length;
  const totalDocuments = nonVaultDocuments.length;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status summary cards */}
        <BlurContainer className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-medium">Total Documents</h3>
              <p className="text-2xl font-bold">{totalDocuments}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/documents")}>
            View All Documents
          </Button>
        </BlurContainer>
        
        <BlurContainer className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-medium">Due Soon</h3>
              <p className="text-2xl font-bold">{dueSoonCount}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/documents?filter=upcoming")}
          >
            View Due Soon
          </Button>
        </BlurContainer>
        
        <BlurContainer className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-medium">Overdue</h3>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{overdueCount}</p>
                {overdueCount > 0 && (
                  <Badge variant="destructive" className="ml-2">Action Required</Badge>
                )}
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/documents?filter=expired")}
          >
            View Overdue
          </Button>
        </BlurContainer>
        
        <div className="md:col-span-3">
          <DocumentTimeline />
        </div>
        
        <div className="md:col-span-3">
          <RecentDocuments />
        </div>
      </div>
      
      <div className="space-y-6">
        <BlurContainer className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-medium">Completed</h3>
          </div>
          
          <div className="mb-3">
            <p className="text-3xl font-bold">{completedCount}</p>
            <p className="text-sm text-muted-foreground">Documents completed</p>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full" 
            size="sm"
            onClick={() => navigate("/documents?filter=completed")}
          >
            View Completed
          </Button>
        </BlurContainer>
        
        <BlurContainer className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Upload className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-lg font-medium">Add Document</h3>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Upload a new document to keep track of important deadlines.
          </p>
          
          <Button 
            className="w-full" 
            onClick={() => navigate("/documents")}
          >
            Upload Document
          </Button>
        </BlurContainer>
        
        {/* Add the new CloudStorage component */}
        <CloudStorage />
      </div>
    </div>
  );
};

export default Dashboard;
