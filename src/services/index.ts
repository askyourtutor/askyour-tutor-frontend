// Service Layer - Using Mock Data
// This file exports mock services for development

import { mockServices } from './mockService';

// Export configured services - Always use mock data
export const services = mockServices;

console.log('🔧 Using Mock Services for development');

// Individual service exports for convenience
export const {
  courses: courseService,
  categories: categoryService,
  instructors: instructorService,
  users: userService,
  reviews: reviewService,
  analytics: analyticsService,
  auth: authService
} = services;

// Default export
export default services;
