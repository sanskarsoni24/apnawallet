
import React, { useState } from "react";
import { FileText, Filter, Search, SlidersHorizontal } from "lucide-react";
import Container from "@/components/layout/Container";
import BlurContainer from "@/components/ui/BlurContainer";
import DocumentCard from "@/components/documents/DocumentCard";
import DocumentUpload from "@/components/documents/DocumentUpload";
import { Badge } from "@/components/ui/badge";

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
  {
    title: "Internet Bill",
    type: "Invoice",
    dueDate: "May 10, 2023",
    daysRemaining: -2,
  },
  {
    title: "Water Bill",
    type: "Invoice",
    dueDate: "May 28, 2023",
    daysRemaining: 16,
  },
  {
    title: "Laptop Extended Warranty",
    type: "Warranty",
    dueDate: "June 15, 2023",
    daysRemaining: 34,
  },
  {
    title: "Spotify Premium",
    type: "Subscription",
    dueDate: "June 10, 2023",
    daysRemaining: 29,
  },
];

const documentTypes = ["All", "Invoice", "Warranty", "Subscription", "Boarding Pass"];

const Documents = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  
  const filteredDocuments = activeFilter === "All" 
    ? documents 
    : documents.filter(doc => doc.type === activeFilter);
  
  return (
    <Container>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
            <p className="text-muted-foreground">
              View and manage all your documents in one place.
            </p>
          </div>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3 space-y-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <BlurContainer className="p-3">
              <div className="flex flex-wrap gap-2">
                {documentTypes.map((type) => (
                  <button
                    key={type}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      activeFilter === type 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-secondary"
                    }`}
                    onClick={() => setActiveFilter(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </BlurContainer>
            
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-input hover:bg-secondary transition-colors">
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {filteredDocuments.map((doc, i) => (
                <DocumentCard key={i} {...doc} />
              ))}
            </div>
          </div>
          
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <DocumentUpload />
            
            <BlurContainer className="p-5">
              <h3 className="text-base font-medium mb-4">Document Types</h3>
              <div className="space-y-3">
                {["Invoice", "Warranty", "Subscription", "Boarding Pass"].map((type) => {
                  const count = documents.filter(doc => doc.type === type).length;
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm">{type}</span>
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  );
                })}
              </div>
            </BlurContainer>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Documents;
