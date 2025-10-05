import React from 'react';
import { IconArrowLeft, IconBook, IconCheck, IconHeart, IconShare3 } from '@tabler/icons-react';

interface HeaderBarProps {
  title: string;
  isSaved: boolean;
  isEnrolled: boolean;
  isEnrolling: boolean;
  onBack: () => void;
  onSave: () => void;
  onShare: () => void;
  onEnroll: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  isSaved,
  isEnrolled,
  isEnrolling,
  onBack,
  onSave,
  onShare,
  onEnroll,
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
            {/* Save button */}
            <button
              onClick={onSave}
              className={`p-1 xs:p-1.5 rounded-md transition-all duration-200 ${
                isSaved 
                  ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                  : 'text-gray-500 hover:text-red-600 hover:bg-gray-100'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save course'}
            >
              <IconHeart size={14} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5" strokeWidth={isSaved ? 0 : 2} fill={isSaved ? 'currentColor' : 'none'} />
            </button>

            {/* Share button */}
            <button
              onClick={onShare}
              className="p-1 xs:p-1.5 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-all duration-200"
              title="Share course"
            >
              <IconShare3 size={14} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Enroll/Enrolled button - Responsive text and spacing */}
            {!isEnrolled && (
              <button
                onClick={onEnroll}
                disabled={isEnrolling}
                className="inline-flex items-center gap-1 xs:gap-1.5 bg-blue-600 text-white px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-md font-medium hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md ml-0.5 xs:ml-1 disabled:opacity-50 disabled:cursor-not-allowed text-xs xs:text-sm"
              >
                <span className="hidden xs:inline">
                  {isEnrolling ? 'Enrolling...' : 'Enroll'}
                </span>
                <span className="xs:hidden">
                  {isEnrolling ? '...' : 'Join'}
                </span>
              </button>
            )}
            {isEnrolled && (
              <div className="inline-flex items-center gap-1 xs:gap-1.5 bg-green-50 text-green-700 border border-green-200 px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-md font-medium ml-0.5 xs:ml-1 text-xs xs:text-sm">
                <IconCheck size={14} className="xs:w-4 xs:h-4 stroke-2" />
                <span>Enrolled</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HeaderBar;
