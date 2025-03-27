
import React, { createContext, useContext, useState, useEffect } from "react";

export interface Document {
  id: string;
  title: string;
  type: string;
  dueDate: string;
  daysRemaining: number;
  file?: File;
  fileURL?: string;
}

interface DocumentContextType {
  documents: Document[];
  addDocument: (doc: Omit<Document, "id">) => void;
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
        },
        {
          id: "2",
          title: "Smartphone Warranty",
          type: "Warranty",
          dueDate: "May 20, 2023",
          daysRemaining: 8,
        },
        {
          id: "3",
          title: "Netflix Subscription",
          type: "Subscription",
          dueDate: "May 25, 2023",
          daysRemaining: 13,
        },
        {
          id: "4",
          title: "United Airlines Flight",
          type: "Boarding Pass",
          dueDate: "June 1, 2023",
          daysRemaining: 20,
        },
        {
          id: "5",
          title: "Internet Bill",
          type: "Invoice",
          dueDate: "May 10, 2023",
          daysRemaining: -2,
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

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const filteredDocuments = (type: string) => {
    if (type === "All") return documents;
    return documents.filter((doc) => doc.type === type);
  };

  return (
    <DocumentContext.Provider
      value={{ documents, addDocument, deleteDocument, filteredDocuments }}
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
