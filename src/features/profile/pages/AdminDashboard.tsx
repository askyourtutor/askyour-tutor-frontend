
import { useState, useEffect } from 'react';
import { 
  IconUsers, 
  IconBook, 
  IconCalendarEvent, 
  IconChartBar, 
  IconSettings,
  IconLogout
} from '@tabler/icons-react';
import { adminService } from '../../../shared/services/adminService';
import { useAuth } from '../../../shared/contexts/AuthContext';
import TutorVerificationModal from '../components/TutorVerificationModal';
import AdminDashboardTab from '../components/AdminDashboardTab';
import AdminUsersTab from '../components/AdminUsersTab';
import AdminTutorsTab from '../components/AdminTutorsTab';
import AdminCoursesTab from '../components/AdminCoursesTab';

interface User {
  id: string;
  email: string;
  role: 'STUDENT' | 'TUTOR' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'PENDING_VERIFICATION' | 'INACTIVE';
  emailVerified: boolean;
  createdAt: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    university?: string;
    profileCompletion?: number;
  };
}

interface Tutor {
  id: string;
  email: string;
  tutorProfile: {
    firstName: string;
    lastName: string;
    university?: string;
    professionalTitle?: string;
    hourlyRate?: number;
    teachingExperience?: number;
    verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    bio?: string;
  };
  status: string;
  createdAt: string;
}

interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTutors: number;
  totalCourses: number;
  activeSessions: number;
  pendingApprovals: number;
  monthlyRevenue: number;
  userGrowth: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  price: number;
  duration: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  createdAt: string;
  tutor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  enrollmentCount?: number;
  rating?: number;
  isPublished: boolean;
}

