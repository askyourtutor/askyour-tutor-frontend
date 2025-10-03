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
};

// Optional: dev helper to get mock by id
export const getMockCourseById = (id: string): ApiCourse | null => {
  return mockCourse.id === id ? mockCourse : null;
};
