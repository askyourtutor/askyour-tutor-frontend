import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const CourseCardSkeleton: React.FC = () => (
  <div className="course-box bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 animate-pulse">
    {/* Image Skeleton */}
    <div className="course-img relative overflow-hidden">
      <Skeleton className="w-full h-32 aspect-[4/3]" />
      <div className="absolute top-2 left-2">
        <Skeleton className="px-1.5 py-0.5 w-10 h-4" rounded="full" />
      </div>
    </div>
    
    {/* Content Skeleton */}
    <div className="course-content p-2.5">
      {/* Meta Skeleton */}
      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex items-center gap-0.5">
          <Skeleton className="w-3 h-3" />
          <Skeleton className="w-4 h-2.5" />
        </div>
        <div className="flex items-center gap-0.5">
          <Skeleton className="w-3 h-3" />
          <Skeleton className="w-6 h-2.5" />
        </div>
      </div>
      
      {/* Title Skeleton */}
      <div className="mb-1.5">
        <Skeleton className="h-3 mb-1" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      
      {/* Rating Skeleton */}
      <div className="flex items-center gap-1 mb-2">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-2.5 h-2.5" />
          ))}
        </div>
        <Skeleton className="w-6 h-2.5" />
      </div>
      
      {/* Footer Skeleton */}
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-gray-200" />
        <Skeleton className="h-2.5 flex-1" />
      </div>
    </div>
  </div>
);

export const CourseSkeletonGrid: React.FC<{ count?: number }> = ({ count = 12 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
    {[...Array(count)].map((_, i) => (
      <CourseCardSkeleton key={i} />
    ))}
  </div>
);

export default CourseCardSkeleton;
