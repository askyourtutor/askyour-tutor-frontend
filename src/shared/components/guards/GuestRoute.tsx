import { Navigate, Outlet, useLocation } from 'react-router';
import type { Location } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

export default function GuestRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  type LocationState = { from?: Location };

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

  if (user) {
    const to = (location.state as LocationState | null | undefined)?.from?.pathname ?? '/';
    return <Navigate to={to} replace />;
  }

  return <Outlet />;
}