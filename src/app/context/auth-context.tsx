import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User, LoginRequest, SignupRequest } from "../../types/auth";
import { authApi } from "../../api/auth";
import { getStoredToken, setStoredToken } from "../../api/client";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    authApi.logout();
    setToken(null);
    setUser(null);
  }, []);

  // Restore session on mount via /api/auth/me
  useEffect(() => {
    const existingToken = getStoredToken();
    if (!existingToken) {
      setIsLoading(false);
      return;
    }

    authApi
      .me()
      .then((userData) => {
        setUser(userData);
        setToken(existingToken);
      })
      .catch(() => {
        // Token invalid or expired
        logout();
      })
      .finally(() => {
        setIsLoading(false);
      });

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [logout]);

  const login = async (credentials: LoginRequest) => {
    const res = await authApi.login(credentials);
    setToken(res.token);
    setUser(res.user);
  };

  const signup = async (data: SignupRequest) => {
    const res = await authApi.signup(data);
    setToken(res.token);
    setUser(res.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
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
