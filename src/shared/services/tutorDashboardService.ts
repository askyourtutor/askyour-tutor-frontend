import { apiFetch } from './api';

export interface TutorDashboardStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  totalLessons: number;
  totalStudents: number;
  totalSessions: number;
  upcomingSessions: number;
  completedSessions: number;
  pendingSessions: number;
  totalRevenue: number;
  monthlyRevenue: number;
  avgRating: number;
  totalReviews: number;
}

export interface RecentSession {
  id: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  subject: string;
  scheduledAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  duration: number;
  meetingLink?: string | null;
}

export interface RecentReview {
  id: string;
  studentName: string;
  courseName: string;
  rating: number;
  title?: string | null;
  content?: string | null;
  createdAt: string;
}

export interface CourseWithStats {
  id: string;
  title: string;
  description?: string | null;
  subject: string;
  code?: string | null;
  price: number;
  image?: string | null;
  isActive: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
  stats: {
    lessons: number;
    students: number;
    reviews: number;
    savedBy: number;
  };
}

export interface SessionDetails {
  id: string;
  student: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
  course: {
    id: string;
    title: string;
    subject: string;
  } | null;
  subject: string;
  topic?: string | null;
  sessionType: string;
  duration: number;
  scheduledAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  meetingLink?: string | null;
  notes?: string | null;
  specialRequirements?: string | null;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  university?: string | null;
  program?: string | null;
  totalSessions: number;
  completedSessions: number;
  courses: Array<{ id: string; title: string }>;
  lastSession: string;
}

export interface MonthlyEarnings {
  month: string;
  amount: number;
}

export interface CourseEarnings {
  courseId: string;
  title: string;
  sessions: number;
  revenue: number;
  avgPerSession: number;
}

export interface LessonDetails {
  id: string;
  title: string;
  description?: string | null;
  content?: string | null;
  duration?: number | null;
  orderIndex: number;
  isPublished: boolean;
  uploadStatus?: string | null;
  processingStatus?: string | null;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  bunnyVideoId?: string | null;
  fileSize?: number | null;
  uploadedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EarningsData {
  totalEarnings: number;
  totalSessions: number;
  monthlyEarnings: MonthlyEarnings[];
  courseEarnings: CourseEarnings[];
}

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<TutorDashboardStats> => {
  const response = await apiFetch<{ stats: TutorDashboardStats }>('/tutor-dashboard/stats');
  return response.stats;
};

/**
 * Get recent activity (sessions and reviews)
 */
export const getRecentActivity = async (): Promise<{
  recentSessions: RecentSession[];
  recentReviews: RecentReview[];
}> => {
  return await apiFetch<{
    recentSessions: RecentSession[];
    recentReviews: RecentReview[];
  }>('/tutor-dashboard/recent-activity');
};

/**
 * Get all courses for current tutor
 */
export const getTutorCourses = async (params?: {
  status?: 'published' | 'draft';
  search?: string;
}): Promise<CourseWithStats[]> => {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.search) queryParams.append('search', params.search);
  const query = queryParams.toString();
  
  const response = await apiFetch<{ courses: CourseWithStats[] }>(
    `/tutor-dashboard/courses${query ? `?${query}` : ''}`
  );
  return response.courses;
};

/**
 * Create a new course
 */
export const createCourse = async (courseData: {
  title: string;
  description?: string;
  subject: string;
  code?: string;
  universityId?: string;
  price: number;
  image?: string;
  isActive?: boolean;
}): Promise<CourseWithStats> => {
  const response = await apiFetch<{ course: CourseWithStats }>('/tutor-dashboard/courses', {
    method: 'POST',
    body: JSON.stringify(courseData)
  });
  return response.course;
};

/**
 * Update course details
 */
export const updateCourse = async (
  courseId: string,
  courseData: Partial<{
    title: string;
    description: string;
    subject: string;
    code: string;
    universityId: string;
    price: number;
    image: string;
    isActive: boolean;
  }>
): Promise<CourseWithStats> => {
  const response = await apiFetch<{ course: CourseWithStats }>(
    `/tutor-dashboard/courses/${courseId}`,
    {
      method: 'PUT',
      body: JSON.stringify(courseData)
    }
  );
  return response.course;
};

/**
 * Delete a course
 */
export const deleteCourse = async (courseId: string): Promise<void> => {
  await apiFetch<void>(`/tutor-dashboard/courses/${courseId}`, {
    method: 'DELETE'
  });
};

/**
 * Toggle course publish status
 */
