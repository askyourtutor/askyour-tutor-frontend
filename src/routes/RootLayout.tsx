import { Suspense } from 'react';
import { Outlet } from 'react-router';
import Header from '../shared/components/layout/Header';

export default function RootLayout() {
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-auto">
        <Suspense fallback={
          <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div className="text-slate-600 text-sm">Loading...</div>
            </div>
          </div>
        }>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
