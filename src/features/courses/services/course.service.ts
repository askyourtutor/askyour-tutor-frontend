import type { ApiCourse } from '../types/course.types';

// Simple service with mock fallback. Later, swap to real API implementation.
export async function getCourseById(courseId: string): Promise<ApiCourse | null> {
  // Mock is disabled by product requirement. Always fetch from API.

  const base = (import.meta.env.VITE_API_URL as string) || '/api';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const url = new URL(`${base.replace(/\/$/, '')}/courses/${courseId}`, origin);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: unknown = await res.json();
    // Accept common response shapes: { data: {...} } | { course: {...} } | { ...courseFields }
    const obj = (json as Record<string, unknown>) || {};
    const candidate = (obj.data as unknown) ?? (obj.course as unknown) ?? json;
    const course = isApiCourse(candidate) ? candidate : null;
    return course;
  } catch {
    // Do not use mock; surface absence
    return null;
  }
}

function isApiCourse(val: unknown): val is ApiCourse {
  if (!val || typeof val !== 'object') return false;
  const v = val as Record<string, unknown>;
  return typeof v.id === 'string' && typeof v.title === 'string';
}
