
import React, { createContext, useContext, useState, useEffect } from "react";

interface UserContextType {
  isLoggedIn: boolean;
  displayName: string;
  email: string;
  login: (email: string, password: string) => void;
  logout: () => void;
  updateProfile: (name: string, email: string) => void;
}

const defaultContextValue: UserContextType = {
  isLoggedIn: false,
  displayName: "",
  email: "",
  login: () => {},
  logout: () => {},
  updateProfile: () => {},
};

const UserContext = createContext<UserContextType>(defaultContextValue);

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    return loginStatus !== "false"; // Default to logged in if not explicitly set to false
  });

  // Get user info from localStorage if available
  const userSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
  
  const [displayName, setDisplayName] = useState(userSettings.displayName || "John Doe");
  const [email, setEmail] = useState(userSettings.email || "john@example.com");

  // Login function
  const login = (userEmail: string, password: string) => {
    // For demo purposes we accept any credentials
    setIsLoggedIn(true);
    setEmail(userEmail);
    
    // Save to localStorage
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userSettings", JSON.stringify({
      ...userSettings,
      email: userEmail,
      isLoggedIn: true
    }));
  };

  // Logout function
  const logout = () => {
    setIsLoggedIn(false);
    
    // Update localStorage
    localStorage.setItem("isLoggedIn", "false");
    localStorage.setItem("userSettings", JSON.stringify({
      ...userSettings,
      isLoggedIn: false
    }));
  };

  // Update profile function
  const updateProfile = (name: string, userEmail: string) => {
    setDisplayName(name);
    setEmail(userEmail);
    
    // Save to localStorage
    localStorage.setItem("userSettings", JSON.stringify({
      ...userSettings,
      displayName: name,
      email: userEmail
    }));
  };

  // Listen for changes in localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "isLoggedIn") {
        setIsLoggedIn(e.newValue !== "false");
      } else if (e.key === "userSettings") {
        try {
          const settings = JSON.parse(e.newValue || "{}");
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
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
