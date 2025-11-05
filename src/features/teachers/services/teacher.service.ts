import { apiFetch } from '../../../shared/services/api';
import { fetchWithCache } from '../../../shared/lib/cache';
import type { TutorSummary, TutorsResponse, TutorCourse } from '../../../shared/types/teacher';

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
    try {
      const response = await apiFetch<{ success: boolean; data: string[] }>('/tutors/subjects');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
      // Return default subjects as fallback
      return [
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'Computer Science',
        'English',
        'History',
        'Geography',
        'Economics',
        'Business',
      ];
    }
  },

  async getTutorCourses(tutorId: string): Promise<TutorCourse[]> {
    const response = await fetchWithCache(
      `tutor:courses:${tutorId}`,
      () => apiFetch<{ success: boolean; data: TutorCourse[] }>(`/tutors/${tutorId}/courses`)
    );
    return response.data;
  },
};
