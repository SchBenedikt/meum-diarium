import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
  Heart,
  Edit,
  Star,
  Trophy,
  Target,
  Flame
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout, token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [xpData, setXpData] = useState<any>(null);
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
    }
  };

  // Fetch XP data
  const fetchXpData = async () => {
    try {
      const response = await fetch('/api/user/xp', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setXpData(data);
      }
    } catch (error) {
      console.error('Error fetching XP data:', error);
    }
  };

  useEffect(() => {
    if (token) {
      Promise.all([fetchStats(), fetchXpData()]).finally(() => {
        setIsLoading(false);
      });
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

          {/* XP Progress Section */}
          <Card className="mb-8 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-gray-800 dark:to-gray-700 border-amber-200 dark:border-gray-600">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                  <div>
                    <CardTitle className="text-xl font-bold text-amber-900 dark:text-amber-100">Level {xpData?.level || 1}</CardTitle>
                    <CardDescription className="text-amber-700 dark:text-amber-300">
                      {xpData?.totalXp || 0} Gesamt XP
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/achievements'}
                  className="border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Erfolge
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Level Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-amber-900 dark:text-amber-100">Fortschritt zum nächsten Level</span>
                    <span className="text-amber-700 dark:text-amber-300">
                      {xpData?.currentLevelXp || 0} / {xpData?.xpToNextLevel || 100} XP
                    </span>
                  </div>
                  <Progress 
                    value={xpData ? (xpData.currentLevelXp / xpData.xpToNextLevel) * 100 : 0}
                    className="h-3 bg-amber-100 dark:bg-amber-900/50"
                  />
                </div>

                {/* XP Stats Grid */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white/60 dark:bg-gray-900/60 rounded-lg p-3">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {xpData?.totalXp || 0}
                    </div>
                    <p className="text-xs text-amber-700 dark:text-amber-300">Gesamt XP</p>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-900/60 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {xpData?.stats?.achievementsUnlocked || 0}
                    </div>
                    <p className="text-xs text-green-700 dark:text-green-300">Erfolge</p>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-900/60 rounded-lg p-3">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {xpData?.streakDays || 0}
                    </div>
                    <p className="text-xs text-red-700 dark:text-red-300">Tage Serie</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600"
                    onClick={() => window.location.href = '/learn'}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Lernen
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                    onClick={() => window.location.href = '/vocab'}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Vokabeln
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                    onClick={() => window.location.href = '/leaderboard'}
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Leaderboard
                  </Button>
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
