import { apiFetch } from '../../../shared/services/api';
import type { CategorySummary } from '../../../shared/types';

// Category Service - Handles all category-related API calls
export class CategoryService {

  // Get all categories
  async getCategories(): Promise<CategorySummary[]> {
    try {
      return await apiFetch<CategorySummary[]>(`/courses/categories`);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }
}

export const categoryService = new CategoryService();
