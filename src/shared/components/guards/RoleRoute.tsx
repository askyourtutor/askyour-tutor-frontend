import { Navigate, useLocation } from 'react-router';
import type { PropsWithChildren } from 'react';
import { useAuth } from '../../contexts/AuthContext';

type Role = 'STUDENT' | 'TUTOR' | 'ADMIN';

export default function RoleRoute({ allowed, children }: PropsWithChildren<{ allowed: Role[] }>) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-slate-600 text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowed.includes(user.role as Role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
