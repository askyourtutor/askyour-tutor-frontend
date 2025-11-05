import { Suspense } from 'react';
import { Outlet } from 'react-router';
import Header from '../shared/components/layout/Header';
import LoadingSpinner from '../shared/components/LoadingSpinner';

export default function RootLayout() {
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-auto">
        <Suspense fallback={<LoadingSpinner message="Loading..." />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
