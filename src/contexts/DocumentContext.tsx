
import React, { createContext, useContext, useState, useEffect } from "react";

export interface Document {
  id: string;
  title: string;
  type: string;
  dueDate: string;
  daysRemaining: number;
  description?: string;
  file?: File;
  fileURL?: string;
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

  // Load documents from localStorage on initial render
  useEffect(() => {
    const savedDocs = localStorage.getItem("documents");
    if (savedDocs) {
      try {
        setDocuments(JSON.parse(savedDocs));
      } catch (e) {
        console.error("Failed to parse saved documents:", e);
      }
    } else {
      // Sample documents for demo
      const sampleDocuments = [
        {
          id: "1",
          title: "Car Insurance",
          type: "Invoice",
          dueDate: "May 15, 2023",
          daysRemaining: 3,
          description: "Annual car insurance premium payment."
        },
        {
          id: "2",
          title: "Smartphone Warranty",
          type: "Warranty",
          dueDate: "May 20, 2023",
          daysRemaining: 8,
          description: "Extended warranty for iPhone purchase."
        },
        {
          id: "3",
          title: "Netflix Subscription",
          type: "Subscription",
          dueDate: "May 25, 2023",
          daysRemaining: 13,
          description: "Monthly streaming service subscription."
        },
        {
          id: "4",
          title: "United Airlines Flight",
          type: "Boarding Pass",
          dueDate: "June 1, 2023",
          daysRemaining: 20,
          description: "Flight from SFO to JFK."
        },
        {
          id: "5",
          title: "Internet Bill",
          type: "Invoice",
          dueDate: "May 10, 2023",
          daysRemaining: -2,
          description: "Monthly internet service payment."
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

  const addDocument = (doc: Omit<Document, "id">) => {
    const newDocument = {
      ...doc,
      id: Date.now().toString(),
    };
    setDocuments((prev) => [...prev, newDocument]);
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments((prev) => 
      prev.map((doc) => 
        doc.id === id ? { ...doc, ...updates } : doc
      )
    );
  };

  // New function to specifically update the due date
  const updateDueDate = (id: string, newDueDate: string) => {
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
    
    setDocuments((prev) => 
      prev.map((doc) => 
        doc.id === id ? { ...doc, dueDate: newDueDate, daysRemaining } : doc
      )
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const filteredDocuments = (type: string) => {
    if (type === "All") return documents;
    return documents.filter((doc) => doc.type === type);
  };

  return (
    <DocumentContext.Provider
      value={{ documents, addDocument, updateDocument, updateDueDate, deleteDocument, filteredDocuments }}
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
