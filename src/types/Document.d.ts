
export interface Document {
  id: string;
  title: string;
  type?: string;
  category?: string;
  tags?: string[];
  dueDate?: string;
  isImportant?: boolean;
  created?: string;
  updated?: string;
  importanceLevel?: 'low' | 'medium' | 'high' | 'critical';
  reminderDate?: string;
  reminderSent?: boolean;
  isShared?: boolean;
  sharedWith?: string[];
  isArchived?: boolean;
  isDeleted?: boolean;
  notes?: string;
  summary?: string;
  
  // PDF specific properties
  fileType?: string;
  fileName?: string;
  fileSize?: number;
  pdfPageCount?: number;
  pdfLastPage?: number;
  pdfPassword?: string;
  isPasswordProtected?: boolean;
}
