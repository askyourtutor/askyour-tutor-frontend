import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { AuthAPI, setAccessToken, setHasRefreshToken, clearSession, ApiError, refreshAccessToken } from '../services/api';
import { secureDebug } from '../utils/security';

export type StudentProfile = {
  firstName?: string;
  lastName?: string;
  university?: string;
  courseOfStudy?: string;
  yearOfStudy?: number;
  learningGoals?: string;
};

export type TutorProfile = {
  firstName?: string;
  lastName?: string;
  professionalTitle?: string;
  university?: string;
  qualifications?: string; // JSON string per schema
  subjectSpecializations?: string; // JSON string per schema
  teachingExperience?: number;
  hourlyRate?: number;
  bio?: string;
  status?: string;
};

export type User = {
  id: string;
  email: string;
  role: 'STUDENT' | 'TUTOR' | 'ADMIN';
  status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  emailVerified: boolean;
  createdAt?: string;
  lastLogin?: string;
  profileCompletion?: number;
  profileVerify?: 'PENDING' | 'VERIFIED';
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
    
    // Check if there's evidence of a previous session
    const hadPreviousSession = !!(
      localStorage.getItem('auth_user') || 
      sessionStorage.getItem('auth_user')
    );
    
    // Set refresh token flag based on previous session
    setHasRefreshToken(hadPreviousSession);
    
    // Initialize session: only attempt refresh if there was a previous session
    (async () => {
      try {
        // Only try refresh if user had a previous session
        if (hadPreviousSession) {
          try {
            const result = await refreshAccessToken();
            if (result === 'DENIED') {
              if (!cancelled) {
                clearSession();
                persistUser(null);
              }
            } else if (typeof result === 'string' && result) {
              setAccessToken(result);
              setHasRefreshToken(true);
              if (!cancelled) {
                try {
                  const me = await AuthAPI.me();
                  if (!cancelled) {
                    persistUser(me.user ?? null, { preferLocal: 'keep' });
                  }
                } catch (error) {
                  if (!cancelled) {
                    // Do NOT clear session if /me fails; keep access token and try later
                    if (import.meta.env.DEV) {
                      secureDebug('[Auth] /me failed after refresh (non-fatal):', error);
                    }
                  }
                }
              }
            }
          } catch (error) {
            // Refresh failed - do NOT clear session here; try again on next API call
            if (!cancelled) {
              if (error instanceof ApiError && !error.isExpected && import.meta.env.DEV) {
                secureDebug('[Auth] Refresh failed unexpectedly (non-fatal at boot):', error);
              }
            }
          }
        } else {
          // No previous session, skip API calls
          if (!cancelled) {
            clearSession();
            persistUser(null);
          }
        }
      } catch (error) {
        if (!cancelled) {
          clearSession();
          persistUser(null);
          if (import.meta.env.DEV) {
            secureDebug('[Auth] Initialization failed:', error);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  // Listen for global auth logout events (e.g., 401 after refresh denial)
  useEffect(() => {
    const handler = () => {
      clearSession();
      persistUser(null);
    };
    window.addEventListener('auth:logout', handler as EventListener);
    return () => window.removeEventListener('auth:logout', handler as EventListener);
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    const { accessToken, user } = await AuthAPI.login({ email, password, rememberMe });
    setAccessToken(accessToken);
    setHasRefreshToken(true); // Mark that we now have a refresh token
    // Persist to localStorage when rememberMe=true; sessionStorage otherwise
    persistUser(user, { preferLocal: !!rememberMe });
  }, []);

  const register = useCallback(async (payload: { email: string; password: string; firstName: string; lastName: string; role: 'STUDENT' | 'TUTOR'; acceptTerms: boolean; }) => {
    try {
      await AuthAPI.register(payload);
    } catch (e) {
      const msg = (e as Error)?.message ?? '';
      if (msg.toLowerCase().includes('already exists')) {
        throw new Error('An account with this email already exists. Please log in instead.');
      }
      throw e;
    }
    // Auto-login after register; server may allow immediate session
    try {
      const { accessToken, user } = await AuthAPI.login({ email: payload.email, password: payload.password, rememberMe: false });
      setAccessToken(accessToken);
      setHasRefreshToken(true); // Mark that we now have a refresh token
      persistUser(user, { preferLocal: false });
    } catch {
      // If login not allowed immediately (e.g., requires email verification), silently ignore
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AuthAPI.logout();
    } finally {
      clearSession(); // Clear both access token and refresh token flag
      persistUser(null);
    }
  }, []);

  const setSession = useCallback((token: string, u: User) => {
    setAccessToken(token);
    setHasRefreshToken(true); // Mark that we now have a refresh token
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
