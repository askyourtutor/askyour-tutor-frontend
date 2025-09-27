import type { 
  PlatformStats, 
  CourseStats, 
  InstructorStats, 
  MonthlyStats 
} from '../../../data/stats';
import { 
  platformStats, 
  courseStats, 
  instructorStats, 
  monthlyStats,
  categoryStats,
  getTotalEnrollments,
  getAverageCompletionRate,
  getTopPerformingCourse,
  getTopInstructor,
  getGrowthRate,
  getTotalRevenue
} from '../../../data/stats';

// Statistics Service - Handles all statistics and analytics API calls
export class StatsService {

  // Get platform overview statistics
  async getPlatformStats(): Promise<PlatformStats> {
    try {
      // In production: const response = await fetch(`${this.baseUrl}/platform`);
      // return await response.json();
      
      return platformStats;
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      throw new Error('Failed to fetch platform statistics');
    }
  }

  // Get course performance statistics
  async getCourseStats(courseId?: string): Promise<CourseStats[]> {
    try {
      // In production: 
      // const url = courseId ? `${this.baseUrl}/courses/${courseId}` : `${this.baseUrl}/courses`;
      // const response = await fetch(url);
      // return await response.json();
      
      if (courseId) {
        const stats = courseStats.find(stat => stat.courseId === courseId);
        return stats ? [stats] : [];
      }
      
      return courseStats;
    } catch (error) {
      console.error('Error fetching course stats:', error);
      throw new Error('Failed to fetch course statistics');
    }
  }

  // Get instructor performance statistics
  async getInstructorStats(instructorId?: string): Promise<InstructorStats[]> {
    try {
      // In production:
      // const url = instructorId ? `${this.baseUrl}/instructors/${instructorId}` : `${this.baseUrl}/instructors`;
      // const response = await fetch(url);
      // return await response.json();
      
      if (instructorId) {
        const stats = instructorStats.find(stat => stat.instructorId === instructorId);
        return stats ? [stats] : [];
      }
      
      return instructorStats;
    } catch (error) {
      console.error('Error fetching instructor stats:', error);
      throw new Error('Failed to fetch instructor statistics');
    }
  }

  // Get monthly growth statistics
  async getMonthlyStats(months?: number): Promise<MonthlyStats[]> {
    try {
      // In production: const response = await fetch(`${this.baseUrl}/monthly?months=${months || 12}`);
      // return await response.json();
      
      if (months) {
        return monthlyStats.slice(-months);
      }
      
      return monthlyStats;
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      throw new Error('Failed to fetch monthly statistics');
    }
  }

  // Get category statistics
  async getCategoryStats() {
    try {
      // In production: const response = await fetch(`${this.baseUrl}/categories`);
      // return await response.json();
      
      return categoryStats;
    } catch (error) {
      console.error('Error fetching category stats:', error);
      throw new Error('Failed to fetch category statistics');
    }
  }

  // Get dashboard analytics summary
  async getDashboardAnalytics() {
    try {
      // In production: const response = await fetch(`${this.baseUrl}/dashboard`);
      // return await response.json();
      
      return {
        platform: platformStats,
        totalEnrollments: getTotalEnrollments(),
        averageCompletionRate: getAverageCompletionRate(),
        topCourse: getTopPerformingCourse(),
        topInstructor: getTopInstructor(),
        growthRate: getGrowthRate(),
        totalRevenue: getTotalRevenue(),
        recentMonths: monthlyStats.slice(-6)
      };
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw new Error('Failed to fetch dashboard analytics');
    }
  }

  // Get hero section statistics (for homepage)
  async getHeroStats() {
    try {
      // In production: const response = await fetch(`${this.baseUrl}/hero`);
      // return await response.json();
      
      return {
        activeStudents: platformStats.totalStudents,
        onlineCourses: platformStats.totalCourses,
        totalInstructors: platformStats.totalInstructors,
        certificatesIssued: platformStats.certificatesIssued
      };
    } catch (error) {
      console.error('Error fetching hero stats:', error);
      throw new Error('Failed to fetch hero statistics');
    }
  }
}

export const statsService = new StatsService();
