import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { 
  Trophy, 
  BookOpen, 
  Award, 
  Star, 
  Target,
  Flame,
  Users,
  GraduationCap,
  Crown,
  Lock,
  Unlock,
  CheckCircle
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  requirementType: string;
  requirementValue: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  progressPercentage: number;
}

interface AchievementsData {
  achievements: Achievement[];
  categories: Record<string, Achievement[]>;
  stats: {
    total: number;
    unlocked: number;
    percentage: number;
  };
}

const categoryIcons: Record<string, React.ReactNode> = {
  reading: <BookOpen className="w-5 h-5" />,
  vocabulary: <GraduationCap className="w-5 h-5" />,
  grammar: <Target className="w-5 h-5" />,
  social: <Users className="w-5 h-5" />,
  streak: <Flame className="w-5 h-5" />
};

const categoryColors: Record<string, string> = {
  reading: 'bg-blue-100 text-blue-800 border-blue-200',
  vocabulary: 'bg-green-100 text-green-800 border-green-200',
  grammar: 'bg-purple-100 text-purple-800 border-purple-200',
  social: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  streak: 'bg-red-100 text-red-800 border-red-200'
};

export default function AchievementsPage() {
  const { token } = useAuth();
  const [achievementsData, setAchievementsData] = useState<AchievementsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/achievements', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAchievementsData(data);
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchAchievements();
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!achievementsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <Trophy className="w-16 h-16 text-amber-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Fehler beim Laden</h2>
              <p className="text-gray-600">Konnte Erfolge nicht laden. Bitte versuche es später erneut.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categories = Object.keys(achievementsData.categories);
  const filteredAchievements = selectedCategory === 'all' 
    ? achievementsData.achievements 
    : achievementsData.categories[selectedCategory] || [];

  return (
    <>
      <SEO 
        title="Erfolge - Meum Diarium" 
        description="Deine Latein-Lern Erfolge und Errungenschaften"
      />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="w-12 h-12 text-amber-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">Deine Erfolge</h1>
            </div>
            <p className="text-xl text-gray-600 mb-6">
              {achievementsData.stats.unlocked} von {achievementsData.stats.total} Erfolgen freigeschaltet
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600 mb-2">
                      {achievementsData.stats.percentage}%
                    </div>
                    <p className="text-sm text-gray-600">Fortschritt</p>
                    <Progress 
                      value={achievementsData.stats.percentage} 
                      className="mt-3 h-2"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {achievementsData.stats.unlocked}
                    </div>
                    <p className="text-sm text-gray-600">Freigeschaltet</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm border-amber-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {achievementsData.stats.total - achievementsData.stats.unlocked}
                    </div>
                    <p className="text-sm text-gray-600">Verbleibend</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:grid-cols-7">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Alle
              </TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="flex items-center gap-2">
                  {categoryIcons[category]}
                  <span className="hidden sm:inline capitalize">{category}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Achievement Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAchievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  achievement.isUnlocked 
                    ? 'bg-gradient-to-br from-amber-100 to-yellow-100 border-amber-300' 
                    : 'bg-gray-100 border-gray-300 opacity-75'
                }`}
              >
                {/* Lock/Unlock Status */}
                <div className="absolute top-3 right-3">
                  {achievement.isUnlocked ? (
                    <div className="bg-green-500 text-white rounded-full p-2">
                      <Unlock className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="bg-gray-500 text-white rounded-full p-2">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <CardHeader className="text-center pb-3">
                  <div className="text-4xl mb-3">
                    {achievement.icon}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Badge className={categoryColors[achievement.category]}>
                      {categoryIcons[achievement.category]}
                      <span className="ml-1 capitalize">{achievement.category}</span>
                    </Badge>
                  </div>
                  <CardTitle className={`text-lg ${
                    achievement.isUnlocked ? 'text-gray-900' : 'text-gray-600'
                  }`}>
                    {achievement.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className={`text-center mb-4 ${
                    achievement.isUnlocked ? 'text-gray-700' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </CardDescription>
                  
                  {/* XP Reward */}
                  <div className="flex items-center justify-center mb-3">
                    <Award className="w-4 h-4 text-amber-600 mr-1" />
                    <span className={`font-semibold ${
                      achievement.isUnlocked ? 'text-amber-600' : 'text-gray-500'
                    }`}>
                      {achievement.xpReward} XP
                    </span>
                  </div>

                  {/* Progress */}
                  {!achievement.isUnlocked && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Fortschritt</span>
                        <span>{achievement.progressPercentage}%</span>
                      </div>
                      <Progress value={achievement.progressPercentage} className="h-2" />
                    </div>
                  )}

                  {/* Unlocked Date */}
                  {achievement.isUnlocked && achievement.unlockedAt && (
                    <div className="text-center text-sm text-green-600 mt-3">
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Freigeschaltet am {new Date(achievement.unlockedAt).toLocaleDateString('de-DE')}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredAchievements.length === 0 && (
            <div className="text-center py-12">
              <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Keine Erfolge in dieser Kategorie
              </h3>
              <p className="text-gray-500">
                {selectedCategory === 'all' 
                  ? 'Noch keine Erfolge freigeschaltet. Beginne mit dem Latein lernen!'
                  : 'Keine Erfolge in dieser Kategorie verfügbar.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
