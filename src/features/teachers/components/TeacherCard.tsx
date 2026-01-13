import { IconStar, IconBook, IconUsers, IconMapPin, IconClock } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import type { TutorSummary } from '../../../shared/types/teacher';
import { getAvatarUrl } from '../../../shared/utils/url';

interface TeacherCardProps {
  teacher: TutorSummary;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {
  const navigate = useNavigate();
  const { tutorProfile } = teacher;
  
  // Handle case where tutorProfile might be null (e.g., admin users without profile)
  if (!tutorProfile) {
    return null;
  }
  
  const fullName = `${tutorProfile.firstName} ${tutorProfile.lastName}`;
  const rating = teacher.rating || 0;
  const totalStudents = teacher.totalStudents || 0;
  const totalCourses = teacher.totalCourses || 0;
  const avatarUrl = getAvatarUrl(tutorProfile.avatar);
  const isAdmin = teacher.isAdminTutor;

  const handleTeacherClick = () => {
    navigate(`/teachers/${teacher.id}`);
  };

  return (
    <div
      onClick={handleTeacherClick}
      className={`group bg-white border hover:border-blue-600 transition-all duration-200 cursor-pointer ${
        isAdmin ? 'border-blue-600 shadow-lg' : 'border-gray-200'
      }`}
    >
      <div className={`flex items-center gap-4 ${isAdmin ? 'p-6' : 'p-4'}`}>
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName}
              className={`rounded-full object-cover border-2 ${
                isAdmin ? 'w-20 h-20 border-blue-600' : 'w-14 h-14 border-gray-300'
              }`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`rounded-full flex items-center justify-center text-white font-semibold ${
              isAdmin 
                ? 'w-20 h-20 bg-gradient-to-br from-gray-800 to-black border-2 border-black text-2xl' 
                : 'w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-gray-300 text-lg'
            }`}
            style={{ display: avatarUrl ? 'none' : 'flex' }}
          >
            {tutorProfile.firstName[0]}{tutorProfile.lastName[0]}
          </div>
          
          {/* Verification Badge */}
          {tutorProfile.verificationStatus === 'APPROVED' && (
            <div className={`absolute -bottom-0.5 -right-0.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md ${
              isAdmin ? 'w-6 h-6' : 'w-5 h-5'
            }`}>
              <svg className={`text-white ${isAdmin ? 'w-4 h-4' : 'w-3 h-3'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Name and Title Row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`font-semibold text-black truncate group-hover:underline ${
                  isAdmin ? 'text-lg' : 'text-base'
                }`}>
                  {fullName}
                </h3>
                {isAdmin && (
                  <span className="px-2.5 py-1 bg-gradient-to-r from-blue-800 to-black text-white text-xs font-bold shadow-sm">
                    FEATURED
                  </span>
                )}
              </div>
              {tutorProfile.professionalTitle && (
                <p className={`text-gray-600 truncate mt-0.5 ${
                  isAdmin ? 'text-sm' : 'text-xs'
                }`}>
                  {tutorProfile.professionalTitle}
                </p>
              )}
            </div>
            
            {/* Price */}
            {tutorProfile.hourlyRate && tutorProfile.hourlyRate > 0 && (
              <div className="text-right flex-shrink-0">
                <div className={`font-bold bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent ${
                  isAdmin ? 'text-2xl' : 'text-lg'
                }`}>
                  ${tutorProfile.hourlyRate}
                </div>
                <div className={`text-gray-500 ${
                  isAdmin ? 'text-sm' : 'text-xs'
                }`}>
                  /hour
                </div>
              </div>
            )}
          </div>

          {/* University */}
          {tutorProfile.university && (
            <div className={`flex items-center gap-1.5 text-gray-600 mb-2 ${
              isAdmin ? 'text-sm' : 'text-xs'
            }`}>
              <IconMapPin size={isAdmin ? 16 : 14} className="flex-shrink-0 text-blue-600" />
              <span className="truncate">{tutorProfile.university}</span>
            </div>
          )}

          {/* Department Badge */}
          {tutorProfile.department && (
            <div className="mb-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full font-medium ${
                isAdmin ? 'text-sm' : 'text-xs'
              } ${
                tutorProfile.department === 'IT' ? 'bg-blue-100 text-blue-700' :
                tutorProfile.department === 'Business' ? 'bg-green-100 text-green-700' :
                tutorProfile.department === 'Science' ? 'bg-purple-100 text-purple-700' :
                tutorProfile.department === 'Law' ? 'bg-red-100 text-red-700' :
                tutorProfile.department === 'Arts' ? 'bg-amber-100 text-amber-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {tutorProfile.department}
              </span>
            </div>
          )}

          {/* Stats Row */}
          <div className={`flex items-center gap-4 ${
            isAdmin ? 'text-sm' : 'text-xs'
          }`}>
            <div className="flex items-center gap-1">
              <IconStar size={isAdmin ? 16 : 14} className="text-amber-500" />
              <span className="font-medium text-black">{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <IconUsers size={isAdmin ? 16 : 14} className="text-blue-600" />
              <span className="text-gray-600">{totalStudents}+ students</span>
            </div>
            <div className="flex items-center gap-1">
              <IconBook size={isAdmin ? 16 : 14} className="text-purple-600" />
              <span className="text-gray-600">{totalCourses} courses</span>
            </div>
            {tutorProfile.teachingExperience && (
              <div className="flex items-center gap-1">
                <IconClock size={isAdmin ? 16 : 14} className="text-green-600" />
                <span className="text-gray-600">{tutorProfile.teachingExperience}y exp</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
