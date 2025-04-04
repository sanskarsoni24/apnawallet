import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { toast } from "@/hooks/use-toast";

export type DocumentImportance = "low" | "medium" | "high" | "critical";

export interface Document {
  id: string;
  title: string;
  type: string;
  dueDate: string;
  daysRemaining: number;
  description?: string;
  file?: File;
  fileURL?: string;
  userId?: string;
  importance?: DocumentImportance;
  extractedText?: string; // Text extracted from document
  autoCategories?: string[]; // Automatically detected categories
}

interface DocumentContextType {
  documents: Document[];
  addDocument: (doc: Omit<Document, "id">) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  updateDueDate: (id: string, newDueDate: string) => void;
  deleteDocument: (id: string) => void;
  filteredDocuments: (type: string) => Document[];
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const { email, isLoggedIn } = useUser();

  // Calculate importance based on days remaining
  const calculateImportance = (daysRemaining: number): DocumentImportance => {
    if (daysRemaining < 0) return "critical"; // Overdue
    if (daysRemaining <= 3) return "high"; // Due soon
    if (daysRemaining <= 7) return "medium"; // Coming up
    return "low"; // Plenty of time
  };

  // Load documents from localStorage on initial render or when user changes
  useEffect(() => {
    const savedDocs = localStorage.getItem("documents");
    if (savedDocs) {
      try {
        setDocuments(JSON.parse(savedDocs));
      } catch (e) {
        console.error("Failed to parse saved documents:", e);
      }
    } else {
      // Sample documents for demo - we'll add userId to them
      const sampleDocuments = [
        {
          id: "1",
          title: "Car Insurance",
          type: "Invoice",
          dueDate: "May 15, 2023",
          daysRemaining: 3,
          description: "Annual car insurance premium payment.",
          userId: "user@example.com" // Assign to a specific user
        },
        {
          id: "2",
          title: "Smartphone Warranty",
          type: "Warranty",
          dueDate: "May 20, 2023",
          daysRemaining: 8,
          description: "Extended warranty for iPhone purchase.",
          userId: "user@example.com"
        },
        {
          id: "3",
          title: "Netflix Subscription",
          type: "Subscription",
          dueDate: "May 25, 2023",
          daysRemaining: 13,
          description: "Monthly streaming service subscription.",
          userId: "test@example.com"
        },
        {
          id: "4",
          title: "United Airlines Flight",
          type: "Boarding Pass",
          dueDate: "June 1, 2023",
          daysRemaining: 20,
          description: "Flight from SFO to JFK.",
          userId: "test@example.com"
        },
        {
          id: "5",
          title: "Internet Bill",
          type: "Invoice",
          dueDate: "May 10, 2023",
          daysRemaining: -2,
          description: "Monthly internet service payment.",
          userId: "admin@example.com"
        },
      ];
      setDocuments(sampleDocuments);
      localStorage.setItem("documents", JSON.stringify(sampleDocuments));
    }
  }, []);

  // Save documents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("documents", JSON.stringify(documents));
  }, [documents]);

  // Function to get only the documents that belong to the current user
  const getUserDocuments = () => {
    if (!isLoggedIn || !email) return [];
    return documents.filter(doc => doc.userId === email);
  };

  // Update addDocument to include text extraction and auto-categorization
  const addDocument = (doc: Omit<Document, "id">) => {
    if (!isLoggedIn || !email) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add documents",
        variant: "destructive",
      });
      return;
    }

    const importance = calculateImportance(doc.daysRemaining);

    const newDocument = {
      ...doc,
      id: Date.now().toString(),
      userId: email,
      importance: importance,
    };
    
    setDocuments((prev) => [...prev, newDocument]);
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    if (!isLoggedIn) return;
    
    setDocuments((prev) => 
      prev.map((doc) => 
        // Only update if document belongs to current user
        doc.id === id && doc.userId === email ? { ...doc, ...updates } : doc
      )
    );
  };

  // Update the due date with recalculated importance
  const updateDueDate = (id: string, newDueDate: string) => {
    if (!isLoggedIn) return;
    
    // Calculate new days remaining based on the new due date
    const calculateDaysRemaining = (dateString: string) => {
      try {
        // Handle different date formats
        let dueDate = new Date(dateString);
        
        // Check if the date is valid
        if (isNaN(dueDate.getTime())) {
          // Try to parse formats like "May 15, 2023"
          const parts = dateString.split(" ");
          if (parts.length === 3) {
            const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
              .findIndex(m => parts[0].includes(m)) + 1;
            const day = parseInt(parts[1].replace(",", ""));
            const year = parseInt(parts[2]);
            if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
              dueDate = new Date(year, month - 1, day);
            }
          }
        }
        
        // Calculate days difference
        if (!isNaN(dueDate.getTime())) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const diffTime = dueDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays;
        }
        return 0;
      } catch (error) {
        console.error("Error calculating days remaining:", error);
        return 0;
      }
    };

    const daysRemaining = calculateDaysRemaining(newDueDate);
    const importance = calculateImportance(daysRemaining);
    
    setDocuments((prev) => 
      prev.map((doc) => 
        // Only update if document belongs to current user
        doc.id === id && doc.userId === email ? { 
          ...doc, 
          dueDate: newDueDate, 
          daysRemaining,
          importance 
        } : doc
      )
    );
  };

  const deleteDocument = (id: string) => {
    if (!isLoggedIn) return;
    
    setDocuments((prev) => 
      prev.filter((doc) => !(doc.id === id && doc.userId === email))
    );
  };

  const filteredDocuments = (type: string) => {
    // First filter by user ID, then by document type
    const userDocs = getUserDocuments();
    if (type === "All") return userDocs;
    return userDocs.filter((doc) => doc.type === type);
  };

  return (
    <DocumentContext.Provider
      value={{ 
        documents: getUserDocuments(), // Only return the current user's documents
        addDocument, 
        updateDocument, 
        updateDueDate, 
        deleteDocument, 
        filteredDocuments 
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentProvider");
  }
  return context;
};
