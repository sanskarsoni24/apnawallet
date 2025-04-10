
interface Document {
  id: string;
  title: string;
  type: string;
  dateAdded: string;
  lastModified?: string;
  expiryDate?: string;
  reminderDate?: string;
  category?: string;
  tags?: string[];
  fileSize?: number;
  fileType?: string;
  thumbnailUrl?: string;
  downloadUrl?: string;
  isShared?: boolean;
  sharedWith?: string[];
  isStarred?: boolean;
  isArchived?: boolean;
  notes?: string;
  status?: 'active' | 'expired' | 'pending' | 'completed' | 'deleted';
  summary?: string;
  daysRemaining?: number;
  dueDate?: string;
  fileURL?: string;
  description?: string;
  customReminderDays?: number;
  userId?: string;
  importance?: 'low' | 'medium' | 'high' | 'critical';
  createdAt?: string;
  categories?: string[];
}
