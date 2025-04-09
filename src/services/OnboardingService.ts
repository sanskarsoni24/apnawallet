
import { toast } from "@/hooks/use-toast";
import { GuideStep } from "@/components/onboarding/GuidedMessage";

// Store which guides the user has seen
const GUIDES_STORAGE_KEY = 'surakshitlocker_completed_guides';
const ONBOARDING_COMPLETE_KEY = 'surakshitlocker_onboarding_complete';

export interface Guide {
  id: string;
  title: string;
  steps: GuideStep[];
  triggerPath?: string; // URL path that triggers this guide
  triggerAction?: string; // Action that triggers this guide
  showOnce?: boolean; // If true, only show once per user
  priority?: number; // Higher priority guides show first
}

// Demo guides data
const guides: Guide[] = [
  {
    id: "welcome",
    title: "Welcome to SurakshitLocker",
    showOnce: true,
    priority: 100,
    triggerPath: "/dashboard",
    steps: [
      {
        id: "welcome-1",
        title: "Welcome to SurakshitLocker",
        description: "Your secure document manager that helps you keep track of all your important documents in one place.",
        placement: "center",
      },
      {
        id: "welcome-2",
        title: "Upload Documents",
        description: "Start by uploading your important documents. We'll help you keep track of expiry dates and send reminders.",
        highlightElement: "#upload-documents",
        placement: "bottom",
      },
      {
        id: "welcome-3",
        title: "View & Manage Documents",
        description: "View all your documents in one place. Filter by category or search for specific documents.",
        placement: "bottom",
      },
      {
        id: "welcome-4",
        title: "Get Notified",
        description: "We'll remind you when documents are about to expire. Configure your notification preferences in settings.",
        placement: "bottom",
      }
    ],
  },
  {
    id: "upload-guide",
    title: "Document Upload Guide",
    showOnce: true,
    priority: 90,
    triggerPath: "/documents",
    steps: [
      {
        id: "upload-1",
        title: "Upload Documents",
        description: "You can upload documents by dragging and dropping files or by clicking the upload button.",
        placement: "bottom",
      },
      {
        id: "upload-2",
        title: "Multiple Documents",
        description: "You can upload multiple documents at once. Just select all the files you want to upload.",
        placement: "bottom",
      },
      {
        id: "upload-3",
        title: "Document Categories",
        description: "Categorize your documents to keep them organized. You can create custom categories too!",
        placement: "bottom",
      }
    ],
  },
  {
    id: "settings-guide",
    title: "Notification Settings",
    showOnce: true,
    priority: 80,
    triggerPath: "/settings",
    steps: [
      {
        id: "settings-1",
        title: "Notification Settings",
        description: "Configure how you want to be notified about your documents. You can enable email, push and voice notifications.",
        placement: "bottom",
      },
      {
        id: "settings-2",
        title: "Email Notifications",
        description: "Get notified via email when your documents are about to expire.",
        placement: "bottom",
      },
      {
        id: "settings-3",
        title: "Voice Reminders",
        description: "Enable voice reminders to hear notifications about your documents.",
        placement: "bottom",
      }
    ],
  }
];

// Get a guide by ID
export const getGuideById = (id: string): Guide | undefined => {
  return guides.find(guide => guide.id === id);
};

// Get guides for the current path
export const getGuidesForPath = (path: string): Guide[] => {
  return guides
    .filter(guide => guide.triggerPath === path)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));
};

// Check if a guide should be shown
export const shouldShowGuide = (guideId: string): boolean => {
  // Check if onboarding is complete
  const onboardingComplete = localStorage.getItem(ONBOARDING_COMPLETE_KEY) === 'true';
  
  // Get the guide
  const guide = getGuideById(guideId);
  
  if (!guide) return false;
  
  // If guide is set to showOnce, check if it has been completed
  if (guide.showOnce) {
    const completedGuides = getCompletedGuides();
    if (completedGuides.includes(guideId)) return false;
  }
  
  // For welcome guide, check if onboarding is complete
  if (guideId === 'welcome' && onboardingComplete) return false;
  
  return true;
};

// Mark a guide as completed
export const markGuideAsCompleted = (guideId: string): void => {
  const completedGuides = getCompletedGuides();
  
  if (!completedGuides.includes(guideId)) {
    completedGuides.push(guideId);
    localStorage.setItem(GUIDES_STORAGE_KEY, JSON.stringify(completedGuides));
  }
  
  // If welcome guide is completed, mark onboarding as complete
  if (guideId === 'welcome') {
    localStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
  }
};

// Get all completed guides
export const getCompletedGuides = (): string[] => {
  const completedGuides = localStorage.getItem(GUIDES_STORAGE_KEY);
  return completedGuides ? JSON.parse(completedGuides) : [];
};

// Reset all guides (for testing)
export const resetAllGuides = (): void => {
  localStorage.removeItem(GUIDES_STORAGE_KEY);
  localStorage.removeItem(ONBOARDING_COMPLETE_KEY);
  toast({
    title: "Guides Reset",
    description: "All guides have been reset and will be shown again.",
  });
};
