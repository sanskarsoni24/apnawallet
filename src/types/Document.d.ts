
interface Document {
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
  categories?: string[];
}
