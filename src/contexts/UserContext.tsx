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
  register: (email: string, password: string, name: string) => void;
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
  register: () => {},
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
  const [mockUsers, setMockUsers] = useState<Record<string, {password: string, name: string}>>(() => {
    const savedUsers = localStorage.getItem("mockUsers");
    if (savedUsers) {
      return JSON.parse(savedUsers);
    } else {
      // Default users
      const defaultUsers = {
        "user@example.com": {password: "password123", name: "Demo User"},
        "test@example.com": {password: "test123", name: "Test User"},
        "admin@example.com": {password: "admin123", name: "Admin User"},
      };
      localStorage.setItem("mockUsers", JSON.stringify(defaultUsers));
      return defaultUsers;
    }
  });

  // Register a new user
  const register = (userEmail: string, password: string, name: string) => {
    if (!userEmail || !password || !name) {
      throw new Error("Email, password, and name are required");
    }
    
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    
    // Check if the user already exists
    if (userEmail in mockUsers) {
      throw new Error("Email already in use");
    }
    
    // Add user to mock database
    const updatedUsers = {
      ...mockUsers,
      [userEmail]: {password, name}
    };
    
    setMockUsers(updatedUsers);
    localStorage.setItem("mockUsers", JSON.stringify(updatedUsers));
    
    // Log in the user after registration
    setIsLoggedIn(true);
    setEmail(userEmail);
    setDisplayName(name);
    
    const updatedSettings = {
      ...userSettings,
      email: userEmail,
      displayName: name,
      isLoggedIn: true,
      lastLogin: new Date().toISOString(),
    };
    
    // Save to localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
    setUserSettings(updatedSettings);
    
    toast({
      title: "Account created successfully",
      description: `Welcome, ${name}!`
    });
  };
  
  // Login function with proper validation and password check
  const login = (userEmail: string, password: string) => {
    if (!userEmail || !password) {
      throw new Error("Email and password are required");
    }
    
    // Check if the user exists
    if (!(userEmail in mockUsers)) {
      throw new Error("Invalid email or password");
    }
    
    // Validate password strictly
    if (mockUsers[userEmail].password !== password) {
      throw new Error("Invalid email or password");
    }
    
    setIsLoggedIn(true);
    setEmail(userEmail);
    
    // Set display name from the mock database
    const userName = mockUsers[userEmail].name;
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
    
    console.log("Updated settings:", updatedSettings);
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

  // Initialize theme based on user settings
  useEffect(() => {
    const theme = userSettings.theme || "system";
    document.documentElement.classList.remove("light", "dark");
    
    if (theme === "system") {
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.add(isDarkMode ? "dark" : "light");
      
      // Add listener for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(e.matches ? "dark" : "light");
      };
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      document.documentElement.classList.add(theme);
    }
  }, [userSettings.theme]);

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
        register,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
