import { Navigate, Outlet, useLocation } from 'react-router';
import type { Location } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

export default function GuestRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  type LocationState = { from?: Location };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  if (user) {
    const to = (location.state as LocationState | null | undefined)?.from?.pathname ?? '/';
    return <Navigate to={to} replace />;
  }

  return <Outlet />;
}