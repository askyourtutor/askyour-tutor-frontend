import { useState, useEffect } from 'react';
import { 
  IconUsers, 
  IconBook, 
  IconCalendarEvent, 
  IconChartBar,
  IconTrendingUp,
  IconClock,
  IconCoin,
  IconActivity,
  IconAlertCircle,
  IconBriefcase,
  IconMessages,
  IconStar,
  IconLoader
} from '@tabler/icons-react';
import type { DashboardStats, AdminTutor } from '../../../shared/services/adminService';

interface AdminDashboardTabProps {
  stats: DashboardStats;
  pendingTutors: AdminTutor[];
  onViewTutor: (tutor: AdminTutor) => void;
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
  onNavigate,
}: AdminDashboardTabProps) {

  return (
    <div className="space-y-3 p-2 sm:p-4 max-w-full overflow-hidden">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white rounded-sm p-2.5 sm:p-3 border border-gray-200 min-w-0">
          <div className="flex items-start justify-between mb-1.5 sm:mb-2">
            <div className="p-1.5 sm:p-2 bg-blue-50 rounded-sm flex-shrink-0">
              <IconUsers size={16} className="text-blue-600 sm:w-[18px] sm:h-[18px]" />
            </div>
            <span className="text-[10px] sm:text-xs text-green-600 font-medium whitespace-nowrap">↑ {stats.userGrowth}%</span>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide truncate">Total Users</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-0.5 sm:mt-1 truncate">{stats.totalUsers.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-sm p-2.5 sm:p-3 border border-gray-200 min-w-0">
          <div className="flex items-start justify-between mb-1.5 sm:mb-2">
            <div className="p-1.5 sm:p-2 bg-purple-50 rounded-sm flex-shrink-0">
              <IconBook size={16} className="text-purple-600 sm:w-[18px] sm:h-[18px]" />
            </div>
            {pendingTutors.length > 0 && (
              <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-red-100 text-red-700 rounded-sm font-medium whitespace-nowrap">
                {pendingTutors.length} pending
              </span>
            )}
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide truncate">Total Tutors</p>
          <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-0.5 sm:mt-1 truncate">{stats.totalTutors}</p>
        </div>

        <div className="bg-white rounded-sm p-2.5 sm:p-3 border border-gray-200 min-w-0">
          <div className="flex items-start justify-between mb-1.5 sm:mb-2">
            <div className="p-1.5 sm:p-2 bg-green-50 rounded-sm flex-shrink-0">
              <IconCalendarEvent size={16} className="text-green-600 sm:w-[18px] sm:h-[18px]" />
            </div>
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-600 rounded-full mt-1 flex-shrink-0"></span>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide truncate">Active Sessions</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600 mt-0.5 sm:mt-1 truncate">{stats.activeSessions}</p>
        </div>

        <div className="bg-white rounded-sm p-2.5 sm:p-3 border border-gray-200 min-w-0">
          <div className="flex items-start justify-between mb-1.5 sm:mb-2">
            <div className="p-1.5 sm:p-2 bg-amber-50 rounded-sm flex-shrink-0">
              <IconChartBar size={16} className="text-amber-600 sm:w-[18px] sm:h-[18px]" />
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wide truncate">Monthly Revenue</p>
          <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-0.5 sm:mt-1 truncate">${stats.monthlyRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white rounded-sm p-2.5 sm:p-3 border border-gray-200 min-w-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">STUDENTS</p>
              <p className="text-base sm:text-lg font-bold text-indigo-600 mt-0.5 truncate">{stats.totalStudents.toLocaleString()}</p>
            </div>
            <div className="text-indigo-600 text-[10px] sm:text-xs font-medium whitespace-nowrap ml-2">
              {((stats.totalStudents / stats.totalUsers) * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-2.5 sm:p-3 border border-gray-200 min-w-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">COURSES</p>
              <p className="text-base sm:text-lg font-bold text-teal-600 mt-0.5 truncate">{stats.totalCourses}</p>
            </div>
            <div className="text-teal-600 text-[10px] sm:text-xs font-medium whitespace-nowrap ml-2">Active</div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-2.5 sm:p-3 border border-gray-200 min-w-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">PENDING APPROVALS</p>
              <p className="text-base sm:text-lg font-bold text-orange-600 mt-0.5 truncate">{stats.pendingApprovals}</p>
            </div>
            <div className={`text-[10px] sm:text-xs font-medium whitespace-nowrap ml-2 ${stats.pendingApprovals > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {stats.pendingApprovals > 0 ? 'Action needed' : 'Up to date'}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      {pendingTutors.length > 0 && (
        <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
          <div className="p-2.5 sm:p-3 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 truncate">Pending Tutor Approvals</h2>
              <p className="text-[10px] sm:text-xs text-orange-600 mt-0.5 font-medium truncate">{pendingTutors.length} tutor{pendingTutors.length > 1 ? 's' : ''} awaiting verification</p>
            </div>
            {pendingTutors.length > 1 && (
              <button 
                onClick={onBulkApprove}
                className="w-full sm:w-auto px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-sm hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Approve All
              </button>
            )}
          </div>
          <div className="p-2 sm:p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {pendingTutors.slice(0, 6).map((tutor) => (
                <div key={tutor.id} className="p-2.5 sm:p-3 bg-gray-50 rounded-sm border border-gray-200 min-w-0">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 rounded-sm flex items-center justify-center text-white flex-shrink-0">
                      <span className="text-xs sm:text-sm font-bold">
                        {tutor.tutorProfile.firstName[0]}{tutor.tutorProfile.lastName[0]}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                        {tutor.tutorProfile.firstName} {tutor.tutorProfile.lastName}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-500 truncate">{tutor.tutorProfile.university || 'No university'}</p>
                    </div>
                  </div>
                  <div className="mb-2 sm:mb-3">
                    <p className="text-[10px] sm:text-xs text-gray-600 line-clamp-2 break-words">
                      {tutor.tutorProfile.bio || 'No bio provided'}
                    </p>
                    {tutor.tutorProfile.teachingExperience && (
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate">
                        {tutor.tutorProfile.teachingExperience} years experience
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1.5 sm:gap-2">
                    <button 
                      onClick={() => onViewTutor(tutor)}
                      className="flex-1 px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-900 text-white text-[10px] sm:text-xs font-medium rounded-sm hover:bg-gray-800 transition-colors truncate"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => onApproveTutor(tutor.id)}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-200 text-gray-700 text-[10px] sm:text-xs font-medium rounded-sm hover:bg-gray-300 transition-colors flex-shrink-0"
                    >
                      ✓
                    </button>
                    <button 
                      onClick={() => onRejectTutor(tutor.id)}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-200 text-gray-700 text-[10px] sm:text-xs font-medium rounded-sm hover:bg-gray-300 transition-colors flex-shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {pendingTutors.length > 6 && (
              <div className="text-center mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
                <button 
                  onClick={() => onNavigate('tutors')}
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium break-words"
                >
                  View all {pendingTutors.length} pending approvals →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
        <div className="bg-white rounded-sm border border-gray-200 p-2.5 sm:p-3 min-w-0">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 truncate">Quick Actions</h3>
          <div className="space-y-1.5 sm:space-y-2">
            <button 
              onClick={() => onNavigate('users')}
              className="w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-50 hover:bg-gray-100 rounded-sm text-xs sm:text-sm text-blue-600 font-medium transition-colors truncate"
            >
              → Manage Users ({stats.totalUsers})
            </button>
            <button 
              onClick={() => onNavigate('tutors')}
              className="w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-50 hover:bg-gray-100 rounded-sm text-xs sm:text-sm text-purple-600 font-medium transition-colors truncate"
            >
              → Review Tutors ({pendingTutors.length} pending)
            </button>
            <button 
              onClick={() => onNavigate('courses')}
              className="w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-50 hover:bg-gray-100 rounded-sm text-xs sm:text-sm text-teal-600 font-medium transition-colors truncate"
            >
              → View Courses ({stats.totalCourses})
            </button>
          </div>
        </div>

        <div className="bg-white rounded-sm border border-gray-200 p-2.5 sm:p-3 min-w-0">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 truncate">Platform Health</h3>
          <div className="space-y-2 sm:space-y-3">
            <div>
              <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1">
                <span className="text-gray-600 truncate">User Engagement</span>
                <span className="font-medium text-blue-600 whitespace-nowrap ml-2">
                  {((stats.activeSessions / stats.totalUsers) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 sm:h-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-1.5 sm:h-2 rounded-full transition-all" 
                  style={{ width: `${Math.min(((stats.activeSessions / stats.totalUsers) * 100), 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1">
                <span className="text-gray-600 truncate">Tutor Approval Rate</span>
                <span className="font-medium text-purple-600 whitespace-nowrap ml-2">
                  {stats.totalTutors > 0 ? ((stats.totalTutors / (stats.totalTutors + pendingTutors.length)) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 sm:h-2 overflow-hidden">
                <div 
                  className="bg-purple-600 h-1.5 sm:h-2 rounded-full transition-all" 
                  style={{ width: `${Math.min(stats.totalTutors > 0 ? ((stats.totalTutors / (stats.totalTutors + pendingTutors.length)) * 100) : 0, 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1">
                <span className="text-gray-600 truncate">Platform Activity</span>
                <span className="font-medium text-green-600 whitespace-nowrap ml-2">Excellent</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 sm:h-2 overflow-hidden">
                <div className="bg-green-600 h-1.5 sm:h-2 rounded-full transition-all" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Analytics */}
      <div className="bg-white rounded-sm border border-gray-200 p-2.5 sm:p-3 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3 gap-1">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">Revenue Analytics</h3>
          <div className="flex items-center gap-1 text-green-600 text-[10px] sm:text-xs font-medium whitespace-nowrap">
            <IconTrendingUp size={12} className="sm:w-[14px] sm:h-[14px] flex-shrink-0" />
            <span>+{stats.userGrowth}%</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-sm min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
              <IconCoin size={14} className="text-blue-600 sm:w-4 sm:h-4 flex-shrink-0" />
              <p className="text-[10px] sm:text-xs text-blue-700 font-medium truncate">All Time Revenue</p>
            </div>
            <p className="text-lg sm:text-xl font-bold text-blue-700 truncate">${stats.totalRevenue.toLocaleString()}</p>
            <p className="text-[10px] sm:text-xs text-blue-600 mt-0.5 sm:mt-1 truncate">Total earnings</p>
          </div>
          <div className="p-2 sm:p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-sm min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
              <IconTrendingUp size={14} className="text-green-600 sm:w-4 sm:h-4 flex-shrink-0" />
              <p className="text-[10px] sm:text-xs text-green-700 font-medium truncate">This Month</p>
            </div>
            <p className="text-lg sm:text-xl font-bold text-green-700 truncate">${stats.monthlyRevenue.toLocaleString()}</p>
            <p className="text-[10px] sm:text-xs text-green-600 mt-0.5 sm:mt-1 truncate">Last 30 days</p>
          </div>
          <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-sm min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
              <IconCalendarEvent size={14} className="text-purple-600 sm:w-4 sm:h-4 flex-shrink-0" />
              <p className="text-[10px] sm:text-xs text-purple-700 font-medium truncate">Completed Sessions</p>
            </div>
            <p className="text-lg sm:text-xl font-bold text-purple-700 truncate">{stats.totalPayments}</p>
            <p className="text-[10px] sm:text-xs text-purple-600 mt-0.5 sm:mt-1 truncate">Paid sessions</p>
          </div>
          <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-sm min-w-0">
            <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
              <IconActivity size={14} className="text-amber-600 sm:w-4 sm:h-4 flex-shrink-0" />
              <p className="text-[10px] sm:text-xs text-amber-700 font-medium truncate">Avg per Session</p>
            </div>
            <p className="text-lg sm:text-xl font-bold text-amber-700 truncate">${stats.totalPayments > 0 ? (stats.totalRevenue / stats.totalPayments).toFixed(2) : '0.00'}</p>
            <p className="text-[10px] sm:text-xs text-amber-600 mt-0.5 sm:mt-1 truncate">Per completed</p>
          </div>
        </div>
      </div>

      {/* User Demographics & System Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
        <div className="bg-white rounded-sm border border-gray-200 p-2.5 sm:p-3 min-w-0">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
            <IconUsers size={16} className="text-indigo-600 sm:w-[18px] sm:h-[18px] flex-shrink-0" />
            <span className="truncate">User Demographics</span>
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div>
              <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1 sm:mb-1.5">
                <span className="text-gray-600 font-medium truncate">Students</span>
                <span className="font-bold text-indigo-600 whitespace-nowrap ml-2">{stats.totalStudents} ({((stats.totalStudents / stats.totalUsers) * 100).toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 sm:h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 sm:h-2.5 rounded-full transition-all" 
                  style={{ width: `${Math.min((stats.totalStudents / stats.totalUsers) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1 sm:mb-1.5">
                <span className="text-gray-600 font-medium truncate">Tutors</span>
                <span className="font-bold text-purple-600 whitespace-nowrap ml-2">{stats.totalTutors} ({((stats.totalTutors / stats.totalUsers) * 100).toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 sm:h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 sm:h-2.5 rounded-full transition-all" 
                  style={{ width: `${Math.min((stats.totalTutors / stats.totalUsers) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-[10px] sm:text-xs mb-1 sm:mb-1.5">
                <span className="text-gray-600 font-medium truncate">Verified Tutors</span>
                <span className="font-bold text-green-600 whitespace-nowrap ml-2">{stats.verifiedTutors} ({stats.totalTutors > 0 ? ((stats.verifiedTutors / stats.totalTutors) * 100).toFixed(1) : 0}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 sm:h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 sm:h-2.5 rounded-full transition-all" 
                  style={{ width: `${Math.min(stats.totalTutors > 0 ? (stats.verifiedTutors / stats.totalTutors) * 100 : 0, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm border border-gray-200 p-2.5 sm:p-3 min-w-0">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
            <IconActivity size={16} className="text-teal-600 sm:w-[18px] sm:h-[18px] flex-shrink-0" />
            <span className="truncate">System Metrics</span>
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-teal-50 rounded-sm border border-teal-100 min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
                <IconCalendarEvent size={12} className="text-teal-600 sm:w-[14px] sm:h-[14px] flex-shrink-0" />
                <p className="text-[10px] sm:text-xs text-teal-700 font-medium truncate">Active Sessions</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-teal-700 truncate">{stats.activeSessions}</p>
            </div>
            <div className="p-2 sm:p-2.5 bg-blue-50 rounded-sm border border-blue-100 min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
                <IconBook size={12} className="text-blue-600 sm:w-[14px] sm:h-[14px] flex-shrink-0" />
                <p className="text-[10px] sm:text-xs text-blue-700 font-medium truncate">Total Courses</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-blue-700 truncate">{stats.totalCourses}</p>
            </div>
            <div className="p-2 sm:p-2.5 bg-orange-50 rounded-sm border border-orange-100 min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
                <IconClock size={12} className="text-orange-600 sm:w-[14px] sm:h-[14px] flex-shrink-0" />
                <p className="text-[10px] sm:text-xs text-orange-700 font-medium truncate">Pending</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-orange-700 truncate">{stats.pendingApprovals}</p>
            </div>
            <div className="p-2 sm:p-2.5 bg-red-50 rounded-sm border border-red-100 min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5 mb-0.5 sm:mb-1">
                <IconAlertCircle size={12} className="text-red-600 sm:w-[14px] sm:h-[14px] flex-shrink-0" />
                <p className="text-[10px] sm:text-xs text-red-700 font-medium truncate">Unverified</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-red-700 truncate">{stats.unverifiedEmails}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Performance & Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white rounded-sm border border-gray-200 p-2.5 sm:p-3 min-w-0">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
            <IconBriefcase size={16} className="text-blue-600 sm:w-[18px] sm:h-[18px] flex-shrink-0" />
            <span className="truncate">Engagement Metrics</span>
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between p-1.5 sm:p-2 bg-blue-50 rounded-sm">
              <span className="text-[10px] sm:text-xs text-gray-700 font-medium truncate">Session Rate</span>
              <div className="flex items-center gap-0.5 sm:gap-1 whitespace-nowrap ml-2">
                <span className="text-xs sm:text-sm font-bold text-blue-700">
                  {((stats.activeSessions / stats.totalUsers) * 100).toFixed(1)}%
                </span>
                <IconTrendingUp size={12} className="text-green-600 sm:w-[14px] sm:h-[14px] flex-shrink-0" />
              </div>
            </div>
            <div className="flex items-center justify-between p-1.5 sm:p-2 bg-purple-50 rounded-sm">
              <span className="text-[10px] sm:text-xs text-gray-700 font-medium truncate">Avg Course/Tutor</span>
              <div className="flex items-center gap-0.5 sm:gap-1 whitespace-nowrap ml-2">
                <span className="text-xs sm:text-sm font-bold text-purple-700">
                  {(stats.totalCourses / (stats.totalTutors || 1)).toFixed(1)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-1.5 sm:p-2 bg-green-50 rounded-sm">
              <span className="text-[10px] sm:text-xs text-gray-700 font-medium truncate">Student/Course</span>
              <div className="flex items-center gap-0.5 sm:gap-1 whitespace-nowrap ml-2">
                <span className="text-xs sm:text-sm font-bold text-green-700">
                  {(stats.totalStudents / (stats.totalCourses || 1)).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm border border-gray-200 p-2.5 sm:p-3 min-w-0">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
            <IconStar size={16} className="text-amber-600 sm:w-[18px] sm:h-[18px] flex-shrink-0" />
            <span className="truncate">Growth Indicators</span>
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-sm border border-green-100">
              <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                <span className="text-[10px] sm:text-xs text-gray-700 font-medium truncate">User Growth</span>
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold whitespace-nowrap ml-2">
                  +{stats.userGrowth}%
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-1 sm:h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-1 sm:h-1.5 rounded-full" 
                  style={{ width: `${Math.min(stats.userGrowth, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-sm border border-blue-100">
              <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                <span className="text-[10px] sm:text-xs text-gray-700 font-medium truncate">Active Users</span>
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold whitespace-nowrap ml-2">
                  {((stats.activeSessions / stats.totalUsers) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-1 sm:h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1 sm:h-1.5 rounded-full" 
                  style={{ width: `${Math.min((stats.activeSessions / stats.totalUsers) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-sm border border-purple-100">
              <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                <span className="text-[10px] sm:text-xs text-gray-700 font-medium truncate">Verification Rate</span>
                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-bold whitespace-nowrap ml-2">
                  {stats.totalTutors > 0 ? ((stats.verifiedTutors / stats.totalTutors) * 100).toFixed(0) : 0}%
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-1 sm:h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 sm:h-1.5 rounded-full" 
                  style={{ width: `${Math.min(stats.totalTutors > 0 ? (stats.verifiedTutors / stats.totalTutors) * 100 : 0, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm border border-gray-200 p-2.5 sm:p-3 min-w-0">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
            <IconMessages size={16} className="text-teal-600 sm:w-[18px] sm:h-[18px] flex-shrink-0" />
            <span className="truncate">Quick Insights</span>
          </h3>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-sm">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-600 rounded-full mt-1 sm:mt-1.5 flex-shrink-0"></div>
              <p className="text-[10px] sm:text-xs text-gray-700 break-words">
                <span className="font-bold text-blue-700">{stats.totalUsers}</span> total users registered
              </p>
            </div>
            <div className="flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-sm">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-600 rounded-full mt-1 sm:mt-1.5 flex-shrink-0"></div>
              <p className="text-[10px] sm:text-xs text-gray-700 break-words">
                <span className="font-bold text-green-700">{stats.activeSessions}</span> active learning sessions
              </p>
            </div>
            <div className="flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-sm">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-600 rounded-full mt-1 sm:mt-1.5 flex-shrink-0"></div>
              <p className="text-[10px] sm:text-xs text-gray-700 break-words">
                <span className="font-bold text-purple-700">{stats.totalCourses}</span> courses available
              </p>
            </div>
            {stats.pendingApprovals > 0 && (
              <div className="flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-orange-50 rounded-sm border border-orange-200">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-orange-600 rounded-full mt-1 sm:mt-1.5 flex-shrink-0"></div>
                <p className="text-[10px] sm:text-xs text-orange-700 font-medium break-words">
                  {stats.pendingApprovals} approval{stats.pendingApprovals > 1 ? 's' : ''} needed
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardTab;
