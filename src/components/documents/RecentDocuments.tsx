
import React, { useEffect, useState } from "react";
import { useDocuments } from "@/contexts/DocumentContext";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, X, Pin, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Document } from "@/contexts/DocumentContext";
import { ScrollArea } from "../ui/scroll-area";

const RecentDocuments = () => {
  const { documents } = useDocuments();
  const { userSettings, updateUserSettings } = useUser();
  const [recentDocs, setRecentDocs] = useState<Document[]>([]);
  const maxRecentDocs = userSettings.recentDocumentsMaxCount || 5;

  useEffect(() => {
    if (userSettings.recentDocuments && documents.length > 0) {
      // Filter documents that are in the recent list
      const recentDocIds = userSettings.recentDocuments;
      const filteredDocs = documents.filter(doc => 
        recentDocIds.includes(doc.id)
      ).sort((a, b) => {
        // Sort by the order in recentDocuments array
        return recentDocIds.indexOf(a.id) - recentDocIds.indexOf(b.id);
      });
      
      setRecentDocs(filteredDocs);
    } else {
      setRecentDocs([]);
    }
  }, [documents, userSettings.recentDocuments]);

  const handleRemoveFromRecent = (docId: string) => {
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

  const clearAllRecent = () => {
    updateUserSettings({
      recentDocuments: []
    });
    
    toast({
      title: "Recent List Cleared",
      description: "All documents have been removed from recent list"
    });
  };

  const pinToTop = (docId: string) => {
    if (userSettings.recentDocuments) {
      const currentRecent = [...userSettings.recentDocuments];
      
      // Remove the document from its current position
      const updatedRecent = currentRecent.filter(id => id !== docId);
      
      // Add it to the beginning of the array
      updatedRecent.unshift(docId);
      
      updateUserSettings({
        recentDocuments: updatedRecent
      });
      
      toast({
        title: "Document Pinned",
        description: "Document pinned to the top of recent list"
      });
    }
  };

  if (recentDocs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Documents
          </CardTitle>
          <CardDescription>Your recently viewed documents will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">No recent documents</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Documents
          </CardTitle>
          {recentDocs.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllRecent}>
              Clear All
            </Button>
          )}
        </div>
        <CardDescription>Documents you've recently viewed</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {recentDocs.map((doc) => (
              <div 
                key={doc.id} 
                className="p-3 border rounded-lg flex justify-between items-center hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="font-medium">{doc.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {doc.type} {doc.dueDate && `• Due: ${format(new Date(doc.dueDate), "MMM d, yyyy")}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => pinToTop(doc.id)} title="Pin to top">
                    <Pin className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveFromRecent(doc.id)} title="Remove from recent">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentDocuments;
