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
import type { CourseSummary, CategorySummary } from '../../../shared/types';
import { courseService, categoryService } from '../../../shared/services';
import { CourseCard } from '../../../shared/components/cards';
import { ErrorState, EmptyState } from '../../../shared/components/ui';
import { CourseSkeletonGrid } from '../../../shared/components/skeletons';

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
        const categoriesData: CategorySummary[] = await categoryService.getCategories();
        const filtered = categoriesData.filter((c) => Number(c.courseCount) > 0);
        setCategories(filtered);
        // Set first category as active by default (only if exists)
        setActiveCategory(filtered[0]?.id || '');
      } catch {
        setError('Failed to load categories');
        // Error is already logged by the service layer if unexpected
      }
    };
    if (!categoriesFetchedRef.current) {
      categoriesFetchedRef.current = true;
      fetchCategories();
    }
  }, []);

  // Fetch courses when active category changes
  useEffect(() => {
    const fetchCourses = async () => {
      if (!activeCategory) return;
      
      setLoading(true);
      setError(null); // Clear any previous errors
      try {
        const coursesData = await courseService.getCoursesByCategory(activeCategory);
        setCourses((coursesData.data ?? []) as CourseSummary[]);
      } catch {
        setError('Failed to load courses');
        // Error is already logged by the service layer if unexpected
      } finally {
        setLoading(false);
      }
    };
    
    if (activeCategory) {
      fetchCourses();
    }
  }, [activeCategory]);

  const handleCategoryChange = (categoryId: string) => {
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
            <CourseSkeletonGrid count={8} />
          ) : error ? (
            <ErrorState 
              type="network"
              error={error} 
              onRetry={() => {
                setError(null);
                setLoading(true);
                // Refetch courses for current category
                if (activeCategory) {
                  courseService.getCoursesByCategory(activeCategory)
                    .then(data => setCourses((data.data ?? []) as CourseSummary[]))
                    .catch(() => setError('Failed to load courses'))
                    .finally(() => setLoading(false));
                }
              }} 
            />
          ) : courses.length === 0 ? (
            <EmptyState 
              type="courses"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
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