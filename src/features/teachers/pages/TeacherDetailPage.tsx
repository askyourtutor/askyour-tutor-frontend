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
import type { TutorSummary, TutorCourse, TutorReview, TutorSession } from '../../../shared/types/teacher';
import { teacherService } from '../services/teacher.service';
import { cache } from '../../../shared/lib/cache';
import { getAvatarUrl } from '../../../shared/utils/url';
import TeacherDetailSkeleton from '../components/TeacherDetailSkeleton';

const TeacherDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teacher, setTeacher] = useState<TutorSummary | null>(null);
  const [courses, setCourses] = useState<TutorCourse[]>([]);
  const [reviews, setReviews] = useState<TutorReview[]>([]);
  const [sessions, setSessions] = useState<TutorSession[]>([]);
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
    
    // TODO: Implement booking flow
  };

  const handleMessage = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/teachers/${id}` } } });
      return;
    }
    
    if (user.role !== 'STUDENT') {
      return;
    }
    
    // TODO: Implement messaging
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
        const reviewsCacheKey = `tutor:reviews:${id}`;
        
        const cachedTeacher = cache.get<{ data: TutorSummary }>(teacherCacheKey);
        const cachedCourses = cache.get<{ data: TutorCourse[] }>(coursesCacheKey);
        const cachedReviews = cache.get<{ data: TutorReview[] }>(reviewsCacheKey);
        
        if (cachedTeacher && cachedCourses) {
          setTeacher(cachedTeacher.data);
          setCourses(cachedCourses.data);
          if (cachedReviews) setReviews(cachedReviews.data);
          setIsLoading(false);
          setError(null);
          
          if (cache.isStale(teacherCacheKey) || cache.isStale(coursesCacheKey) || cache.isStale(reviewsCacheKey)) {
            try {
              const [teacherData, coursesData, reviewsData] = await Promise.all([
                teacherService.getTutorById(id),
                teacherService.getTutorCourses(id),
                teacherService.getTutorReviews(id),
              ]);
              setTeacher(teacherData);
              setCourses(coursesData);
              setReviews(reviewsData);
            } catch {
              // Silent background refresh failure
            }
          }
        } else {
          setIsLoading(true);
          setError(null);
          
          const [teacherData, coursesData, reviewsData] = await Promise.all([
            teacherService.getTutorById(id),
            teacherService.getTutorCourses(id),
            teacherService.getTutorReviews(id),
          ]);
          setTeacher(teacherData);
          setCourses(coursesData);
          setReviews(reviewsData);
          setIsLoading(false);
        }
        
        // Fetch sessions separately (not cached, as they update frequently)
        try {
          const sessionsData = await teacherService.getTutorSessions(id);
          setSessions(sessionsData);
        } catch {
          // Sessions are optional, don't fail if not available
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
  const rating = teacher.rating || 0;
  const totalStudents = teacher.totalStudents || 0;
  const totalReviews = teacher.totalCourses || 0; // Use actual course count as reviews proxy
  const avatarUrl = getAvatarUrl(tutorProfile.avatar);

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

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6 items-start">
            {/* Profile Info */}
            <div className="xl:col-span-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={fullName}
                      className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full object-cover border-3 sm:border-4 border-white/30 shadow-2xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-white/20 backdrop-blur-sm border-3 sm:border-4 border-white/30 flex items-center justify-center text-white font-bold text-lg sm:text-xl lg:text-2xl shadow-2xl"
                    style={{ display: avatarUrl ? 'none' : 'flex' }}
                  >
                    {tutorProfile.firstName[0]}{tutorProfile.lastName[0]}
                  </div>
                  {tutorProfile.verificationStatus === 'APPROVED' && (
                    <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-green-500 rounded-full border-2 sm:border-3 border-white flex items-center justify-center shadow-lg">
                      <IconShield size={12} className="sm:hidden text-white" />
                      <IconShield size={14} className="hidden sm:block text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold !text-white break-words">{fullName}</h1>
                    {teacher.isAdminTutor && (
                      <span className="px-2.5 py-1 bg-white text-black text-xs font-bold">
                        FEATURED
                      </span>
                    )}
                  </div>
                  {tutorProfile.professionalTitle && (
                    <p className="text-base sm:text-lg !text-white/90 font-medium mb-2 sm:mb-3 break-words">{tutorProfile.professionalTitle}</p>
                  )}
                  
                  {/* Rating & Stats */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 mb-3 sm:mb-4 text-sm sm:text-base">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        {[...Array(5)].map((_, i) => (
                          <IconStar 
                            key={i} 
                            size={14} 
                            className={`sm:w-4 sm:h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`} 
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-white">{rating.toFixed(1)}</span>
                      <span className="text-white/80 text-xs sm:text-sm">({totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-white/80 text-xs sm:text-sm">
                      <IconUsers size={14} className="sm:w-4 sm:h-4" />
                      <span>{totalStudents}+ students</span>
                    </div>
                  </div>

                  {/* University & Location */}
                  {tutorProfile.university && (
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-white/80 mb-3 sm:mb-4 text-xs sm:text-sm">
                      <IconMapPin size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="break-words">{tutorProfile.university}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center sm:justify-start">
                    {isStudent && (
                      <>
                        <button 
                          onClick={handleBookSession}
                          className="inline-flex items-center gap-1.5 sm:gap-2 bg-white text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl text-xs sm:text-sm"
                        >
                          <IconCalendar size={14} className="sm:w-4 sm:h-4" />
                          <span>Book Session</span>
                        </button>
                        <button 
                          onClick={handleMessage}
                          className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-semibold hover:bg-white/20 transition-all duration-200 text-xs sm:text-sm"
                        >
                          <IconMessage size={14} className="sm:w-4 sm:h-4" />
                          <span>Message</span>
                        </button>
                      </>
                    )}
                    
                    {isGuest && (
                      <button 
                        onClick={() => navigate('/login', { state: { from: { pathname: `/teachers/${id}` } } })}
                        className="inline-flex items-center gap-1.5 sm:gap-2 bg-white text-blue-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-sm font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl text-xs sm:text-sm"
                      >
                        <IconCalendar size={14} className="sm:w-4 sm:h-4" />
                        <span>Login to Book</span>
                      </button>
                    )}

                    <button 
                      onClick={handleShare}
                      className="inline-flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-sm hover:bg-white/20 transition-all duration-200 text-xs sm:text-sm"
                    >
                      <IconShare size={14} className="sm:w-4 sm:h-4" />
                    </button>

                    <button 
                      className="inline-flex items-center gap-1 sm:gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-sm hover:bg-white/20 transition-all duration-200 text-xs sm:text-sm"
                    >
                      <IconBookmark size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="xl:col-span-4">
              {tutorProfile.hourlyRate !== null && tutorProfile.hourlyRate !== undefined ? (
                <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-3 sm:p-4 shadow-2xl">
                  <div className="text-center mb-3 sm:mb-4">
                    <div className="text-xs text-white/70 mb-1">Starting from</div>
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      {tutorProfile.hourlyRate > 0 ? `$${tutorProfile.hourlyRate}` : 'Free'}
                    </div>
                    <div className="text-white/70 text-xs sm:text-sm">/hour</div>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/70">Experience</span>
                      <span className="text-white font-medium">{tutorProfile.teachingExperience || 0} years</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/70">Students taught</span>
                      <span className="text-white font-medium">{totalStudents}+</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/70">Courses</span>
                      <span className="text-white font-medium">{courses.length}</span>
                    </div>
                  </div>

                  {tutorProfile.verificationStatus === 'APPROVED' && (
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-green-300 text-xs mb-2 sm:mb-3">
                      <IconAward size={12} className="sm:w-3.5 sm:h-3.5" />
                      <span>Verified Tutor</span>
                    </div>
                  )}

                  {isStudent && (
                    <button 
                      onClick={handleBookSession}
                      className="w-full bg-white text-blue-700 py-2 sm:py-2.5 rounded-md sm:rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg text-xs sm:text-sm"
                    >
                      Book Now
                    </button>
                  )}

                  {isGuest && (
                    <button 
                      onClick={() => navigate('/login', { state: { from: { pathname: `/teachers/${id}` } } })}
                      className="w-full bg-white text-blue-700 py-2 sm:py-2.5 rounded-sm font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg text-xs sm:text-sm"
                    >
                      Login to Book
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-3 sm:p-4 shadow-2xl">
                  <div className="text-center mb-3 sm:mb-4">
                    <div className="text-xs text-white/70 mb-1">Pricing</div>
                    <div className="text-xl sm:text-2xl font-bold text-white">Contact for Rates</div>
                  </div>
                  
                  <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/70">Experience</span>
                      <span className="text-white font-medium">{tutorProfile.teachingExperience || 0} years</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/70">Students taught</span>
                      <span className="text-white font-medium">{totalStudents}+</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/70">Courses</span>
                      <span className="text-white font-medium">{courses.length}</span>
                    </div>
                  </div>

                  {tutorProfile.verificationStatus === 'APPROVED' && (
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-green-300 text-xs mb-2 sm:mb-3">
                      <IconAward size={12} className="sm:w-3.5 sm:h-3.5" />
                      <span>Verified Tutor</span>
                    </div>
                  )}

                  {isStudent && (
                    <button 
                      onClick={handleMessage}
                      className="w-full bg-white text-blue-700 py-2 sm:py-2.5 rounded-md sm:rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg text-xs sm:text-sm"
                    >
                      Contact Tutor
                    </button>
                  )}

                  {isGuest && (
                    <button 
                      onClick={() => navigate('/login', { state: { from: { pathname: `/teachers/${id}` } } })}
                      className="w-full bg-white text-blue-700 py-2 sm:py-2.5 rounded-md sm:rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg text-xs sm:text-sm"
                    >
                      Login to Contact
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Content */}
          <div className="xl:col-span-8">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview', icon: IconSchool },
                  { id: 'courses', label: `Courses (${courses.length})`, icon: IconBookmark },
                  { id: 'reviews', label: `Reviews (${totalReviews})`, icon: IconStar },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon size={16} className="sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">
                      {tab.id === 'overview' ? 'Info' : 
                       tab.id === 'courses' ? `Courses (${courses.length})` : 
                       `Reviews (${totalReviews})`}
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-3 sm:p-4 lg:p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6 sm:space-y-8">
                    {/* About */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">About Me</h3>
                      {tutorProfile.bio ? (
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{tutorProfile.bio}</p>
                      ) : (
                        <p className="text-gray-500 italic text-sm sm:text-base">No bio available.</p>
                      )}
                    </div>

                    {/* Education & Experience */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Education & Experience</h3>
                      <div className="space-y-3 sm:space-y-4">
                        {tutorProfile.university && (
                          <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconSchool size={16} className="sm:w-5 sm:h-5 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm sm:text-base break-words">{tutorProfile.university}</h4>
                              <p className="text-gray-600 text-xs sm:text-sm">University Education</p>
                            </div>
                          </div>
                        )}
                        
                        {tutorProfile.teachingExperience !== null && tutorProfile.teachingExperience !== undefined && (
                          <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconBriefcase size={16} className="sm:w-5 sm:h-5 text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{tutorProfile.teachingExperience} Years of Teaching</h4>
                              <p className="text-gray-600 text-xs sm:text-sm">Professional Experience</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Subjects */}
                    {tutorProfile.subjects && tutorProfile.subjects.length > 0 && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Subjects I Teach</h3>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {tutorProfile.subjects.map((subject, index) => (
                            <span
                              key={index}
                              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium break-words"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Teaching Approach */}
                    {tutorProfile.teachingExperience !== null && tutorProfile.teachingExperience !== undefined && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Teaching Approach</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconUsers size={16} className="text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm">Interactive Learning</h4>
                              <p className="text-gray-600 text-xs">Hands-on problem solving</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <IconClock size={16} className="text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm">Flexible Scheduling</h4>
                              <p className="text-gray-600 text-xs">Accommodates your schedule</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Courses Tab */}
                {activeTab === 'courses' && (
                  <div>
                    {courses.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {courses.map((course) => (
                          <Link
                            key={course.id}
                            to={`/course/${course.id}`}
                            className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-blue-300"
                          >
                            <div className="h-32 sm:h-40 bg-gradient-to-br from-blue-500 to-indigo-600 relative overflow-hidden">
                              {course.image ? (
                                <img 
                                  src={course.image} 
                                  alt={course.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                  <span className="text-2xl sm:text-4xl text-white font-bold">
                                    {course.subject.charAt(0)}
                                  </span>
                                </div>
                              )}
                              <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                                <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-medium rounded-full">
                                  {course.subject}
                                </span>
                              </div>
                            </div>

                            <div className="p-3 sm:p-4">
                              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2 line-clamp-2 text-sm sm:text-base">
                                {course.title}
                              </h4>

                              <div className="flex items-center justify-between text-xs sm:text-sm">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  {course.rating > 0 && (
                                    <div className="flex items-center gap-1">
                                      <IconStar size={12} className="sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" />
                                      <span className="text-gray-600">{course.rating.toFixed(1)}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <IconClock size={12} className="sm:w-3.5 sm:h-3.5" />
                                    <span>{course._count.lessons} lessons</span>
                                  </div>
                                </div>
                                <span className="font-bold text-blue-600 text-sm sm:text-lg">${course.price}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 sm:py-12">
                        <IconBookmark size={40} className="sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                        <p className="text-gray-600 text-sm sm:text-base">This tutor hasn't created any courses yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {/* Reviews Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl sm:text-3xl font-bold text-blue-600">{rating.toFixed(1)}</div>
                          <div className="flex items-center justify-center gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <IconStar 
                                key={i} 
                                size={16} 
                                className={i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                              />
                            ))}
                          </div>
                          <div className="text-xs text-gray-600">Overall Rating</div>
                        </div>
                        <div>
                          <div className="text-2xl sm:text-3xl font-bold text-green-600">{reviews.length}</div>
                          <div className="text-xs text-gray-600">Total Reviews</div>
                        </div>
                        <div>
                          <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                            {reviews.length > 0 ? Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100) : 0}%
                          </div>
                          <div className="text-xs text-gray-600">Recommend Rate</div>
                        </div>
                      </div>
                    </div>

                    {/* Reviews List */}
                    {reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                                  {review.student.studentProfile?.firstName?.[0] || 'S'}
                                  {review.student.studentProfile?.lastName?.[0] || 'T'}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {review.student.studentProfile?.firstName || 'Student'} {review.student.studentProfile?.lastName || ''}
                                  </h4>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span>{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    <span>•</span>
                                    <span className="text-blue-600">{review.course.title}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <IconStar 
                                    key={i} 
                                    size={14} 
                                    className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                                  />
                                ))}
                              </div>
                            </div>
                            
                            {review.title && (
                              <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                            )}
                            
                            {review.content && (
                              <p className="text-gray-700 text-sm leading-relaxed">{review.content}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 sm:py-12">
                        <IconStar size={40} className="sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                        <p className="text-gray-600 text-sm sm:text-base">Be the first to leave a review for this tutor.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-4">
            <div className="sticky top-4 sm:top-6 space-y-4 sm:space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Stats</h3>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">{rating.toFixed(1)}</div>
                    <div className="text-xs text-gray-600">Rating</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{totalStudents}+</div>
                    <div className="text-xs text-gray-600">Students</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-purple-600">{courses.length}</div>
                    <div className="text-xs text-gray-600">Courses</div>
                  </div>
                  {tutorProfile.teachingExperience !== null && tutorProfile.teachingExperience !== undefined && (
                    <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-orange-600">{tutorProfile.teachingExperience}</div>
                      <div className="text-xs text-gray-600">Years Exp</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing & Sessions */}
              {tutorProfile.hourlyRate !== null && tutorProfile.hourlyRate !== undefined && tutorProfile.sessionTypes && tutorProfile.sessionTypes.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Session Options</h3>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {/* One-on-One Session */}
                    {tutorProfile.sessionTypes.includes('Individual') && (
                      <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">1-on-1 Session</h4>
                            <p className="text-gray-600 text-xs sm:text-sm">Personal tutoring session</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg sm:text-xl font-bold text-blue-600">
                              {tutorProfile.hourlyRate > 0 ? `$${tutorProfile.hourlyRate}` : 'Free'}
                            </div>
                            <div className="text-xs text-gray-500">/hour</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                          <IconClock size={12} />
                          <span>60 minutes</span>
                          <IconUsers size={12} />
                          <span>1 student</span>
                        </div>
                        {(isStudent || isGuest) && (
                          <button 
                            onClick={isStudent ? handleBookSession : () => navigate('/login')}
                            className="w-full bg-blue-600 text-white py-2 rounded-sm hover:bg-blue-700 font-medium transition-colors text-xs sm:text-sm"
                          >
                            {isStudent ? 'Book Session' : 'Login to Book'}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Group Session */}
                    {tutorProfile.sessionTypes.includes('Group') && (
                      <div className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Group Session</h4>
                            <p className="text-gray-600 text-xs sm:text-sm">Small group learning</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg sm:text-xl font-bold text-green-600">
                              {tutorProfile.hourlyRate > 0 ? `$${Math.round(tutorProfile.hourlyRate * 0.7)}` : 'Free'}
                            </div>
                            <div className="text-xs text-gray-500">/hour</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                          <IconClock size={12} />
                          <span>90 minutes</span>
                          <IconUsers size={12} />
                          <span>2-4 students</span>
                        </div>
                        {(isStudent || isGuest) && (
                          <button 
                            onClick={isStudent ? handleBookSession : () => navigate('/login')}
                            className="w-full border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 font-medium transition-colors text-xs sm:text-sm"
                          >
                            {isStudent ? 'Join Group' : 'Login to Join'}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Trial Session */}
                    {tutorProfile.sessionTypes.includes('Trial') && (
                      <div className="border border-green-200 bg-green-50 rounded-lg p-3 sm:p-4 relative">
                        <div className="absolute top-2 right-2">
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Popular</span>
                        </div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Trial Session</h4>
                            <p className="text-gray-600 text-xs sm:text-sm">First session discount</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg sm:text-xl font-bold text-green-600">
                              {tutorProfile.hourlyRate > 0 ? `$${Math.round(tutorProfile.hourlyRate * 0.5)}` : 'Free'}
                            </div>
                            <div className="text-xs text-gray-500">/hour</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                          <IconClock size={12} />
                          <span>30 minutes</span>
                          <IconUsers size={12} />
                          <span>1 student</span>
                        </div>
                        {(isStudent || isGuest) && (
                          <button 
                            onClick={isStudent ? handleBookSession : () => navigate('/login')}
                            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 font-medium transition-colors text-xs sm:text-sm"
                          >
                            {isStudent ? 'Book Trial' : 'Login for Trial'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Teaching Schedule</h3>
                
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Availability</span>
                    <span className={`font-medium ${tutorProfile.verificationStatus === 'APPROVED' ? 'text-green-600' : 'text-orange-600'}`}>
                      {tutorProfile.verificationStatus === 'APPROVED' ? 'Available' : 'Pending Verification'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Response time</span>
                    <span className="text-gray-900">Usually responds quickly</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="text-gray-900">{tutorProfile.teachingExperience || 0} years</span>
                  </div>
                </div>

                {isStudent && (
                  <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                    <button 
                      onClick={handleBookSession}
                      className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-md sm:rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm sm:text-base"
                    >
                      Schedule Session
                    </button>
                    <button 
                      onClick={handleMessage}
                      className="w-full border border-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-md sm:rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm sm:text-base"
                    >
                      Send Message
                    </button>
                  </div>
                )}

                {isGuest && (
                  <button 
                    onClick={() => navigate('/login', { state: { from: { pathname: `/teachers/${id}` } } })}
                    className="w-full mt-4 sm:mt-6 bg-blue-600 text-white py-2.5 sm:py-3 rounded-md sm:rounded-lg hover:bg-blue-700 font-medium transition-colors text-sm sm:text-base"
                  >
                    Login to Contact
                  </button>
                )}
              </div>

              {/* Recent Activity */}
              {sessions.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Recent Activity</h3>
                  
                  <div className="space-y-3">
                    {sessions.slice(0, 5).map((session) => (
                      <div key={session.id} className="flex items-start gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          session.status === 'COMPLETED' ? 'bg-green-500' : 
                          session.status === 'CONFIRMED' ? 'bg-blue-500' : 
                          session.status === 'PENDING' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{session.subject}</h4>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              session.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                              session.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' : 
                              session.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {session.status}
                            </span>
                          </div>
                          {session.topic && (
                            <p className="text-[10px] sm:text-xs text-gray-600 truncate mb-1">{session.topic}</p>
                          )}
                          <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            <IconCalendar size={10} className="sm:w-3 sm:h-3" />
                            <span>{new Date(session.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            <span>•</span>
                            <span>{session.duration} min</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {sessions.length > 5 && (
                    <div className="mt-3 text-center">
                      <span className="text-xs text-gray-500">+{sessions.length - 5} more sessions</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailPage;
