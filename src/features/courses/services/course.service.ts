import type { ApiCourse } from '../types/course.types';
import { apiFetch } from '../../../shared/services/api';

// Fetch a course by id (public)
export async function getCourseById(courseId: string): Promise<ApiCourse | null> {
  const base = (import.meta.env.VITE_API_URL as string) || '/api';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const url = new URL(`${base.replace(/\/$/, '')}/courses/${courseId}`, origin);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: unknown = await res.json();
    const obj = (json as Record<string, unknown>) || {};
    const candidate = (obj.data as unknown) ?? (obj.course as unknown) ?? json;
    return isApiCourse(candidate) ? (candidate as ApiCourse) : null;
  } catch {
    return null;
  }
}

// Check enrollment (auth required)
export async function checkEnrollment(courseId: string): Promise<{ enrolled: boolean; enrollment?: unknown | null }> {
  return apiFetch<{ enrolled: boolean; enrollment?: unknown | null }>(`/courses/${courseId}/enrollment`, { method: 'GET' });
}

// Enroll (auth required, idempotent)
export async function enrollInCourse(courseId: string): Promise<{ enrolled: boolean; sessionId: string }> {
  return apiFetch<{ enrolled: boolean; sessionId: string }>(`/courses/${courseId}/enroll`, { method: 'POST' });
}

// Saved courses (auth required)
export async function getSavedStatus(courseId: string): Promise<{ saved: boolean }> {
  return apiFetch<{ saved: boolean }>(`/courses/${courseId}/saved`, { method: 'GET' });
}

export async function saveCourse(courseId: string): Promise<{ saved: true }> {
  return apiFetch<{ saved: true }>(`/courses/${courseId}/save`, { method: 'POST' });
}

export async function unsaveCourse(courseId: string): Promise<{ saved: false }> {
  return apiFetch<{ saved: false }>(`/courses/${courseId}/save`, { method: 'DELETE' });
}

function isApiCourse(val: unknown): val is ApiCourse {
  if (!val || typeof val !== 'object') return false;
  const v = val as Record<string, unknown>;
  return typeof v.id === 'string' && typeof v.title === 'string';
}
