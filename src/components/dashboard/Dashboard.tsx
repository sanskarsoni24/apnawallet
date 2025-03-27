
import React from "react";
import { BarChart3, Calendar, FileText, Filter } from "lucide-react";
import BlurContainer from "../ui/BlurContainer";
import DocumentCard from "../documents/DocumentCard";
import DocumentUpload from "../documents/DocumentUpload";
import DocumentTimeline from "../documents/DocumentTimeline";

const cards = [
  {
    title: "Total Documents",
    value: "42",
    icon: FileText,
    change: "+5 this month",
    positive: true,
  },
  {
    title: "Upcoming Deadlines",
    value: "7",
    icon: Calendar,
    change: "3 this week",
    positive: false,
  },
];

const documents = [
  {
    title: "Car Insurance",
    type: "Invoice",
    dueDate: "May 15, 2023",
    daysRemaining: 3,
  },
  {
    title: "Smartphone Warranty",
    type: "Warranty",
    dueDate: "May 20, 2023",
    daysRemaining: 8,
  },
  {
    title: "Netflix Subscription",
    type: "Subscription",
    dueDate: "May 25, 2023",
    daysRemaining: 13,
  },
  {
    title: "United Airlines Flight",
    type: "Boarding Pass",
    dueDate: "June 1, 2023",
    daysRemaining: 20,
  },
];

const Dashboard = () => {
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
        {cards.map((card, i) => (
          <BlurContainer key={i} className="p-6" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <h2 className="text-3xl font-bold mt-1">{card.value}</h2>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <card.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className={`text-xs ${card.positive ? "text-primary" : "text-muted-foreground"} mt-4`}>
              {card.change}
            </p>
          </BlurContainer>
        ))}
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Recent Documents</h2>
            <button className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Filter className="h-3 w-3" />
              Filter
            </button>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {documents.map((doc, i) => (
              <DocumentCard key={i} {...doc} />
            ))}
          </div>
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
