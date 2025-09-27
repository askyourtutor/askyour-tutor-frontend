import type { CourseCategory } from '../types';
import { mockCategories } from '../mockdata/courses';

// Category Service - Handles all category-related API calls
export class CategoryService {

  // Get all categories
  async getCategories() {
    try {
      // In production, this would be an API call
      // const response = await fetch(this.baseUrl);
      // return await response.json();
      
      // Mock implementation
      return mockCategories.filter(category => category.isActive);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  // Get category by ID
  async getCategoryById(id: string) {
    try {
      // In production: const response = await fetch(`${this.baseUrl}/${id}`);
      // return await response.json();
      
      const category = mockCategories.find(cat => cat.id === id);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw new Error('Failed to fetch category');
    }
  }

  // Get category by slug
  async getCategoryBySlug(slug: string) {
    try {
      // In production: const response = await fetch(`${this.baseUrl}/slug/${slug}`);
      // return await response.json();
      
      const category = mockCategories.find(cat => cat.slug === slug);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      throw new Error('Failed to fetch category');
    }
  }

  // Get popular categories (sorted by course count)
  async getPopularCategories(limit: number = 6) {
    try {
      // In production: const response = await fetch(`${this.baseUrl}/popular?limit=${limit}`);
      // return await response.json();
      
      return mockCategories
        .filter(category => category.isActive)
        .sort((a, b) => b.courseCount - a.courseCount)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching popular categories:', error);
      throw new Error('Failed to fetch popular categories');
    }
  }
}

export const categoryService = new CategoryService();
