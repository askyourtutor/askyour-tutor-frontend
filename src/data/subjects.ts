export type Department = 'IT' | 'Business' | 'Science' | 'Law' | 'Arts';

export interface Subject {
  name: string;
  department: Department;
}

export const subjectsByDepartment: Record<Department, string[]> = {
  IT: [
    'Computer Science',
    'Data Science',
    'Machine Learning',
    'Artificial Intelligence',
    'Electrical Engineering'
  ],
  Business: [
    'Business Strategy',
    'Financial Management',
    'Marketing',
    'Economics',
    'Entrepreneurship'
  ],
  Science: [
    'Physics',
    'Chemistry',
    'Mathematics',
    'Biology',
    'Statistics',
    'Quantum Mechanics',
    'Linear Algebra',
    'Calculus',
    'Differential Equations',
    'Organic Chemistry',
    'Physical Chemistry',
    'Genetics',
    'Microbiology',
    'Mechanical Engineering',
    'Civil Engineering'
  ],
  Law: [
    'Constitutional Law',
    'Criminal Law',
    'Civil Law',
    'International Law',
    'Legal Research'
  ],
  Arts: [
    'English Literature',
    'History',
    'Philosophy',
    'Psychology',
    'Sociology'
  ]
};

export const subjects: Subject[] = [
  { name: 'Physics', department: 'Science' },
  { name: 'Chemistry', department: 'Science' },
  { name: 'Mathematics', department: 'Science' },
  { name: 'Biology', department: 'Science' },
  { name: 'Computer Science', department: 'IT' },
  { name: 'Electrical Engineering', department: 'Science' },
  { name: 'Mechanical Engineering', department: 'Science' },
  { name: 'Civil Engineering', department: 'Science' },
  { name: 'Data Science', department: 'IT' },
  { name: 'Statistics', department: 'Science' },
  { name: 'Machine Learning', department: 'IT' },
  { name: 'Artificial Intelligence', department: 'IT' },
  { name: 'Organic Chemistry', department: 'Science' },
  { name: 'Physical Chemistry', department: 'Science' },
  { name: 'Quantum Mechanics', department: 'Science' },
  { name: 'Linear Algebra', department: 'Science' },
  { name: 'Calculus', department: 'Science' },
  { name: 'Differential Equations', department: 'Science' },
  { name: 'Genetics', department: 'Science' },
  { name: 'Microbiology', department: 'Science' }
];

// Helper functions for subjects
export const getSubjectsByDepartment = (department: Department): Subject[] => {
  return subjects.filter(subject => subject.department === department);
};

export const getAllDepartments = (): Department[] => {
  return ['IT', 'Business', 'Science', 'Law', 'Arts'];
};

export const getSubjectNames = (): string[] => {
  return subjects.map(subject => subject.name);
};