export const toggleCoursePublish = async (
  courseId: string,
  isActive: boolean
): Promise<CourseWithStats> => {
  const response = await apiFetch<{ course: CourseWithStats }>(
    `/tutor-dashboard/courses/${courseId}/publish`,
    {
      method: 'PATCH',
      body: JSON.stringify({ isActive })
    }
  );
  return response.course;
};

/**
 * Get tutor's sessions with filters
 */
export const getTutorSessions = async (params?: {
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  upcoming?: boolean;
  page?: number;
  limit?: number;
}): Promise<{
  sessions: SessionDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}> => {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.upcoming !== undefined) queryParams.append('upcoming', String(params.upcoming));
  if (params?.page) queryParams.append('page', String(params.page));
  if (params?.limit) queryParams.append('limit', String(params.limit));
  const query = queryParams.toString();
  
  return await apiFetch<{
    sessions: SessionDetails[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }>(`/tutor-dashboard/sessions${query ? `?${query}` : ''}`);
};

/**
 * Update session status
 */
export const updateSessionStatus = async (
  sessionId: string,
  data: {
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    notes?: string;
    meetingLink?: string;
  }
): Promise<SessionDetails> => {
  const response = await apiFetch<{ session: SessionDetails }>(
    `/tutor-dashboard/sessions/${sessionId}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify(data)
    }
  );
  return response.session;
};

/**
 * Cancel a session
 */
export const cancelSession = async (
  sessionId: string,
  reason?: string
): Promise<SessionDetails> => {
  const response = await apiFetch<{ session: SessionDetails }>(
    `/tutor-dashboard/sessions/${sessionId}/cancel`,
    {
      method: 'POST',
      body: JSON.stringify({ reason })
    }
  );
  return response.session;
};

/**
 * Get list of students
 */
export const getTutorStudents = async (): Promise<Student[]> => {
  const response = await apiFetch<{ students: Student[] }>('/tutor-dashboard/students');
  return response.students;
};

/**
 * Create a new lesson for a course
 */
export const createLesson = async (
  courseId: string,
  lessonData: {
    title: string;
    description?: string;
    content?: string;
    duration?: number;
    orderIndex?: number;
  }
): Promise<LessonDetails> => {
  const response = await apiFetch<{ lesson: LessonDetails }>(
    `/tutor-dashboard/courses/${courseId}/lessons`,
    {
      method: 'POST',
      body: JSON.stringify(lessonData)
    }
  );
  return response.lesson;
};

/**
 * Update lesson details
 */
export const updateLesson = async (
  courseId: string,
  lessonId: string,
  lessonData: Partial<{
    title: string;
    description: string;
    content: string;
    duration: number;
    orderIndex: number;
    isPublished: boolean;
  }>
): Promise<LessonDetails> => {
  const response = await apiFetch<{ lesson: LessonDetails }>(
    `/tutor-dashboard/courses/${courseId}/lessons/${lessonId}`,
    {
      method: 'PUT',
      body: JSON.stringify(lessonData)
    }
  );
  return response.lesson;
};

/**
 * Delete a lesson
 */
export const deleteLesson = async (courseId: string, lessonId: string): Promise<void> => {
  await apiFetch<void>(`/tutor-dashboard/courses/${courseId}/lessons/${lessonId}`, {
    method: 'DELETE'
  });
};

/**
 * Get all lessons for a course
 */
export const getCourseLessons = async (courseId: string): Promise<LessonDetails[]> => {
  const response = await apiFetch<{ lessons: LessonDetails[] }>(
    `/tutor-dashboard/courses/${courseId}/lessons`
  );
  return response.lessons;
};

/**
 * Get earnings overview
 */
export const getTutorEarnings = async (): Promise<EarningsData> => {
  return await apiFetch<EarningsData>('/tutor-dashboard/earnings');
};

export interface Payment {
  id: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  completedAt?: string | null;
}

export interface PaymentStats {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  totalTransactions: number;
  successRate: number;
}

export interface PaymentsResponse {
  payments: Payment[];
  stats: PaymentStats;
}

/**
 * Get tutor payments
 */
export const getTutorPayments = async (): Promise<PaymentsResponse> => {
  return await apiFetch<PaymentsResponse>('/payments/tutor/payments');
};

const tutorDashboardService = {
  getDashboardStats,
  getRecentActivity,
  getTutorCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCoursePublish,
  createLesson,
  updateLesson,
  deleteLesson,
  getCourseLessons,
  getTutorSessions,
  updateSessionStatus,
  cancelSession,
  getTutorStudents,
  getTutorEarnings,
  getTutorPayments,
};

export default tutorDashboardService;
