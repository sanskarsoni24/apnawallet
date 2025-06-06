
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
  subscriptionPlan?: 'free' | 'basic' | 'premium' | 'enterprise';
  documentLimit?: number;
  documentSizeLimit?: number;
  twoFactorEnabled?: boolean;
  recoveryEmail?: string;
  backupKeyCreated?: boolean;
  backupKeyLocation?: string;
  lastKeyBackup?: string;
  autoBackup?: boolean;
  backupFrequency?: string;
  cloudExportProviders?: string[];
  mobileDeviceName?: string;
  googleConnected?: boolean;
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
  enableTwoFactor: () => void;
  disableTwoFactor: () => void;
  createBackupKey: () => void;
  restoreFromBackupKey: (key: string) => boolean;
  isGoogleConnected: boolean;
  connectGoogle: () => void;
  disconnectGoogle: () => void;
  getUserSubscriptionDetails: () => {
    plan: string;
    expiresOn: string;
    documentLimit: number;
    documentSizeLimit: number;
  };
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
  enableTwoFactor: () => {},
  disableTwoFactor: () => {},
  createBackupKey: () => {},
  restoreFromBackupKey: () => false,
  isGoogleConnected: false,
  connectGoogle: () => {},
  disconnectGoogle: () => {},
  getUserSubscriptionDetails: () => ({
    plan: 'free',
    expiresOn: '',
    documentLimit: 10,
    documentSizeLimit: 5
  }),
};

const UserContext = createContext<UserContextType>(defaultContextValue);

export const useUser = () => useContext(UserContext);

