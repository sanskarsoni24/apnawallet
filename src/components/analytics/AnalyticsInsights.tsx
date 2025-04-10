
import React from "react";
import { useDocuments } from "@/contexts/DocumentContext";
import { Clock, AlertCircle, CheckCircle2, Info, FileSearch, Megaphone, Calendar, Tag } from "lucide-react";
import BlurContainer from "../ui/BlurContainer";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

const AnalyticsInsights: React.FC = () => {
  const { documents } = useDocuments();
  const { toast } = useToast();
  
  // Calculate insights
  const expiringDocuments = documents.filter(doc => 
    doc.daysRemaining !== undefined && 
    doc.daysRemaining >= 0 && 
    doc.daysRemaining <= 30
  );
  
  const expiredDocuments = documents.filter(doc => 
    doc.daysRemaining !== undefined && doc.daysRemaining < 0
  );
  
  const healthyDocuments = documents.filter(doc => 
    !doc.expiryDate || 
    (doc.daysRemaining !== undefined && doc.daysRemaining > 30)
  );
  
  const mostCommonType = React.useMemo(() => {
    const typeCount: Record<string, number> = {};
    documents.forEach(doc => {
      typeCount[doc.type] = (typeCount[doc.type] || 0) + 1;
    });
    
    let maxType = "";
    let maxCount = 0;
    
    for (const [type, count] of Object.entries(typeCount)) {
      if (count > maxCount) {
        maxType = type;
        maxCount = count;
      }
    }
    
    return { type: maxType, count: maxCount };
  }, [documents]);
  
  const getIncompleteDocuments = () => {
    return documents.filter(doc => 
      !doc.category || 
      !doc.tags || 
      doc.tags.length === 0 || 
      !doc.notes
    ).length;
  };
  
  const incompleteCount = getIncompleteDocuments();
  
  const handleActionClick = (action: string) => {
    toast({
      title: "Action Triggered",
      description: `You've initiated the "${action}" action.`,
      variant: "default",
    });
  };
  
  const calculateCompletion = () => {
    if (documents.length === 0) return 100;
    return Math.round(((documents.length - incompleteCount) / documents.length) * 100);
  };

  const documentCompletionPercentage = calculateCompletion();
  
  const insights = [
    {
      title: "Expiring Soon",
      description: `You have ${expiringDocuments.length} documents expiring in the next 30 days.`,
      icon: Calendar,
      color: "text-amber-500",
      bg: "bg-amber-100 dark:bg-amber-900/30",
      action: expiringDocuments.length > 0 ? "Schedule renewal" : null,
      priority: expiringDocuments.length > 0 ? "high" : "normal"
    },
    {
      title: "Expired Documents",
      description: `You have ${expiredDocuments.length} expired documents that need attention.`,
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-100 dark:bg-red-900/30",
      action: expiredDocuments.length > 0 ? "Renew documents" : null,
      priority: expiredDocuments.length > 0 ? "critical" : "normal"
    },
    {
      title: "Healthy Documents",
      description: `${healthyDocuments.length} documents are in good standing with no immediate action needed.`,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      action: null,
      priority: "normal"
    },
    {
      title: "Document Organization",
      description: incompleteCount > 0 
        ? `${incompleteCount} documents are missing categories, tags or notes.` 
        : "All documents are well-organized with categories, tags and notes.",
      icon: Tag,
      color: incompleteCount > 0 ? "text-blue-500" : "text-emerald-500",
      bg: incompleteCount > 0 ? "bg-blue-100 dark:bg-blue-900/30" : "bg-emerald-100 dark:bg-emerald-900/30",
      action: incompleteCount > 0 ? "Organize documents" : null,
      priority: incompleteCount > 0 ? "medium" : "normal"
    }
  ];
  
  if (documents.length === 0) {
    return null;
  }
  
  return (
    <BlurContainer variant="default" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Insights & Recommendations</h2>
        </div>
        <div className="text-sm flex items-center gap-2">
          <span className="text-muted-foreground">Document completion:</span>
          <span className="font-medium">{documentCompletionPercentage}%</span>
          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full ${documentCompletionPercentage === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${documentCompletionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        {insights.map((insight, index) => (
          <Card key={index} className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
            insight.priority === "critical" ? "border-l-4 border-l-red-500" :
            insight.priority === "high" ? "border-l-4 border-l-amber-500" :
            insight.priority === "medium" ? "border-l-4 border-l-blue-500" :
            "border-l-4 border-l-emerald-500"
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`${insight.bg} p-2.5 rounded-md shrink-0`}>
                  <insight.icon className={`h-5 w-5 ${insight.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                  
                  {insight.action && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`px-3 py-1 h-auto text-xs ${insight.color} hover:bg-muted/50`}
                      onClick={() => handleActionClick(insight.action as string)}
                    >
                      {insight.action}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {mostCommonType.type && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center gap-3 mb-2">
            <FileSearch className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">Document Trend</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Your most common document type is <span className="font-medium text-foreground">{mostCommonType.type}</span> with {mostCommonType.count} documents.
          </p>
        </div>
      )}
    </BlurContainer>
  );
};

export default AnalyticsInsights;
