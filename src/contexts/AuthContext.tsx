
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "@/hooks/use-toast";

interface User {
  id?: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (email: string, password: string, displayName: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useUserAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    // This is a mock implementation
    // In a real app, this would call an authentication API
    if (email && password) {
      setUser({
        id: 'user-' + Date.now(),
        email,
        displayName: email.split('@')[0],
      });
      toast({
        title: "Signed in",
        description: `Successfully signed in as ${email}`,
      });
    }
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Signed out",
      description: "You've been signed out successfully",
    });
  };

  const register = (email: string, password: string, displayName: string) => {
    // Mock implementation
    if (email && password) {
      setUser({
        id: 'user-' + Date.now(),
        email,
        displayName,
      });
      toast({
        title: "Account created",
        description: `Account created successfully for ${email}`,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
