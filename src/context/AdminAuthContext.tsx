import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { AdminSession } from "../types";

interface AdminAuthContextValue {
  admin: AdminSession | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);
const STORAGE_KEY = "admin_session";

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "password";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminSession | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* ignore */
      }
    }
    return null;
  });

  const login = useCallback((email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const session: AdminSession = {
        name: "Admin CMS",
        email,
        role: "admin",
      };
      setAdmin(session);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setAdmin(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ admin, login, logout }),
    [admin, login, logout]
  );

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
