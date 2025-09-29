import React from 'react';
import { IconExclamationCircle, IconRefresh, IconAlertTriangle, IconWifi } from '@tabler/icons-react';

export type ErrorType = 'generic' | 'network' | 'notFound' | 'unauthorized' | 'server';

interface ErrorStateProps {
  error?: string;
  type?: ErrorType;
  onRetry?: () => void;
  retryLabel?: string;
  showRetry?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const errorConfig = {
  generic: {
    icon: IconExclamationCircle,
    title: 'Oops! Something went wrong',
    defaultMessage: 'An unexpected error occurred. Please try again.',
    iconColor: 'text-red-500'
  },
  network: {
    icon: IconWifi,
    title: 'Connection Problem',
    defaultMessage: 'Unable to connect to the server. Please check your internet connection.',
    iconColor: 'text-orange-500'
  },
  notFound: {
    icon: IconAlertTriangle,
    title: 'Not Found',
    defaultMessage: 'The requested resource could not be found.',
    iconColor: 'text-yellow-500'
  },
  unauthorized: {
    icon: IconExclamationCircle,
    title: 'Access Denied',
    defaultMessage: 'You do not have permission to access this resource.',
    iconColor: 'text-red-500'
  },
  server: {
    icon: IconExclamationCircle,
    title: 'Server Error',
    defaultMessage: 'The server encountered an error. Please try again later.',
    iconColor: 'text-red-500'
  }
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  type = 'generic',
  onRetry,
  retryLabel = 'Try Again',
  showRetry = true,
  className = '',
  size = 'md'
}) => {
  const config = errorConfig[type];
  const IconComponent = config.icon;
  
  const sizeClasses = {
    sm: {
      container: 'py-8 px-4',
      icon: 32,
      title: 'text-base font-semibold',
      message: 'text-sm',
      button: 'px-3 py-1.5 text-sm'
    },
    md: {
      container: 'py-12 xs:py-16 sm:py-20 lg:py-24 px-4',
      icon: 48,
      title: 'text-lg font-semibold',
      message: 'text-sm',
      button: 'px-4 py-2 text-sm'
    },
    lg: {
      container: 'py-16 xs:py-20 sm:py-24 lg:py-32 px-6',
      icon: 64,
      title: 'text-xl font-semibold',
      message: 'text-base',
      button: 'px-6 py-3 text-base'
    }
  };

  const sizeConfig = sizeClasses[size];

  return (
    <div className={`text-center ${sizeConfig.container} ${className}`}>
      <div className="max-w-md mx-auto">
        <div className="mb-4">
          <IconComponent 
            size={sizeConfig.icon} 
            className={`mx-auto mb-4 ${config.iconColor}`} 
          />
          <h3 className={`${sizeConfig.title} text-gray-900 mb-2`}>
            {config.title}
          </h3>
          <p className={`text-gray-600 ${sizeConfig.message} mb-6`}>
            {error || config.defaultMessage}
          </p>
        </div>
        
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className={`inline-flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ${sizeConfig.button}`}
          >
            <IconRefresh size={16} />
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
