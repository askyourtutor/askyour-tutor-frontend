// Lightweight fetch API client with automatic refresh handling
// - Sends credentials for cookie-based refresh
// - Retries once on 401 by calling /auth/refresh
// - Attaches Authorization header if accessToken is provided

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
import type { User } from '../contexts/AuthContext';

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const UsersAPI = {
  getProfile: () => apiFetch<{ user: { id: string; email: string; role: 'STUDENT'|'TUTOR'|'ADMIN'; status: string; emailVerified: boolean; createdAt: string; profile: unknown; profileCompletion?: number; profileVerify?: 'PENDING' | 'VERIFIED' } }>('/users/profile'),
};

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: '' }),
        });
        if (!res.ok) return null;
        const data = (await res.json()) as { accessToken: string };
        setAccessToken(data.accessToken);
        return data.accessToken;
      } catch {
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

  if (res.status === 401 && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return apiFetch<T>(path, options, false);
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
    throw new Error(message);
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
