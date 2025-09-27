import type { Course, CourseCategory, Instructor } from '../shared/types';

// Mock Instructors
export const mockInstructors: Instructor[] = [
  {
    id: 'instructor-1',
    name: 'Max Alexix',
    email: 'max.alexix@example.com',
    avatar: '/assets/img/course/author.png',
    role: 'instructor',
    bio: 'Senior Full Stack Developer with 8+ years of experience in web development and software engineering.',
    expertise: ['JavaScript', 'React', 'Node.js', 'Python', 'PHP'],
    totalCourses: 12,
    totalStudents: 2500,
    rating: 4.8,
    verified: true,
    createdAt: '2022-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'instructor-2',
    name: 'Kevin Perry',
    email: 'kevin.perry@example.com',
    avatar: '/assets/img/course/author.png',
    role: 'instructor',
    bio: 'UI/UX Designer and Frontend Developer specializing in modern design systems and user experience.',
    expertise: ['UI/UX Design', 'Figma', 'React', 'TypeScript', 'Design Systems'],
    totalCourses: 8,
    totalStudents: 1800,
    rating: 4.9,
    verified: true,
    createdAt: '2022-03-20T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'instructor-3',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    avatar: '/assets/img/course/author.png',
    role: 'instructor',
    bio: 'Digital Marketing Expert with expertise in SEO, Social Media Marketing, and Content Strategy.',
    expertise: ['Digital Marketing', 'SEO', 'Social Media', 'Content Marketing', 'Analytics'],
    totalCourses: 15,
    totalStudents: 3200,
    rating: 4.7,
    verified: true,
    createdAt: '2021-11-10T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: 'instructor-4',
    name: 'David Chen',
    email: 'david.chen@example.com',
    avatar: '/assets/img/course/author.png',
    role: 'instructor',
    bio: 'Mobile App Developer and Android Expert with extensive experience in Kotlin and Java.',
    expertise: ['Android Development', 'Kotlin', 'Java', 'Mobile UI/UX', 'Firebase'],
    totalCourses: 10,
    totalStudents: 2100,
    rating: 4.6,
    verified: true,
    createdAt: '2022-06-01T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  }
];

// Mock Course Categories
export const mockCategories: CourseCategory[] = [
  {
    id: 'web-development',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Learn modern web development technologies and frameworks',
    icon: 'IconCode',
    image: '/assets/img/categories/web-dev.jpg',
    courseCount: 286,
    isActive: true,
    order: 1
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    description: 'Master digital marketing strategies and tools',
    icon: 'IconBrandGoogle',
    image: '/assets/img/categories/digital-marketing.jpg',
    courseCount: 186,
    isActive: true,
    order: 2
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX Design',
    slug: 'ui-ux-design',
    description: 'Create beautiful and user-friendly interfaces',
    icon: 'IconPalette',
    image: '/assets/img/categories/ui-ux.jpg',
    courseCount: 140,
    isActive: true,
    order: 3
  },
  {
    id: 'graphic-design',
    name: 'Graphic Design',
    slug: 'graphic-design',
    description: 'Design stunning graphics and visual content',
    icon: 'IconBrush',
    image: '/assets/img/categories/graphic-design.jpg',
    courseCount: 245,
    isActive: true,
    order: 4
  },
  {
    id: 'mobile-development',
    name: 'Mobile Development',
    slug: 'mobile-development',
    description: 'Build mobile applications for iOS and Android',
    icon: '/assets/img/icon/course-tab-icon1.svg',
    image: '/assets/img/categories/mobile-dev.jpg',
    courseCount: 95,
    isActive: true,
    order: 5
  },
  {
    id: 'data-science',
    name: 'Data Science',
    slug: 'data-science',
    description: 'Analyze data and build machine learning models',
    icon: '/assets/img/icon/course-tab-icon2.svg',
    image: '/assets/img/categories/data-science.jpg',
    courseCount: 78,
    isActive: true,
    order: 6
  }
];

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Education Software and PHP and JS System Script',
    description: 'Complete guide to building education management systems using PHP and JavaScript. Learn to create student portals, course management, and administrative dashboards.',
    shortDescription: 'Build complete education management systems with PHP and JavaScript',
    image: '/assets/img/course/course_1_1.png',
    thumbnail: '/assets/img/course/course_1_1_thumb.png',
    duration: '3 weeks',
    level: 'Beginner',
    price: 0,
    currency: 'USD',
    isFree: true,
    rating: 4.7,
    ratingCount: 156,
    totalLessons: 8,
    totalStudents: 1250,
    language: 'English',
    subtitles: ['English', 'Spanish'],
    category: mockCategories[0], // Web Development
    tags: ['PHP', 'JavaScript', 'MySQL', 'Education', 'Full Stack'],
    instructor: mockInstructors[0], // Max Alexix
    syllabus: [
      {
        id: 'lesson-1-1',
        title: 'Introduction to Education Management Systems',
        description: 'Overview of education software architecture',
        duration: 45,
        videoUrl: '/videos/course-1/lesson-1.mp4',
        materials: [],
        order: 1,
        isPreview: true
      },
      {
        id: 'lesson-1-2',
        title: 'Setting up PHP Development Environment',
        description: 'Configure XAMPP, PHP, and MySQL',
        duration: 60,
        videoUrl: '/videos/course-1/lesson-2.mp4',
        materials: [],
        order: 2,
        isPreview: false
      }
    ],
    requirements: ['Basic HTML/CSS knowledge', 'Computer with internet connection'],
    whatYouWillLearn: [
      'Build complete education management system',
      'Master PHP backend development',
      'Create interactive JavaScript frontends',
      'Database design and management',
      'User authentication and authorization'
    ],
    targetAudience: ['Beginner developers', 'Students', 'Educators interested in tech'],
    isPublished: true,
    isFeatured: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    certificateAvailable: true
  },
  {
    id: 'course-2',
    title: 'Learn Figma – UI/UX Design Essential Training',
    description: 'Master Figma from basics to advanced techniques. Learn to design beautiful user interfaces, create design systems, and collaborate with teams effectively.',
    shortDescription: 'Complete Figma training for UI/UX designers',
    image: '/assets/img/course/course_1_2.png',
    thumbnail: '/assets/img/course/course_1_2_thumb.png',
    duration: '2 weeks',
    level: 'Beginner',
    price: 0,
    currency: 'USD',
    isFree: true,
    rating: 4.8,
    ratingCount: 203,
    totalLessons: 9,
    totalStudents: 1850,
    language: 'English',
    subtitles: ['English', 'French'],
    category: mockCategories[2], // UI/UX Design
    tags: ['Figma', 'UI Design', 'UX Design', 'Prototyping', 'Design Systems'],
    instructor: mockInstructors[1], // Kevin Perry
    syllabus: [
      {
        id: 'lesson-2-1',
        title: 'Figma Interface and Basics',
        description: 'Getting started with Figma workspace',
        duration: 40,
        videoUrl: '/videos/course-2/lesson-1.mp4',
        materials: [],
        order: 1,
        isPreview: true
      },
      {
        id: 'lesson-2-2',
        title: 'Creating Your First Design',
        description: 'Design a simple mobile app interface',
        duration: 55,
        videoUrl: '/videos/course-2/lesson-2.mp4',
        materials: [],
        order: 2,
        isPreview: false
      }
    ],
    requirements: ['No prior design experience needed', 'Computer with internet access'],
    whatYouWillLearn: [
      'Master Figma tools and features',
      'Create professional UI designs',
      'Build interactive prototypes',
      'Design responsive layouts',
      'Collaborate with design teams'
    ],
    targetAudience: ['Aspiring UI/UX designers', 'Developers wanting design skills', 'Product managers'],
    isPublished: true,
    isFeatured: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
    certificateAvailable: true
  },
  {
    id: 'course-3',
    title: 'Advanced Android 12 & Kotlin Development Course',
    description: 'Deep dive into Android 12 development with Kotlin. Learn modern Android architecture, Jetpack Compose, and build production-ready applications.',
    shortDescription: 'Advanced Android development with Kotlin and Android 12',
    image: '/assets/img/course/course_1_3.png',
    thumbnail: '/assets/img/course/course_1_3_thumb.png',
    duration: '4 weeks',
    level: 'Advanced',
    price: 0,
    currency: 'USD',
    isFree: true,
    rating: 4.6,
    ratingCount: 89,
    totalLessons: 7,
    totalStudents: 650,
    language: 'English',
    subtitles: ['English', 'Hindi'],
    category: mockCategories[4], // Mobile Development
    tags: ['Android', 'Kotlin', 'Jetpack Compose', 'Mobile Development', 'MVVM'],
    instructor: mockInstructors[3], // David Chen
    syllabus: [
      {
        id: 'lesson-3-1',
        title: 'Android 12 New Features Overview',
        description: 'Explore the latest Android 12 capabilities',
        duration: 50,
        videoUrl: '/videos/course-3/lesson-1.mp4',
        materials: [],
        order: 1,
        isPreview: true
      },
      {
        id: 'lesson-3-2',
        title: 'Kotlin Advanced Concepts',
        description: 'Coroutines, Flow, and advanced Kotlin features',
        duration: 70,
        videoUrl: '/videos/course-3/lesson-2.mp4',
        materials: [],
        order: 2,
        isPreview: false
      }
    ],
    requirements: ['Intermediate Android development experience', 'Basic Kotlin knowledge', 'Android Studio installed'],
    whatYouWillLearn: [
      'Master Android 12 features',
      'Build apps with Jetpack Compose',
      'Implement MVVM architecture',
      'Use advanced Kotlin features',
      'Optimize app performance'
    ],
    targetAudience: ['Intermediate Android developers', 'Mobile app developers', 'Software engineers'],
    isPublished: true,
    isFeatured: false,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-17T00:00:00Z',
    certificateAvailable: true
  },
  {
    id: 'course-4',
    title: 'IT Statistics Data Science and Business Analysis',
    description: 'Learn data science fundamentals, statistical analysis, and business intelligence. Master tools like Python, R, and SQL for data-driven decision making.',
    shortDescription: 'Complete data science and business analysis course',
    image: '/assets/img/course/course_1_4.png',
    thumbnail: '/assets/img/course/course_1_4_thumb.png',
    duration: '2 weeks',
    level: 'Intermediate',
    price: 0,
    currency: 'USD',
    isFree: true,
    rating: 4.5,
    ratingCount: 127,
    totalLessons: 10,
    totalStudents: 980,
    language: 'English',
    subtitles: ['English', 'German'],
    category: mockCategories[5], // Data Science
    tags: ['Data Science', 'Statistics', 'Python', 'R', 'Business Analysis', 'SQL'],
    instructor: mockInstructors[1], // Kevin Perry
    syllabus: [
      {
        id: 'lesson-4-1',
        title: 'Introduction to Data Science',
        description: 'Overview of data science workflow and tools',
        duration: 45,
        videoUrl: '/videos/course-4/lesson-1.mp4',
        materials: [],
        order: 1,
        isPreview: true
      },
      {
        id: 'lesson-4-2',
        title: 'Statistical Analysis Fundamentals',
        description: 'Basic statistics and probability concepts',
        duration: 60,
        videoUrl: '/videos/course-4/lesson-2.mp4',
        materials: [],
        order: 2,
        isPreview: false
      }
    ],
    requirements: ['Basic mathematics knowledge', 'Computer with Python installed', 'Interest in data analysis'],
    whatYouWillLearn: [
      'Master statistical analysis techniques',
      'Use Python for data science',
      'Create data visualizations',
      'Perform business analysis',
      'Make data-driven decisions'
    ],
    targetAudience: ['Business analysts', 'Data enthusiasts', 'Students', 'Professionals seeking data skills'],
    isPublished: true,
    isFeatured: false,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
    certificateAvailable: true
  },
  {
    id: 'course-5',
    title: 'Complete Digital Marketing Masterclass',
    description: 'Comprehensive digital marketing course covering SEO, social media marketing, email marketing, PPC advertising, and analytics.',
    shortDescription: 'Master all aspects of digital marketing',
    image: '/assets/img/course/course_1_2.png',
    thumbnail: '/assets/img/course/course_1_2_thumb.png',
    duration: '3 weeks',
    level: 'Beginner',
    price: 0,
    currency: 'USD',
    isFree: true,
    rating: 4.9,
    ratingCount: 312,
    totalLessons: 12,
    totalStudents: 2100,
    language: 'English',
    subtitles: ['English', 'Portuguese'],
    category: mockCategories[1], // Digital Marketing
    tags: ['Digital Marketing', 'SEO', 'Social Media', 'Email Marketing', 'PPC', 'Analytics'],
    instructor: mockInstructors[2], // Sarah Johnson
    syllabus: [
      {
        id: 'lesson-5-1',
        title: 'Digital Marketing Fundamentals',
        description: 'Introduction to digital marketing landscape',
        duration: 40,
        videoUrl: '/videos/course-5/lesson-1.mp4',
        materials: [],
        order: 1,
        isPreview: true
      },
      {
        id: 'lesson-5-2',
        title: 'SEO Basics and Strategy',
        description: 'Search engine optimization fundamentals',
        duration: 65,
        videoUrl: '/videos/course-5/lesson-2.mp4',
        materials: [],
        order: 2,
        isPreview: false
      }
    ],
    requirements: ['No prior marketing experience needed', 'Computer with internet access', 'Willingness to learn'],
    whatYouWillLearn: [
      'Master SEO techniques',
      'Create effective social media campaigns',
      'Build email marketing funnels',
      'Run profitable PPC campaigns',
      'Analyze marketing performance'
    ],
    targetAudience: ['Marketing beginners', 'Small business owners', 'Entrepreneurs', 'Career changers'],
    isPublished: true,
    isFeatured: true,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-19T00:00:00Z',
    certificateAvailable: true
  }
];

// Helper functions for filtering and searching
export const getCoursesByCategory = (categoryId: string): Course[] => {
  return mockCourses.filter(course => course.category.id === categoryId);
};

export const getFeaturedCourses = (): Course[] => {
  return mockCourses.filter(course => course.isFeatured);
};

export const getFreeCourses = (): Course[] => {
  return mockCourses.filter(course => course.isFree);
};

export const getCoursesByInstructor = (instructorId: string): Course[] => {
  return mockCourses.filter(course => course.instructor.id === instructorId);
};

export const searchCourses = (query: string): Course[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockCourses.filter(course => 
    course.title.toLowerCase().includes(lowercaseQuery) ||
    course.description.toLowerCase().includes(lowercaseQuery) ||
    course.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};
