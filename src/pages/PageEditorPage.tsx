import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Plus, X, Eye } from 'lucide-react';
import { PageContent, PageHighlight, PageLanguage, PageTranslation } from '@/types/page';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { MediaLibrary } from '@/components/MediaLibrary';

const emptyHighlight: PageHighlight = { title: '', description: '' };

const buildEmptyPage = (slug: string): PageContent => ({
  slug,
  heroTitle: '',
  heroSubtitle: '',
  projectDescription: '',
  heroImage: '',
  highlights: [emptyHighlight],
  translations: {
    en: { heroTitle: '', heroSubtitle: '', projectDescription: '', highlights: [emptyHighlight] },
    la: { heroTitle: '', heroSubtitle: '', projectDescription: '', highlights: [emptyHighlight] },
  },
});

export default function PageEditorPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const isNewPage = slug === 'new';
  const [pageSlug, setPageSlug] = useState(isNewPage ? '' : slug || 'about');
  const [page, setPage] = useState<PageContent>(() => buildEmptyPage(pageSlug));
  const [activeLang, setActiveLang] = useState<PageLanguage>('de');

  useEffect(() => {
    if (isNewPage) {
      return; // Don't fetch for new pages
    }
    
    async function fetchPage() {
      try {
        const res = await fetch(`/api/pages/${slug}`);
        if (res.ok) {
          const data: PageContent = await res.json();
          setPage(prev => ({ ...prev, ...data, translations: data.translations || prev.translations }));
          setPageSlug(data.slug);
        }
      } catch (error) {
        console.error('Failed to load page content', error);
      }
    }
    fetchPage();
  }, [slug, isNewPage]);

  const updateBase = (field: keyof PageContent, value: any) => {
    setPage(prev => ({ ...prev, [field]: value }));
  };

  const updateHighlight = (index: number, field: keyof PageHighlight, value: string) => {
    setPage(prev => ({
      ...prev,
      highlights: prev.highlights.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const addHighlight = () => setPage(prev => ({ ...prev, highlights: [...prev.highlights, { ...emptyHighlight }] }));
  const removeHighlight = (index: number) => setPage(prev => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== index) }));

  const updateTranslation = (lang: PageLanguage, updater: (data: PageTranslation) => PageTranslation) => {
    setPage(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: updater(prev.translations?.[lang] || { highlights: [emptyHighlight] }),
      },
    }));
  };

  const updateTranslationHighlight = (lang: PageLanguage, index: number, field: keyof PageHighlight, value: string) => {
    updateTranslation(lang, (data) => {
      const currentHighlights = data.highlights || [];
      const nextHighlights = currentHighlights.length ? currentHighlights : [emptyHighlight];
      return {
        ...data,
        highlights: nextHighlights.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
      };
    });
  };

  const addTranslationHighlight = (lang: PageLanguage) => {
    updateTranslation(lang, (data) => ({
      ...data,
      highlights: [...(data.highlights || []), { ...emptyHighlight }],
    }));
  };

  const removeTranslationHighlight = (lang: PageLanguage, index: number) => {
    updateTranslation(lang, (data) => ({
      ...data,
      highlights: (data.highlights || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!pageSlug) {
      toast.error('Bitte gib einen Slug für die Seite ein');
      return;
    }
    
    setLoading(true);

    try {
      const payload: PageContent = {
        ...page,
        slug: pageSlug,
      };

      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(t('saved') || 'Gespeichert');
        if (isNewPage) {
          // Redirect to edit page after creating
          navigate(`/admin/pages/${pageSlug}`);
        } else {
          navigate('/admin');
        }
      } else {
        toast.error(t('saveError') || 'Fehler beim Speichern');
      }
    } catch (error) {
      console.error(error);
      toast.error(t('saveError') || 'Fehler beim Speichern');
    } finally {
      setLoading(false);
    }
  };

  const translationTabs: PageLanguage[] = ['en', 'la'];

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Zurück</span>
            </Link>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <h1 className="font-display text-lg sm:text-xl font-medium">
              {isNewPage ? 'Neue Seite erstellen' : `Seite bearbeiten: ${pageSlug}`}
            </h1>
          </div>
          <div className="flex gap-2">
            {!isNewPage && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/${pageSlug}`} target="_blank">
                  <Eye className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Vorschau</span>
                </Link>
              </Button>
            )}
            <Button onClick={() => handleSubmit()} disabled={loading} size="sm">
              <Save className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{loading ? 'Speichern...' : 'Speichern'}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Seiteneinstellungen</CardTitle>
              <CardDescription>Grundlegende Informationen zur Seite</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Slug (URL-Pfad)</Label>
                <Input 
                  value={pageSlug} 
                  onChange={e => setPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} 
                  placeholder="about" 
                  required
                  disabled={!isNewPage}
                />
                <p className="text-xs text-muted-foreground">
                  Die Seite wird unter /{pageSlug} erreichbar sein
                  {!isNewPage && ' (Slug kann nach Erstellung nicht geändert werden)'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hero</CardTitle>
              <CardDescription>Überschrift und Untertitel der Seite</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Hero Titel (DE)</Label>
                <Input value={page.heroTitle} onChange={e => updateBase('heroTitle', e.target.value)} placeholder="Über das Projekt" />
              </div>
              <div className="space-y-2">
                <Label>Hero Untertitel (DE)</Label>
                <Textarea value={page.heroSubtitle} onChange={e => updateBase('heroSubtitle', e.target.value)} placeholder="Interaktive Inhalte..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Hero Bild (optional)</Label>
                <div className="flex gap-2">
                  <Input 
                    value={page.heroImage || ''} 
                    onChange={e => updateBase('heroImage', e.target.value)} 
                    placeholder="Bild-URL oder wähle aus der Bibliothek" 
                    className="flex-1"
                  />
                  <MediaLibrary onSelect={(url) => updateBase('heroImage', url)} />
                </div>
                {page.heroImage && (
                  <div className="mt-2 border rounded-lg overflow-hidden">
                    <img 
                      src={page.heroImage} 
                      alt="Hero preview" 
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23ddd" width="400" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3EBild nicht verfügbar%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projektbeschreibung</CardTitle>
              <CardDescription>HTML erlaubt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Textarea
                value={page.projectDescription}
                onChange={e => updateBase('projectDescription', e.target.value)}
                rows={6}
                placeholder="Langtext zur Seite"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Highlights</CardTitle>
              <CardDescription>Kacheln auf der About-Seite</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {page.highlights.map((item, index) => (
                <div key={index} className="grid grid-cols-[1fr_auto] gap-2 items-start border border-border/50 rounded-lg p-4">
                  <div className="space-y-2">
                    <Label>Titel</Label>
                    <Input value={item.title} onChange={e => updateHighlight(index, 'title', e.target.value)} />
                    <Label>Beschreibung</Label>
                    <Textarea rows={2} value={item.description} onChange={e => updateHighlight(index, 'description', e.target.value)} />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeHighlight(index)} aria-label="Highlight entfernen">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addHighlight} className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Highlight hinzufügen
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Übersetzungen</CardTitle>
              <CardDescription>Optionale Texte für andere Sprachen</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeLang} onValueChange={val => setActiveLang(val as PageLanguage)}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  {translationTabs.map(lang => (
                    <TabsTrigger key={lang} value={lang}>{lang.toUpperCase()}</TabsTrigger>
                  ))}
                </TabsList>

                {translationTabs.map(lang => {
                  const translation = page.translations?.[lang] || { highlights: [emptyHighlight] };
                  return (
                    <TabsContent key={lang} value={lang} className="space-y-6">
                      <div className="space-y-2">
                        <Label>Hero Titel ({lang.toUpperCase()})</Label>
                        <Input
                          value={translation.heroTitle || ''}
                          onChange={e => updateTranslation(lang, data => ({ ...data, heroTitle: e.target.value }))}
                          placeholder="Hero title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hero Untertitel ({lang.toUpperCase()})</Label>
                        <Textarea
                          value={translation.heroSubtitle || ''}
                          onChange={e => updateTranslation(lang, data => ({ ...data, heroSubtitle: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Projektbeschreibung ({lang.toUpperCase()})</Label>
                        <Textarea
                          value={translation.projectDescription || ''}
                          onChange={e => updateTranslation(lang, data => ({ ...data, projectDescription: e.target.value }))}
                          rows={5}
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Highlights</h4>
                          <Button type="button" variant="ghost" size="sm" onClick={() => addTranslationHighlight(lang)}>
                            <Plus className="h-4 w-4 mr-1" /> Hinzufügen
                          </Button>
                        </div>
                        {(translation.highlights || [emptyHighlight]).map((item, index) => (
                          <div key={index} className="grid grid-cols-[1fr_auto] gap-2 items-start border border-border/50 rounded-lg p-3">
                            <div className="space-y-2">
                              <Label>Titel</Label>
                              <Input
                                value={item.title}
                                onChange={e => updateTranslationHighlight(lang, index, 'title', e.target.value)}
                              />
                              <Label>Beschreibung</Label>
                              <Textarea
                                rows={2}
                                value={item.description}
                                onChange={e => updateTranslationHighlight(lang, index, 'description', e.target.value)}
                              />
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeTranslationHighlight(lang, index)} aria-label="Highlight entfernen">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
