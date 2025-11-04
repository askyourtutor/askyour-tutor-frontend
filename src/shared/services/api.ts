// Lightweight fetch API client with automatic refresh handling
// - Sends credentials for cookie-based refresh
// - Retries once on 401 by calling /auth/refresh
// - Attaches Authorization header if accessToken is provided

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
import type { User } from '../contexts/AuthContext';
import { secureWarn, secureError, secureDebug } from '../utils/security';

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;
let hasRefreshToken = false; // Track if refresh token exists

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  // If we set an access token, assume we might have a refresh token
  if (token) {
    hasRefreshToken = true;
  }
};

export const setHasRefreshToken = (hasToken: boolean) => {
  hasRefreshToken = hasToken;
};

export const clearSession = () => {
  accessToken = null;
  hasRefreshToken = false;
};

// Custom error class to distinguish API errors
export class ApiError extends Error {
  public status: number;
  public endpoint: string;
  public isExpected: boolean;

  constructor(
    message: string,
    status: number,
    endpoint: string,
    isExpected: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.endpoint = endpoint;
    this.isExpected = isExpected;
  }
}

// Helper to determine if 401 error is expected
const isExpected401 = (path: string): boolean => {
  // These endpoints commonly return 401 for unauthenticated users
  const publicEndpoints = ['/auth/me', '/auth/refresh'];
  return publicEndpoints.some(endpoint => path.includes(endpoint));
};

// Helper to determine if 404 error should be handled quietly
const isExpected404 = (path: string): boolean => {
  // These endpoints might not be implemented yet or are optional
  const optionalEndpoints = ['/courses/saved/count', '/courses/saved', '/notifications'];
  return optionalEndpoints.some(endpoint => path.includes(endpoint));
};

// Enhanced logging that respects expected vs unexpected errors
const logApiError = (error: ApiError) => {
  // Check if this is an expected error that should be handled silently
  if (error.isExpected) {
    // Only log in development with debug flag
    if (import.meta.env.DEV && import.meta.env.VITE_DEBUG_AUTH === 'true') {
      if (error.status === 401) {
        secureDebug(`[Auth] Expected 401 from ${error.endpoint}`);
      } else if (error.status === 404) {
        secureDebug(`[API] Optional endpoint not found: ${error.endpoint}`);
      }
    }
    return; // Don't log expected errors
  }
  
  // Log unexpected errors based on severity
  if (error.status >= 500) {
    secureError(`[API] Server error (${error.status}):`, error.message);
  } else if (error.status === 401) {
    secureWarn(`[Auth] Unauthorized access attempt:`, error.message);
  } else if (error.status === 404) {
    secureWarn(`[API] Endpoint not found (${error.status}): ${error.endpoint}`);
  } else {
    secureError(`[API] Request failed (${error.status}):`, error.message);
  }
};

export const UsersAPI = {
  getProfile: () => apiFetch<{ user: { id: string; email: string; role: 'STUDENT'|'TUTOR'|'ADMIN'; status: string; emailVerified: boolean; createdAt: string; profile: unknown; profileCompletion?: number; profileVerify?: 'PENDING' | 'VERIFIED' } }>('/users/profile'),
};

// Use VITE_API_URL when provided; otherwise default to relative '/api' for best portability
const API_BASE: string = (import.meta.env.VITE_API_URL as string) || '/api';

export async function refreshAccessToken(): Promise<string | 'DENIED' | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: '' }),
        });
        
        if (!res.ok) {
          // Distinguish expected 401 vs other failures (network/500s)
          if (res.status === 401) {
            return 'DENIED' as const;
          }
          // Don't log expected 401s from refresh endpoint
          secureError(`[Auth] Token refresh failed (${res.status})`);
          return null;
        }
        
        const data = (await res.json()) as { accessToken: string };
        setAccessToken(data.accessToken);
        return data.accessToken;
      } catch (err) {
        // Only log unexpected network errors
        if (import.meta.env.DEV) {
          secureDebug('[Auth] Token refresh network error:', err);
        }
        return null;
      } finally {
        // Allow subsequent refreshes
        setTimeout(() => { refreshPromise = null; }, 0);
      }
    })();
  }
  return refreshPromise;
}

export async function apiFetch<T = unknown>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (accessToken) {
    (headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers,
  });

  // Only attempt refresh if we have evidence of a refresh token
  if (res.status === 401 && retry && hasRefreshToken) {
    const result = await refreshAccessToken();
    if (typeof result === 'string' && result !== 'DENIED') {
      return apiFetch<T>(path, options, false);
    } else if (result === 'DENIED') {
      // Refresh failed, clear the flag
      hasRefreshToken = false;
      // Fall through to error handling; caller may clear session
    } else {
      // Network or unexpected error; keep flag to retry later
    }
  }

  if (!res.ok) {
    let message = 'Request failed';
    try {
      const err = await res.json() as { message?: string };
      message = err?.message || message;
    } catch {
      /* ignore json parse error */
    }
    
    // Create enhanced error with context
    const isExpected = (res.status === 401 && isExpected401(path)) || 
                      (res.status === 404 && isExpected404(path));
    const apiError = new ApiError(message, res.status, path, isExpected);
    
    // Log error appropriately
    logApiError(apiError);
    
    throw apiError;
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const AuthAPI = {
  register: (payload: { email: string; password: string; role: 'STUDENT' | 'TUTOR'; firstName: string; lastName: string; acceptTerms: boolean; }) =>
    apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: { email: string; password: string; rememberMe?: boolean }) =>
    apiFetch<{ accessToken: string; user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => apiFetch<{ user: User | null }>('/auth/me'),
  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
  resendVerification: (payload: { email: string }) => apiFetch('/auth/resend-verification', { method: 'POST', body: JSON.stringify(payload) }),
  verifyEmail: (token: string) => apiFetch<{ accessToken: string; user: User; message: string }>('/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) }),
  verifyEmailCode: (email: string, code: string) => apiFetch<{ accessToken: string; user: User; message: string }>('/auth/verify-email-code', { method: 'POST', body: JSON.stringify({ email, code }) }),
  forgotPassword: (email: string) => apiFetch<{ message: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token: string, password: string) => apiFetch<{ message: string }>('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),
};
