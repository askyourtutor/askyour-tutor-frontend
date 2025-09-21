import React, { useState, useEffect, useRef } from 'react';
import { 
  IconBook, 
  IconFile, 
  IconUsers, 
  IconStar,
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
  IconCode,
  IconBrandGoogle,
  IconPalette,
  IconBrush
} from '@tabler/icons-react';
import type { Course, CourseCategory } from '../../types';
import { courseService, categoryService } from '../../services';

const PopularCourses: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoryService.getCategories();
        setCategories(categoriesData);
        // Set first category as active by default
        if (categoriesData.length > 0) {
          setActiveCategory(categoriesData[0].id);
        }
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch courses when active category changes
  useEffect(() => {
    const fetchCourses = async () => {
      if (!activeCategory) return;
      
      setLoading(true);
      try {
        const coursesData = await courseService.getCoursesByCategory(activeCategory);
        setCourses(coursesData.data || []);
      } catch (err) {
        setError('Failed to load courses');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [activeCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  // Slider navigation functions
  const nextSlide = () => {
    const maxSlide = Math.max(0, categories.length - 4); // Show 4 categories at a time
    setCurrentSlide(prev => Math.min(prev + 1, maxSlide));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  const canGoNext = currentSlide < Math.max(0, categories.length - 4);
  const canGoPrev = currentSlide > 0;

  // Function to render category icons
  const renderCategoryIcon = (iconName: string, size: number = 24) => {
    const iconProps = { size, strokeWidth: 1.5 };
    
    switch (iconName) {
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

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<IconStar key={i} size={14} className="text-yellow-400 fill-current" />);
    }
    
    if (hasHalfStar) {
      stars.push(<IconStar key="half" size={14} className="text-yellow-400 fill-current opacity-50" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<IconStar key={`empty-${i}`} size={14} className="text-gray-300" />);
    }
    
    return stars;
  };

  const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
    <div className="course-box bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Course Image */}
      <div className="course-img relative overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-32 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
          <span className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
            {course.duration}
          </span>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="course-content p-3 sm:p-6">
        {/* Course Meta */}
        <div className="course-meta flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <IconFile size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{course.totalLessons} Lessons</span>
            <span className="sm:hidden">{course.totalLessons}L</span>
          </div>
          <div className="flex items-center gap-1">
            <IconUsers size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{course.totalStudents}+ Students</span>
            <span className="sm:hidden">{course.totalStudents}+</span>
          </div>
        </div>
        
        {/* Course Title */}
        <h3 className="course-title text-sm sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
          <a href={`/course/${course.id}`} className="hover:underline">
            {course.title}
          </a>
        </h3>
        
        {/* Rating */}
        <div className="course-rating flex items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
          <div className="flex items-center">
            {renderStars(course.rating)}
          </div>
          <span className="text-xs sm:text-sm text-gray-600">
            ({course.rating}) <span className="hidden sm:inline">{course.ratingCount} Reviews</span>
          </span>
        </div>
        
        {/* Course Footer */}
        <div className="course-footer flex items-center justify-between">
          <div className="author flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
            <img 
              src={course.instructor.avatar} 
              alt={course.instructor.name}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
            />
            <a href="/instructor" className="author-name text-xs sm:text-sm font-medium text-gray-700 hover:text-blue-600 truncate">
              {course.instructor.name}
            </a>
          </div>
          <div className="offer-tag bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex-shrink-0 ml-2">
            {course.isFree ? 'Free' : `$${course.price}`}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section 
      className="py-12 sm:py-16 lg:py-20 overflow-hidden relative"
      style={{
        backgroundImage: 'url("/assets/img/course/course_bg_2.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      id="course-sec"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Area */}
        <div className="title-area text-center mb-8 sm:mb-12 lg:mb-16">
          <span 
            className="sub-title inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide mb-3 sm:mb-4"
            style={{ color: 'var(--color-secondary)' }}
          >
            <IconBook size={16} />
            Popular Courses
          </span>
          <h2 
            className="sec-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Our Popular Online Courses
          </h2>
        </div>

        {/* Course Categories Slider */}
        <div className="course-tab-1 mb-8 sm:mb-12">
          <div className="relative">
            {/* Navigation Arrows - Hidden on mobile */}
            <button
              onClick={prevSlide}
              disabled={!canGoPrev}
              className={`absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center transition-all duration-300 hidden lg:flex ${
                canGoPrev 
                  ? 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 shadow-sm hover:shadow-md' 
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            >
              <IconChevronLeft size={18} />
            </button>

            <button
              onClick={nextSlide}
              disabled={!canGoNext}
              className={`absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full items-center justify-center transition-all duration-300 hidden lg:flex ${
                canGoNext 
                  ? 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 shadow-sm hover:shadow-md' 
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            >
              <IconChevronRight size={18} />
            </button>

            {/* Categories Slider Container */}
            <div className="overflow-hidden mx-0 lg:mx-20">
              <div 
                ref={sliderRef}
                className="flex lg:transition-transform lg:duration-500 lg:ease-in-out gap-3 sm:gap-4 lg:gap-6 overflow-x-auto lg:overflow-hidden scrollbar-hide"
                style={{ 
                  transform: `translateX(-${currentSlide * 25}%)`
                }}
              >
                {categories.map((category) => (
                  <div key={category.id} className="flex-shrink-0 w-64 sm:w-72 lg:w-1/4 min-w-0">
                    <button
                      className={`tab-btn w-full p-3 sm:p-4 lg:p-5 rounded-lg transition-all duration-300 group ${
                        activeCategory === category.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm'
                      }`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className={`icon flex-shrink-0 p-1.5 sm:p-2 rounded-md transition-all duration-300 ${
                          activeCategory === category.id 
                            ? 'bg-white/20 text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {renderCategoryIcon(category.icon, 16)}
                        </span>
                        <div className="details text-left flex-1 min-w-0">
                          <span 
                            className={`box-title block text-sm sm:text-base font-medium mb-0.5 transition-colors duration-300 truncate ${
                              activeCategory === category.id ? 'text-white' : 'text-gray-900 group-hover:text-gray-700'
                            }`}
                          >
                            {category.name}
                          </span>
                          <span className={`text text-xs transition-colors duration-300 ${
                            activeCategory === category.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {category.courseCount} Courses
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="course-content mb-8 sm:mb-12">
          {loading ? (
            <div className="flex justify-center items-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 sm:py-12 px-4">
              <p className="text-red-600 text-base sm:text-lg mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center px-4">
          <a 
            href="/courses" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-sm font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-lg group text-sm sm:text-base"
          >
            VIEW ALL COURSES
            <IconArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default PopularCourses;