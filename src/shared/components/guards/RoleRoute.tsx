import { Navigate, useLocation } from 'react-router';
import type { PropsWithChildren } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

type Role = 'STUDENT' | 'TUTOR' | 'ADMIN';

export default function RoleRoute({ allowed, children }: PropsWithChildren<{ allowed: Role[] }>) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Skip loading spinner if user is already authenticated (for better UX)
  if (loading && !user) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowed.includes(user.role as Role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
