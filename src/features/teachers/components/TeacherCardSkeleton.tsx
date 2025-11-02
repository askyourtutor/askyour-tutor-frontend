export const TeacherCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
      {/* Avatar Section */}
      <div className="p-3 bg-gray-50">
        <div className="flex items-start gap-2">
          <div className="w-14 h-14 rounded-full bg-gray-300"></div>
          <div className="flex-1">
            <div className="h-3.5 bg-gray-300 rounded w-3/4 mb-1.5"></div>
            <div className="h-2.5 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-2.5">
        <div className="h-2.5 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-2.5 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-2.5 bg-gray-200 rounded w-4/5 mb-3"></div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-1.5 mb-2">
          <div className="h-2.5 bg-gray-200 rounded"></div>
          <div className="h-2.5 bg-gray-200 rounded"></div>
          <div className="h-2.5 bg-gray-200 rounded"></div>
          <div className="h-2.5 bg-gray-200 rounded"></div>
        </div>

        {/* Hourly Rate */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex justify-between">
            <div className="h-2.5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TeacherSkeletonGridProps {
  count?: number;
}

export const TeacherSkeletonGrid: React.FC<TeacherSkeletonGridProps> = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <TeacherCardSkeleton key={index} />
      ))}
    </div>
  );
};
