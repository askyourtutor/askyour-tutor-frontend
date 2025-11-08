import React from 'react';
import { IconArrowLeft, IconBook, IconCheck, IconShare3 } from '@tabler/icons-react';

interface HeaderBarProps {
  title: string;
  isSaved: boolean;
  isEnrolled: boolean;
  isEnrolling: boolean;
  onBack: () => void;
  onSave: () => void;
  onShare: () => void;
  onEnroll: () => void;
  showEnrollmentFeatures?: boolean;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  isEnrolled,
  onBack,
  onShare,
  showEnrollmentFeatures = true,
}) => {
  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/80 sticky top-0 z-50 shadow-sm">
      <div className="mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11 xs:h-12 sm:h-14">
          {/* Left: Back button */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 xs:gap-1.5 text-gray-600 hover:text-gray-900 font-medium px-1.5 xs:px-2 py-1 xs:py-1.5 rounded-md hover:bg-gray-100 transition-all duration-200 text-xs xs:text-sm flex-shrink-0"
          >
            <IconArrowLeft size={14} className="xs:w-4 xs:h-4" />
            <span className="hidden xs:inline">Back</span>
          </button>

          {/* Center: Course title - Responsive layout */}
          <div className="flex items-center gap-1.5 xs:gap-2 flex-1 min-w-0 mx-2 xs:mx-3 sm:mx-4 md:mx-6">
            <div className="w-5 h-5 xs:w-6 xs:h-6 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
              <IconBook size={12} className="xs:w-3.5 xs:h-3.5 text-blue-600" />
            </div>
            <h1 className="text-xs xs:text-sm sm:text-base font-semibold text-gray-900 truncate leading-tight">
              {title}
            </h1>
          </div>

          {/* Right: Actions - Responsive spacing and sizing */}
          <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 flex-shrink-0">
            {/* Enrolled status badge - Only for enrolled users */}
            {showEnrollmentFeatures && isEnrolled && (
              <div className="inline-flex items-center gap-1 xs:gap-1.5 bg-green-50 text-green-700 border border-green-200 px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-md font-medium text-xs xs:text-sm mr-1">
                <IconCheck size={14} className="xs:w-4 xs:h-4 stroke-2" />
                <span>Enrolled</span>
              </div>
            )}

            {/* Share button */}
            <button
              onClick={onShare}
              className="p-1 xs:p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-all duration-200"
              title="Share course"
            >
              <IconShare3 size={14} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Enroll/Enrolled button removed - enrollment happens via course content */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HeaderBar;
