import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { IconFile, IconUsers, IconStar, IconClock } from '@tabler/icons-react';
import type { CourseSummary } from '../../types';

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
  course: CourseSummary;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const navigate = useNavigate();
  
  const placeholderUrl = '/assets/img/course/course_1.jpg';
  const resolvedImage = resolveAssetUrl(course.image);
  const hasImage = Boolean(resolvedImage) && !imageFailed;
  const imgSrc = (resolvedImage && !imageFailed) ? resolvedImage : placeholderUrl;
  if (import.meta.env.DEV) {
    // Temporary debug: log once per course id
    try { console.debug('[CourseCard] image', { id: course.id, apiImage: course.image, resolvedImage, using: imgSrc }); } catch { /* noop */ }
  }
  
  // Type-safe property access with proper defaults
  const isFree = Boolean(course.isFree || Number(course.price) === 0);
  const priceLabel = formatPrice(Number(course.price), isFree);
  const displayRating = Math.max(0, Math.min(5, Number(course.rating ?? 0)));
  const lessons = Number(course.totalLessons ?? 0);
  const students = Number(course.totalStudents ?? 0);
  const instructorName = course.instructor?.name || 'Tutor';
  const instructorAvatar = resolveAssetUrl(course.instructor?.avatar) || '/assets/img/course/author.png';
  const duration = course.duration;

  const handleCardClick = () => {
    // All users (including tutors and guests) can view course details
    navigate(`/course/${course.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-lg border border-gray-100 shadow-sm transition-all duration-300 overflow-hidden w-full cursor-pointer hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5"
      aria-label={course.title}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Course Image Container */}
      <div className="relative overflow-hidden aspect-[4/3]">
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
            <span className="text-lg font-medium text-gray-400">
              {getInitials(course.title)}
            </span>
          </div>
        )}
        
        {/* Duration badge */}
        {duration && (
          <div className="absolute top-2 left-2">
            <div className="flex items-center gap-0.5 bg-black/80 text-white px-1.5 py-0.5 rounded text-[10px]">
              <IconClock size={10} />
              <span>{duration}</span>
            </div>
          </div>
        )}
        
        {/* Price badge */}
        <div className="absolute top-2 right-2">
          <div className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
            isFree 
              ? 'bg-green-500 text-white' 
              : 'bg-white text-gray-900'
          }`}>
            {priceLabel}
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-2.5">
        {/* Course Meta */}
        <div className="flex items-center gap-2.5 mb-1.5 text-gray-500">
          <div className="flex items-center gap-0.5">
            <IconFile size={11} className="text-gray-400" />
            <span className="text-[10px]">{lessons}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <IconUsers size={11} className="text-gray-400" />
            <span className="text-[10px]">{formatCount(students)}</span>
          </div>
        </div>

        {/* Course Title */}
        <h3 className="text-xs font-semibold text-gray-900 mb-1.5 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-200">
          {course.title}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {renderStars(displayRating)}
          </div>
          <span className="text-[10px] text-gray-600">
            {displayRating.toFixed(1)}
          </span>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-1.5">
          <img
            src={instructorAvatar}
            alt={instructorName}
            loading="lazy"
            decoding="async"
            className="w-5 h-5 rounded-full object-cover"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.onerror = null;
              img.src = '/assets/img/course/author.png';
            }}
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-medium text-gray-700 truncate block">
              {instructorName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
