
import React, { createContext, useState, useContext, useEffect } from "react";

export interface Document {
  id: string;
  title: string;
  type: string;
  customCategory?: string;
  dueDate: string;
  daysRemaining: number;
  description?: string;
  fileURL?: string;
  importance?: "low" | "medium" | "high" | "critical";
  customReminderDays?: number;
  userId?: string;
  isProtected?: boolean;
}

interface DocumentContextType {
  documents: Document[];
  categories: string[];
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  updateDueDate: (id: string, newDate: string) => void;
  setCustomReminderDays: (id: string, days: number) => void;
  filterDocumentsByType: (type: string) => Document[];
  addCustomCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  getProtectedDocuments: () => Document[];
  setDocumentProtection: (id: string, isProtected: boolean) => void;
}

// Define global chrome interface for TypeScript
declare global {
  interface Window {
    chrome?: {
      storage?: {
        local?: {
          get?: (keys: string | string[] | object | null, callback: (items: any) => void) => void;
          set?: (items: object, callback?: () => void) => void;
        };
      };
      runtime?: {
        sendMessage?: (message: any, responseCallback?: (response: any) => void) => void;
      };
    };
  }
}

const DocumentContext = createContext<DocumentContextType>({
  documents: [],
  categories: [],
  addDocument: () => {},
  updateDocument: () => {},
  deleteDocument: () => {},
  updateDueDate: () => {},
  setCustomReminderDays: () => {},
  filterDocumentsByType: () => [],
  addCustomCategory: () => {},
  removeCategory: () => {},
  getProtectedDocuments: () => [],
  setDocumentProtection: () => {},
});

export const useDocuments = () => useContext(DocumentContext);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const { email } = useUser();

  useEffect(() => {
    // Load documents from localStorage
    const storedDocuments = localStorage.getItem("documents");
    const storedCategories = localStorage.getItem("customCategories");
    
    // Load categories
    if (storedCategories) {
      try {
        const parsedCategories = JSON.parse(storedCategories);
        setCategories(parsedCategories);
      } catch (e) {
        console.error("Error parsing stored categories:", e);
        setCategories([]);
      }
    }
    
    // Load documents
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
        customCategory: "Tax Documents",
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
    
    // Extract unique categories from sample documents
    const initialCategories = ["Tax Documents", "Personal", "Financial"];
    
    setDocuments(sampleDocuments);
    setCategories(initialCategories);
    localStorage.setItem("documents", JSON.stringify(sampleDocuments));
    localStorage.setItem("customCategories", JSON.stringify(initialCategories));
  };

  // Save documents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("documents", JSON.stringify(documents));
    
    // Safely check for Chrome extension API
    if (typeof window !== 'undefined' && window.chrome && window.chrome.storage && window.chrome.storage.local) {
      try {
        window.chrome.storage.local.set({ documents });
        // Send a message to the extension that documents were updated
        if (window.chrome.runtime && window.chrome.runtime.sendMessage) {
          window.chrome.runtime.sendMessage({ action: "documentsUpdated" });
        }
      } catch (error) {
        console.log("Chrome extension storage not available:", error);
      }
    }
  }, [documents]);
  
  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("customCategories", JSON.stringify(categories));
  }, [categories]);

  const addDocument = (document: Document) => {
    const newDocument = {
      ...document,
      id: Math.random().toString(36).substr(2, 9),
      userId: email,
    };
    
    setDocuments((prevDocuments) => [...prevDocuments, newDocument]);
    
    // Safely check for Chrome extension API
    if (typeof window !== 'undefined' && window.chrome && window.chrome.storage && window.chrome.storage.local) {
      try {
        const updatedDocs = [...documents, newDocument];
        window.chrome.storage.local.set({ documents: updatedDocs });
        // Notify extension of update
        if (window.chrome.runtime && window.chrome.runtime.sendMessage) {
          window.chrome.runtime.sendMessage({ action: "documentsUpdated" });
        }
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
    if (typeof window !== 'undefined' && window.chrome && window.chrome.storage && window.chrome.storage.local) {
      try {
        const updatedDocuments = documents.map((doc) =>
          doc.id === id ? { ...doc, ...updates } : doc
        );
        window.chrome.storage.local.set({ documents: updatedDocuments });
        // Notify extension of update
        if (window.chrome.runtime && window.chrome.runtime.sendMessage) {
          window.chrome.runtime.sendMessage({ action: "documentsUpdated" });
        }
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
    if (typeof window !== 'undefined' && window.chrome && window.chrome.storage && window.chrome.storage.local) {
      try {
        const updatedDocuments = documents.filter((doc) => doc.id !== id);
        window.chrome.storage.local.set({ documents: updatedDocuments });
        // Notify extension of update
        if (window.chrome.runtime && window.chrome.runtime.sendMessage) {
          window.chrome.runtime.sendMessage({ action: "documentsUpdated" });
        }
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
      if (typeof window !== 'undefined' && window.chrome && window.chrome.storage && window.chrome.storage.local) {
        try {
          const updatedDocuments = documents.map((doc) =>
            doc.id === id
              ? { ...doc, dueDate: newDate, daysRemaining }
              : doc
          );
          window.chrome.storage.local.set({ documents: updatedDocuments });
          // Notify extension of update
          if (window.chrome.runtime && window.chrome.runtime.sendMessage) {
            window.chrome.runtime.sendMessage({ action: "documentsUpdated" });
          }
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
    if (typeof window !== 'undefined' && window.chrome && window.chrome.storage && window.chrome.storage.local) {
      try {
        const updatedDocuments = documents.map((doc) =>
          doc.id === id ? { ...doc, customReminderDays: days } : doc
        );
        window.chrome.storage.local.set({ documents: updatedDocuments });
        // Notify extension of update
        if (window.chrome.runtime && window.chrome.runtime.sendMessage) {
          window.chrome.runtime.sendMessage({ action: "documentsUpdated" });
        }
      } catch (error) {
        console.log("Chrome extension storage not available:", error);
      }
    }
  };

  const addCustomCategory = (category: string) => {
    if (category && !categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const removeCategory = (category: string) => {
    // Remove the category from the list
    setCategories(prev => prev.filter(cat => cat !== category));
    
    // Update documents that use this category
    setDocuments(prevDocs => prevDocs.map(doc => 
      doc.customCategory === category 
        ? { ...doc, customCategory: undefined } 
        : doc
    ));
  };

  const filterDocumentsByType = (type: string) => {
    if (type === "All") {
      return documents;
    }
    
    // Check if it's a standard type or custom category
    if (categories.includes(type)) {
      return documents.filter(doc => doc.customCategory === type);
    } else {
      return documents.filter(doc => doc.type === type);
    }
  };
  
  const setDocumentProtection = (id: string, isProtected: boolean) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc) =>
        doc.id === id ? { ...doc, isProtected } : doc
      )
    );
  };
  
  const getProtectedDocuments = () => {
    return documents.filter(doc => doc.isProtected === true);
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        categories,
        addDocument,
        updateDocument,
        deleteDocument,
        updateDueDate,
        setCustomReminderDays,
        filterDocumentsByType,
        addCustomCategory,
        removeCategory,
        getProtectedDocuments,
        setDocumentProtection,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

// Required import for the useUser hook
import { useUser } from "./UserContext";
