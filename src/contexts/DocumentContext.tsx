
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
}

interface DocumentContextProps {
  documents: Document[];
  addDocument: (document: Document) => void;
  removeDocument: (id: string) => void;
  documentTypes: string[];
  addDocumentType: (type: string) => void;
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

  const addDocumentType = (type: string) => {
    if (!documentTypes.includes(type)) {
      setDocumentTypes(prev => [...prev, type]);
    }
  };

  return (
    <DocumentContext.Provider value={{
      documents,
      addDocument,
      removeDocument,
      documentTypes,
      addDocumentType
    }}>
      {children}
    </DocumentContext.Provider>
  );
};
