import React, { useEffect, useState } from 'react';
import { IconDownload, IconFileText, IconClock, IconLock, IconFile, IconPhoto, IconFileZip } from '@tabler/icons-react';
import type { CourseResource } from '../../../types/course.types';
import { getCourseResources } from '../../../../../shared/services/resourceUploadService';

interface LessonLike {
  id: string;
  title: string;
  duration?: number | null;
}

interface CourseLike {
  id: string;
  lessons: LessonLike[];
  resources?: CourseResource[] | null;
}

interface ResourcesTabProps {
  course: CourseLike;
  isEnrolled: boolean;
  isEnrolling: boolean;
  onEnroll: () => void;
  showEnrollmentFeatures?: boolean;
}

const ResourcesTab: React.FC<ResourcesTabProps> = ({ course, isEnrolled, isEnrolling, onEnroll, showEnrollmentFeatures = true }) => {
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(true);

  // Fetch resources from API when tab is mounted
  useEffect(() => {
    const loadResources = async () => {
      try {
        setIsLoadingResources(true);
        const data = await getCourseResources(course.id);
        // Map Resource type from API to CourseResource type
        const mappedResources: CourseResource[] = data.map(r => ({
          id: r.id,
          title: r.title,
          type: mapResourceType(r.type),
          sizeLabel: r.sizeLabel || null,
          url: r.url || null,
          duration: null
        }));
        setResources(mappedResources);
      } catch (error) {
        console.error('Failed to load resources:', error);
        setResources([]);
      } finally {
        setIsLoadingResources(false);
      }
    };

    loadResources();
  }, [course.id]);

  // Map backend resource type to frontend type
  const mapResourceType = (type: string): CourseResource['type'] => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('pdf')) return 'pdf';
    if (lowerType.includes('doc')) return 'doc';
    if (lowerType.includes('ppt') || lowerType.includes('slide')) return 'slides';
    if (lowerType.includes('image') || lowerType.includes('jpg') || lowerType.includes('png') || lowerType.includes('webp')) return 'image';
    if (lowerType.includes('zip') || lowerType.includes('archive')) return 'zip';
    return 'other';
  };

  // Use fetched resources from API
  const list = resources.length > 0
    ? resources
    : course.lessons.map((l) => ({ id: l.id, title: l.title, type: 'pdf' as const, sizeLabel: null, url: null, duration: l.duration ?? null }));

  // Function to get icon component based on resource type
  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return IconFile; // Using IconFile for PDF
      case 'image':
        return IconPhoto;
      case 'zip':
        return IconFileZip;
      case 'doc':
      case 'slides':
        return IconFile;
      default:
        return IconFileText;
    }
  };

  // Function to handle resource download
  const handleDownload = (resource: CourseResource) => {
    if (!resource.url) return;
    
    // Open resource URL in new tab or trigger download
    const link = document.createElement('a');
    link.href = resource.url;
    link.target = '_blank';
    link.download = resource.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded flex items-center justify-center">
            <IconDownload size={16} className="sm:w-[18px] sm:h-[18px] text-blue-600" />
          </div>
          <span className="text-sm sm:text-base">Resources</span>
        </h3>
        {isEnrolled && resources.length > 0 && (
          <button className="text-[10px] sm:text-xs text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded hover:bg-blue-100 transition-all border border-blue-200">
            Download All
          </button>
        )}
      </div>

      {showEnrollmentFeatures && !isEnrolled && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded p-3 sm:p-4 text-center">
          <IconLock size={32} className="sm:w-10 sm:h-10 mx-auto text-amber-600 mb-2" />
          <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1.5">Resources Locked</h4>
          <p className="text-xs text-gray-700 mb-3 max-w-md mx-auto">
            Enroll to access all downloadable resources including PDFs, worksheets, and study materials.
          </p>
          <button 
            onClick={onEnroll}
            disabled={isEnrolling}
            className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded font-semibold text-xs sm:text-sm hover:bg-blue-700 transition-all shadow hover:shadow-md disabled:opacity-50"
          >
            {isEnrolling ? 'Enrolling...' : 'Enroll to Access'}
          </button>
        </div>
      )}

      {/* Show resources to enrolled students OR tutors/admins (showEnrollmentFeatures === false) */}
      {(isEnrolled || !showEnrollmentFeatures) && (
        <>
          {isLoadingResources ? (
            <div className="text-center py-6">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-xs text-gray-600">Loading resources...</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded border border-gray-200">
              <IconFileText size={36} className="sm:w-10 sm:h-10 mx-auto text-gray-400 mb-2" />
              <h4 className="font-semibold text-gray-700 text-sm mb-1">No Resources Available</h4>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                This course doesn't have any downloadable resources yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {list.map((r) => {
                const ResourceIcon = getResourceIcon(r.type);
                return (
                  <div 
                    key={r.id} 
                    className="flex items-center justify-between p-2.5 sm:p-3 border border-gray-200 rounded hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all group cursor-pointer"
                    onClick={() => r.url && handleDownload(r)}
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center text-white shadow group-hover:shadow-lg transition-all group-hover:scale-105 flex-shrink-0">
                        <ResourceIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-0.5 text-xs sm:text-sm line-clamp-1">{r.title}</h4>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-600 flex-wrap">
                          {r.duration && (
                            <span className="flex items-center gap-0.5">
                              <IconClock size={11} className="sm:w-3 sm:h-3" />
                              {r.duration}m
                            </span>
                          )}
                          <span className="font-medium">{(r.type || 'file').toUpperCase()} {r.sizeLabel ? `• ${r.sizeLabel}` : ''}</span>
                        </div>
                      </div>
                    </div>
                    {r.url && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(r);
                        }}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded bg-blue-50 hover:bg-blue-100 transition-all border border-blue-200 text-[10px] sm:text-xs flex-shrink-0"
                      >
                        <IconDownload size={12} className="sm:w-[14px] sm:h-[14px]" />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResourcesTab;
