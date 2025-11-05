import React from 'react';
import { Skeleton, SkeletonText, SkeletonAvatar } from '../../../shared/components/ui';

const TeacherDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton width={32} height={32} rounded="md" className="bg-white/20" />
            <Skeleton width={150} height={20} className="bg-white/20" />
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="bg-white/20 rounded-full w-24 h-24 animate-pulse"></div>
            
            <div className="flex-1 space-y-3">
              <Skeleton width={200} height={28} className="bg-white/20" />
              <Skeleton width={150} height={16} className="bg-white/20" />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} width={16} height={16} className="bg-white/20" />
                  ))}
                  <Skeleton width={30} height={16} className="bg-white/20" />
                </div>
                <Skeleton width={80} height={16} className="bg-white/20" />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Skeleton width={120} height={40} rounded="lg" className="bg-white/20" />
              <Skeleton width={100} height={40} rounded="lg" className="bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About Section */}
            <div>
              <Skeleton width={100} height={24} className="mb-4" />
              <SkeletonText lines={4} />
            </div>
            
            {/* Experience Section */}
            <div>
              <Skeleton width={120} height={24} className="mb-4" />
              <SkeletonText lines={3} />
            </div>
            
            {/* Courses Section */}
            <div>
              <Skeleton width={150} height={24} className="mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <Skeleton width="100%" height={120} className="mb-3" rounded="md" />
                    <Skeleton width="90%" height={18} className="mb-2" />
                    <Skeleton width="70%" height={14} className="mb-3" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Skeleton key={j} width={12} height={12} />
                        ))}
                        <Skeleton width={25} height={12} />
                      </div>
                      <Skeleton width={40} height={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Reviews Section */}
            <div>
              <Skeleton width={100} height={24} className="mb-6" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <SkeletonAvatar size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Skeleton width={100} height={14} />
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Skeleton key={j} width={12} height={12} />
                            ))}
                          </div>
                        </div>
                        <SkeletonText lines={2} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Contact Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <Skeleton width={120} height={20} className="mb-4" />
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton width={16} height={16} />
                  <Skeleton width={100} height={16} />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton width={16} height={16} />
                  <Skeleton width={120} height={16} />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton width={16} height={16} />
                  <Skeleton width={80} height={16} />
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <Skeleton width="100%" height={40} rounded="lg" />
                <Skeleton width="100%" height={40} rounded="lg" />
              </div>
            </div>
            
            {/* Stats Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <Skeleton width={80} height={20} className="mb-4" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton width={80} height={14} />
                  <Skeleton width={40} height={14} />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton width={90} height={14} />
                  <Skeleton width={30} height={14} />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton width={70} height={14} />
                  <Skeleton width={50} height={14} />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton width={85} height={14} />
                  <Skeleton width={35} height={14} />
                </div>
              </div>
            </div>
            
            {/* Availability Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <Skeleton width={100} height={20} className="mb-4" />
              
              <div className="space-y-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton width={60} height={14} />
                    <Skeleton width={80} height={14} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailSkeleton;