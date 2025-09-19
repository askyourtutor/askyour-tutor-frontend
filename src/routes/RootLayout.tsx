import { Outlet } from 'react-router';
import Header from '../components/layout/Header';

export default function RootLayout() {
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
