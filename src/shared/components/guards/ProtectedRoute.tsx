import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute() {
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

  // Determine if user's profile needs setup and where to send them
  const profileTarget = user.role === 'STUDENT' ? '/student/profile' : 
                       user.role === 'TUTOR' ? '/tutor/profile' : 
                       '/admin/dashboard';
  const completion = typeof user.profileCompletion === 'number' ? user.profileCompletion : 0;
  const needsSetup = completion < 100 && user.role !== 'ADMIN';
  
  // Allow access to dashboard and profile routes even if profile is incomplete
  const allowedIncompleteRoutes = [
    profileTarget,
    user.role === 'STUDENT' ? '/student/dashboard' : null,
    user.role === 'TUTOR' ? '/tutor/dashboard' : null,
  ].filter(Boolean);

  // Only redirect if profile is incomplete AND user is not on an allowed route
  if (needsSetup && !allowedIncompleteRoutes.includes(location.pathname)) {
    return <Navigate to={profileTarget} replace />;
  }

  return <Outlet />;
}
