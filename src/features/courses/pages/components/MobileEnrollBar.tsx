import React from 'react';
import { IconCheck } from '@tabler/icons-react';

interface MobileEnrollBarProps {
  price: number;
  isEnrolled: boolean;
  isEnrolling: boolean;
  onEnroll: () => void;
}

const MobileEnrollBar: React.FC<MobileEnrollBarProps> = ({ price, isEnrolled, isEnrolling, onEnroll }) => {
  if (isEnrolled) {
    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-600 to-emerald-600 border-t border-green-700 shadow-2xl z-40">
        <div className="px-3 sm:px-4 py-3 sm:py-3.5">
          <div className="flex items-center justify-center gap-2 text-white">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-sm flex items-center justify-center">
              <IconCheck size={16} className="sm:w-5 sm:h-5" />
            </div>
            <span className="font-bold text-xs sm:text-sm">You're enrolled in this course!</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40">
      <div className="px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Price Section */}
          <div className="flex-shrink-0">
            <p className="text-[9px] sm:text-[10px] text-gray-500 font-medium mb-0.5">Course Price</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900">${price}</p>
          </div>
          
          {/* Enroll Button */}
          <button 
            onClick={onEnroll}
            disabled={isEnrolling}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-sm font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {isEnrolling ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Enrolling...
              </span>
            ) : (
              'Enroll Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileEnrollBar;
