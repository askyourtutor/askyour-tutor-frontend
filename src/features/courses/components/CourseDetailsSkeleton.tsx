import React from 'react';
import { Skeleton, SkeletonText, SkeletonAvatar } from '../../../shared/components/ui';

const CourseDetailsSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar Skeleton */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="mx-auto px-3 sm:px-4 md:px-6 lg:px-12 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton width={32} height={32} rounded="md" />
              <Skeleton width={200} height={24} />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton width={32} height={32} rounded="md" />
              <Skeleton width={32} height={32} rounded="md" />
              <Skeleton width={100} height={36} rounded="lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="mx-auto px-3 sm:px-4 md:px-6 lg:px-12 py-4 sm:py-6 lg:py-8 pb-24 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Main Content Area - 8 columns */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            
            {/* Video Player Skeleton */}
            <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200">
              <div className="relative aspect-video bg-gray-900">
                <Skeleton className="absolute inset-0" rounded="none" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton width={60} height={60} rounded="full" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton width={80} height={20} />
                    <Skeleton width={60} height={20} />
                  </div>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} width={16} height={16} />
                    ))}
                    <Skeleton width={30} height={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* Course Header Card Skeleton */}
            <div className="bg-white rounded-sm shadow-sm p-3 sm:p-4 lg:p-6 border border-gray-200">
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Skeleton width={80} height={24} rounded="sm" />
                <Skeleton width={60} height={24} rounded="sm" />
                <Skeleton width={70} height={24} rounded="sm" />
              </div>

              {/* Title */}
              <div className="mb-4">
                <Skeleton width="80%" height={32} className="mb-2" />
                <Skeleton width="60%" height={28} />
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <Skeleton width={80} height={16} />
                <Skeleton width={90} height={16} />
                <Skeleton width={100} height={16} />
                <Skeleton width={70} height={16} />
              </div>

              {/* Tutor Profile */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm border border-gray-200">
                <SkeletonAvatar size="md" />
                <div className="flex-1">
                  <Skeleton width={80} height={12} className="mb-1" />
                  <Skeleton width={120} height={16} className="mb-2" />
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} width={12} height={12} />
                      ))}
                    </div>
                    <Skeleton width={30} height={12} />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabbed Content Skeleton */}
            <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 px-4">
                <div className="flex gap-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} width={80} height={40} />
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <Skeleton width={200} height={24} className="mb-3" />
                    <SkeletonText lines={4} />
                  </div>
                  
                  <div>
                    <Skeleton width={150} height={20} className="mb-3" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-sm">
                          <Skeleton width={16} height={16} />
                          <Skeleton width="80%" height={16} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton - 4 columns (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-4">
              <Skeleton width={150} height={20} className="mb-4" />
              
              {/* Course Info */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <Skeleton width={60} height={16} />
                  <Skeleton width={40} height={20} />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton width={80} height={16} />
                  <Skeleton width={60} height={16} />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton width={70} height={16} />
                  <Skeleton width={50} height={16} />
                </div>
              </div>

              {/* Lessons List */}
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-sm">
                    <Skeleton width={32} height={32} rounded="md" />
                    <div className="flex-1">
                      <Skeleton width="90%" height={14} className="mb-1" />
                      <Skeleton width="60%" height={12} />
                    </div>
                    <Skeleton width={40} height={12} />
                  </div>
                ))}
              </div>

              {/* Enroll Button */}
              <Skeleton width="100%" height={44} className="mt-6" rounded="lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA Skeleton - Fixed Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton width={60} height={16} className="mb-1" />
            <Skeleton width={80} height={20} />
          </div>
          <Skeleton width={120} height={44} rounded="lg" />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsSkeleton;