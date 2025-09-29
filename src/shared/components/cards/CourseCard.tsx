import React, { useState } from 'react';
import { IconFile, IconUsers, IconStar, IconClock } from '@tabler/icons-react';
import type { Course } from '../../types';

// Extended Course interface for additional properties
interface ExtendedCourse extends Omit<Course, 'duration'> {
  isFree?: boolean;
  totalLessons?: number;
  totalStudents?: number;
  duration?: string;
  instructor?: {
    name?: string;
    avatar?: string;
  };
}

// Normalize URLs coming from API (e.g., "/uploads/..." should point to backend origin, not Vite dev server)
function resolveAssetUrl(url?: string | null): string | undefined {
  if (!url) return url ?? undefined;
  try {
    let u = String(url).trim();
    // If already absolute, return as-is
    if (/^https?:\/\//i.test(u)) return u;
    // Normalize missing leading slash
    if (u.startsWith('uploads/')) u = `/${u}`;
    // If it starts with /uploads, prefix API origin without /api
    if (u.startsWith('/uploads/')) {
      const apiBase = (import.meta.env.VITE_API_URL as string) || '/api';
      // Build an absolute URL from apiBase using the browser origin as base
      const apiUrl = new URL(apiBase, window.location.origin);
      // Strip any trailing '/api' segment to get server origin
      const origin = apiUrl.pathname.replace(/\/$/, '').endsWith('/api')
        ? `${apiUrl.protocol}//${apiUrl.host}`
        : `${apiUrl.protocol}//${apiUrl.host}${apiUrl.pathname.replace(/\/$/, '')}`;
      return `${origin}${u}`;
    }
    return u;
  } catch {
    return url ?? undefined;
  }
}

// Local helpers for UX formatting
const renderStars = (rating: number) => {
  const safe = Math.max(0, Math.min(5, Number.isFinite(rating) ? rating : 0));
  const stars: React.ReactElement[] = [];
  const fullStars = Math.floor(safe);
  const hasHalfStar = safe % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<IconStar key={i} size={12} className="text-amber-400 fill-current" />);
  }
  if (hasHalfStar) {
    stars.push(<IconStar key="half" size={12} className="text-amber-400 fill-current opacity-50" />);
  }
  const remainingStars = 5 - Math.ceil(safe);
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<IconStar key={`empty-${i}`} size={12} className="text-gray-300" />);
  }
  return stars;
};

const formatPrice = (price?: number, isFree?: boolean) => {
  if (isFree) return 'Free';
  if (typeof price === 'number' && isFinite(price)) return `$${price}`;
  return '$ —';
};

const formatCount = (n?: number) => {
  if (!n || !isFinite(n)) return '0';
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
};

const getInitials = (text?: string) => {
  if (!text) return 'AY';
  const parts = text.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase() || '').join('') || 'AY';
};

export interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [imageFailed, setImageFailed] = useState(false);
  
  const placeholderUrl = '/assets/img/course/course_1.jpg';
  const resolvedImage = resolveAssetUrl(course.image);
  const hasImage = Boolean(resolvedImage) && !imageFailed;
  const imgSrc = (resolvedImage && !imageFailed) ? resolvedImage : placeholderUrl;
  if (import.meta.env.DEV) {
    // Temporary debug: log once per course id
    try { console.debug('[CourseCard] image', { id: course.id, apiImage: course.image, resolvedImage, using: imgSrc }); } catch { /* noop */ }
  }
  
  // Type-safe property access with proper defaults
  const extendedCourse = course as ExtendedCourse;
  const isFree = extendedCourse?.isFree ?? (Number(course.price) === 0);
  const priceLabel = formatPrice(Number(course.price), isFree);
  const displayRating = Math.max(0, Math.min(5, Number(course.rating ?? 0)));
  const lessons = Number(extendedCourse?.totalLessons ?? 0);
  const students = Number(extendedCourse?.totalStudents ?? 0);
  const instructorName = extendedCourse?.instructor?.name || 'Tutor';
  const instructorAvatar = resolveAssetUrl(extendedCourse?.instructor?.avatar) || '/assets/img/course/author.png';
  const duration = extendedCourse?.duration;

  return (
    <div 
      className="group bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden w-full" 
      aria-label={course.title}
    >
      {/* Course Image Container */}
      <div className="relative overflow-hidden aspect-[3/2] sm:aspect-[4/3] lg:aspect-[16/10]">
        {hasImage ? (
          <img
            src={imgSrc}
            alt={course.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              if (import.meta.env.DEV) {
                try { console.warn('[CourseCard] image error', { id: course.id, src: (e.currentTarget as HTMLImageElement).src }); } catch { /* noop */ }
              }
              setImageFailed(true);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors duration-300">
            <span className="text-xl sm:text-2xl font-medium text-gray-400">
              {getInitials(course.title)}
            </span>
          </div>
        )}
        
        {/* Removed overlay for mobile optimization */}
        
        {/* Duration badge */}
        {duration && (
          <div className="absolute top-2 lg:top-3 left-2 lg:left-3">
            <div className="flex items-center gap-1 bg-black/80 text-white px-1.5 lg:px-2 py-0.5 lg:py-1 rounded text-[10px] lg:text-xs">
              <IconClock size={10} className="lg:w-3 lg:h-3" />
              <span>{duration}</span>
            </div>
          </div>
        )}
        
        {/* Price badge */}
        <div className="absolute top-2 lg:top-3 right-2 lg:right-3">
          <div className={`px-1.5 lg:px-2 py-0.5 lg:py-1 rounded text-[10px] lg:text-xs font-medium ${
            isFree 
              ? 'bg-green-500 text-white' 
              : 'bg-white text-gray-900'
          }`}>
            {priceLabel}
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-3 lg:p-4">
        {/* Course Meta */}
        <div className="flex items-center gap-3 lg:gap-4 mb-2 lg:mb-3 text-gray-500">
          <div className="flex items-center gap-1">
            <IconFile size={12} className="text-gray-400 lg:w-4 lg:h-4" />
            <span className="text-xs lg:text-sm">{lessons} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <IconUsers size={12} className="text-gray-400 lg:w-4 lg:h-4" />
            <span className="text-xs lg:text-sm">{formatCount(students)} students</span>
          </div>
        </div>

        {/* Course Title */}
        <h3 className="text-sm lg:text-lg font-semibold text-gray-900 mb-2 lg:mb-3 line-clamp-2 leading-tight">
          <a href={`/course/${course.id}`} className="hover:text-blue-600 transition-colors duration-200">
            {course.title}
          </a>
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1.5 lg:gap-2 mb-3 lg:mb-4">
          <div className="flex items-center gap-0.5">
            {renderStars(displayRating)}
          </div>
          <span className="text-xs lg:text-sm text-gray-600">
            {displayRating.toFixed(1)}
          </span>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2 lg:gap-3">
          <img
            src={instructorAvatar}
            alt={instructorName}
            loading="lazy"
            decoding="async"
            className="w-6 h-6 lg:w-8 lg:h-8 rounded-full object-cover"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.onerror = null;
              img.src = '/assets/img/course/author.png';
            }}
          />
          <div className="flex-1 min-w-0">
            <a 
              href="/instructor" 
              className="text-xs lg:text-sm font-medium text-gray-700 hover:text-blue-600 truncate block transition-colors duration-200"
            >
              {instructorName}
            </a>
            <p className="text-[10px] lg:text-xs text-gray-500">Instructor</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
