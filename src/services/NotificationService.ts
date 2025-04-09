
import { toast } from "@/hooks/use-toast";
import { Document } from "@/contexts/DocumentContext";

// Global speech synthesis settings
let globalVoiceSettings = {
  volume: 0.8,  // 0 to 1
  rate: 1.0,    // 0.1 to 10
  pitch: 1.0,   // 0 to 2
  voiceName: "" // Empty string means default voice
};

/**
 * Speak a notification message using the browser's speech synthesis API
 * @param text The text to speak
 * @param options Optional settings to override global settings
 * @returns boolean indicating if speech synthesis is supported and started
 */
export const speakNotification = (
  text: string,
  options?: {
    volume?: number;
    rate?: number;
    pitch?: number;
    voiceName?: string;
  }
): boolean => {
  // Check if speech synthesis is supported
  if (typeof window === "undefined" || !window.speechSynthesis) {
    console.error("Speech synthesis not supported in this browser");
    return false;
  }

  try {
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply global settings with optional overrides
    utterance.volume = options?.volume ?? globalVoiceSettings.volume;
    utterance.rate = options?.rate ?? globalVoiceSettings.rate;
    utterance.pitch = options?.pitch ?? globalVoiceSettings.pitch;
    
    // Set voice if specified
    if (options?.voiceName || globalVoiceSettings.voiceName) {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(
        voice => voice.name === (options?.voiceName || globalVoiceSettings.voiceName)
      );
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (error) {
    console.error("Error speaking notification:", error);
    return false;
  }
};

/**
 * Update the global voice settings
 * @param settings New settings to apply
 */
export const updateVoiceSettings = (settings: {
  volume?: number;
  rate?: number;
  pitch?: number;
  voiceName?: string;
}): void => {
  globalVoiceSettings = {
    ...globalVoiceSettings,
    ...settings
  };
  
  // Clamp values to valid ranges
  globalVoiceSettings.volume = Math.max(0, Math.min(1, globalVoiceSettings.volume));
  globalVoiceSettings.rate = Math.max(0.1, Math.min(10, globalVoiceSettings.rate));
  globalVoiceSettings.pitch = Math.max(0, Math.min(2, globalVoiceSettings.pitch));
  
  // Save to localStorage for persistence
  try {
    localStorage.setItem('voice_settings', JSON.stringify(globalVoiceSettings));
  } catch (e) {
    console.error("Could not save voice settings to localStorage", e);
  }
};

/**
 * Load voice settings from localStorage
 */
export const loadVoiceSettings = (): void => {
  try {
    const savedSettings = localStorage.getItem('voice_settings');
    if (savedSettings) {
      globalVoiceSettings = {
        ...globalVoiceSettings,
        ...JSON.parse(savedSettings)
      };
    }
  } catch (e) {
    console.error("Could not load voice settings from localStorage", e);
  }
};

/**
 * Get the current voice settings
 */
export const getVoiceSettings = () => {
  return { ...globalVoiceSettings };
};

/**
 * Get all available voices
 */
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return [];
  }
  
  return window.speechSynthesis.getVoices();
};

/**
 * Test the current voice settings with a sample text
 */
export const testVoiceSettings = (): boolean => {
  return speakNotification("This is a test of your notification voice settings.");
};

/**
 * Stop any currently speaking utterance
 */
export const stopSpeaking = (): void => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Create a notification with both toast and optional voice
 */
export const createNotification = (
  title: string,
  message: string,
  options?: {
    variant?: "default" | "destructive";
    speak?: boolean;
  }
): void => {
  // Show toast notification
  toast({
    title,
    description: message,
    variant: options?.variant || "default",
  });
  
  // Speak notification if requested
  if (options?.speak) {
    speakNotification(`${title}. ${message}`);
  }
};

/**
 * Create an application notification
 * This is an alias for createNotification for backward compatibility
 */
export const createAppNotification = createNotification;

/**
 * Send an email notification
 * @param to recipient email address
 * @param subject email subject
 * @param body email body content
 * @returns boolean indicating if email was sent successfully
 */
