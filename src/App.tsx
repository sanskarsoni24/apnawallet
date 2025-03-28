
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { DocumentProvider } from "./contexts/DocumentContext";
import { UserProvider } from "./contexts/UserContext";
import { toast } from "@/hooks/use-toast";

const queryClient = new QueryClient();

const App = () => {
  // Show welcome notification when app loads
  useEffect(() => {
    const firstVisit = localStorage.getItem("firstVisit") !== "false";
    
    if (firstVisit) {
      setTimeout(() => {
        toast({
          title: "Welcome to DocuNinja",
          description: "Upload and manage your important documents with ease.",
        });
        localStorage.setItem("firstVisit", "false");
      }, 1000);
    }

    // Check for documents that are about to expire
    const checkExpiringDocuments = () => {
      const storedDocs = localStorage.getItem("documents");
      if (storedDocs) {
        try {
          const docs = JSON.parse(storedDocs);
          const expiringDocs = docs.filter(doc => doc.daysRemaining > 0 && doc.daysRemaining <= 3);
          
          if (expiringDocs.length > 0) {
            expiringDocs.forEach(doc => {
              toast({
                title: `${doc.title} expires soon`,
                description: `Only ${doc.daysRemaining} day${doc.daysRemaining !== 1 ? 's' : ''} remaining until due date.`,
                variant: "destructive"
              });
            });
          }
        } catch (e) {
          console.error("Failed to parse documents:", e);
        }
      }
    };

    // Check for expiring documents after a delay
    setTimeout(checkExpiringDocuments, 3000);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <DocumentProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </DocumentProvider>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
