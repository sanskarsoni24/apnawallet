
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { generateId } from "@/lib/utils";
import { Document } from "@/types/Document";

interface DocumentContextType {
  documents: Document[];
  addDocument: (document: Omit<Document, "id">) => void;
  removeDocument: (id: string) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  getDocumentById: (id: string) => Document | undefined;
  filterDocumentsByType: (filterType: string) => Document[];
  getSecureVaultDocuments: () => Document[];
  setCustomReminderDays: (id: string, days: number) => void;
  categories: string[];
  documentTypes: string[];
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  addDocumentType: (type: string) => void;
  markDocumentComplete: (id: string) => void;
  markDocumentExpired: (id: string) => void;
  scheduleRenewal: (id: string, date: string) => void;
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

  const [categories, setCategories] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return ["Personal", "Financial", "Medical", "Travel", "Work"];
    }
    const storedCategories = localStorage.getItem("document_categories");
    return storedCategories ? JSON.parse(storedCategories) : ["Personal", "Financial", "Medical", "Travel", "Work"];
  });

  const [documentTypes, setDocumentTypes] = useState<string[]>(() => {
    return ["id_card", "passport", "driving_license", "insurance", "certificate", "invoice", "contract", "tax", "other"];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("documents", JSON.stringify(documents));
    }
  }, [documents]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("document_categories", JSON.stringify(categories));
    }
  }, [categories]);

  const addDocument = (document: Omit<Document, "id">) => {
    const newDocument: Document = {
      id: generateId(),
      ...document,
    };
    setDocuments([...documents, newDocument]);
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter((document) => document.id !== id));
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments(
      documents.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc))
    );
  };

  const getDocumentById = (id: string) => {
    return documents.find((document) => document.id === id);
  };

  const getSecureVaultDocuments = () => {
    return documents.filter((doc) => doc.inSecureVault === true);
  };

  const filterDocumentsByType = (filterType: string) => {
    if (filterType === "All") {
      return documents.filter((doc) => doc.inSecureVault !== true);
    }

    if (filterType === "upcoming") {
      return documents.filter(
        (doc) =>
          doc.daysRemaining !== undefined &&
          doc.daysRemaining >= 0 &&
          doc.daysRemaining <= 7 &&
          doc.inSecureVault !== true
      );
    }

    return documents.filter(
      (doc) => doc.type === filterType.toLowerCase() && doc.inSecureVault !== true
    );
  };

  // Custom reminder days for a document
  const setCustomReminderDays = (id: string, days: number) => {
    updateDocument(id, { customReminderDays: days });
  };

  // Category management
  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  const removeCategory = (category: string) => {
    setCategories(categories.filter(c => c !== category));
  };

  // Document type management
  const addDocumentType = (type: string) => {
    if (!documentTypes.includes(type)) {
      setDocumentTypes([...documentTypes, type]);
    }
  };

  // Document status management
  const markDocumentComplete = (id: string) => {
    updateDocument(id, { status: "completed" });
  };

  const markDocumentExpired = (id: string) => {
    updateDocument(id, { status: "expired" });
  };

  const scheduleRenewal = (id: string, date: string) => {
    updateDocument(id, { renewalDate: date });
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
        setCustomReminderDays,
        categories,
        documentTypes,
        addCategory,
        removeCategory,
        addDocumentType,
        markDocumentComplete,
        markDocumentExpired,
        scheduleRenewal
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};

export type { Document };
