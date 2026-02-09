import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { 
  BookOpen, 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  User, 
  Calendar,
  Award,
  BarChart3,
  Loader2,
  Heart
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout, token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token]);

  if (!user) {
    return null; // Should be handled by ProtectedRoute
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Dashboard"
        description="Ihr persönliches Dashboard für Meum Diarium"
        noIndex={true}
      />
      
      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-24 md:py-28 pt-28">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
              Willkommen zurück, {user.displayName}!
            </h1>
            <p className="text-lg text-muted-foreground">
              Hier ist Ihr persönliches Dashboard mit Ihren Lernfortschritten und Aktivitäten.
            </p>
          </div>

          {/* User Info Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profilinformationen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Benutzername</p>
                  <p className="font-medium">{user.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">E-Mail</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mitglied seit</p>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString('de-DE')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Letzter Login</p>
                  <p className="font-medium">
                    {user.lastLoginAt 
                      ? new Date(user.lastLoginAt).toLocaleDateString('de-DE')
                      : 'Erster Login'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gelesene Beiträge</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    stats?.readingStats?.postsRead || 0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.readingStats?.postsRead > 0 
                    ? `${stats.readingStats.postsRead} Beiträge gelesen`
                    : 'Noch keine Beiträge gelesen'
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kommentare</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    stats?.commentStats?.totalComments || 0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.commentStats?.totalComments > 0 
                    ? `${stats.commentStats.totalComments} Kommentare geschrieben`
                    : 'Noch keine Kommentare geschrieben'
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lesezeit</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    `${Math.floor((stats?.readingStats?.totalTimeSeconds || 0) / 3600)}h`
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.readingStats?.totalTimeSeconds > 0 
                    ? `${Math.floor((stats.readingStats.totalTimeSeconds % 3600) / 60)} Minuten zusätzlich`
                    : 'Gesamtlesedauer'
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktivität</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    stats?.activityStreak || 0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.activityStreak > 0 
                    ? `${stats.activityStreak} Tage aktiv`
                    : 'Tage aktiv'
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Kürzlich gelesen
                </CardTitle>
                <CardDescription>
                  Die letzten Beiträge, die Sie gelesen haben
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : stats?.recentReading?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentReading.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">Beitrag {item.postId}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.startedAt).toLocaleDateString('de-DE')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{item.progressPercentage}%</div>
                          {item.isCompleted && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Abgeschlossen</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Noch keine Lektaktivität</p>
                    <p className="text-sm">Beginnen Sie mit dem Lesen von Beiträgen, um hier Ihre Fortschritte zu sehen.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Kürzliche Kommentare
                </CardTitle>
                <CardDescription>
                  Ihre letzten Kommentare und Diskussionen
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : stats?.recentComments?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentComments.map((comment: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <p className="text-sm line-clamp-2 mb-2">{comment.content}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString('de-DE')}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Heart className="h-3 w-3" />
                            {comment.likesCount}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Noch keine Kommentare</p>
                    <p className="text-sm">Teilen Sie Ihre Gedanken mit der Community!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Erfolge
              </CardTitle>
              <CardDescription>
                Ihre bisherigen Erfolge und Meilensteine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`text-center p-4 border rounded-lg ${stats?.readingStats?.postsRead > 0 ? 'bg-green-50 border-green-200' : ''}`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${stats?.readingStats?.postsRead > 0 ? 'bg-green-500 text-white' : 'bg-muted'}`}>
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <h3 className="font-medium mb-1">Erster Schritt</h3>
                  <p className="text-sm text-muted-foreground">
                    {stats?.readingStats?.postsRead > 0 ? '✅ Erledigt!' : 'Lesen Sie Ihren ersten Beitrag'}
                  </p>
                </div>
                <div className={`text-center p-4 border rounded-lg ${stats?.commentStats?.totalComments > 0 ? 'bg-green-50 border-green-200' : ''}`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${stats?.commentStats?.totalComments > 0 ? 'bg-green-500 text-white' : 'bg-muted'}`}>
                    <MessageSquare className="h-8 w-8" />
                  </div>
                  <h3 className="font-medium mb-1">Erste Stimme</h3>
                  <p className="text-sm text-muted-foreground">
                    {stats?.commentStats?.totalComments > 0 ? '✅ Erledigt!' : 'Schreiben Sie Ihren ersten Kommentar'}
                  </p>
                </div>
                <div className={`text-center p-4 border rounded-lg ${stats?.activityStreak >= 7 ? 'bg-green-50 border-green-200' : ''}`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${stats?.activityStreak >= 7 ? 'bg-green-500 text-white' : 'bg-muted'}`}>
                    <BarChart3 className="h-8 w-8" />
                  </div>
                  <h3 className="font-medium mb-1">Stetiger Leser</h3>
                  <p className="text-sm text-muted-foreground">
                    {stats?.activityStreak >= 7 
                      ? `✅ Erledigt! (${stats.activityStreak} Tage)` 
                      : `Lesen Sie 7 Tage in Folge (${stats?.activityStreak || 0}/7)`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button onClick={() => window.location.href = '/'} variant="outline">
              Zur Startseite
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              Abmelden
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
