import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Settings as SettingsIcon, Globe, Palette, Bell, Download, CheckCircle, AlertCircle, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { SiteSettings, defaultSettings } from '@/types/settings';
import { getSettings, saveSettings } from '@/lib/cms-store';
export default function SettingsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  // Offline features state
  const [isCaching, setIsCaching] = useState(false);
  const [cacheComplete, setCacheComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isError, setIsError] = useState(false);
  const [statusText, setStatusText] = useState('Alle Artikel und das Lexikon offline speichern.');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  useEffect(() => {
    try {
      const loaded = getSettings();
      setSettings({ ...defaultSettings, ...loaded });
    } catch (error) {
      console.error('Failed to load settings', error);
    }
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'PRECACHE_PROGRESS') {
        const { progress: p, status } = event.data.payload;
        if (p === -1) {
          setIsError(true);
          setIsCaching(false);
          setStatusText('Download fehlgeschlagen.');
        } else {
          setProgress(p);
          setStatusText(status);
          if (p === 100) {
            setTimeout(() => {
              setIsCaching(false);
              setCacheComplete(true);
            }, 500);
          }
        }
      }
    };
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleMessage);
    }
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleMessage);
      }
    };
  }, []);
  const triggerPrecache = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      setIsCaching(true);
      setIsError(false);
      setCacheComplete(false);
      setProgress(0);
      navigator.serviceWorker.controller.postMessage({ type: 'TRIGGER_PRECACHE' });
      toast.info('Offline-Download gestartet...');
    } else {
      toast.error('Service Worker nicht bereit.');
    }
  };
  const clearCache = async () => {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
      toast.success('Cache geleert. Die Seite wird neu geladen.');
      setTimeout(() => window.location.reload(), 1000);
    }
  };
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
              {/* Translation settings disabled - German only
              {/* <Card>
                              <CardHeader>
