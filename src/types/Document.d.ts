
declare interface Document {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: "id_card" | "passport" | "driving_license" | "insurance" | "certificate" | "invoice" | "contract" | "tax" | "other";
  issueDate?: string;
  dueDate?: string;
  fileName?: string;
  fileUrl?: string;
  fileURL?: string; // Keep both for compatibility
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
  isPasswordProtected?: boolean;
  pdfLastPage?: number;
  pdfPassword?: string;
  pdfAnnotations?: Array<{
    id: string;
    page: number;
    type: "highlight" | "note" | "underline" | "strikethrough" | "drawing";
    content?: string;
    color?: string;
    position?: { x: number; y: number; width: number; height: number };
    createdAt: string;
  }>;
  pdfBookmarks?: Array<{
    id: string;
    page: number;
    title: string;
    createdAt: string;
  }>;
  pdfRotation?: 0 | 90 | 180 | 270;
}
