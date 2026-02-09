import React from 'react';
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
  BarChart3
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();

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
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Noch keine Beiträge gelesen
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kommentare</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Noch keine Kommentare geschrieben
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lesezeit</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0h</div>
                <p className="text-xs text-muted-foreground">
                  Gesamtlesedauer
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktivität</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Tage aktiv
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
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Noch keine Lektaktivität</p>
                  <p className="text-sm">Beginnen Sie mit dem Lesen von Beiträgen, um hier Ihre Fortschritte zu sehen.</p>
                </div>
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
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Noch keine Kommentare</p>
                  <p className="text-sm">Teilen Sie Ihre Gedanken mit der Community!</p>
                </div>
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
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-1">Erster Schritt</h3>
                  <p className="text-sm text-muted-foreground">Lesen Sie Ihren ersten Beitrag</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-1">Erste Stimme</h3>
                  <p className="text-sm text-muted-foreground">Schreiben Sie Ihren ersten Kommentar</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-1">Stetiger Leser</h3>
                  <p className="text-sm text-muted-foreground">Lesen Sie 7 Tage in Folge</p>
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
