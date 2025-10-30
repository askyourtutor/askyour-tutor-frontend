import { apiFetch, ApiError } from '../../../shared/services/api';
import type { CategorySummary } from '../../../shared/types';

// Category Service - Handles all category-related API calls
export class CategoryService {

  // Get all categories
  async getCategories(): Promise<CategorySummary[]> {
    try {
      return await apiFetch<CategorySummary[]>(`/courses/categories`);
    } catch (error) {
      // Only log unexpected errors, API errors are already logged appropriately
      if (!(error instanceof ApiError)) {
        console.error('Error fetching categories:', error);
      }
      throw new Error('Failed to fetch categories');
    }
  }
}

export const categoryService = new CategoryService();
