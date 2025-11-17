export default function AdminCoursesTabSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Header */}
      <div className="bg-white rounded-sm border border-gray-200 p-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-32 h-5 bg-gray-200 rounded"></div>
          <div className="flex flex-wrap gap-2 flex-1">
            <div className="w-48 h-9 bg-gray-100 rounded"></div>
            <div className="w-32 h-9 bg-gray-100 rounded"></div>
            <div className="w-32 h-9 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-sm p-3 border border-gray-200">
            <div className="w-20 h-4 bg-gray-200 rounded mb-2"></div>
            <div className="w-12 h-6 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-sm border border-gray-200 overflow-hidden">
            <div className="w-full h-36 bg-gray-200"></div>
            <div className="p-3">
              <div className="w-20 h-4 bg-gray-100 rounded mb-2"></div>
              <div className="w-full h-5 bg-gray-200 rounded mb-2"></div>
              <div className="w-3/4 h-4 bg-gray-100 rounded mb-3"></div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-24 h-4 bg-gray-100 rounded"></div>
              </div>
              <div className="flex gap-2">
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
