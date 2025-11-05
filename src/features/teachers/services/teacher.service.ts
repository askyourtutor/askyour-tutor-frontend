import { apiFetch } from '../../../shared/services/api';
import { fetchWithCache } from '../../../shared/lib/cache';
import type { TutorSummary, TutorsResponse, TutorCourse, TutorReview, TutorSession } from '../../../shared/types/teacher';

interface GetTutorsParams {
  subject?: string;
  priceRange?: string;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const teacherService = {
  async getTutors(params: GetTutorsParams = {}): Promise<TutorsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.subject) queryParams.append('subject', params.subject);
    if (params.priceRange) queryParams.append('priceRange', params.priceRange);
    if (params.search) queryParams.append('search', params.search);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    const endpoint = query ? `/tutors?${query}` : '/tutors';
    const response = await apiFetch<TutorsResponse>(endpoint);
    return response;
  },

  async getTutorById(id: string): Promise<TutorSummary> {
    const response = await fetchWithCache(
      `tutor:details:${id}`,
      () => apiFetch<{ data: TutorSummary }>(`/tutors/${id}`)
    );
    return response.data;
  },

  async getSubjects(): Promise<string[]> {
    const response = await apiFetch<{ success: boolean; data: string[] }>('/tutors/subjects');
    return response.data;
  },

  async getTutorCourses(tutorId: string): Promise<TutorCourse[]> {
    const response = await fetchWithCache(
      `tutor:courses:${tutorId}`,
      () => apiFetch<{ success: boolean; data: TutorCourse[] }>(`/tutors/${tutorId}/courses`)
    );
    return response.data;
  },

  async getTutorReviews(tutorId: string): Promise<TutorReview[]> {
    const response = await fetchWithCache(
      `tutor:reviews:${tutorId}`,
      () => apiFetch<{ success: boolean; data: TutorReview[] }>(`/tutors/${tutorId}/reviews`)
    );
    return response.data;
  },

  async getTutorSessions(tutorId: string, status?: string): Promise<TutorSession[]> {
    const query = status ? `?status=${status}` : '';
    const response = await apiFetch<{ success: boolean; data: TutorSession[] }>(`/tutors/${tutorId}/sessions${query}`);
    return response.data;
  },
};
