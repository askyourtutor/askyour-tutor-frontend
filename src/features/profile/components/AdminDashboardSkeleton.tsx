export default function AdminDashboardSkeleton() {
  return (
    <div className="space-y-3 p-2 sm:p-4 max-w-full overflow-hidden animate-pulse">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-sm p-2.5 sm:p-3 border border-gray-200">
            <div className="flex items-start justify-between mb-1.5 sm:mb-2">
              <div className="w-8 h-8 bg-gray-200 rounded-sm"></div>
              <div className="w-12 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-24 h-3 bg-gray-200 rounded mb-2"></div>
            <div className="w-16 h-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Secondary Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-sm p-2.5 sm:p-3 border border-gray-200">
            <div className="flex items-start justify-between mb-1.5 sm:mb-2">
              <div className="w-8 h-8 bg-gray-200 rounded-sm"></div>
              <div className="w-12 h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="w-24 h-3 bg-gray-200 rounded mb-2"></div>
            <div className="w-16 h-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="bg-white rounded-sm border border-gray-200 p-3 sm:p-4">
        <div className="w-32 h-5 bg-gray-200 rounded mb-3"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-sm"></div>
          ))}
        </div>
      </div>

      {/* Pending Tutors Skeleton */}
      <div className="bg-white rounded-sm border border-gray-200 p-3 sm:p-4">
        <div className="w-40 h-5 bg-gray-200 rounded mb-3"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-sm"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
