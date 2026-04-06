"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  setAuth: (user: User | null, token: string | null) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const setAuth = (u: User | null, t: string | null) => {
    setUser(u);
    setAccessToken(t);
  };

  const refresh = async () => {
    try {
      const res = await fetch("/api/auth/refresh", { method: "POST" });
      
      if (res.status === 401) {
        setAuth(null, null);
        router.push("/auth?error=expired");
        return;
      }

      const data = await res.json();
      if (data.accessToken) {
        setAuth(data.user, data.accessToken);
      } else {
        setAuth(null, null);
        if (window.location.pathname.startsWith('/profile') || window.location.pathname.startsWith('/admin')) {
          router.push("/auth");
        }
      }
    } catch (error) {
      setAuth(null, null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuth(null, null);
    router.push("/auth");
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, setAuth, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
