// Use VITE_API_URL when provided; otherwise default to relative '/api'
const API_URL: string = (import.meta.env.VITE_API_URL as string) || '/api';

// Import token access from api.ts
import { getAccessToken } from './api';

export interface VideoUploadProgress {
  lessonId: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  message?: string;
}

export interface VideoUploadResponse {
  success: boolean;
  message: string;
  lesson: {
    id: string;
    title: string;
    uploadStatus: string;
    processingStatus: string | null;
    videoUrl: string | null;
    thumbnailUrl: string | null;
    bunnyVideoId: string | null;
  };
}

export interface VideoStatusResponse {
  success: boolean;
  lesson: {
    id: string;
    uploadStatus: string;
    processingStatus: string | null;
    videoUrl: string | null;
    thumbnailUrl: string | null;
    bunnyVideoId: string | null;
    fileSize: number | null;
  };
}

class VideoUploadService {
  private uploadProgressCallbacks: Map<string, (progress: VideoUploadProgress) => void> = new Map();

  /**
   * Upload video file for a lesson
   */
  async uploadVideo(
    lessonId: string,
    videoFile: File,
    onProgress?: (progress: VideoUploadProgress) => void
  ): Promise<VideoUploadResponse> {
    const formData = new FormData();
    formData.append('video', videoFile);

    if (onProgress) {
      this.uploadProgressCallbacks.set(lessonId, onProgress);
    }

    try {
      const token = getAccessToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/uploads/video/lesson/${lessonId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Upload failed with status ${response.status}`);
      }

      const data: VideoUploadResponse = await response.json();

      // Notify completion
      if (onProgress) {
        onProgress({
          lessonId,
          progress: 100,
          status: 'completed',
          message: data.message
        });
        this.uploadProgressCallbacks.delete(lessonId);
      }

      return data;
    } catch (error) {
      // Notify failure
      if (onProgress) {
        onProgress({
          lessonId,
          progress: 0,
          status: 'failed',
          message: error instanceof Error ? error.message : 'Upload failed'
        });
        this.uploadProgressCallbacks.delete(lessonId);
      }
      throw error;
    }
  }

  /**
   * Upload video with progress tracking using XMLHttpRequest
   */
  uploadVideoWithProgress(
    lessonId: string,
    videoFile: File,
    onProgress: (progress: VideoUploadProgress) => void
  ): Promise<VideoUploadResponse> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('video', videoFile);

      const xhr = new XMLHttpRequest();
      const token = getAccessToken();

      if (!token) {
        reject(new Error('Authentication required'));
        return;
      }

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress({
            lessonId,
            progress: percentComplete,
            status: 'uploading',
            message: `Uploading... ${percentComplete}%`
          });
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data: VideoUploadResponse = JSON.parse(xhr.responseText);
            onProgress({
              lessonId,
              progress: 100,
              status: 'completed',
              message: data.message
            });
            resolve(data);
          } catch {
            onProgress({
              lessonId,
              progress: 0,
              status: 'failed',
              message: 'Failed to parse response'
            });
            reject(new Error('Failed to parse response'));
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            const errorMsg = errorData.error || errorData.message || `Upload failed with status ${xhr.status}`;
            onProgress({
              lessonId,
              progress: 0,
              status: 'failed',
              message: errorMsg
            });
            reject(new Error(errorMsg));
          } catch {
            onProgress({
              lessonId,
              progress: 0,
              status: 'failed',
              message: `Upload failed with status ${xhr.status}`
            });
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        onProgress({
          lessonId,
          progress: 0,
          status: 'failed',
          message: 'Network error occurred'
        });
        reject(new Error('Network error occurred'));
      });

      // Handle abort
      xhr.addEventListener('abort', () => {
        onProgress({
          lessonId,
          progress: 0,
          status: 'failed',
          message: 'Upload cancelled'
        });
        reject(new Error('Upload cancelled'));
      });

      // Send request
      xhr.open('POST', `${API_URL}/uploads/video/lesson/${lessonId}`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    });
  }

  /**
   * Get video upload/processing status
   */
  async getVideoStatus(lessonId: string): Promise<VideoStatusResponse> {
    const token = getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/uploads/video/lesson/${lessonId}/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || 'Failed to get video status');
    }

    return response.json();
  }

  /**
   * Poll video status until processing is complete
   */
  async pollVideoStatus(
    lessonId: string,
    onStatusUpdate?: (status: VideoStatusResponse) => void,
    maxAttempts: number = 60,
    intervalMs: number = 5000
  ): Promise<VideoStatusResponse> {
    let attempts = 0;

    const poll = async (): Promise<VideoStatusResponse> => {
      const status = await this.getVideoStatus(lessonId);
      
      if (onStatusUpdate) {
        onStatusUpdate(status);
      }

      // Check if processing is complete
      if (
        status.lesson.processingStatus === 'completed' ||
        status.lesson.processingStatus === 'failed' ||
        status.lesson.uploadStatus === 'failed'
      ) {
        return status;
      }

      // Check max attempts
      attempts++;
      if (attempts >= maxAttempts) {
        throw new Error('Video processing timeout - please check status later');
      }

      // Wait and poll again
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      return poll();
    };

    return poll();
  }

  /**
   * Delete a video
   */
  async deleteVideo(lessonId: string): Promise<void> {
    const token = getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/uploads/video/lesson/${lessonId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || 'Failed to delete video');
    }
  }

  /**
   * Validate video file before upload
   */
  validateVideoFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    const validTypes = [
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-matroska',
      'video/webm'
    ];

    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload MP4, MOV, AVI, MKV, or WEBM files.'
      };
    }

    // Check file size (500MB max)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size exceeds 500MB limit.'
      };
    }

    return { valid: true };
  }
}

export const videoUploadService = new VideoUploadService();
export default videoUploadService;
