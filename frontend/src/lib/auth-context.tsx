"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, setToken, clearToken, setUser, getUser, isAuthenticated, getToken } from "./api";

interface AuthContextType {
  isLoggedIn: boolean;
  user: { email: string; full_name?: string } | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<{ email: string; full_name?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      setUserState(getUser());
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login(email, password);
    setToken(result.access_token);
    const userData = { email, full_name: undefined };
    setUser(userData);
    setUserState(userData);
  }, []);

  const register = useCallback(async (email: string, password: string, fullName?: string) => {
    await authApi.register({ email, password, full_name: fullName });
    // Auto-login after registration
    const result = await authApi.login(email, password);
    setToken(result.access_token);
    const userData = { email, full_name: fullName };
    setUser(userData);
    setUserState(userData);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUserState(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user,
        user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}