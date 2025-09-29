import React from 'react';
import { 
  IconBook, 
  IconUsers, 
  IconSearch, 
  IconInbox, 
  IconFileText,
  IconShoppingCart,
  IconCalendar,
  IconBell,
  IconStar
} from '@tabler/icons-react';

export type EmptyStateType = 
  | 'courses' 
  | 'users' 
  | 'search' 
  | 'inbox' 
  | 'documents' 
  | 'cart' 
  | 'calendar' 
  | 'notifications'
  | 'reviews'
  | 'generic';

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showAction?: boolean;
}

const emptyStateConfig = {
  courses: {
    icon: IconBook,
    title: 'No courses found',
    message: 'We couldn\'t find any courses in this category. Try selecting a different category or check back later.'
  },
  users: {
    icon: IconUsers,
    title: 'No users found',
    message: 'There are no users to display at the moment.'
  },
  search: {
    icon: IconSearch,
    title: 'No results found',
    message: 'Try adjusting your search terms or filters to find what you\'re looking for.'
  },
  inbox: {
    icon: IconInbox,
    title: 'Your inbox is empty',
    message: 'You\'re all caught up! No new messages to display.'
  },
  documents: {
    icon: IconFileText,
    title: 'No documents found',
    message: 'Upload your first document to get started.'
  },
  cart: {
    icon: IconShoppingCart,
    title: 'Your cart is empty',
    message: 'Add some courses to your cart to get started.'
  },
  calendar: {
    icon: IconCalendar,
    title: 'No events scheduled',
    message: 'Your calendar is clear. Schedule your first session to get started.'
  },
  notifications: {
    icon: IconBell,
    title: 'No notifications',
    message: 'You\'re all caught up! No new notifications to display.'
  },
  reviews: {
    icon: IconStar,
    title: 'No reviews yet',
    message: 'Be the first to leave a review for this course.'
  },
  generic: {
    icon: IconInbox,
    title: 'Nothing to show',
    message: 'There\'s nothing here yet. Check back later!'
  }
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'generic',
  title,
  message,
  actionLabel,
  onAction,
  className = '',
  size = 'md',
  showAction = true
}) => {
  const config = emptyStateConfig[type];
  const IconComponent = config.icon;
  
  const sizeClasses = {
    sm: {
      container: 'py-8 px-4',
      icon: 48,
      title: 'text-base font-semibold',
      message: 'text-sm',
      button: 'px-3 py-1.5 text-sm'
    },
    md: {
      container: 'py-12 xs:py-16 sm:py-20 lg:py-24 px-4',
      icon: 64,
      title: 'text-lg font-semibold',
      message: 'text-sm',
      button: 'px-4 py-2 text-sm'
    },
    lg: {
      container: 'py-16 xs:py-20 sm:py-24 lg:py-32 px-6',
      icon: 80,
      title: 'text-xl font-semibold',
      message: 'text-base',
      button: 'px-6 py-3 text-base'
    }
  };

  const sizeConfig = sizeClasses[size];

  return (
    <div className={`text-center ${sizeConfig.container} ${className}`}>
      <div className="max-w-md mx-auto">
        <IconComponent 
          size={sizeConfig.icon} 
          className="mx-auto text-gray-400 mb-4" 
        />
        <h3 className={`${sizeConfig.title} text-gray-900 mb-2`}>
          {title || config.title}
        </h3>
        <p className={`text-gray-600 ${sizeConfig.message} mb-6`}>
          {message || config.message}
        </p>
        
        {showAction && actionLabel && onAction && (
          <button
            onClick={onAction}
            className={`inline-flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium ${sizeConfig.button}`}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
