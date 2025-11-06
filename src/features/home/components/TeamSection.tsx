import { useState, useEffect, useCallback, useMemo, useRef, memo } from 'react';
import { 
  IconBook,
  IconPlus,
  IconBrandTwitter,
  IconBrandFacebook,
  IconBrandInstagram,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react';
import { teacherService } from '../../teachers/services/teacher.service';
import type { TutorSummary } from '../../../shared/types/teacher';
import { getAvatarUrl } from '../../../shared/utils/url';

const TeamCardSkeleton = memo(() => {
  return (
    <div className="relative text-center pt-1 bg-transparent">
      <div className="relative inline-block w-20 h-20 xs:w-24 xs:h-24 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-64 xl:h-64 2xl:w-80 2xl:h-80">
        {/* Skeleton Circle Shape */}
        <div className="absolute left-0 top-0 w-full h-full animate-pulse">
          <div className="w-full h-full rounded-full border-2 border-gray-200"></div>
        </div>
        
        {/* Skeleton Image Container */}
        <div className="relative z-20 rounded-full border border-gray-200/30 xs:border-2 xs:border-gray-200/50 sm:border-2 sm:border-gray-200/50 overflow-hidden p-1 xs:p-1.5 sm:p-4 md:p-5 lg:p-6 xl:p-5 w-full h-full">
          <div className="w-full h-full rounded-full overflow-hidden">
            <div className="w-full h-full bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Skeleton Content */}
      <div className="pt-1 xs:pt-2 sm:pt-6 md:pt-8 bg-transparent">
        <div className="h-4 xs:h-4 sm:h-6 md:h-7 lg:h-8 bg-gray-200 rounded animate-pulse mb-2 mx-auto" style={{ width: '60%' }}></div>
        <div className="h-3 xs:h-3 sm:h-4 md:h-5 bg-gray-200 rounded animate-pulse mx-auto" style={{ width: '40%' }}></div>
      </div>
    </div>
  );
});

TeamCardSkeleton.displayName = 'TeamCardSkeleton';

interface TeamCardProps {
  tutor: TutorSummary;
}

const TeamCard = memo(({ tutor }: TeamCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const name = useMemo(() => 
    `${tutor.tutorProfile.firstName} ${tutor.tutorProfile.lastName}`,
    [tutor.tutorProfile.firstName, tutor.tutorProfile.lastName]
  );
  
  // Get avatar URL with fallback
  const avatarUrl = useMemo(() => 
    tutor.tutorProfile.avatar 
      ? getAvatarUrl(tutor.tutorProfile.avatar)
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=400&background=random`,
    [tutor.tutorProfile.avatar, name]
  );

  return (
    <div 
      className="group relative text-center pt-1 bg-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative inline-block w-20 h-20 xs:w-24 xs:h-24 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-64 xl:h-64 2xl:w-80 2xl:h-80">
        {/* SVG Circle Shape */}
        <svg 
          className={`absolute left-0 top-0 w-full h-full transition-all duration-700 z-10 ${
            isHovered ? 'rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 327 337" 
          fill="none"
        >
          <path 
            d="M158.167 331C158.167 333.946 160.555 336.333 163.5 336.333C166.446 336.333 168.833 333.946 168.833 331C168.833 328.054 166.446 325.667 163.5 325.667C160.555 325.667 158.167 328.054 158.167 331ZM158.167 6C158.167 8.94552 160.555 11.3333 163.5 11.3333C166.446 11.3333 168.833 8.94552 168.833 6C168.833 3.05448 166.446 0.666667 163.5 0.666667C160.555 0.666667 158.167 3.05448 158.167 6ZM325 167.5C325 257.254 253.238 330 163.5 330V332C254.359 332 327 258.343 327 167.5H325ZM2.00012 167.5C2.00012 77.7618 73.7458 7 163.5 7V5C72.6574 5 0.00012207 76.6411 0.00012207 167.5H2.00012Z" 
            fill={isHovered ? "#F20F10" : "#0D5EF4"}
            className="transition-colors duration-700"
          />
        </svg>
        
        {/* Team Image Container */}
        <div className="relative z-20 rounded-full border border-gray-200/30 xs:border-2 xs:border-gray-200/50 sm:border-2 sm:border-gray-200/50 overflow-hidden p-1 xs:p-1.5 sm:p-4 md:p-5 lg:p-6 xl:p-5 w-full h-full">
          <div className="w-full h-full rounded-full overflow-hidden">
            <img 
              src={avatarUrl} 
              alt={name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-400"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="absolute bottom-3 xs:bottom-4 sm:bottom-12 md:bottom-14 left-1/2 transform -translate-x-1/2 z-30">
          {/* Plus Button - Hide when hovered */}
          <a 
            href="#" 
            className={`w-4 h-4 xs:w-5 xs:h-5 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:bg-blue-700 shadow-sm xs:shadow-md sm:shadow-lg relative z-30 ${
              isHovered ? 'opacity-0 invisible' : 'opacity-100 visible'
            }`}
          >
            <IconPlus size={10} className="sm:scale-110 md:scale-125" />
          </a>
          
          {/* Social Icons - Show when hovered */}
          <div className={`absolute left-1/2 transform -translate-x-1/2 bottom-0 flex gap-0.5 xs:gap-0.5 sm:gap-1.5 md:gap-2 z-20 transition-all duration-400 ${
            isHovered 
              ? 'opacity-100 visible translate-y-0' 
              : 'opacity-0 invisible translate-y-4'
          }`}>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-sm xs:shadow-md sm:shadow-lg bg-white text-[#F20F10] hover:bg-[#F20F10] hover:text-white transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: isHovered ? '0.1s' : '0s' }}
            >
              <IconBrandTwitter size={12} className="sm:scale-125 md:scale-150" />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-sm xs:shadow-md sm:shadow-lg bg-[#F20F10] text-white hover:bg-[#F20F10] hover:text-white transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: isHovered ? '0.2s' : '0s' }}
            >
              <IconBrandFacebook size={12} className="sm:scale-125 md:scale-150" />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-sm xs:shadow-md sm:shadow-lg bg-white text-[#F20F10] border border-[#F20F10] hover:bg-[#F20F10] hover:text-white hover:border-transparent transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: isHovered ? '0.3s' : '0s' }}
            >
              <IconBrandInstagram size={12} className="sm:scale-125 md:scale-150" />
            </a>
          </div>
        </div>
      </div>

      {/* Team Content */}
      <div className="pt-1 xs:pt-2 sm:pt-6 md:pt-8 bg-transparent">
        <h3 className="text-xs xs:text-xs sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-0 xs:mb-0.5 sm:mb-2 leading-tight">
          <a href={`/teachers/${tutor.id}`} className="hover:text-blue-600 transition-colors">
            {name}
            {tutor.isAdminTutor && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-gray-800 to-black text-white shadow-sm">
                FEATURED
              </span>
            )}
          </a>
        </h3>
        <span className="text-blue-600 block font-medium text-xs xs:text-xs sm:text-sm md:text-base leading-tight">
          {tutor.tutorProfile.professionalTitle || 'Instructor'}
        </span>
      </div>
    </div>
  );
});

TeamCard.displayName = 'TeamCard';

export default function TeamSection() {
  const [tutors, setTutors] = useState<TutorSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        const response = await teacherService.getTutors({ limit: 8 });
        
        // Sort to show admin tutors first
        const sortedTutors = response.data.sort((a, b) => {
          if (a.isAdminTutor && !b.isAdminTutor) return -1;
          if (!a.isAdminTutor && b.isAdminTutor) return 1;
          return 0;
        });
        
        setTutors(sortedTutors);
      } catch (err) {
        setError('Failed to load tutors');
        console.error('Error fetching tutors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  // Infinite auto-slide effect with pause on hover
  useEffect(() => {
    if (tutors.length === 0 || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 3500); // 3.5 seconds for smoother experience

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [tutors.length, isPaused]);

  // Reset position when we reach the cloned set (optimized)
  useEffect(() => {
    if (currentIndex === tutors.length && tutors.length > 0) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
        // Re-enable transition after reset
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      }, 500); // Wait for transition to complete

      return () => clearTimeout(timer);
    }
  }, [currentIndex, tutors.length]);

  const nextSlide = useCallback(() => {
    if (currentIndex >= tutors.length - 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, tutors.length]);

  const prevSlide = useCallback(() => {
    if (currentIndex === 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [currentIndex]);

  const goToSlide = useCallback((index: number) => {
    setIsTransitioning(true);
    setCurrentIndex(index);
  }, []);

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < tutors.length - 1;

  // Memoize duplicated array for better performance
  const displayTutors = useMemo(() => {
    if (tutors.length === 0) return [];
    return [...tutors, ...tutors];
  }, [tutors]);

  if (loading) {
    return (
      <section className="team-section py-16 lg:py-24 bg-slate-50 relative overflow-hidden" id="team-sec">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title Area */}
          <div className="title-area text-center mb-12 lg:mb-16">
            <div className="flex items-center justify-center gap-2 text-blue-600 font-medium mb-4">
              <IconBook size={20} />
              <span>Our Instructor</span>
            </div>
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900">
              Meet Our Expert Instructor
            </h2>
          </div>

          {/* Skeleton Grid */}
          <div className="flex gap-1 xs:gap-2 sm:gap-6 lg:gap-6 xl:gap-8 justify-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0">
                <TeamCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="team-section py-16 lg:py-24 bg-slate-50 relative overflow-hidden" id="team-sec">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="team-section py-16 lg:py-24 bg-slate-50 relative overflow-hidden" id="team-sec">
      {/* Decorative Shapes */}
      <div className="absolute -left-8 top-0 hidden lg:block opacity-70">
        <img 
          src="/assets/img/team/team-shape_1_1.png" 
          alt="Decorative Shape"
          className="w-auto h-auto"
        />
      </div>
      
      <div className="absolute left-[30%] top-[7%] hidden lg:block opacity-60" style={{ animationDelay: '1s' }}>
        <img 
          src="/assets/img/team/team-shape_1_2.png" 
          alt="Decorative Shape"
          className="w-auto h-auto"
        />
      </div>
      
      <div className="absolute left-[4%] bottom-[3%] hidden md:block opacity-80" style={{ animationDelay: '2s' }}>
        <img 
          src="/assets/img/team/team-shape_1_3.png" 
          alt="Decorative Shape"
          className="w-auto h-auto"
        />
      </div>
      
      <div className="absolute left-[40%] bottom-[4%] hidden md:block opacity-75" style={{ animationDuration: '8s' }}>
        <img 
          src="/assets/img/team/team-shape_1_4.png" 
          alt="Decorative Shape"
          className="w-auto h-auto"
        />
      </div>
      
      <div className="absolute -right-28 top-[10%] hidden 2xl:block opacity-65" style={{ animationDelay: '0.5s' }}>
        <img 
          src="/assets/img/team/team-shape_1_5.png" 
          alt="Decorative Shape"
          className="w-auto h-auto"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Area */}
        <div className="title-area text-center mb-12 lg:mb-16">
          <div className="flex items-center justify-center gap-2 text-blue-600 font-medium mb-4">
            <IconBook size={20} />
            <span>Our Instructor</span>
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900">
            Meet Our Expert Instructor
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={!canGoPrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-30 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ${
              canGoPrev 
                ? 'text-blue-600 hover:bg-blue-600 hover:text-white cursor-pointer' 
                : 'text-gray-300 cursor-not-allowed opacity-50'
            }`}
            aria-label="Previous tutors"
          >
            <IconChevronLeft size={24} />
          </button>
          
          <button
            onClick={nextSlide}
            disabled={!canGoNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-30 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 ${
              canGoNext 
                ? 'text-blue-600 hover:bg-blue-600 hover:text-white cursor-pointer' 
                : 'text-gray-300 cursor-not-allowed opacity-50'
            }`}
            aria-label="Next tutors"
          >
            <IconChevronRight size={24} />
          </button>

          {/* Carousel Track - Infinite Loop */}
          <div 
            className="overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div 
              ref={carouselRef}
              className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-linear' : ''}`}
              style={{
                transform: `translateX(-${currentIndex * 25}%)`,
                willChange: 'transform' // Optimize for animations
              }}
            >
              {displayTutors.map((tutor: TutorSummary, index: number) => (
                <div 
                  key={`${tutor.id}-${index}`}
                  className="flex-shrink-0 flex justify-center px-1 xs:px-1 sm:px-3 lg:px-3 xl:px-4"
                  style={{ width: '25%' }}
                >
                  <TeamCard tutor={tutor} />
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {tutors.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex % tutors.length === index
                    ? 'bg-blue-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
