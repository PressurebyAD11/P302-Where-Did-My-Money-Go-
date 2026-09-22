import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthContext } from './useAuth';

export type AuthUser = {
  name: string;
  email: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const STORAGE_KEY = 'wdmmg:auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storedUser = window.localStorage.getItem(STORAGE_KEY);

      if (!storedUser) {
        return;
      }

      const parsedUser = JSON.parse(storedUser) as Partial<AuthUser> | null;

      if (parsedUser && typeof parsedUser.name === 'string' && typeof parsedUser.email === 'string') {
        setUser({ name: parsedUser.name, email: parsedUser.email });
      }
    } catch {
      setUser(null);
    }
  }, []);

  const login = useCallback((name: string, email: string) => {
    const nextUser = { name, email };
    setUser(nextUser);

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      } catch {
        // Ignore storage failures and keep state in memory.
      }
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore storage failures and keep state in memory.
      }
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    login,
    logout,
    isAuthenticated: user !== null,
  }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
