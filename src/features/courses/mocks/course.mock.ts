import type { ApiCourse } from '../types/course.types';

export const mockCourse: ApiCourse = {
  id: 'course_1',
  title: 'Intro to Chemistry',
  description:
    'Learn the fundamentals of chemistry including atomic structure, chemical reactions, and laboratory techniques. This course provides a solid foundation for further studies.',
  subject: 'Chemistry',
  code: 'CHEM-101',
  image: '/assets/img/course/course_1.jpg',
  price: 80.96,
  rating: 4.8,
  tutor: { id: 'tutor_1', name: 'Dr. Sarah Johnson', avatar: '/assets/img/course/author.png' },
  lessons: Array.from({ length: 8 }).map((_, i) => ({
    id: `lesson_${i + 1}`,
    title: `Lesson ${i + 1}: Topic Overview`,
    description: 'Detailed explanation and examples for the topic in this lesson.',
    content: null,
    duration: 10 + i * 5,
    orderIndex: i,
    isPublished: i < 6,
  })),
  // Optional extras
  university: 'University of Colombo',
  difficulty: 'Intermediate',
  studentsCount: 1234,
  learningOutcomes: [
    'Master core concepts and fundamentals',
    'Build practical, real-world projects',
    'Learn industry best practices',
    'Get certification upon completion',
    'Access to exclusive resources',
    'Lifetime course access',
  ],
  requirements: [
    'No prior experience required',
    'Computer with internet connection',
    'Willingness to learn and practice',
  ],
  additionalTutors: [
    {
      id: 'tutor_2',
      name: 'Dr. Emily Rodriguez',
      avatar: '/assets/img/course/author.png',
      rate: 45,
      rating: 4.9,
      verified: true,
      qualifications: 'MSc, 8 years exp',
    },
    {
      id: 'tutor_3',
      name: 'Prof. Michael Chen',
      avatar: '/assets/img/course/author.png',
      rate: 55,
      rating: 4.8,
      verified: true,
      qualifications: 'PhD, 12 years exp',
    },
  ],
  quickStats: {
    totalTutors: 8,
    avgRating: 4.8,
    priceRange: '$35-65',
  },
  certificateAvailable: true,
  previewVideoUrl: '/assets/video/course-preview.mp4',
  reviewsCount: 234,
  reviewBreakdown: {
    5: 75,
    4: 18,
    3: 5,
    2: 2,
    1: 0,
  },
  resources: [
    { id: 'res_1', title: 'Syllabus & Course Guide', type: 'pdf', sizeLabel: '1.2 MB', url: null, duration: null },
    { id: 'res_2', title: 'Lecture Notes - Atomic Structure', type: 'pdf', sizeLabel: '2.4 MB', url: null, duration: 15 },
    { id: 'res_3', title: 'Practice Problems - Chemical Reactions', type: 'pdf', sizeLabel: '1.8 MB', url: null, duration: 20 },
    { id: 'res_4', title: 'Lab Safety Checklist', type: 'doc', sizeLabel: '320 KB', url: null, duration: null },
    { id: 'res_5', title: 'Formula Sheet', type: 'pdf', sizeLabel: '650 KB', url: null, duration: null },
    { id: 'res_6', title: 'Sample Data Set', type: 'zip', sizeLabel: '5.2 MB', url: null, duration: null },
  ],
  qna: [
    {
      id: 'q1',
      title: 'How do I balance redox reactions in acidic solution?',
      content: 'I\'m having trouble balancing redox reactions in acidic conditions. Can someone explain the steps?',
      tags: ['General', 'Electrochemistry'],
      votes: 12,
      answers: [
        { id: 'a1', authorName: 'Tutor', content: 'Split into half-reactions, balance O with H2O, H with H+, then electrons.', createdAt: new Date().toISOString() },
        { id: 'a2', authorName: 'Student', content: 'This video helped me: ...', createdAt: new Date().toISOString() },
      ],
      createdBy: 'John Smith',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'q2',
      title: 'Are the course materials downloadable?',
      content: 'Can I download lecture notes and practice problems for offline study?',
      tags: ['Resources'],
      votes: 8,
      answers: [],
      createdBy: 'Maria Garcia',
      createdAt: new Date().toISOString(),
    },
  ],
};

// Optional: dev helper to get mock by id
export const getMockCourseById = (id: string): ApiCourse | null => {
  return mockCourse.id === id ? mockCourse : null;
};
