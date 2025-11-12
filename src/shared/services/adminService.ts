import { apiFetch } from './api';

export interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTutors: number;
  totalCourses: number;
  activeSessions: number;
  pendingApprovals: number;
  verifiedTutors: number;
  unverifiedEmails: number;
  monthlyRevenue: number;
  userGrowth: number;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'STUDENT' | 'TUTOR' | 'ADMIN';
  status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  emailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  studentProfile?: {
    firstName?: string;
    lastName?: string;
    university?: string;
    program?: string;
  } | null;
  tutorProfile?: {
    firstName?: string;
    lastName?: string;
    university?: string;
    professionalTitle?: string;
    verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  } | null;
}

export interface AdminTutor {
  id: string;
  email: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  tutorProfile: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    professionalTitle?: string;
    university?: string;
    department?: string;
    degree?: string;
    specialization?: string;
    qualifications?: string;
    credentialsDocument?: string;
    teachingExperience?: number;
    subjects?: string;
    courseCodes?: string;
    hourlyRate?: number;
    availability?: string;
    bio?: string;
    languages?: string;
    sessionTypes?: string;
    timezone?: string;
    profilePicture?: string;
    verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    verificationNotes?: string;
    verifiedAt?: string;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GetUsersResponse {
  users: AdminUser[];
  pagination: PaginationInfo;
}

export interface GetTutorsResponse {
  tutors: AdminTutor[];
  pagination: PaginationInfo;
}

export interface UpdateUserData {
  role?: 'STUDENT' | 'TUTOR' | 'ADMIN';
  status?: 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  emailVerified?: boolean;
}

export interface ApprovalData {
  notes?: string;
}

export interface BulkApprovalData {
  tutorIds: string[];
  notes?: string;
}

export interface AdminCourse {
  id: string;
  tutorId: string;
  title: string;
  description: string | null;
  subject: string;
  code: string | null;
  universityId: string | null;
  price: number;
  rating: number | null;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tutor?: {
    id: string;
    email: string;
    tutorProfile: {
      firstName: string;
      lastName: string;
    } | null;
  };
  _count?: {
    sessions: number;
  };
}

export interface GetCoursesResponse {
  courses: AdminCourse[];
  pagination: PaginationInfo;
}

class AdminService {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiFetch<{ stats: DashboardStats }>('/admin/dashboard/stats');
    return response.stats;
  }

  async getUsers(params?: {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<GetUsersResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.role) searchParams.append('role', params.role);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const response = await apiFetch<GetUsersResponse>(`/admin/users?${searchParams.toString()}`);
    return response;
  }

  async getTutors(params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<GetTutorsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const response = await apiFetch<GetTutorsResponse>(`/admin/tutors?${searchParams.toString()}`);
    return response;
  }

  async updateUser(userId: string, data: UpdateUserData): Promise<AdminUser> {
    const response = await apiFetch<{ user: AdminUser }>(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return response.user;
  }

  async deleteUser(userId: string): Promise<void> {
    await apiFetch(`/admin/users/${userId}`, { method: 'DELETE' });
  }

  async approveTutor(userId: string, data?: ApprovalData): Promise<void> {
    await apiFetch(`/admin/tutors/${userId}/approve`, {
      method: 'POST',
      body: JSON.stringify(data || {})
    });
  }

  async rejectTutor(userId: string, data?: ApprovalData): Promise<void> {
    await apiFetch(`/admin/tutors/${userId}/reject`, {
      method: 'POST',
      body: JSON.stringify(data || {})
    });
  }

  async bulkApproveTutors(data: BulkApprovalData): Promise<{ approved: number }> {
    const response = await apiFetch<{ approved: number }>('/admin/tutors/bulk-approve', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response;
  }

  async getCourses(params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<GetCoursesResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    interface CoursesApiResponse {
      data: AdminCourse[];
      pagination: PaginationInfo;
    }

    const response = await apiFetch<CoursesApiResponse>(`/courses?${searchParams.toString()}`);
    
    return {
      courses: response.data || [],
      pagination: response.pagination || {
        page: 1,
        limit: params?.limit || 20,
        total: response.data?.length || 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      }
    };
  }

  async updateCourseStatus(courseId: string, isActive: boolean): Promise<AdminCourse> {
    const response = await apiFetch<{ course: AdminCourse }>(`/admin/courses/${courseId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive })
    });
    return response.course;
  }

  async deleteCourse(courseId: string): Promise<void> {
    await apiFetch(`/admin/courses/${courseId}`, {
      method: 'DELETE'
    });
  }
}

export const adminService = new AdminService();