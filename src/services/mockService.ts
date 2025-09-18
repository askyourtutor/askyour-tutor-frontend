// Mock Service - Simulates API calls using mock data
// This service will be replaced with real API calls in production

import type { 
  Course, 
  CourseCategory, 
  Instructor, 
  User, 
  Review, 
  PaginatedResponse,
  SearchParams,
  CourseFilters 
} from '../types';

import {
  mockCourses,
  mockCategories,
  mockInstructors,
  getCoursesByCategory,
  getFeaturedCourses,
  getFreeCourses,
  searchCourses
} from '../mockdata/courses';

import { mockUsers } from '../mockdata/users';
import { mockReviews, getReviewsByCourse } from '../mockdata/reviews';
import { platformStats, courseStats } from '../mockdata/stats';

// Simulate API delay
const simulateDelay = (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};


// Simulate pagination
const paginateResults = <T>(
  items: T[],
  page: number = 1,
  limit: number = 10
): PaginatedResponse<T> => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    data: paginatedItems,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(items.length / limit),
      totalItems: items.length,
      itemsPerPage: limit,
      hasNext: endIndex < items.length,
      hasPrev: page > 1
    }
  };
};

// ===== COURSE MOCK SERVICE =====
export const mockCourseService = {
  // Get all courses with pagination and filters
  getCourses: async (params?: SearchParams): Promise<PaginatedResponse<Course>> => {
    await simulateDelay();
    
    let filteredCourses = [...mockCourses];
    
    // Apply search query
    if (params?.query) {
      filteredCourses = searchCourses(params.query);
    }
    
    // Apply filters
    if (params?.filters) {
      const { filters } = params;
      
      if (filters.categories && filters.categories.length > 0) {
        filteredCourses = filteredCourses.filter(course => 
          filters.categories!.includes(course.category.id)
        );
      }
      
      if (filters.levels && filters.levels.length > 0) {
        filteredCourses = filteredCourses.filter(course => 
          filters.levels!.includes(course.level)
        );
      }
      
      if (filters.isFree !== undefined) {
        filteredCourses = filteredCourses.filter(course => 
          course.isFree === filters.isFree
        );
      }
      
      if (filters.rating) {
        filteredCourses = filteredCourses.filter(course => 
          course.rating >= filters.rating!
        );
      }
    }
    
    // Apply sorting
    if (params?.sortBy) {
      filteredCourses.sort((a, b) => {
        const aValue = a[params.sortBy as keyof Course];
        const bValue = b[params.sortBy as keyof Course];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        if (params.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }
    
    return paginateResults(filteredCourses, params?.page, params?.limit);
  },

  // Get course by ID
  getCourse: async (id: string): Promise<Course | null> => {
    await simulateDelay();
    return mockCourses.find(course => course.id === id) || null;
  },

  // Get courses by category
  getCoursesByCategory: async (categoryId: string, params?: SearchParams): Promise<PaginatedResponse<Course>> => {
    await simulateDelay();
    const categoryCourses = getCoursesByCategory(categoryId);
    return paginateResults(categoryCourses, params?.page, params?.limit);
  },

  // Get featured courses
  getFeaturedCourses: async (): Promise<Course[]> => {
    await simulateDelay();
    return getFeaturedCourses();
  },

  // Get free courses
  getFreeCourses: async (): Promise<Course[]> => {
    await simulateDelay();
    return getFreeCourses();
  },

  // Search courses
  searchCourses: async (query: string, filters?: CourseFilters): Promise<Course[]> => {
    await simulateDelay();
    let results = searchCourses(query);
    
    if (filters) {
      // Apply additional filters to search results
      if (filters.categories && filters.categories.length > 0) {
        results = results.filter(course => 
          filters.categories!.includes(course.category.id)
        );
      }
    }
    
    return results;
  },

  // Get course reviews
  getCourseReviews: async (courseId: string): Promise<Review[]> => {
    await simulateDelay();
    return getReviewsByCourse(courseId);
  },

  // Simulate course enrollment
  enrollCourse: async (): Promise<{ success: boolean; enrollmentId: string }> => {
    await simulateDelay();
    return {
      success: true,
      enrollmentId: `enrollment-${Date.now()}`
    };
  },

  // Get course progress (mock)
  getCourseProgress: async (): Promise<{ progress: number; completedLessons: string[] }> => {
    await simulateDelay();
    return {
      progress: Math.floor(Math.random() * 100),
      completedLessons: ['lesson-1', 'lesson-2']
    };
  }
};

// ===== CATEGORY MOCK SERVICE =====
export const mockCategoryService = {
  // Get all categories
  getCategories: async (): Promise<CourseCategory[]> => {
    await simulateDelay();
    return mockCategories;
  },

  // Get category by ID
  getCategory: async (id: string): Promise<CourseCategory | null> => {
    await simulateDelay();
    return mockCategories.find(category => category.id === id) || null;
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string): Promise<CourseCategory | null> => {
    await simulateDelay();
    return mockCategories.find(category => category.slug === slug) || null;
  }
};

// ===== INSTRUCTOR MOCK SERVICE =====
export const mockInstructorService = {
  // Get all instructors
  getInstructors: async (): Promise<Instructor[]> => {
    await simulateDelay();
    return mockInstructors;
  },

  // Get instructor by ID
  getInstructor: async (id: string): Promise<Instructor | null> => {
    await simulateDelay();
    return mockInstructors.find(instructor => instructor.id === id) || null;
  },

  // Get instructor courses
  getInstructorCourses: async (instructorId: string): Promise<Course[]> => {
    await simulateDelay();
    return mockCourses.filter(course => course.instructor.id === instructorId);
  }
};

// ===== USER MOCK SERVICE =====
export const mockUserService = {
  // Get current user profile (mock)
  getProfile: async (): Promise<User | null> => {
    await simulateDelay();
    // Return first user as current user for demo
    return mockUsers[0] || null;
  },

  // Update user profile (mock)
  updateProfile: async (data: Partial<User>): Promise<User> => {
    await simulateDelay();
    const currentUser = mockUsers[0];
    return { ...currentUser, ...data };
  },

  // Get user enrollments (mock)
  getEnrollments: async (): Promise<Course[]> => {
    await simulateDelay();
    // Return random courses as enrolled courses
    return mockCourses.slice(0, 3);
  },

  // Get user wishlist (mock)
  getWishlist: async (): Promise<Course[]> => {
    await simulateDelay();
    // Return random courses as wishlist
    return mockCourses.slice(2, 5);
  },

  // Add to wishlist (mock)
  addToWishlist: async (courseId: string): Promise<{ success: boolean }> => {
    await simulateDelay();
    console.log(`Added course ${courseId} to wishlist`);
    return { success: true };
  },

  // Remove from wishlist (mock)
  removeFromWishlist: async (courseId: string): Promise<{ success: boolean }> => {
    await simulateDelay();
    console.log(`Removed course ${courseId} from wishlist`);
    return { success: true };
  }
};

// ===== REVIEW MOCK SERVICE =====
export const mockReviewService = {
  // Create review (mock)
  createReview: async (courseId: string, rating: number, comment: string): Promise<Review> => {
    await simulateDelay();
    const newReview: Review = {
      id: `review-${Date.now()}`,
      userId: 'user-1',
      courseId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      helpful: 0,
      user: {
        id: 'user-1',
        name: 'Current User',
        avatar: '/assets/img/users/user-1.jpg'
      }
    };
    return newReview;
  },

  // Update review (mock)
  updateReview: async (reviewId: string, rating: number, comment: string): Promise<Review | null> => {
    await simulateDelay();
    const review = mockReviews.find(r => r.id === reviewId);
    if (review) {
      return {
        ...review,
        rating,
        comment,
        updatedAt: new Date().toISOString()
      };
    }
    return null;
  },

  // Delete review (mock)
  deleteReview: async (reviewId: string): Promise<{ success: boolean }> => {
    await simulateDelay();
    console.log(`Deleted review ${reviewId}`);
    return { success: true };
  },

  // Mark review as helpful (mock)
  markHelpful: async (reviewId: string): Promise<{ success: boolean }> => {
    await simulateDelay();
    console.log(`Marked review ${reviewId} as helpful`);
    return { success: true };
  }
};

// ===== ANALYTICS MOCK SERVICE =====
export const mockAnalyticsService = {
  // Get platform stats
  getPlatformStats: async (): Promise<typeof platformStats> => {
    await simulateDelay();
    return platformStats;
  },

  // Get course analytics
  getCourseAnalytics: async (courseId: string): Promise<typeof courseStats[0]> => {
    await simulateDelay();
    const courseStat = courseStats.find(stat => stat.courseId === courseId);
    return courseStat || {
      courseId,
      enrollments: 0,
      completions: 0,
      averageProgress: 0,
      totalWatchTime: 0,
      dropoffRate: 0,
      peakEnrollmentMonth: 'N/A'
    };
  },

  // Track course view (mock)
  trackCourseView: async (courseId: string): Promise<{ success: boolean }> => {
    await simulateDelay(100); // Shorter delay for tracking
    console.log(`Tracked course view: ${courseId}`);
    return { success: true };
  },

  // Track lesson completion (mock)
  trackLessonCompletion: async (courseId: string, lessonId: string): Promise<{ success: boolean }> => {
    await simulateDelay(100);
    console.log(`Tracked lesson completion: ${courseId}/${lessonId}`);
    return { success: true };
  }
};

// ===== AUTHENTICATION MOCK SERVICE =====
export const mockAuthService = {
  // Login (mock)
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    await simulateDelay();
    
    // Simple mock validation
    if (email && password) {
      const user = mockUsers.find(u => u.email === email) || mockUsers[0];
      return {
        token: `mock-token-${Date.now()}`,
        user
      };
    }
    
    throw new Error('Invalid credentials');
  },

  // Register (mock)
  register: async (name: string, email: string): Promise<{ token: string; user: User }> => {
    await simulateDelay();
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: 'student',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return {
      token: `mock-token-${Date.now()}`,
      user: newUser
    };
  },

  // Logout (mock)
  logout: async (): Promise<{ success: boolean }> => {
    await simulateDelay(200);
    return { success: true };
  }
};

// Export all mock services
export const mockServices = {
  courses: mockCourseService,
  categories: mockCategoryService,
  instructors: mockInstructorService,
  users: mockUserService,
  reviews: mockReviewService,
  analytics: mockAnalyticsService,
  auth: mockAuthService
};

export default mockServices;
