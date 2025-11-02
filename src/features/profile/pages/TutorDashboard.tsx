import { Link } from 'react-router';
import { IconBook, IconCalendarEvent, IconUsers, IconChartBar, IconPlus, IconClock } from '@tabler/icons-react';
import { useAuth } from '../../../shared/contexts/AuthContext';

const TutorDashboard = () => {
  const { user } = useAuth();

  const dashboardStats = [
    { icon: IconBook, label: 'My Courses', value: '5', color: 'bg-blue-500' },
    { icon: IconUsers, label: 'Total Students', value: '12', color: 'bg-green-500' },
    { icon: IconCalendarEvent, label: 'This Week Sessions', value: '8', color: 'bg-purple-500' },
    { icon: IconClock, label: 'Total Teaching Hours', value: '156', color: 'bg-orange-500' }
  ];

  const upcomingSessions = [
    { id: 1, course: 'Advanced Mathematics', student: 'John Doe', date: '2025-01-15', time: '10:00 AM' },
    { id: 2, course: 'Physics Fundamentals', student: 'Jane Smith', date: '2025-01-15', time: '2:00 PM' },
    { id: 3, course: 'Advanced Mathematics', student: 'Mike Johnson', date: '2025-01-16', time: '11:00 AM' }
  ];

  const myCourses = [
    { id: 1, title: 'Advanced Mathematics', students: 5, sessions: 12, rating: 4.8 },
    { id: 2, title: 'Physics Fundamentals', students: 3, sessions: 8, rating: 4.9 },
    { id: 3, title: 'Calculus Basics', students: 4, sessions: 10, rating: 4.7 }
  ];

  const recentActivity = [
    { id: 1, type: 'session', message: 'Completed session with John Doe', time: '2 hours ago' },
    { id: 2, type: 'enrollment', message: 'New student enrolled in Physics course', time: '5 hours ago' },
    { id: 3, type: 'review', message: 'Received 5-star review from Jane Smith', time: '1 day ago' },
    { id: 4, type: 'session', message: 'Upcoming session with Mike Johnson', time: 'Tomorrow at 11:00 AM' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tutor Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.email}!</p>
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
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Today's Sessions</h2>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <IconPlus size={16} />
                <span>Schedule Session</span>
              </button>
            </div>
            <div className="p-6">
              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{session.course}</h3>
                          <p className="text-sm text-gray-600 mt-1">with {session.student}</p>
                          <span className="text-sm text-gray-500">{session.date} at {session.time}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                            Start Session
                          </button>
                          <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors">
                            Reschedule
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <IconCalendarEvent size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No sessions scheduled for today</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* My Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-8">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
            <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <IconPlus size={16} />
              <span>Create Course</span>
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.map((course) => (
                <div key={course.id} className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">{course.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Students:</span>
                      <span className="font-medium">{course.students}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sessions:</span>
                      <span className="font-medium">{course.sessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <span className="font-medium text-yellow-600">★ {course.rating}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                      Manage
                    </button>
                    <button className="flex-1 px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors">
                      View
                    </button>
                  </div>
                </div>
              ))}
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
                <IconPlus size={20} className="text-blue-600" />
                <span className="font-medium text-blue-900">Create Course</span>
              </button>
              <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <IconCalendarEvent size={20} className="text-green-600" />
                <span className="font-medium text-green-900">Schedule Session</span>
              </button>
              <Link to="/tutor/profile" className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <IconUsers size={20} className="text-purple-600" />
                <span className="font-medium text-purple-900">Edit Profile</span>
              </Link>
              <button className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                <IconChartBar size={20} className="text-yellow-600" />
                <span className="font-medium text-yellow-900">View Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;