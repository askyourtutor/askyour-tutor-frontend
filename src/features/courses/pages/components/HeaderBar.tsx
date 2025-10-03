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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Left: Back button */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium px-3 py-2 rounded-sm hover:bg-gray-100 transition-all duration-200"
          >
            <IconArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Center: Course title (hidden on mobile) */}
          <div className="hidden lg:flex items-center gap-3 flex-1 max-w-xl mx-8">
            <div className="w-8 h-8 bg-blue-100 rounded-sm flex items-center justify-center flex-shrink-0">
              <IconBook size={18} className="text-blue-600" />
            </div>
            <h1 className="text-base font-semibold text-gray-900 truncate">{title}</h1>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              className={`p-2 rounded-sm transition-all duration-200 ${
                isSaved ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save course'}
            >
              <IconHeart size={20} className={isSaved ? 'fill-current' : ''} />
            </button>
            <button
              onClick={onShare}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-sm transition-all duration-200"
              title="Share course"
            >
              <IconShare3 size={20} />
            </button>
            {!isEnrolled && (
              <button
                onClick={onEnroll}
                disabled={isEnrolling}
                className="hidden sm:inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-sm font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}
            {isEnrolled && (
              <span className="hidden sm:inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-sm font-semibold ml-2">
                <IconCheck size={18} />
                Enrolled
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HeaderBar;
