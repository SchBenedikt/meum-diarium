import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { PanelLeftClose, PanelLeftOpen, ExternalLink, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // On mobile the sidebar is hidden by default and opens as an overlay
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close mobile sidebar whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Set focus on the drawer when it opens
  useEffect(() => {
    if (mobileOpen && drawerRef.current) {
      drawerRef.current.focus();
    }
  }, [mobileOpen]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sectionTitle = (() => {
    if (location.pathname === '/admin' || location.pathname === '/admin/overview') return 'Dashboard';
    if (location.pathname.includes('/admin/post')) return 'Beiträge';
    if (location.pathname.includes('/admin/lexicon')) return 'Lexikon';
    if (location.pathname.includes('/admin/settings')) return 'Einstellungen';
    if (location.pathname.includes('/admin/author')) return 'Autoren';
    return 'Verwaltung';
  })();
  
  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <AdminSidebar
          width={isCollapsed ? 60 : 256}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          ref={drawerRef}
          tabIndex={-1}
          className="fixed inset-0 z-50 md:hidden outline-none"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          onKeyDown={(e) => { if (e.key === 'Escape') setMobileOpen(false); }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full">
            <AdminSidebar
              width={280}
              isCollapsed={false}
              onToggleCollapse={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0 h-full flex flex-col">
        <header className="h-14 md:h-16 border-b border-border/60 bg-background/85 backdrop-blur-xl sticky top-0 z-40">
          <div className="h-full px-3 sm:px-4 md:px-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Mobile hamburger */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMobileOpen(true)}
                className="h-9 w-9 shrink-0 md:hidden"
                title="Menü öffnen"
              >
                <Menu className="h-4 w-4" />
              </Button>
              {/* Desktop collapse toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSidebar}
                className="h-9 w-9 shrink-0 hidden md:inline-flex"
                title={isCollapsed ? 'Sidebar einblenden' : 'Sidebar ausblenden'}
              >
                {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </Button>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold hidden sm:block">Admin</p>
                <h1 className="text-sm sm:text-base font-semibold truncate">{sectionTitle}</h1>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <Link to="/admin/post/new">
                <Button size="sm" className="rounded-full px-3 sm:px-4 text-xs sm:text-sm">
                  <span className="hidden sm:inline">Neuer </span>Beitrag
                </Button>
              </Link>
              <Link to="/" target="_blank" rel="noreferrer">
                <Button variant="ghost" size="icon" className="h-9 w-9" title="Website öffnen">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
