export const TeacherCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 animate-pulse">
      <div className="flex items-center gap-4 p-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0"></div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name and Badge */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-2/3 mb-1.5"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
          </div>
          
          {/* University */}
          <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
          
          {/* Stats */}
          <div className="flex gap-4">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
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
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <TeacherCardSkeleton key={index} />
      ))}
    </div>
  );
};
