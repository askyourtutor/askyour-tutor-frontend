import { apiFetch } from '../../../shared/services/api';

export interface VideoRoom {
  roomUrl: string;
  room: {
    id: string;
    name: string;
    url: string;
    config?: {
      max_participants?: number;
      enable_screenshare?: boolean;
      enable_chat?: boolean;
    };
  };
  token?: string;
  message?: string;
}

/**
 * Create a video room for a session (Tutor/Admin only)
 */
export async function createVideoRoom(sessionId: string): Promise<VideoRoom> {
  return apiFetch<VideoRoom>(`/video-sessions/${sessionId}/room`, {
    method: 'POST',
  });
}

/**
 * Join a video session (get access token)
 */
export async function joinVideoSession(sessionId: string): Promise<VideoRoom> {
  return apiFetch<VideoRoom>(`/video-sessions/${sessionId}/join`, {
    method: 'POST',
  });
}

/**
 * End a video session and delete the room
 */
export async function endVideoSession(sessionId: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/video-sessions/${sessionId}/end`, {
    method: 'DELETE',
  });
}

/**
 * Get recording information for a session
 */
export async function getSessionRecordings(sessionId: string): Promise<unknown> {
  return apiFetch<unknown>(`/video-sessions/${sessionId}/recordings`);
}
