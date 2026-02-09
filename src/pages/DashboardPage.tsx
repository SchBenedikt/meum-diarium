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
  User, 
  Calendar,
  Loader2,
  Edit
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
              Hier ist Ihr persönliches Dashboard mit Ihren Aktivitäten.
            </p>
          </div>

          {/* User Profile Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{user.displayName || user.username}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/profile/edit'}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Profil bearbeiten
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Mitglied seit {new Date(user.createdAt).toLocaleDateString('de-DE')}</span>
                </div>
                {user.lastLoginAt && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Letzte Anmeldung {new Date(user.lastLoginAt).toLocaleDateString('de-DE')}</span>
                  </div>
                )}
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
                    ? `${stats.commentStats.totalComments} Kommentare`
                    : 'Noch keine Kommentare'
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
                    `${Math.floor((stats?.readingStats?.totalReadingTime || 0) / 60)}m`
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.readingStats?.totalReadingTime > 0 
                    ? `${(stats.readingStats.totalReadingTime % 60)}s Gesamt`
                    : 'Noch keine Lesezeit'
                  }
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktivität</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    stats?.activityStats?.daysActive || 0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.activityStats?.daysActive > 0 
                    ? `${stats.activityStats.daysActive} Tage aktiv`
                    : 'Noch keine Aktivität'
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Comments */}
          {stats?.recentComments && stats.recentComments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Ihre neuesten Kommentare
                </CardTitle>
                <CardDescription>
                  Die letzten Kommentare, die Sie geschrieben haben
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentComments.map((comment: any) => (
                    <div key={comment.id} className="border-l-4 border-primary pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{comment.postTitle}</h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
