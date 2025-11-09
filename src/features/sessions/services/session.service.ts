import { apiFetch } from '../../../shared/services/api';

export interface CreateSessionRequest {
  tutorId: string;
  courseId?: string;
  subject: string;
  topic?: string;
  duration: number;
  scheduledAt: string;
  specialRequirements?: string;
}

export interface Session {
  id: string;
  studentId: string;
  tutorId: string;
  subject: string;
  topic: string | null;
  sessionType: string;
  duration: number;
  scheduledAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  specialRequirements: string | null;
  meetingLink: string | null;
  notes: string | null;
  courseId: string | null;
  cancelledAt: string | null;
  cancelledBy: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
  tutor: {
    id: string;
    email: string;
    tutorProfile: {
      firstName: string;
      lastName: string;
      profilePicture: string | null;
      hourlyRate?: number;
    } | null;
    studentProfile: {
      firstName: string;
      lastName: string;
    } | null;
  };
  student: {
    id: string;
    email: string;
    tutorProfile: {
      firstName: string;
      lastName: string;
      profilePicture: string | null;
    } | null;
    studentProfile: {
      firstName: string;
      lastName: string;
    } | null;
  };
  course: {
    id: string;
    title: string;
    subject: string;
    image?: string;
  } | null;
}

export interface SessionsResponse {
  sessions: Session[];
  summary: {
    total: number;
    upcoming: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
}

// Create a new session booking
export async function createSession(data: CreateSessionRequest): Promise<{ session: Session; message: string }> {
  return await apiFetch<{ session: Session; message: string }>('/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Get all sessions for the authenticated user
export async function getSessions(params?: { status?: string; type?: string }): Promise<SessionsResponse> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.set('status', params.status);
  if (params?.type) queryParams.set('type', params.type);
  const query = queryParams.toString();
  return await apiFetch<SessionsResponse>(`/sessions${query ? `?${query}` : ''}`);
}

// Get specific session details
export async function getSession(sessionId: string): Promise<{ session: Session }> {
  return await apiFetch<{ session: Session }>(`/sessions/${sessionId}`);
}

// Update session status
export async function updateSessionStatus(
  sessionId: string,
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
  reason?: string
): Promise<{ session: Session; message: string }> {
  return await apiFetch<{ session: Session; message: string }>(
    `/sessions/${sessionId}/status`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reason }),
    }
  );
}

// Cancel session
export async function cancelSession(sessionId: string, reason?: string): Promise<{ message: string; session: Session }> {
  return await apiFetch<{ message: string; session: Session }>(
    `/sessions/${sessionId}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: reason ? JSON.stringify({ reason }) : undefined,
    }
  );
}

// Get tutor availability
export async function getTutorAvailability(tutorId: string, date?: string): Promise<{
  tutorId: string;
  tutorName: string;
  dateRange: {
    start: string;
    end: string;
  };
  bookedSlots: Array<{
    start: string;
    end: string;
    duration: number;
  }>;
}> {
  const query = date ? `?date=${encodeURIComponent(date)}` : '';
  return await apiFetch(`/sessions/tutor/${tutorId}/availability${query}`);
}

// Helper to get user display name
export function getUserDisplayName(user: Session['tutor'] | Session['student']): string {
  if (user.tutorProfile) {
    return `${user.tutorProfile.firstName} ${user.tutorProfile.lastName}`;
  }
  if (user.studentProfile) {
    return `${user.studentProfile.firstName} ${user.studentProfile.lastName}`;
  }
  return user.email;
}

// Helper to get user avatar
export function getUserAvatar(user: Session['tutor'] | Session['student']): string | null {
  if (user.tutorProfile?.profilePicture) {
    return user.tutorProfile.profilePicture;
  }
  return null;
}
