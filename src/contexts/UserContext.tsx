
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  displayName: string;
  email: string;
  userId: string;
  photoURL?: string;
}

interface UserContextType {
  isLoggedIn: boolean;
  isInitialized: boolean;
  displayName: string | null;
  email: string | null;
  userId: string | null;
  photoURL: string | null;
  userSettings: UserSettings | null;
  login: (user: User) => void;
  logout: () => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  // Additional methods needed by the app
  register?: (email: string, password: string, name: string) => void;
  updateProfile?: (data: any) => void;
  enableTwoFactor?: () => Promise<boolean>;
  disableTwoFactor?: () => Promise<boolean>;
  createBackupKey?: () => Promise<string>;
  restoreFromBackupKey?: (key: string) => Promise<boolean>;
}

const UserContext = createContext<UserContextType>({
  isLoggedIn: false,
  isInitialized: false,
  displayName: null,
  email: null,
  userId: null,
  photoURL: null,
  userSettings: null,
  login: () => {},
  logout: () => {},
  updateUserSettings: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedSettings = localStorage.getItem("userSettings");
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setDisplayName(user.displayName);
      setEmail(user.email);
      setUserId(user.userId);
      setPhotoURL(user.photoURL || null);
    }
    
    if (storedSettings) {
      setUserSettings(JSON.parse(storedSettings));
    } else {
      // Default settings
      setUserSettings({
        theme: "system",
        emailNotifications: true,
        pushNotifications: false,
        voiceReminders: false,
        reminderDays: 7,
        twoFactorEnabled: false,
        autoBackup: true,
        backupFrequency: "weekly",
        sharePreferences: {
          defaultExpiry: 7,
          requirePassword: true,
        },
        biometricAuth: {
          enabled: false,
          faceIdEnabled: false,
          fingerprintEnabled: false,
        },
        subscriptionPlan: "free",
        documentLimit: 10,
        documentSizeLimit: 5, // MB
        cloudExportProviders: [],
        backupKeyCreated: false
      });
    }
    
    // Mark as initialized after checking storage
    setIsInitialized(true);
  }, []);

  const login = (user: User) => {
    setIsLoggedIn(true);
    setDisplayName(user.displayName);
    setEmail(user.email);
    setUserId(user.userId);
    setPhotoURL(user.photoURL || null);
    
    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(user));
    
    // Initialize default settings if not already set
    if (!userSettings) {
      const defaultSettings: UserSettings = {
        theme: "system",
        emailNotifications: true,
        pushNotifications: false,
        voiceReminders: false,
        reminderDays: 7,
        twoFactorEnabled: false,
        autoBackup: true,
        backupFrequency: "weekly",
        sharePreferences: {
          defaultExpiry: 7,
          requirePassword: true,
        },
        biometricAuth: {
          enabled: false,
          faceIdEnabled: false,
          fingerprintEnabled: false,
        },
        subscriptionPlan: "free",
        documentLimit: 10,
        documentSizeLimit: 5, // MB
        cloudExportProviders: [],
        backupKeyCreated: false
      };
      setUserSettings(defaultSettings);
      localStorage.setItem("userSettings", JSON.stringify(defaultSettings));
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setDisplayName(null);
    setEmail(null);
    setUserId(null);
    setPhotoURL(null);
    
    // Clear user data from localStorage
    localStorage.removeItem("user");
    // We don't clear settings on logout to preserve user preferences
  };

  const updateUserSettings = (settings: Partial<UserSettings>) => {
    if (userSettings) {
      const updatedSettings = { ...userSettings, ...settings };
      setUserSettings(updatedSettings);
      localStorage.setItem("userSettings", JSON.stringify(updatedSettings));
    }
  };

  // Mock implementations of additional methods
  const register = (email: string, password: string, name: string) => {
    // Create a mock user
    const user: User = {
      displayName: name,
      email,
      userId: `user-${Date.now()}`,
    };
    login(user);
  };

  const updateProfile = (data: any) => {
    if (data.displayName) setDisplayName(data.displayName);
    if (data.email) setEmail(data.email);
    if (data.photoURL) setPhotoURL(data.photoURL);
    
    const updatedUser = {
      displayName: data.displayName || displayName,
      email: data.email || email,
      userId: userId || "",
      photoURL: data.photoURL || photoURL
    };
    
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const enableTwoFactor = async (): Promise<boolean> => {
    updateUserSettings({ twoFactorEnabled: true });
    return true;
  };

  const disableTwoFactor = async (): Promise<boolean> => {
    updateUserSettings({ twoFactorEnabled: false });
    return true;
  };

  const createBackupKey = async (): Promise<string> => {
    const key = `backup-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    updateUserSettings({ 
      backupKeyCreated: true,
      lastKeyBackup: new Date().toISOString()
    });
    return key;
  };

  const restoreFromBackupKey = async (key: string): Promise<boolean> => {
    // In a real app this would validate the key and restore data
    return true;
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        isInitialized,
        displayName,
        email,
        userId,
        photoURL,
        userSettings,
        login,
        logout,
        updateUserSettings,
        register,
        updateProfile,
        enableTwoFactor,
        disableTwoFactor,
        createBackupKey,
        restoreFromBackupKey,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
