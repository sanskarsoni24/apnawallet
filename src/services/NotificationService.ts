
import { toast } from "@/hooks/use-toast";
import { Document } from "@/contexts/DocumentContext";

// Speech synthesis for voice reminders
const speakNotification = (text: string, voiceType: string = 'default') => {
  if ('speechSynthesis' in window) {
    // Cancel any previous speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get available voices
    let voices = window.speechSynthesis.getVoices();
    
    // If voices array is empty, wait for them to load
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        setVoiceBasedOnType(utterance, voices, voiceType);
        window.speechSynthesis.speak(utterance);
      };
    } else {
      setVoiceBasedOnType(utterance, voices, voiceType);
      window.speechSynthesis.speak(utterance);
    }
    
    return true;
  }
  return false;
};

// Helper function to set voice based on type
const setVoiceBasedOnType = (utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[], voiceType: string) => {
  // Set some basic properties
  utterance.rate = 1.0;  // Speed of speech (1.0 is normal)
  utterance.pitch = 1.0; // Pitch (1.0 is normal)
  utterance.volume = 0.8; // Volume (0.0 to 1.0)
  
  switch(voiceType) {
    case "male":
      // Find first male voice (usually deeper voices)
      const maleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes("male") || 
        voice.name.includes("David") || 
        voice.name.includes("Mark") || 
        voice.name.includes("Tom")
      );
      if (maleVoice) utterance.voice = maleVoice;
      utterance.pitch = 0.9; // Deeper pitch for male voice
      break;
      
    case "female":
      // Find first female voice
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes("female") || 
        voice.name.includes("Samantha") || 
        voice.name.includes("Victoria") || 
        voice.name.includes("Karen")
      );
      if (femaleVoice) utterance.voice = femaleVoice;
      utterance.pitch = 1.1; // Slightly higher pitch for female voice
      break;
      
    case "robot":
      const robotVoice = voices.find(voice =>
        voice.name.includes("Google") ||
        voice.name.toLowerCase().includes("robot")
      );
      if (robotVoice) utterance.voice = robotVoice;
      utterance.rate = 0.9; // Slower for robot voice
      utterance.pitch = 0.7; // Much lower pitch for robot-like effect
      break;
      
    default:
      // Try to use a neutral voice or system default
      const neutralVoice = voices.find(voice => 
        voice.default || 
        voice.name.includes("Default") ||
        voice.name.includes("Daniel") ||
        voice.name.includes("Google US English")
      );
      if (neutralVoice) utterance.voice = neutralVoice;
      break;
  }
  
  // Log available voices for debugging
  console.log("Available voices:", voices.map(v => v.name));
  console.log("Selected voice type:", voiceType);
  console.log("Selected voice:", utterance.voice?.name || "Default system voice");
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

// Create app notification
const createAppNotification = (title: string, description: string) => {
  // This would typically update the notification state in a real app
  // For this mock implementation, we'll just show a toast
  toast({
    title,
    description,
  });
  
  // Trigger an event so other components can update their notification state
  const event = new CustomEvent('newNotification', { 
    detail: { title, description, time: 'Just now', read: false } 
  });
  window.dispatchEvent(event);
  
  return true;
};

// Check for documents that need reminders
// Modified to respect document-level reminder settings
const checkForDueDocuments = (documents: Document[], userEmail: string, preferences: any) => {
  const { emailNotifications, pushNotifications, voiceReminders, reminderDays, voiceType } = preferences;
  
  // Group by document-specific or global threshold
  const documentsByThreshold: Record<string, Document[]> = {};
  
  // Filter documents that are due within their respective thresholds
  documents.forEach(doc => {
    // Use document-specific reminder days if available, otherwise use global setting
    const daysThreshold = doc.customReminderDays !== undefined ? doc.customReminderDays : (parseInt(reminderDays) || 3);
    
    if (doc.daysRemaining > 0 && doc.daysRemaining <= daysThreshold) {
      if (!documentsByThreshold[daysThreshold]) {
        documentsByThreshold[daysThreshold] = [];
      }
      documentsByThreshold[daysThreshold].push(doc);
    }
  });
  
  // Exit if no documents match any threshold
  if (Object.keys(documentsByThreshold).length === 0) return;
  
  // Process each threshold group separately
  Object.entries(documentsByThreshold).forEach(([threshold, docs]) => {
    // Create notification message for this threshold
    let notificationTitle = `Document Reminder (${threshold} days)`;
    let notificationText = '';
    
    if (docs.length === 1) {
      notificationText = `${docs[0].title} is due in ${docs[0].daysRemaining} day${docs[0].daysRemaining !== 1 ? 's' : ''}`;
    } else {
      notificationText = `${docs.length} documents are due within ${docs[0].daysRemaining} days`;
    }
    
    // App notification
    createAppNotification(notificationTitle, notificationText);
    
    // Only send push notifications if enabled
    if (pushNotifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notificationTitle, {
        body: notificationText,
        icon: "/favicon.ico"
      });
    }
    
    // Voice reminder only for critical documents
    if (voiceReminders) {
      const criticalDocs = docs.filter(d => d.daysRemaining <= 3);
      if (criticalDocs.length > 0) {
        const criticalText = criticalDocs.length === 1 
          ? `Urgent reminder: ${criticalDocs[0].title} is due in ${criticalDocs[0].daysRemaining} day${criticalDocs[0].daysRemaining !== 1 ? 's' : ''}`
          : `Urgent reminder: ${criticalDocs.length} important documents are due soon`;
        speakNotification(criticalText, voiceType || 'default');
      }
    }
    
    // Email notification (once per day)
    if (emailNotifications && userEmail) {
      const lastSentKey = `last_email_sent_${threshold}`;
      const lastSent = localStorage.getItem(lastSentKey);
      const today = new Date().toDateString();
      
      if (lastSent !== today) {
        // Build email content
        const docList = docs.map(d => 
          `- ${d.title}: due in ${d.daysRemaining} day${d.daysRemaining !== 1 ? 's' : ''}`
        ).join('\n');
        
        sendEmailNotification(
          userEmail,
          `DocuNinja: Document Reminders (${threshold} days)`,
          `The following documents need your attention:\n\n${docList}`
        );
        
        localStorage.setItem(lastSentKey, today);
      }
    }
  });
};

export { speakNotification, sendEmailNotification, createAppNotification, checkForDueDocuments };
