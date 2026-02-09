import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { 
  Trophy, 
  Crown, 
  Medal,
  Flame,
  Users,
  Star,
  Loader2,
  User
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  totalXp: number;
  level: number;
  streakDays: number;
  longestStreak: number;
  user: {
    displayName: string;
    username: string;
    avatarUrl?: string;
  };
}

interface LeaderboardData {
  type: string;
  timeframe: string;
  leaderboard: LeaderboardEntry[];
}

export default function LeaderboardPage() {
  const { token } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('global');

  useEffect(() => {
    const fetchLeaderboard = async (type: string) => {
      try {
        const response = await fetch(`/api/leaderboard?type=${type}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setLeaderboardData(data);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchLeaderboard(activeTab);
    }
  }, [token, activeTab]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
    return 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Leaderboard - Meum Diarium" 
        description="Die besten Latein-Lerner im Ranking"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="w-12 h-12 text-blue-600 dark:text-blue-400 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Die besten Latein-Lerner nach XP
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="global" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Global
              </TabsTrigger>
              <TabsTrigger value="streak" className="flex items-center gap-2">
                <Flame className="w-4 h-4" />
                Serien
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Leaderboard Content */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {activeTab === 'global' ? (
                  <>
                    <Trophy className="w-5 h-5 text-blue-600" />
                    Globales Ranking
                  </>
                ) : (
                  <>
                    <Flame className="w-5 h-5 text-orange-600" />
                    Serien-Ranking
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {activeTab === 'global' 
                  ? 'Die besten Lerner nach Gesamt-XP'
                  : 'Die längsten Lern-Serien'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {leaderboardData?.leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    Keine Einträge gefunden
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500">
                    Sei der Erste im Leaderboard!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboardData?.leaderboard.map((entry) => (
                    <div
                      key={entry.userId}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 hover:shadow-md ${
                        entry.rank <= 3 
                          ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800' 
                          : 'bg-gray-50 dark:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className="flex items-center justify-center w-12 h-12">
                          {getRankIcon(entry.rank)}
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            {entry.user.avatarUrl ? (
                              <img 
                                src={entry.user.avatarUrl} 
                                alt={entry.user.displayName}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {entry.user.displayName || entry.user.username}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Level {entry.level}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6">
                        {activeTab === 'global' ? (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {entry.totalXp.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">XP</div>
                          </div>
                        ) : (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                              {entry.streakDays}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Tage</div>
                          </div>
                        )}
                        
                        <div className="text-right">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRankBadgeColor(entry.rank)}`}>
                            #{entry.rank}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
