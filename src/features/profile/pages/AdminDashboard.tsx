
import { useState, useEffect } from 'react';
import { 
  IconUsers, 
  IconBook, 
  IconCalendarEvent, 
  IconChartBar, 
  IconSettings,
  IconLogout,
  IconMessageCircle,
  IconCurrencyDollar
} from '@tabler/icons-react';
import { 
  adminService,
  type AdminUser,
  type AdminTutor,
  type AdminCourse,
  type DashboardStats
} from '../../../shared/services/adminService';
import { useAuth } from '../../../shared/contexts/AuthContext';
import { ADMIN_CONSTANTS } from '../../../shared/constants/admin';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import TutorVerificationModal from '../components/TutorVerificationModal';
import AdminDashboardTab from '../components/AdminDashboardTab';
import AdminUsersTab from '../components/AdminUsersTab';
import AdminTutorsTab from '../components/AdminTutorsTab';
import AdminCoursesTab from '../components/AdminCoursesTab';
import TutorCoursesTab from '../components/TutorCoursesTab';
import AdminQnATab from '../components/AdminQnATab';
import AdminPaymentsTab from '../components/AdminPaymentsTab';
import AdminSessionsTab from '../components/AdminSessionsTab';
import CreateCourseModal from '../components/CreateCourseModal';
import EditCourseModal from '../components/EditCourseModal';
import AdminProfileSettings from '../components/AdminProfileSettings';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import tutorDashboardService, { type CourseWithStats } from '../../../shared/services/tutorDashboardService';
import { fetchWithCache, cache } from '../../../shared/lib/cache';

