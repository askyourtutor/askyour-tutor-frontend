import { 
  IconBook, 
  IconUsers, 
  IconCalendarEvent, 
  IconChartBar,
  IconClock,
  IconStar
} from '@tabler/icons-react';
import type { TutorDashboardStats, RecentSession, RecentReview } from '../../../shared/services/tutorDashboardService';

interface TutorDashboardTabProps {
  stats: TutorDashboardStats;
  recentSessions: RecentSession[];
  recentReviews: RecentReview[];
  onNavigate: (tab: string) => void;
  onViewSession: (session: RecentSession) => void;
}

function TutorDashboardTab({ 
  stats, 
  recentSessions,
  recentReviews,
  onNavigate,
  onViewSession
}: TutorDashboardTabProps) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'CONFIRMED': return 'bg-green-50 text-green-700 border-green-200';
      case 'COMPLETED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Courses */}
        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-blue-50 rounded-sm">
              <IconBook size={18} className="text-blue-600" />
            </div>
            <span className="w-2 h-2 bg-blue-600 rounded-full mt-1"></span>
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Courses</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.totalCourses}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.publishedCourses} published, {stats.draftCourses} drafts
          </p>
        </div>

        {/* Total Students */}
        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-purple-50 rounded-sm">
              <IconUsers size={18} className="text-purple-600" />
            </div>
            <span className="w-2 h-2 bg-purple-600 rounded-full mt-1"></span>
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Students</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{stats.totalStudents}</p>
        </div>

        {/* Sessions */}
        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-green-50 rounded-sm">
              <IconCalendarEvent size={18} className="text-green-600" />
            </div>
            <span className="w-2 h-2 bg-green-600 rounded-full mt-1"></span>
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Upcoming Sessions</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.upcomingSessions}</p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.completedSessions} completed, {stats.pendingSessions} pending
          </p>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 bg-orange-50 rounded-sm">
              <IconChartBar size={18} className="text-orange-600" />
            </div>
            <span className="w-2 h-2 bg-orange-600 rounded-full mt-1"></span>
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Monthly Revenue</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">${stats.monthlyRevenue.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">
            ${stats.totalRevenue.toFixed(2)} total
          </p>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">LESSONS</p>
              <p className="text-lg font-bold text-teal-600 mt-0.5">{stats.totalLessons}</p>
            </div>
            <div className="text-teal-600 text-xs font-medium">Content</div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">RATING</p>
              <p className="text-lg font-bold text-yellow-600 mt-0.5">{stats.avgRating.toFixed(1)}</p>
            </div>
            <div className="flex items-center gap-0.5">
              <IconStar size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-xs text-gray-500">{stats.totalReviews} reviews</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">TOTAL SESSIONS</p>
              <p className="text-lg font-bold text-indigo-600 mt-0.5">{stats.totalSessions}</p>
            </div>
            <div className="text-indigo-600 text-xs font-medium">All time</div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Upcoming Sessions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Upcoming Sessions</h3>
              <button 
                onClick={() => onNavigate('sessions')}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                View All →
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {recentSessions.length > 0 ? (
                recentSessions.slice(0, 5).map((session) => (
                  <div 
                    key={session.id}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onViewSession(session)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {session.courseName}
                          </h4>
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded border ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          Student: {session.studentName}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <IconCalendarEvent size={12} />
                            <span>{formatDate(session.scheduledAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <IconClock size={12} />
                            <span>{session.duration}min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <IconCalendarEvent size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">No upcoming sessions</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Quick Actions & Reviews */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-sm border border-gray-200 p-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => onNavigate('courses')}
                className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-sm text-sm text-blue-600 font-medium transition-colors"
              >
                → Manage Courses ({stats.totalCourses})
              </button>
              <button 
                onClick={() => onNavigate('sessions')}
                className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-sm text-sm text-green-600 font-medium transition-colors"
              >
                → View Sessions ({stats.upcomingSessions} upcoming)
              </button>
              <button 
                onClick={() => onNavigate('students')}
                className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-sm text-sm text-purple-600 font-medium transition-colors"
              >
                → My Students ({stats.totalStudents})
              </button>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-sm border border-gray-200 p-3">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Reviews</h3>
            {recentReviews.length > 0 ? (
              <div className="space-y-3">
                {recentReviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <IconStar
                          key={i}
                          size={12}
                          className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-medium text-gray-900 mb-0.5">{review.courseName}</p>
                    <p className="text-xs text-gray-600 mb-1 line-clamp-2">{review.content || 'No comment'}</p>
                    <p className="text-xs text-gray-500">by {review.studentName}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <IconStar size={24} className="mx-auto text-gray-300 mb-1" />
                <p className="text-xs text-gray-500">No reviews yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorDashboardTab;
