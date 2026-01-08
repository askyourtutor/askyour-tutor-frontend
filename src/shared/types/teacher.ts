export interface TutorProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  professionalTitle?: string;
  bio?: string;
  university?: string;
  degree?: string;
  teachingExperience?: number;
  hourlyRate?: number;
  subjects?: string[];
  sessionTypes?: string[];
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  verifiedAt?: string;
  avatar?: string;
  expertise?: string[];
  rating?: number;
  totalStudents?: number;
  totalCourses?: number;
  verified?: boolean;
}

export interface TutorSummary {
  id: string;
  email: string;
  role: string;
  isAdminTutor?: boolean; // Flag to show admin badge
  tutorProfile: {
    firstName: string;
    lastName: string;
    professionalTitle?: string;
    university?: string;
    teachingExperience?: number;
    hourlyRate?: number;
    bio?: string;
    subjects?: string[];
    sessionTypes?: string[];
    avatar?: string;
    verificationStatus: string;
    linkedin?: string;
    facebook?: string;
    email_contact?: string;
  };
  rating?: number;
  totalStudents?: number;
  totalCourses?: number;
}

export interface TutorsResponse {
  data: TutorSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TutorCourse {
  id: string;
  title: string;
  description: string;
  subject: string;
  code: string | null;
  image: string | null;
  price: number;
  rating: number;
  createdAt: string;
  _count: {
    lessons: number;
  };
}

export interface TutorFilters {
  subject?: string;
  experience?: string;
  priceRange?: string;
  rating?: number;
  sortBy?: 'popular' | 'newest' | 'rating' | 'price-low' | 'price-high';
}

export interface TutorReview {
  id: string;
  rating: number;
  title?: string;
  content?: string;
  createdAt: string;
  student: {
    studentProfile: {
      firstName: string;
      lastName: string;
    } | null;
  };
  course: {
    title: string;
  };
}

export interface TutorSession {
  id: string;
  subject: string;
  topic?: string;
  sessionType: string;
  duration: number;
  scheduledAt: string;
  status: string;
  createdAt: string;
  student: {
    studentProfile: {
      firstName: string;
      lastName: string;
    } | null;
  };
}
