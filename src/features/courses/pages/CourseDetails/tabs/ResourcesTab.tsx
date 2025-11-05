import React from 'react';
import { IconDownload, IconFileText, IconClock, IconLock } from '@tabler/icons-react';
import type { CourseResource } from '../../../types/course.types';

interface LessonLike {
  id: string;
  title: string;
  duration?: number | null;
}

interface CourseLike {
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
  const list = (course.resources && course.resources.length > 0)
    ? course.resources
    : course.lessons.map((l) => ({ id: l.id, title: l.title, type: 'pdf' as const, sizeLabel: null, url: null, duration: l.duration ?? null }));

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-sm flex items-center justify-center">
            <IconDownload size={18} className="sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <span>Downloadable Resources</span>
        </h3>
        {isEnrolled && (
          <button className="text-[10px] sm:text-xs md:text-sm text-blue-600 hover:text-blue-700 font-bold bg-blue-50 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-sm hover:bg-blue-100 transition-all border border-blue-200 self-start sm:self-auto">
            Download All
          </button>
        )}
      </div>

      {showEnrollmentFeatures && !isEnrolled && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-sm p-4 sm:p-5 text-center">
          <IconLock size={48} className="mx-auto text-amber-600 mb-3" />
          <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-2">Resources Locked</h4>
          <p className="text-xs sm:text-sm text-gray-700 mb-4 max-w-md mx-auto">
            Enroll in this course to access all downloadable resources including PDFs, worksheets, and study materials.
          </p>
          <button 
            onClick={onEnroll}
            disabled={isEnrolling}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-sm font-bold text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isEnrolling ? 'Enrolling...' : 'Enroll to Access Resources'}
          </button>
        </div>
      )}

      {isEnrolled && (
        <div className="grid gap-2.5 sm:gap-3">
          {list.slice(0, 10).map((r) => (
            <div 
              key={r.id} 
              className="flex items-center justify-between p-3 sm:p-4 md:p-5 border border-gray-200 rounded-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-sm flex items-center justify-center text-white shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 flex-shrink-0">
                  <IconFileText size={18} className="sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base line-clamp-1">{r.title}</h4>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 flex-wrap">
                    {r.duration && (
                      <span className="flex items-center gap-1">
                        <IconClock size={12} className="sm:w-[14px] sm:h-[14px]" />
                        {r.duration}m
                      </span>
                    )}
                    <span className="font-medium">{(r.type || 'file').toUpperCase()} {r.sizeLabel ? `• ${r.sizeLabel}` : ''}</span>
                  </div>
                </div>
              </div>
              <button className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-blue-600 hover:text-blue-700 font-bold px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 rounded-sm bg-blue-50 hover:bg-blue-100 transition-all duration-200 border border-blue-200 text-[10px] sm:text-xs md:text-sm flex-shrink-0">
                <IconDownload size={14} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourcesTab;
