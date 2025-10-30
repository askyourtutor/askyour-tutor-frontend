import React from 'react';
import { IconBook, IconClock, IconLock, IconPlayerPlay, IconPlayerPause } from '@tabler/icons-react';

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

interface SidebarSyllabusProps {
  course: CourseLike;
  activeLessonId: string | null;
  isEnrolled: boolean;
  isEnrolling: boolean;
  onEnroll: () => void;
  onSelectLesson: (lessonId: string) => void;
  isVideoPlaying: boolean;
  onTogglePlayPause: () => void;
}

const SidebarSyllabus: React.FC<SidebarSyllabusProps> = ({
  course,
  activeLessonId,
  isEnrolled,
  isEnrolling,
  onEnroll,
  onSelectLesson,
  isVideoPlaying,
  onTogglePlayPause,
}) => {
  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden lg:h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
            <div className="w-7 h-7 bg-blue-600 rounded-sm flex items-center justify-center">
              <IconBook size={14} className="text-white" />
            </div>
            <span>Course Syllabus</span>
          </h3>
          <span className="text-xs text-gray-600 bg-white px-2.5 py-1 rounded-sm font-semibold border border-gray-200">
            {course.lessons.length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex-1 overflow-hidden">
        {/* Enrollment Notice */}
        {!isEnrolled && (
          <div className="mb-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-amber-100 rounded-sm flex items-center justify-center flex-shrink-0">
                <IconLock size={12} className="text-amber-600" />
              </div>
              <p className="text-xs font-bold text-gray-900">Content Locked</p>
            </div>
            <p className="text-[10px] text-gray-700 mb-2.5 leading-relaxed">
              Enroll to unlock all {course.lessons.length} lessons and start learning
            </p>
            <button 
              onClick={onEnroll}
              disabled={isEnrolling}
              className="w-full bg-blue-600 text-white px-3 py-2 rounded-sm font-bold text-xs hover:bg-blue-700 transition-all disabled:opacity-50 shadow-sm"
            >
              {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
            </button>
          </div>
        )}

        {/* Lessons List */}
        <div className="space-y-2 lg:h-full lg:overflow-y-auto pr-2 custom-scrollbar">
          {course.lessons.map((l, index) => {
            const isActive = activeLessonId === l.id;
            const isLocked = !isEnrolled && index > 0;
            const isPreview = !isEnrolled && index === 0;

            return (
              <button
                key={l.id}
                onClick={() => {
                  if (!isLocked) {
                    if (isActive && isVideoPlaying) {
                      // If current lesson is playing, pause it
                      onTogglePlayPause();
                    } else if (isActive && !isVideoPlaying) {
                      // If current lesson is paused, resume it
                      onTogglePlayPause();
                    } else {
                      // If different lesson, select and play it
                      onSelectLesson(l.id);
                    }
                  }
                }}
                disabled={isLocked}
                className={`w-full text-left p-2.5 rounded-sm border transition-all duration-200 group ${
                  isLocked
                    ? 'border-gray-200 bg-gray-50 opacity-70 cursor-not-allowed'
                    : isActive 
                      ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:bg-gray-50 hover:border-blue-300 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {/* Number/Lock Badge */}
                  <div className={`w-8 h-8 rounded-sm flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                    isLocked
                      ? 'bg-gray-200 text-gray-400'
                      : isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-600'
                  }`}>
                    {isLocked ? <IconLock size={14} /> : index + 1}
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-bold text-xs line-clamp-2 ${
                        isLocked ? 'text-gray-500' : isActive ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {l.title}
                      </h4>
                      {isPreview && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-green-100 text-green-700 font-bold whitespace-nowrap flex-shrink-0">
                          FREE
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      {l.duration && (
                        <span className="text-[10px] text-gray-600 flex items-center gap-1 font-medium">
                          <IconClock size={10} className="text-gray-500" />
                          {l.duration}m
                        </span>
                      )}
                      {isLocked ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-gray-200 text-gray-600 font-semibold">
                          Locked
                        </span>
                      ) : l.isPublished ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-green-100 text-green-700 font-semibold">
                          Available
                        </span>
                      ) : (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-700 font-semibold">
                          Soon
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Play Icon for Active */}
                  {isActive && !isLocked && (
                    <div className="w-7 h-7 bg-blue-600 rounded-sm flex items-center justify-center flex-shrink-0">
                      {isVideoPlaying ? (
                        <IconPlayerPause size={12} className="text-white" />
                      ) : (
                        <IconPlayerPlay size={12} className="text-white ml-0.5" />
                      )}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SidebarSyllabus;
