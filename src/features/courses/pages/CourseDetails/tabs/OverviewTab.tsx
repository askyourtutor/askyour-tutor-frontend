import React from 'react';
import { IconBook, IconCheck, IconChevronDown, IconChevronUp, IconTrophy, IconUsers, IconFileText } from '@tabler/icons-react';
import type { ApiCourse, ApiLesson } from '../../../types/course.types';
import { getAvatarUrl } from '../../../../../shared/utils/url';

interface OverviewTabProps {
  course: ApiCourse;
  activeLesson?: ApiLesson;
  showFullDescription: boolean;
  onToggleDescription: () => void;
  renderStars: (rating: number) => React.ReactNode;
  onBookSession: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  course,
  activeLesson,
  showFullDescription,
  onToggleDescription,
  renderStars,
  onBookSession,
}) => {
  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-6">
      {/* Course Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 animate-fadeIn">
        {/* University/Institution */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-sm p-2 sm:p-3 md:p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-blue-600 rounded-sm flex items-center justify-center flex-shrink-0">
              <IconBook size={16} className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-xs text-blue-600 font-semibold mb-0.5 sm:mb-1">University</p>
              <h4 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 line-clamp-2">
                {course.university || '—'}
              </h4>
            </div>
          </div>
        </div>

        {/* Difficulty Level */}
        {course.difficulty && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-sm p-2 sm:p-3 md:p-4 border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-amber-600 rounded-sm flex items_center justify-center flex-shrink-0">
                <IconTrophy size={16} className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs text-amber-600 font-semibold mb-0.5 sm:mb-1">Difficulty</p>
                <h4 className="text-sm sm:text-base font-bold text-gray-900">{course.difficulty}</h4>
              </div>
            </div>
          </div>
        )}

        {/* Course Stats */}
        {typeof course.studentsCount === 'number' && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-sm p-2 sm:p-3 md:p-4 border border-green-200 sm:col-span-2 lg:col-span-1">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-green-600 rounded-sm flex items-center justify-center flex-shrink-0">
                <IconUsers size={16} className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs text-green-600 font-semibold mb-0.5 sm:mb-1">Students</p>
                <h4 className="text-sm sm:text-base font-bold text-gray-900">{course.studentsCount.toLocaleString()} Enrolled</h4>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="animate-fadeIn">
        <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 text-gray-900 flex items-center gap-1.5 sm:gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-sm flex items-center justify-center">
            <IconFileText size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-600" />
          </div>
          <span>About This Course</span>
        </h3>
        <div className="prose prose-gray max-w-none bg-gray-50 rounded-sm p-2.5 sm:p-3 md:p-4 border border-gray-200">
          <p className={`text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base ${!showFullDescription ? 'line-clamp-3 sm:line-clamp-4' : ''}`}>
            {activeLesson?.description || course.description}
          </p>
          {(activeLesson?.description || course.description).length > 200 && (
            <button
              onClick={onToggleDescription}
              className="inline-flex items-center gap-0.5 sm:gap-1 text-blue-600 hover:text-blue-700 mt-2 sm:mt-3 font-semibold text-[10px] sm:text-[11px] md:text-xs transition-all hover:gap-2"
            >
              {showFullDescription ? (
                <>
                  Show less <IconChevronUp size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                </>
              ) : (
                <>
                  Show more <IconChevronDown size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* What You'll Learn */}
      {course.learningOutcomes && course.learningOutcomes.length > 0 && (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-sm p-2.5 sm:p-3 md:p-4 animate-fadeIn">
        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-900 flex items-center gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-green-600 rounded-sm flex items-center justify-center">
            <IconCheck size={16} className="text-white" />
          </div>
          <span>What You'll Learn</span>
        </h3>
        <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-3">
          {course.learningOutcomes.map((item, i) => (
            <div key={i} className="flex items-start gap-1.5 sm:gap-2 md:gap-2.5 bg-white rounded-sm p-2 sm:p-2.5 border border-green-100 hover:border-green-300 transition-colors">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <IconCheck size={10} className="sm:w-3 sm:h-3 text-green-600" />
              </div>
              <span className="text-gray-700 text-[11px] sm:text-xs md:text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Requirements */}
      {course.requirements && course.requirements.length > 0 && (
      <div className="animate-fadeIn">
        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-900 flex items-center gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-purple-100 rounded-sm flex items-center justify-center">
            <IconTrophy size={14} className="sm:w-4 sm:h-4 text-purple-600" />
          </div>
          <span>Requirements</span>
        </h3>
        <div className="bg-purple-50 rounded-sm p-2.5 sm:p-3 md:p-4 border border-purple-200">
          <ul className="space-y-2 sm:space-y-2.5">
            {course.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 sm:gap-2.5 text-gray-700">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span className="text-[11px] sm:text-xs md:text-sm font-medium">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      )}

      {/* Available Tutors Section */}
      <div className="animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 flex items-center gap-1.5">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-indigo-100 rounded-sm flex items-center justify-center">
              <IconUsers size={14} className="sm:w-4 sm:h-4 text-indigo-600" />
            </div>
            <span>Available Tutors for This Course</span>
          </h3>
          <button className="text-[10px] sm:text-xs text-indigo-600 hover:text-indigo-700 font-semibold bg-indigo-50 px-2.5 py-1 rounded-sm hover:bg-indigo-100 transition-all border border-indigo-200 self-start sm:self-auto">
            View All Tutors
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
          {/* Tutor Card 1 - Primary Tutor */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-sm p-2.5 sm:p-3 border-2 border-blue-300 hover:border-blue-400 transition-all duration-200 hover:shadow-sm">
            <div className="flex items-start gap-2 sm:gap-2.5 mb-2">
              <img
                src={getAvatarUrl(course.tutor.avatar)}
                alt={course.tutor.name}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-sm object-cover border-2 border-blue-400"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate">{course.tutor.name}</h4>
                  <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[8px] sm:text-[9px] font-bold rounded-sm whitespace-nowrap">
                    TEACHING
                  </span>
                </div>
                <div className="flex items-center gap-0.5 mb-0.5">
                  {renderStars(course.rating)}
                  <span className="text-[10px] sm:text-xs text-gray-700 font-semibold ml-1">{course.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs text-gray-600">Starting from</span>
              <span className="text-base sm:text-lg font-bold text-blue-600">${course.price}<span className="text-xs">/hr</span></span>
            </div>
            <button onClick={onBookSession} className="w-full bg-blue-600 text-white py-1.5 rounded-sm font-semibold text-[11px] sm:text-xs hover:bg-blue-700 transition-colors">
              Book Session
            </button>
          </div>

          {/* Additional Tutors from API */}
          {course.additionalTutors?.map((tutor, idx) => (
            <div key={tutor.id || idx} className="bg-white rounded-sm p-2.5 sm:p-3 border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all duration-200">
              <div className="flex items-start gap-2 sm:gap-2.5 mb-2">
                <img
                  src={getAvatarUrl(tutor.avatar)}
                  alt={tutor.name}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-sm object-cover border-2 border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate">{tutor.name}</h4>
                    {tutor.verified && (
                      <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[8px] sm:text-[9px] font-bold rounded-sm whitespace-nowrap">VERIFIED</span>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 mb-0.5">
                    {renderStars(tutor.rating || 0)}
                    {typeof tutor.rating === 'number' && (
                      <span className="text-[10px] sm:text-xs text-gray-700 font-semibold ml-1">{tutor.rating.toFixed(1)}</span>
                    )}
                  </div>
                  {tutor.qualifications && (
                    <p className="text-[9px] sm:text-[10px] text-gray-600 line-clamp-1">{tutor.qualifications}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] sm:text-xs text-gray-600">Starting from</span>
                <span className="text-base sm:text-lg font-bold text-indigo-600">{tutor.rate ? `$${tutor.rate}` : '—'}<span className="text-xs">/hr</span></span>
              </div>
              <button className="w-full bg-indigo-600 text-white py-1.5 rounded-sm font-semibold text-[11px] sm:text-xs hover:bg-indigo-700 transition-colors">
                Book Session
              </button>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        {course.quickStats && (
          <div className="mt-2.5 p-2 sm:p-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-sm border border-indigo-200">
            <div className="flex items-center justify-around text-center">
              {typeof course.quickStats.totalTutors === 'number' && (
                <div className="flex-1">
                  <p className="text-lg sm:text-xl font-bold text-indigo-600">{course.quickStats.totalTutors}</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-600 font-medium">Total Tutors</p>
                </div>
              )}
              {typeof course.quickStats.totalTutors === 'number' && typeof course.quickStats.avgRating === 'number' && (
                <div className="w-px h-6 bg-indigo-200"></div>
              )}
              {typeof course.quickStats.avgRating === 'number' && (
                <div className="flex-1">
                  <p className="text-lg sm:text-xl font-bold text-green-600">{course.quickStats.avgRating}</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-600 font-medium">Avg Rating</p>
                </div>
              )}
              {typeof course.quickStats.avgRating === 'number' && course.quickStats.priceRange && (
                <div className="w-px h-6 bg-indigo-200"></div>
              )}
              {course.quickStats.priceRange && (
                <div className="flex-1">
                  <p className="text-lg sm:text-xl font-bold text-blue-600">{course.quickStats.priceRange}</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-600 font-medium">Price Range</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewTab;
