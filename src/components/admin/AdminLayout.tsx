import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';

export function AdminLayout() {
  return (
    <div className="flex h-screen w-screen bg-white dark:bg-[#191919]">
      <AdminSidebar />
      <main className="flex-1 overflow-hidden w-full">
        <Outlet />
      </main>
    </div>
  );
}
