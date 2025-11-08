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
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/students/enrolled-courses', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const data = await response.json();
      
      // Mock data
      const mockCourses: EnrolledCourse[] = [
        {
          id: '1',
          title: 'Advanced JavaScript Programming',
          description: 'Master modern JavaScript with ES6+, async programming, and more',
          image: null,
          tutorName: 'John Doe',
          progress: 65,
          totalLessons: 20,
          completedLessons: 13,
          lastAccessed: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: 'in-progress',
          enrolledAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          title: 'React Mastery Course',
          description: 'Build modern web applications with React and TypeScript',
          image: null,
          tutorName: 'Jane Smith',
          progress: 100,
          totalLessons: 15,
          completedLessons: 15,
          lastAccessed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          status: 'completed',
          enrolledAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
        },
        {
          id: '3',
          title: 'Python for Data Science',
          description: 'Learn Python programming and data analysis fundamentals',
          image: null,
          tutorName: 'Mike Johnson',
          progress: 30,
          totalLessons: 25,
          completedLessons: 8,
          lastAccessed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          status: 'in-progress',
          enrolledAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
        },
        {
          id: '4',
          title: 'Web Design Fundamentals',
          description: 'Create beautiful and responsive web designs',
          image: null,
          tutorName: 'Sarah Williams',
          progress: 0,
          totalLessons: 18,
          completedLessons: 0,
          lastAccessed: null,
          status: 'not-started',
          enrolledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      ];
      
      setCourses(mockCourses);
    } catch (error) {
      console.error('Failed to load enrolled courses:', error);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium bg-green-100 text-green-800">
            <IconCheck size={14} className="mr-1" />
            Completed
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium bg-blue-100 text-blue-800">
            <IconClock size={14} className="mr-1" />
            In Progress
          </span>
        );
      case 'not-started':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium bg-gray-100 text-gray-800">
            <IconBook size={14} className="mr-1" />
            Not Started
          </span>
        );
      default:
        return null;
    }
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
    return <LoadingSpinner message="Loading your courses..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-sm p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Courses</h2>
        <p className="text-gray-600">
          {courses.length} course{courses.length !== 1 ? 's' : ''} enrolled
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-sm p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <div className="relative">
              <IconFilter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-sm p-12 shadow-sm text-center">
          <IconBook size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Start learning by enrolling in a course'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-sm shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              {/* Course Image */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-sm flex items-center justify-center">
                {course.image ? (
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <IconBook size={64} className="text-white opacity-50" />
                )}
              </div>

              <div className="p-6">
                {/* Status Badge */}
                <div className="mb-3">
                  {getStatusBadge(course.status)}
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Tutor */}
                <p className="text-sm text-gray-500 mb-4">
                  Instructor: <span className="font-medium text-gray-700">{course.tutorName}</span>
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {course.completedLessons} of {course.totalLessons} lessons completed
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    Last accessed: {formatDate(course.lastAccessed)}
                  </span>
                  <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
                    {course.status === 'not-started' ? 'Start' : 'Continue'}
                    <IconChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentCoursesTab;
