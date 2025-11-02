import type { 
  AdminUser, 
  AdminTutor, 
  AdminCourse,
  CourseLevel,
  CourseStatus,
} from '../types/admin';
import { ADMIN_CONSTANTS } from '../constants/admin';

/**
 * Calculate profile completion percentage based on filled fields
 */
export function calculateProfileCompletion(profile: {
  firstName?: string;
  lastName?: string;
  university?: string;
  [key: string]: unknown;
}): number {
  if (!profile) return 0;
  
  const fields = [
    profile.firstName,
    profile.lastName,
    profile.university,
  ];
  
  const filledFields = fields.filter(field => field && field.trim().length > 0).length;
  return Math.round((filledFields / fields.length) * 100);
}

/**
 * Transform API user response to AdminUser interface
 */
export function transformApiUser(user: {
  id: string;
  email: string;
  role: 'STUDENT' | 'TUTOR' | 'ADMIN';
  status: string;
  emailVerified: boolean;
  createdAt: string;
  studentProfile?: {
    firstName?: string;
    lastName?: string;
    university?: string;
  };
  tutorProfile?: {
    firstName?: string;
    lastName?: string;
    university?: string;
  };
}): AdminUser {
  const profile = user.studentProfile || user.tutorProfile;
  
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status as AdminUser['status'],
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    profile: profile ? {
      firstName: profile.firstName,
      lastName: profile.lastName,
      university: profile.university,
      profileCompletion: calculateProfileCompletion(profile),
    } : undefined,
  };
}

/**
 * Transform API tutor response to AdminTutor interface
 */
export function transformApiTutor(tutor: {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  tutorProfile: {
    firstName: string;
    lastName: string;
    university?: string;
    professionalTitle?: string;
    hourlyRate?: number;
    teachingExperience?: number;
    verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    bio?: string;
  };
}): AdminTutor {
  return {
    id: tutor.id,
    email: tutor.email,
    tutorProfile: {
      firstName: tutor.tutorProfile.firstName,
      lastName: tutor.tutorProfile.lastName,
      university: tutor.tutorProfile.university,
      professionalTitle: tutor.tutorProfile.professionalTitle,
      hourlyRate: tutor.tutorProfile.hourlyRate,
      teachingExperience: tutor.tutorProfile.teachingExperience,
      verificationStatus: tutor.tutorProfile.verificationStatus,
      bio: tutor.tutorProfile.bio,
    },
    status: tutor.status,
    createdAt: tutor.createdAt,
  };
}

/**
 * Determine course level from API data or return default
 */
function determineCourseLevel(): CourseLevel {
  return ADMIN_CONSTANTS.DEFAULT_COURSE_LEVEL;
}

/**
 * Transform API course response to AdminCourse interface
 */
export function transformApiCourse(course: {
  id: string;
  title: string;
  description?: string;
  subject: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  tutorId: string;
  tutor?: {
    id: string;
    email: string;
    tutorProfile?: {
      firstName?: string;
      lastName?: string;
    };
  };
  _count?: {
    sessions?: number;
  };
  rating?: number;
}): AdminCourse {
  const tutorProfile = course.tutor?.tutorProfile;
  const status: CourseStatus = course.isActive ? 'ACTIVE' : 'INACTIVE';
  
  return {
    id: course.id,
    title: course.title,
    description: course.description || '',
    subject: course.subject,
    level: determineCourseLevel(),
    price: course.price,
    duration: ADMIN_CONSTANTS.DEFAULT_COURSE_DURATION,
    status,
    createdAt: course.createdAt,
    tutor: {
      id: course.tutor?.id || course.tutorId,
      firstName: tutorProfile?.firstName || ADMIN_CONSTANTS.DEFAULT_TUTOR_FIRST_NAME,
      lastName: tutorProfile?.lastName || ADMIN_CONSTANTS.DEFAULT_TUTOR_LAST_NAME,
      email: course.tutor?.email || ADMIN_CONSTANTS.DEFAULT_TUTOR_EMAIL,
      profileImage: undefined,
    },
    enrollmentCount: course._count?.sessions || 0,
    rating: course.rating,
    isPublished: course.isActive,
  };
}

/**
 * Batch transform users from API response
 */
export function transformApiUsers(users: Parameters<typeof transformApiUser>[0][]): AdminUser[] {
  return users.map(transformApiUser);
}

/**
 * Batch transform tutors from API response
 */
export function transformApiTutors(tutors: Parameters<typeof transformApiTutor>[0][]): AdminTutor[] {
  return tutors.map(transformApiTutor);
}

/**
 * Batch transform courses from API response
 */
export function transformApiCourses(courses: Parameters<typeof transformApiCourse>[0][]): AdminCourse[] {
  return courses.map(transformApiCourse);
}

/**
 * Get display name from profile
 */
export function getDisplayName(
  firstName?: string, 
  lastName?: string, 
  fallback = 'N/A'
): string {
  if (!firstName && !lastName) return fallback;
  return `${firstName || ''} ${lastName || ''}`.trim();
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get relative time (e.g., "2 days ago")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}
