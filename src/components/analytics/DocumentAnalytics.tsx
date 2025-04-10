
import React, { useMemo } from "react";
import { useDocuments } from "@/contexts/DocumentContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { BarChart3, PieChart as PieChartIcon, Calendar, FileText, Filter, Clock, Shield } from "lucide-react";
import BlurContainer from "../ui/BlurContainer";
import { Card } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F97316', '#0EA5E9', '#6366F1'];

const DocumentAnalytics: React.FC = () => {
  const { documents } = useDocuments();
  
  // Calculate document stats by type
  const documentsByType = useMemo(() => {
    const typeCount: Record<string, number> = {};
    documents.forEach(doc => {
      typeCount[doc.type] = (typeCount[doc.type] || 0) + 1;
    });
    
    return Object.entries(typeCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [documents]);
  
  // Calculate document stats by category
  const documentsByCategory = useMemo(() => {
    const categoryCount: Record<string, number> = {};
    documents.forEach(doc => {
      const category = doc.category || "Uncategorized";
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    return Object.entries(categoryCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [documents]);
  
  // Calculate documents by status
  const documentsByStatus = useMemo(() => {
    const statusCount: Record<string, number> = {
      active: 0,
      expired: 0,
      pending: 0,
      none: 0
    };
    
    documents.forEach(doc => {
      const status = doc.status || "none";
      statusCount[status] += 1;
    });
    
    return Object.entries(statusCount)
      .map(([name, value]) => ({ 
        name: name === "none" ? "No Status" : name.charAt(0).toUpperCase() + name.slice(1), 
        value 
      }))
      .filter(item => item.value > 0);
  }, [documents]);
  
  // Calculate documents by expiry timeline
  const documentsByExpiry = useMemo(() => {
    const expiring = {
      expired: 0, // already expired
      thisWeek: 0, // in the next 7 days
      thisMonth: 0, // in the next 30 days
      later: 0, // more than 30 days
      noExpiry: 0 // no expiry date
    };
    
    documents.forEach(doc => {
      if (!doc.expiryDate) {
        expiring.noExpiry += 1;
        return;
      }
      
      const daysRemaining = doc.daysRemaining || 0;
      
      if (daysRemaining < 0) {
        expiring.expired += 1;
      } else if (daysRemaining <= 7) {
        expiring.thisWeek += 1;
      } else if (daysRemaining <= 30) {
        expiring.thisMonth += 1;
      } else {
        expiring.later += 1;
      }
    });
    
    return [
      { name: "Expired", value: expiring.expired },
      { name: "This Week", value: expiring.thisWeek },
      { name: "This Month", value: expiring.thisMonth },
      { name: "Later", value: expiring.later },
      { name: "No Expiry", value: expiring.noExpiry }
    ].filter(item => item.value > 0);
  }, [documents]);
  
  // Calculate document volume over time (by month)
  const documentsByMonth = useMemo(() => {
    const monthCount: Record<string, number> = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthName = d.toLocaleString('default', { month: 'short' });
      monthCount[monthKey] = { month: monthName, count: 0 };
    }
    
    // Count documents by month
    documents.forEach(doc => {
      try {
        const date = new Date(doc.dateAdded);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (monthCount[monthKey]) {
          monthCount[monthKey].count += 1;
        }
      } catch (e) {
        // Skip invalid dates
      }
    });
    
    return Object.values(monthCount).map(({ month, count }) => ({
      name: month,
      value: count
    }));
  }, [documents]);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-md">
          <p className="font-medium">{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };
  
  if (documents.length === 0) {
    return (
      <BlurContainer variant="default" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Document Analytics</h2>
        </div>
        <Card className="p-8 text-center bg-muted/30">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Documents to Analyze</h3>
          <p className="text-muted-foreground mb-4">
            Upload some documents to see analytics and insights
          </p>
        </Card>
      </BlurContainer>
    );
  }
  
  return (
    <BlurContainer variant="default" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Document Analytics</h2>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Document Distribution By Type */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Document Types</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={documentsByType}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Document Status Distribution */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-amber-500" />
            <h3 className="font-medium">Document Status</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={documentsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {documentsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document Expiry Timeline */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-4 w-4 text-emerald-500" />
            <h3 className="font-medium">Expiry Timeline</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={documentsByExpiry}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Document Volume Over Time */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-blue-500" />
            <h3 className="font-medium">Document Volume (Last 6 Months)</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={documentsByMonth}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </BlurContainer>
  );
};

export default DocumentAnalytics;
