import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  IconArrowLeft,
  IconStar,
  IconShare3,
  IconPlayerPlay,
  IconDownload,
  IconChevronDown,
  IconChevronUp,
  IconClock,
  IconBook,
  IconUsers,
  IconCheck,
  IconTrophy,
  IconHeart,
  IconMessageCircle,
  IconFileText
} from '@tabler/icons-react';

// API types (matches GET /api/courses/:id)
interface ApiLesson {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  duration: number | null;
  orderIndex: number;
  isPublished: boolean;
}

interface ApiCourse {
  id: string;
  title: string;
  description: string;
  subject: string;
  code: string | null;
  image: string | null;
  price: number;
  rating: number;
  tutor: { id: string; name: string; avatar: string | null };
  lessons: ApiLesson[];
}

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const base = (import.meta.env.VITE_API_URL as string) || '/api';
        const url = new URL(`${base.replace(/\/$/, '')}/courses/${id}`, window.location.origin);
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Failed to load course');
        const json = await res.json();
        const data: ApiCourse = json.data;
        setCourse(data);
        if (data.lessons && data.lessons.length > 0) setActiveLessonId(data.lessons[0].id);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <IconStar
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
      />
    ));
  };

  const activeLesson: ApiLesson | undefined = course?.lessons.find(l => l.id === activeLessonId);
  const videoSrc = '/assets/video/course-preview.mp4';
  const videoThumb = course?.image || '/assets/img/course/course_1.jpg';
  const totalDuration = course?.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0) || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <IconBook size={40} className="text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Course Not Found</h2>
          <p className="text-gray-600 mb-8">The course you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/courses')}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <IconArrowLeft size={20} />
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Sticky Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back button */}
            <button
              onClick={() => navigate(-1)}
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
              <h1 className="text-base font-semibold text-gray-900 truncate">
                {course.title}
              </h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsSaved(!isSaved)}
                className={`p-2 rounded-sm transition-all duration-200 ${
                  isSaved 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <IconHeart size={20} className={isSaved ? 'fill-current' : ''} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-sm transition-all duration-200">
                <IconShare3 size={20} />
              </button>
              <button className="hidden sm:inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-sm font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg ml-2">
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="mx-auto px-3 sm:px-4 md:px-6 lg:px-12 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Main Content Area - 8 columns */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            
            {/* Video Player Section */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
              <div className="relative aspect-video bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                {!isVideoPlaying ? (
                  <div className="relative w-full h-full group cursor-pointer" onClick={() => setIsVideoPlaying(true)}>
                    <img
                      src={videoThumb}
                      alt="Course preview"
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-150"></div>
                        <button className="relative w-20 h-20 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-2xl">
                          <IconPlayerPlay size={36} className="text-blue-600 ml-1" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Info Bar */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-white gap-2 sm:gap-0">
                        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                          <div className="flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-md rounded-sm px-2 sm:px-3 py-1.5 sm:py-2">
                            <IconClock size={16} className="sm:w-[18px] sm:h-[18px]" />
                            <span className="font-medium text-xs sm:text-sm">{totalDuration} min</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-md rounded-sm px-2 sm:px-3 py-1.5 sm:py-2">
                            <IconBook size={16} className="sm:w-[18px] sm:h-[18px]" />
                            <span className="font-medium text-xs sm:text-sm">{course.lessons.length} lessons</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-md rounded-sm px-2 sm:px-3 py-1.5 sm:py-2">
                          <div className="flex gap-0.5">
                            {renderStars(course.rating)}
                          </div>
                          <span className="font-semibold ml-1 text-xs sm:text-sm">{course.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <video
                    controls
                    autoPlay
                    className="w-full h-full"
                    src={videoSrc}
                    onEnded={() => setIsVideoPlaying(false)}
                  />
                )}
              </div>
            </div>


            {/* Course Header Card */}
            <div className="bg-white rounded-sm shadow-sm p-3 sm:p-4 lg:p-6 border border-gray-200">
              {/* Tags & Code */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-sm">
                  {course.subject}
                </span>
                {course.code && (
                  <span className="inline-flex items-center bg-gray-50 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-sm font-mono">
                    {course.code}
                  </span>
                )}
                <span className="inline-flex items-center bg-green-50 text-green-600 text-xs font-medium px-2.5 py-1 rounded-sm">
                  All Levels
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                {activeLesson ? (
                  <>
                    {course.title}
                    <span className="text-blue-600"> • </span>
                    <span className="text-gray-600">{activeLesson.title}</span>
                  </>
                ) : (
                  course.title
                )}
              </h1>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <IconBook size={14} className="sm:w-4 sm:h-4" />
                  <span>{course.lessons.length} Lessons</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <IconClock size={14} className="sm:w-4 sm:h-4" />
                  <span>{totalDuration} Minutes</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <IconUsers size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">1,234+ Students</span>
                  <span className="sm:hidden">1.2k+ Students</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <IconTrophy size={14} className="sm:w-4 sm:h-4" />
                  <span>Certificate</span>
                </div>
              </div>

              {/* Tutor Profile */}
              <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-sm border border-gray-200">
                <img
                  src={course.tutor.avatar || '/assets/img/course/author.png'}
                  alt={course.tutor.name}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Taught by</p>
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{course.tutor.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {renderStars(course.rating)}
                      <span className="text-xs sm:text-sm text-gray-700 ml-1">{course.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <button className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-sm font-medium hover:bg-gray-100 transition-colors text-sm flex-shrink-0">
                  <IconMessageCircle size={16} />
                  Message
                </button>
              </div>
            </div>

            {/* Tabbed Content */}
            <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <nav className="flex overflow-x-auto scrollbar-hide">
                  {[
                    { id: 'overview', label: 'Overview', icon: IconFileText },
                    { id: 'reviews', label: 'Reviews', icon: IconStar },
                    { id: 'qna', label: 'Q&A', icon: IconMessageCircle },
                    { id: 'resources', label: 'Resources', icon: IconDownload },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 text-[11px] sm:text-xs md:text-sm font-bold whitespace-nowrap border-b-2 sm:border-b-3 transition-all duration-300 flex-1 sm:flex-none min-w-0 ${
                          activeTab === tab.id
                            ? 'border-blue-600 text-blue-600 bg-white shadow-sm'
                            : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-white/50'
                        }`}
                      >
                        <Icon size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] flex-shrink-0" />
                        <span className="truncate">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-2 sm:p-3 md:p-4 lg:p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-3 sm:space-y-4 md:space-y-6">
                    {/* Course Metadata */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 animate-fadeIn">
                      {/* University/Institution */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-sm p-2 sm:p-3 md:p-4 border border-blue-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-blue-600 rounded-sm flex items-center justify-center flex-shrink-0">
                            <IconBook size={16} className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] sm:text-xs text-blue-600 font-semibold mb-0.5 sm:mb-1">University</p>
                            <h4 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 line-clamp-2">
                              University of Colombo
                            </h4>
                          </div>
                        </div>
                      </div>

                      {/* Difficulty Level */}
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-sm p-2 sm:p-3 md:p-4 border border-amber-200">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-amber-600 rounded-sm flex items-center justify-center flex-shrink-0">
                            <IconTrophy size={16} className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] sm:text-xs text-amber-600 font-semibold mb-0.5 sm:mb-1">Difficulty</p>
                            <h4 className="text-sm sm:text-base font-bold text-gray-900">
                              Intermediate
                            </h4>
                          </div>
                        </div>
                      </div>

                      {/* Course Stats */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-sm p-2 sm:p-3 md:p-4 border border-green-200 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-green-600 rounded-sm flex items-center justify-center flex-shrink-0">
                            <IconUsers size={16} className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] sm:text-xs text-green-600 font-semibold mb-0.5 sm:mb-1">Students</p>
                            <h4 className="text-sm sm:text-base font-bold text-gray-900">
                              1,234+ Enrolled
                            </h4>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Course Objectives */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-sm p-2 sm:p-3 md:p-4 border border-purple-200 animate-fadeIn">
                      <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-900 flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-purple-600 rounded-sm flex items-center justify-center">
                          <IconCheck size={16} className="text-white" />
                        </div>
                        <span>Course Objectives</span>
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-3">
                        {[
                          'Understand fundamental principles and theories',
                          'Apply concepts to solve real-world problems',
                          'Develop critical thinking and analytical skills',
                          'Master laboratory techniques and procedures'
                        ].map((objective, i) => (
                          <div key={i} className="flex items-start gap-1.5 sm:gap-2 md:gap-2.5 bg-white rounded-sm p-2 sm:p-2.5 border border-purple-100">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-purple-600 font-bold text-[10px] sm:text-xs">{i + 1}</span>
                            </div>
                            <span className="text-gray-700 text-[11px] sm:text-xs md:text-sm font-medium">{objective}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="animate-fadeIn">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 text-gray-900 flex items-center gap-1.5 sm:gap-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-sm flex items-center justify-center">
                          <IconFileText size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-600" />
                        </div>
                        <span>About This Course</span>
                      </h3>
                      <div className="prose prose-gray max-w-none bg-gray-50 rounded-sm p-2.5 sm:p-3 md:p-4 border border-gray-200">
                        <p className={`text-gray-700 leading-relaxed text-xs sm:text-sm md:text-base ${!showFullDescription ? 'line-clamp-3 sm:line-clamp-4' : ''}`}>
                          {activeLesson?.description || course.description}
                        </p>
                        {(activeLesson?.description || course.description).length > 200 && (
                          <button
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 mt-2 sm:mt-3 font-semibold text-[11px] sm:text-xs md:text-sm transition-all hover:gap-2"
                          >
                            {showFullDescription ? (
                              <>Show less <IconChevronUp size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" /></>
                            ) : (
                              <>Show more <IconChevronDown size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" /></>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* What You'll Learn */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-sm p-2.5 sm:p-3 md:p-4 animate-fadeIn">
                      <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-900 flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-green-600 rounded-sm flex items-center justify-center">
                          <IconCheck size={16} className="text-white" />
                        </div>
                        <span>What You'll Learn</span>
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-2.5 sm:gap-3">
                        {[
                          'Master core concepts and fundamentals',
                          'Build practical, real-world projects',
                          'Learn industry best practices',
                          'Get certification upon completion',
                          'Access to exclusive resources',
                          'Lifetime course access'
                        ].map((item, i) => (
                          <div key={i} className="flex items-start gap-1.5 sm:gap-2 md:gap-2.5 bg-white rounded-sm p-2 sm:p-2.5 border border-green-100 hover:border-green-300 transition-colors">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <IconCheck size={10} className="sm:w-3 sm:h-3 text-green-600" />
                            </div>
                            <span className="text-gray-700 text-[11px] sm:text-xs md:text-sm font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="animate-fadeIn">
                      <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-900 flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-purple-100 rounded-sm flex items-center justify-center">
                          <IconTrophy size={14} className="sm:w-4 sm:h-4 text-purple-600" />
                        </div>
                        <span>Requirements</span>
                      </h3>
                      <div className="bg-purple-50 rounded-sm p-2.5 sm:p-3 md:p-4 border border-purple-200">
                        <ul className="space-y-2 sm:space-y-2.5">
                          {[
                            'No prior experience required',
                            'Computer with internet connection',
                            'Willingness to learn and practice'
                          ].map((req, i) => (
                            <li key={i} className="flex items-start gap-2 sm:gap-2.5 text-gray-700">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                              <span className="text-[11px] sm:text-xs md:text-sm font-medium">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Available Tutors Section */}
                    <div className="animate-fadeIn">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
                        <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-indigo-100 rounded-sm flex items-center justify-center">
                            <IconUsers size={14} className="sm:w-4 sm:h-4 text-indigo-600" />
                          </div>
                          <span>Available Tutors for This Course</span>
                        </h3>
                        <button className="text-[11px] sm:text-xs md:text-sm text-indigo-600 hover:text-indigo-700 font-bold bg-indigo-50 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-sm hover:bg-indigo-100 transition-all border border-indigo-200 self-start sm:self-auto">
                          View All Tutors
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5 md:gap-3">
                        {/* Tutor Card 1 - Current Tutor */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-sm p-2 sm:p-2.5 md:p-3 border-2 border-blue-300 hover:border-blue-400 transition-all duration-300 group">
                          <div className="flex items-start gap-3 mb-3">
                            <img
                              src={course.tutor.avatar || '/assets/img/course/author.png'}
                              alt={course.tutor.name}
                              className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-blue-400"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-gray-900 text-[11px] sm:text-xs md:text-sm truncate">{course.tutor.name}</h4>
                                <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[9px] sm:text-[10px] font-bold rounded-sm">
                                  TEACHING
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mb-1">
                                {renderStars(course.rating)}
                                <span className="text-[10px] sm:text-xs text-gray-700 font-semibold ml-0.5 sm:ml-1">{course.rating.toFixed(1)}</span>
                              </div>
                              <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600">PhD in Chemistry</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-gray-600">Starting from</span>
                            <span className="text-sm sm:text-base md:text-lg font-bold text-blue-600">${course.price}/hr</span>
                          </div>
                          <button className="w-full bg-blue-600 text-white py-1 sm:py-1.5 md:py-2 rounded-sm font-bold text-[11px] sm:text-xs md:text-sm hover:bg-blue-700 transition-all hover:shadow-md">
                            Book Session
                          </button>
                        </div>

                        {/* Tutor Card 2 */}
                        <div className="bg-white rounded-sm p-4 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 group">
                          <div className="flex items-start gap-3 mb-3">
                            <img
                              src="/assets/img/course/author.png"
                              alt="Dr. Sarah Johnson"
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-indigo-300"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-gray-900 text-[11px] sm:text-xs md:text-sm truncate">Dr. Sarah Johnson</h4>
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-sm">
                                  VERIFIED
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mb-1">
                                {renderStars(4.9)}
                                <span className="text-[10px] sm:text-xs text-gray-700 font-semibold ml-0.5 sm:ml-1">4.9</span>
                              </div>
                              <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600">MSc, 8 years exp</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-gray-600">Starting from</span>
                            <span className="text-sm sm:text-base md:text-lg font-bold text-indigo-600">$45/hr</span>
                          </div>
                          <button className="w-full bg-indigo-600 text-white py-2 rounded-sm font-bold text-sm hover:bg-indigo-700 transition-all hover:shadow-md">
                            Book Session
                          </button>
                        </div>

                        {/* Tutor Card 3 */}
                        <div className="bg-white rounded-sm p-4 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 group">
                          <div className="flex items-start gap-3 mb-3">
                            <img
                              src="/assets/img/course/author.png"
                              alt="Prof. Michael Chen"
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-indigo-300"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-gray-900 text-[11px] sm:text-xs md:text-sm truncate">Prof. Michael Chen</h4>
                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-sm">
                                  VERIFIED
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mb-1">
                                {renderStars(4.8)}
                                <span className="text-xs text-gray-700 font-semibold ml-1">4.8</span>
                              </div>
                              <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600">PhD, 12 years exp</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-gray-600">Starting from</span>
                            <span className="text-sm sm:text-base md:text-lg font-bold text-indigo-600">$55/hr</span>
                          </div>
                          <button className="w-full bg-indigo-600 text-white py-2 rounded-sm font-bold text-sm hover:bg-indigo-700 transition-all hover:shadow-md">
                            Book Session
                          </button>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="mt-2 sm:mt-3 p-2 sm:p-2.5 md:p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-sm border border-indigo-200">
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6 text-center">
                          <div>
                            <p className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-600">8</p>
                            <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 font-medium">Total Tutors</p>
                          </div>
                          <div className="w-px h-8 bg-indigo-200"></div>
                          <div>
                            <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">4.8</p>
                            <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 font-medium">Avg Rating</p>
                          </div>
                          <div className="w-px h-8 bg-indigo-200"></div>
                          <div>
                            <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">$35-65</p>
                            <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 font-medium">Price Range</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Reviews Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-sm flex items-center justify-center">
                            <IconStar size={18} className="sm:w-6 sm:h-6 text-amber-600" />
                          </div>
                          <span>Student Reviews</span>
                        </h3>
                        <p className="text-sm text-gray-600">Based on 234 reviews</p>
                      </div>
                      <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-bold bg-blue-50 px-4 py-2.5 rounded-sm hover:bg-blue-100 transition-all border border-blue-200 self-start sm:self-auto">
                        Write a Review
                      </button>
                    </div>

                    {/* Rating Summary */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-sm p-6 border border-amber-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Overall Rating */}
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="text-6xl font-bold text-amber-600 mb-2">{course.rating.toFixed(1)}</div>
                          <div className="flex items-center gap-1 mb-2">
                            {renderStars(course.rating)}
                          </div>
                          <p className="text-sm text-gray-600 font-medium">Overall Course Rating</p>
                        </div>

                        {/* Rating Breakdown */}
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => {
                            const percentage = rating === 5 ? 75 : rating === 4 ? 18 : rating === 3 ? 5 : rating === 2 ? 2 : 0;
                            return (
                              <div key={rating} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-16">
                                  <span className="text-sm font-semibold text-gray-700">{rating}</span>
                                  <IconStar size={14} className="text-amber-500 fill-amber-500" />
                                </div>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-12 text-right">{percentage}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Individual Reviews */}
                    <div className="space-y-4">
                      {/* Review 1 */}
                      <div className="bg-white rounded-sm p-4 sm:p-5 border border-gray-200 hover:border-gray-300 transition-colors">
                        <div className="flex items-start gap-3 sm:gap-4 mb-3">
                          <img
                            src="/assets/img/course/author.png"
                            alt="Student"
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                              <h4 className="font-bold text-gray-900 text-sm sm:text-base">Emily Rodriguez</h4>
                              <span className="text-xs text-gray-500">2 weeks ago</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {renderStars(5)}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              Excellent course! The tutor explains complex concepts in a very understandable way. The materials provided are comprehensive and the practice problems really helped me prepare for my exams. Highly recommended!
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 ml-14 sm:ml-16">
                          <button className="hover:text-blue-600 transition-colors font-medium">Helpful (24)</button>
                          <button className="hover:text-blue-600 transition-colors font-medium">Reply</button>
                        </div>
                      </div>

                      {/* Review 2 */}
                      <div className="bg-white rounded-sm p-4 sm:p-5 border border-gray-200 hover:border-gray-300 transition-colors">
                        <div className="flex items-start gap-3 sm:gap-4 mb-3">
                          <img
                            src="/assets/img/course/author.png"
                            alt="Student"
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                              <h4 className="font-bold text-gray-900 text-sm sm:text-base">James Wilson</h4>
                              <span className="text-xs text-gray-500">1 month ago</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {renderStars(4)}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              Great course overall. The content is well-structured and the tutor is very knowledgeable. Would have given 5 stars if there were more practical examples, but still a solid learning experience.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 ml-14 sm:ml-16">
                          <button className="hover:text-blue-600 transition-colors font-medium">Helpful (15)</button>
                          <button className="hover:text-blue-600 transition-colors font-medium">Reply</button>
                        </div>
                      </div>

                      {/* Review 3 */}
                      <div className="bg-white rounded-sm p-4 sm:p-5 border border-gray-200 hover:border-gray-300 transition-colors">
                        <div className="flex items-start gap-3 sm:gap-4 mb-3">
                          <img
                            src="/assets/img/course/author.png"
                            alt="Student"
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                              <h4 className="font-bold text-gray-900 text-sm sm:text-base">Sarah Chen</h4>
                              <span className="text-xs text-gray-500">2 months ago</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {renderStars(5)}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              This course exceeded my expectations! The tutor is patient, responsive, and really cares about student success. The study materials are top-notch and I saw immediate improvement in my grades.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 ml-14 sm:ml-16">
                          <button className="hover:text-blue-600 transition-colors font-medium">Helpful (32)</button>
                          <button className="hover:text-blue-600 transition-colors font-medium">Reply</button>
                        </div>
                      </div>
                    </div>

                    {/* Load More Button */}
                    <div className="text-center pt-4">
                      <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-sm font-bold hover:bg-gray-200 transition-all border border-gray-300">
                        Load More Reviews
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'qna' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Q&A Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-sm flex items-center justify-center">
                            <IconMessageCircle size={18} className="sm:w-6 sm:h-6 text-purple-600" />
                          </div>
                          <span>Questions & Answers</span>
                        </h3>
                        <p className="text-sm text-gray-600">42 questions about this course</p>
                      </div>
                      <button className="text-xs sm:text-sm text-white bg-purple-600 hover:bg-purple-700 font-bold px-4 py-2.5 rounded-sm transition-all shadow-md hover:shadow-lg self-start sm:self-auto">
                        Ask a Question
                      </button>
                    </div>

                    {/* Quick Question Form */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-sm p-4 sm:p-6 border border-purple-200">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <IconCheck size={16} className="text-purple-600" />
                        <span>Have a quick question?</span>
                      </h4>
                      <form className="space-y-3">
                        <input
                          type="text"
                          placeholder="What would you like to know about this course?"
                          className="w-full px-4 py-3 rounded-sm border border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm"
                        />
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            type="submit"
                            className="flex-1 bg-purple-600 text-white py-2.5 rounded-sm font-bold hover:bg-purple-700 transition-all text-sm"
                          >
                            Post Question
                          </button>
                          <button
                            type="button"
                            className="px-6 py-2.5 border-2 border-purple-600 text-purple-600 rounded-sm font-bold hover:bg-purple-50 transition-all text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Filter/Sort Bar */}
                    <div className="flex flex-wrap items-center gap-3">
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-sm font-semibold text-xs hover:bg-purple-700 transition-all">
                        All Questions
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-sm font-semibold text-xs hover:bg-gray-200 transition-all">
                        Unanswered
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-sm font-semibold text-xs hover:bg-gray-200 transition-all">
                        Most Voted
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-sm font-semibold text-xs hover:bg-gray-200 transition-all">
                        Recent
                      </button>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-4">
                      {/* Question 1 */}
                      <div className="bg-white rounded-sm p-4 sm:p-5 border border-gray-200 hover:border-purple-200 transition-all">
                        <div className="flex gap-4">
                          {/* Vote Section */}
                          <div className="flex flex-col items-center gap-2 flex-shrink-0">
                            <button className="w-8 h-8 rounded-sm bg-gray-100 hover:bg-purple-100 flex items-center justify-center transition-colors">
                              <IconChevronUp size={18} className="text-gray-600" />
                            </button>
                            <span className="text-lg font-bold text-gray-900">12</span>
                            <button className="w-8 h-8 rounded-sm bg-gray-100 hover:bg-purple-100 flex items-center justify-center transition-colors">
                              <IconChevronDown size={18} className="text-gray-600" />
                            </button>
                          </div>

                          {/* Question Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-2 hover:text-purple-600 cursor-pointer">
                              What are the prerequisites for this course?
                            </h4>
                            <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                              I'm interested in taking this course but I'm not sure if I have the necessary background. Could someone clarify what knowledge is required before starting?
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-sm">
                                Prerequisites
                              </span>
                              <span className="text-xs text-gray-500">Asked by John Smith • 3 days ago</span>
                            </div>
                            
                            {/* Answer Preview */}
                            <div className="bg-green-50 rounded-sm p-3 border border-green-200 mb-3">
                              <div className="flex items-start gap-2 mb-2">
                                <IconCheck size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm text-gray-700 mb-1">
                                    <span className="font-semibold text-gray-900">Answered by {course.tutor.name}</span>
                                  </p>
                                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                                    Basic understanding of high school chemistry is sufficient. We'll cover all the fundamentals you need in the first few lessons...
                                  </p>
                                </div>
                              </div>
                              <button className="text-xs text-purple-600 hover:text-purple-700 font-semibold">
                                View 2 answers →
                              </button>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <button className="hover:text-purple-600 transition-colors font-medium">
                                <IconMessageCircle size={14} className="inline mr-1" />
                                2 Answers
                              </button>
                              <button className="hover:text-purple-600 transition-colors font-medium">Reply</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Question 2 */}
                      <div className="bg-white rounded-sm p-4 sm:p-5 border border-gray-200 hover:border-purple-200 transition-all">
                        <div className="flex gap-4">
                          {/* Vote Section */}
                          <div className="flex flex-col items-center gap-2 flex-shrink-0">
                            <button className="w-8 h-8 rounded-sm bg-gray-100 hover:bg-purple-100 flex items-center justify-center transition-colors">
                              <IconChevronUp size={18} className="text-gray-600" />
                            </button>
                            <span className="text-lg font-bold text-gray-900">8</span>
                            <button className="w-8 h-8 rounded-sm bg-gray-100 hover:bg-purple-100 flex items-center justify-center transition-colors">
                              <IconChevronDown size={18} className="text-gray-600" />
                            </button>
                          </div>

                          {/* Question Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-2 hover:text-purple-600 cursor-pointer">
                              Are the course materials downloadable?
                            </h4>
                            <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                              I'd like to know if I can download the lecture notes and practice problems for offline study.
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-sm">
                                Resources
                              </span>
                              <span className="text-xs text-gray-500">Asked by Maria Garcia • 1 week ago</span>
                            </div>
                            
                            {/* Answer Preview */}
                            <div className="bg-green-50 rounded-sm p-3 border border-green-200 mb-3">
                              <div className="flex items-start gap-2 mb-2">
                                <IconCheck size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-sm text-gray-700 mb-1">
                                    <span className="font-semibold text-gray-900">Answered by {course.tutor.name}</span>
                                  </p>
                                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-2">
                                    Yes! All course materials including PDFs, practice problems, and formula sheets are available for download...
                                  </p>
                                </div>
                              </div>
                              <button className="text-xs text-purple-600 hover:text-purple-700 font-semibold">
                                View 1 answer →
                              </button>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <button className="hover:text-purple-600 transition-colors font-medium">
                                <IconMessageCircle size={14} className="inline mr-1" />
                                1 Answer
                              </button>
                              <button className="hover:text-purple-600 transition-colors font-medium">Reply</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Question 3 - Unanswered */}
                      <div className="bg-white rounded-sm p-4 sm:p-5 border border-gray-200 hover:border-purple-200 transition-all">
                        <div className="flex gap-4">
                          {/* Vote Section */}
                          <div className="flex flex-col items-center gap-2 flex-shrink-0">
                            <button className="w-8 h-8 rounded-sm bg-gray-100 hover:bg-purple-100 flex items-center justify-center transition-colors">
                              <IconChevronUp size={18} className="text-gray-600" />
                            </button>
                            <span className="text-lg font-bold text-gray-900">5</span>
                            <button className="w-8 h-8 rounded-sm bg-gray-100 hover:bg-purple-100 flex items-center justify-center transition-colors">
                              <IconChevronDown size={18} className="text-gray-600" />
                            </button>
                          </div>

                          {/* Question Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-2 hover:text-purple-600 cursor-pointer">
                              How long does it take to complete this course?
                            </h4>
                            <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                              I'm planning my study schedule and wondering about the typical time commitment needed to finish all lessons.
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-sm">
                                Duration
                              </span>
                              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-sm">
                                Unanswered
                              </span>
                              <span className="text-xs text-gray-500">Asked by Alex Kim • 2 days ago</span>
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <button className="hover:text-purple-600 transition-colors font-medium">
                                <IconMessageCircle size={14} className="inline mr-1" />
                                0 Answers
                              </button>
                              <button className="text-purple-600 hover:text-purple-700 font-bold">Be the first to answer</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Load More Button */}
                    <div className="text-center pt-4">
                      <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-sm font-bold hover:bg-gray-200 transition-all border border-gray-300">
                        Load More Questions
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-sm flex items-center justify-center">
                          <IconDownload size={18} className="sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                        <span>Downloadable Resources</span>
                      </h3>
                      <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-bold bg-blue-50 px-3 sm:px-4 py-2 rounded-sm hover:bg-blue-100 transition-all border border-blue-200 self-start sm:self-auto">
                        Download All
                      </button>
                    </div>
                    
                    <div className="grid gap-2.5 sm:gap-3">
                      {course.lessons.slice(0, 5).map((l) => (
                        <div 
                          key={l.id} 
                          className="flex items-center justify-between p-3 sm:p-4 md:p-5 border border-gray-200 rounded-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-300 group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 flex-1 min-w-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-sm flex items-center justify-center text-white shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 flex-shrink-0">
                              <IconFileText size={18} className="sm:w-6 sm:h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base line-clamp-1">{l.title}</h4>
                              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 flex-wrap">
                                {l.duration && (
                                  <span className="flex items-center gap-1">
                                    <IconClock size={12} className="sm:w-[14px] sm:h-[14px]" />
                                    {l.duration}m
                                  </span>
                                )}
                                <span className="font-medium">PDF • 2.4 MB</span>
                              </div>
                            </div>
                          </div>
                          <button className="flex items-center gap-1.5 sm:gap-2 text-blue-600 hover:text-blue-700 font-bold px-2.5 sm:px-4 py-2 rounded-sm bg-blue-50 hover:bg-blue-100 transition-all duration-200 border border-blue-200 text-xs sm:text-sm flex-shrink-0">
                            <IconDownload size={14} className="sm:w-[18px] sm:h-[18px]" />
                            <span className="hidden sm:inline">Download</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - 4 columns */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-9rem)]">

              {/* Course Content List */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden lg:h-full flex flex-col">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-3.5 border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <IconBook size={16} className="sm:w-[18px] sm:h-[18px] text-blue-600" />
                      Syllabus
                    </h3>
                    <span className="text-xs text-gray-600 bg-white px-2.5 py-1 rounded-full font-semibold border border-gray-300 shadow-sm">
                      {course.lessons.length}
                    </span>
                  </div>
                </div>
                
                <div className="p-2 sm:p-3 flex-1 overflow-hidden">
                  <div className="space-y-1.5 sm:space-y-2 lg:h-full lg:overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                    {course.lessons.map((l, index) => {
                      const isActive = activeLessonId === l.id;
                      return (
                        <button
                          key={l.id}
                          onClick={() => { 
                            setActiveLessonId(l.id); 
                            setIsVideoPlaying(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-full text-left p-2 sm:p-2.5 md:p-3 rounded-lg border transition-all duration-200 group ${
                            isActive 
                              ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm' 
                              : 'border-gray-200 hover:bg-gray-50 hover:border-blue-200 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3">
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-200 ${
                              isActive 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-semibold line-clamp-2 text-xs sm:text-sm mb-1 sm:mb-1.5 ${
                                isActive ? 'text-blue-900' : 'text-gray-900'
                              }`}>
                                {l.title}
                              </p>
                              {l.description && (
                                <p className="hidden sm:block text-xs text-gray-500 line-clamp-1 mb-2">
                                  {l.description}
                                </p>
                              )}
                              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                {l.duration && (
                                  <span className="text-[10px] sm:text-xs text-gray-600 flex items-center gap-0.5 sm:gap-1 font-medium">
                                    <IconClock size={10} className="sm:w-3 sm:h-3 text-gray-500" />
                                    {l.duration}m
                                  </span>
                                )}
                                {l.isPublished ? (
                                  <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
                                    Available
                                  </span>
                                ) : (
                                  <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">
                                    Soon
                                  </span>
                                )}
                              </div>
                            </div>
                            {isActive && (
                              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                                <IconPlayerPlay size={14} className="sm:w-4 sm:h-4 text-white ml-0.5" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA - Fixed Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4 shadow-lg z-40">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5">Course Price</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">${course.price}</p>
          </div>
          <button className="flex-1 bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl font-bold hover:bg-blue-700 transition-all duration-200 shadow-md text-sm sm:text-base">
            Enroll Now
          </button>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        /* Hide the main header navigation section */
        .th-header .sticky-wrapper {
          display: none !important;
        }
        
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CourseDetails;