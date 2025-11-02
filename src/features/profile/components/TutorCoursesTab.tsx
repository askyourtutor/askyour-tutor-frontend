import { 
  IconBook, 
  IconSearch, 
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconEyeOff,
  IconUsers,
  IconStar
} from '@tabler/icons-react';
import { useState } from 'react';
import type { CourseWithStats } from '../../../shared/services/tutorDashboardService';

interface TutorCoursesTabProps {
  courses: CourseWithStats[];
  onCreateCourse: () => void;
  onEditCourse: (course: CourseWithStats) => void;
  onDeleteCourse: (courseId: string) => void;
  onTogglePublish: (courseId: string, isActive: boolean) => void;
}

function TutorCoursesTab({ 
  courses, 
  onCreateCourse,
  onEditCourse,
  onDeleteCourse,
  onTogglePublish
}: TutorCoursesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [filterSubject, setFilterSubject] = useState<string>('ALL');

  const subjects = Array.from(new Set(courses.map(c => c.subject))).sort();

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || 
                         (filterStatus === 'PUBLISHED' && course.isActive) ||
                         (filterStatus === 'DRAFT' && !course.isActive);
    const matchesSubject = filterSubject === 'ALL' || course.subject === filterSubject;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const publishedCount = courses.filter(c => c.isActive).length;
  const draftCount = courses.filter(c => !c.isActive).length;

  return (
    <div className="space-y-4">
      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">TOTAL COURSES</p>
              <p className="text-2xl font-bold text-blue-600 mt-0.5">{courses.length}</p>
            </div>
            <IconBook size={32} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">PUBLISHED</p>
              <p className="text-2xl font-bold text-green-600 mt-0.5">{publishedCount}</p>
            </div>
            <IconEye size={32} className="text-green-200" />
          </div>
        </div>

        <div className="bg-white rounded-sm p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">DRAFTS</p>
              <p className="text-2xl font-bold text-orange-600 mt-0.5">{draftCount}</p>
            </div>
            <IconEyeOff size={32} className="text-orange-200" />
          </div>
        </div>
      </div>

      {/* Header with Search and Filters */}
      <div className="bg-white rounded-sm border border-gray-200 p-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-semibold text-gray-900">My Courses</h1>
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
                className="pl-7 pr-3 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'ALL' | 'PUBLISHED' | 'DRAFT')}
              className="px-2 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-2 py-1.5 text-xs border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <button
              onClick={onCreateCourse}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-sm hover:bg-blue-700 transition-colors"
            >
              <IconPlus size={14} />
              New Course
            </button>
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Students</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rating</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {course.image ? (
                          <img 
                            src={course.image} 
                            alt={course.title}
                            className="w-10 h-10 rounded object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <IconBook size={18} className="text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {course.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {course.stats.lessons} lessons
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-gray-700">{course.subject}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-gray-900">${course.price.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <IconUsers size={14} />
                        <span>{course.stats.students}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <IconStar size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium text-gray-700">{course.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-500">({course.stats.reviews})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded border ${
                        course.isActive 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}>
                        {course.isActive ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onTogglePublish(course.id, !course.isActive)}
                          className="p-1.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                          title={course.isActive ? 'Unpublish' : 'Publish'}
                        >
                          {course.isActive ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                        </button>
                        <button
                          onClick={() => onEditCourse(course)}
                          className="p-1.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                          title="Edit"
                        >
                          <IconEdit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${course.title}"?`)) {
                              onDeleteCourse(course.id);
                            }
                          }}
                          className="p-1.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                          title="Delete"
                        >
                          <IconTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <IconBook size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500">No courses found</p>
                    <button
                      onClick={onCreateCourse}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Create your first course
                    </button>
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

export default TutorCoursesTab;
