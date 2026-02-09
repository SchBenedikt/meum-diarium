import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { 
  User, 
  Mail, 
  Save, 
  ArrowLeft,
  Loader2,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

export default function ProfileEditPage() {
  const { user, token, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    avatarUrl: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch current profile data
  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({
          displayName: data.user.displayName || '',
          bio: data.user.bio || '',
          avatarUrl: data.user.avatarUrl || ''
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Fehler beim Laden des Profils');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Netzwerkfehler beim Laden des Profils');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('Profil erfolgreich aktualisiert!');
        
        // Update user context with new data
        if (updateUser) {
          updateUser(data.user);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Fehler beim Speichern des Profils');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Netzwerkfehler beim Speichern des Profils');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null; // Should be handled by ProtectedRoute
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Profil bearbeiten" description="Ihr Profil bearbeiten" />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Profil bearbeiten" description="Ihr Profil bearbeiten" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/dashboard'}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück zum Dashboard
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">Profil bearbeiten</h1>
            <p className="text-muted-foreground">
              Aktualisieren Sie Ihre Profilinformationen
            </p>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 border border-green-200 bg-green-50 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {/* Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profilinformationen
              </CardTitle>
              <CardDescription>
                Diese Informationen werden öffentlich in Ihrem Profil angezeigt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail-Adresse</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Die E-Mail-Adresse kann nicht geändert werden
                  </p>
                </div>

                {/* Username (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="username">Benutzername</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      value={user.username}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Der Benutzername kann nicht geändert werden
                  </p>
                </div>

                {/* Display Name */}
                <div className="space-y-2">
                  <Label htmlFor="displayName">Anzeigename</Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    placeholder="Ihr Anzeigename"
                    maxLength={50}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.displayName.length}/50 Zeichen
                  </p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografie</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Erzählen Sie etwas über sich..."
                    rows={4}
                    maxLength={500}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.bio.length}/500 Zeichen
                  </p>
                </div>

                {/* Avatar URL */}
                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="avatarUrl"
                      type="url"
                      value={formData.avatarUrl}
                      onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                      placeholder="https://beispiel.com/avatar.jpg"
                      maxLength={500}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    URL zu Ihrem Profilbild (optional)
                  </p>
                  
                  {/* Avatar Preview */}
                  {formData.avatarUrl && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Vorschau:</p>
                      <div className="flex items-center gap-4">
                        <img
                          src={formData.avatarUrl}
                          alt="Avatar Vorschau"
                          className="w-16 h-16 rounded-full object-cover border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {formData.avatarUrl}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex items-center gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Wird gespeichert...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Profil speichern
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.location.href = '/dashboard'}
                  >
                    Abbrechen
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
