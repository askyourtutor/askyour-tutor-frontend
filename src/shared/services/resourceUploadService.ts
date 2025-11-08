import { apiFetch } from './api';

export interface UploadResourceResponse {
  success: boolean;
  filename: string;
  url: string;
  relativePath: string;
  size: number;
  sizeLabel: string;
  mimetype: string;
  originalName: string;
  type: 'pdf' | 'doc' | 'slides' | 'image' | 'zip' | 'other';
}

export interface Resource {
  id: string;
  title: string;
  type: string;
  sizeLabel?: string;
  url?: string;
  duration?: number;
  createdAt: string;
}

export interface AddResourceData {
  title: string;
  type: string;
  sizeLabel?: string;
  url?: string;
  duration?: number;
}

/**
 * Upload a resource file to the server
 */
export async function uploadResourceFile(file: File): Promise<UploadResourceResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiFetch('/uploads/resource', {
      method: 'POST',
      body: formData
    }) as UploadResourceResponse;

    return response;
  } catch (error) {
    console.error('Resource upload failed:', error);
    throw new Error('Failed to upload resource file');
  }
}

/**
 * Add a resource to a course
 */
export async function addResourceToCourse(
  courseId: string,
  resourceData: AddResourceData
): Promise<{ success: boolean; resource: Resource }> {
  try {
    const response = await apiFetch(`/tutor-dashboard/courses/${courseId}/resources`, {
      method: 'POST',
      body: JSON.stringify(resourceData)
    }) as { success: boolean; resource: Resource };

    return response;
  } catch (error) {
    console.error('Failed to add resource to course:', error);
    throw new Error('Failed to add resource to course');
  }
}

/**
 * Get all resources for a course
 * Uses the public student-accessible endpoint
 */
export async function getCourseResources(courseId: string): Promise<Resource[]> {
  try {
    const response = await apiFetch(`/courses/${courseId}/resources`) as {
      success: boolean;
      resources: Resource[];
    };

    return response.resources || [];
  } catch (error) {
    console.error('Failed to get course resources:', error);
    return [];
  }
}

/**
 * Delete a resource from a course
 */
export async function deleteResource(
  courseId: string,
  resourceId: string
): Promise<{ success: boolean }> {
  try {
    const response = await apiFetch(
      `/tutor-dashboard/courses/${courseId}/resources/${resourceId}`,
      {
        method: 'DELETE'
      }
    ) as { success: boolean };

    return response;
  } catch (error) {
    console.error('Failed to delete resource:', error);
    throw new Error('Failed to delete resource');
  }
}

/**
 * Upload and add resource to course in one operation
 */
export async function uploadAndAddResource(
  courseId: string,
  file: File,
  title?: string
): Promise<{ success: boolean; resource: Resource }> {
  // Step 1: Upload the file
  const uploadResult = await uploadResourceFile(file);

  // Step 2: Add the resource to the course
  const resourceData: AddResourceData = {
    title: title || uploadResult.originalName,
    type: uploadResult.type,
    sizeLabel: uploadResult.sizeLabel,
    url: uploadResult.url
  };

  const addResult = await addResourceToCourse(courseId, resourceData);

  return addResult;
}
