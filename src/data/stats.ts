// Platform Statistics and Analytics Data

export interface PlatformStats {
  totalStudents: number;
  totalCourses: number;
  totalInstructors: number;
  totalHoursOfContent: number;
  averageRating: number;
  completionRate: number;
  certificatesIssued: number;
  countriesServed: number;
}

export interface CourseStats {
  courseId: string;
  enrollments: number;
  completions: number;
  averageProgress: number;
  totalWatchTime: number; // in minutes
  dropoffRate: number;
  peakEnrollmentMonth: string;
}

export interface InstructorStats {
  instructorId: string;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  totalCourses: number;
  totalHours: number;
  responseTime: number; // in hours
}

export interface MonthlyStats {
  month: string;
  newStudents: number;
  newCourses: number;
  revenue: number;
  completions: number;
}

// Platform Overview Statistics
export const platformStats: PlatformStats = {
  totalStudents: 16500,
  totalCourses: 7500,
  totalInstructors: 450,
  totalHoursOfContent: 12000,
  averageRating: 4.7,
  completionRate: 78,
  certificatesIssued: 8900,
  countriesServed: 95
};

// Course Performance Statistics
export const courseStats: CourseStats[] = [
  {
    courseId: 'course-1',
    enrollments: 1250,
    completions: 975,
    averageProgress: 78,
    totalWatchTime: 15600,
    dropoffRate: 22,
    peakEnrollmentMonth: 'January 2024'
  },
  {
    courseId: 'course-2',
    enrollments: 1850,
    completions: 1480,
    averageProgress: 82,
    totalWatchTime: 22200,
    dropoffRate: 18,
    peakEnrollmentMonth: 'December 2023'
  },
  {
    courseId: 'course-3',
    enrollments: 650,
    completions: 455,
    averageProgress: 70,
    totalWatchTime: 9100,
    dropoffRate: 30,
    peakEnrollmentMonth: 'November 2023'
  },
  {
    courseId: 'course-4',
    enrollments: 980,
    completions: 735,
    averageProgress: 75,
    totalWatchTime: 13720,
    dropoffRate: 25,
    peakEnrollmentMonth: 'January 2024'
  },
  {
    courseId: 'course-5',
    enrollments: 2100,
    completions: 1680,
    averageProgress: 85,
    totalWatchTime: 31500,
    dropoffRate: 15,
    peakEnrollmentMonth: 'February 2024'
  }
];

// Instructor Performance Statistics
export const instructorStats: InstructorStats[] = [
  {
    instructorId: 'instructor-1',
    totalStudents: 2500,
    totalRevenue: 45000,
    averageRating: 4.8,
    totalCourses: 12,
    totalHours: 180,
    responseTime: 2.5
  },
  {
    instructorId: 'instructor-2',
    totalStudents: 1800,
    totalRevenue: 38000,
    averageRating: 4.9,
    totalCourses: 8,
    totalHours: 120,
    responseTime: 1.8
  },
  {
    instructorId: 'instructor-3',
    totalStudents: 3200,
    totalRevenue: 62000,
    averageRating: 4.7,
    totalCourses: 15,
    totalHours: 225,
    responseTime: 3.2
  },
  {
    instructorId: 'instructor-4',
    totalStudents: 2100,
    totalRevenue: 35000,
    averageRating: 4.6,
    totalCourses: 10,
    totalHours: 150,
    responseTime: 2.8
  }
];

// Monthly Growth Statistics
export const monthlyStats: MonthlyStats[] = [
  {
    month: 'August 2023',
    newStudents: 850,
    newCourses: 12,
    revenue: 28500,
    completions: 420
  },
  {
    month: 'September 2023',
    newStudents: 920,
    newCourses: 15,
    revenue: 31200,
    completions: 485
  },
  {
    month: 'October 2023',
    newStudents: 1100,
    newCourses: 18,
    revenue: 35800,
    completions: 560
  },
  {
    month: 'November 2023',
    newStudents: 1250,
    newCourses: 22,
    revenue: 42000,
    completions: 650
  },
  {
    month: 'December 2023',
    newStudents: 1480,
    newCourses: 25,
    revenue: 48500,
    completions: 720
  },
  {
    month: 'January 2024',
    newStudents: 1650,
    newCourses: 28,
    revenue: 52000,
    completions: 810
  }
];

// Popular Categories Statistics
export const categoryStats = [
  {
    categoryId: 'web-development',
    enrollments: 4200,
    averageRating: 4.6,
    totalCourses: 286,
    growthRate: 25
  },
  {
    categoryId: 'digital-marketing',
    enrollments: 3800,
    averageRating: 4.8,
    totalCourses: 186,
    growthRate: 35
  },
  {
    categoryId: 'ui-ux-design',
    enrollments: 2900,
    averageRating: 4.9,
    totalCourses: 140,
    growthRate: 42
  },
  {
    categoryId: 'graphic-design',
    enrollments: 2100,
    averageRating: 4.5,
    totalCourses: 245,
    growthRate: 18
  },
  {
    categoryId: 'mobile-development',
    enrollments: 1800,
    averageRating: 4.7,
    totalCourses: 95,
    growthRate: 28
  },
  {
    categoryId: 'data-science',
    enrollments: 1500,
    averageRating: 4.6,
    totalCourses: 78,
    growthRate: 38
  }
];

// Helper functions for statistics
export const getTotalEnrollments = (): number => {
  return courseStats.reduce((total, course) => total + course.enrollments, 0);
};

export const getAverageCompletionRate = (): number => {
  const totalEnrollments = getTotalEnrollments();
  const totalCompletions = courseStats.reduce((total, course) => total + course.completions, 0);
  return Math.round((totalCompletions / totalEnrollments) * 100);
};

export const getTopPerformingCourse = (): CourseStats => {
  return courseStats.reduce((top, current) => 
    current.completions > top.completions ? current : top
  );
};

export const getTopInstructor = (): InstructorStats => {
  return instructorStats.reduce((top, current) => 
    current.totalStudents > top.totalStudents ? current : top
  );
};

export const getGrowthRate = (months: number = 6): number => {
  if (monthlyStats.length < months) return 0;
  
  const recent = monthlyStats.slice(-months);
  const oldestMonth = recent[0];
  const newestMonth = recent[recent.length - 1];
  
  const growth = ((newestMonth.newStudents - oldestMonth.newStudents) / oldestMonth.newStudents) * 100;
  return Math.round(growth);
};

export const getTotalRevenue = (): number => {
  return monthlyStats.reduce((total, month) => total + month.revenue, 0);
};
