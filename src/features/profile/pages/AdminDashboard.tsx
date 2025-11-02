import { Link } from 'react-router';
import { IconUsers, IconBook, IconCalendarEvent, IconChartBar, IconSettings, IconShield } from '@tabler/icons-react';
import { useAuth } from '../../../shared/contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  const dashboardStats = [
    { icon: IconUsers, label: 'Total Users', value: '1,247', color: 'bg-blue-500' },
    { icon: IconBook, label: 'Total Courses', value: '186', color: 'bg-green-500' },
    { icon: IconCalendarEvent, label: 'Active Sessions', value: '42', color: 'bg-purple-500' },
    { icon: IconChartBar, label: 'Revenue (Month)', value: '$12,480', color: 'bg-orange-500' }
  ];

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'STUDENT', joinDate: '2025-01-10' },
    { id: 2, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'TUTOR', joinDate: '2025-01-12' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'STUDENT', joinDate: '2025-01-14' }
  ];

  const systemActivity = [
    { id: 1, action: 'New user registration', user: 'John Doe', time: '2 hours ago' },
    { id: 2, action: 'Course created', user: 'Dr. Sarah Johnson', time: '5 hours ago' },
    { id: 3, action: 'Session completed', user: 'Physics - Advanced', time: '1 day ago' },
    { id: 4, action: 'Payment processed', user: '$299.00', time: '1 day ago' }
  ];

  const pendingActions = [
    { id: 1, type: 'approval', message: 'New tutor profile pending approval', priority: 'high' },
    { id: 2, type: 'review', message: 'Course content review required', priority: 'medium' },
    { id: 3, type: 'report', message: 'User report requiring investigation', priority: 'high' },
    { id: 4, type: 'update', message: 'System maintenance scheduled', priority: 'low' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Platform administration and management • {user?.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Users</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <IconUsers size={16} className="text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                          user.role === 'TUTOR' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                        <span className="text-xs text-gray-400">{user.joinDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/admin/users" className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700">
                View all users
              </Link>
            </div>
          </div>

          {/* System Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">System Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {systemActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pending Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Pending Actions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pendingActions.map((action) => (
                  <div key={action.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-900 flex-1">{action.message}</p>
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ml-2 ${
                        action.priority === 'high' ? 'bg-red-100 text-red-800' :
                        action.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {action.priority}
                      </span>
                    </div>
                    <button className="mt-2 text-xs text-blue-600 hover:text-blue-700">
                      Take action
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {/* User Management */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <IconUsers size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Manage students, tutors, and admin accounts</p>
            <div className="space-y-2">
              <Link to="/admin/users" className="block w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                View All Users
              </Link>
              <Link to="/admin/users/pending" className="block w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                Pending Approvals
              </Link>
            </div>
          </div>

          {/* Course Management */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <IconBook size={24} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Course Management</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Oversee course content and quality</p>
            <div className="space-y-2">
              <Link to="/courses" className="block w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                View All Courses
              </Link>
              <Link to="/admin/courses/pending" className="block w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                Review Queue
              </Link>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <IconSettings size={24} className="text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Configure platform settings and security</p>
            <div className="space-y-2">
              <Link to="/admin/settings" className="block w-full px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                General Settings
              </Link>
              <Link to="/admin/security" className="block w-full px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                Security & Privacy
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <IconShield size={20} className="text-blue-600" />
                <span className="font-medium text-blue-900">Security Audit</span>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <IconChartBar size={20} className="text-green-600" />
                <span className="font-medium text-green-900">Generate Report</span>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <IconSettings size={20} className="text-purple-600" />
                <span className="font-medium text-purple-900">System Backup</span>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                <IconUsers size={20} className="text-yellow-600" />
                <span className="font-medium text-yellow-900">Bulk Actions</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;