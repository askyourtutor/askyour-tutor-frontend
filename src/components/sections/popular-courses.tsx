import React, { useState, useEffect, useRef } from 'react';
import { 
  IconBook, 
  IconClock, 
  IconFile, 
  IconUsers, 
  IconTrendingUp, 
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
    <div className="course-box bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="course-img relative overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="tag absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <IconClock size={12} />
          {course.duration}
        </span>
      </div>
      
      <div className="course-content p-6">
        {/* Rating */}
        <div className="course-rating flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {renderStars(course.rating)}
          </div>
          <span className="text-sm text-gray-600">({course.ratingCount})</span>
        </div>

        {/* Title */}
        <h3 className="course-title text-lg font-semibold mb-4 line-clamp-2 hover:text-blue-600 transition-colors">
          <a href="/course-details" className="text-gray-800 hover:text-blue-600">
            {course.title}
          </a>
        </h3>

        {/* Meta Info */}
        <div className="course-meta flex items-center gap-4 mb-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <IconFile size={14} />
            Lesson {course.totalLessons}
          </span>
          <span className="flex items-center gap-1">
            <IconUsers size={14} />
            Students {course.totalStudents}+
          </span>
          <span className="flex items-center gap-1">
            <IconTrendingUp size={14} />
            {course.level}
          </span>
        </div>

        {/* Author and Price */}
        <div className="course-author flex items-center justify-between">
          <div className="author-info flex items-center gap-3">
            <img 
              src={course.instructor.avatar} 
              alt={course.instructor.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <a href="/instructor" className="author-name text-sm font-medium text-gray-700 hover:text-blue-600">
              {course.instructor.name}
            </a>
          </div>
          <div className="offer-tag bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {course.isFree ? 'Free' : `$${course.price}`}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section 
      className="space py-20 overflow-hidden relative"
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
        <div className="title-area text-center mb-12 lg:mb-16">
          <span 
            className="sub-title inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide mb-4"
            style={{ color: 'var(--color-secondary)' }}
          >
            <IconBook size={16} />
            Popular Courses
          </span>
          <h2 
            className="sec-title text-3xl sm:text-4xl lg:text-5xl font-bold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Our Popular Online Courses
          </h2>
        </div>

        {/* Course Categories Slider */}
        <div className="course-tab-1 mb-12">
          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              disabled={!canGoPrev}
              className={`absolute -left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
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
              className={`absolute -right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                canGoNext 
                  ? 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 shadow-sm hover:shadow-md' 
                  : 'bg-gray-50 text-gray-300 cursor-not-allowed'
              }`}
            >
              <IconChevronRight size={18} />
            </button>

            {/* Categories Slider Container */}
            <div className="overflow-hidden mx-20">
              <div 
                ref={sliderRef}
                className="flex transition-transform duration-500 ease-in-out gap-6"
                style={{ 
                  transform: `translateX(-${currentSlide * 25}%)` // 25% = 100% / 4 categories
                }}
              >
                {categories.map((category) => (
                  <div key={category.id} className="flex-shrink-0 w-1/4">
                    <button
                      className={`tab-btn w-full p-5 rounded-lg transition-all duration-300 group ${
                        activeCategory === category.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm'
                      }`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`icon flex-shrink-0 p-2 rounded-md transition-all duration-300 ${
                          activeCategory === category.id 
                            ? 'bg-white/20 text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {renderCategoryIcon(category.icon, 20)}
                        </span>
                        <div className="details text-left flex-1">
                          <span 
                            className={`box-title block text-base font-medium mb-0.5 transition-colors duration-300 ${
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
        <div className="course-content mb-12">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <a 
            href="/courses" 
            className="th-btn inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            View All Courses
            <IconArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default PopularCourses;