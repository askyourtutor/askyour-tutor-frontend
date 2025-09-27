import { Navigate, Outlet, useLocation } from 'react-router';
import type { Location } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

export default function GuestRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  type LocationState = { from?: Location };

  if (loading) {
    // You can return a small placeholder to avoid layout shift
    return null;
  }

  if (user) {
    const to = (location.state as LocationState | null | undefined)?.from?.pathname ?? '/';
    return <Navigate to={to} replace />;
  }

  return <Outlet />;
}