function AdminDashboard() {
  const { user, logout } = useAuth();
  
  // Initialize activeTab from localStorage or default to 'dashboard'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'tutors' | 'courses' | 'settings'>(() => {
    const savedTab = localStorage.getItem('adminActiveTab');
    return (savedTab as 'dashboard' | 'users' | 'tutors' | 'courses' | 'settings') || 'dashboard';
  });
  
  const [users, setUsers] = useState<User[]>([]);
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalTutors: 0,
    totalCourses: 0,
    activeSessions: 0,
    pendingApprovals: 0,
    monthlyRevenue: 0,
    userGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [showTutorModal, setShowTutorModal] = useState(false);

  // Save activeTab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch real dashboard stats
        const dashboardStats = await adminService.getDashboardStats();
        setStats(dashboardStats);

        // Fetch real users data with pagination
        const usersResponse = await adminService.getUsers({ limit: 50 });
        
        // Transform admin users to match our interface
        const transformedUsers: User[] = usersResponse.users.map(user => ({
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status as 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'PENDING_VERIFICATION' | 'INACTIVE',
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          profile: user.studentProfile || user.tutorProfile ? {
            firstName: user.studentProfile?.firstName || user.tutorProfile?.firstName,
            lastName: user.studentProfile?.lastName || user.tutorProfile?.lastName,
            university: user.studentProfile?.university || user.tutorProfile?.university,
            profileCompletion: 95 // You can calculate this based on profile completeness
          } : undefined
        }));
        setUsers(transformedUsers);

        // Fetch real tutors data
        const tutorsResponse = await adminService.getTutors({ limit: 50 });
        
        // Transform admin tutors to match our interface
        const transformedTutors: Tutor[] = tutorsResponse.tutors.map(tutor => ({
          id: tutor.id,
          email: tutor.email,
          tutorProfile: {
            firstName: tutor.tutorProfile.firstName,
            lastName: tutor.tutorProfile.lastName,
            university: tutor.tutorProfile.university,
            professionalTitle: tutor.tutorProfile.professionalTitle,
            hourlyRate: tutor.tutorProfile.hourlyRate,
            teachingExperience: tutor.tutorProfile.teachingExperience,
            verificationStatus: tutor.tutorProfile.verificationStatus,
            bio: tutor.tutorProfile.bio
          },
          status: tutor.status,
          createdAt: tutor.createdAt
        }));
        setTutors(transformedTutors);

        // Fetch courses data
        const coursesResponse = await adminService.getCourses({ limit: 100 });
        
        // Transform API courses to match our interface
        const transformedCourses: Course[] = coursesResponse.courses.map(course => ({
          id: course.id,
          title: course.title,
          description: course.description || '',
          subject: course.subject,
          level: 'INTERMEDIATE' as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED', // Default since API doesn't have level
          price: course.price,
          duration: 12, // Default duration in weeks
          status: course.isActive ? 'ACTIVE' : 'INACTIVE' as 'ACTIVE' | 'INACTIVE' | 'DRAFT',
          createdAt: course.createdAt,
          tutor: {
            id: course.tutor?.id || course.tutorId,
            firstName: course.tutor?.tutorProfile?.firstName || 'Unknown',
            lastName: course.tutor?.tutorProfile?.lastName || 'Tutor',
            email: course.tutor?.email || '',
            profileImage: undefined
          },
          enrollmentCount: course._count?.sessions || 0,
          rating: course.rating || undefined,
          isPublished: course.isActive
        }));
        setCourses(transformedCourses);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats({
          totalUsers: 0,
          totalStudents: 0,
          totalTutors: 0,
          totalCourses: 0,
          activeSessions: 0,
          pendingApprovals: 0,
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

    fetchDashboardData();
  }, []);

  const pendingTutors = tutors.filter(tutor => tutor.tutorProfile.verificationStatus === 'PENDING');

  // Modal handlers
  const openTutorModal = (tutor: Tutor) => {
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
        await adminService.rejectTutor(tutorId, { notes });
      }
      
      // Refresh tutors data
      const tutorsResponse = await adminService.getTutors({ limit: 50 });
      const transformedTutors: Tutor[] = tutorsResponse.tutors.map(tutor => ({
        id: tutor.id,
        email: tutor.email,
        tutorProfile: {
          firstName: tutor.tutorProfile.firstName,
          lastName: tutor.tutorProfile.lastName,
          university: tutor.tutorProfile.university,
          professionalTitle: tutor.tutorProfile.professionalTitle,
          hourlyRate: tutor.tutorProfile.hourlyRate,
          teachingExperience: tutor.tutorProfile.teachingExperience,
          verificationStatus: tutor.tutorProfile.verificationStatus,
          bio: tutor.tutorProfile.bio
        },
        status: tutor.status,
        createdAt: tutor.createdAt
      }));
      setTutors(transformedTutors);
      
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
      const usersResponse = await adminService.getUsers({ limit: 50 });
      const transformedUsers: User[] = usersResponse.users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status as 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'PENDING_VERIFICATION' | 'INACTIVE',
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        profile: user.studentProfile || user.tutorProfile ? {
          firstName: user.studentProfile?.firstName || user.tutorProfile?.firstName,
          lastName: user.studentProfile?.lastName || user.tutorProfile?.lastName,
          university: user.studentProfile?.university || user.tutorProfile?.university,
          profileCompletion: 95
        } : undefined
      }));
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleUserDelete = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      
      // Refresh users data
      const usersResponse = await adminService.getUsers({ limit: 50 });
      const transformedUsers: User[] = usersResponse.users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status as 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'PENDING_VERIFICATION' | 'INACTIVE',
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        profile: user.studentProfile || user.tutorProfile ? {
          firstName: user.studentProfile?.firstName || user.tutorProfile?.firstName,
          lastName: user.studentProfile?.lastName || user.tutorProfile?.lastName,
          university: user.studentProfile?.university || user.tutorProfile?.university,
          profileCompletion: 95
        } : undefined
      }));
      setUsers(transformedUsers);
      
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
        notes: 'Bulk approved by admin'
      });
      
      // Refresh tutors data
      const tutorsResponse = await adminService.getTutors({ limit: 50 });
      const transformedTutors: Tutor[] = tutorsResponse.tutors.map(tutor => ({
        id: tutor.id,
        email: tutor.email,
        tutorProfile: {
          firstName: tutor.tutorProfile.firstName,
          lastName: tutor.tutorProfile.lastName,
          university: tutor.tutorProfile.university,
          professionalTitle: tutor.tutorProfile.professionalTitle,
          hourlyRate: tutor.tutorProfile.hourlyRate,
          teachingExperience: tutor.tutorProfile.teachingExperience,
          verificationStatus: tutor.tutorProfile.verificationStatus,
          bio: tutor.tutorProfile.bio
        },
        status: tutor.status,
        createdAt: tutor.createdAt
      }));
      setTutors(transformedTutors);
      
      // Update stats
      const dashboardStats = await adminService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error bulk approving tutors:', error);
    }
  };

  // Course management functions
  const handleCourseStatusUpdate = async (courseId: string, status: 'ACTIVE' | 'INACTIVE') => {
    try {
      // TODO: Implement actual API call when courses endpoint is available
      console.log('Course status update:', courseId, status);
      setCourses(prev => prev.map(course => 
        course.id === courseId ? { ...course, status } : course
      ));
    } catch (error) {
      console.error('Error updating course status:', error);
    }
  };

  const handleCourseDelete = async (courseId: string) => {
    try {
      // TODO: Implement actual API call when courses endpoint is available
      console.log('Course delete:', courseId);
      setCourses(prev => prev.filter(course => course.id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
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
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-sm transition-colors ${
                activeTab === 'courses' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <IconCalendarEvent size={18} className="mr-3 flex-shrink-0" />
              <span>Courses</span>
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
              onNavigate={(tab) => setActiveTab(tab as 'dashboard' | 'users' | 'tutors' | 'courses' | 'settings')}
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
          {activeTab === 'settings' && (
            <div className="bg-white rounded-sm border border-gray-200 p-8">
              <div className="text-center py-8">
                <IconSettings size={40} className="mx-auto text-gray-400 mb-3" />
                <h3 className="text-base font-semibold text-gray-900 mb-2">System Settings</h3>
                <p className="text-sm text-gray-600">Platform configuration coming soon</p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
