import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Settings as SettingsIcon, Globe, Palette, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { SiteSettings, defaultSettings } from '@/types/settings';
import { getSettings, saveSettings } from '@/lib/cms-store';

export default function SettingsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    try {
      const loaded = getSettings();
      setSettings({ ...defaultSettings, ...loaded });
    } catch (error) {
      console.error('Failed to load settings', error);
    }
  }, []);

  const updateSetting = (key: keyof SiteSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await saveSettings(settings);
      toast.success('Einstellungen gespeichert');
      
      // In a real implementation, you would send to API:
      // await fetch('/api/settings', { method: 'POST', ... });
      
    } catch (error) {
      console.error(error);
      toast.error('Fehler beim Speichern');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Zurück zur Übersicht</span>
            </Link>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <h1 className="font-display text-lg sm:text-xl font-medium flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Einstellungen
            </h1>
          </div>
          <Button onClick={handleSubmit} disabled={loading} size="sm">
            <Save className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">{loading ? 'Speichern...' : 'Speichern'}</span>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="general" className="gap-2">
                <SettingsIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Allgemein</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Design</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Erweitert</span>
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Webseitendetails</CardTitle>
                  <CardDescription>Grundlegende Informationen über deine Website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Seitenname</Label>
                    <Input
                      value={settings.siteName}
                      onChange={e => updateSetting('siteName', e.target.value)}
                      placeholder="Meum Diarium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Beschreibung</Label>
                    <Textarea
                      value={settings.siteDescription}
                      onChange={e => updateSetting('siteDescription', e.target.value)}
                      placeholder="Eine kurze Beschreibung deiner Seite..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Website URL</Label>
                    <Input
                      value={settings.siteUrl}
                      onChange={e => updateSetting('siteUrl', e.target.value)}
                      placeholder="https://example.com"
                      type="url"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sprachen & Übersetzungen</CardTitle>
                  <CardDescription>Konfiguriere mehrsprachige Inhalte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Standardsprache</Label>
                    <Input
                      value={settings.defaultLanguage}
                      onChange={e => updateSetting('defaultLanguage', e.target.value)}
                      placeholder="de"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Übersetzungen aktivieren</Label>
                      <p className="text-sm text-muted-foreground">
                        Ermöglicht mehrsprachige Inhalte
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableTranslations}
                      onCheckedChange={val => updateSetting('enableTranslations', val)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Design & Farben</CardTitle>
                  <CardDescription>Passe das Aussehen deiner Website an</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Akzentfarbe</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings.accentColor}
                        onChange={e => updateSetting('accentColor', e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={settings.accentColor}
                        onChange={e => updateSetting('accentColor', e.target.value)}
                        placeholder="#ea580c"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Input
                      value={settings.theme}
                      onChange={e => updateSetting('theme', e.target.value)}
                      placeholder="system / light / dark"
                    />
                    <p className="text-xs text-muted-foreground">
                      Optionen: system, light, dark
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Footer</CardTitle>
                  <CardDescription>Anpassen des Seitenfußes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Footer Text</Label>
                    <Textarea
                      value={settings.footerText}
                      onChange={e => updateSetting('footerText', e.target.value)}
                      placeholder="© 2024 Deine Seite"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Settings */}
            <TabsContent value="advanced" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Benachrichtigungen</CardTitle>
                  <CardDescription>Verwalte System-Benachrichtigungen</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push-Benachrichtigungen</Label>
                      <p className="text-sm text-muted-foreground">
                        Erhalte Benachrichtigungen über Updates
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableNotifications}
                      onCheckedChange={val => updateSetting('enableNotifications', val)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cache & Performance</CardTitle>
                  <CardDescription>Optimiere die Ladezeiten</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button type="button" variant="outline" className="w-full">
                    Cache leeren
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Löscht zwischengespeicherte Daten und zwingt Neuladen von Assets
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  );
}
