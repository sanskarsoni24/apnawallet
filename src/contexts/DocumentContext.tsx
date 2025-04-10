
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the structure of a document
export type Document = {
  id: string;
  title: string;
  type: string;
  dueDate: string;
  daysRemaining: number;
  fileURL: string;
  description?: string;
  customReminderDays?: number;
  summary?: string;
};

// Define the structure of the context
type DocumentContextType = {
  documents: Document[];
  addDocument: (document: Document) => void;
  deleteDocument: (id: string) => void;
  editDocument: (id: string, updates: Partial<Document>) => void;
  documentTypes: string[];
  addDocumentType: (type: string) => void;
  deleteDocumentType: (type: string) => void;
};

// Create the context with a default value
const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

// Create a provider component
type DocumentProviderProps = {
  children: ReactNode;
};

export const DocumentProvider: React.FC<DocumentProviderProps> = ({ children }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentTypes, setDocumentTypes] = useState<string[]>(['Invoice', 'Passport', 'License', 'Insurance', 'Tax Document', 'Certificate', 'Other'].sort());

  // Function to add a new document
  const addDocument = (document: Document) => {
    const newId = Math.random().toString(36).substring(2, 15);
    setDocuments([...documents, { ...document, id: newId }]);
  };

  // Function to delete a document
  const deleteDocument = (id: string) => {
    setDocuments(documents.filter((document) => document.id !== id));
  };

  // Function to edit a document
  const editDocument = (id: string, updates: Partial<Document>) => {
    setDocuments(
      documents.map((document) =>
        document.id === id ? { ...document, ...updates } : document
      )
    );
  };

  // Function to add a new document type
  const addDocumentType = (type: string) => {
    setDocumentTypes([...documentTypes, type].sort());
  };

  // Function to delete a document type
  const deleteDocumentType = (type: string) => {
    setDocumentTypes(documentTypes.filter((docType) => docType !== type).sort());
  };

  // Provide the context value
  const value: DocumentContextType = {
    documents,
    addDocument,
    deleteDocument,
    editDocument,
    documentTypes,
    addDocumentType,
    deleteDocumentType,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

// Create a hook to use the context
export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};
