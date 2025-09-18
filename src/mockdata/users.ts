import type { User } from '../types';

// Mock Students/Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    avatar: '/assets/img/users/user-1.jpg',
    role: 'student',
    createdAt: '2023-06-15T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: 'user-2',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    avatar: '/assets/img/users/user-2.jpg',
    role: 'student',
    createdAt: '2023-08-22T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    id: 'user-3',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    avatar: '/assets/img/users/user-3.jpg',
    role: 'student',
    createdAt: '2023-09-10T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  },
  {
    id: 'user-4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    avatar: '/assets/img/users/user-4.jpg',
    role: 'student',
    createdAt: '2023-11-05T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z'
  },
  {
    id: 'user-5',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: '/assets/img/users/user-5.jpg',
    role: 'student',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z'
  }
];

// Mock Admin Users
export const mockAdmins: User[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@askyourtutor.com',
    avatar: '/assets/img/users/admin-1.jpg',
    role: 'admin',
    createdAt: '2021-01-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  }
];

// Helper functions
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getUsersByRole = (role: User['role']): User[] => {
  return mockUsers.filter(user => user.role === role);
};

export const getStudents = (): User[] => {
  return getUsersByRole('student');
};

export const getAllUsers = (): User[] => {
  return [...mockUsers, ...mockAdmins];
};
