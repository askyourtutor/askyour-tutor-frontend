import { apiFetch, ApiError } from './api';

// Cache for storing API results to avoid repeated failed requests
const cache = new Map<string, { data: unknown; timestamp: number; failed: boolean }>();
const CACHE_DURATION = 60000; // 1 minute
const FAILED_CACHE_DURATION = 300000; // 5 minutes for failed requests

// Service for handling saved courses functionality
export class SavedCoursesService {
  
  // Get count of saved courses for current user
  async getSavedCoursesCount(): Promise<number> {
    const cacheKey = 'saved-courses-count';
    const cached = cache.get(cacheKey);
    
    // If we recently failed to get this data, don't retry immediately
    if (cached?.failed && Date.now() - cached.timestamp < FAILED_CACHE_DURATION) {
      return 0;
    }
    
    // If we have recent successful data, use it
    if (cached && !cached.failed && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data as number;
    }
    
    try {
      const res = await apiFetch<{ count: number }>('/courses/saved/count');
      const count = res?.count ?? 0;
      
      // Cache successful result
      cache.set(cacheKey, { data: count, timestamp: Date.now(), failed: false });
      return count;
    } catch (error: unknown) {
      // Cache failure to prevent repeated requests
      cache.set(cacheKey, { data: 0, timestamp: Date.now(), failed: true });
      
      // Handle missing endpoint gracefully
      if (error instanceof ApiError && error.status === 404) {
        // Feature not yet implemented, return 0
        return 0;
      }
      throw error;
    }
  }

  // Get saved courses for current user
  async getSavedCourses(): Promise<unknown[]> {
    const cacheKey = 'saved-courses';
    const cached = cache.get(cacheKey);
    
    // If we recently failed to get this data, don't retry immediately
    if (cached?.failed && Date.now() - cached.timestamp < FAILED_CACHE_DURATION) {
      return [];
    }
    
    // If we have recent successful data, use it
    if (cached && !cached.failed && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data as unknown[];
    }
    
    try {
      const res = await apiFetch<{ data: unknown[] }>('/courses/saved');
      const courses = res?.data ?? [];
      
      // Cache successful result
      cache.set(cacheKey, { data: courses, timestamp: Date.now(), failed: false });
      return courses;
    } catch (error: unknown) {
      // Cache failure to prevent repeated requests
      cache.set(cacheKey, { data: [], timestamp: Date.now(), failed: true });
      
      if (error instanceof ApiError && error.status === 404) {
        // Feature not yet implemented, return empty array
        return [];
      }
      throw error;
    }
  }

  // Save a course for current user
  async saveCourse(courseId: string): Promise<boolean> {
    try {
      await apiFetch(`/courses/${courseId}/save`, { method: 'POST' });
      // Invalidate cache on successful save
      cache.delete('saved-courses-count');
      cache.delete('saved-courses');
      return true;
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 404) {
        // Feature not yet implemented
        console.warn('Save course feature not yet available');
        return false;
      }
      throw error;
    }
  }

  // Unsave a course for current user
  async unsaveCourse(courseId: string): Promise<boolean> {
    try {
      await apiFetch(`/courses/${courseId}/save`, { method: 'DELETE' });
      // Invalidate cache on successful unsave
      cache.delete('saved-courses-count');
      cache.delete('saved-courses');
      return true;
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 404) {
        // Feature not yet implemented
        console.warn('Unsave course feature not yet available');
        return false;
      }
      throw error;
    }
  }

  // Clear cache (useful for testing or forced refresh)
  clearCache(): void {
    cache.clear();
  }
}

export const savedCoursesService = new SavedCoursesService();