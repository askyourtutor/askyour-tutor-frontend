import { apiFetch } from '../../../shared/services/api';
import type { CourseReview, CreateReviewRequest } from '../types/course.types';

const API_BASE = (import.meta.env.VITE_API_URL as string) || '/api';

export interface ReviewAggregates {
  avgRating: number;
  reviewsCount: number;
  reviewBreakdown: Record<number, number> | null;
}

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
export async function getCourseReviews(courseId: string, page?: number, limit?: number): Promise<ReviewsResponse> {
  const url = new URL(`${API_BASE}/courses/${courseId}/reviews`, window.location.origin);
  if (typeof page !== 'undefined') url.searchParams.set('page', String(page));
  if (typeof limit !== 'undefined') url.searchParams.set('limit', String(limit));
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch reviews: ${response.status}`);
  }
  return response.json();
}

// Create a new review (auth required)
export async function createReview(courseId: string, data: CreateReviewRequest): Promise<{ data: CourseReview; aggregates?: ReviewAggregates }> {
  return apiFetch<{ data: CourseReview; aggregates?: ReviewAggregates }>(`/courses/${courseId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Update an existing review (auth required, must own review)
export async function updateReview(
  courseId: string,
  reviewId: string,
  data: Partial<CreateReviewRequest>,
): Promise<{ data: CourseReview; aggregates?: ReviewAggregates }> {
  return apiFetch<{ data: CourseReview; aggregates?: ReviewAggregates }>(`/courses/${courseId}/reviews/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Delete own review
export async function deleteReview(courseId: string, reviewId: string): Promise<{ ok: boolean; aggregates?: ReviewAggregates }> {
  return apiFetch<{ ok: boolean; aggregates?: ReviewAggregates }>(`/courses/${courseId}/reviews/${reviewId}`, {
    method: 'DELETE',
  });
}
