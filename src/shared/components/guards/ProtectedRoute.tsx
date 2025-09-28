import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Determine if user's profile needs setup and where to send them
  const profileTarget = user.role === 'STUDENT' ? '/student/profile' : '/tutor/profile';
  const completion = typeof user.profileCompletion === 'number' ? user.profileCompletion : 0;
  const needsSetup = completion < 100;

  // If profile is incomplete and user is navigating elsewhere, force redirect to setup page
  if (needsSetup && location.pathname !== profileTarget) {
    return <Navigate to={profileTarget} replace />;
  }

  return <Outlet />;
}
