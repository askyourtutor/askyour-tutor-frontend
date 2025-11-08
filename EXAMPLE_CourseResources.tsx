// Example: Course Resources Management Component
// Location: client/src/features/courses/components/CourseResources.tsx

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/shared/services/api';

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'slides' | 'image' | 'zip' | 'video' | 'link' | 'other';
  sizeLabel?: string;
  url?: string;
  duration?: number;
  createdAt: string;
}

interface CourseResourcesProps {
  courseId: string;
}

export const CourseResources: React.FC<CourseResourcesProps> = ({ courseId }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [resourceType, setResourceType] = useState<'file' | 'link'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [linkType, setLinkType] = useState<'link' | 'video'>('link');

  // Load resources
  useEffect(() => {
    loadResources();
  }, [courseId]);

  const loadResources = async () => {
    try {
      setIsLoading(true);
      const response = await apiFetch(`/tutor-dashboard/courses/${courseId}/resources`) as {
        success: boolean;
        resources: Resource[];
      };
      setResources(response.resources || []);
    } catch (err) {
      setError('Failed to load resources');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await apiFetch('/uploads/resource', {
        method: 'POST',
        body: formData
      }) as {
        success: boolean;
        url: string;
        sizeLabel: string;
        type: string;
        originalName: string;
      };

      // Add resource to course
      await apiFetch(`/tutor-dashboard/courses/${courseId}/resources`, {
        method: 'POST',
        body: JSON.stringify({
          title: title || uploadResponse.originalName,
          type: uploadResponse.type,
          sizeLabel: uploadResponse.sizeLabel,
          url: uploadResponse.url
        })
      });

      // Reload resources
      await loadResources();

      // Reset form
      setFile(null);
      setTitle('');
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to upload resource');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddLink = async () => {
    if (!url || !title) {
      setError('Title and URL are required');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      await apiFetch(`/tutor-dashboard/courses/${courseId}/resources`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          type: linkType,
          url
        })
      });

      // Reload resources
      await loadResources();

      // Reset form
      setTitle('');
      setUrl('');
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add link');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (resourceId: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      await apiFetch(`/tutor-dashboard/courses/${courseId}/resources/${resourceId}`, {
        method: 'DELETE'
      });

      // Reload resources
      await loadResources();
    } catch (err) {
      setError('Failed to delete resource');
      console.error(err);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'doc': return '📝';
      case 'slides': return '📊';
      case 'image': return '🖼️';
      case 'zip': return '🗜️';
      case 'video': return '🎥';
      case 'link': return '🔗';
      default: return '📎';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading resources...</div>;
  }

  return (
    <div className="course-resources">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Course Resources</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showAddForm ? 'Cancel' : '+ Add Resource'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Add Resource Form */}
      {showAddForm && (
        <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Add New Resource</h3>

          {/* Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Resource Type</label>
            <div className="flex gap-4">
              <button
                onClick={() => setResourceType('file')}
                className={`px-4 py-2 rounded-lg ${
                  resourceType === 'file'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                📁 Upload File
              </button>
              <button
                onClick={() => setResourceType('link')}
                className={`px-4 py-2 rounded-lg ${
                  resourceType === 'link'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                🔗 Add Link
              </button>
            </div>
          </div>

          {/* File Upload */}
          {resourceType === 'file' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Select File
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.txt,.jpg,.jpeg,.png,.webp,.gif"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Max 50 MB. Supported: PDF, DOC, PPT, XLS, ZIP, TXT, Images
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Title (optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Leave empty to use filename"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <button
                onClick={handleFileUpload}
                disabled={!file || isUploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Upload File'}
              </button>
            </>
          )}

          {/* Link/Video */}
          {resourceType === 'link' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Link Type</label>
                <select
                  value={linkType}
                  onChange={(e) => setLinkType(e.target.value as 'link' | 'video')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="link">External Link</option>
                  <option value="video">Video Link (YouTube, etc.)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Resource title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">URL *</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/resource"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <button
                onClick={handleAddLink}
                disabled={!url || !title || isUploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Adding...' : 'Add Link'}
              </button>
            </>
          )}
        </div>
      )}

      {/* Resources List */}
      {resources.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No resources added yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{getResourceIcon(resource.type)}</span>
                <div>
                  <h4 className="font-semibold text-gray-900">{resource.title}</h4>
                  <div className="flex gap-3 text-sm text-gray-500">
                    <span className="capitalize">{resource.type}</span>
                    {resource.sizeLabel && <span>{resource.sizeLabel}</span>}
                    {resource.duration && (
                      <span>{Math.floor(resource.duration / 60)} min</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    Open
                  </a>
                )}
                <button
                  onClick={() => handleDelete(resource.id)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseResources;
