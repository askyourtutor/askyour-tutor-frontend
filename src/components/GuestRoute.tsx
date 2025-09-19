import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    // You can return a small placeholder to avoid layout shift
    return null;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
