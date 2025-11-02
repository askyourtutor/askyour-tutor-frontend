import { IconStar, IconBook, IconUsers, IconMapPin, IconClock } from '@tabler/icons-react';
import { Link } from 'react-router';
import type { TutorSummary } from '../../../shared/types/teacher';
import { useAuth } from '../../../shared/contexts/AuthContext';

interface TeacherCardProps {
  teacher: TutorSummary;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {
  const { user } = useAuth();
  const { tutorProfile } = teacher;
  const fullName = `${tutorProfile.firstName} ${tutorProfile.lastName}`;
  const rating = 4.5; // Mock rating for now
  const totalStudents = 150; // Mock data
  const totalCourses = 12; // Mock data

  // If user is a tutor, render as non-clickable div
  if (user?.role === 'TUTOR') {
    return (
      <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col h-full cursor-default">
        {/* Avatar Section */}
        <div className="relative p-3 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {tutorProfile.firstName[0]}{tutorProfile.lastName[0]}
                </div>
                {tutorProfile.verificationStatus === 'APPROVED' && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 transition-colors truncate">
                  {fullName}
                </h3>
                {tutorProfile.professionalTitle && (
                  <p className="text-[10px] text-gray-600 truncate">{tutorProfile.professionalTitle}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Rest of the content will be added after I see the full structure */}
        
        {/* Content Section */}
        <div className="p-2.5 flex-1 flex flex-col">
          {/* University */}
          {tutorProfile.university && (
            <div className="flex items-center gap-1 text-[10px] text-gray-600 mb-2">
              <IconMapPin size={11} className="flex-shrink-0" />
              <span className="truncate">{tutorProfile.university}</span>
            </div>
          )}

          {/* Bio */}
          {tutorProfile.bio && (
            <p className="text-[10px] text-gray-600 line-clamp-2 mb-2">
              {tutorProfile.bio}
            </p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-1.5 mb-2 mt-auto">
            <div className="flex items-center gap-1 text-[10px]">
              <IconStar size={11} className="text-yellow-500 flex-shrink-0" />
              <span className="font-medium text-gray-900">{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px]">
              <IconUsers size={11} className="text-gray-500 flex-shrink-0" />
              <span className="text-gray-600">{totalStudents}+</span>
            </div>
            <div className="flex items-center gap-1 text-[10px]">
              <IconBook size={11} className="text-gray-500 flex-shrink-0" />
              <span className="text-gray-600">{totalCourses} courses</span>
            </div>
            {tutorProfile.teachingExperience && (
              <div className="flex items-center gap-1 text-[10px]">
                <IconClock size={11} className="text-gray-500 flex-shrink-0" />
                <span className="text-gray-600">{tutorProfile.teachingExperience}y exp</span>
              </div>
            )}
          </div>

          {/* Hourly Rate */}
          {tutorProfile.hourlyRate && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-500">Hourly Rate</span>
                <span className="text-sm font-bold text-blue-600">${tutorProfile.hourlyRate}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // For students and admins, render as clickable Link
  return (
    <Link
      to={`/teachers/${teacher.id}`}
      className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-300 flex flex-col h-full"
    >
      {/* Avatar Section */}
      <div className="relative p-3 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {tutorProfile.firstName[0]}{tutorProfile.lastName[0]}
              </div>
              {tutorProfile.verificationStatus === 'APPROVED' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                {fullName}
              </h3>
              {tutorProfile.professionalTitle && (
                <p className="text-[10px] text-gray-600 truncate">{tutorProfile.professionalTitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-2.5 flex-1 flex flex-col">
        {/* University */}
        {tutorProfile.university && (
          <div className="flex items-center gap-1 text-[10px] text-gray-600 mb-2">
            <IconMapPin size={11} className="flex-shrink-0" />
            <span className="truncate">{tutorProfile.university}</span>
          </div>
        )}

        {/* Bio */}
        {tutorProfile.bio && (
          <p className="text-[10px] text-gray-600 line-clamp-2 mb-2">
            {tutorProfile.bio}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-1.5 mb-2 mt-auto">
          <div className="flex items-center gap-1 text-[10px]">
            <IconStar size={11} className="text-yellow-500 flex-shrink-0" />
            <span className="font-medium text-gray-900">{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px]">
            <IconUsers size={11} className="text-gray-500 flex-shrink-0" />
            <span className="text-gray-600">{totalStudents}+</span>
          </div>
          <div className="flex items-center gap-1 text-[10px]">
            <IconBook size={11} className="text-gray-500 flex-shrink-0" />
            <span className="text-gray-600">{totalCourses} courses</span>
          </div>
          {tutorProfile.teachingExperience && (
            <div className="flex items-center gap-1 text-[10px]">
              <IconClock size={11} className="text-gray-500 flex-shrink-0" />
              <span className="text-gray-600">{tutorProfile.teachingExperience}y exp</span>
            </div>
          )}
        </div>

        {/* Hourly Rate */}
        {tutorProfile.hourlyRate && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500">Hourly Rate</span>
              <span className="text-sm font-bold text-blue-600">${tutorProfile.hourlyRate}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};
