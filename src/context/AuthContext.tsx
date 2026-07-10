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
      
      const path = window.location.pathname;
      // /checkout/success is a public post-payment landing; /checkout handles its own auth gate.
      const isProtectedRoute =
        path.startsWith('/profile') ||
        path.startsWith('/admin') ||
        path.startsWith('/book') ||
        (path.startsWith('/checkout') && !path.startsWith('/checkout/success'));

      if (res.status === 401) {
        setAuth(null, null);
        if (isProtectedRoute) {
          router.push("/auth?error=expired");
        }
        return;
      }

      const data = await res.json();
      if (data.accessToken) {
        setAuth(data.user, data.accessToken);
      } else {
        setAuth(null, null);
        if (isProtectedRoute) {
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

    // The access token cookie expires after 15 minutes (ACCESS_TOKEN_EXPIRES),
    // but nothing else here ever re-checks it — so the header/nav can sit
    // showing a logged-in user for an already-dead session until the next
    // protected-route navigation gets bounced by the server. Refresh
    // proactively so the client stays in sync with the actual session.
    const interval = setInterval(refresh, 10 * 60 * 1000);
    return () => clearInterval(interval);
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
