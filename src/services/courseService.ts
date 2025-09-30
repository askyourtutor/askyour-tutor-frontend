import { mockCourses, mockCategories } from '../data/mockData';

// Types
interface ApiCourse {
  id: string;
  title: string;
  description: string;
  subject: string;
  code: string | null;
  image: string | null;
  price: number;
  rating: number;
  tutor: { id: string; name: string; avatar: string | null };
  lessons: ApiLesson[];
}

interface ApiLesson {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  duration: number | null;
  orderIndex: number;
  isPublished: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  courseCount: number;
}

interface ApiResponse<T> {
  data: T;
}

// Configuration - set to true to use mock data, false for real API
const USE_MOCK_DATA = true;

// Real API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Mock API service functions
const mockApiService = {
  getCategories: (): Promise<Category[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCategories);
      }, 300);
    });
  },

  getCoursesByCategory: (categoryId: string): Promise<ApiResponse<ApiCourse[]>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredCourses = mockCourses
          .filter(course => course.subject === categoryId)
          .map(course => ({
            ...course,
            code: course.code as string | null,
            image: course.image as string | null,
            tutor: { ...course.tutor, avatar: course.tutor.avatar as string | null },
            lessons: course.lessons.map(lesson => ({
              ...lesson,
              description: lesson.description as string | null,
              content: null as string | null
            }))
          }));
        resolve({ data: filteredCourses });
      }, 500);
    });
  },

  getCourseById: (courseId: string): Promise<ApiResponse<ApiCourse>> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const course = mockCourses.find(c => c.id === courseId);
        if (course) {
          const apiCourse: ApiCourse = {
            ...course,
            code: course.code as string | null,
            image: course.image as string | null,
            tutor: { ...course.tutor, avatar: course.tutor.avatar as string | null },
            lessons: course.lessons.map(lesson => ({
              ...lesson,
              description: lesson.description as string | null,
              content: null as string | null
            }))
          };
          resolve({ data: apiCourse });
        } else {
          reject(new Error('Course not found'));
        }
      }, 400);
    });
  },

  getAllCourses: (): Promise<ApiResponse<ApiCourse[]>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const apiCourses = mockCourses.map(course => ({
          ...course,
          code: course.code as string | null,
          image: course.image as string | null,
          tutor: { ...course.tutor, avatar: course.tutor.avatar as string | null },
          lessons: course.lessons.map(lesson => ({
            ...lesson,
            description: lesson.description as string | null,
            content: null as string | null
          }))
        }));
        resolve({ data: apiCourses });
      }, 600);
    });
  }
};

// Real API service functions
const realApiService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/courses/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  getCoursesByCategory: async (categoryId: string): Promise<ApiResponse<ApiCourse[]>> => {
    const response = await fetch(`${API_BASE_URL}/courses/category/${categoryId}`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  },

  getCourseById: async (courseId: string): Promise<ApiResponse<ApiCourse>> => {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    return response.json();
  },

  getAllCourses: async (): Promise<ApiResponse<ApiCourse[]>> => {
    const response = await fetch(`${API_BASE_URL}/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
  }
};

// Service selector - returns mock or real API based on configuration
const courseService = {
  getCategories: (): Promise<Category[]> => {
    return USE_MOCK_DATA ? mockApiService.getCategories() : realApiService.getCategories();
  },

  getCoursesByCategory: (categoryId: string): Promise<ApiResponse<ApiCourse[]>> => {
    return USE_MOCK_DATA ? mockApiService.getCoursesByCategory(categoryId) : realApiService.getCoursesByCategory(categoryId);
  },

  getCourseById: (courseId: string): Promise<ApiResponse<ApiCourse>> => {
    return USE_MOCK_DATA ? mockApiService.getCourseById(courseId) : realApiService.getCourseById(courseId);
  },

  getAllCourses: (): Promise<ApiResponse<ApiCourse[]>> => {
    return USE_MOCK_DATA ? mockApiService.getAllCourses() : realApiService.getAllCourses();
  }
};

export default courseService;
export type { ApiCourse, ApiLesson, Category, ApiResponse };
