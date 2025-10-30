// Centralized course-related types

export interface ApiLesson {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  videoUrl: string | null; // Video URL for this lesson
  duration: number | null;
  orderIndex: number;
  isPublished: boolean;
}

export interface CourseResource {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'slides' | 'image' | 'zip' | 'other';
  sizeLabel?: string | null; // e.g., '2.4 MB'
  url?: string | null; // download URL
  duration?: number | null; // if a resource maps to a lesson duration
}

export interface ApiCourse {
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
  // Optional API-driven extras
  university?: string | null;
  difficulty?: string | null; // e.g., 'beginner' | 'intermediate' | 'advanced'
  studentsCount?: number | null;
  learningOutcomes?: string[] | null;
  requirements?: string[] | null;
  additionalTutors?: CourseTutorBrief[] | null;
  quickStats?: CourseQuickStats | null;
  previewVideoUrl?: string | null;
  reviewsCount?: number | null;
  reviewBreakdown?: Record<number, number> | null; // key: 1-5 star, value: percentage 0-100
  qna?: CourseQuestion[] | null;
  certificateAvailable?: boolean | null;
  resources?: CourseResource[] | null;
}

export interface CourseTutorBrief {
  id: string;
  name: string;
  avatar: string | null;
  rate?: number | null; // hourly rate if available
  rating?: number | null;
  verified?: boolean | null;
  qualifications?: string | null;
}

export interface CourseQuickStats {
  totalTutors?: number | null;
  avgRating?: number | null;
  priceRange?: string | null; // e.g., "$35-65"
}

export interface CourseAnswer {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface CourseQuestion {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  answers?: CourseAnswer[];
  createdBy?: string;
  createdAt?: string;
}

// Reviews
export interface CourseReview {
  id: string;
  courseId: string;
  studentId: string;
  rating: number; // 1-5
  title?: string | null;
  content?: string | null;
  createdAt: string;
  student?: { id: string; name?: string | null; avatar?: string | null } | null;
}

export interface CreateReviewRequest {
  rating: number; // 1-5
  title?: string;
  content?: string;
}
