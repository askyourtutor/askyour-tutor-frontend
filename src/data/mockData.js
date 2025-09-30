// Frontend mock data for temporary use without backend API
export const mockCourses = [
  {
    id: "course-1",
    title: "Advanced JavaScript & ES6+",
    description: "Master modern JavaScript concepts including ES6+, async/await, promises, and advanced patterns.",
    subject: "Computer Science",
    code: "CS301",
    image: "/assets/img/courseImage/1.jpg",
    price: 89.99,
    rating: 4.8,
    tutor: {
      id: "tutor-1",
      name: "Dr. Sarah Johnson",
      avatar: "/assets/img/course/author.png"
    },
    lessons: [
      { id: "lesson-1-1", title: "ES6 Arrow Functions", description: "Learn modern function syntax", duration: 25, orderIndex: 1, isPublished: true },
      { id: "lesson-1-2", title: "Destructuring & Spread", description: "Object and array destructuring", duration: 30, orderIndex: 2, isPublished: true },
      { id: "lesson-1-3", title: "Async/Await Patterns", description: "Modern asynchronous programming", duration: 35, orderIndex: 3, isPublished: true },
      { id: "lesson-1-4", title: "Modules & Imports", description: "ES6 module system", duration: 20, orderIndex: 4, isPublished: false }
    ]
  },
  {
    id: "course-2",
    title: "React.js Complete Guide",
    description: "Build modern web applications with React, hooks, context, and state management.",
    subject: "Computer Science",
    code: "CS302",
    image: "/assets/img/courseImage/2.jpg",
    price: 129.99,
    rating: 4.9,
    tutor: {
      id: "tutor-2",
      name: "Michael Chen",
      avatar: "/assets/img/course/author.png"
    },
    lessons: [
      { id: "lesson-2-1", title: "React Fundamentals", description: "Components and JSX", duration: 40, orderIndex: 1, isPublished: true },
      { id: "lesson-2-2", title: "State & Props", description: "Managing component state", duration: 35, orderIndex: 2, isPublished: true },
      { id: "lesson-2-3", title: "React Hooks", description: "useState, useEffect, custom hooks", duration: 45, orderIndex: 3, isPublished: true },
      { id: "lesson-2-4", title: "Context API", description: "Global state management", duration: 30, orderIndex: 4, isPublished: true }
    ]
  },
  {
    id: "course-3",
    title: "Python Programming Fundamentals",
    description: "Learn Python from basics to advanced concepts including OOP, data structures, and algorithms.",
    subject: "Computer Science",
    code: "CS101",
    image: "/assets/img/courseImage/3.jpg",
    price: 79.99,
    rating: 4.7,
    tutor: {
      id: "tutor-3",
      name: "Dr. Emily Rodriguez",
      avatar: "/assets/img/course/author.png"
    },
    lessons: [
      { id: "lesson-3-1", title: "Python Syntax & Variables", description: "Basic Python programming", duration: 30, orderIndex: 1, isPublished: true },
      { id: "lesson-3-2", title: "Control Structures", description: "Loops and conditionals", duration: 35, orderIndex: 2, isPublished: true },
      { id: "lesson-3-3", title: "Functions & Modules", description: "Code organization", duration: 40, orderIndex: 3, isPublished: true },
      { id: "lesson-3-4", title: "Object-Oriented Programming", description: "Classes and objects", duration: 45, orderIndex: 4, isPublished: true }
    ]
  },
  {
    id: "course-4",
    title: "Data Structures & Algorithms",
    description: "Master fundamental data structures and algorithms for technical interviews and problem solving.",
    subject: "Computer Science",
    code: "CS201",
    image: "/assets/img/courseImage/4.jpg",
    price: 149.99,
    rating: 4.8,
    tutor: {
      id: "tutor-4",
      name: "James Wilson",
      avatar: "/assets/img/course/author.png"
    },
    lessons: [
      { id: "lesson-4-1", title: "Arrays & Linked Lists", description: "Linear data structures", duration: 50, orderIndex: 1, isPublished: true },
      { id: "lesson-4-2", title: "Stacks & Queues", description: "LIFO and FIFO structures", duration: 40, orderIndex: 2, isPublished: true },
      { id: "lesson-4-3", title: "Trees & Graphs", description: "Hierarchical structures", duration: 60, orderIndex: 3, isPublished: true },
      { id: "lesson-4-4", title: "Sorting Algorithms", description: "Efficient sorting methods", duration: 45, orderIndex: 4, isPublished: false }
    ]
  },
  {
    id: "course-5",
    title: "Database Design & SQL",
    description: "Learn relational database design, SQL queries, and database optimization techniques.",
    subject: "Computer Science",
    code: "CS303",
    image: "/assets/img/courseImage/5.jpg",
    price: 99.99,
    rating: 4.6,
    tutor: {
      id: "tutor-5",
      name: "Lisa Thompson",
      avatar: "/assets/img/course/author.png"
    },
    lessons: [
      { id: "lesson-5-1", title: "Database Fundamentals", description: "RDBMS concepts", duration: 35, orderIndex: 1, isPublished: true },
      { id: "lesson-5-2", title: "SQL Queries", description: "SELECT, JOIN, subqueries", duration: 45, orderIndex: 2, isPublished: true },
      { id: "lesson-5-3", title: "Database Design", description: "Normalization and ERD", duration: 40, orderIndex: 3, isPublished: true }
    ]
  },
  {
    id: "course-6",
    title: "Machine Learning Basics",
    description: "Introduction to machine learning algorithms, supervised and unsupervised learning.",
    subject: "Computer Science",
    code: "CS401",
    image: "/assets/img/courseImage/6.jpg",
    price: 179.99,
    rating: 4.7,
    tutor: {
      id: "tutor-6",
      name: "Prof. David Kim",
      avatar: "/assets/img/course/author.png"
    },
    lessons: [
      { id: "lesson-6-1", title: "ML Introduction", description: "Types of machine learning", duration: 40, orderIndex: 1, isPublished: true },
      { id: "lesson-6-2", title: "Linear Regression", description: "Supervised learning basics", duration: 50, orderIndex: 2, isPublished: true },
      { id: "lesson-6-3", title: "Classification", description: "Decision trees and SVM", duration: 55, orderIndex: 3, isPublished: true }
    ]
  },
  {
    id: "course-7",
    title: "Web Security Fundamentals",
    description: "Learn about web application security, common vulnerabilities, and protection methods.",
    subject: "Computer Science",
    code: "CS304",
    image: "/assets/img/courseImage/7.jpg",
    price: 119.99,
    rating: 4.5,
    tutor: {
      id: "tutor-7",
      name: "Maria Garcia",
      avatar: "/assets/img/course/author.png"
    },
    lessons: [
      { id: "lesson-7-1", title: "Security Principles", description: "CIA triad and threats", duration: 30, orderIndex: 1, isPublished: true },
      { id: "lesson-7-2", title: "OWASP Top 10", description: "Common vulnerabilities", duration: 45, orderIndex: 2, isPublished: true },
      { id: "lesson-7-3", title: "Authentication & Authorization", description: "Secure access control", duration: 40, orderIndex: 3, isPublished: true }
    ]
  },
  {
    id: "course-8",
    title: "Mobile App Development",
    description: "Build cross-platform mobile applications using React Native and modern development practices.",
    subject: "Computer Science",
    code: "CS305",
    image: "/assets/img/courseImage/1.jpg",
    price: 139.99,
    rating: 4.6,
    tutor: {
      id: "tutor-8",
      name: "Dr. Robert Brown",
      avatar: "/assets/img/course/author.png"
    },
    lessons: [
      { id: "lesson-8-1", title: "React Native Setup", description: "Development environment", duration: 35, orderIndex: 1, isPublished: true },
      { id: "lesson-8-2", title: "Navigation & Routing", description: "App navigation patterns", duration: 40, orderIndex: 2, isPublished: true },
      { id: "lesson-8-3", title: "State Management", description: "Redux and Context", duration: 45, orderIndex: 3, isPublished: true }
    ]
  },
  {
    id: "course-9",
    title: "Calculus I - Limits and Derivatives",
    description: "Master fundamental calculus concepts including limits, continuity, and differentiation.",
    subject: "Mathematics",
    code: "MATH101",
    image: "/assets/img/courseImage/2.jpg",
    price: 89.99,
    rating: 4.7,
    tutor: {
      id: "tutor-9",
      name: "Jennifer Lee",
      avatar: "/assets/img/course/author.png"
    },
    lessons: [
      { id: "lesson-9-1", title: "Introduction to Limits", description: "Understanding limit concepts", duration: 45, orderIndex: 1, isPublished: true },
      { id: "lesson-9-2", title: "Derivative Rules", description: "Power rule, product rule, chain rule", duration: 50, orderIndex: 2, isPublished: true },
      { id: "lesson-9-3", title: "Applications of Derivatives", description: "Optimization and related rates", duration: 55, orderIndex: 3, isPublished: true }
    ]
  },
  {
    id: "course-10",
    title: "Linear Algebra Fundamentals",
    description: "Vector spaces, matrices, eigenvalues, and linear transformations.",
    subject: "Mathematics",
    code: "MATH201",
    image: "/assets/img/courseImage/3.jpg",
    price: 99.99,
    rating: 4.6,
    tutor: {
      id: "tutor-10",
      name: "Alex Turner",
      avatar: "/assets/img/course/author.png"
    },
    lessons: [
      { id: "lesson-10-1", title: "Vectors and Vector Operations", description: "Basic vector arithmetic", duration: 40, orderIndex: 1, isPublished: true },
      { id: "lesson-10-2", title: "Matrix Operations", description: "Matrix multiplication and inverses", duration: 45, orderIndex: 2, isPublished: true },
      { id: "lesson-10-3", title: "Eigenvalues and Eigenvectors", description: "Characteristic equations", duration: 50, orderIndex: 3, isPublished: true }
    ]
  }
];

