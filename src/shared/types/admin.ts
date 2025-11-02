export type UserRole = 'STUDENT' | 'TUTOR' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'PENDING_VERIFICATION' | 'INACTIVE';

export type CourseStatus = 'ACTIVE' | 'INACTIVE' | 'DRAFT';

export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  university?: string;
  profileCompletion?: number;
}

export interface AdminUser {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
  profile?: UserProfile;
}

export interface TutorProfile {
  firstName: string;
  lastName: string;
  university?: string;
  professionalTitle?: string;
  hourlyRate?: number;
  teachingExperience?: number;
  verificationStatus: VerificationStatus;
  bio?: string;
}

export interface AdminTutor {
  id: string;
  email: string;
  tutorProfile: TutorProfile;
  status: string;
  createdAt: string;
}

export interface CourseInstructor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
}

export interface AdminCourse {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: CourseLevel;
  price: number;
  duration: number;
  status: CourseStatus;
  createdAt: string;
  tutor: CourseInstructor;
  enrollmentCount?: number;
  rating?: number;
  isPublished: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTutors: number;
  totalCourses: number;
  activeSessions: number;
  pendingApprovals: number;
  monthlyRevenue: number;
  userGrowth: number;
}
