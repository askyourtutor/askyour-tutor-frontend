import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { IconArrowLeft, IconStar, IconMapPin, IconBriefcase } from '@tabler/icons-react';
import { useAuth } from '../../../shared/contexts/AuthContext';
import type { TutorSummary, TutorCourse } from '../../../shared/types/teacher';
import { teacherService } from '../services/teacher.service';

const TeacherDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teacher, setTeacher] = useState<TutorSummary | null>(null);
  const [courses, setCourses] = useState<TutorCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBookSession = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/teachers/${id}` } } });
      return;
    }
    
    if (user.role !== 'STUDENT') {
      // Only students can book sessions
      return;
    }
    
    // TODO: Navigate to booking flow
    console.log('Navigate to booking flow for teacher:', id);
  };

  const handleMessage = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/teachers/${id}` } } });
      return;
    }
    
    if (user.role !== 'STUDENT') {
      // Only students can message tutors
      return;
    }
    
    // TODO: Navigate to messaging
    console.log('Navigate to messaging for teacher:', id);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const [teacherData, coursesData] = await Promise.all([
          teacherService.getTutorById(id),
          teacherService.getTutorCourses(id),
        ]);
        setTeacher(teacherData);
        setCourses(coursesData);
      } catch (err) {
        console.error('Failed to fetch teacher:', err);
        setError('Failed to load teacher details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Teacher Not Found</h2>
          <p className="text-gray-600 mb-4 text-sm">{error || 'This teacher is not available.'}</p>
          <Link
            to="/teachers"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <IconArrowLeft size={16} />
            Back to Teachers
          </Link>
        </div>
      </div>
    );
  }

  const { tutorProfile } = teacher;
  const fullName = `${tutorProfile.firstName} ${tutorProfile.lastName}`;
  const rating = 4.5;
  const totalStudents = 150;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link
            to="/teachers"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 text-sm"
          >
            <IconArrowLeft size={16} />
            Back to Teachers
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
          {/* Avatar */}
          <div className="relative self-center sm:self-start">
            <div className="w-20 h-20 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xl sm:text-lg md:text-xl">
              {tutorProfile.firstName[0]}{tutorProfile.lastName[0]}
            </div>
            {tutorProfile.verificationStatus === 'APPROVED' && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <svg className="w-3 h-3 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-1">{fullName}</h1>
            {tutorProfile.professionalTitle && (
              <p className="text-blue-600 font-medium text-sm sm:text-xs md:text-sm mb-3">{tutorProfile.professionalTitle}</p>
            )}
            
            <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-2 md:gap-3 mb-4">
              <div className="flex items-center gap-1">
                <IconStar size={14} className="text-amber-400 fill-amber-400" />
                <span className="font-medium text-sm">{rating}</span>
                <span className="text-gray-500 text-xs">({totalStudents} students)</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-gray-300"></div>
              <span className="text-lg sm:text-base md:text-lg font-semibold text-blue-600">${tutorProfile.hourlyRate}/hr</span>
            </div>

            {/* Booking buttons - Only for students */}
            {user?.role === 'STUDENT' && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                <button 
                  onClick={handleBookSession}
                  className="px-4 sm:px-3 md:px-4 py-2 sm:py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm"
                >
                  Book Session
                </button>
                <button 
                  onClick={handleMessage}
                  className="px-4 sm:px-3 md:px-4 py-2 sm:py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium text-sm"
                >
                  Message
                </button>
              </div>
            )}

            {/* Login prompt for guests */}
            {!user && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                <button 
                  onClick={() => navigate('/login', { state: { from: { pathname: `/teachers/${id}` } } })}
                  className="px-4 sm:px-3 md:px-4 py-2 sm:py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-sm"
                >
                  Login to Book Session
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
          <div className="text-center p-3 sm:p-2 md:p-3 border border-gray-100 rounded-md">
            <div className="text-lg sm:text-base md:text-lg font-semibold text-gray-900">{tutorProfile.teachingExperience || 0}</div>
            <div className="text-xs text-gray-600">Years Exp.</div>
          </div>
          <div className="text-center p-3 sm:p-2 md:p-3 border border-gray-100 rounded-md">
            <div className="text-lg sm:text-base md:text-lg font-semibold text-gray-900">{totalStudents}+</div>
            <div className="text-xs text-gray-600">Students</div>
          </div>
          <div className="text-center p-3 sm:p-2 md:p-3 border border-gray-100 rounded-md">
            <div className="text-lg sm:text-base md:text-lg font-semibold text-gray-900">{courses.length}</div>
            <div className="text-xs text-gray-600">Courses</div>
          </div>
          <div className="text-center p-3 sm:p-2 md:p-3 border border-gray-100 rounded-md">
            <div className="text-lg sm:text-base md:text-lg font-semibold text-gray-900">{rating}</div>
            <div className="text-xs text-gray-600">Rating</div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">About</h2>
              {tutorProfile.bio ? (
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{tutorProfile.bio}</p>
              ) : (
                <p className="text-gray-500 italic text-sm sm:text-base">No bio available.</p>
              )}
            </div>

            {/* Education */}
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">Education & Experience</h2>
              <div className="space-y-3">
                {tutorProfile.university && (
                  <div className="flex items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <IconMapPin size={18} className="text-gray-600 mt-0.5 sm:mt-0 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900 text-sm sm:text-base">{tutorProfile.university}</div>
                      <div className="text-xs sm:text-sm text-gray-600">University</div>
                    </div>
                  </div>
                )}
                
                {tutorProfile.teachingExperience && (
                  <div className="flex items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <IconBriefcase size={18} className="text-gray-600 mt-0.5 sm:mt-0 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900 text-sm sm:text-base">{tutorProfile.teachingExperience} Years Teaching</div>
                      <div className="text-xs sm:text-sm text-gray-600">Experience</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Subjects */}
            {tutorProfile.subjects && tutorProfile.subjects.length > 0 && (
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">Subjects</h2>
                <div className="flex flex-wrap gap-2">
                  {tutorProfile.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 sm:py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-base sm:text-lg">Quick Info</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600">Hourly Rate</div>
                  <div className="text-xl sm:text-2xl font-semibold text-blue-600">${tutorProfile.hourlyRate}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">Experience</div>
                  <div className="text-xl sm:text-2xl font-semibold text-gray-900">{tutorProfile.teachingExperience || 0} years</div>
                </div>

                {tutorProfile.verificationStatus === 'APPROVED' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Verified Teacher</span>
                  </div>
                )}

                {/* Book Now button - Only for students */}
                {user?.role === 'STUDENT' && (
                  <button 
                    onClick={handleBookSession}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm sm:text-base"
                  >
                    Book Now
                  </button>
                )}

                {/* Login prompt for guests */}
                {!user && (
                  <button 
                    onClick={() => navigate('/login', { state: { from: { pathname: `/teachers/${id}` } } })}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm sm:text-base"
                  >
                    Login to Book
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Courses */}
        {courses.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Courses ({courses.length})</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/course/${course.id}`}
                  className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-28 sm:h-32 bg-gray-100">
                    {course.image ? (
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xl sm:text-2xl text-blue-600 font-semibold">
                          {course.subject.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 sm:p-4">
                    <div className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">
                      {course.subject}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2 line-clamp-2 text-sm sm:text-base">
                      {course.title}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {course.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <IconStar size={12} className="text-amber-400 fill-amber-400" />
                            <span className="text-xs text-gray-600">{course.rating.toFixed(1)}</span>
                          </div>
                        )}
                        <span className="text-xs text-gray-600">{course._count.lessons} lessons</span>
                      </div>
                      <span className="font-semibold text-blue-600 text-sm sm:text-base">${course.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDetailPage;
