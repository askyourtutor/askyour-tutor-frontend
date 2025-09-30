import mockApiService from '../data/mockData.js';

// Configuration - set to true to use mock data, false for real API
const USE_MOCK_DATA = true;

// Real API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Real API service functions
const realApiService = {
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/courses/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  getCoursesByCategory: async (categoryId) => {
    const response = await fetch(`${API_BASE_URL}/courses/category/${categoryId}`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  getCourseById: async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
  },

  getAllCourses: async () => {
    const response = await fetch(`${API_BASE_URL}/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  }
};

// Service selector - returns mock or real API based on configuration
const courseService = {
  getCategories: () => {
    return USE_MOCK_DATA ? mockApiService.getCategories() : realApiService.getCategories();
  },

  getCoursesByCategory: (categoryId) => {
    return USE_MOCK_DATA ? mockApiService.getCoursesByCategory(categoryId) : realApiService.getCoursesByCategory(categoryId);
  },

  getCourseById: (courseId) => {
    return USE_MOCK_DATA ? mockApiService.getCourseById(courseId) : realApiService.getCourseById(courseId);
  },

  getAllCourses: () => {
    return USE_MOCK_DATA ? mockApiService.getAllCourses() : realApiService.getAllCourses();
  }
};

export default courseService;
