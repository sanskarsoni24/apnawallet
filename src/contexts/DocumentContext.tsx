import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { Document } from "@/types/Document";

interface DocumentContextType {
  documents: Document[];
  addDocument: (document: Omit<Document, "id">) => void;
  removeDocument: (id: string) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  getDocumentById: (id: string) => Document | undefined;
  filterDocumentsByType: (filterType: string) => Document[];
  getSecureVaultDocuments: () => Document[];
}

const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined
);

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocuments must be used within a DocumentProvider");
  }
  return context;
};

interface DocumentProviderProps {
  children: React.ReactNode;
}

export const DocumentProvider = ({ children }: DocumentProviderProps) => {
  const [documents, setDocuments] = useState<Document[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    const storedDocuments = localStorage.getItem("documents");
    return storedDocuments ? JSON.parse(storedDocuments) : [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("documents", JSON.stringify(documents));
    }
  }, [documents]);

  const addDocument = (document: Omit<Document, "id">) => {
    const newDocument: Document = {
      id: uuidv4(),
      ...document,
    };
    setDocuments([...documents, newDocument]);
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter((document) => document.id !== id));
  };

  // Add function to update a document
  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments(
      documents.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc))
    );
  };

  const getDocumentById = (id: string) => {
    return documents.find((document) => document.id === id);
  };

  // Filter documents by secure vault
  const getSecureVaultDocuments = () => {
    return documents.filter((doc) => doc.inSecureVault === true);
  };

  // Update the filterDocumentsByType function to respect the secure vault flag
  const filterDocumentsByType = (filterType: string) => {
    if (filterType === "All") {
      return documents.filter((doc) => doc.inSecureVault !== true);
    }

    if (filterType === "upcoming") {
      return documents.filter(
        (doc) =>
          doc.daysRemaining >= 0 &&
          doc.daysRemaining <= 7 &&
          doc.inSecureVault !== true
      );
    }

    return documents.filter(
      (doc) => doc.type === filterType.toLowerCase() && doc.inSecureVault !== true
    );
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        addDocument,
        removeDocument,
        updateDocument,
        getDocumentById,
        filterDocumentsByType,
        getSecureVaultDocuments,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
