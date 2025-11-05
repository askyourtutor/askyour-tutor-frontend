import React, { useState, useEffect, useRef } from 'react';
import { 
  IconSearch, 
  IconX, 
  IconChevronDown,
  IconArrowsSort
} from '@tabler/icons-react';
import { TeacherCard } from '../components/TeacherCard';
import { TeacherSkeletonGrid } from '../components/TeacherCardSkeleton';
import { EmptyState } from '../../../shared/components/ui/EmptyState';
import type { TutorSummary } from '../../../shared/types/teacher';
import { teacherService } from '../services/teacher.service';
import { fetchWithCache } from '../../../shared/lib/cache';

type SortOption = 'newest' | 'price-low' | 'price-high';

interface FilterState {
  subject: string;
  priceRange: string;
  sortBy: SortOption;
}

const TeachersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Only track initial load
  const [filteredTeachers, setFilteredTeachers] = useState<TutorSummary[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  
  const subjectDropdownRef = useRef<HTMLDivElement>(null);
  const priceDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    subject: 'all',
    priceRange: 'all',
    sortBy: 'newest',
  });

  // Fetch subjects on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        // Use cache with stale-while-revalidate pattern
        const subjectList = await fetchWithCache(
          'teachers:subjects',
          () => teacherService.getSubjects()
        );
        setSubjects(subjectList);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch teachers from API with full filter support
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // Create cache key from filters and search query
        const cacheKey = `teachers:list:${filters.subject}:${filters.priceRange}:${filters.sortBy}:${searchQuery}`;
        
        const response = await fetchWithCache(
          cacheKey,
          () => teacherService.getTutors({
            subject: filters.subject !== 'all' ? filters.subject : undefined,
            priceRange: filters.priceRange !== 'all' ? filters.priceRange : undefined,
            search: searchQuery.trim() || undefined,
            sortBy: filters.sortBy,
            page: 1,
            limit: 100,
          })
        );
        
        setFilteredTeachers(response.data);
        setTotalCount(response.pagination.total);
        setIsInitialLoad(false);
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
        setFilteredTeachers([]);
        setTotalCount(0);
      }
    };

    fetchTeachers();
  }, [filters, searchQuery]);

  const handleSubjectChange = (subject: string) => {
    setFilters(prev => ({ ...prev, subject }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      subject: 'all',
      priceRange: 'all',
      sortBy: 'newest',
    });
  };

  const activeFiltersCount = [
    { name: 'subject', isActive: filters.subject !== 'all' },
    { name: 'priceRange', isActive: filters.priceRange !== 'all' },
    { name: 'sortBy', isActive: filters.sortBy !== 'newest' },
  ].filter(f => f.isActive).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (subjectDropdownRef.current && !subjectDropdownRef.current.contains(e.target as Node)) {
        setShowSubjectDropdown(false);
      }
      if (priceDropdownRef.current && !priceDropdownRef.current.contains(e.target as Node)) {
        setShowPriceDropdown(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
                  placeholder="Search teachers..."
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
              {/* Subject Dropdown */}
              <div className="relative" ref={subjectDropdownRef}>
                <button
                  onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md border transition-colors text-xs font-medium ${
                    filters.subject !== 'all'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="hidden sm:inline truncate max-w-24">
                    {filters.subject === 'all' ? 'Subject' : filters.subject}
                  </span>
                  <span className="sm:hidden">Subj</span>
                  <IconChevronDown size={12} className={`transition-transform flex-shrink-0 ${showSubjectDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showSubjectDropdown && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 max-h-64 overflow-y-auto">
                    <button
                      onClick={() => {
                        handleSubjectChange('all');
                        setShowSubjectDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                        filters.subject === 'all'
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      All Subjects
                    </button>
                    {subjects.map((subject) => (
                      <button
                        key={subject}
                        onClick={() => {
                          handleSubjectChange(subject);
                          setShowSubjectDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                          filters.subject === subject
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {subject}
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
                    filters.priceRange !== 'all'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="hidden sm:inline">
                    {filters.priceRange === 'all' ? 'Price' : 
                     filters.priceRange === 'low-to-high' ? 'Low to High' :
                     filters.priceRange === 'high-to-low' ? 'High to Low' :
                     filters.priceRange}
                  </span>
                  <span className="sm:hidden">$</span>
                  <IconChevronDown size={12} className={`transition-transform flex-shrink-0 ${showPriceDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showPriceDropdown && (
                  <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                    {[
                      { value: 'all', label: 'All Prices' },
                      { value: 'low-to-high', label: 'Low to High' },
                      { value: 'high-to-low', label: 'High to Low' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilters({ ...filters, priceRange: option.value });
                          setShowPriceDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                          filters.priceRange === option.value
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

              {/* Sort Dropdown */}
              <div className="relative" ref={sortDropdownRef}>
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-xs font-medium text-gray-700"
                >
                  <IconArrowsSort size={12} />
                  <span className="hidden md:inline">
                    {filters.sortBy === 'newest' ? 'Newest' : 
                     filters.sortBy === 'price-low' ? 'Price: Low' : 
                     filters.sortBy === 'price-high' ? 'Price: High' : 'Sort'}
                  </span>
                  <IconChevronDown size={12} className={`transition-transform flex-shrink-0 ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showSortDropdown && (
                  <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                    {[
                      { value: 'newest', label: 'Newest First' },
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
        {/* Results Header */}
        <div className="mb-3 lg:mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">
                {isInitialLoad ? (
                  <span className="animate-pulse">Loading teachers...</span>
                ) : (
                  <>
                    Showing <span className="text-blue-600 font-semibold">{filteredTeachers.length}</span> 
                    {totalCount > filteredTeachers.length && ` of ${totalCount}`} teachers
                    {searchQuery && <span className="text-gray-500"> for "{searchQuery}"</span>}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Teachers Grid */}
        {isInitialLoad ? (
          <TeacherSkeletonGrid count={12} />
        ) : filteredTeachers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 pb-16">
            {filteredTeachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No teachers found"
            message="Try adjusting your filters or search query"
          />
        )}
      </div>

      {/* Fixed Pagination */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30 py-2">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-1.5">
            <button className="px-2.5 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">
              Prev
            </button>
            <button className="w-7 h-7 text-xs font-medium border border-blue-500 bg-blue-50 text-blue-600 rounded">
              1
            </button>
            <button className="w-7 h-7 text-xs border border-gray-300 rounded hover:bg-gray-50">
              2
            </button>
            <button className="w-7 h-7 text-xs border border-gray-300 rounded hover:bg-gray-50">
              3
            </button>
            <button className="px-2.5 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachersPage;
