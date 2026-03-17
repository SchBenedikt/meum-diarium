import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Users, BookOpen, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AdminDashboard() {
  const navigate = useNavigate();

  const authors = [
    { id: 'caesar', name: 'Caesar', icon: '🏛️', posts: 0 },
    { id: 'cicero', name: 'Cicero', icon: '🗣️', posts: 0 },
    { id: 'augustus', name: 'Augustus', icon: '👑', posts: 0 },
    { id: 'seneca', name: 'Seneca', icon: '📜', posts: 0 },
    { id: 'catilina', name: 'Catilina', icon: '🗡️', posts: 0 },
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#191919]">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Verwalte deine Blog-Beiträge und Einstellungen
        </p>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6 w-full">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate('/admin/posts/new?author=caesar')}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Neuer Beitrag</h3>
                  <p className="text-sm text-muted-foreground">Erstelle einen neuen Blog-Beitrag</p>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate('/admin/settings')}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Einstellungen</h3>
                  <p className="text-sm text-muted-foreground">Blog-Einstellungen verwalten</p>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate('/')}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Blog ansehen</h3>
                  <p className="text-sm text-muted-foreground">Öffentlichen Blog öffnen</p>
                </div>
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
                {authors.map(author => (
                  <button
                    key={author.id}
                    onClick={() => navigate(`/admin/posts/new?author=${author.id}`)}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all text-left"
                  >
                    <span className="text-2xl">{author.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium">{author.name}</h4>
                      <p className="text-sm text-muted-foreground">{author.posts} Beiträge</p>
                    </div>
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Posts Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Kürzlich bearbeitet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Wähle einen Beitrag aus der Seitenleiste aus oder erstelle einen neuen Beitrag.
              </p>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
