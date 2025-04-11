
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDocuments } from "@/contexts/DocumentContext";
import { useUser } from "@/contexts/UserContext";
import { Clock, FileText, X, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const DashboardRecent = () => {
  const { documents } = useDocuments();
  const { userSettings, updateUserSettings } = useUser();
  const navigate = useNavigate();
  
  // Get recent documents
  const recentDocIds = userSettings.recentDocuments || [];
  const recentDocuments = documents
    .filter(doc => recentDocIds.includes(doc.id))
    .sort((a, b) => {
      // Sort by the order in recentDocuments array
      return recentDocIds.indexOf(a.id) - recentDocIds.indexOf(b.id);
    })
    .slice(0, 3); // Only show the top 3 on the dashboard

  const removeFromRecent = (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    
    if (userSettings.recentDocuments) {
      const updatedRecent = userSettings.recentDocuments.filter(id => id !== docId);
      
      updateUserSettings({
        recentDocuments: updatedRecent
      });
      
      toast({
        title: "Document Removed",
        description: "Document removed from recent list"
      });
    }
  };

  const goToDocument = (docId: string) => {
    // Here you could navigate to a specific document page
    // For now, let's just navigate to the documents page
    navigate("/documents");
  };

  if (recentDocuments.length === 0) {
    return null; // Don't show anything if there are no recent documents
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Documents
        </CardTitle>
        <CardDescription>Your recently viewed documents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentDocuments.map(doc => (
            <div 
              key={doc.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
              onClick={() => goToDocument(doc.id)}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{doc.title}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">
                      {doc.type}
                    </Badge>
                    {doc.dueDate && (
                      <span className="ml-2">
                        Due: {format(new Date(doc.dueDate), "MMM d")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {doc.fileURL && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(doc.fileURL, "_blank");
                    }}
                    title="Open document"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => removeFromRecent(e, doc.id)}
                  title="Remove from recent"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => navigate("/documents")}
          >
            View All Documents
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardRecent;
