import { apiFetch } from '../../../shared/services/api';
import type { CourseSummary, PaginatedResponse } from '../../../shared/types';

// Course Service - Handles all course-related API calls
export class CourseService {

  // Get all courses with pagination  
  async getCourses(params?: {
    page?: number;
    limit?: number;
    category?: string;
    level?: string;
    isFree?: boolean;
    search?: string;
  }) {
    try {
      const qs = new URLSearchParams();
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      if (params?.category) qs.set('category', params.category);
      if (params?.level) qs.set('level', params.level);
      if (params?.isFree !== undefined) qs.set('isFree', String(params.isFree));
      if (params?.search) qs.set('search', params.search);

      return await apiFetch<PaginatedResponse<CourseSummary>>(`/courses${qs.toString() ? `?${qs.toString()}` : ''}`);
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new Error('Failed to fetch courses');
    }
  }

  // Get course by ID
  async getCourseById(id: string) {
    try {
      return await apiFetch<{ data: unknown }>(`/courses/${id}`);
    } catch (error) {
      console.error('Error fetching course:', error);
      throw new Error('Failed to fetch course');
    }
  }

  // Get courses by category
  async getCoursesByCategory(categoryId: string) {
    try {
      return await apiFetch<{ data: CourseSummary[] }>(`/courses/category/${categoryId}`);
    } catch (error) {
      console.error('Error fetching courses by category:', error);
      throw new Error('Failed to fetch courses by category');
    }
  }

  // Get featured courses
  async getFeaturedCourses() {
    try {
      return await apiFetch<{ data: CourseSummary[] }>(`/courses/featured`);
    } catch (error) {
      console.error('Error fetching featured courses:', error);
      throw new Error('Failed to fetch featured courses');
    }
  }

  // Get free courses
  async getFreeCourses() {
    try {
      return await apiFetch<{ data: CourseSummary[] }>(`/courses/free`);
    } catch (error) {
      console.error('Error fetching free courses:', error);
      throw new Error('Failed to fetch free courses');
    }
  }

  // Get courses by instructor
  async getCoursesByInstructor(instructorId: string) {
    try {
      return await apiFetch<{ data: CourseSummary[] }>(`/courses/instructor/${instructorId}`);
    } catch (error) {
      console.error('Error fetching courses by instructor:', error);
      throw new Error('Failed to fetch courses by instructor');
    }
  }

  // Search courses
  async searchCourses(query: string) {
    try {
      const qs = new URLSearchParams({ q: query });
      return await apiFetch<{ data: CourseSummary[] }>(`/courses/search?${qs.toString()}`);
    } catch (error) {
      console.error('Error searching courses:', error);
      throw new Error('Failed to search courses');
    }
  }

  // Enroll in course
  async enrollInCourse(courseId: string) {
    try {
      return await apiFetch<{ success: boolean; message: string }>(`/courses/${courseId}/enroll`, { method: 'POST' });
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw new Error('Failed to enroll in course');
    }
  }
}

export const courseService = new CourseService();
