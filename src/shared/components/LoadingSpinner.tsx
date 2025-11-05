interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  size = 'md', 
  message,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizeConfig = {
    sm: { container: 'w-12 h-12', book: 'w-8 h-10', pen: 'w-4 h-4' },
    md: { container: 'w-20 h-20', book: 'w-14 h-16', pen: 'w-6 h-6' },
    lg: { container: 'w-28 h-28', book: 'w-20 h-24', pen: 'w-8 h-8' },
  };

  const { container, book, pen } = sizeConfig[size];

  const containerClasses = fullScreen 
    ? 'min-h-screen bg-gray-50 flex items-center justify-center'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className={`relative ${container} mx-auto mb-4`}>
          {/* Book Animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className={`${book} animate-book-flip`}
              viewBox="0 0 64 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Book Cover */}
              <rect x="8" y="8" width="48" height="64" rx="2" fill="#1e40af" />
              <rect x="12" y="12" width="40" height="56" rx="1" fill="#3b82f6" />
              
              {/* Book Pages */}
              <path d="M32 12 L32 68" stroke="#e5e7eb" strokeWidth="1" />
              <path d="M20 20 L44 20" stroke="#e5e7eb" strokeWidth="0.5" />
              <path d="M20 28 L44 28" stroke="#e5e7eb" strokeWidth="0.5" />
              <path d="M20 36 L44 36" stroke="#e5e7eb" strokeWidth="0.5" />
              <path d="M20 44 L44 44" stroke="#e5e7eb" strokeWidth="0.5" />
              <path d="M20 52 L44 52" stroke="#e5e7eb" strokeWidth="0.5" />
              <path d="M20 60 L44 60" stroke="#e5e7eb" strokeWidth="0.5" />
            </svg>
          </div>

          {/* Pen Animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className={`${pen} animate-pen-write`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ transformOrigin: 'bottom left' }}
            >
              <path
                d="M21.28 6.4l-9.54 9.54c-.95.95-3.77 1.39-4.4.76-.63-.63-.2-3.45.75-4.4l9.55-9.55a2.58 2.58 0 1 1 3.64 3.65z"
                fill="#1f2937"
                stroke="#374151"
                strokeWidth="1"
              />
              <path
                d="M11 13l-4 4"
                stroke="#374151"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        {message && <p className="text-gray-600 text-sm">{message}</p>}
        
        {/* Custom CSS for animations */}
        <style>{`
          @keyframes book-flip {
            0%, 100% { transform: perspective(400px) rotateY(0deg); }
            50% { transform: perspective(400px) rotateY(180deg); }
          }
          
          @keyframes pen-write {
            0%, 100% { transform: translate(12px, -8px) rotate(45deg); }
            25% { transform: translate(18px, -2px) rotate(45deg); }
            50% { transform: translate(12px, -8px) rotate(45deg); }
            75% { transform: translate(6px, -14px) rotate(45deg); }
          }
          
          .animate-book-flip {
            animation: book-flip 2s ease-in-out infinite;
          }
          
          .animate-pen-write {
            animation: pen-write 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
