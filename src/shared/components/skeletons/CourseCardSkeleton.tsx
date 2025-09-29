import React from 'react';
import { Skeleton, SkeletonAvatar } from '../ui/Skeleton';

export const CourseCardSkeleton: React.FC = () => (
  <div className="course-box bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 animate-pulse">
    {/* Image Skeleton */}
    <div className="course-img relative overflow-hidden">
      <Skeleton className="w-full h-24 xs:h-28 sm:h-32 md:h-40 lg:h-48" />
      <div className="absolute top-1 xs:top-1.5 sm:top-2 left-1 xs:left-1.5 sm:left-2">
        <Skeleton className="px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 w-12 h-5" rounded="full" />
      </div>
    </div>
    
    {/* Content Skeleton */}
    <div className="course-content p-2 xs:p-3 sm:p-4 lg:p-6">
      {/* Meta Skeleton */}
      <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 mb-1.5 xs:mb-2 sm:mb-3">
        <div className="flex items-center gap-0.5 xs:gap-1">
          <Skeleton className="w-3 h-3" />
          <Skeleton className="w-6 h-3" />
        </div>
        <div className="flex items-center gap-0.5 xs:gap-1">
          <Skeleton className="w-3 h-3" />
          <Skeleton className="w-8 h-3" />
        </div>
      </div>
      
      {/* Title Skeleton */}
      <div className="mb-1 xs:mb-1.5 sm:mb-2">
        <Skeleton className="h-4 mb-1" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      
      {/* Rating Skeleton */}
      <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 mb-1.5 xs:mb-2 sm:mb-3">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-3 h-3" />
          ))}
        </div>
        <Skeleton className="w-8 h-3" />
      </div>
      
      {/* Footer Skeleton */}
      <div className="flex items-center justify-between gap-1 xs:gap-2">
        <div className="flex items-center gap-1 xs:gap-1.5 flex-1">
          <SkeletonAvatar size="sm" />
          <Skeleton className="h-3 flex-1 max-w-20" />
        </div>
        <Skeleton className="w-12 h-5" rounded="full" />
      </div>
    </div>
  </div>
);

export const CourseSkeletonGrid: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8">
    {[...Array(count)].map((_, i) => (
      <CourseCardSkeleton key={i} />
    ))}
  </div>
);

export default CourseCardSkeleton;
