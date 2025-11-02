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
      { path: 'courses', element: <CoursesPage /> },
      { path: 'course/:id', element: <CourseDetails /> },
      { path: 'teachers', element: <TeachersPage /> },
      { path: 'teachers/:id', element: <TeacherDetailPage /> },
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
          { path: 'student/profile', element: (
            <RoleRoute allowed={['STUDENT']}>
              <StudentProfile />
            </RoleRoute>
          ) },
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
]);

export default router;
