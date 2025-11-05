import { IconStar, IconBook, IconUsers, IconMapPin, IconClock } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import type { TutorSummary } from '../../../shared/types/teacher';

interface TeacherCardProps {
  teacher: TutorSummary;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {
  const navigate = useNavigate();
  const { tutorProfile } = teacher;
  const fullName = `${tutorProfile.firstName} ${tutorProfile.lastName}`;
  const rating = teacher.rating || 0;
  const totalStudents = teacher.totalStudents || 0;
  const totalCourses = teacher.totalCourses || 0;

  const handleTeacherClick = () => {
    // All users (including tutors and guests) can view teacher details
    navigate(`/teachers/${teacher.id}`);
  };

  // Render as clickable div for all users
  return (
    <div
      onClick={handleTeacherClick}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer border border-gray-200"
    >
      {/* Avatar Section */}
      <div className="relative p-4 sm:p-5 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-lg flex items-center justify-center text-blue-600 font-bold text-xl sm:text-2xl">
                {tutorProfile.firstName[0]}{tutorProfile.lastName[0]}
              </div>
              {tutorProfile.verificationStatus === 'APPROVED' && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full shadow-md flex items-center justify-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold !text-white group-hover:!text-blue-50 transition-colors truncate">
                {fullName}
              </h3>
              {tutorProfile.professionalTitle && (
                <p className="text-xs sm:text-sm !text-blue-100 truncate mt-0.5">{tutorProfile.professionalTitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col space-y-3">
        {/* University */}
        {tutorProfile.university && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <IconMapPin size={16} className="flex-shrink-0 text-blue-500" />
            <span className="truncate">{tutorProfile.university}</span>
          </div>
        )}

        {/* Bio */}
        {tutorProfile.bio && (
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
            {tutorProfile.bio}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <IconStar size={16} className="text-yellow-500 flex-shrink-0" />
            <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <IconUsers size={16} className="text-blue-500 flex-shrink-0" />
            <span className="text-gray-700">{totalStudents}+</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <IconBook size={16} className="text-purple-500 flex-shrink-0" />
            <span className="text-gray-700">{totalCourses} courses</span>
          </div>
          {tutorProfile.teachingExperience && (
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <IconClock size={16} className="text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{tutorProfile.teachingExperience}y exp</span>
            </div>
          )}
        </div>

        {/* Hourly Rate */}
        {tutorProfile.hourlyRate && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide">Hourly Rate</span>
              <span className="text-lg sm:text-xl font-bold text-blue-600">${tutorProfile.hourlyRate}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
