
import React, { createContext, useState, useContext, useEffect } from "react";

export interface Document {
  id: string;
  title: string;
  type: string;
  dueDate: string;
  daysRemaining: number;
  description?: string;
  fileURL?: string;
  importance?: "low" | "medium" | "high" | "critical";
  customReminderDays?: number;
  userId?: string;
}

interface DocumentContextType {
  documents: Document[];
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  updateDueDate: (id: string, newDate: string) => void;
  setCustomReminderDays: (id: string, days: number) => void;
  filterDocumentsByType: (type: string) => Document[];
}

const DocumentContext = createContext<DocumentContextType>({
  documents: [],
  addDocument: () => {},
  updateDocument: () => {},
  deleteDocument: () => {},
  updateDueDate: () => {},
  setCustomReminderDays: () => {},
  filterDocumentsByType: () => [],
});

export const useDocuments = () => useContext(DocumentContext);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const { email } = useUser();

  useEffect(() => {
    // Load documents from localStorage
    const storedDocuments = localStorage.getItem("documents");
    if (storedDocuments) {
      try {
        const parsedDocs = JSON.parse(storedDocuments);
        // Ensure all documents have a valid importance value
        const validatedDocs = parsedDocs.map((doc: any) => ({
          ...doc,
          importance: doc.importance && ["low", "medium", "high", "critical"].includes(doc.importance) 
            ? doc.importance 
            : "medium"
        }));
        setDocuments(validatedDocs);
      } catch (e) {
        console.error("Error parsing stored documents:", e);
        setInitialSampleDocuments();
      }
    } else {
      // Initialize with sample data if no documents exist
      setInitialSampleDocuments();
    }
  }, [email]);

  const setInitialSampleDocuments = () => {
    const sampleDocuments: Document[] = [
      {
        id: "1",
        title: "Car Insurance",
        type: "Insurance",
        dueDate: "May 15, 2025",
        daysRemaining: 30,
        description: "Annual premium payment for car insurance.",
        importance: "medium",
        userId: email,
      },
      {
        id: "2",
        title: "Passport Renewal",
        type: "Document",
        dueDate: "April 30, 2025",
        daysRemaining: 10,
        description: "Passport expires soon. Need to start renewal process.",
        importance: "high",
        userId: email,
      },
      {
        id: "3",
        title: "Property Tax",
        type: "Invoice",
        dueDate: "April 12, 2025",
        daysRemaining: 2,
        description: "Annual property tax payment due.",
        importance: "critical",
        userId: email,
      },
      {
        id: "4",
        title: "Health Insurance",
        type: "Insurance",
        dueDate: "June 20, 2025",
        daysRemaining: 60,
        description: "Health insurance renewal.",
        importance: "medium",
        userId: email,
      },
      {
        id: "5",
        title: "Credit Card Bill",
        type: "Invoice",
        dueDate: "April 10, 2025",
        daysRemaining: -2,
        description: "Monthly credit card payment.",
        importance: "critical",
        userId: email,
      },
    ];
    setDocuments(sampleDocuments);
    localStorage.setItem("documents", JSON.stringify(sampleDocuments));
  };

  // Save documents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("documents", JSON.stringify(documents));
    
    // Safely check for Chrome extension API
    if (typeof window !== 'undefined' && window.chrome && 'storage' in window.chrome) {
      try {
        window.chrome.storage?.local?.set({ documents });
        // Send a message to the extension that documents were updated
        window.chrome.runtime?.sendMessage?.({ action: "documentsUpdated" });
      } catch (error) {
        console.log("Chrome extension storage not available:", error);
      }
    }
  }, [documents]);

  const addDocument = (document: Document) => {
    const newDocument = {
      ...document,
      id: Math.random().toString(36).substr(2, 9),
      userId: email,
    };
    
    setDocuments((prevDocuments) => [...prevDocuments, newDocument]);
    
    // Safely check for Chrome extension API
    if (typeof window !== 'undefined' && window.chrome && 'storage' in window.chrome) {
      try {
        const updatedDocs = [...documents, newDocument];
        window.chrome.storage?.local?.set({ documents: updatedDocs });
        // Notify extension of update
        window.chrome.runtime?.sendMessage?.({ action: "documentsUpdated" });
      } catch (error) {
        console.log("Chrome extension storage not available:", error);
      }
    }
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.id === id ? { ...doc, ...updates } : doc
      )
    );
    
    // Safely check for Chrome extension API
    if (typeof window !== 'undefined' && window.chrome && 'storage' in window.chrome) {
      try {
        const updatedDocuments = documents.map((doc) =>
          doc.id === id ? { ...doc, ...updates } : doc
        );
        window.chrome.storage?.local?.set({ documents: updatedDocuments });
        // Notify extension of update
        window.chrome.runtime?.sendMessage?.({ action: "documentsUpdated" });
      } catch (error) {
        console.log("Chrome extension storage not available:", error);
      }
    }
  };

  const deleteDocument = (id: string) => {
    setDocuments((prevDocuments) => 
      prevDocuments.filter((doc) => doc.id !== id)
    );
    
    // Safely check for Chrome extension API
    if (typeof window !== 'undefined' && window.chrome && 'storage' in window.chrome) {
      try {
        const updatedDocuments = documents.filter((doc) => doc.id !== id);
        window.chrome.storage?.local?.set({ documents: updatedDocuments });
        // Notify extension of update
        window.chrome.runtime?.sendMessage?.({ action: "documentsUpdated" });
      } catch (error) {
        console.log("Chrome extension storage not available:", error);
      }
    }
  };
  
  const updateDueDate = (id: string, newDate: string) => {
    // Calculate new days remaining based on the new date
    const currentDate = new Date();
    let dueDate: Date;
    
    try {
      // Try to parse the date
      dueDate = new Date(newDate);
      
      // If invalid, try another format
      if (isNaN(dueDate.getTime())) {
        const dateParts = newDate.split(" ");
        if (dateParts.length === 3) {
          const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            .indexOf(dateParts[0]);
          const day = parseInt(dateParts[1].replace(",", ""));
          const year = parseInt(dateParts[2]);
          
          if (month !== -1 && !isNaN(day) && !isNaN(year)) {
            dueDate = new Date(year, month, day);
          }
        }
      }
      
      // Calculate days remaining
      const timeDiff = dueDate.getTime() - currentDate.getTime();
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      // Update document with new due date and days remaining
      setDocuments((prevDocuments) =>
        prevDocuments.map((doc) =>
          doc.id === id
            ? { ...doc, dueDate: newDate, daysRemaining }
            : doc
        )
      );
      
      // Safely check for Chrome extension API
      if (typeof window !== 'undefined' && window.chrome && 'storage' in window.chrome) {
        try {
          const updatedDocuments = documents.map((doc) =>
            doc.id === id
              ? { ...doc, dueDate: newDate, daysRemaining }
              : doc
          );
          window.chrome.storage?.local?.set({ documents: updatedDocuments });
          // Notify extension of update
          window.chrome.runtime?.sendMessage?.({ action: "documentsUpdated" });
        } catch (error) {
          console.log("Chrome extension storage not available:", error);
        }
      }
    } catch (error) {
      console.error("Error updating due date:", error);
    }
  };
  
  const setCustomReminderDays = (id: string, days: number) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.id === id ? { ...doc, customReminderDays: days } : doc
      )
    );
    
    // Safely check for Chrome extension API
    if (typeof window !== 'undefined' && window.chrome && 'storage' in window.chrome) {
      try {
        const updatedDocuments = documents.map((doc) =>
          doc.id === id ? { ...doc, customReminderDays: days } : doc
        );
        window.chrome.storage?.local?.set({ documents: updatedDocuments });
        // Notify extension of update
        window.chrome.runtime?.sendMessage?.({ action: "documentsUpdated" });
      } catch (error) {
        console.log("Chrome extension storage not available:", error);
      }
    }
  };

  const filterDocumentsByType = (type: string) => {
    if (type === "All") {
      return documents;
    }
    return documents.filter(doc => doc.type === type);
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        addDocument,
        updateDocument,
        deleteDocument,
        updateDueDate,
        setCustomReminderDays,
        filterDocumentsByType,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

// Required import for the useUser hook
import { useUser } from "./UserContext";
