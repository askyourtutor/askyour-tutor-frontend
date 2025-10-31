import type { ApiCourse } from '../types/course.types';
import { apiFetch } from '../../../shared/services/api';
import type { CourseSummary, CategorySummary } from '../../../shared/types';

interface GetCoursesParams {
  category?: string;
  priceType?: 'all' | 'free' | 'paid';
  level?: 'all' | 'beginner' | 'intermediate' | 'advanced';
  rating?: number;
  search?: string;
  sortBy?: 'popular' | 'newest' | 'rating' | 'price-low' | 'price-high';
  page?: number;
  limit?: number;
}

interface CoursesResponse {
  data: CourseSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Fetch all courses with filters
export async function getCourses(params: GetCoursesParams = {}): Promise<CoursesResponse> {
  const queryParams = new URLSearchParams();
  
  if (params.category && params.category !== 'all') queryParams.set('category', params.category);
  if (params.priceType && params.priceType !== 'all') queryParams.set('priceType', params.priceType);
  if (params.rating && params.rating > 0) queryParams.set('rating', params.rating.toString());
  if (params.search) queryParams.set('search', params.search);
  if (params.sortBy) queryParams.set('sortBy', params.sortBy);
  if (params.page) queryParams.set('page', params.page.toString());
  if (params.limit) queryParams.set('limit', params.limit.toString());

  const query = queryParams.toString();
  const endpoint = query ? `/courses?${query}` : '/courses';
  
  return apiFetch<CoursesResponse>(endpoint, { method: 'GET' });
}

// Fetch all categories
export async function getCategories(): Promise<CategorySummary[]> {
  return apiFetch<CategorySummary[]>('/courses/categories', { method: 'GET' });
}

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
