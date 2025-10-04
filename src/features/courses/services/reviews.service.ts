import { apiFetch } from '../../../shared/services/api';
import type { CourseReview, CreateReviewRequest } from '../types/course.types';

const API_BASE = (import.meta.env.VITE_API_URL as string) || '/api';

export interface ReviewsResponse {
  data: CourseReview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Get reviews for a course (paginated)
export async function getCourseReviews(courseId: string, page = 1, limit = 10): Promise<ReviewsResponse> {
  const response = await fetch(`${API_BASE}/courses/${courseId}/reviews?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch reviews: ${response.status}`);
  }
  return response.json();
}

// Create a new review (auth required)
export async function createReview(courseId: string, data: CreateReviewRequest): Promise<{ data: CourseReview }> {
  return apiFetch<{ data: CourseReview }>(`/courses/${courseId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
