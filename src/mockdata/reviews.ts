import type { Review } from '../types';

// Mock Reviews
export const mockReviews: Review[] = [
  {
    id: 'review-1',
    userId: 'user-1',
    courseId: 'course-1',
    rating: 5,
    comment: 'Excellent course! The instructor explains everything clearly and the hands-on projects are very helpful.',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    helpful: 12,
    user: {
      id: 'user-1',
      name: 'John Smith',
      avatar: '/assets/img/users/user-1.jpg'
    }
  },
  {
    id: 'review-2',
    userId: 'user-2',
    courseId: 'course-1',
    rating: 4,
    comment: 'Great content and well-structured lessons. Would recommend to anyone starting with PHP development.',
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
    helpful: 8,
    user: {
      id: 'user-2',
      name: 'Emily Davis',
      avatar: '/assets/img/users/user-2.jpg'
    }
  },
  {
    id: 'review-3',
    userId: 'user-3',
    courseId: 'course-2',
    rating: 5,
    comment: 'Amazing Figma course! I went from complete beginner to creating professional designs. Highly recommended!',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
    helpful: 15,
    user: {
      id: 'user-3',
      name: 'Michael Brown',
      avatar: '/assets/img/users/user-3.jpg'
    }
  },
  {
    id: 'review-4',
    userId: 'user-4',
    courseId: 'course-2',
    rating: 5,
    comment: 'The best UI/UX design course I have taken. Kevin is an excellent instructor with real-world experience.',
    createdAt: '2024-01-14T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
    helpful: 9,
    user: {
      id: 'user-4',
      name: 'Sarah Wilson',
      avatar: '/assets/img/users/user-4.jpg'
    }
  },
  {
    id: 'review-5',
    userId: 'user-5',
    courseId: 'course-3',
    rating: 4,
    comment: 'Solid Android development course. The Kotlin content is up-to-date and the projects are challenging.',
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
    helpful: 6,
    user: {
      id: 'user-5',
      name: 'Alex Johnson',
      avatar: '/assets/img/users/user-5.jpg'
    }
  },
  {
    id: 'review-6',
    userId: 'user-1',
    courseId: 'course-4',
    rating: 4,
    comment: 'Good introduction to data science. The statistical concepts are explained well with practical examples.',
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
    helpful: 7,
    user: {
      id: 'user-1',
      name: 'John Smith',
      avatar: '/assets/img/users/user-1.jpg'
    }
  },
  {
    id: 'review-7',
    userId: 'user-2',
    courseId: 'course-5',
    rating: 5,
    comment: 'Comprehensive digital marketing course! Sarah covers everything from SEO to social media marketing perfectly.',
    createdAt: '2024-01-19T00:00:00Z',
    updatedAt: '2024-01-19T00:00:00Z',
    helpful: 11,
    user: {
      id: 'user-2',
      name: 'Emily Davis',
      avatar: '/assets/img/users/user-2.jpg'
    }
  }
];

// Helper functions
export const getReviewsByCourse = (courseId: string): Review[] => {
  return mockReviews.filter(review => review.courseId === courseId);
};

export const getReviewsByUser = (userId: string): Review[] => {
  return mockReviews.filter(review => review.userId === userId);
};

export const getAverageRating = (courseId: string): number => {
  const courseReviews = getReviewsByCourse(courseId);
  if (courseReviews.length === 0) return 0;
  
  const totalRating = courseReviews.reduce((sum, review) => sum + review.rating, 0);
  return Number((totalRating / courseReviews.length).toFixed(1));
};

export const getReviewCount = (courseId: string): number => {
  return getReviewsByCourse(courseId).length;
};

export const getTopReviews = (limit: number = 5): Review[] => {
  return mockReviews
    .sort((a, b) => b.helpful - a.helpful)
    .slice(0, limit);
};

export const getRecentReviews = (limit: number = 5): Review[] => {
  return mockReviews
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};