export const sendEmailNotification = (
  to: string,
  subject: string,
  body: string
): boolean => {
  try {
    console.log(`[Email Notification] Sending email to: ${to}`);
    console.log(`[Email Notification] Subject: ${subject}`);
    console.log(`[Email Notification] Body: ${body}`);
    
    // For a real implementation, you would call an email service API here
    // Since we're in a front-end only environment without a backend,
    // we'll simulate email sending and store in localStorage for demo purposes
    
    const emailHistory = JSON.parse(localStorage.getItem('emailNotifications') || '[]');
    emailHistory.push({
      to,
      subject,
      body,
      timestamp: new Date().toISOString(),
      status: 'sent'
    });
    localStorage.setItem('emailNotifications', JSON.stringify(emailHistory));
    
    // Show toast notification to confirm email was sent
    toast({
      title: "Email Notification Sent",
      description: `Email sent to ${to} regarding ${subject}`,
    });
    
    return true;
  } catch (error) {
    console.error("Error sending email notification:", error);
    
    toast({
      title: "Email Notification Failed",
      description: "Could not send the email notification. Please try again later.",
      variant: "destructive"
    });
    
    return false;
  }
};

/**
 * Check for documents due soon and send notifications
 */
export const checkForDueDocuments = (
  documents: Document[], 
  userEmail: string,
  preferences: { 
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    voiceReminders?: boolean;
    reminderDays?: number;
    voiceType?: string;
  }
): void => {
  if (!documents || documents.length === 0) return;
  
  const today = new Date();
  const daysThreshold = preferences.reminderDays || 3;
  
  // Find documents that are due soon
  const dueSoonDocs = documents.filter(doc => {
    // Skip if no expiry date
    if (!doc.dueDate) return false;
    
    // Calculate days remaining
    const expiryDate = new Date(doc.dueDate);
    const timeDiff = expiryDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Check if within threshold and greater than 0 (not expired)
    return daysRemaining > 0 && daysRemaining <= daysThreshold;
  });
  
  // Send notifications if there are documents due soon
  if (dueSoonDocs.length > 0) {
    // Create notification message
    const title = "Documents Due Soon";
    const message = `You have ${dueSoonDocs.length} document${dueSoonDocs.length > 1 ? 's' : ''} expiring soon.`;
    
    // Show toast notification
    createNotification(title, message);
    
    // If voice reminders enabled, speak the notification
    if (preferences.voiceReminders) {
      const voiceOptions = preferences.voiceType ? { voiceName: preferences.voiceType } : undefined;
      speakNotification(`${title}. ${message}`, voiceOptions);
    }
    
    // If push notifications are enabled and supported by the browser
    if (preferences.pushNotifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico'
      });
    }
    
    // For email notifications, use our new email notification function
    if (preferences.emailNotifications && userEmail) {
      // Create a more detailed email body with document information
      let emailBody = `Dear SurakshitLocker User,\n\n`;
      emailBody += `You have ${dueSoonDocs.length} document${dueSoonDocs.length > 1 ? 's' : ''} that will expire soon:\n\n`;
      
      dueSoonDocs.forEach(doc => {
        const dueDate = doc.dueDate ? new Date(doc.dueDate).toLocaleDateString() : 'No due date';
        emailBody += `- ${doc.title} (${doc.type}): Due on ${dueDate}\n`;
      });
      
      emailBody += `\nPlease log in to your SurakshitLocker account to take action on these documents.\n\n`;
      emailBody += `Thank you for using SurakshitLocker!\n`;
      
      sendEmailNotification(
        userEmail,
        "SurakshitLocker - Documents Due Soon",
        emailBody
      );
    }
  }
};

/**
 * Verify email notification settings and permissions
 * @returns object with email notification status
 */
export const verifyEmailNotifications = (userEmail: string): { 
  enabled: boolean; 
  configured: boolean; 
  email: string 
} => {
  // In a real app, this would check server-side email configuration
  // For our demo, we'll just verify if the user has enabled email notifications
  const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
  const emailNotifications = userSettings.emailNotifications !== false; // Default to true
  
  return {
    enabled: emailNotifications,
    configured: !!userEmail,
    email: userEmail
  };
};

// Initialize voice settings when imported
if (typeof window !== "undefined") {
  loadVoiceSettings();
}
