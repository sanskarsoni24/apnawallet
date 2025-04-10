
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
        }
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
        }
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
