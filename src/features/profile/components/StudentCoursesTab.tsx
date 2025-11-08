import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  IconBook, 
  IconClock, 
  IconCheck, 
  IconSearch,
  IconFilter,
  IconChevronRight
} from '@tabler/icons-react';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import { apiFetch } from '../../../shared/services/api';

interface EnrolledCourse {
  id: string;
  title: string;
  description: string;
  image: string | null;
  tutorName: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessed: Date | null;
  status: 'not-started' | 'in-progress' | 'completed';
  enrolledAt: Date;
}

function StudentCoursesTab() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<EnrolledCourse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'not-started' | 'in-progress' | 'completed'>('all');

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    filterCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses, searchQuery, statusFilter]);

  const loadCourses = async () => {
    try {
      setLoading(true);

      // Fetch real enrolled courses from API using apiFetch (handles authentication)
      // Note: apiFetch automatically adds /api prefix, so path starts without /api
      const enrollments = await apiFetch<any[]>('/enrollments/my-enrollments');
      
      // Transform enrollments to course format
      const transformedCourses: EnrolledCourse[] = enrollments.map((enrollment: any) => ({
        id: enrollment.course?.id || enrollment.id,
        title: enrollment.course?.title || 'Untitled Course',
        description: enrollment.course?.description || '',
        image: enrollment.course?.image || null,
        tutorName: enrollment.course?.tutor?.name || enrollment.course?.tutor?.email?.split('@')[0] || 'Unknown Tutor',
        progress: enrollment.progress || 0,
        totalLessons: enrollment.course?.lessons?.length || 0,
        completedLessons: Math.floor(((enrollment.progress || 0) / 100) * (enrollment.course?.lessons?.length || 0)),
        lastAccessed: enrollment.lastAccessedAt ? new Date(enrollment.lastAccessedAt) : null,
        status: enrollment.progress === 100 ? 'completed' : enrollment.progress > 0 ? 'in-progress' : 'not-started',
        enrolledAt: new Date(enrollment.enrolledAt)
      }));
      
      setCourses(transformedCourses);
    } catch (error) {
      console.error('Failed to load enrolled courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(course => course.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.tutorName.toLowerCase().includes(query)
      );
    }

    setFilteredCourses(filtered);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return <LoadingSpinner message="Loading courses..." />;
  }

  return (
    <div className="space-y-2.5">
      {/* Filters - Compact */}
      <div className="bg-white rounded-sm border border-gray-200 p-2">
        <div className="flex gap-2">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <IconSearch size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-28">
            <div className="relative">
              <IconFilter size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="all">All</option>
                <option value="not-started">New</option>
                <option value="in-progress">Active</option>
                <option value="completed">Done</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid - Compact Cards */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-sm border border-gray-200 p-8 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-sm flex items-center justify-center mx-auto mb-3 border border-gray-200">
            <IconBook size={20} className="text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">No courses found</h3>
          <p className="text-xs text-gray-500">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Start learning by enrolling'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {filteredCourses.map((course) => {
            const statusColors = {
              'completed': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: IconCheck },
              'in-progress': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: IconClock },
              'not-started': { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: IconBook }
            };
            const status = statusColors[course.status];
            const StatusIcon = status.icon;

            return (
              <div
                key={course.id}
                className="bg-white rounded-sm border border-gray-200 hover:border-gray-300 transition-all cursor-pointer group overflow-hidden"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                {/* Course Image - Compact */}
                <div className="h-24 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                  {course.image ? (
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <IconBook size={28} className="text-white opacity-40" />
                    </div>
                  )}
                  {/* Status Badge - Overlay */}
                  <div className={`absolute top-1.5 right-1.5 ${status.bg} ${status.border} border rounded-sm px-1.5 py-0.5 flex items-center gap-1`}>
                    <StatusIcon size={10} className={status.text} />
                    <span className={`text-[8px] font-medium ${status.text} uppercase`}>
                      {course.status === 'not-started' ? 'New' : course.status === 'in-progress' ? 'Active' : 'Done'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5">
                  {/* Title */}
                  <h3 className="text-xs font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>

                  {/* Tutor */}
                  <p className="text-[9px] text-gray-500 mb-2">
                    By <span className="font-medium text-gray-700">{course.tutorName}</span>
                  </p>

                  {/* Progress Bar - Compact */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] text-gray-500">Progress</span>
                      <span className="text-[9px] font-semibold text-gray-900">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-sm h-1">
                      <div
                        className={`h-1 rounded-sm transition-all ${
                          course.progress === 100 ? 'bg-green-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="text-[8px] text-gray-500 mt-0.5">
                      {course.completedLessons}/{course.totalLessons} lessons
                    </p>
                  </div>

                  {/* Footer - Compact */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-[8px] text-gray-400">
                      {formatDate(course.lastAccessed)}
                    </span>
                    <button className="flex items-center text-[9px] font-medium text-blue-600 hover:text-blue-700 group-hover:translate-x-0.5 transition-transform">
                      {course.status === 'not-started' ? 'Start' : 'Continue'}
                      <IconChevronRight size={10} className="ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentCoursesTab;
