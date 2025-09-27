import { Suspense } from 'react';
import { Outlet } from 'react-router';
import Header from '../components/layout/Header';

export default function RootLayout() {
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-auto">
        <Suspense fallback={<div className="p-6 text-center text-slate-600">Loading...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