function AdminDashboard() {
  const { user, logout } = useAuth();
  
  // Initialize activeTab from localStorage or default to 'dashboard'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'tutors' | 'courses' | 'my-courses' | 'sessions' | 'qna' | 'payments' | 'settings'>(() => {
    const savedTab = localStorage.getItem(ADMIN_CONSTANTS.STORAGE_KEY_ACTIVE_TAB);
    return (savedTab as 'dashboard' | 'users' | 'tutors' | 'courses' | 'my-courses' | 'sessions' | 'qna' | 'payments' | 'settings') || ADMIN_CONSTANTS.DEFAULT_TAB;
  });
  
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tutors, setTutors] = useState<AdminTutor[]>([]);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [myCourses, setMyCourses] = useState<CourseWithStats[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalTutors: 0,
    totalCourses: 0,
    activeSessions: 0,
    pendingApprovals: 0,
    verifiedTutors: 0,
    unverifiedEmails: 0,
    monthlyRevenue: 0,
    userGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState<AdminTutor | null>(null);
  const [showTutorModal, setShowTutorModal] = useState(false);
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseWithStats | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'danger'
  });

  // Save activeTab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(ADMIN_CONSTANTS.STORAGE_KEY_ACTIVE_TAB, activeTab);
  }, [activeTab]);

  // Fetch dashboard data function
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch real dashboard stats
      const dashboardStats = await adminService.getDashboardStats();
      setStats(dashboardStats);

      // Fetch real users data with pagination
      const usersResponse = await adminService.getUsers({ limit: ADMIN_CONSTANTS.DEFAULT_PAGE_SIZE });
      setUsers(usersResponse.users);

      // Fetch real tutors data
      const tutorsResponse = await adminService.getTutors({ limit: ADMIN_CONSTANTS.DEFAULT_PAGE_SIZE });
      setTutors(tutorsResponse.tutors);

      // Fetch courses data
      const coursesResponse = await adminService.getCourses({ limit: ADMIN_CONSTANTS.COURSES_PAGE_SIZE });
      setCourses(coursesResponse.courses);

      // Fetch admin's own courses (as a tutor) - only if admin has tutor profile
      try {
        const myCoursesData = await fetchWithCache(
          'admin:my-courses',
          () => tutorDashboardService.getTutorCourses()
        );
        setMyCourses(myCoursesData);
      } catch {
        // If admin doesn't have tutor profile, just set empty array
        console.log('Admin does not have tutor profile, skipping my courses fetch');
        setMyCourses([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats({
        totalUsers: 0,
        totalStudents: 0,
        totalTutors: 0,
        totalCourses: 0,
        activeSessions: 0,
        pendingApprovals: 0,
        verifiedTutors: 0,
        unverifiedEmails: 0,
        monthlyRevenue: 0,
        userGrowth: 0
      });
      setUsers([]);
      setTutors([]);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const pendingTutors = tutors.filter(tutor => tutor.tutorProfile.verificationStatus === 'PENDING');

  // Modal handlers
  const openTutorModal = (tutor: AdminTutor) => {
    setSelectedTutor(tutor);
    setShowTutorModal(true);
  };

  const closeTutorModal = () => {
    setSelectedTutor(null);
    setShowTutorModal(false);
  };

  // Wrapper functions for modal actions
  const handleModalApprove = async (tutorId: string, notes?: string) => {
    await handleApprovalAction(tutorId, 'approve', notes);
  };

  const handleModalReject = async (tutorId: string, notes: string) => {
    await handleApprovalAction(tutorId, 'reject', notes);
  };

  // CRUD Functions
  const handleApprovalAction = async (tutorId: string, action: 'approve' | 'reject', notes?: string) => {
    try {
      if (action === 'approve') {
        await adminService.approveTutor(tutorId, { notes });
      } else {
        await adminService.rejectTutor(tutorId, { notes: notes || ADMIN_CONSTANTS.REJECTION_DEFAULT_NOTE });
      }
      
      // Refresh tutors data
      const tutorsResponse = await adminService.getTutors({ limit: ADMIN_CONSTANTS.DEFAULT_PAGE_SIZE });
      setTutors(tutorsResponse.tutors);
      
      // Update stats
      const dashboardStats = await adminService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error updating tutor status:', error);
    }
  };

  const handleUserStatusUpdate = async (userId: string, status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE') => {
    try {
      await adminService.updateUser(userId, { status });
      
      // Refresh users data
      const usersResponse = await adminService.getUsers({ limit: ADMIN_CONSTANTS.DEFAULT_PAGE_SIZE });
      setUsers(usersResponse.users);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleUserDelete = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      
      // Refresh users data
      const usersResponse = await adminService.getUsers({ limit: ADMIN_CONSTANTS.DEFAULT_PAGE_SIZE });
      setUsers(usersResponse.users);
      
      // Update stats
      const dashboardStats = await adminService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleBulkApprove = async () => {
    const pendingTutorIds = pendingTutors.map(tutor => tutor.id);
    if (pendingTutorIds.length === 0) return;
    
    try {
      await adminService.bulkApproveTutors({ 
        tutorIds: pendingTutorIds,
        notes: ADMIN_CONSTANTS.BULK_APPROVAL_NOTE
      });
      
      // Refresh tutors data
      const tutorsResponse = await adminService.getTutors({ limit: ADMIN_CONSTANTS.DEFAULT_PAGE_SIZE });
      setTutors(tutorsResponse.tutors);
      
      // Update stats
      const dashboardStats = await adminService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error bulk approving tutors:', error);
    }
  };

  // Course management functions
  const handleCourseStatusUpdate = async (courseId: string, status: 'ACTIVE' | 'INACTIVE') => {
    const isActive = status === 'ACTIVE';
    
    // Optimistically update UI immediately
    setCourses(prev => prev.map(c => 
      c.id === courseId ? { ...c, isActive } : c
    ));
    
    try {
      // Make API call in background
      await adminService.updateCourseStatus(courseId, isActive);
      
      // Update stats after successful update
      const dashboardStats = await adminService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error updating course status:', error);
      
      // Revert optimistic update on error
      setCourses(prev => prev.map(c => 
        c.id === courseId ? { ...c, isActive: !isActive } : c
      ));
      
      // Show error modal
      setConfirmModal({
        isOpen: true,
        title: 'Error',
        message: 'Failed to update course status. Please try again.',
        variant: 'danger',
        onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
      });
    }
  };

  const handleCourseDelete = async (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    
    setConfirmModal({
      isOpen: true,
      title: 'Delete Course',
      message: `Are you sure you want to delete "${course?.title}"? This action cannot be undone and will remove all associated data.`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          await adminService.deleteCourse(courseId);
          
          // Refresh courses data
          const coursesResponse = await adminService.getCourses({ limit: ADMIN_CONSTANTS.COURSES_PAGE_SIZE });
          setCourses(coursesResponse.courses);
          
          // Update stats
          const dashboardStats = await adminService.getDashboardStats();
          setStats(dashboardStats);
          
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error deleting course:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete course';
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          // Show error modal
          setConfirmModal({
            isOpen: true,
            title: 'Cannot Delete Course',
            message: errorMessage,
            variant: 'danger',
            onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
          });
        }
      }
    });
  };

  // Admin's own course management (as a tutor)
  const handleEditCourse = (course: CourseWithStats) => {
    setSelectedCourse(course);
    setIsEditCourseModalOpen(true);
  };

  const handleDeleteMyCourse = async (courseId: string) => {
    try {
      await tutorDashboardService.deleteCourse(courseId);
      
      // Invalidate cache and refresh
      cache.delete('admin:my-courses');
      const myCoursesData = await fetchWithCache(
        'admin:my-courses',
        () => tutorDashboardService.getTutorCourses()
      );
      setMyCourses(myCoursesData);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleTogglePublish = async (courseId: string, isActive: boolean) => {
    try {
      await tutorDashboardService.toggleCoursePublish(courseId, isActive);
      
      // Invalidate cache and refresh
      cache.delete('admin:my-courses');
      const myCoursesData = await fetchWithCache(
        'admin:my-courses',
        () => tutorDashboardService.getTutorCourses()
      );
      setMyCourses(myCoursesData);
    } catch (error) {
      console.error('Error toggling course publish status:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message={ADMIN_CONSTANTS.LOADING_MESSAGE} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Tutor Verification Modal */}
      <TutorVerificationModal
        tutor={selectedTutor}
        isOpen={showTutorModal}
        onClose={closeTutorModal}
        onApprove={handleModalApprove}
        onReject={handleModalReject}
      />

      {/* Course Modals */}
      <CreateCourseModal
        isOpen={isCreateCourseModalOpen}
        onClose={() => setIsCreateCourseModalOpen(false)}
        onSuccess={async () => {
          // Invalidate cache and refresh
          cache.delete('admin:my-courses');
          const myCoursesData = await fetchWithCache(
            'admin:my-courses',
            () => tutorDashboardService.getTutorCourses()
          );
          setMyCourses(myCoursesData);
          setIsCreateCourseModalOpen(false);
        }}
      />

      {selectedCourse && (
        <EditCourseModal
          isOpen={isEditCourseModalOpen}
          onClose={() => {
            setIsEditCourseModalOpen(false);
            setSelectedCourse(null);
          }}
          onSuccess={async () => {
            // Refresh both All Courses and My Courses
            const coursesResponse = await adminService.getCourses({ limit: ADMIN_CONSTANTS.COURSES_PAGE_SIZE });
            setCourses(coursesResponse.courses);
            
            // Invalidate cache and refresh my courses
            cache.delete('admin:my-courses');
            const myCoursesData = await fetchWithCache(
              'admin:my-courses',
              () => tutorDashboardService.getTutorCourses()
            );
            setMyCourses(myCoursesData);
            
            setIsEditCourseModalOpen(false);
            setSelectedCourse(null);
          }}
          course={selectedCourse}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        confirmText="Confirm"
        cancelText="Cancel"
      />

      {/* Top Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gray-900 z-30 flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center flex-shrink-0">
            <span className="text-gray-900 font-bold text-base">AT</span>
          </div>
          <div>
            <h1 className="text-base font-semibold !text-white">AskYourTutor Admin</h1>
            <p className="text-xs !text-gray-400">Management Dashboard</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium !text-white">{user?.email || 'Admin User'}</p>
            <p className="text-xs !text-gray-400">Administrator</p>
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
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                activeTab === 'users' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center min-w-0 flex-1">
                <IconUsers size={18} className="mr-3 flex-shrink-0" />
                <span>Users</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-sm font-medium ${
                activeTab === 'users' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {stats.totalUsers}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('tutors')}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                activeTab === 'tutors' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center min-w-0 flex-1">
                <IconBook size={18} className="mr-3 flex-shrink-0" />
                <span>Tutors</span>
              </div>
              {pendingTutors.length > 0 && (
                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-sm font-medium">
                  {pendingTutors.length}
                </span>
              )}
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
                <IconCalendarEvent size={18} className="mr-3 flex-shrink-0" />
                <span>All Courses</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-sm font-medium ${
                activeTab === 'courses' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {stats.totalCourses}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('my-courses')}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                activeTab === 'my-courses' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center min-w-0 flex-1">
                <IconBook size={18} className="mr-3 flex-shrink-0" />
                <span>My Courses</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-sm font-medium ${
                activeTab === 'my-courses' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {myCourses.length}
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
              {stats.activeSessions > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-sm font-medium">
                  {stats.activeSessions}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('qna')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                activeTab === 'qna' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <IconMessageCircle size={18} className="mr-3 flex-shrink-0" />
              <span>Q&A</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                activeTab === 'payments' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <IconCurrencyDollar size={18} className="mr-3 flex-shrink-0" />
              <span>Payments</span>
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
            <span>System Active</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-60">
        <div className="px-4 py-4">
          {activeTab === 'dashboard' && (
            <AdminDashboardTab
              stats={stats}
              pendingTutors={pendingTutors}
              onViewTutor={openTutorModal}
              onApproveTutor={(id) => handleApprovalAction(id, 'approve')}
              onRejectTutor={(id) => handleApprovalAction(id, 'reject', 'Rejected by admin')}
              onBulkApprove={handleBulkApprove}
              onNavigate={(tab) => setActiveTab(tab as 'dashboard' | 'users' | 'tutors' | 'courses' | 'my-courses' | 'qna' | 'payments' | 'settings')}
            />
          )}
          {activeTab === 'users' && (
            <AdminUsersTab
              users={users}
              onUpdateStatus={handleUserStatusUpdate}
              onDeleteUser={handleUserDelete}
            />
          )}
          {activeTab === 'tutors' && (
            <AdminTutorsTab
              tutors={tutors}
              pendingCount={pendingTutors.length}
              onViewTutor={openTutorModal}
              onApproveTutor={(id) => handleApprovalAction(id, 'approve')}
              onRejectTutor={(id) => handleApprovalAction(id, 'reject', 'Rejected by admin')}
              onBulkApprove={handleBulkApprove}
            />
          )}
          {activeTab === 'courses' && (
            <AdminCoursesTab
              courses={courses}
              onUpdateStatus={handleCourseStatusUpdate}
              onDeleteCourse={handleCourseDelete}
            />
          )}
          {activeTab === 'my-courses' && (
            <>
              {myCourses.length === 0 && !loading ? (
                <div className="bg-white rounded-sm border border-gray-200 p-8">
                  <div className="text-center py-12">
                    <IconBook size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      As an admin with tutor privileges, you can create and manage your own courses just like any tutor.
                    </p>
                    <button
                      onClick={() => setIsCreateCourseModalOpen(true)}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors font-medium"
                    >
                      Create Your First Course
                    </button>
                  </div>
                </div>
              ) : (
                <TutorCoursesTab
                  courses={myCourses}
                  onCreateCourse={() => setIsCreateCourseModalOpen(true)}
                  onEditCourse={handleEditCourse}
                  onDeleteCourse={handleDeleteMyCourse}
                  onTogglePublish={handleTogglePublish}
                />
              )}
            </>
          )}
          {activeTab === 'sessions' && <AdminSessionsTab />}
          {activeTab === 'qna' && <AdminQnATab />}
          {activeTab === 'payments' && <AdminPaymentsTab />}
          {activeTab === 'settings' && (
            <AdminProfileSettings onProfileUpdate={fetchDashboardData} />
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
