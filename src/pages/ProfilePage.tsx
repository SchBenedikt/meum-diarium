import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { 
  User, 
  BookOpen, 
  Clock, 
  Trophy, 
  Flame,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Book,
  MessageSquare,
  Settings,
  LogOut,
  Eye,
  BarChart3
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getUserStats, 
  getRecentActivity, 
  getAchievements,
  ProgressEntry,
  UserStats,
  Achievement
} from '@/lib/user-progress';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<ProgressEntry[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = () => {
    try {
      const userStats = getUserStats(user!.id);
      const activity = getRecentActivity(user!.id, 8);
      const userAchievements = getAchievements();
      
      setStats(userStats);
      setRecentActivity(activity);
      setAchievements(userAchievements);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEO title="Profil | Meum Diarium" noIndex={true} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Bitte anmelden</h1>
            <p className="text-muted-foreground mb-6">
              Sie müssen angemeldet sein, um Ihr Profil zu sehen.
            </p>
            <Button onClick={() => navigate('/login')}>
              Zum Login
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEO title="Profil | Meum Diarium" noIndex={true} />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const totalProgress = achievements.reduce((acc, a) => acc + a.progress, 0);
  const maxProgress = achievements.reduce((acc, a) => acc + a.maxProgress, 0);
  const overallProgress = maxProgress > 0 ? (totalProgress / maxProgress) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={`${user.displayName} - Profil | Meum Diarium`}
        description={`Profil von ${user.displayName} - Lernfortschritt und Statistiken auf Meum Diarium`}
        noIndex={true}
      />
      
      <main className="flex-1">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <Link
                to="/dashboard"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                ← Zurück zum Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/profile/edit')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Profil bearbeiten
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Abmelden
                </Button>
              </div>
            </div>

            {/* User Info Card */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                    <AvatarFallback className="text-2xl font-bold">
                      {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{user.displayName}</h1>
                    <p className="text-muted-foreground mb-4">{user.bio || 'Keine Biografie vorhanden'}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Mitglied seit {new Date(stats?.joinDate || user.createdAt).toLocaleDateString('de-DE')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        {stats?.streakDays || 0} Tage Streak
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {stats?.totalReadingTime || 0} Min. gelesen
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="h-8 w-8 text-blue-500" />
                  <span className="text-2xl font-bold">{stats?.postsRead || 0}</span>
                </div>
                <p className="text-sm text-muted-foreground">Beiträge gelesen</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Book className="h-8 w-8 text-green-500" />
                  <span className="text-2xl font-bold">{stats?.lexiconEntriesViewed || 0}</span>
                </div>
                <p className="text-sm text-muted-foreground">Lexikon-Einträge</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <span className="text-2xl font-bold">{unlockedAchievements.length}</span>
                </div>
                <p className="text-sm text-muted-foreground">Erfolge freigeschaltet</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <MessageSquare className="h-8 w-8 text-purple-500" />
                  <span className="text-2xl font-bold">{stats?.chatSessionsCount || 0}</span>
                </div>
                <p className="text-sm text-muted-foreground">Chat-Sessions</p>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Achievements */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Erfolge & Fortschritt
                  </CardTitle>
                  <CardDescription>
                    Deine Lernerfolge und insgesamt erreichter Fortschritt
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Overall Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Gesamter Fortschritt</span>
                      <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
                    </div>
                    <Progress value={overallProgress} className="h-2" />
                  </div>

                  {/* Achievements Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border transition-all ${
                          achievement.unlockedAt
                            ? 'bg-primary/5 border-primary/20'
                            : 'bg-muted/20 border-muted opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{achievement.title}</h4>
                            <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                            {!achievement.unlockedAt && achievement.maxProgress > 1 && (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span>Fortschritt</span>
                                  <span>{achievement.progress}/{achievement.maxProgress}</span>
                                </div>
                                <Progress 
                                  value={(achievement.progress / achievement.maxProgress) * 100} 
                                  className="h-1" 
                                />
                              </div>
                            )}
                            {achievement.unlockedAt && (
                              <Badge variant="secondary" className="text-xs">
                                <Award className="h-3 w-3 mr-1" />
                                Freigeschaltet
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Letzte Aktivität
                  </CardTitle>
                  <CardDescription>
                    Deine kürzlich besuchten Inhalte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentActivity.length > 0 ? (
                    <div className="space-y-3">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => {
                            // Navigate to the item based on type
                            const basePath = {
                              post: '/blog',
                              lexicon: '/lexicon',
                              grammar: '/learn/grammar',
                              vocab: '/vocab',
                              simulation: '/simulation',
                              chat: '/chat'
                            }[activity.type];
                            
                            if (basePath) {
                              navigate(`${basePath}/${activity.itemId}`);
                            }
                          }}
                        >
                          <div className="mt-1">
                            {activity.type === 'post' && <BookOpen className="h-4 w-4 text-blue-500" />}
                            {activity.type === 'lexicon' && <Book className="h-4 w-4 text-green-500" />}
                            {activity.type === 'grammar' && <BarChart3 className="h-4 w-4 text-purple-500" />}
                            {activity.type === 'vocab' && <Target className="h-4 w-4 text-orange-500" />}
                            {activity.type === 'simulation' && <TrendingUp className="h-4 w-4 text-red-500" />}
                            {activity.type === 'chat' && <MessageSquare className="h-4 w-4 text-cyan-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.completedAt).toLocaleDateString('de-DE', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Noch keine Aktivität</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Beginne mit dem Lesen von Beiträgen oder dem Erkunden des Lexikons
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
