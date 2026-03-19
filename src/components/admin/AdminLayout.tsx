import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <div className="flex h-screen w-screen bg-white dark:bg-[#191919]">
      <AdminSidebar 
        width={isCollapsed ? 60 : 256} 
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleSidebar}
      />
      <main className="flex-1 overflow-auto w-full h-full">
        {/* Collapse/Expand Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="fixed left-4 top-4 z-50 bg-white dark:bg-[#191919] border border-border shadow-md"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        <div className="h-full overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
