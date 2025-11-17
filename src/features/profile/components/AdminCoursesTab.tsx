import { IconBook, IconSearch, IconCalendarEvent, IconChartBar, IconLoader } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import type { AdminCourse } from '../../../shared/services/adminService';

// Helper to get tutor display name
const getTutorName = (course: AdminCourse): string => {
  const profile = course.tutor?.tutorProfile;
  if (profile?.firstName && profile?.lastName) {
    return `${profile.firstName} ${profile.lastName}`;
  }
  return course.tutor?.email || 'Unknown Tutor';
};

// Helper to get course status display
const getCourseStatus = (course: AdminCourse): 'ACTIVE' | 'INACTIVE' => {
  return course.isActive ? 'ACTIVE' : 'INACTIVE';
};

interface AdminCoursesTabProps {
  courses: AdminCourse[];
  onUpdateStatus: (courseId: string, status: 'ACTIVE' | 'INACTIVE') => void;
  onDeleteCourse: (courseId: string) => void;
}

function AdminCoursesTab({ courses, onUpdateStatus, onDeleteCourse }: AdminCoursesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getTutorName(course).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'ALL' || course.subject === filterSubject;
    const status = getCourseStatus(course);
    const matchesStatus = filterStatus === 'ALL' || status === filterStatus;
    return matchesSearch && matchesSubject && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">TOTAL COURSES</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{courses.length}</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-sm">
              <IconBook size={16} className="text-gray-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">ACTIVE COURSES</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">
                {courses.filter(c => c.isActive).length}
              </p>
            </div>
            <div className="p-2 bg-gray-100 rounded-sm">
              <IconCalendarEvent size={16} className="text-gray-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">TOTAL REVENUE</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">
                ${courses.reduce((acc, course) => acc + (course.price * (course._count?.sessions || 0)), 0).toLocaleString()}
              </p>
            </div>
            <div className="p-2 bg-gray-100 rounded-sm">
              <IconChartBar size={16} className="text-gray-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Header with Search and Filters */}
      <div className="bg-white rounded-sm border border-gray-200 p-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-semibold text-gray-900">Course Management</h1>
            <p className="text-xs text-gray-500 mt-0.5">{filteredCourses.length} of {courses.length} courses</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <IconSearch size={14} className="absolute left-2 top-2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-2 py-1.5 text-xs border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
            >
              <option value="ALL">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Physics">Physics</option>
              <option value="History">History</option>
              <option value="Literature">Literature</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
              className="px-2 py-1.5 text-xs border border-gray-200 rounded-sm focus:outline-none focus:border-gray-400"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Course</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tutor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Level</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Students</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-900 rounded-sm flex items-center justify-center text-white flex-shrink-0">
                        <span className="text-xs font-semibold">
                          {course.title.split(' ').map(word => word[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {course.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {course.subject} • {course.rating ? `★ ${course.rating}` : 'No rating'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-sm flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-gray-700">
                          {course.tutor?.tutorProfile ? `${course.tutor.tutorProfile.firstName[0]}${course.tutor.tutorProfile.lastName[0]}` : '?'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {getTutorName(course)}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{course.tutor?.email || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{course.subject}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-sm bg-gray-100 text-gray-700 border border-gray-200">
                      Standard
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${course.price}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {course._count?.sessions || 0}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm ${
                      getCourseStatus(course) === 'ACTIVE' ? 'bg-green-100 text-green-700 border border-green-200' :
                      'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {getCourseStatus(course)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => onUpdateStatus(course.id, getCourseStatus(course) === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                        className={`px-3 py-1 text-xs rounded-sm transition-colors ${
                          getCourseStatus(course) === 'ACTIVE' 
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        {getCourseStatus(course) === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => onDeleteCourse(course.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-sm hover:bg-red-200 border border-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCourses.length === 0 && (
          <div className="text-center py-8">
            <IconBook size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No courses found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCoursesTab;
