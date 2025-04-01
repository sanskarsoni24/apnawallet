
import { toast } from "@/hooks/use-toast";
import { Document } from "@/contexts/DocumentContext";

// Speech synthesis for voice reminders
const speakNotification = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
    return true;
  }
  return false;
};

// Send email notification (mock implementation)
// In a real app, this would call your backend API
const sendEmailNotification = async (email: string, subject: string, body: string) => {
  console.log(`Email notification to ${email}: ${subject} - ${body}`);
  
  // This is a mock implementation
  // In a real app, you would call your backend API
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      toast({
        title: "Email Notification Sent",
        description: `Sent to: ${email}`,
      });
      resolve(true);
    }, 1000);
  });
};

// Check for documents nearing their due date and send reminders
const checkForDueDocuments = (documents: Document[], userEmail: string, preferences: any) => {
  const { emailNotifications, pushNotifications, voiceReminders, reminderDays } = preferences;
  const daysThreshold = parseInt(reminderDays) || 3;
  
  // Filter documents that are due within the threshold
  const dueDocuments = documents.filter(
    doc => doc.daysRemaining > 0 && doc.daysRemaining <= daysThreshold
  );
  
  if (dueDocuments.length === 0) return;
  
  // Handle notifications based on user preferences
  dueDocuments.forEach(doc => {
    const notificationText = `${doc.title} is due in ${doc.daysRemaining} day${doc.daysRemaining !== 1 ? 's' : ''}`;
    
    // Push notification
    if (pushNotifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification("DocuNinja Reminder", {
        body: notificationText,
        icon: "/favicon.ico"
      });
    }
    
    // Voice reminder
    if (voiceReminders) {
      speakNotification(notificationText);
    }
    
    // Email notification
    if (emailNotifications && userEmail) {
      sendEmailNotification(
        userEmail,
        `Reminder: ${doc.title} is due soon`,
        `Your document "${doc.title}" is due in ${doc.daysRemaining} day${doc.daysRemaining !== 1 ? 's' : ''}.`
      );
    }
  });
};

export { speakNotification, sendEmailNotification, checkForDueDocuments };
