
import React from "react";
import { BarChart3, Calendar, FileText, Filter, ArrowRight, Shield, Clock } from "lucide-react";
import BlurContainer from "../ui/BlurContainer";
import DocumentCard from "../documents/DocumentCard";
import DocumentUpload from "../documents/DocumentUpload";
import DocumentTimeline from "../documents/DocumentTimeline";
import DocumentCalendar from "./DocumentCalendar";
import { useDocuments } from "@/contexts/DocumentContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import SurakshitLogo from "../ui/SurakshitLogo";
import { Card } from "../ui/card";

const Dashboard = () => {
  const { documents } = useDocuments();
  const navigate = useNavigate();
  
  // Calculate upcoming deadlines (docs with due date in next 7 days)
  const upcomingDeadlines = documents.filter(doc => 
    doc.daysRemaining >= 0 && doc.daysRemaining <= 7
  ).length;
  
  // Calculate overdue documents
  const overdueDocuments = documents.filter(doc =>
    doc.daysRemaining < 0
  ).length;
  
  // Get recent documents (first 3)
  const recentDocuments = [...documents]
    .sort((a, b) => {
      // Sort by most recently added first (assuming newer documents have higher IDs)
      return Number(b.id) - Number(a.id);
    })
    .slice(0, 3);
  
  const handleTotalDocumentsClick = () => {
    navigate('/documents?filter=All');
  };

  const handleUpcomingDeadlinesClick = () => {
    navigate('/documents?filter=upcoming');
  };

  const handleOverdueClick = () => {
    navigate('/documents?filter=overdue');
  };

  return (
    <div className="grid gap-8">
      <div className="flex items-center justify-between animate-fade-in">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your documents and stay on top of your deadlines.
          </p>
        </div>
      </div>
      
      {/* Main stats cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <BlurContainer 
          variant="elevated" 
          className="p-6 cursor-pointer" 
          hover 
          onClick={handleTotalDocumentsClick}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Documents
              </p>
              <h2 className="text-3xl font-bold mt-1">{documents.length}</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
              <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            {documents.length > 0 
              ? `${documents.length} documents in your secure vault` 
              : "No documents yet"}
          </p>
          <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" 
              style={{ width: `${documents.length > 0 ? 100 : 0}%` }}
            ></div>
          </div>
        </BlurContainer>
        
        <BlurContainer 
          variant="elevated" 
          className="p-6 cursor-pointer" 
          hover 
          onClick={handleUpcomingDeadlinesClick}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Upcoming Deadlines
              </p>
              <h2 className="text-3xl font-bold mt-1">{upcomingDeadlines}</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className={`text-xs ${upcomingDeadlines > 0 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"} mt-4`}>
            {upcomingDeadlines > 0 ? `${upcomingDeadlines} due this week` : "No upcoming deadlines"}
          </p>
          <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" 
              style={{ width: `${upcomingDeadlines > 0 ? Math.min(upcomingDeadlines * 10, 100) : 0}%` }}
            ></div>
          </div>
        </BlurContainer>
        
        <BlurContainer 
          variant="elevated" 
          className="p-6 cursor-pointer" 
          hover 
          onClick={handleOverdueClick}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Overdue Documents
              </p>
              <h2 className="text-3xl font-bold mt-1">{overdueDocuments}</h2>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
              <Clock className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className={`text-xs ${overdueDocuments > 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground"} mt-4`}>
            {overdueDocuments > 0 ? `${overdueDocuments} past due date` : "No overdue documents"}
          </p>
          <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full" 
              style={{ width: `${overdueDocuments > 0 ? Math.min(overdueDocuments * 20, 100) : 0}%` }}
            ></div>
          </div>
        </BlurContainer>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="lg:col-span-2 space-y-6">
          <BlurContainer variant="default" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Documents</h2>
              <Link to="/documents" className="flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                View All <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
            
            {recentDocuments.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-3">
                {recentDocuments.map((doc) => (
                  <DocumentCard key={doc.id} {...doc} />
                ))}
              </div>
            ) : (
              <Card variant="glass" className="p-8 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No documents yet</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your first document to get started
                </p>
                <Link to="/documents">
                  <Button>Add Documents</Button>
                </Link>
              </Card>
            )}
          </BlurContainer>
          
          <BlurContainer variant="default" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Document Timeline</h2>
            </div>
            <DocumentTimeline />
          </BlurContainer>
        </div>
        
        <div className="flex flex-col gap-6">
          <DocumentUpload />
          
          <BlurContainer variant="default" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Calendar</h2>
              <Link to="/documents?view=calendar" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                Full View
              </Link>
            </div>
            <DocumentCalendar />
          </BlurContainer>
          
          <BlurContainer 
            variant="elevated"
            className="p-6 relative overflow-hidden"
            gradient
          >
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-indigo-600/10 dark:bg-indigo-600/5"></div>
            <div className="absolute -left-4 -top-4 w-16 h-16 rounded-full bg-purple-600/10 dark:bg-purple-600/5"></div>
            
            <div className="relative">
              <div className="mb-4 flex items-center gap-3">
                <SurakshitLogo size="md" />
                <h3 className="font-semibold text-lg">Surakshit Vault</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Store sensitive information securely in your private vault with enterprise-grade encryption.
              </p>
              
              <Button variant="outline" className="w-full justify-center border-indigo-200 dark:border-indigo-800">
                <Shield className="h-4 w-4 mr-2" />
                Open Secure Vault
              </Button>
            </div>
          </BlurContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
