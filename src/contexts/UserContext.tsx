
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface UserSettings {
  displayName?: string;
  email?: string;
  isLoggedIn?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  voiceReminders?: boolean;
  reminderDays?: number;
  theme?: string;
  lastLogin?: string;
  voiceType?: string;
}

interface UserContextType {
  isLoggedIn: boolean;
  displayName: string;
  email: string;
  userSettings: UserSettings;
  login: (email: string, password: string) => void;
  logout: () => void;
  updateProfile: (name: string, email: string) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
}

const defaultContextValue: UserContextType = {
  isLoggedIn: false,
  displayName: "",
  email: "",
  userSettings: {},
  login: () => {},
  logout: () => {},
  updateProfile: () => {},
  updateUserSettings: () => {},
};

const UserContext = createContext<UserContextType>(defaultContextValue);

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    return loginStatus === "true"; // Only true if explicitly set to true
  });

  // Get user info from localStorage if available
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const savedSettings = localStorage.getItem("userSettings");
    return savedSettings ? JSON.parse(savedSettings) : {
      displayName: "",
      email: "",
      isLoggedIn: false,
      emailNotifications: true,
      pushNotifications: false,
      voiceReminders: false,
      reminderDays: 3,
      theme: "system",
      voiceType: "default",
    };
  });
  
  const [displayName, setDisplayName] = useState(userSettings.displayName || "");
  const [email, setEmail] = useState(userSettings.email || "");

  // Mock user database for simple authentication
  const mockUsers: Record<string, string> = {
    "user@example.com": "password123",
    "test@example.com": "test123",
    "admin@example.com": "admin123",
  };

  // Login function with proper validation and password check
  const login = (userEmail: string, password: string) => {
    if (!userEmail || !password) {
      throw new Error("Email and password are required");
    }
    
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    
    // Check if the user exists
    if (!(userEmail in mockUsers)) {
      throw new Error("Invalid email or password");
    }
    
    // Validate password strictly
    if (mockUsers[userEmail] !== password) {
      throw new Error("Invalid email or password");
    }
    
    setIsLoggedIn(true);
    setEmail(userEmail);
    
    // Find or set display name
    let userName = displayName || userEmail.split('@')[0];
    setDisplayName(userName);
    
    const updatedSettings = {
      ...userSettings,
      email: userEmail,
      displayName: userName,
      isLoggedIn: true,
      lastLogin: new Date().toISOString(),
    };
    
    // Save to localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
    setUserSettings(updatedSettings);
    
    toast({
      title: "Signed in successfully",
      description: `Welcome back, ${userName}!`
    });
  };

  // Logout function
  const logout = () => {
    setIsLoggedIn(false);
    
    const updatedSettings = {
      ...userSettings,
      isLoggedIn: false,
    };
    
    // Update localStorage
    localStorage.setItem("isLoggedIn", "false");
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
    setUserSettings(updatedSettings);
    
    toast({
      title: "Signed out",
      description: "You have been signed out of your account"
    });
  };

  // Update profile function
  const updateProfile = (name: string, userEmail: string) => {
    setDisplayName(name);
    setEmail(userEmail);
    
    const updatedSettings = {
      ...userSettings,
      displayName: name,
      email: userEmail,
    };
    
    // Save to localStorage
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
    setUserSettings(updatedSettings);
  };
  
  // Update user settings
  const updateUserSettings = (settings: Partial<UserSettings>) => {
    const updatedSettings = {
      ...userSettings,
      ...settings,
    };
    
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
    setUserSettings(updatedSettings);
    
    // Update display name and email if they were changed
    if (settings.displayName) {
      setDisplayName(settings.displayName);
    }
    
    if (settings.email) {
      setEmail(settings.email);
    }
  };

  // Listen for changes in localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "isLoggedIn") {
        setIsLoggedIn(e.newValue === "true");
      } else if (e.key === "userSettings") {
        try {
          const settings = JSON.parse(e.newValue || "{}");
          setUserSettings(settings);
          setDisplayName(settings.displayName || displayName);
          setEmail(settings.email || email);
        } catch (error) {
          console.error("Error parsing userSettings from localStorage", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [displayName, email]);

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        displayName,
        email,
        userSettings,
        login,
        logout,
        updateProfile,
        updateUserSettings,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
