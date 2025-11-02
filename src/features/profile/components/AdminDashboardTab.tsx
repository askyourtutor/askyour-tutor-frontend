import { 
  IconUsers, 
  IconBook, 
  IconCalendarEvent, 
  IconChartBar
} from '@tabler/icons-react';

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

interface AdminDashboardTabProps {
  stats: DashboardStats;
  pendingTutors: Tutor[];
  onViewTutor: (tutor: Tutor) => void;
  onApproveTutor: (tutorId: string) => void;
  onRejectTutor: (tutorId: string) => void;
  onBulkApprove: () => void;
  onNavigate: (tab: string) => void;
}

function AdminDashboardTab({ 
  stats, 
  pendingTutors, 
  onViewTutor, 
  onApproveTutor, 
  onRejectTutor,
  onBulkApprove,
  onNavigate
}: AdminDashboardTabProps) {
  return (
    <div className="space-y-3">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-blue-50 rounded-sm">
              <IconUsers size={18} className="text-blue-600" />
            </div>
            <span className="text-xs text-green-600 font-medium">↑ {stats.userGrowth}%</span>
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Users</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.totalUsers.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-purple-50 rounded-sm">
              <IconBook size={18} className="text-purple-600" />
            </div>
            {pendingTutors.length > 0 && (
              <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-sm font-medium">
                {pendingTutors.length} pending
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Tutors</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{stats.totalTutors}</p>
        </div>

        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-green-50 rounded-sm">
              <IconCalendarEvent size={18} className="text-green-600" />
            </div>
            <span className="w-2 h-2 bg-green-600 rounded-full mt-1"></span>
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Active Sessions</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.activeSessions}</p>
        </div>

        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-amber-50 rounded-sm">
              <IconChartBar size={18} className="text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Monthly Revenue</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">${stats.monthlyRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">STUDENTS</p>
              <p className="text-lg font-bold text-indigo-600 mt-0.5">{stats.totalStudents.toLocaleString()}</p>
            </div>
            <div className="text-indigo-600 text-xs font-medium">
              {((stats.totalStudents / stats.totalUsers) * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">COURSES</p>
              <p className="text-lg font-bold text-teal-600 mt-0.5">{stats.totalCourses}</p>
            </div>
            <div className="text-teal-600 text-xs font-medium">Active</div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">PENDING APPROVALS</p>
              <p className="text-lg font-bold text-orange-600 mt-0.5">{stats.pendingApprovals}</p>
            </div>
            <div className={`text-xs font-medium ${stats.pendingApprovals > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {stats.pendingApprovals > 0 ? 'Action needed' : 'Up to date'}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      {pendingTutors.length > 0 && (
        <div className="bg-white rounded-sm border border-gray-200">
          <div className="p-3 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Pending Tutor Approvals</h2>
              <p className="text-xs text-orange-600 mt-0.5 font-medium">{pendingTutors.length} tutor{pendingTutors.length > 1 ? 's' : ''} awaiting verification</p>
            </div>
            {pendingTutors.length > 1 && (
              <button 
                onClick={onBulkApprove}
                className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-sm hover:bg-gray-800 transition-colors"
              >
                Approve All
              </button>
            )}
          </div>
          <div className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {pendingTutors.slice(0, 6).map((tutor) => (
                <div key={tutor.id} className="p-3 bg-gray-50 rounded-sm border border-gray-200">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-10 h-10 bg-gray-900 rounded-sm flex items-center justify-center text-white flex-shrink-0">
                      <span className="text-sm font-bold">
                        {tutor.tutorProfile.firstName[0]}{tutor.tutorProfile.lastName[0]}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {tutor.tutorProfile.firstName} {tutor.tutorProfile.lastName}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">{tutor.tutorProfile.university || 'No university'}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {tutor.tutorProfile.bio || 'No bio provided'}
                    </p>
                    {tutor.tutorProfile.teachingExperience && (
                      <p className="text-xs text-gray-500 mt-1">
                        {tutor.tutorProfile.teachingExperience} years experience
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onViewTutor(tutor)}
                      className="flex-1 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-sm hover:bg-gray-800 transition-colors"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => onApproveTutor(tutor.id)}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-medium rounded-sm hover:bg-gray-300 transition-colors"
                    >
                      ✓
                    </button>
                    <button 
                      onClick={() => onRejectTutor(tutor.id)}
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs font-medium rounded-sm hover:bg-gray-300 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {pendingTutors.length > 6 && (
              <div className="text-center mt-4 pt-3 border-t border-gray-200">
                <button 
                  onClick={() => onNavigate('tutors')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all {pendingTutors.length} pending approvals →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white rounded-sm border border-gray-200 p-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              onClick={() => onNavigate('users')}
              className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-sm text-sm text-blue-600 font-medium transition-colors"
            >
              → Manage Users ({stats.totalUsers})
            </button>
            <button 
              onClick={() => onNavigate('tutors')}
              className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-sm text-sm text-purple-600 font-medium transition-colors"
            >
              → Review Tutors ({pendingTutors.length} pending)
            </button>
            <button 
              onClick={() => onNavigate('courses')}
              className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-sm text-sm text-teal-600 font-medium transition-colors"
            >
              → View Courses ({stats.totalCourses})
            </button>
          </div>
        </div>

        <div className="bg-white rounded-sm border border-gray-200 p-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Platform Health</h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">User Engagement</span>
                <span className="font-medium text-blue-600">
                  {((stats.activeSessions / stats.totalUsers) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all" 
                  style={{ width: `${((stats.activeSessions / stats.totalUsers) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">Tutor Approval Rate</span>
                <span className="font-medium text-purple-600">
                  {stats.totalTutors > 0 ? ((stats.totalTutors / (stats.totalTutors + pendingTutors.length)) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all" 
                  style={{ width: `${stats.totalTutors > 0 ? ((stats.totalTutors / (stats.totalTutors + pendingTutors.length)) * 100) : 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">Platform Activity</span>
                <span className="font-medium text-green-600">Excellent</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardTab;
