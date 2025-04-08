import { toast } from "@/hooks/use-toast";

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
    variant?: "default" | "destructive" | "success";
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

// Initialize voice settings when imported
if (typeof window !== "undefined") {
  loadVoiceSettings();
}
