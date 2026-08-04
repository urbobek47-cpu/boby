"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "customer" | "artist";
export type AuthMode = "login" | "signup";

export interface User {
  name: string;
  email: string;
  role: UserRole;
  studioName?: string;
  discipline?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthModalOpen: boolean;
  activeRole: UserRole | null;
  activeMode: AuthMode;
  openAuthModal: (role?: UserRole | null, mode?: AuthMode) => void;
  closeAuthModal: () => void;
  setActiveRole: (role: UserRole | null) => void;
  setActiveMode: (mode: AuthMode) => void;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "boby_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [activeMode, setActiveMode] = useState<AuthMode>("login");

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const openAuthModal = (role: UserRole | null = null, mode: AuthMode = "login") => {
    setActiveRole(role);
    setActiveMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (userData: User) => {
    setUser(userData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch {
      // Ignore storage errors
    }
    closeAuthModal();
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        activeRole,
        activeMode,
        openAuthModal,
        closeAuthModal,
        setActiveRole,
        setActiveMode,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
