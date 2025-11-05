interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeConfig = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`relative ${sizeConfig[size]} ${className}`}>
      {/* Book base */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-blue-600 rounded-sm animate-book-pulse" 
             style={{ transformStyle: 'preserve-3d' }}>
          <div className="absolute inset-0 border-l-2 border-white/30"></div>
        </div>
      </div>
      
      <style>{`
        @keyframes book-pulse {
          0%, 100% { 
            transform: scale(1) rotateY(0deg);
            opacity: 1;
          }
          50% { 
            transform: scale(0.9) rotateY(180deg);
            opacity: 0.8;
          }
        }
        
        .animate-book-pulse {
          animation: book-pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
