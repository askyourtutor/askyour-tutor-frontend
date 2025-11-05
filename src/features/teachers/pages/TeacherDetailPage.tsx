import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { 
  IconArrowLeft, 
  IconStar, 
  IconMapPin, 
  IconBriefcase, 
  IconSchool,
  IconClock,
  IconUsers,
  IconAward,
  IconMessage,
  IconCalendar,
  IconShield,
  IconBookmark,
  IconShare
} from '@tabler/icons-react';
import { useAuth } from '../../../shared/contexts/AuthContext';
import type { TutorSummary, TutorCourse } from '../../../shared/types/teacher';
import { teacherService } from '../services/teacher.service';
import { cache } from '../../../shared/lib/cache';
import TeacherDetailSkeleton from '../components/TeacherDetailSkeleton';

const TeacherDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teacher, setTeacher] = useState<TutorSummary | null>(null);
  const [courses, setCourses] = useState<TutorCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'reviews'>('overview');

  const handleBookSession = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/teachers/${id}` } } });
      return;
    }
    
    if (user.role !== 'STUDENT') {
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
      return;
    }
    
    // TODO: Navigate to messaging
    console.log('Navigate to messaging for teacher:', id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${teacher?.tutorProfile.firstName} ${teacher?.tutorProfile.lastName} - Tutor`,
        text: `Check out this amazing tutor!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      
      try {
        const teacherCacheKey = `tutor:details:${id}`;
        const coursesCacheKey = `tutor:courses:${id}`;
        
        const cachedTeacher = cache.get<{ data: TutorSummary }>(teacherCacheKey);
        const cachedCourses = cache.get<{ data: TutorCourse[] }>(coursesCacheKey);
        
        if (cachedTeacher && cachedCourses) {
          setTeacher(cachedTeacher.data);
          setCourses(cachedCourses.data);
          setIsLoading(false);
          setError(null);
          
          if (cache.isStale(teacherCacheKey) || cache.isStale(coursesCacheKey)) {
            try {
              const [teacherData, coursesData] = await Promise.all([
                teacherService.getTutorById(id),
                teacherService.getTutorCourses(id),
              ]);
              setTeacher(teacherData);
              setCourses(coursesData);
            } catch (e) {
              console.warn('Background refresh failed:', e);
            }
          }
        } else {
          setIsLoading(true);
          setError(null);
          
          const [teacherData, coursesData] = await Promise.all([
            teacherService.getTutorById(id),
            teacherService.getTutorCourses(id),
          ]);
          setTeacher(teacherData);
          setCourses(coursesData);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch teacher:', err);
        setError('Failed to load teacher details');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return <TeacherDetailSkeleton />;
  }

  if (error || !teacher) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <IconUsers size={40} className="text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Teacher Not Found</h2>
          <p className="text-gray-600 mb-8">{error || 'This teacher is not available.'}</p>
          <Link
            to="/teachers"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <IconArrowLeft size={20} />
            Back to Teachers
          </Link>
        </div>
      </div>
    );
  }

  const { tutorProfile } = teacher;
  const fullName = `${tutorProfile.firstName} ${tutorProfile.lastName}`;
  const rating = 4.8;
  const totalStudents = 245;
  const totalReviews = 89;

  const isStudent = user?.role === 'STUDENT';
  const isGuest = !user;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <Link
            to="/teachers"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 group transition-colors"
          >
            <IconArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium text-sm">Back to Teachers</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Profile Info */}
            <div className="lg:col-span-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-white font-bold text-2xl shadow-2xl">
                    {tutorProfile.firstName[0]}{tutorProfile.lastName[0]}
                  </div>
                  {tutorProfile.verificationStatus === 'APPROVED' && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                      <IconShield size={14} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-1">{fullName}</h1>
                  {tutorProfile.professionalTitle && (
                    <p className="text-lg text-blue-100 font-medium mb-3">{tutorProfile.professionalTitle}</p>
                  )}
                  
                  {/* Rating & Stats */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <IconStar 
                            key={i} 
                            size={16} 
                            className={i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'} 
                          />
                        ))}
                      </div>
                      <span className="text-base font-semibold">{rating}</span>
                      <span className="text-blue-200 text-sm">({totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-100 text-sm">
                      <IconUsers size={16} />
                      <span>{totalStudents}+ students</span>
                    </div>
                  </div>

                  {/* University & Location */}
                  {tutorProfile.university && (
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-blue-100 mb-4 text-sm">
                      <IconMapPin size={16} />
                      <span>{tutorProfile.university}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {isStudent && (
                      <>
                        <button 
                          onClick={handleBookSession}
                          className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
                        >
                          <IconCalendar size={16} />
                          Book Session
                        </button>
                        <button 
                          onClick={handleMessage}
                          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200 text-sm"
                        >
                          <IconMessage size={16} />
                          Message
                        </button>
                      </>
                    )}
                    
                    {isGuest && (
                      <button 
                        onClick={() => navigate('/login', { state: { from: { pathname: `/teachers/${id}` } } })}
                        className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
                      >
                        <IconCalendar size={16} />
                        Login to Book
                      </button>
                    )}

                    <button 
                      onClick={handleShare}
                      className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-200 text-sm"
                    >
                      <IconShare size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="lg:col-span-4">
              <div className="bg-white/10 backdrop-blur-md rounded-sm border border-white/20 p-4 shadow-2xl">
                <div className="text-center mb-4">
                  <div className="text-xs text-blue-100 mb-1">Starting from</div>
                  <div className="text-2xl font-bold text-white">${tutorProfile.hourlyRate}</div>
                  <div className="text-blue-200 text-sm">/hour</div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-100">Experience</span>
                    <span className="text-white font-medium">{tutorProfile.teachingExperience || 0} years</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-100">Students taught</span>
                    <span className="text-white font-medium">{totalStudents}+</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-100">Courses</span>
                    <span className="text-white font-medium">{courses.length}</span>
                  </div>
                </div>

                {tutorProfile.verificationStatus === 'APPROVED' && (
                  <div className="flex items-center justify-center gap-2 text-green-300 text-xs mb-3">
                    <IconAward size={14} />
                    <span>Verified Tutor</span>
                  </div>
                )}

                {isStudent && (
                  <button 
                    onClick={handleBookSession}
                    className="w-full bg-white text-blue-700 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg text-sm"
                  >
                    Book Now
                  </button>
                )}

                {isGuest && (
                  <button 
                    onClick={() => navigate('/login', { state: { from: { pathname: `/teachers/${id}` } } })}
                    className="w-full bg-white text-blue-700 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg text-sm"
                  >
                    Login to Book
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-8">
            {/* Tab Navigation */}
            <div className="bg-white rounded-sm shadow-sm border border-gray-200 mb-6">
              <div className="flex border-b border-gray-200">
                {[
                  { id: 'overview', label: 'Overview', icon: IconSchool },
                  { id: 'courses', label: `Courses (${courses.length})`, icon: IconBookmark },
                  { id: 'reviews', label: `Reviews (${totalReviews})`, icon: IconStar },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon size={18} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* About */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">About Me</h3>
                      {tutorProfile.bio ? (
                        <p className="text-gray-700 leading-relaxed">{tutorProfile.bio}</p>
                      ) : (
                        <p className="text-gray-500 italic">No bio available.</p>
                      )}
                    </div>

                    {/* Education & Experience */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Education & Experience</h3>
                      <div className="space-y-4">
                        {tutorProfile.university && (
                          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconSchool size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{tutorProfile.university}</h4>
                              <p className="text-gray-600 text-sm">University Education</p>
                            </div>
                          </div>
                        )}
                        
                        {tutorProfile.teachingExperience && (
                          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-sm">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconBriefcase size={20} className="text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{tutorProfile.teachingExperience} Years of Teaching</h4>
                              <p className="text-gray-600 text-sm">Professional Experience</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Subjects */}
                    {tutorProfile.subjects && tutorProfile.subjects.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Subjects I Teach</h3>
                        <div className="flex flex-wrap gap-3">
                          {tutorProfile.subjects.map((subject, index) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Courses Tab */}
                {activeTab === 'courses' && (
                  <div>
                    {courses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {courses.map((course) => (
                          <Link
                            key={course.id}
                            to={`/courses/${course.id}`}
                            className="group bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-blue-300"
                          >
                            <div className="h-40 bg-gradient-to-br from-blue-500 to-indigo-600 relative overflow-hidden">
                              {course.image ? (
                                <img 
                                  src={course.image} 
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                  <span className="text-4xl text-white font-bold">
                                    {course.subject.charAt(0)}
                                  </span>
                                </div>
                              )}
                              <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-medium rounded-full">
                                  {course.subject}
                                </span>
                              </div>
                            </div>

                            <div className="p-4">
                              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2 line-clamp-2">
                                {course.title}
                              </h4>

                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                  {course.rating > 0 && (
                                    <div className="flex items-center gap-1">
                                      <IconStar size={14} className="text-amber-400 fill-amber-400" />
                                      <span className="text-gray-600">{course.rating.toFixed(1)}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <IconClock size={14} />
                                    <span>{course._count.lessons} lessons</span>
                                  </div>
                                </div>
                                <span className="font-bold text-blue-600 text-lg">${course.price}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <IconBookmark size={48} className="text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                        <p className="text-gray-600">This tutor hasn't created any courses yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="text-center py-12">
                    <IconStar size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Reviews coming soon</h3>
                    <p className="text-gray-600">Student reviews will be displayed here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{rating}</div>
                    <div className="text-xs text-gray-600">Rating</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{totalStudents}+</div>
                    <div className="text-xs text-gray-600">Students</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{courses.length}</div>
                    <div className="text-xs text-gray-600">Courses</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{tutorProfile.teachingExperience || 0}</div>
                    <div className="text-xs text-gray-600">Years Exp</div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Teaching Schedule</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability</span>
                    <span className="text-green-600 font-medium">Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response time</span>
                    <span className="text-gray-900">Within 2 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time zone</span>
                    <span className="text-gray-900">EST (UTC-5)</span>
                  </div>
                </div>

                {isStudent && (
                  <div className="mt-6 space-y-3">
                    <button 
                      onClick={handleBookSession}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                      Schedule Session
                    </button>
                    <button 
                      onClick={handleMessage}
                      className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                      Send Message
                    </button>
                  </div>
                )}

                {isGuest && (
                  <button 
                    onClick={() => navigate('/login', { state: { from: { pathname: `/teachers/${id}` } } })}
                    className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    Login to Contact
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailPage;
