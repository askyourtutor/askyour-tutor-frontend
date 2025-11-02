import { createBrowserRouter } from 'react-router';
import RootLayout from './routes/RootLayout';
import Home from '../features/home/pages/Home';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import ProtectedRoute from '../shared/components/guards/ProtectedRoute';
import GuestRoute from '../shared/components/guards/GuestRoute';
import VerifyEmail from '../features/auth/pages/VerifyEmail';
import ForgotPassword from '../features/auth/pages/ForgotPassword';
import ResetPassword from '../features/auth/pages/ResetPassword';
import RouteError from './routes/RouteError';
import NotFound from '../features/home/pages/NotFound';
import RoleRoute from '../shared/components/guards/RoleRoute';
import StudentProfile from '../features/profile/pages/StudentProfile';
import TutorProfile from '../features/profile/pages/TutorProfile';
import StudentDashboard from '../features/profile/pages/StudentDashboard';
import AdminDashboard from '../features/profile/pages/AdminDashboard';
import TutorDashboard from '../features/profile/pages/TutorDashboard';
import CourseDetails from '../features/courses/pages/CourseDetails';
import CoursesPage from '../features/courses/pages/CoursesPage';
import TeachersPage from '../features/teachers/pages/TeachersPage';
import TeacherDetailPage from '../features/teachers/pages/TeacherDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      
      // Courses accessible by STUDENT, TUTOR, ADMIN but details only for STUDENT, ADMIN
      { 
        path: 'courses', 
        element: (
          <RoleRoute allowed={['STUDENT', 'TUTOR', 'ADMIN']}>
            <CoursesPage />
          </RoleRoute>
        )
      },
      { 
        path: 'course/:id', 
        element: (
          <RoleRoute allowed={['STUDENT', 'ADMIN']}>
            <CourseDetails />
          </RoleRoute>
        )
      },
      // Teachers accessible by STUDENT, TUTOR, ADMIN but details only for STUDENT, ADMIN
      { 
        path: 'teachers', 
        element: (
          <RoleRoute allowed={['STUDENT', 'TUTOR', 'ADMIN']}>
            <TeachersPage />
          </RoleRoute>
        )
      },
      { 
        path: 'teachers/:id', 
        element: (
          <RoleRoute allowed={['STUDENT', 'ADMIN']}>
            <TeacherDetailPage />
          </RoleRoute>
        )
      },

      {
        element: <GuestRoute />,
        children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
          { path: 'verify-email', element: <VerifyEmail /> },
          { path: 'forgot-password', element: <ForgotPassword /> },
          { path: 'reset-password', element: <ResetPassword /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          // Student only routes
          { path: 'student/profile', element: (
            <RoleRoute allowed={['STUDENT']}>
              <StudentProfile />
            </RoleRoute>
          ) },
          { path: 'student/dashboard', element: (
            <RoleRoute allowed={['STUDENT']}>
              <StudentDashboard />
            </RoleRoute>
          ) },
          
          // Tutor profile route (uses layout)
          { path: 'tutor/profile', element: (
            <RoleRoute allowed={['TUTOR']}>
              <TutorProfile />
            </RoleRoute>
          ) },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
  // Admin routes without layout header
  {
    path: 'admin',
    element: (
      <RoleRoute allowed={['ADMIN']}>
        <AdminDashboard />
      </RoleRoute>
    ),
  },
  {
    path: 'admin/dashboard',
    element: (
      <RoleRoute allowed={['ADMIN']}>
        <AdminDashboard />
      </RoleRoute>
    ),
  },
  // Tutor dashboard without layout header (like admin)
  {
    path: 'tutor/dashboard',
    element: (
      <RoleRoute allowed={['TUTOR']}>
        <TutorDashboard />
      </RoleRoute>
    ),
  },
]);

export default router;
