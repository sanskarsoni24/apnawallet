
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Document {
  id: string;
  title: string;
  type: string;
  dueDate: string;
  daysRemaining: number;
  fileURL: string;
  description?: string;
  customReminderDays?: number;
  summary?: string;
  importance?: "critical" | "high" | "medium" | "low";
}

interface DocumentContextProps {
  documents: Document[];
  addDocument: (document: Document) => void;
  removeDocument: (id: string) => void;
  deleteDocument: (id: string) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  updateDueDate: (id: string, newDate: string) => void;
  documentTypes: string[];
  addDocumentType: (type: string) => void;
  categories: string[];
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  setCustomReminderDays: (id: string, days: number) => void;
  filterDocumentsByType: (type: string) => Document[];
}

const DocumentContext = createContext<DocumentContextProps | undefined>(undefined);

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentsProvider');
  }
  return context;
};

export const DocumentsProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentTypes, setDocumentTypes] = useState<string[]>([
    'Invoice',
    'Receipt',
    'Contract',
    'ID Card',
    'Certificate',
    'Medical Record',
    'Tax Document',
    'Insurance'
  ]);
  const [categories, setCategories] = useState<string[]>([
    'Personal',
    'Work',
    'Financial',
    'Health',
    'Legal'
  ]);

  const addDocument = (document: Document) => {
    const docWithId = {
      ...document,
      id: document.id || uuidv4()
    };
    setDocuments(prev => [...prev, docWithId]);
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  // Alias for removeDocument to match naming conventions used in components
  const deleteDocument = (id: string) => {
    removeDocument(id);
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments(prev => 
      prev.map(doc => (doc.id === id ? { ...doc, ...updates } : doc))
    );
  };

  const updateDueDate = (id: string, newDate: string) => {
    setDocuments(prev => 
      prev.map(doc => {
        if (doc.id === id) {
          // Calculate new days remaining
          const dueDate = new Date(newDate);
          const today = new Date();
          const diffTime = dueDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          return { 
            ...doc, 
            dueDate: newDate,
            daysRemaining: diffDays
          };
        }
        return doc;
      })
    );
  };

  const addDocumentType = (type: string) => {
    if (!documentTypes.includes(type)) {
      setDocumentTypes(prev => [...prev, type]);
    }
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const removeCategory = (category: string) => {
    setCategories(prev => prev.filter(cat => cat !== category));
  };

  const setCustomReminderDays = (id: string, days: number) => {
    setDocuments(prev => 
      prev.map(doc => (doc.id === id ? { ...doc, customReminderDays: days } : doc))
    );
  };

  const filterDocumentsByType = (type: string) => {
    if (type === "All") {
      return documents;
    }
    return documents.filter(doc => doc.type === type || doc.categories?.includes(type));
  };

  return (
    <DocumentContext.Provider value={{
      documents,
      addDocument,
      removeDocument,
      deleteDocument,
      updateDocument,
      updateDueDate,
      documentTypes,
      addDocumentType,
      categories,
      addCategory,
      removeCategory,
      setCustomReminderDays,
      filterDocumentsByType
    }}>
      {children}
    </DocumentContext.Provider>
  );
};
