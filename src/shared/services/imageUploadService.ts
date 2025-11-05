import { getAccessToken } from './api';

// Use VITE_API_URL when provided; otherwise default to relative '/api' for best portability
const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || '/api';

export interface ImageUploadResponse {
  filename: string;
  url: string;
  size: number;
  mimetype: string;
  originalName: string;
}

export interface CourseImageUploadResponse {
  courseId: string;
  filename: string;
  url: string;
}

/**
 * Upload course image (temporary upload before course creation)
 */
export const uploadCourseImage = async (imageFile: File): Promise<ImageUploadResponse> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${API_BASE_URL}/uploads/course-image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to upload image' }));
    throw new Error(error.error || 'Failed to upload image');
  }

  return response.json();
};

/**
 * Upload course image for existing course (with courseId)
 */
export const uploadCourseImageForCourse = async (
  courseId: string,
  imageFile: File
): Promise<CourseImageUploadResponse> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${API_BASE_URL}/uploads/course-image/${courseId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to upload image' }));
    throw new Error(error.error || 'Failed to upload image');
  }

  return response.json();
};

export default {
  uploadCourseImage,
  uploadCourseImageForCourse,
};
