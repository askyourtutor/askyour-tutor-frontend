import React from 'react';
import { IconStar, IconChevronDown } from '@tabler/icons-react';
import type { ApiCourse } from '../../../types/course.types';

interface ReviewsTabProps {
  course: ApiCourse;
  renderStars: (rating: number) => React.ReactNode;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ course, renderStars }) => {
  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 animate-fadeIn">
      {/* Reviews Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 md:gap-0">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-amber-100 rounded-sm flex items-center justify-center">
              <IconStar size={16} className="sm:w-[18px] sm:h-[18px] md:w-6 md:h-6 text-amber-600" />
            </div>
            <span>Student Reviews</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">Based on 234 reviews</p>
        </div>
        <button className="text-[10px] sm:text-xs md:text-sm text-blue-600 hover:text-blue-700 font-bold bg-blue-50 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-sm hover:bg-blue-100 transition-all border border-blue-200 self-start sm:self-auto">
          Write a Review
        </button>
      </div>

      {/* Rating Summary */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-sm p-3 sm:p-4 md:p-6 border border-amber-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {/* Overall Rating */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-amber-600 mb-1.5 sm:mb-2">{course.rating.toFixed(1)}</div>
            <div className="flex items-center gap-1 mb-2">{renderStars(course.rating)}</div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Overall Course Rating</p>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-1.5 sm:space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const percentage = rating === 5 ? 75 : rating === 4 ? 18 : rating === 3 ? 5 : rating === 2 ? 2 : 0;
              return (
                <div key={rating} className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-0.5 sm:gap-1 w-12 sm:w-14 md:w-16">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">{rating}</span>
                    <IconStar size={12} className="sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-500" />
                  </div>
                  <div className="flex-1 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-xs text-gray-600 font-medium w-8 text-right">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Load More Button */}
      <div className="text-center pt-3 sm:pt-4">
        <button className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-sm font-bold text-[11px] sm:text-xs md:text-sm hover:from-gray-200 hover:to-gray-300 transition-all border border-gray-300 shadow-sm hover:shadow-md">
          <span>Load More Reviews</span>
          <IconChevronDown size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
};

export default ReviewsTab;
