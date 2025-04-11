
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
  fileSize?: number;
  fileType?: string;
  tags?: string[];
  daysRemaining?: number;
  reminderSet?: boolean;
  customReminderDays?: number;
  category?: string;
  notes?: string;
  inSecureVault?: boolean;
  importance?: "low" | "medium" | "high" | "critical";
}
