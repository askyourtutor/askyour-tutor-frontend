import { IconCamera, IconUser, IconRosetteDiscountCheckFilled } from '@tabler/icons-react';
import type { ChangeEvent } from 'react';

interface ProfileHeroProps {
  profileImage: string | null;
  onImageUpload?: (event: ChangeEvent<HTMLInputElement>) => void;
  fullName: string;
  professionalTitle: string;
  profileCompletion: number;
  subjects: string[];
  imageError?: string | null;
  showImageUpload?: boolean;
  isVerified?: boolean;
}

const completionClamp = (value: number) => Math.min(100, Math.max(0, value));

export const ProfileHero = ({
  profileImage,
  onImageUpload,
  fullName,
  professionalTitle,
  profileCompletion,
  subjects,
  imageError,
  showImageUpload = false,
  isVerified = false
}: ProfileHeroProps) => {
  const completionValue = completionClamp(profileCompletion);

  return (
    <div className="bg-white shadow-lg overflow-hidden mb-6 sm:mb-8 lg:mb-12 rounded-lg mx-2 sm:mx-4 lg:mx-0">
      {/* Banner Section */}
      <div
        className="h-24 xs:h-32 sm:h-36 md:h-40 lg:h-45 relative"
        style={{
          backgroundImage: 'url(/assets/img/profile/profileBanner.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Profile Content */}
      <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-6 relative">
        {/* Mobile Layout */}
        <div className="block lg:hidden">
          {/* Profile Image - Centered on mobile */}
          <div className="flex justify-center -mt-8 xs:-mt-12 sm:-mt-14 mb-4">
            <div className="relative group">
              <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 rounded-lg border-3 sm:border-4 border-white overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <IconUser size={24} className="xs:w-6 xs:h-6 sm:w-8 sm:h-8 text-blue-400 mb-0.5" />
                    <span className="text-xs text-blue-500 font-medium hidden xs:block">Photo</span>
                  </div>
                )}
              </div>
              {showImageUpload && onImageUpload && (
                <label className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white p-1 xs:p-1.5 rounded-lg cursor-pointer transition-colors">
                  <IconCamera size={10} className="xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                  <input type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Image Error - Mobile */}
          {imageError && (
            <div className="text-center mb-4">
              <p className="text-xs sm:text-sm text-red-600 px-2">{imageError}</p>
            </div>
          )}

          {/* Name and Title - Centered on mobile */}
          <div className="text-center space-y-2">
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold leading-tight text-gray-900 flex items-center justify-center gap-2">
              {fullName ? (
                <span>{fullName}</span>
              ) : (
                <span className="text-blue-400 italic font-medium">Your Name Here</span>
              )}
              {isVerified && (
                <IconRosetteDiscountCheckFilled 
                  size={24} 
                  className="text-blue-600 flex-shrink-0" 
                  title="Verified Tutor"
                />
              )}
            </h1>
            <p className="text-base xs:text-lg sm:text-xl text-blue-600 font-semibold">
              {professionalTitle ? (
                <span className="text-gray-700">{professionalTitle}</span>
              ) : (
                <span className="text-gray-400 italic">Your Professional Title</span>
              )}
            </p>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex lg:items-center lg:space-x-8 -mt-16">
          <div className="flex-shrink-0 lg:self-start">
            <div className="relative group">
              <div className="w-32 h-32 rounded-lg border-4 border-white overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <IconUser size={40} className="text-blue-400 mb-1" />
                    <span className="text-xs text-blue-500 font-medium">Profile Photo</span>
                  </div>
                )}
              </div>
              {showImageUpload && onImageUpload && (
                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg cursor-pointer transition-colors">
                  <IconCamera size={16} />
                  <input type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
                </label>
              )}
            </div>
            {imageError && (
              <p className="mt-3 text-sm text-red-600 text-center max-w-xs">{imageError}</p>
            )}
          </div>

          <div className="flex-1 space-y-20">
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight -mt-16 flex items-center gap-3">
                {fullName ? (
                  <span className="text-white">{fullName}</span>
                ) : (
                  <span className="text-blue-400 italic font-medium">Your Name Here</span>
                )}
                {isVerified && (
                  <IconRosetteDiscountCheckFilled 
                    size={36} 
                    className="text-blue-400 flex-shrink-0" 
                    title="Verified Tutor"
                  />
                )}
              </h1>
              <p className="text-xl text-blue-600 font-semibold">
                {professionalTitle ? (
                  <span className="text-black">{professionalTitle}</span>
                ) : (
                  <span className="text-gray-400 italic">Your Professional Title</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-3 sm:px-4 lg:px-6 pb-4 sm:pb-5 lg:pb-6 pt-0">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 xs:p-4 sm:p-5 lg:p-6 border border-blue-100">
          <p className="text-gray-700 text-sm xs:text-base lg:text-lg mb-3 sm:mb-4 leading-relaxed text-center sm:text-left">
            <span className="text-blue-600 font-semibold">Welcome to your tutor journey!</span> Complete your profile to start teaching and connect with students worldwide. Your profile will be reviewed within 24 hours.
          </p>

          <div className="mb-3 sm:mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-600">Profile Completion</span>
              <span className="text-xs sm:text-sm font-bold text-blue-600">{completionValue}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
              <div
                className="h-1.5 sm:h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionValue}%` }}
              ></div>
            </div>
          </div>

          {subjects.length > 0 && (
            <div className="space-y-2 sm:space-y-3">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-700 text-center sm:text-left">Your Specializations</h4>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center sm:justify-start">
                {subjects.slice(0, 6).map((subject) => (
                  <span
                    key={subject}
                    className="px-2 py-1 xs:px-3 xs:py-1.5 sm:px-4 sm:py-2 bg-white border border-blue-200 text-blue-700 text-xs sm:text-sm rounded-full font-medium shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {subject}
                  </span>
                ))}
                {subjects.length > 6 && (
                  <span className="px-2 py-1 xs:px-3 xs:py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 text-xs sm:text-sm rounded-full font-medium shadow-sm">
                    +{subjects.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