const getDocumentLimits = (plan: string = 'free') => {
  switch(plan) {
    case 'basic':
      return { documentLimit: 50, documentSizeLimit: 15 };
    case 'premium':
      return { documentLimit: 1000000, documentSizeLimit: 25 }; // Virtually unlimited
    case 'enterprise':
      return { documentLimit: 1000000, documentSizeLimit: 100 }; // Virtually unlimited
    default: // free
      return { documentLimit: 10, documentSizeLimit: 5 };
  }
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    return loginStatus === "true"; // Only true if explicitly set to true
  });

  // Get user info from localStorage if available
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const savedSettings = localStorage.getItem("userSettings");
    const parsedSettings = savedSettings ? JSON.parse(savedSettings) : {
      displayName: "",
      email: "",
      isLoggedIn: false,
      emailNotifications: true,
      pushNotifications: false,
      voiceReminders: false,
      reminderDays: 3,
      theme: "system",
      voiceType: "default",
      subscriptionPlan: "free" as 'free', // Type assertion to ensure it's one of the allowed values
      twoFactorEnabled: false,
      backupKeyCreated: false,
      autoBackup: false,
      backupFrequency: "weekly",
      cloudExportProviders: [],
      googleConnected: false,
      mobileDeviceName: "",
      ...getDocumentLimits("free")
    };
    
    // Ensure document limits match the subscription plan
    if (parsedSettings.subscriptionPlan && !parsedSettings.documentLimit) {
      const limits = getDocumentLimits(parsedSettings.subscriptionPlan);
      parsedSettings.documentLimit = limits.documentLimit;
      parsedSettings.documentSizeLimit = limits.documentSizeLimit;
    }
    
    return parsedSettings;
  });
  
  const [displayName, setDisplayName] = useState(userSettings.displayName || "");
  const [email, setEmail] = useState(userSettings.email || "");
  const [isGoogleConnected, setIsGoogleConnected] = useState(userSettings.googleConnected || false);

  // Mock user database for simple authentication
  const [mockUsers, setMockUsers] = useState<Record<string, {password: string, name: string, subscriptionExpiry?: string}>>(() => {
    const savedUsers = localStorage.getItem("mockUsers");
    if (savedUsers) {
      return JSON.parse(savedUsers);
    } else {
      // Default users with mock subscription data
      const defaultUsers = {
        "user@example.com": {
          password: "password123", 
          name: "Demo User",
          subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        },
        "test@example.com": {
          password: "test123", 
          name: "Test User"
        },
        "admin@example.com": {
          password: "admin123", 
          name: "Admin User", 
          subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
        },
      };
      localStorage.setItem("mockUsers", JSON.stringify(defaultUsers));
      return defaultUsers;
    }
  });

  // Get user subscription details
  const getUserSubscriptionDetails = () => {
    const plan = userSettings.subscriptionPlan || 'free';
    const limits = getDocumentLimits(plan);
    
    // Get expiry date from mock user database
    let expiryDate = '';
    if (email && mockUsers[email] && mockUsers[email].subscriptionExpiry) {
      expiryDate = new Date(mockUsers[email].subscriptionExpiry).toLocaleDateString();
    } else if (plan !== 'free') {
      // Default expiry for premium users is 30 days from now
      expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();
    }
    
    return {
      plan,
      expiresOn: expiryDate,
      documentLimit: limits.documentLimit,
      documentSizeLimit: limits.documentSizeLimit
    };
  };

  // Connect Google account
  const connectGoogle = () => {
    setIsGoogleConnected(true);
    
    const updatedSettings = {
      ...userSettings,
      googleConnected: true
    };
    
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
    setUserSettings(updatedSettings);
    
    toast({
      title: "Google account connected",
      description: "You can now use Google services with your account"
    });
  };
  
  // Disconnect Google account
  const disconnectGoogle = () => {
    setIsGoogleConnected(false);
    
    const updatedSettings = {
      ...userSettings,
      googleConnected: false
    };
    
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
    setUserSettings(updatedSettings);
    
    toast({
      title: "Google account disconnected",
      description: "Your Google account has been disconnected"
    });
  };

  // Generate encryption key for secure backup
  const generateEncryptionKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let key = '';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };
  
  // Enable two-factor authentication
  const enableTwoFactor = () => {
    // In a real app, this would integrate with an authenticator app
    const updatedSettings = {
      ...userSettings,
      twoFactorEnabled: true
    };
    
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
    setUserSettings(updatedSettings);
    
    toast({
      title: "Two-factor authentication enabled",
      description: "Your account is now more secure"
    });
  };
  
  // Disable two-factor authentication
  const disableTwoFactor = () => {
    const updatedSettings = {
      ...userSettings,
      twoFactorEnabled: false
    };
    
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
    setUserSettings(updatedSettings);
    
    toast({
      title: "Two-factor authentication disabled",
      description: "Two-factor authentication has been turned off"
    });
  };
  
  // Create backup encryption key
  const createBackupKey = () => {
    const key = generateEncryptionKey();
    const currentDate = new Date().toISOString();
    
    const updatedSettings = {
      ...userSettings,
      backupKeyCreated: true,
      lastKeyBackup: currentDate,
      backupKeyLocation: "secure_storage"
    };
    
    // In a real app, we would encrypt user data with this key
    localStorage.setItem("encryptionBackupKey", key);
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
    setUserSettings(updatedSettings);
    
    toast({
      title: "Encryption key backup created",
      description: "Your encryption key has been securely backed up"
    });
  };
  
  // Restore from backup key
  const restoreFromBackupKey = (key: string) => {
    // In a real app, we would validate the key against the stored key
    const storedKey = localStorage.getItem("encryptionBackupKey");
    
    if (key === storedKey) {
      toast({
        title: "Restoration successful",
        description: "Your data has been restored using the backup key"
      });
      return true;
    } else {
      toast({
        title: "Restoration failed",
        description: "The backup key is invalid",
        variant: "destructive"
      });
      return false;
    }
  };

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
      [userEmail]: {
        password, 
        name,
        subscriptionExpiry: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14-day trial
      }
    };
    
    setMockUsers(updatedUsers);
    localStorage.setItem("mockUsers", JSON.stringify(updatedUsers));
    
    // Log in the user after registration
    setIsLoggedIn(true);
    setEmail(userEmail);
    setDisplayName(name);
    
    const updatedSettings: UserSettings = {
      email: userEmail,
      displayName: name,
      isLoggedIn: true,
      lastLogin: new Date().toISOString(),
      subscriptionPlan: 'free',
      emailNotifications: true,
      pushNotifications: false,
      voiceReminders: false,
      reminderDays: 3,
      theme: "system",
      voiceType: "default",
      twoFactorEnabled: false,
      backupKeyCreated: false,
      autoBackup: false,
      backupFrequency: "weekly",
      cloudExportProviders: [],
      googleConnected: false,
      mobileDeviceName: "",
      ...getDocumentLimits("free")
    };
    
    // Save to localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
    setUserSettings(updatedSettings);
    
    toast({
      title: "Account created successfully",
      description: `Welcome, ${name}! You have a 14-day free trial of premium features.`
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
    
    // Determine subscription plan
    let plan = userSettings.subscriptionPlan || "free" as 'free';
    
    // If this is Google sign-in user, assign premium by default for demo
    if (userEmail === "demo@example.com") {
      plan = "premium" as 'premium';
      setIsGoogleConnected(true);
    }
    
    const updatedSettings: UserSettings = {
      ...userSettings,
      email: userEmail,
      displayName: userName,
      isLoggedIn: true,
      lastLogin: new Date().toISOString(),
      subscriptionPlan: plan,
      autoBackup: userSettings.autoBackup || false,
      backupFrequency: userSettings.backupFrequency || "weekly",
      cloudExportProviders: userSettings.cloudExportProviders || [],
      googleConnected: userEmail === "demo@example.com" || false,
      mobileDeviceName: userSettings.mobileDeviceName || "",
      ...getDocumentLimits(plan)
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
    
    const updatedSettings: UserSettings = {
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
    
    const updatedSettings: UserSettings = {
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
    // If subscription plan changes, update document limits accordingly
    let updatedLimits = {};
    if (settings.subscriptionPlan && settings.subscriptionPlan !== userSettings.subscriptionPlan) {
      updatedLimits = getDocumentLimits(settings.subscriptionPlan);
      
      // Update subscription expiry in mock users database
      if (email && mockUsers[email]) {
        const expiryDate = new Date();
        switch (settings.subscriptionPlan) {
          case 'basic':
            expiryDate.setDate(expiryDate.getDate() + 30); // 30 days
            break;
          case 'premium':
            expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month
            break;
          case 'enterprise':
            expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year
            break;
        }
        
        const updatedUsers = {
          ...mockUsers,
          [email]: {
            ...mockUsers[email],
            subscriptionExpiry: expiryDate.toISOString()
          }
        };
        
        setMockUsers(updatedUsers);
        localStorage.setItem("mockUsers", JSON.stringify(updatedUsers));
      }
    }
    
    const updatedSettings: UserSettings = {
      ...userSettings,
      ...settings,
      ...updatedLimits
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
    
    // Update Google connection status if it was changed
    if (settings.googleConnected !== undefined) {
      setIsGoogleConnected(settings.googleConnected);
    }
    
    console.log("Updated settings:", updatedSettings);
    
    toast({
      title: "Settings updated",
      description: "Your user settings have been saved successfully",
      variant: "default",
    });
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
          setIsGoogleConnected(settings.googleConnected || false);
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
        enableTwoFactor,
        disableTwoFactor,
        createBackupKey,
        restoreFromBackupKey,
        isGoogleConnected,
        connectGoogle,
        disconnectGoogle,
        getUserSubscriptionDetails
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
