import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { 
  Bookmark, 
  Calendar, 
  Clock, 
  ExternalLink,
  Loader2,
  BookOpen,
  Trash2
} from 'lucide-react';

interface SavedArticle {
  id: string;
  title: string;
  excerpt: string;
  historicalDate: string;
  coverImage: string;
  readingTime: number;
  tags: string[];
  savedAt: string;
  saveId: string;
}

export default function SavedArticlesPage() {
  const { token } = useAuth();
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unsaveLoading, setUnsaveLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedArticles = async () => {
      try {
        const response = await fetch('/api/articles/saved', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSavedArticles(data.savedArticles || []);
        }
      } catch (error) {
        console.error('Error fetching saved articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchSavedArticles();
    }
  }, [token]);

  const handleUnsave = async (postId: string, saveId: string) => {
    setUnsaveLoading(saveId);
    try {
      const response = await fetch('/api/articles/saved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.action === 'unsaved') {
          setSavedArticles(prev => prev.filter(article => article.id !== postId));
        }
      }
    } catch (error) {
      console.error('Error unsaving article:', error);
    } finally {
      setUnsaveLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTagColor = (tag: string) => {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    ];
    return colors[tag.length % colors.length];
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
        title="Gespeicherte Artikel - Meum Diarium" 
        description="Deine gespeicherten Latein-Artikel"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Bookmark className="w-12 h-12 text-blue-600 dark:text-blue-400 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Gespeicherte Artikel</h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {savedArticles.length} {savedArticles.length === 1 ? 'Artikel' : 'Artikel'} gespeichert
            </p>
          </div>

          {/* Articles Grid */}
          {savedArticles.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Keine gespeicherten Artikel
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                Artikel speichern, um sie hier später zu finden.
              </p>
              <Button 
                className="mt-4"
                onClick={() => window.location.href = '/reader'}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Artikel entdecken
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedArticles.map((article) => (
                <Card key={article.saveId} className="group hover:shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="text-sm mt-2">
                          Gespeichert am {formatDate(article.savedAt)}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnsave(article.id, article.saveId)}
                        disabled={unsaveLoading === article.saveId}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 ml-2"
                      >
                        {unsaveLoading === article.saveId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {article.coverImage && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img 
                          src={article.coverImage} 
                          alt={article.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        {article.readingTime > 0 && (
                          <>
                            <Clock className="w-4 h-4" />
                            <span>{article.readingTime} Min.</span>
                          </>
                        )}
                        {article.historicalDate && (
                          <>
                            <Calendar className="w-4 h-4 ml-2" />
                            <span>{article.historicalDate}</span>
                          </>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => window.location.href = `/posts/${article.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Lesen
                      </Button>
                    </div>

                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} className={`text-xs ${getTagColor(tag)}`}>
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
