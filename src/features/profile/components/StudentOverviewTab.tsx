import { useState, useEffect } from 'react';
import { 
  IconBook, 
  IconClock, 
  IconCheck, 
  IconCurrencyDollar,
  IconTrendingUp,
  IconCalendar
} from '@tabler/icons-react';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';

interface StudentStats {
  totalCourses: number;
  inProgressCourses: number;
  completedCourses: number;
  totalSpent: number;
  currentMonthSpent: number;
  upcomingSessions: number;
}

interface RecentActivity {
  id: string;
  type: 'enrollment' | 'completion' | 'payment';
  title: string;
  description: string;
  timestamp: Date;
  icon: 'book' | 'check' | 'dollar';
}

function StudentOverviewTab() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StudentStats>({
    totalCourses: 0,
    inProgressCourses: 0,
    completedCourses: 0,
    totalSpent: 0,
    currentMonthSpent: 0,
    upcomingSessions: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API calls
      // const response = await fetch('/api/students/stats', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const data = await response.json();
      
      // Mock data for now
      setStats({
        totalCourses: 5,
        inProgressCourses: 3,
        completedCourses: 2,
        totalSpent: 1299.99,
        currentMonthSpent: 499.99,
        upcomingSessions: 4
      });

      setRecentActivity([
        {
          id: '1',
          type: 'enrollment',
          title: 'Enrolled in Advanced JavaScript',
          description: 'Started learning new course',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          icon: 'book'
        },
        {
          id: '2',
          type: 'payment',
          title: 'Payment Successful',
          description: '$199.99 for React Mastery Course',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          icon: 'dollar'
        },
        {
          id: '3',
          type: 'completion',
          title: 'Completed Python Basics',
          description: 'Finished all lessons',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          icon: 'check'
        }
      ]);
    } catch (error) {
      console.error('Failed to load student stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (icon: string) => {
    switch (icon) {
      case 'book':
        return <IconBook size={18} className="text-blue-600" />;
      case 'check':
        return <IconCheck size={18} className="text-green-600" />;
      case 'dollar':
        return <IconCurrencyDollar size={18} className="text-purple-600" />;
      default:
        return <IconBook size={18} />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return <LoadingSpinner message="Loading overview..." />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Courses */}
        <div className="bg-white rounded-sm p-6 shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Total Courses</p>
            <IconBook size={20} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
          <p className="text-xs text-gray-500 mt-1">Enrolled courses</p>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-sm p-6 shadow-sm border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">In Progress</p>
            <IconClock size={20} className="text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.inProgressCourses}</p>
          <p className="text-xs text-gray-500 mt-1">Active learning</p>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-sm p-6 shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <IconCheck size={20} className="text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.completedCourses}</p>
          <p className="text-xs text-gray-500 mt-1">Finished courses</p>
        </div>

        {/* Total Spent */}
        <div className="bg-white rounded-sm p-6 shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Total Invested</p>
            <IconCurrencyDollar size={20} className="text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">${stats.totalSpent.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">All-time spending</p>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-sm p-6 shadow-sm border-l-4 border-indigo-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">This Month</p>
            <IconTrendingUp size={20} className="text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">${stats.currentMonthSpent.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Current month</p>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-sm p-6 shadow-sm border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Upcoming Sessions</p>
            <IconCalendar size={20} className="text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.upcomingSessions}</p>
          <p className="text-xs text-gray-500 mt-1">Scheduled lessons</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-sm shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No recent activity
            </div>
          ) : (
            recentActivity.map((activity) => (
              <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-gray-100 rounded-sm">
                    {getActivityIcon(activity.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-sm p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button className="px-4 py-3 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors text-sm font-medium">
            Continue Learning
          </button>
          <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-sm hover:bg-gray-200 transition-colors text-sm font-medium">
            Browse Courses
          </button>
          <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-sm hover:bg-gray-200 transition-colors text-sm font-medium">
            View Certificates
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentOverviewTab;
