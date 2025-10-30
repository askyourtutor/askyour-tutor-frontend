import React from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  IconArrowLeft,
  IconStar,
  IconDownload,
  IconClock,
  IconBook,
  IconUsers,
  IconTrophy,
  IconMessageCircle,
  IconFileText
} from '@tabler/icons-react';
import MobileEnrollBar from './components/MobileEnrollBar';
import SidebarSyllabus from './components/SidebarSyllabus';
import TabNav, { type TabItem } from './components/TabNav';
import SyllabusTab from './CourseDetails/tabs/SyllabusTab';
import ResourcesTab from './CourseDetails/tabs/ResourcesTab';
import ReviewsTab from './CourseDetails/tabs/ReviewsTab';
import QnATab from './CourseDetails/tabs/QnATab';
import OverviewTab from './CourseDetails/tabs/OverviewTab';
import HeaderBar from './components/HeaderBar';
import VideoPlayer from './components/VideoPlayer';
import { useCourseDetails } from '../hooks/useCourseDetails';
import type { ApiLesson } from '../types/course.types';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    course,
    isLoading,
    // core UI state
    activeTab,
    setActiveTab,
    showFullDescription,
    setShowFullDescription,
    isVideoPlaying,
    setIsVideoPlaying,
    activeLessonId,
    setActiveLessonId,
    // user state
    isSaved,
    isEnrolled,
    isEnrolling,
    // handlers
    handleSaveToggle,
    handleShare,
    handleEnroll,
    handleBookSession,
  } = useCourseDetails(id);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <IconStar
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
      />
    ));
  };

  // Handler functions are provided by the hook above

  const activeLesson: ApiLesson | undefined = course?.lessons.find(l => l.id === activeLessonId);
  const videoSrc = activeLesson?.videoUrl || course?.previewVideoUrl || undefined;
  const videoThumb = course?.image || undefined;
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
      <HeaderBar
        title={course.title}
        isSaved={isSaved}
        isEnrolled={isEnrolled}
        isEnrolling={isEnrolling}
        onBack={() => navigate(-1)}
        onSave={handleSaveToggle}
        onShare={handleShare}
        onEnroll={handleEnroll}
      />

      {/* Main Content Container */}
      <div className="mx-auto px-3 sm:px-4 md:px-6 lg:px-12 py-4 sm:py-6 lg:py-8 pb-24 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Main Content Area - 8 columns */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            
            {/* Video Player Section */}
            <VideoPlayer
              isPlaying={isVideoPlaying}
              onTogglePlay={(p) => setIsVideoPlaying(p)}
              src={videoSrc}
              poster={videoThumb}
              totalDurationMin={totalDuration}
              lessonsCount={course.lessons.length}
              rating={course.rating}
              renderStars={renderStars}
            />


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
                {course.difficulty && (
                  <span className="inline-flex items-center bg-green-50 text-green-600 text-xs font-medium px-2.5 py-1 rounded-sm">
                    {course.difficulty}
                  </span>
                )}
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
                {typeof course.studentsCount === 'number' && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <IconUsers size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{course.studentsCount.toLocaleString()} Students</span>
                    <span className="sm:hidden">{(Math.round((course.studentsCount / 100) )/10).toFixed(1)}k+ Students</span>
                  </div>
                )}
                {course.certificateAvailable && (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <IconTrophy size={14} className="sm:w-4 sm:h-4" />
                    <span>Certificate</span>
                  </div>
                )}
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
              </div>
            </div>

            {/* Tabbed Content */}
            <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200">
              {/* Tab Navigation */}
              <TabNav
                items={[
                  { id: 'overview', label: 'Overview', icon: IconFileText } as TabItem,
                  { id: 'reviews', label: 'Reviews', icon: IconStar } as TabItem,
                  { id: 'qna', label: 'Q&A', icon: IconMessageCircle } as TabItem,
                  { id: 'syllabus', label: 'Syllabus', icon: IconBook } as TabItem,
                  { id: 'resources', label: 'Resources', icon: IconDownload } as TabItem,
                ]}
                activeTab={activeTab}
                onChange={(id) => setActiveTab(id)}
              />

              {/* Tab Content */}
              <div className="p-2 sm:p-3 md:p-4 lg:p-6">
                {activeTab === 'overview' && (
                  <OverviewTab
                    course={course}
                    activeLesson={activeLesson}
                    showFullDescription={showFullDescription}
                    onToggleDescription={() => setShowFullDescription(!showFullDescription)}
                    renderStars={renderStars}
                    onBookSession={handleBookSession}
                  />
                )}

                {activeTab === 'reviews' && (
                  <ReviewsTab course={course} renderStars={renderStars} />
                )}

                {activeTab === 'qna' && (
                  <QnATab questions={course.qna || []} courseId={course.id} />
                )}

                {activeTab === 'syllabus' && (
                  <SyllabusTab
                    course={course}
                    isEnrolled={isEnrolled}
                    isEnrolling={isEnrolling}
                    onEnroll={handleEnroll}
                    onSelectLesson={(lessonId) => setActiveLessonId(lessonId)}
                    onSwitchToOverview={() => setActiveTab('overview')}
                  />
                )}

                {activeTab === 'resources' && (
                  <ResourcesTab
                    course={course}
                    isEnrolled={isEnrolled}
                    isEnrolling={isEnrolling}
                    onEnroll={handleEnroll}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - 4 columns (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-9rem)]">

              <SidebarSyllabus
                course={course}
                activeLessonId={activeLessonId}
                isEnrolled={isEnrolled}
                isEnrolling={isEnrolling}
                onEnroll={handleEnroll}
                onSelectLesson={(lessonId) => {
                  setActiveLessonId(lessonId);
                  setIsVideoPlaying(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA - Fixed Bottom */}
      <MobileEnrollBar 
        price={course.price}
        isEnrolled={isEnrolled}
        isEnrolling={isEnrolling}
        onEnroll={handleEnroll}
      />

      {/* Custom Styles */}
      <style>{`
        /* Hide the main header navigation section */
        .th-header .sticky-wrapper {
          display: none !important;
        }
        /* Hide decorative blue header backgrounds on this page */
        .th-header .logo-bg-half,
        .th-header .logo-bg {
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