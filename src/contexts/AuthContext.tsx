import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { AuthAPI, apiFetch, setAccessToken } from '../services/api';

type StudentProfile = {
  firstName?: string;
  lastName?: string;
};

type TutorProfile = {
  firstName?: string;
  lastName?: string;
  qualifications?: string; // JSON string per schema
  subjectSpecializations?: string; // JSON string per schema
  teachingExperience?: number;
  hourlyRate?: number;
};

export type User = {
  id: string;
  email: string;
  role: 'STUDENT' | 'TUTOR' | 'ADMIN';
  status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  emailVerified: boolean;
  createdAt?: string;
  lastLogin?: string;
  studentProfile?: StudentProfile | null;
  tutorProfile?: TutorProfile | null;
};

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (payload: { email: string; password: string; firstName: string; lastName: string; role: 'STUDENT' | 'TUTOR'; acceptTerms: boolean; }) => Promise<void>;
  logout: () => Promise<void>;
  setSession: (accessToken: string, user: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Hydrate last-known user: prefer localStorage (remember me), fallback to sessionStorage
  const [user, setUser] = useState<User | null>(() => {
    try {
      const rawLocal = localStorage.getItem('auth_user');
      if (rawLocal) return JSON.parse(rawLocal) as User;
      const rawSession = sessionStorage.getItem('auth_user');
      return rawSession ? (JSON.parse(rawSession) as User) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Persist helper: choose storage target
  const persistUser = (u: User | null, opts?: { preferLocal?: boolean | 'keep' }) => {
    setUser(u);
    try {
      const prefer = opts?.preferLocal ?? 'keep';
      if (!u) {
        localStorage.removeItem('auth_user');
        sessionStorage.removeItem('auth_user');
        return;
      }
      if (prefer === true) {
        localStorage.setItem('auth_user', JSON.stringify(u));
        sessionStorage.removeItem('auth_user');
      } else if (prefer === false) {
        sessionStorage.setItem('auth_user', JSON.stringify(u));
        localStorage.removeItem('auth_user');
      } else {
        // keep: write back to whichever storage currently holds the user
        if (localStorage.getItem('auth_user')) {
          localStorage.setItem('auth_user', JSON.stringify(u));
        } else {
          sessionStorage.setItem('auth_user', JSON.stringify(u));
        }
      }
    } catch {
      /* ignore storage errors */
    }
  };

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    // Initialize session: refresh (cookie) -> me
    (async () => {
      try {
        // Try refresh silently; ignore errors (user might be logged out)
        try {
          const r = await apiFetch<{ accessToken: string }>(
            '/auth/refresh',
            { method: 'POST', body: JSON.stringify({ refreshToken: '' }), signal: controller.signal },
            false,
          );
          if (r?.accessToken) setAccessToken(r.accessToken);
        } catch {
          /* ignore refresh failures; user may be logged out */
        }

        if (cancelled) return;
        const me = await AuthAPI.me();
        if (cancelled) return;
        // Keep existing storage (local vs session) to respect previous remember-me selection
        persistUser(me.user ?? null, { preferLocal: 'keep' });
      } catch {
        if (!cancelled) persistUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    const { accessToken, user } = await AuthAPI.login({ email, password, rememberMe });
    setAccessToken(accessToken);
    // Persist to localStorage when rememberMe=true; sessionStorage otherwise
    persistUser(user, { preferLocal: !!rememberMe });
  }, []);

  const register = useCallback(async (payload: { email: string; password: string; firstName: string; lastName: string; role: 'STUDENT' | 'TUTOR'; acceptTerms: boolean; }) => {
    await AuthAPI.register(payload);
    // User must verify email before login
  }, []);

  const logout = useCallback(async () => {
    try {
      await AuthAPI.logout();
    } finally {
      setAccessToken(null);
      persistUser(null);
    }
  }, []);

  const setSession = useCallback((token: string, u: User) => {
    setAccessToken(token);
    // Default: sessionStorage (no remember-me toggle here)
    persistUser(u, { preferLocal: false });
  }, []);

  const value = useMemo(() => ({ user, loading, login, register, logout, setSession }), [user, loading, login, register, logout, setSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
