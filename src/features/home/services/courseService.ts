import {
  getCoursesByCategory,
  getCoursesByInstructor,
  getFeaturedCourses,
  getFreeCourses,
  mockCourses,
  searchCourses
} from '../../../data/courses';

// Course Service - Handles all course-related API calls
export class CourseService {

  // Get all courses with pagination  
  async getCourses(params?: {
    page?: number;
    limit?: number;
    category?: string;
    level?: string;
    isFree?: boolean;
    search?: string;
  }) {
    try {
      // In production, this would be an API call
      // const response = await fetch(`${this.baseUrl}?${new URLSearchParams(params)}`);
      // return await response.json();
      
      // Mock implementation
      let filteredCourses = [...mockCourses];
      
      if (params?.category) {
        filteredCourses = getCoursesByCategory(params.category);
      }
      
      if (params?.isFree !== undefined) {
        filteredCourses = filteredCourses.filter(course => course.isFree === params.isFree);
      }
      
      if (params?.level) {
        filteredCourses = filteredCourses.filter(course => course.level === params.level);
      }
      
      if (params?.search) {
        filteredCourses = searchCourses(params.search);
      }
      
      const page = params?.page || 1;
      const limit = params?.limit || 12;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      return {
        data: filteredCourses.slice(startIndex, endIndex),
        pagination: {
          page,
          limit,
          total: filteredCourses.length,
          totalPages: Math.ceil(filteredCourses.length / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new Error('Failed to fetch courses');
    }
  }

  // Get course by ID
  async getCourseById(id: string) {
    try {
      // In production: const response = await fetch(`${this.baseUrl}/${id}`);
      // return await response.json();
      
      const course = mockCourses.find(course => course.id === id);
      if (!course) {
        throw new Error('Course not found');
      }
      return { data: course };
    } catch (error) {
      console.error('Error fetching course:', error);
      throw new Error('Failed to fetch course');
    }
  }

  // Get courses by category
  async getCoursesByCategory(categoryId: string) {
    try {
      // In production: const response = await fetch(`${this.baseUrl}/category/${categoryId}`);
      // return await response.json();
      
      return {
        data: getCoursesByCategory(categoryId)
      };
    } catch (error) {
      console.error('Error fetching courses by category:', error);
      throw new Error('Failed to fetch courses by category');
    }
  }

  // Get featured courses
  async getFeaturedCourses() {
    try {
      // In production: const response = await fetch(`${this.baseUrl}/featured`);
      // return await response.json();
      
      return {
        data: getFeaturedCourses()
      };
    } catch (error) {
      console.error('Error fetching featured courses:', error);
      throw new Error('Failed to fetch featured courses');
    }
  }

  // Get free courses
  async getFreeCourses() {
    try {
      // In production: const response = await fetch(`${this.baseUrl}/free`);
      // return await response.json();
      
      return {
        data: getFreeCourses()
      };
    } catch (error) {
      console.error('Error fetching free courses:', error);
      throw new Error('Failed to fetch free courses');
    }
  }

  // Get courses by instructor
  async getCoursesByInstructor(instructorId: string) {
    try {
      // In production: const response = await fetch(`${this.baseUrl}/instructor/${instructorId}`);
      // return await response.json();
      
      return {
        data: getCoursesByInstructor(instructorId)
      };
    } catch (error) {
      console.error('Error fetching courses by instructor:', error);
      throw new Error('Failed to fetch courses by instructor');
    }
  }

  // Search courses
  async searchCourses(query: string) {
    try {
      // In production: const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
      // return await response.json();
      
      return {
        data: searchCourses(query)
      };
    } catch (error) {
      console.error('Error searching courses:', error);
      throw new Error('Failed to search courses');
    }
  }

  // Enroll in course
  async enrollInCourse(courseId: string) {
    try {
      // In production: 
      // const response = await fetch(`${this.baseUrl}/${courseId}/enroll`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // });
      // return await response.json();
      
      // Mock implementation
      return {
        success: true,
        message: `Successfully enrolled in course ${courseId}`,
        courseId,
      };
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw new Error('Failed to enroll in course');
    }
  }
}

export const courseService = new CourseService();
