import { Link } from 'react-router';
import { IconBook, IconCalendarEvent, IconHeart, IconUser, IconChartBar, IconClock } from '@tabler/icons-react';
import { useAuth } from '../../../shared/contexts/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();

  const dashboardStats = [
    { icon: IconBook, label: 'Enrolled Courses', value: '3', color: 'bg-blue-500' },
    { icon: IconCalendarEvent, label: 'Upcoming Sessions', value: '2', color: 'bg-green-500' },
    { icon: IconHeart, label: 'Saved Courses', value: '8', color: 'bg-red-500' },
    { icon: IconClock, label: 'Total Hours', value: '24', color: 'bg-purple-500' }
  ];

  const upcomingSessions = [
    { id: 1, course: 'Advanced Mathematics', tutor: 'Dr. Sarah Johnson', date: '2025-01-15', time: '10:00 AM' },
    { id: 2, course: 'Physics Fundamentals', tutor: 'Prof. Michael Chen', date: '2025-01-16', time: '2:00 PM' }
  ];

  const enrolledCourses = [
    { id: 1, title: 'Advanced Mathematics', tutor: 'Dr. Sarah Johnson', progress: 75 },
    { id: 2, title: 'Physics Fundamentals', tutor: 'Prof. Michael Chen', progress: 40 },
    { id: 3, title: 'Computer Science Basics', tutor: 'Dr. Emily Rodriguez', progress: 90 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Sessions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
            </div>
            <div className="p-6">
              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900">{session.course}</h3>
                      <p className="text-sm text-gray-600 mt-1">with {session.tutor}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm text-gray-500">{session.date} at {session.time}</span>
                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                          Join Session
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <IconCalendarEvent size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No upcoming sessions</p>
                  <Link to="/teachers" className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block">
                    Book a session
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
            </div>
            <div className="p-6">
              {enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div key={course.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                        <span className="text-sm text-gray-500">{course.progress}%</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">by {course.tutor}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <IconBook size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No enrolled courses</p>
                  <Link to="/courses" className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block">
                    Browse courses
                  </Link>
                </div>
              )}
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
              <Link to="/courses" className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <IconBook size={20} className="text-blue-600" />
                <span className="font-medium text-blue-900">Browse Courses</span>
              </Link>
              <Link to="/teachers" className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <IconUser size={20} className="text-green-600" />
                <span className="font-medium text-green-900">Find Tutors</span>
              </Link>
              <Link to="/student/profile" className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <IconUser size={20} className="text-purple-600" />
                <span className="font-medium text-purple-900">Edit Profile</span>
              </Link>
              <Link to="/student/analytics" className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                <IconChartBar size={20} className="text-yellow-600" />
                <span className="font-medium text-yellow-900">View Analytics</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;