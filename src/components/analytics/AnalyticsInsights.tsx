
import React from "react";
import { useDocuments } from "@/contexts/DocumentContext";
import { Clock, AlertCircle, CheckCircle2, Info } from "lucide-react";
import BlurContainer from "../ui/BlurContainer";
import { Card } from "../ui/card";

const AnalyticsInsights: React.FC = () => {
  const { documents } = useDocuments();
  
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
  
  const insights = [
    {
      title: "Expiring Soon",
      description: `You have ${expiringDocuments.length} documents expiring in the next 30 days.`,
      icon: Clock,
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
      icon: Info,
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
      <h2 className="text-xl font-semibold mb-6">Insights & Recommendations</h2>
      
      <div className="grid gap-4">
        {insights.map((insight, index) => (
          <Card key={index} className={`p-4 border-l-4 ${
            insight.priority === "critical" ? "border-l-red-500" :
            insight.priority === "high" ? "border-l-amber-500" :
            insight.priority === "medium" ? "border-l-blue-500" :
            "border-l-emerald-500"
          }`}>
            <div className="flex items-start gap-4">
              <div className={`${insight.bg} p-2 rounded-md shrink-0`}>
                <insight.icon className={`h-5 w-5 ${insight.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">{insight.title}</h3>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
                
                {insight.action && (
                  <button className={`mt-2 text-xs font-medium ${insight.color} hover:underline`}>
                    {insight.action}
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </BlurContainer>
  );
};

export default AnalyticsInsights;
