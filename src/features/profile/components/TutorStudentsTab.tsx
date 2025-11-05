import { 
  IconUsers, 
  IconSearch, 
  IconCalendarEvent,
  IconBook,
  IconMail,
  IconPhone,
  IconChevronDown,
  IconChevronRight,
} from '@tabler/icons-react';
import { Fragment } from 'react';
import { useState } from 'react';
import type { Student } from '../../../shared/services/tutorDashboardService';

interface TutorStudentsTabProps {
  students: Student[];
}

function TutorStudentsTab({ students }: TutorStudentsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (studentId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (student.university || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalSessions = students.reduce((sum, s) => sum + s.totalSessions, 0);
  const completedSessions = students.reduce((sum, s) => sum + s.completedSessions, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-3">
      {/* Student Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-sm p-2.5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">TOTAL STUDENTS</p>
              <p className="text-xl font-bold text-purple-600 mt-0.5">{students.length}</p>
            </div>
            <IconUsers size={28} className="text-purple-200" />
          </div>
        </div>

        <div className="bg-white rounded-sm p-2.5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">TOTAL SESSIONS</p>
              <p className="text-xl font-bold text-blue-600 mt-0.5">{totalSessions}</p>
            </div>
            <IconCalendarEvent size={28} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-white rounded-sm p-2.5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">COMPLETED</p>
              <p className="text-xl font-bold text-green-600 mt-0.5">{completedSessions}</p>
            </div>
            <IconCalendarEvent size={28} className="text-green-200" />
          </div>
        </div>
      </div>

      {/* Header with Search */}
      <div className="bg-white rounded-sm border border-gray-200 p-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
          <div>
            <h1 className="text-sm font-semibold text-gray-900">All Students</h1>
            <p className="text-xs text-gray-500 mt-0.5">{filteredStudents.length} of {students.length} students</p>
          </div>
          <div className="relative">
            <IconSearch size={14} className="absolute left-2 top-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 pr-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-6 px-1 py-1.5"></th>
                <th className="px-2 py-1.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-2 py-1.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  University
                </th>
                <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Sessions
                </th>
                <th className="px-2 py-1.5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-2 py-1.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Last Session
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const isExpanded = expandedRows.has(student.id);
                  return (
                    <Fragment key={student.id}>
                      {/* Main Row */}
                      <tr 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => toggleRow(student.id)}
                      >
                        <td className="px-1 py-1.5 text-center">
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            {isExpanded ? (
                              <IconChevronDown size={14} />
                            ) : (
                              <IconChevronRight size={14} />
                            )}
                          </button>
                        </td>
                        <td className="px-2 py-1.5">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-purple-600 font-semibold text-xs">
                                {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-gray-900 truncate">
                                {student.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-1.5">
                          <span className="text-xs text-gray-700">
                            {student.university || '-'}
                          </span>
                        </td>
                        <td className="px-2 py-1.5 text-center">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {student.totalSessions}
                          </span>
                        </td>
                        <td className="px-2 py-1.5 text-center">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            {student.completedSessions}
                          </span>
                        </td>
                        <td className="px-2 py-1.5">
                          <span className="text-xs text-gray-700">
                            {formatDate(student.lastSession)}
                          </span>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr key={`${student.id}-details`} className="bg-gray-50">
                          <td colSpan={6} className="px-2 py-2">
                            <div className="pl-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {/* Contact Information */}
                              <div>
                                <h4 className="text-xs font-semibold text-gray-700 uppercase mb-1.5">
                                  Contact Information
                                </h4>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                    <IconMail size={12} className="flex-shrink-0 text-gray-400" />
                                    <span className="truncate">{student.email}</span>
                                  </div>
                                  {student.phone ? (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                      <IconPhone size={12} className="flex-shrink-0 text-gray-400" />
                                      <span>{student.phone}</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                      <IconPhone size={12} className="flex-shrink-0" />
                                      <span>No phone provided</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Academic Information */}
                              <div>
                                <h4 className="text-xs font-semibold text-gray-700 uppercase mb-1.5">
                                  Academic Details
                                </h4>
                                <div className="space-y-0.5">
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">University:</span>{' '}
                                    {student.university || 'Not specified'}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    <span className="font-medium">Program:</span>{' '}
                                    {student.program || 'Not specified'}
                                  </p>
                                </div>
                              </div>

                              {/* Session Statistics */}
                              <div>
                                <h4 className="text-xs font-semibold text-gray-700 uppercase mb-1.5">
                                  Session Statistics
                                </h4>
                                <div className="space-y-0.5">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600">Total Sessions:</span>
                                    <span className="font-semibold text-blue-600">{student.totalSessions}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600">Completed:</span>
                                    <span className="font-semibold text-green-600">{student.completedSessions}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600">Completion Rate:</span>
                                    <span className="font-semibold text-gray-900">
                                      {student.totalSessions > 0 
                                        ? `${Math.round((student.completedSessions / student.totalSessions) * 100)}%`
                                        : '0%'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Enrolled Courses */}
                              {student.courses.length > 0 && (
                                <div className="md:col-span-2 lg:col-span-3">
                                  <h4 className="text-xs font-semibold text-gray-700 uppercase mb-1.5 flex items-center gap-1">
                                    <IconBook size={12} />
                                    Enrolled Courses ({student.courses.length})
                                  </h4>
                                  <div className="flex flex-wrap gap-1">
                                    {student.courses.map((course) => (
                                      <span 
                                        key={course.id}
                                        className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                                      >
                                        {course.title}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-2 py-8 text-center">
                    <IconUsers size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-xs text-gray-500">No students found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TutorStudentsTab;
