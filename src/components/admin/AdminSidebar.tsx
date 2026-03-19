import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Plus,
  Settings,
  Home,
  ExternalLink,
  Users,
  Library,
  LogOut,
  Scroll,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { BlogPost } from '@/types/blog';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthorFolder {
  id: string;
  name: string;
  icon: string;
  posts: BlogPost[];
  isOpen: boolean;
}

const INITIAL_FOLDERS: AuthorFolder[] = [
  { id: 'caesar', name: 'Caesar', icon: '🏛️', posts: [], isOpen: true },
  { id: 'cicero', name: 'Cicero', icon: '🗣️', posts: [], isOpen: false },
  { id: 'augustus', name: 'Augustus', icon: '👑', posts: [], isOpen: false },
  { id: 'seneca', name: 'Seneca', icon: '📜', posts: [], isOpen: false },
];

const NAV_SECTIONS = [
  {
    label: 'Verwaltung',
    items: [
      { to: '/admin/lexicon', icon: Library, label: 'Lexikon' },
      { to: '/admin/author/new', icon: Users, label: 'Autor anlegen' },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/settings', icon: Settings, label: 'Einstellungen' },
    ],
  },
];

export function AdminSidebar({ width = 256, onWidthChange, isCollapsed = false, onToggleCollapse }: {
  width?: number;
  onWidthChange?: (width: number) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [folders, setFolders] = useState<AuthorFolder[]>(INITIAL_FOLDERS);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { adminLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setFolders(prev => prev.map(folder => ({
        ...folder,
        posts: data.filter((p: BlogPost) => p.author === folder.id) || []
      })));
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = (folderId: string) => {
    setFolders(prev => prev.map(folder =>
      folder.id === folderId ? { ...folder, isOpen: !folder.isOpen } : folder
    ));
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
    toast.success('Erfolgreich abgemeldet');
  };

  if (isCollapsed) {
    return (
      <div className="bg-[#f7f6f3] dark:bg-[#191919] border-r border-border h-screen flex flex-col items-center py-4 gap-2" style={{ width: `${width}px` }}>
        <NavLink to="/admin" end title="Dashboard"
          className={({ isActive }) => cn("p-2 rounded-lg transition-colors", isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}
        >
          <Home className="w-5 h-5" />
        </NavLink>
        <div className="w-8 h-px bg-border my-1" />
        {folders.map(folder => (
          <NavLink key={folder.id} to={`/admin/post/new?author=${folder.id}`} title={`${folder.name} – Neuer Beitrag`}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors text-lg">
            {folder.icon}
          </NavLink>
        ))}
        <div className="flex-1" />
        <button onClick={handleLogout} title="Abmelden"
          className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-destructive transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f6f3] dark:bg-[#191919] border-r border-border h-screen flex flex-col flex-shrink-0 overflow-hidden" style={{ width: `${width}px`, minWidth: `${width}px` }}>
      {/* Logo / Header */}
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-border/50">
        <div className="p-1.5 rounded-md bg-primary/10">
          <Scroll className="w-4 h-4 text-primary" />
        </div>
        <span className="font-semibold text-sm truncate">Meum Diarium</span>
        <span className="ml-auto text-xs text-muted-foreground font-medium uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded">Admin</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1">
          {/* Dashboard */}
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Home className="w-4 h-4 shrink-0" />
            Dashboard
          </NavLink>

          {/* Posts Section */}
          <div className="pt-3">
            <div className="flex items-center justify-between px-3 mb-1.5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Beiträge
              </span>
              <NavLink
                to="/admin/post/new"
                className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                title="Neuer Beitrag"
              >
                <Plus className="w-3.5 h-3.5" />
              </NavLink>
            </div>

            <div className="space-y-0.5">
              {folders.map(folder => (
                <div key={folder.id}>
                  <button
                    onClick={() => toggleFolder(folder.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                      location.pathname.includes(`/admin/post/${folder.id}`) || location.pathname.includes(`/admin/posts/${folder.id}`)
                        ? "bg-muted text-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span className="text-base leading-none">{folder.icon}</span>
                    <span className="flex-1 text-left">{folder.name}</span>
                    {!loading && (
                      <span className="text-xs text-muted-foreground bg-muted-foreground/10 rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                        {folder.posts.length}
                      </span>
                    )}
                    {folder.isOpen
                      ? <ChevronDown className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                      : <ChevronRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                    }
                  </button>

                  {folder.isOpen && (
                    <div className="ml-3 mt-0.5 pl-3 border-l border-border/50 space-y-0.5">
                      {loading && (
                        <div className="px-2 py-1.5 text-xs text-muted-foreground">Lade...</div>
                      )}
                      {!loading && folder.posts.length === 0 && (
                        <div className="px-2 py-1.5 text-xs text-muted-foreground italic">Keine Beiträge</div>
                      )}
                      {folder.posts.map(post => (
                        <div key={post.slug} className="flex items-center gap-1">
                          <NavLink
                            to={`/admin/posts/${folder.id}/${post.slug}`}
                            className={({ isActive }) => cn(
                              "flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors",
                              isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            <FileText className="w-3 h-3 shrink-0" />
                            <span className="truncate">{post.title || post.slug}</span>
                          </NavLink>
                          <a
                            href={`/${folder.id}/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-primary transition-colors shrink-0"
                            title="Beitrag ansehen"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                      <NavLink
                        to={`/admin/post/new?author=${folder.id}`}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                      >
                        <Plus className="w-3 h-3 shrink-0" />
                        <span>Neuer Beitrag</span>
                      </NavLink>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Other sections */}
          {NAV_SECTIONS.map(section => (
            <div key={section.label} className="pt-3">
              <div className="px-3 mb-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.label}
                </span>
              </div>
              <div className="space-y-0.5">
                {section.items.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border/50 p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Abmelden
        </Button>
      </div>
    </div>
  );
}