// Mock categories data
export const mockCategories = [
  { id: "Computer Science", name: "Computer Science", slug: "computer-science", courseCount: 8 },
  { id: "Mathematics", name: "Mathematics", slug: "mathematics", courseCount: 5 },
  { id: "Physics", name: "Physics", slug: "physics", courseCount: 4 },
  { id: "Chemistry", name: "Chemistry", slug: "chemistry", courseCount: 3 },
  { id: "Biology", name: "Biology", slug: "biology", courseCount: 3 },
  { id: "Economics", name: "Economics", slug: "economics", courseCount: 2 },
  { id: "Business", name: "Business", slug: "business", courseCount: 4 },
  { id: "Design", name: "Design", slug: "design", courseCount: 3 },
  { id: "Engineering", name: "Engineering", slug: "engineering", courseCount: 4 },
  { id: "Data Science", name: "Data Science", slug: "data-science", courseCount: 4 }
];

// Mock API service
export const mockApiService = {
  // Get all categories
  getCategories: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCategories);
      }, 300); // Simulate network delay
    });
  },

  // Get courses by category
  getCoursesByCategory: (categoryId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredCourses = mockCourses.filter(course => course.subject === categoryId);
        resolve({ data: filteredCourses });
      }, 500);
    });
  },

  // Get single course by ID
  getCourseById: (courseId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const course = mockCourses.find(c => c.id === courseId);
        if (course) {
          resolve({ data: course });
        } else {
          reject(new Error('Course not found'));
        }
      }, 400);
    });
  },

  // Get all courses (for homepage)
  getAllCourses: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockCourses });
      }, 600);
    });
  }
};

export default mockApiService;
