import React, { useState, useEffect, useRef } from 'react';
import { 
  IconSearch, 
  IconX, 
  IconLayoutGrid,
  IconLayoutList,
  IconChevronDown
} from '@tabler/icons-react';
import { CourseCard } from '../../../shared/components/cards/CourseCard';
import { CourseSkeletonGrid } from '../../../shared/components/skeletons/CourseCardSkeleton';
import { EmptyState } from '../../../shared/components/ui/EmptyState';
import type { CourseSummary, CategorySummary } from '../../../shared/types';

// Mock categories for now - replace with API call later
const MOCK_CATEGORIES: CategorySummary[] = [
  { id: 'all', name: 'All Categories', slug: 'all', courseCount: 156 },
  { id: '1', name: 'Mathematics', slug: 'mathematics', courseCount: 45 },
  { id: '2', name: 'Computer Science', slug: 'computer-science', courseCount: 38 },
  { id: '3', name: 'Physics', slug: 'physics', courseCount: 28 },
  { id: '4', name: 'Chemistry', slug: 'chemistry', courseCount: 22 },
  { id: '5', name: 'Business', slug: 'business', courseCount: 15 },
  { id: '6', name: 'English', slug: 'english', courseCount: 8 },
];

type ViewMode = 'grid' | 'list';
type SortOption = 'popular' | 'newest' | 'price-low' | 'price-high' | 'rating';

interface FilterState {
  category: string;
  priceType: 'all' | 'free' | 'paid';
  level: 'all' | 'beginner' | 'intermediate' | 'advanced';
  rating: number;
}

const CoursesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<CourseSummary[]>([]);
  
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const priceDropdownRef = useRef<HTMLDivElement>(null);
  const levelDropdownRef = useRef<HTMLDivElement>(null);
  const ratingDropdownRef = useRef<HTMLDivElement>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceType: 'all',
    level: 'all',
    rating: 0,
  });

  // Simulate loading courses - Replace with actual API call
  useEffect(() => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      // Mock data - replace with actual API call
      const mockCourses: CourseSummary[] = [];
      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...courses];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(query) ||
        course.instructor?.name?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      // Apply category filter when backend is integrated
    }

    // Price filter
    if (filters.priceType === 'free') {
      result = result.filter(course => course.isFree);
    } else if (filters.priceType === 'paid') {
      result = result.filter(course => !course.isFree);
    }

    // Rating filter
    if (filters.rating > 0) {
      result = result.filter(course => (course.rating || 0) >= filters.rating);
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        // Sort by date when available
        break;
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
      default:
        result.sort((a, b) => (b.totalStudents || 0) - (a.totalStudents || 0));
        break;
    }

    setFilteredCourses(result);
  }, [courses, searchQuery, filters, sortBy]);

  const handleCategoryChange = (categoryId: string) => {
    setFilters(prev => ({ ...prev, category: categoryId }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      priceType: 'all',
      level: 'all',
      rating: 0,
    });
    setSearchQuery('');
    setSortBy('popular');
  };

  const activeFiltersCount = 
    (filters.category !== 'all' ? 1 : 0) +
    (filters.priceType !== 'all' ? 1 : 0) +
    (filters.level !== 'all' ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (priceDropdownRef.current && !priceDropdownRef.current.contains(event.target as Node)) {
        setShowPriceDropdown(false);
      }
      if (levelDropdownRef.current && !levelDropdownRef.current.contains(event.target as Node)) {
        setShowLevelDropdown(false);
      }
      if (ratingDropdownRef.current && !ratingDropdownRef.current.contains(event.target as Node)) {
        setShowRatingDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Search and Filter Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <IconX size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2">
              {/* Category Dropdown */}
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-colors text-sm font-medium ${
                    filters.category !== 'all'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="hidden sm:inline">Category</span>
                  <span className="sm:hidden">Cat</span>
                  {filters.category !== 'all' && (
                    <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      1
                    </span>
                  )}
                  <IconChevronDown size={16} className={`transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-80 overflow-y-auto z-50">
                    {MOCK_CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          handleCategoryChange(category.id);
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          filters.category === category.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{category.name}</span>
                          <span className="text-xs text-gray-500">{category.courseCount}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Dropdown */}
              <div className="relative" ref={priceDropdownRef}>
                <button
                  onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-colors text-sm font-medium ${
                    filters.priceType !== 'all'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="hidden sm:inline">Price</span>
                  <span className="sm:hidden">$</span>
                  {filters.priceType !== 'all' && (
                    <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      1
                    </span>
                  )}
                  <IconChevronDown size={16} className={`transition-transform ${showPriceDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showPriceDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {[
                      { value: 'all', label: 'All Courses' },
                      { value: 'free', label: 'Free' },
                      { value: 'paid', label: 'Paid' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilters(prev => ({ ...prev, priceType: option.value as FilterState['priceType'] }));
                          setShowPriceDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          filters.priceType === option.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Level Dropdown */}
              <div className="relative" ref={levelDropdownRef}>
                <button
                  onClick={() => setShowLevelDropdown(!showLevelDropdown)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-colors text-sm font-medium ${
                    filters.level !== 'all'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="hidden sm:inline">Level</span>
                  <span className="sm:hidden">Lvl</span>
                  {filters.level !== 'all' && (
                    <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      1
                    </span>
                  )}
                  <IconChevronDown size={16} className={`transition-transform ${showLevelDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showLevelDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {[
                      { value: 'all', label: 'All Levels' },
                      { value: 'beginner', label: 'Beginner' },
                      { value: 'intermediate', label: 'Intermediate' },
                      { value: 'advanced', label: 'Advanced' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilters(prev => ({ ...prev, level: option.value as FilterState['level'] }));
                          setShowLevelDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          filters.level === option.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Rating Dropdown */}
              <div className="relative" ref={ratingDropdownRef}>
                <button
                  onClick={() => setShowRatingDropdown(!showRatingDropdown)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-colors text-sm font-medium ${
                    filters.rating > 0
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="hidden sm:inline">Rating</span>
                  <span className="sm:hidden">★</span>
                  {filters.rating > 0 && (
                    <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      1
                    </span>
                  )}
                  <IconChevronDown size={16} className={`transition-transform ${showRatingDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showRatingDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {[
                      { value: 0, label: 'All Ratings' },
                      { value: 4, label: '4+ Stars' },
                      { value: 3, label: '3+ Stars' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilters(prev => ({ ...prev, rating: option.value }));
                          setShowRatingDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          filters.rating === option.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
                  title="Clear all filters"
                >
                  <IconX size={16} />
                  <span className="hidden lg:inline">Clear</span>
                </button>
              )}

              {/* View Mode Toggle (Desktop) */}
              <div className="hidden md:flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
                  title="Grid view"
                >
                  <IconLayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
                  title="List view"
                >
                  <IconLayoutList size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        {/* Full Width Content */}
        <div>
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-gray-700 text-sm sm:text-base">
                  {isLoading ? (
                    <span className="animate-pulse">Loading courses...</span>
                  ) : (
                    <>
                      Showing <span className="text-blue-600 font-semibold">{filteredCourses.length}</span> courses
                      {searchQuery && <span className="text-gray-500"> for "{searchQuery}"</span>}
                    </>
                  )}
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-gray-600 whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Course Grid/List */}
            {isLoading ? (
              <CourseSkeletonGrid count={8} />
            ) : filteredCourses.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <EmptyState
                  type={searchQuery ? 'search' : 'courses'}
                  title={searchQuery ? 'No courses found' : 'No courses available'}
                  message={
                    searchQuery
                      ? `We couldn't find any courses matching "${searchQuery}". Try adjusting your search or filters.`
                      : 'There are no courses available at the moment. Check back later!'
                  }
                />
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6'
                    : 'space-y-4'
                }
              >
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}

            {/* Pagination - Placeholder */}
            {!isLoading && filteredCourses.length > 0 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  Previous
                </button>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Next
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
