import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width, 
  height, 
  rounded = 'md',
  animate = true 
}) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div 
      className={`bg-gray-200 ${roundedClasses[rounded]} ${animate ? 'animate-pulse' : ''} ${className}`}
      style={style}
    />
  );
};

// Grid skeleton for consistent layouts
interface SkeletonGridProps {
  columns?: number;
  rows?: number;
  gap?: string;
  className?: string;
  children?: React.ReactNode;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  columns = 4,
  rows = 2,
  gap = 'gap-4',
  className = '',
  children
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  };

  if (children) {
    return (
      <div className={`grid ${gridCols[columns as keyof typeof gridCols] || 'grid-cols-4'} ${gap} ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols] || 'grid-cols-4'} ${gap} ${className}`}>
      {Array.from({ length: columns * rows }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton height="200px" />
          <Skeleton height="20px" />
          <Skeleton height="16px" width="75%" />
        </div>
      ))}
    </div>
  );
};

// Text skeleton with multiple lines
interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        height="16px" 
        width={i === lines - 1 ? '75%' : '100%'} 
      />
    ))}
  </div>
);

// Avatar skeleton
export const SkeletonAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return <Skeleton className={sizes[size]} rounded="full" />;
};

export default Skeleton;
