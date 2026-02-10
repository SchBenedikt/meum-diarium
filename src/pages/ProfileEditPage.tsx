import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { ArrowLeft, Save, User, Mail, Edit3 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserApiBase } from '@/lib/api';

export default function ProfileEditPage() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${getUserApiBase()}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        toast.success('Profil erfolgreich aktualisiert!');
        // Update user context if needed
        navigate('/dashboard');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Fehler beim Aktualisieren');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Serverfehler. Bitte versuchen Sie es später.');
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
        <SEO
          title="Profil bearbeiten | Meum Diarium"
          description="Profil bearbeiten - Meum Diarium"
          noIndex={true}
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Bitte anmelden</h1>
            <p className="text-muted-foreground mb-6">
              Sie müssen angemeldet sein, um Ihr Profil zu bearbeiten.
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Profil bearbeiten | Meum Diarium"
        description="Profil bearbeiten - Meum Diarium"
        noIndex={true}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Profil bearbeiten",
          "description": "Profil bearbeiten - Meum Diarium",
          "url": "https://meum-diarium.xn--schner-2za.de/profile/edit",
          "potentialAction": {
            "@type": "UpdateAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://meum-diarium.xn--schner-2za.de/profile/edit"
            }
          }
        }}
      />
      <main className="flex-1">
        <div className="container mx-auto max-w-2xl px-4 py-20">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zum Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Profil bearbeiten</h1>
            <p className="text-muted-foreground">
              Aktualisieren Sie Ihre Profilinformationen
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Profil bearbeiten
              </CardTitle>
              <CardDescription>
                Ändern Sie Ihren Namen, Ihre Biografie und Ihr Profilbild
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.avatarUrl} alt={user?.displayName} />
                    <AvatarFallback>
                      {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Label htmlFor="avatarUrl">Profilbild URL</Label>
                    <Input
                      id="avatarUrl"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={formData.avatarUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Display Name */}
                <div className="space-y-2">
                  <Label htmlFor="displayName">Anzeigename</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Ihr Name"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    className="w-full"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografie</Label>
                  <Textarea
                    id="bio"
                    placeholder="Erzählen Sie etwas über sich selbst..."
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full"
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    Abbrechen
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white border-t-transparent border-r-transparent border-l-transparent mr-2"></div>
                        Speichern...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Speichern
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Konto-Aktionen</CardTitle>
              <CardDescription>
                Verwalten Sie Ihr Konto und Ihre Daten
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{user?.email}</p>
                    <p className="text-sm text-muted-foreground">E-Mail-Adresse</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/change-password')}
                >
                  Passwort ändern
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Benutzername: {user?.username}</p>
                    <p className="text-sm text-muted-foreground">Mitglied seit {new Date(user?.createdAt).toLocaleDateString('de-DE')}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/export-data')}
                >
                  Daten exportieren
                </Button>
              </div>

              <div className="pt-4">
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full"
                >
                  Abmelden
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
