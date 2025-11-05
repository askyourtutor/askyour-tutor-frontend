import React, { useState, useEffect, useRef } from 'react';
import { 
  IconSearch, 
  IconX, 
  IconChevronDown,
  IconArrowsSort
} from '@tabler/icons-react';
import { CourseCard } from '../../../shared/components/cards/CourseCard';
import { CourseSkeletonGrid } from '../../../shared/components/skeletons/CourseCardSkeleton';
import { EmptyState } from '../../../shared/components/ui/EmptyState';
import type { CourseSummary, CategorySummary } from '../../../shared/types';
import { getCourses, getCategories } from '../services/course.service';
import { fetchWithCache } from '../../../shared/lib/cache';

type SortOption = 'popular' | 'newest' | 'price-low' | 'price-high' | 'rating';

interface FilterState {
  category: string;
  priceType: 'all' | 'free' | 'paid';
  level: 'all' | 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  sortBy: SortOption;
}

const CoursesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Start as false for instant cache hits
  const [filteredCourses, setFilteredCourses] = useState<CourseSummary[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([
    { id: 'all', name: 'All Categories', slug: 'all', courseCount: 0 },
  ]);
  const [totalCount, setTotalCount] = useState(0);
  
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const priceDropdownRef = useRef<HTMLDivElement>(null);
  const levelDropdownRef = useRef<HTMLDivElement>(null);
  const ratingDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceType: 'all',
    level: 'all',
    rating: 0,
    sortBy: 'popular',
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Use cache with stale-while-revalidate pattern
        const cats = await fetchWithCache(
          'courses:categories',
          () => getCategories()
        );
        setCategories([
          { id: 'all', name: 'All Categories', slug: 'all', courseCount: 0 },
          ...cats,
        ]);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch courses from API with all filters
  useEffect(() => {
    const fetchCourses = async () => {
      // Show loading only if taking longer than 100ms
      const loadingTimeout = setTimeout(() => setIsLoading(true), 100);
      try {
        // Create cache key from filters and search query
        const cacheKey = `courses:list:${filters.category}:${filters.priceType}:${filters.level}:${filters.rating}:${filters.sortBy}:${searchQuery}`;
        
        const response = await fetchWithCache(
          cacheKey,
          () => getCourses({
            category: filters.category !== 'all' ? filters.category : undefined,
            priceType: filters.priceType !== 'all' ? filters.priceType : undefined,
            level: filters.level !== 'all' ? filters.level : undefined,
            rating: filters.rating > 0 ? filters.rating : undefined,
            search: searchQuery.trim() || undefined,
            sortBy: filters.sortBy,
            page: 1,
            limit: 100, // Fetch more for client-side display
          })
        );
        
        setFilteredCourses(response.data);
        setTotalCount(response.pagination.total);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setFilteredCourses([]);
        setTotalCount(0);
      } finally {
        clearTimeout(loadingTimeout);
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [filters, searchQuery]);

  const handleCategoryChange = (categoryId: string) => {
    setFilters(prev => ({ ...prev, category: categoryId }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      category: 'all',
      priceType: 'all',
      level: 'all',
      rating: 0,
      sortBy: 'popular',
    });
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between gap-3">
            {/* Search Input - Left */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <IconSearch size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <IconX size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Dropdowns - Right */}
            <div className="flex items-center gap-1.5">
              {/* Category Dropdown */}
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md border transition-colors text-xs font-medium ${
                    filters.category !== 'all'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="hidden sm:inline truncate max-w-24">
                    {filters.category === 'all' 
                      ? 'Category' 
                      : categories.find(c => c.id === filters.category)?.name || 'Category'}
                  </span>
                  <span className="sm:hidden">
                    {filters.category === 'all' 
                      ? 'Cat' 
                      : (categories.find(c => c.id === filters.category)?.name || 'Cat').slice(0, 3)}
                  </span>
                  <IconChevronDown size={12} className={`transition-transform flex-shrink-0 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-80 overflow-y-auto z-50">
                    {categories.map((category) => (
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
                          {category.courseCount > 0 && (
                            <span className="text-xs text-gray-500">{category.courseCount}</span>
                          )}
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
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md border transition-colors text-xs font-medium ${
                    filters.priceType !== 'all'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="hidden sm:inline">
                    {filters.priceType === 'all' ? 'Price' : filters.priceType === 'free' ? 'Free' : 'Paid'}
                  </span>
                  <span className="sm:hidden">
                    {filters.priceType === 'all' ? '$' : filters.priceType === 'free' ? 'Free' : 'Paid'}
                  </span>
                  <IconChevronDown size={12} className={`transition-transform flex-shrink-0 ${showPriceDropdown ? 'rotate-180' : ''}`} />
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
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md border transition-colors text-xs font-medium ${
                    filters.level !== 'all'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="hidden sm:inline">
                    {filters.level === 'all' ? 'Level' : filters.level.charAt(0).toUpperCase() + filters.level.slice(1)}
                  </span>
                  <span className="sm:hidden">
                    {filters.level === 'all' ? 'Lvl' : filters.level.slice(0, 3)}
                  </span>
                  <IconChevronDown size={12} className={`transition-transform flex-shrink-0 ${showLevelDropdown ? 'rotate-180' : ''}`} />
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
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md border transition-colors text-xs font-medium ${
                    filters.rating > 0
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="hidden sm:inline">
                    {filters.rating === 0 ? 'Rating' : `${filters.rating}+ Stars`}
                  </span>
                  <span className="sm:hidden">
                    {filters.rating === 0 ? '★' : `${filters.rating}+`}
                  </span>
                  <IconChevronDown size={12} className={`transition-transform flex-shrink-0 ${showRatingDropdown ? 'rotate-180' : ''}`} />
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

              {/* Sort Dropdown */}
              <div className="relative" ref={sortDropdownRef}>
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700"
                >
                  <IconArrowsSort size={12} />
                  <span className="hidden md:inline">
                    {filters.sortBy === 'popular' ? 'Popular' : 
                     filters.sortBy === 'newest' ? 'Newest' : 
                     filters.sortBy === 'price-low' ? 'Price: Low' : 
                     filters.sortBy === 'price-high' ? 'Price: High' : 'Sort'}
                  </span>
                  <IconChevronDown size={12} className={`transition-transform flex-shrink-0 ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showSortDropdown && (
                  <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                    {[
                      { value: 'popular', label: 'Popular' },
                      { value: 'newest', label: 'Newest' },
                      { value: 'price-low', label: 'Price: Low to High' },
                      { value: 'price-high', label: 'Price: High to Low' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                        setFilters({ ...filters, sortBy: option.value as SortOption });
                        setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                          filters.sortBy === option.value
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
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
                  className="flex items-center gap-0.5 px-2.5 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors text-xs font-medium text-gray-700"
                  title="Clear all filters"
                >
                  <IconX size={12} />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        {/* Full Width Content */}
        <div className="pb-16">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-gray-700 text-sm sm:text-base">
                  {isLoading ? (
                    <span className="animate-pulse">Loading courses...</span>
                  ) : (
                    <>
                      Showing <span className="text-blue-600 font-semibold">{filteredCourses.length}</span> 
                      {totalCount > filteredCourses.length && ` of ${totalCount}`} courses
                      {searchQuery && <span className="text-gray-500"> for "{searchQuery}"</span>}
                    </>
                  )}
                </p>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
        </div>
      </div>

      {/* Fixed Bottom Pagination */}
      {!isLoading && filteredCourses.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex justify-center items-center gap-1.5">
              <button className="px-2.5 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors" disabled>
                Prev
              </button>
              <div className="flex gap-1">
                <button className="w-7 h-7 text-xs bg-blue-600 text-white rounded font-medium flex items-center justify-center">1</button>
                <button className="w-7 h-7 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center">2</button>
                <button className="w-7 h-7 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center">3</button>
              </div>
              <button className="px-2.5 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
