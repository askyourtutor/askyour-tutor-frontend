import { useState, useEffect } from 'react';
import { 
  IconBook, 
  IconUsers, 
  IconCalendarEvent, 
  IconChartBar, 
  IconSettings,
  IconLogout,
  IconMessageCircle
} from '@tabler/icons-react';
import tutorDashboardService, {
  type TutorDashboardStats,
  type RecentSession,
  type RecentReview,
  type CourseWithStats,
  type SessionDetails,
  type Student,
} from '../../../shared/services/tutorDashboardService';
import { useAuth } from '../../../shared/contexts/AuthContext';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import TutorDashboardTab from '../components/TutorDashboardTab';
import TutorCoursesTab from '../components/TutorCoursesTab';
import TutorSessionsTab from '../components/TutorSessionsTab';
import TutorStudentsTab from '../components/TutorStudentsTab';
import TutorQATab from '../components/TutorQATab';

function TutorDashboard() {
  const { user, logout } = useAuth();
  
  // Initialize activeTab from localStorage or default to 'dashboard'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'sessions' | 'students' | 'qa' | 'settings'>(() => {
    const savedTab = localStorage.getItem('tutorDashboard_activeTab');
    return (savedTab as 'dashboard' | 'courses' | 'sessions' | 'students' | 'qa' | 'settings') || 'dashboard';
  });
  
  const [stats, setStats] = useState<TutorDashboardStats>({
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalLessons: 0,
    totalStudents: 0,
    totalSessions: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    pendingSessions: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    avgRating: 0,
    totalReviews: 0,
  });
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [recentReviews, setRecentReviews] = useState<RecentReview[]>([]);
  const [courses, setCourses] = useState<CourseWithStats[]>([]);
  const [sessions, setSessions] = useState<SessionDetails[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [questions, setQuestions] = useState<Array<{
    id: string;
    studentName: string;
    studentEmail: string;
    courseName: string;
    subject: string;
    question: string;
    answer?: string | null;
    status: 'PENDING' | 'ANSWERED';
    createdAt: string;
    answeredAt?: string | null;
  }>>([]);
  const [loading, setLoading] = useState(true);

  // Save activeTab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tutorDashboard_activeTab', activeTab);
  }, [activeTab]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch dashboard stats
        const dashboardStats = await tutorDashboardService.getDashboardStats();
        setStats(dashboardStats);

        // Fetch recent activity
        const activityData = await tutorDashboardService.getRecentActivity();
        setRecentSessions(activityData.recentSessions);
        setRecentReviews(activityData.recentReviews);

        // Fetch courses
        const coursesData = await tutorDashboardService.getTutorCourses();
        setCourses(coursesData);

        // Fetch sessions
        const sessionsData = await tutorDashboardService.getTutorSessions({ limit: 50 });
        setSessions(sessionsData.sessions);

        // Fetch students
        const studentsData = await tutorDashboardService.getTutorStudents();
        setStudents(studentsData);

        // TODO: Fetch Q&A data from backend when API is ready
        // const questionsData = await tutorDashboardService.getQuestions();
        // setQuestions(questionsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Reset to empty state on error
        setStats({
          totalCourses: 0,
          publishedCourses: 0,
          draftCourses: 0,
          totalLessons: 0,
          totalStudents: 0,
          totalSessions: 0,
          upcomingSessions: 0,
          completedSessions: 0,
          pendingSessions: 0,
          totalRevenue: 0,
          monthlyRevenue: 0,
          avgRating: 0,
          totalReviews: 0,
        });
        setRecentSessions([]);
        setRecentReviews([]);
        setCourses([]);
        setSessions([]);
        setStudents([]);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getTutorName = () => {
    if (user?.tutorProfile?.firstName && user?.tutorProfile?.lastName) {
      return `${user.tutorProfile.firstName} ${user.tutorProfile.lastName}`;
    }
    return user?.email?.split('@')[0] || 'Tutor';
  };

  // CRUD Handlers
  const handleCreateCourse = () => {
    // TODO: Open course creation modal
    alert('Course creation modal coming soon!');
  };

  const handleEditCourse = async (course: CourseWithStats) => {
    // TODO: Open course edit modal
    alert(`Edit course: ${course.title}`);
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await tutorDashboardService.deleteCourse(courseId);
      // Refresh courses
      const coursesData = await tutorDashboardService.getTutorCourses();
      setCourses(coursesData);
      // Refresh stats
      const dashboardStats = await tutorDashboardService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. It may have active sessions.');
    }
  };

  const handleTogglePublish = async (courseId: string, isActive: boolean) => {
    try {
      await tutorDashboardService.toggleCoursePublish(courseId, isActive);
      // Refresh courses
      const coursesData = await tutorDashboardService.getTutorCourses();
      setCourses(coursesData);
    } catch (error) {
      console.error('Error toggling course publish status:', error);
    }
  };

  const handleConfirmSession = async (sessionId: string) => {
    try {
      await tutorDashboardService.updateSessionStatus(sessionId, { 
        status: 'CONFIRMED',
        meetingLink: 'https://meet.example.com/' + sessionId 
      });
      // Refresh sessions
      const sessionsData = await tutorDashboardService.getTutorSessions({ limit: 50 });
      setSessions(sessionsData.sessions);
      // Refresh stats
      const dashboardStats = await tutorDashboardService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error confirming session:', error);
    }
  };

  const handleCancelSession = async (sessionId: string, reason: string) => {
    try {
      await tutorDashboardService.cancelSession(sessionId, reason);
      // Refresh sessions
      const sessionsData = await tutorDashboardService.getTutorSessions({ limit: 50 });
      setSessions(sessionsData.sessions);
      // Refresh stats
      const dashboardStats = await tutorDashboardService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error cancelling session:', error);
    }
  };

  const handleViewSession = (session: RecentSession | SessionDetails) => {
    // TODO: Open session details modal
    const studentName = 'student' in session && typeof session.student === 'object' 
      ? session.student.name 
      : (session as RecentSession).studentName;
    alert(`Session Details:\nStudent: ${studentName}\nScheduled: ${session.scheduledAt}`);
  };

  const handleAnswerQuestion = async (questionId: string, answer: string) => {
    try {
      // TODO: Call backend API to save answer when ready
      // await tutorDashboardService.answerQuestion(questionId, answer);
      
      // Update local state
      setQuestions(prev => prev.map(q => 
        q.id === questionId 
          ? { ...q, answer, status: 'ANSWERED' as const, answeredAt: new Date().toISOString() }
          : q
      ));
      
      alert('Answer submitted successfully!');
    } catch (error) {
      console.error('Error answering question:', error);
      alert('Failed to submit answer. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading tutor dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gray-900 z-30 flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center flex-shrink-0">
            <span className="text-gray-900 font-bold text-base">AT</span>
          </div>
          <div>
            <h1 className="text-base font-semibold !text-white">AskYourTutor Instructor</h1>
            <p className="text-xs !text-gray-400">Teaching Dashboard</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium !text-white">{getTutorName()}</p>
            <p className="text-xs !text-gray-400">Tutor Account</p>
          </div>
          <button
            onClick={logout}
            className="p-2 hover:bg-gray-800 rounded-sm transition-colors"
            title="Logout"
          >
            <IconLogout size={18} className="!text-white" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 pt-16">
        {/* Side Panel */}
        <div className="w-60 bg-white border-r border-gray-200 fixed left-0 top-16 bottom-0 flex flex-col">
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-3 space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                  activeTab === 'dashboard' 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <IconChartBar size={18} className="mr-3 flex-shrink-0" />
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => setActiveTab('courses')}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                  activeTab === 'courses' 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <IconBook size={18} className="mr-3 flex-shrink-0" />
                  <span>My Courses</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-sm font-medium ${
                  activeTab === 'courses' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {stats.totalCourses}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('sessions')}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                  activeTab === 'sessions' 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <IconCalendarEvent size={18} className="mr-3 flex-shrink-0" />
                  <span>Sessions</span>
                </div>
                {stats.pendingSessions > 0 && (
                  <span className="bg-yellow-600 text-white text-xs px-2 py-0.5 rounded-sm font-medium">
                    {stats.pendingSessions}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('students')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                  activeTab === 'students' 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <IconUsers size={18} className="mr-3 flex-shrink-0" />
                <span>All Students</span>
              </button>
              
              <button
                onClick={() => setActiveTab('qa')}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                  activeTab === 'qa' 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <IconMessageCircle size={18} className="mr-3 flex-shrink-0" />
                  <span>Q&A</span>
                </div>
                {questions.filter(q => q.status === 'PENDING').length > 0 && (
                  <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-sm font-medium">
                    {questions.filter(q => q.status === 'PENDING').length}
                  </span>
                )}
              </button>
              
              <div className="pt-4 mt-4 border-t border-gray-200">
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                    activeTab === 'settings' 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconSettings size={18} className="mr-3 flex-shrink-0" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>Account Active</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-60">
          <div className="px-4 py-4">
            {activeTab === 'dashboard' && (
              <TutorDashboardTab
                stats={stats}
                recentSessions={recentSessions}
                recentReviews={recentReviews}
                onNavigate={(tab) => setActiveTab(tab as typeof activeTab)}
                onViewSession={handleViewSession}
              />
            )}
            {activeTab === 'courses' && (
              <TutorCoursesTab
                courses={courses}
                onCreateCourse={handleCreateCourse}
                onEditCourse={handleEditCourse}
                onDeleteCourse={handleDeleteCourse}
                onTogglePublish={handleTogglePublish}
              />
            )}
            {activeTab === 'sessions' && (
              <TutorSessionsTab
                sessions={sessions}
                onConfirmSession={handleConfirmSession}
                onCancelSession={handleCancelSession}
                onViewSession={handleViewSession}
              />
            )}
            {activeTab === 'students' && (
              <TutorStudentsTab
                students={students}
              />
            )}
            {activeTab === 'qa' && (
              <TutorQATab
                questions={questions}
                onAnswerQuestion={handleAnswerQuestion}
              />
            )}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-sm border border-gray-200 p-8">
                <div className="text-center py-8">
                  <IconSettings size={40} className="mx-auto text-gray-400 mb-3" />
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Account Settings</h3>
                  <p className="text-sm text-gray-600">Profile preferences and configuration coming soon</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorDashboard;
