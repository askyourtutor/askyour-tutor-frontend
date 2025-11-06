// ===== COMMON TYPES =====
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  status: number;
}

// Minimal category shape returned by /courses/categories
export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  courseCount: number;
}

// Minimal course shape returned by /courses/category/:id for cards
export interface CourseSummary {
  id: string;
  title: string;
  image?: string | null;
  duration?: string; // formatted label like '60m' or '2h'
  totalLessons?: number;
  totalStudents?: number;
  rating?: number;
  instructor?: { name?: string; avatar?: string | null };
  isFree: boolean;
  price: number;
  isAdminCourse?: boolean; // Flag to indicate if course is created by admin
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ===== USER TYPES =====
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'instructor' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Instructor extends User {
  role: 'instructor';
  bio?: string;
  expertise: string[];
  totalCourses: number;
  totalStudents: number;
  rating: number;
  verified: boolean;
}

// ===== COURSE TYPES =====
export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  image: string;
  thumbnail?: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  originalPrice?: number;
  currency: string;
  isFree: boolean;
  rating: number;
  ratingCount: number;
  totalLessons: number;
  totalStudents: number;
  language: string;
  subtitles: string[];
  category: CourseCategory;
  tags: string[];
  instructor: Instructor;
  syllabus: CourseLesson[];
  requirements: string[];
  whatYouWillLearn: string[];
  targetAudience: string[];
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  enrollmentDeadline?: string;
  certificateAvailable: boolean;
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  image?: string;
  courseCount: number;
  isActive: boolean;
  parentId?: string;
  order: number;
}

export interface CourseLesson {
  id: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  videoUrl?: string;
  materials: CourseMaterial[];
  order: number;
  isPreview: boolean;
  isCompleted?: boolean;
}

export interface CourseMaterial {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz' | 'assignment';
  url?: string;
  content?: string;
  size?: number;
  downloadable: boolean;
}

// ===== ENROLLMENT TYPES =====
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedAt?: string;
  progress: number; // 0-100
  currentLessonId?: string;
  certificateUrl?: string;
  rating?: number;
  review?: string;
}

// ===== REVIEW TYPES =====
export interface Review {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  helpful: number;
  user: Pick<User, 'id' | 'name' | 'avatar'>;
}

// ===== FILTER & SEARCH TYPES =====
export interface CourseFilters {
  categories?: string[];
  levels?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  duration?: {
    min: number;
    max: number;
  };
  rating?: number;
  isFree?: boolean;
  language?: string;
  hasSubtitles?: boolean;
  hasCertificate?: boolean;
}

export interface SearchParams extends PaginationParams {
  filters?: CourseFilters;
  query?: string;
}

// ===== COMPONENT PROPS TYPES =====
export interface CourseCardProps {
  course: CourseSummary;
  variant?: 'default' | 'compact' | 'featured';
  showInstructor?: boolean;
  showCategory?: boolean;
  className?: string;
}

export interface CategoryTabProps {
  categories: CourseCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
}

// ===== FORM TYPES =====
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterForm {
  email: string;
}

export interface CourseEnrollmentForm {
  courseId: string;
  paymentMethod?: 'free' | 'stripe' | 'paypal';
  couponCode?: string;
}

// ===== ERROR TYPES =====
export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown>;
}

export interface ValidationError {
  field: string;
  message: string;
}

// ===== UTILITY TYPES =====
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ===== THEME TYPES =====
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  background: string;
  surface: string;
  border: string;
}

export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

// Re-export teacher types
export type { TutorProfile, TutorSummary, TutorsResponse, TutorFilters } from './teacher';

