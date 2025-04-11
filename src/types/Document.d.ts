
declare interface Document {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: "id_card" | "passport" | "driving_license" | "insurance" | "certificate" | "invoice" | "contract" | "tax" | "other";
  issueDate?: string;
  dueDate?: string;
  fileName?: string;
  fileURL?: string;
  fileUrl?: string; // Support both casing for backward compatibility
  fileSize?: number;
  fileType?: string;
  tags?: string[];
  daysRemaining?: number;
  customReminderDays?: number;
  summary?: string;
  category?: string;
  notes?: string;
  inSecureVault?: boolean;
  status?: "active" | "expired" | "pending" | "completed" | "deleted";
  importance?: "low" | "medium" | "high" | "critical";
  pdfPageCount?: number;
  pdfPassword?: string;
  isPasswordProtected?: boolean;
  pdfLastPage?: number;
  pdfAnnotations?: PdfAnnotation[];
}

declare interface PdfAnnotation {
  id: string;
  pageNumber: number;
  type: "highlight" | "note" | "underline" | "drawing" | "text";
  content?: string;
  color?: string;
  position?: {
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
  createdAt: string;
  updatedAt?: string;
}
