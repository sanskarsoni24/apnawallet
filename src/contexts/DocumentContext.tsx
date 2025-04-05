
import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

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
  customReminderDays?: number; // Document-specific reminder setting
}

interface DocumentContextType {
  documents: Document[];
  addDocument: (doc: Omit<Document, "id">) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  updateDueDate: (id: string, newDueDate: string) => void;
  deleteDocument: (id: string) => void;
  filteredDocuments: (type: string) => Document[];
  setCustomReminderDays: (id: string, days: number) => void;
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

  // Helper function to calculate days remaining
  const calculateDaysRemaining = (dateString: string): number => {
    try {
      // Try direct parsing first
      let dueDate = new Date(dateString);
      
      // If invalid, try parsing formats like "May 15, 2023"
      if (isNaN(dueDate.getTime())) {
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
      // Sample documents for demo with custom reminder days
      const sampleDocuments = [
        {
          id: "1",
          title: "Car Insurance",
          type: "Invoice",
          dueDate: "May 15, 2023",
          daysRemaining: 3,
          description: "Annual car insurance premium payment.",
          userId: "user@example.com", // Assign to a specific user
          customReminderDays: 7 // Custom reminder days
        },
        {
          id: "2",
          title: "Smartphone Warranty",
          type: "Warranty",
          dueDate: "May 20, 2023",
          daysRemaining: 8,
          description: "Extended warranty for iPhone purchase.",
          userId: "user@example.com",
          customReminderDays: 14 // Custom reminder days
        },
        {
          id: "3",
          title: "Netflix Subscription",
          type: "Subscription",
          dueDate: "May 25, 2023",
          daysRemaining: 13,
          description: "Monthly streaming service subscription.",
          userId: "test@example.com"
          // No custom reminder days - will use global setting
        },
        {
          id: "4",
          title: "United Airlines Flight",
          type: "Boarding Pass",
          dueDate: "June 1, 2023",
          daysRemaining: 20,
          description: "Flight from SFO to JFK.",
          userId: "test@example.com",
          customReminderDays: 3 // Custom reminder days
        },
        {
          id: "5",
          title: "Internet Bill",
          type: "Invoice",
          dueDate: "May 10, 2023",
          daysRemaining: -2,
          description: "Monthly internet service payment.",
          userId: "admin@example.com",
          customReminderDays: 5 // Custom reminder days
        },
      ];
      setDocuments(sampleDocuments);
      localStorage.setItem("documents", JSON.stringify(sampleDocuments));
      
      // Also store in chrome storage for extension if available
      if (window.chrome && chrome.storage) {
        try {
          chrome.storage.local.set({ documents: sampleDocuments });
        } catch (e) {
          console.log("Chrome storage not available, skipping");
        }
      }
    }
  }, []);

  // Save documents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("documents", JSON.stringify(documents));
    
    // Also update chrome storage if available (for extension)
    if (window.chrome && chrome.storage) {
      try {
        chrome.storage.local.set({ documents });
      } catch (e) {
        console.log("Chrome storage not available, skipping");
      }
    }
  }, [documents]);

  // Function to get only the documents that belong to the current user
  const getUserDocuments = () => {
    if (!isLoggedIn || !email) return [];
    return documents.filter(doc => doc.userId === email);
  };

  // Function to set custom reminder days for a specific document
  const setCustomReminderDays = (id: string, days: number) => {
    if (!isLoggedIn) return;
    
    setDocuments((prev) => 
      prev.map((doc) => 
        doc.id === id && doc.userId === email ? { 
          ...doc, 
          customReminderDays: days 
        } : doc
      )
    );
    
    // Also update chrome storage if available
    if (window.chrome && chrome.storage) {
      try {
        chrome.storage.local.get(['documents'], (data) => {
          if (data.documents) {
            const updatedDocs = data.documents.map(doc => 
              doc.id === id ? { ...doc, customReminderDays: days } : doc
            );
            chrome.storage.local.set({ documents: updatedDocs });
          }
        });
      } catch (e) {
        console.log("Chrome storage not available, skipping");
      }
    }
  };

  // Add document function
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
    const newId = Date.now().toString();

    const newDocument = {
      ...doc,
      id: newId,
      userId: email,
      importance: importance,
    };
    
    setDocuments((prev) => [...prev, newDocument]);
    
    toast({
      title: "Document added",
      description: `${doc.title} has been successfully added.`,
    });
    
    // Also update chrome storage if available
    if (window.chrome && chrome.storage) {
      try {
        chrome.storage.local.get(['documents'], (data) => {
          const existingDocs = data.documents || [];
          chrome.storage.local.set({ 
            documents: [...existingDocs, newDocument]
          });
        });
      } catch (e) {
        console.log("Chrome storage not available, skipping");
      }
    }
  };

  // Update document function
  const updateDocument = (id: string, updates: Partial<Document>) => {
    if (!isLoggedIn) return;
    
    setDocuments((prev) => 
      prev.map((doc) => 
        // Only update if document belongs to current user
        doc.id === id && doc.userId === email ? { ...doc, ...updates } : doc
      )
    );
    
    // Also update chrome storage if available
    if (window.chrome && chrome.storage) {
      try {
        chrome.storage.local.get(['documents'], (data) => {
          if (data.documents) {
            const updatedDocs = data.documents.map(doc => 
              doc.id === id ? { ...doc, ...updates } : doc
            );
            chrome.storage.local.set({ documents: updatedDocs });
          }
        });
      } catch (e) {
        console.log("Chrome storage not available, skipping");
      }
    }
  };

  // Update the due date with recalculated importance
  const updateDueDate = (id: string, newDueDate: string) => {
    if (!isLoggedIn) return;
    
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
    
    // Also update chrome storage if available
    if (window.chrome && chrome.storage) {
      try {
        chrome.storage.local.get(['documents'], (data) => {
          if (data.documents) {
            const updatedDocs = data.documents.map(doc => 
              doc.id === id ? { 
                ...doc, 
                dueDate: newDueDate, 
                daysRemaining,
                importance 
              } : doc
            );
            chrome.storage.local.set({ documents: updatedDocs });
          }
        });
      } catch (e) {
        console.log("Chrome storage not available, skipping");
      }
    }
  };

  // Delete document function
  const deleteDocument = (id: string) => {
    if (!isLoggedIn) return;
    
    setDocuments((prev) => 
      prev.filter((doc) => !(doc.id === id && doc.userId === email))
    );
    
    // Also update chrome storage if available
    if (window.chrome && chrome.storage) {
      try {
        chrome.storage.local.get(['documents'], (data) => {
          if (data.documents) {
            const updatedDocs = data.documents.filter(doc => doc.id !== id);
            chrome.storage.local.set({ documents: updatedDocs });
          }
        });
      } catch (e) {
        console.log("Chrome storage not available, skipping");
      }
    }
  };

  // Filter documents by type
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
        filteredDocuments,
        setCustomReminderDays
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
