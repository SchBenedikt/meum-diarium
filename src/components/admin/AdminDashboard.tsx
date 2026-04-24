import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Users, BookOpen, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePosts } from '@/hooks/use-posts';
import { useAuthors } from '@/hooks/use-authors';
import { useLexicon } from '@/hooks/use-lexicon';
import { useTags } from '@/hooks/use-tags';
import { BlogPost } from '@/types/blog';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { posts, isLoading: postsLoading, error: postsError } = usePosts();
  const { authors: authorEntries } = useAuthors();
  const { lexicon: lexiconEntries } = useLexicon();
  const { tags } = useTags();

  // Calculate real post counts per author
  const authorsWithCounts = Object.entries(authorEntries || {}).map(([id, author]) => {
    const authorPosts = posts?.filter(p => p.author === id) || [];
    return {
      id,
      name: author.name || id,
      icon: getAuthorIcon(id),
      posts: authorPosts.length,
      recentPosts: authorPosts.slice(0, 3)
    };
  });

  function getAuthorIcon(authorId: string) {
    const icons: Record<string, string> = {
      'caesar': '🏛️',
      'cicero': '�️',
      'augustus': '👑',
      'seneca': '📜',
      'catilina': '🗡️'
    };
    return icons[authorId] || '📝';
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#191919]">
      {/* Header */}
      <header className="px-4 sm:px-6 py-4 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Verwalte deine Blog-Beiträge und Einstellungen
          </p>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-4 sm:p-6 space-y-6 w-full">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{posts?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Beiträge</div>
                <div className="text-xs text-muted-foreground mt-1">Aktuelle Inhalte im System</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{Object.keys(authorEntries || {}).length}</div>
                <div className="text-sm text-muted-foreground">Autoren</div>
                <div className="text-xs text-muted-foreground mt-1">Aktuelle Inhalte im System</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{lexiconEntries?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Lexikon</div>
                <div className="text-xs text-muted-foreground mt-1">Aktuelle Inhalte im System</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{tags?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Tags</div>
                <div className="text-xs text-muted-foreground mt-1">Aktuelle Inhalte im System</div>
              </CardContent>
            </Card>
          </div>

          {/* Authors Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Autoren
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {authorsWithCounts.map(author => (
                  <div
                    key={author.id}
                    className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{author.icon}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {author.posts} Beiträge
                      </span>
                    </div>
                    <h4 className="font-medium mb-1">{author.name}</h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => navigate(`/admin/posts/new?author=${author.id}`)}
                      >
                        <Plus className="w-3 h-3 mr-2" />
                        Neuer Beitrag
                      </Button>
                      {author.recentPosts.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground font-medium">Kürzliche Beiträge:</div>
                          {author.recentPosts.map(post => (
                            <Button
                              key={post.id}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start h-8 text-xs"
                              onClick={() => navigate(`/admin/posts/${post.author}/${post.slug}`)}
                            >
                              <FileText className="w-3 h-3 mr-2" />
                              {post.title.length > 25 ? post.title.substring(0, 25) + '...' : post.title}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Kürzlich bearbeitet
              </CardTitle>
            </CardHeader>
            <CardContent>
              {postsLoading ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Lade Beiträge...</div>
                </div>
              ) : postsError ? (
                <div className="text-center py-8">
                  <div className="text-destructive">Fehler beim Laden: {postsError.message}</div>
                </div>
              ) : posts && posts.length > 0 ? (
                <div className="space-y-2">
                  {posts.slice(0, 5).map(post => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer"
                      onClick={() => navigate(`/admin/posts/${post.author}/${post.slug}`)}
                    >
                      <div className="flex-1">
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {post.author} • {post.historicalDate}
                        </div>
                      </div>
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Keine Beiträge gefunden. Erstelle deinen ersten Beitrag!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
