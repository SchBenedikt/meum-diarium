import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  Plus, 
  Settings, 
  Search,
  Folder,
  FolderOpen,
  Home,
  Menu,
  X,
  ExternalLink,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { BlogPost } from '@/types/blog';

interface AuthorFolder {
  id: string;
  name: string;
  icon: string;
  posts: BlogPost[];
  isOpen: boolean;
}

export function AdminSidebar({ width = 256, onWidthChange, isCollapsed = false, onToggleCollapse }: { 
  width?: number; 
  onWidthChange?: (width: number) => void; 
  isCollapsed?: boolean; 
  onToggleCollapse?: () => void; 
}) {
  const [folders, setFolders] = useState<AuthorFolder[]>([
    { id: 'caesar', name: 'Caesar', icon: '🏛️', posts: [], isOpen: true },
    { id: 'cicero', name: 'Cicero', icon: '🗣️', posts: [], isOpen: false },
    { id: 'augustus', name: 'Augustus', icon: '👑', posts: [], isOpen: false },
    { id: 'seneca', name: 'Seneca', icon: '📜', posts: [], isOpen: false },
  ]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      console.log('🔄 [AdminSidebar] Loading posts from API...');
      const res = await fetch('/api/posts');
      const data = await res.json();
      console.log(`✅ [AdminSidebar] Loaded ${data.length} posts from API`);
      
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

  return (
    <div className="bg-[#f7f6f3] dark:bg-[#191919] border-r border-border h-screen flex flex-col" style={{ width: `${width}px` }}>
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-lg font-semibold ${isCollapsed ? 'text-center' : ''}`}>
            {isCollapsed ? '📝' : 'Meum Diarium'}
          </span>
          {!isCollapsed && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onWidthChange?.(Math.max(200, width - 32))}
                className="h-6 w-6"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onWidthChange?.(Math.min(400, width + 32))}
                className="h-6 w-6"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Suchen..."
            className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#2f2f2f] rounded-md text-sm border border-border/50 focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        {!isCollapsed && (
          <div className="p-2">
            {/* Dashboard Link */}
            <NavLink 
              to="/admin"
              end
              className={({ isActive }) => cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Home className="w-4 h-4" />
              Dashboard
            </NavLink>

            {/* Folders Section */}
            <div className="mt-4">
              <div className="flex items-center justify-between px-2 mb-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Autoren
                </span>
                <Button variant="ghost" size="icon" className="w-5 h-5">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              {folders.map(folder => (
                <div key={folder.id}>
                  {/* Folder Header */}
                  <button
                    onClick={() => toggleFolder(folder.id)}
                    className={cn(
                      "w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm transition-colors group",
                      location.pathname.includes(`/admin/${folder.id}`)
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {folder.isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="mr-1">{folder.icon}</span>
                    <span className="flex-1 text-left">{folder.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {folder.posts.length}
                    </span>
                  </button>

                  {/* Folder Posts */}
                  {folder.isOpen && (
                    <div className="ml-4 mt-0.5 space-y-0.5">
                      {folder.posts.map(post => (
                        <div key={post.slug} className="flex items-center gap-1">
                          <NavLink
                            to={`/admin/posts/${folder.id}/${post.slug}`}
                            className={({ isActive }) => cn(
                              "flex-1 flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted"
                            )}
                          >
                            <FileText className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{post.title || post.slug}</span>
                          </NavLink>
                          <a
                            href={`/${folder.id}/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                            title="Beitrag ansehen"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                      
                      {folder.posts.length === 0 && !loading && (
                        <div className="px-2 py-1.5 text-xs text-muted-foreground italic">
                          Keine Beiträge
                        </div>
                      )}

                      <NavLink
                        to={`/admin/posts/new?author=${folder.id}`}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-muted transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 shrink-0" />
                        <span>Neuer Beitrag</span>
                      </NavLink>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Collapsed state - show quick actions */}
        {isCollapsed && (
          <div className="p-2 space-y-2">
            <NavLink 
              to="/admin"
              className="flex items-center justify-center p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
              title="Dashboard"
            >
              <Home className="w-4 h-4" />
            </NavLink>
            
            {['caesar', 'cicero', 'augustus', 'seneca', 'catilina'].map(authorId => {
              const author = folders.find(a => a.id === authorId);
              return (
                <NavLink
                  key={authorId}
                  to={`/admin/posts/new?author=${authorId}`}
                  className="flex items-center justify-center p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
                  title={`${author?.name} - Neuer Beitrag`}
                >
                  <span className="text-lg">{author?.icon}</span>
                </NavLink>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
