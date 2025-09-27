import { Navigate, useLocation } from 'react-router';
import type { PropsWithChildren } from 'react';
import { useAuth } from '../../contexts/AuthContext';

type Role = 'STUDENT' | 'TUTOR' | 'ADMIN';

export default function RoleRoute({ allowed, children }: PropsWithChildren<{ allowed: Role[] }>) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowed.includes(user.role as Role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
