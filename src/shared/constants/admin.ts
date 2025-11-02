export const ADMIN_CONSTANTS = {
  // Default values
  DEFAULT_PROFILE_COMPLETION: 0,
  DEFAULT_COURSE_DURATION: 8, // weeks
  DEFAULT_COURSE_LEVEL: 'INTERMEDIATE' as const,
  
  // Fallback names
  DEFAULT_TUTOR_FIRST_NAME: 'Not',
  DEFAULT_TUTOR_LAST_NAME: 'Available',
  DEFAULT_TUTOR_EMAIL: 'no-email@askyourtutor.com',
  
  // Messages
  REJECTION_DEFAULT_NOTE: 'Application rejected by administrator',
  BULK_APPROVAL_NOTE: 'Bulk approved by administrator',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 50,
  COURSES_PAGE_SIZE: 100,
  
  // Tab persistence
  STORAGE_KEY_ACTIVE_TAB: 'adminActiveTab',
  DEFAULT_TAB: 'dashboard' as const,
  
  // Loading messages
  LOADING_MESSAGE: 'Loading admin dashboard...',
  
  // Status colors for badges
  STATUS_COLORS: {
    ACTIVE: 'bg-green-50 text-green-700 border-green-200',
    INACTIVE: 'bg-gray-50 text-gray-700 border-gray-200',
    SUSPENDED: 'bg-red-50 text-red-700 border-red-200',
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    PENDING_VERIFICATION: 'bg-orange-50 text-orange-700 border-orange-200',
    DRAFT: 'bg-gray-50 text-gray-600 border-gray-200',
  },
  
  // Role colors for badges
  ROLE_COLORS: {
    STUDENT: 'bg-blue-50 text-blue-700 border-blue-200',
    TUTOR: 'bg-purple-50 text-purple-700 border-purple-200',
    ADMIN: 'bg-gray-50 text-gray-900 border-gray-300',
  },
  
  // Verification status colors
  VERIFICATION_COLORS: {
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    APPROVED: 'bg-green-50 text-green-700 border-green-200',
    REJECTED: 'bg-red-50 text-red-700 border-red-200',
  },
} as const;
