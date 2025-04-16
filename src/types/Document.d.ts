
declare interface Document {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: "id_card" | "passport" | "driving_license" | "insurance" | "certificate" | "invoice" | "contract" | "tax" | "other";
  issueDate?: string;
  dueDate?: string;
  expiryDate?: string;
  fileName?: string;
  fileUrl?: string;
  fileURL?: string;
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
  pdfRotation?: number;
  dateAdded?: string;
}
