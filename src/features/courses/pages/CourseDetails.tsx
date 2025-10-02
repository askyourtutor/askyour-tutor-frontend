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
  IconFileText,
  IconVideo
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
  const [expandedSyllabus, setExpandedSyllabus] = useState<string[]>([]);
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

  const toggleSyllabus = (syllabusId: string) => {
    setExpandedSyllabus(prev => 
      prev.includes(syllabusId) 
        ? prev.filter(id => id !== syllabusId)
        : [...prev, syllabusId]
    );
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Back button */}
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              <IconArrowLeft size={20} />
              <span className="hidden sm:inline">Back</span>
            </button>

            {/* Center: Course title (hidden on mobile) */}
            <div className="hidden lg:flex items-center gap-3 flex-1 max-w-xl mx-8">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isSaved 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <IconHeart size={20} className={isSaved ? 'fill-current' : ''} />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
                <IconShare3 size={20} />
              </button>
              <button className="hidden sm:inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg ml-2">
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Main Content Area - 8 columns */}
          <div className="lg:col-span-8 space-y-6">
            
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
                    <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-lg px-3 py-2">
                            <IconClock size={18} />
                            <span className="font-medium">{totalDuration} min</span>
                          </div>
                          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-lg px-3 py-2">
                            <IconBook size={18} />
                            <span className="font-medium">{course.lessons.length} lessons</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-lg px-3 py-2">
                          {renderStars(course.rating)}
                          <span className="font-semibold ml-1">{course.rating.toFixed(1)}</span>
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
            <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8 border border-gray-200">
              {/* Tags & Code */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded">
                  {course.subject}
                </span>
                {course.code && (
                  <span className="inline-flex items-center bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded font-mono">
                    {course.code}
                  </span>
                )}
                <span className="inline-flex items-center bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded">
                  All Levels
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
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
              <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <IconBook size={16} />
                  <span>{course.lessons.length} Lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconClock size={16} />
                  <span>{totalDuration} Minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconUsers size={16} />
                  <span>1,234+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconTrophy size={16} />
                  <span>Certificate</span>
                </div>
              </div>

              {/* Tutor Profile */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <img
                  src={course.tutor.avatar || '/assets/img/course/author.png'}
                  alt={course.tutor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Taught by</p>
                  <h3 className="font-semibold text-gray-900">{course.tutor.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      {renderStars(course.rating)}
                      <span className="text-sm text-gray-700 ml-1">{course.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  <IconMessageCircle size={16} />
                  Message
                </button>
              </div>
            </div>

            {/* Tabbed Content */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 bg-gray-50">
                <nav className="flex overflow-x-auto">
                  {[
                    { id: 'overview', label: 'Overview', icon: IconFileText },
                    { id: 'syllabus', label: 'Syllabus', icon: IconBook },
                    { id: 'resources', label: 'Resources', icon: IconDownload },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 ${
                          activeTab === tab.id
                            ? 'border-blue-600 text-blue-600 bg-white'
                            : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-white/70'
                        }`}
                      >
                        <Icon size={18} />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6 lg:p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Description */}
                    <div>
                      <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                        <IconFileText size={24} className="text-blue-600" />
                        About This Course
                      </h3>
                      <div className="prose prose-gray max-w-none">
                        <p className={`text-gray-700 leading-relaxed text-base ${!showFullDescription ? 'line-clamp-4' : ''}`}>
                          {activeLesson?.description || course.description}
                        </p>
                        {(activeLesson?.description || course.description).length > 200 && (
                          <button
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 mt-3 font-semibold text-sm transition-colors"
                          >
                            {showFullDescription ? (
                              <>Show less <IconChevronUp size={16} /></>
                            ) : (
                              <>Show more <IconChevronDown size={16} /></>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* What You'll Learn */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">
                        What You'll Learn
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[
                          'Master core concepts and fundamentals',
                          'Build practical, real-world projects',
                          'Learn industry best practices',
                          'Get certification upon completion',
                          'Access to exclusive resources',
                          'Lifetime course access'
                        ].map((item, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <IconCheck size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Requirements</h3>
                      <ul className="space-y-2">
                        {[
                          'No prior experience required',
                          'Computer with internet connection',
                          'Willingness to learn and practice'
                        ].map((req, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-700">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'syllabus' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <IconBook size={24} className="text-blue-600" />
                        Course Syllabus
                      </h3>
                      <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
                        {course.lessons.length} lessons • {totalDuration}m
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {course.lessons.map((item, index) => {
                        const isExpanded = expandedSyllabus.includes(item.id);
                        return (
                          <div 
                            key={item.id} 
                            className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                              isExpanded ? 'border-blue-300 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                            }`}
                          >
                            <button
                              onClick={() => toggleSyllabus(item.id)}
                              className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 transition-colors"
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                                  isExpanded ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 text-base mb-1">{item.title}</h4>
                                  <div className="flex flex-wrap items-center gap-3">
                                    {item.duration && (
                                      <span className="text-sm text-gray-600 flex items-center gap-1">
                                        <IconClock size={14} />
                                        {item.duration} min
                                      </span>
                                    )}
                                    {item.isPublished ? (
                                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                                        Available
                                      </span>
                                    ) : (
                                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                                        Coming Soon
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <IconVideo size={20} className="text-gray-400" />
                                {isExpanded ? (
                                  <IconChevronUp size={20} className="text-gray-400" />
                                ) : (
                                  <IconChevronDown size={20} className="text-gray-400" />
                                )}
                              </div>
                            </button>
                            
                            {isExpanded && (
                              <div className="px-5 pb-5 border-t border-gray-100 bg-gradient-to-br from-gray-50 to-blue-50/20">
                                <div className="pt-5 space-y-4">
                                  {item.description && (
                                    <div>
                                      <h5 className="font-semibold text-gray-900 mb-2 text-sm">Description</h5>
                                      <p className="text-gray-700 text-sm leading-relaxed">
                                        {item.description}
                                      </p>
                                    </div>
                                  )}
                                  {item.content && (
                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                      <h5 className="font-semibold text-gray-900 mb-2 text-sm">Lesson Content</h5>
                                      <div className="text-gray-700 text-sm whitespace-pre-wrap line-clamp-3">
                                        {item.content}
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex gap-2 pt-2">
                                    <button className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm">
                                      Start Lesson
                                    </button>
                                    <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm">
                                      Preview
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'resources' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <IconDownload size={24} className="text-blue-600" />
                        Downloadable Resources
                      </h3>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                        Download All
                      </button>
                    </div>
                    
                    <div className="grid gap-3">
                      {course.lessons.slice(0, 5).map((l) => (
                        <div 
                          key={l.id} 
                          className="flex items-center justify-between p-5 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow">
                              <IconFileText size={24} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">{l.title}</h4>
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                {l.duration && (
                                  <span className="flex items-center gap-1">
                                    <IconClock size={14} />
                                    {l.duration}m
                                  </span>
                                )}
                                <span>PDF • 2.4 MB</span>
                              </div>
                            </div>
                          </div>
                          <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200">
                            <IconDownload size={18} />
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
            <div className="sticky top-24 space-y-6">

              {/* Course Content List */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <IconBook size={18} className="text-gray-600" />
                      Course Content
                    </h3>
                    <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full font-medium border border-gray-200">
                      {course.lessons.length}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
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
                          className={`w-full text-left p-4 rounded-lg border transition-all duration-200 group ${
                            isActive 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium flex-shrink-0 transition-colors ${
                              isActive 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-semibold line-clamp-2 text-sm mb-1 ${
                                isActive ? 'text-blue-900' : 'text-gray-900'
                              }`}>
                                {l.title}
                              </p>
                              {l.description && (
                                <p className="text-xs text-gray-600 line-clamp-1 mb-2">
                                  {l.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2">
                                {l.duration && (
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <IconClock size={12} />
                                    {l.duration}m
                                  </span>
                                )}
                                {l.isPublished ? (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                                    Available
                                  </span>
                                ) : (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                                    Soon
                                  </span>
                                )}
                              </div>
                            </div>
                            {isActive && (
                              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <IconPlayerPlay size={16} className="text-white ml-0.5" />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <IconShare3 size={18} className="text-gray-600" />
                  Share This Course
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Help others discover this course.
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm border border-gray-200">
                    Copy Link
                  </button>
                  <button className="w-10 h-10 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center border border-gray-200">
                    <IconShare3 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA - Fixed Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-gray-600 mb-0.5">Course Price</p>
            <p className="text-2xl font-bold text-gray-900">${course.price}</p>
          </div>
          <button className="flex-1 bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all duration-200 shadow-md">
            Enroll Now
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
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