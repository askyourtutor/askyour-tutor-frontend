import React, { useState, useEffect, useRef } from 'react';
import { 
  IconBook, 
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
  IconCode,
  IconBrandGoogle,
  IconPalette,
  IconBrush
} from '@tabler/icons-react';
import courseService from '../../../services/courseService';

// Temporary types until shared types are available
interface CourseSummary {
  id: string;
  title: string;
  image: string;
  duration: string;
  totalLessons: number;
  totalStudents: number;
  rating: number;
  instructor: {
    name: string;
    avatar: string;
  };
  isFree: boolean;
  price: number;
}

interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  courseCount: number;
}

const PopularCourses: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const categoriesFetchedRef = useRef(false);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData: CategorySummary[] = await courseService.getCategories();
        const filtered = categoriesData.filter((c) => Number(c.courseCount) > 0);
        setCategories(filtered);
        // Set first category as active by default (only if exists)
        setActiveCategory(filtered[0]?.id || '');
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error fetching categories:', err);
      }
    };
    if (!categoriesFetchedRef.current) {
      categoriesFetchedRef.current = true;
      fetchCategories();
    }
  }, []);

  // Transform API course data to CourseSummary format
  const transformCourseData = (apiCourses: any[]): CourseSummary[] => {
    return apiCourses.map(course => ({
      id: course.id,
      title: course.title,
      image: course.image || '/assets/img/courseImage/1.jpg',
      duration: `${course.lessons?.reduce((sum: number, lesson: any) => sum + (lesson.duration || 0), 0) || 0}m`,
      totalLessons: course.lessons?.length || 0,
      totalStudents: Math.floor(Math.random() * 1000) + 100, // Mock data
      rating: course.rating || 4.5,
      instructor: {
        name: course.tutor?.name || 'Instructor',
        avatar: course.tutor?.avatar || '/assets/img/course/author.png'
      },
      isFree: course.price === 0,
      price: course.price || 0
    }));
  };

  // Fetch courses when active category changes
  useEffect(() => {
    const fetchCourses = async () => {
      if (!activeCategory) return;
      
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching courses for category:', activeCategory);
        const coursesData = await courseService.getCoursesByCategory(activeCategory);
        console.log('Courses data received:', coursesData);
        const transformedCourses = transformCourseData(coursesData.data || []);
        setCourses(transformedCourses);
      } catch (err) {
        setError('Failed to load courses');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (activeCategory) {
      fetchCourses();
    }
  }, [activeCategory]);

  const handleCategoryChange = (categoryId: string) => {
    console.log('Category changed to:', categoryId);
    setActiveCategory(categoryId);
  };

  // Slider navigation functions
  const itemsPerView = 4;
  const maxSlide = Math.max(0, categories.length - itemsPerView);
  
  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, maxSlide));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  const canGoNext = currentSlide < maxSlide;
  const canGoPrev = currentSlide > 0;

  // Function to render category icons
  const renderCategoryIcon = (_iconName: string, size: number = 24) => {
    const iconProps = { size, strokeWidth: 1.5 };
    
    switch (_iconName) {
      case 'IconCode':
        return <IconCode {...iconProps} />;
      case 'IconBrandGoogle':
        return <IconBrandGoogle {...iconProps} />;
      case 'IconPalette':
        return <IconPalette {...iconProps} />;
      case 'IconBrush':
        return <IconBrush {...iconProps} />;
      default:
        return <IconBook {...iconProps} />;
    }
  };

  // CourseCard now handles rendering details; helpers removed here

  // Inline CourseCard removed in favor of shared component

  return (
    <section 
      className="py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 overflow-hidden relative"
      style={{
        backgroundImage: 'url("/assets/img/course/course_bg_2.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      id="course-sec"
    >
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        {/* Title Area */}
        <div className="title-area text-center mb-6 xs:mb-8 sm:mb-10 lg:mb-16">
          <span 
            className="sub-title inline-flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm font-medium uppercase tracking-wide mb-2 xs:mb-3 sm:mb-4"
            style={{ color: 'var(--color-secondary)' }}
          >
            <IconBook size={14} className="xs:w-4 xs:h-4" />
            Popular Courses
          </span>
          <h2 
            className="sec-title text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight px-2"
          >
            Our Popular Online Courses
          </h2>
        </div>

        {/* Course Categories Slider */}
        <div className="course-tab-1 mb-6 xs:mb-8 sm:mb-10 lg:mb-12">
          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className={`absolute -left-4 xl:-left-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 xl:w-10 xl:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                canGoPrev 
                  ? 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 shadow-sm hover:shadow-md' 
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            >
              <IconChevronLeft size={16} />
            </button>

            <button
              onClick={nextSlide}
              disabled={!canGoNext}
              className={`absolute -right-4 xl:-right-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 xl:w-10 xl:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                canGoNext 
                  ? 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 shadow-sm hover:shadow-md' 
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            >
              <IconChevronRight size={16} />
            </button>

            {/* Categories Container */}
            <div className="overflow-hidden px-2 sm:px-4 lg:px-8 xl:px-12">
              <div 
                ref={sliderRef}
                className="flex transition-transform duration-500 ease-in-out gap-2 sm:gap-3 lg:gap-4"
                style={{ 
                  transform: categories.length <= itemsPerView ? 'translateX(0)' : `translateX(-${currentSlide * (100 / itemsPerView)}%)`
                }}
              >
                {categories.map((category) => (
                  <div key={category.id} className="flex-shrink-0 w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80">
                    <button
                      className={`w-full p-2 sm:p-3 lg:p-4 rounded-lg transition-all duration-300 group ${
                        activeCategory === category.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm'
                      }`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className={`flex-shrink-0 p-1.5 sm:p-2 rounded-md transition-all duration-300 ${
                          activeCategory === category.id 
                            ? 'bg-white/20 text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {renderCategoryIcon('IconBook', 16)}
                        </span>
                        <div className="text-left flex-1 min-w-0">
                          <div className={`text-sm sm:text-base font-medium mb-0.5 sm:mb-1 truncate ${
                            activeCategory === category.id ? 'text-white' : 'text-gray-900'
                          }`}>
                            {category.name}
                          </div>
                          <div className={`text-xs sm:text-sm ${
                            activeCategory === category.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {category.courseCount} {category.courseCount === 1 ? 'Course' : 'Courses'}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="course-content mb-6 xs:mb-8 sm:mb-10 lg:mb-12">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                  <div className="bg-gray-200 h-32 rounded mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">{error}</div>
              <button 
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  if (activeCategory) {
                    courseService.getCoursesByCategory(activeCategory)
                      .then(data => {
                        const transformedCourses = transformCourseData(data.data || []);
                        setCourses(transformedCourses);
                      })
                      .catch(() => setError('Failed to load courses'))
                      .finally(() => setLoading(false));
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <IconBook size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No courses found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-32 sm:h-40 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {course.duration}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2">{course.title}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <IconBook key={i} size={12} className={i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'} />
                      ))}
                      <span className="text-xs text-gray-600 ml-1">{course.rating}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      {course.totalLessons} lessons • {course.totalStudents} students
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-600">
                        {course.isFree ? 'Free' : `$${course.price}`}
                      </span>
                      <span className="text-xs text-gray-500">{course.instructor.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center px-3 xs:px-4">
          <a 
            href="/courses" 
            className="inline-flex items-center gap-1.5 xs:gap-2 bg-blue-600 text-white px-4 xs:px-5 sm:px-6 md:px-8 py-2.5 xs:py-3 sm:py-4 rounded-sm font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg group text-xs xs:text-sm sm:text-base"
          >
            VIEW ALL COURSES
            <IconArrowRight size={14} className="xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default PopularCourses;