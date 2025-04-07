
import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";

export interface Document {
  id: string;
  title: string;
  type: string;
  dueDate: string;
  daysRemaining: number;
  fileURL: string;
  description?: string;
  customReminderDays?: number;
  userId?: string;
  importance?: 'low' | 'medium' | 'high' | 'critical';
  createdAt?: string;
}

interface DocumentContextType {
  documents: Document[];
  categories: string[];
  addDocument: (doc: Document) => string;
  updateDocument: (id: string, doc: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  filterDocumentsByType: (type: string) => Document[];
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  updateDueDate: (id: string, newDueDate: string) => void;
  setCustomReminderDays: (id: string, days: number) => void;
  sortDocuments: (documents: Document[], sortBy: string) => Document[];
}

const DocumentContext = createContext<DocumentContextType>({
  documents: [],
  categories: [],
  addDocument: () => "",
  updateDocument: () => {},
  deleteDocument: () => {},
  filterDocumentsByType: () => [],
  addCategory: () => {},
  removeCategory: () => {},
  updateDueDate: () => {},
  setCustomReminderDays: () => {},
  sortDocuments: () => [],
});

export const useDocuments = () => useContext(DocumentContext);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { email } = useUser();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Load documents and categories from localStorage on initial load
  useEffect(() => {
    const loadDocuments = () => {
      const savedDocs = localStorage.getItem(`documents_${email}`);
      if (savedDocs) {
        try {
          const parsedDocs = JSON.parse(savedDocs);
          setDocuments(parsedDocs);
        } catch (err) {
          console.error("Error parsing documents from localStorage:", err);
          setDocuments([]);
        }
      }
    };
    
    const loadCategories = () => {
      const savedCategories = localStorage.getItem(`categories_${email}`);
      if (savedCategories) {
        try {
          const parsedCategories = JSON.parse(savedCategories);
          setCategories(parsedCategories);
        } catch (err) {
          console.error("Error parsing categories from localStorage:", err);
          setCategories([]);
        }
      }
    };
    
    if (email) {
      loadDocuments();
      loadCategories();
    }
  }, [email]);
  
  // Save documents to localStorage whenever they change
  useEffect(() => {
    if (email && documents.length > 0) {
      localStorage.setItem(`documents_${email}`, JSON.stringify(documents));
    }
  }, [documents, email]);
  
  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (email) {
      localStorage.setItem(`categories_${email}`, JSON.stringify(categories));
    }
  }, [categories, email]);
  
  // Add a new document
  const addDocument = (doc: Document): string => {
    const id = `doc_${Date.now()}`;
    const newDoc: Document = {
      ...doc,
      id,
      userId: email,
      createdAt: new Date().toISOString(),
      importance: doc.importance || 'medium'
    };
    
    setDocuments(prev => [...prev, newDoc]);
    return id;
  };
  
  // Update an existing document
  const updateDocument = (id: string, docUpdates: Partial<Document>) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id ? { ...doc, ...docUpdates } : doc
      )
    );
  };
  
  // Delete a document
  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };
  
  // Filter documents by type
  const filterDocumentsByType = (type: string): Document[] => {
    if (type === "All") {
      return documents.filter(doc => doc.userId === email);
    } else if (type === "upcoming") {
      return documents.filter(
        doc => doc.userId === email && doc.daysRemaining >= 0 && doc.daysRemaining <= 7
      );
    } else {
      return documents.filter(
        doc => doc.userId === email && doc.type === type
      );
    }
  };
  
  // Sort documents by various criteria
  const sortDocuments = (docs: Document[], sortBy: string): Document[] => {
    const sortedDocs = [...docs];
    
    switch (sortBy) {
      case "date-asc":
        // Sort by due date (ascending)
        return sortedDocs.sort((a, b) => {
          return a.daysRemaining - b.daysRemaining;
        });
      
      case "date-desc":
        // Sort by due date (descending)
        return sortedDocs.sort((a, b) => {
          return b.daysRemaining - a.daysRemaining;
        });
        
      case "importance-asc":
        // Sort by importance (ascending)
        return sortedDocs.sort((a, b) => {
          const importanceValues = { low: 1, medium: 2, high: 3, critical: 4 };
          const aValue = a.importance ? importanceValues[a.importance] : 2;
          const bValue = b.importance ? importanceValues[b.importance] : 2;
          return aValue - bValue;
        });
        
      case "importance-desc":
        // Sort by importance (descending)
        return sortedDocs.sort((a, b) => {
          const importanceValues = { low: 1, medium: 2, high: 3, critical: 4 };
          const aValue = a.importance ? importanceValues[a.importance] : 2;
          const bValue = b.importance ? importanceValues[b.importance] : 2;
          return bValue - aValue;
        });
        
      case "title-asc":
        // Sort alphabetically by title (A-Z)
        return sortedDocs.sort((a, b) => {
          return a.title.localeCompare(b.title);
        });
        
      case "title-desc":
        // Sort alphabetically by title (Z-A)
        return sortedDocs.sort((a, b) => {
          return b.title.localeCompare(a.title);
        });
        
      case "newest":
        // Sort by creation date (newest first)
        return sortedDocs.sort((a, b) => {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        });
        
      case "oldest":
        // Sort by creation date (oldest first)
        return sortedDocs.sort((a, b) => {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return aDate - bDate;
        });
        
      default:
        // Default: sort by due date (soonest first)
        return sortedDocs.sort((a, b) => {
          return a.daysRemaining - b.daysRemaining;
        });
    }
  };
  
  // Add a new custom category
  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
      toast({
        title: "Category Added",
        description: `"${category}" category has been added`,
      });
    }
  };
  
  // Remove a custom category
  const removeCategory = (category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
  };
  
  // Update document due date
  const updateDueDate = (id: string, newDueDate: string) => {
    setDocuments(prev => 
      prev.map(doc => {
        if (doc.id === id) {
          // Calculate new days remaining based on the new due date
          const dueDate = new Date(newDueDate);
          const today = new Date();
          const diffTime = dueDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return { 
            ...doc, 
            dueDate: newDueDate,
            daysRemaining: diffDays
          };
        }
        return doc;
      })
    );
  };
  
  // Set custom reminder days for a document
  const setCustomReminderDays = (id: string, days: number) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id ? { ...doc, customReminderDays: days } : doc
      )
    );
  };
  
  return (
    <DocumentContext.Provider 
      value={{ 
        documents, 
        categories,
        addDocument, 
        updateDocument, 
        deleteDocument, 
        filterDocumentsByType,
        addCategory,
        removeCategory,
        updateDueDate,
        setCustomReminderDays,
        sortDocuments,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
