import React from 'react';
import { IconBook, IconClock, IconLock, IconPlayerPlay } from '@tabler/icons-react';

interface Lesson {
  id: string;
  title: string;
  description?: string | null;
  duration?: number | null;
  isPublished: boolean;
}

interface CourseLike {
  lessons: Lesson[];
}

interface SyllabusTabProps {
  course: CourseLike;
  isEnrolled: boolean;
  isEnrolling: boolean;
  onEnroll: () => void;
  onSelectLesson: (lessonId: string) => void;
  onSwitchToOverview: () => void;
}

const SyllabusTab: React.FC<SyllabusTabProps> = ({ course, isEnrolled, isEnrolling, onEnroll, onSelectLesson, onSwitchToOverview }) => {
  return (
    <div className="space-y-3 sm:space-y-4 animate-fadeIn">
      {/* Syllabus Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-blue-100 rounded-sm flex items-center justify-center">
            <IconBook size={16} className="sm:w-[18px] sm:h-[18px] md:w-6 md:h-6 text-blue-600" />
          </div>
          <span>Course Syllabus</span>
        </h3>
        <span className="text-[10px] sm:text-xs md:text-sm text-gray-600 bg-blue-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-sm font-semibold border border-blue-200">
          {course.lessons.length} lessons
        </span>
      </div>

      {/* Enrollment Notice for Locked Content */}
      {!isEnrolled && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-sm p-3 sm:p-4 mb-3">
          <div className="flex items-start gap-2 sm:gap-3">
            <IconLock size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-gray-900 text-xs sm:text-sm mb-1">Content Locked</h4>
              <p className="text-[10px] sm:text-xs text-gray-700 mb-2">
                Enroll in this course to unlock all {course.lessons.length} lessons and start learning.
              </p>
              <button 
                onClick={onEnroll}
                disabled={isEnrolling}
                className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-sm font-bold text-[10px] sm:text-xs hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lessons List */}
      <div className="space-y-2 sm:space-y-2.5">
        {course.lessons.map((lesson, index) => {
          const isLocked = !isEnrolled && index > 0; // First lesson preview, rest locked
          const isPreview = !isEnrolled && index === 0;
          
          return (
            <div
              key={lesson.id}
              className={`bg-white border rounded-sm transition-all duration-200 overflow-hidden ${
                isLocked 
                  ? 'border-gray-200 opacity-75' 
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-4">
                {/* Lesson Number */}
                <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-sm flex items-center justify-center flex-shrink-0 ${
                  isLocked ? 'bg-gray-100' : 'bg-blue-100'
                }`}>
                  {isLocked ? (
                    <IconLock size={14} className="sm:w-4 sm:h-4 text-gray-400" />
                  ) : (
                    <span className="text-xs sm:text-sm font-bold text-blue-600">{index + 1}</span>
                  )}
                </div>

                {/* Lesson Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-bold text-xs sm:text-sm md:text-base line-clamp-1 ${
                      isLocked ? 'text-gray-500' : 'text-gray-900'
                    }`}>
                      {lesson.title}
                    </h4>
                    {isPreview && (
                      <span className="px-1.5 py-0.5 rounded-sm bg-green-100 text-green-700 font-semibold text-[9px] sm:text-[10px]">
                        FREE PREVIEW
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-gray-600">
                    {lesson.duration && (
                      <span className="flex items-center gap-1">
                        <IconClock size={12} className="sm:w-3.5 sm:h-3.5" />
                        {lesson.duration}m
                      </span>
                    )}
                    {isLocked && (
                      <span className="px-1.5 py-0.5 rounded-sm bg-gray-100 text-gray-600 font-semibold">
                        Locked
                      </span>
                    )}
                    {!isLocked && lesson.isPublished && (
                      <span className="px-1.5 py-0.5 rounded-sm bg-green-100 text-green-700 font-semibold">
                        Available
                      </span>
                    )}
                    {!isLocked && !lesson.isPublished && (
                      <span className="px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-700 font-semibold">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  disabled={isLocked}
                  onClick={() => {
                    if (!isLocked) {
                      onSelectLesson(lesson.id);
                      onSwitchToOverview();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-sm transition-colors flex-shrink-0 ${
                    isLocked 
                      ? 'bg-gray-200 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                  }`}
                >
                  {isLocked ? (
                    <IconLock size={14} className="sm:w-4 sm:h-4 text-gray-400" />
                  ) : (
                    <IconPlayerPlay size={14} className="sm:w-4 sm:h-4 text-white" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enrollment CTA at Bottom */}
      {!isEnrolled && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-sm p-4 sm:p-5 text-center">
          <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-2">Ready to start learning?</h4>
          <p className="text-xs sm:text-sm text-gray-700 mb-3">
            Enroll now to unlock all lessons and get lifetime access to this course.
          </p>
          <button 
            onClick={onEnroll}
            disabled={isEnrolling}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-sm font-bold text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isEnrolling ? 'Enrolling...' : 'Enroll in This Course'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SyllabusTab;
