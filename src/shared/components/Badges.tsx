import type { UserStatus, UserRole, VerificationStatus } from '../types/admin';
import { ADMIN_CONSTANTS } from '../constants/admin';

interface StatusBadgeProps {
  status: UserStatus | VerificationStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  // Map verification status to the correct constant
  let colorClass: string;
  if (status === 'APPROVED' || status === 'REJECTED') {
    colorClass = ADMIN_CONSTANTS.VERIFICATION_COLORS[status];
  } else {
    colorClass = ADMIN_CONSTANTS.STATUS_COLORS[status as UserStatus] || ADMIN_CONSTANTS.STATUS_COLORS.INACTIVE;
  }
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-sm border ${colorClass} ${className}`}>
      {status}
    </span>
  );
}

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  const colorClass = ADMIN_CONSTANTS.ROLE_COLORS[role] || ADMIN_CONSTANTS.ROLE_COLORS.STUDENT;
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-sm border ${colorClass} ${className}`}>
      {role}
    </span>
  );
}
