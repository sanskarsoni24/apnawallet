
import React from "react";
import { BarChart3, Calendar, FileText, Filter, ArrowRight } from "lucide-react";
import BlurContainer from "../ui/BlurContainer";
import DocumentCard from "../documents/DocumentCard";
import DocumentUpload from "../documents/DocumentUpload";
import DocumentTimeline from "../documents/DocumentTimeline";
import { useDocuments } from "@/contexts/DocumentContext";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const Dashboard = () => {
  const { documents } = useDocuments();
  
  // Calculate upcoming deadlines (docs with due date in next 7 days)
  const upcomingDeadlines = documents.filter(doc => 
    doc.daysRemaining >= 0 && doc.daysRemaining <= 7
  ).length;
  
  // Get recent documents (first 4)
  const recentDocuments = [...documents]
    .sort((a, b) => {
      // Sort by most recently added first (assuming newer documents have higher IDs)
      return Number(b.id) - Number(a.id);
    })
    .slice(0, 4);
  
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your documents and stay on top of your deadlines.
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <BlurContainer className="p-6" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Documents
              </p>
              <h2 className="text-3xl font-bold mt-1">{documents.length}</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            {documents.length > 0 ? `${documents.length} documents in your library` : "No documents yet"}
          </p>
        </BlurContainer>
        
        <BlurContainer className="p-6" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Upcoming Deadlines
              </p>
              <h2 className="text-3xl font-bold mt-1">{upcomingDeadlines}</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className={`text-xs ${upcomingDeadlines > 0 ? "text-primary" : "text-muted-foreground"} mt-4`}>
            {upcomingDeadlines > 0 ? `${upcomingDeadlines} due this week` : "No upcoming deadlines"}
          </p>
        </BlurContainer>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Recent Documents</h2>
            <Link to="/documents" className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              View All <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
          
          {recentDocuments.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {recentDocuments.map((doc) => (
                <DocumentCard key={doc.id} {...doc} />
              ))}
            </div>
          ) : (
            <BlurContainer className="p-8 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">No documents yet</h3>
              <p className="text-muted-foreground mt-2">
                Upload your first document to get started
              </p>
              <Link to="/documents">
                <Button className="mt-4">Add Documents</Button>
              </Link>
            </BlurContainer>
          )}
        </div>
        
        <div className="flex flex-col gap-6">
          <DocumentUpload />
          <DocumentTimeline />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
