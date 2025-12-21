import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';
import { BookMarked, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { fetchWork, saveWork, deleteWork, fetchWorkDetails, saveWorkDetails, deleteWorkDetails } from '@/lib/api';
import { toast } from 'sonner';

export default function WorkEditorPage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();

  const [form, setForm] = useState({
    slug: slug || '',
    author: '',
    title: '',
    year: '',
    summary: '',
    takeaway: '',
    structure: [] as Array<{ title: string; content: string }>,
    translations: {} as any,
  });
  const [loading, setLoading] = useState(false);
  const [activeLang, setActiveLang] = useState<'de' | 'en' | 'la'>('de');
  const [details, setDetails] = useState<any>({ de: {}, en: {}, la: {} });

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      try {
        const data = await fetchWork(slug);
        setForm({
          slug,
          author: data.author || '',
          title: data.title || '',
          year: data.year || '',
          summary: data.summary || '',
          takeaway: data.takeaway || '',
          structure: data.structure || [],
          translations: data.translations || {},
        });
      } catch (e) {
        toast.error('Werk konnte nicht geladen werden');
      }
      try {
        const det = await fetchWorkDetails(slug);
        if (det) setDetails(det);
      } catch {}
    };
    load();
  }, [slug]);

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const onSave = async () => {
    try {
      setLoading(true);
      const payload = { ...form, slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '-') };
      await saveWork(payload);
      toast.success('Werk gespeichert');
      navigate('/admin');
    } catch (e) {
      toast.error('Fehler beim Speichern');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!slug) return;
    if (!window.confirm('Werk wirklich löschen?')) return;
    try {
      setLoading(true);
      await deleteWork(slug);
      toast.success('Werk gelöscht');
      navigate('/admin');
    } catch (e) {
      toast.error('Fehler beim Löschen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 pt-24 sm:pt-28 pb-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <BookMarked className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold">Werke</h1>
        </div>
        <p className="text-muted-foreground">Bearbeite literarische Werke (Titel, Autor, Jahr, Zusammenfassung, Struktur).</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{slug ? 'Werk bearbeiten' : 'Neues Werk'}</CardTitle>
          <CardDescription>Basisdaten und Zusammenfassung</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Slug</label>
              <Input value={form.slug} onChange={e => update('slug', e.target.value)} placeholder="z. B. de-bello-gallico" />
            </div>
            <div>
              <label className="text-sm font-medium">Autor</label>
              <Input value={form.author} onChange={e => update('author', e.target.value)} placeholder="caesar | cicero | augustus | seneca" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Titel</label>
            <Input value={form.title} onChange={e => update('title', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Jahr(e)</label>
              <Input value={form.year} onChange={e => update('year', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Zentrale Aussage</label>
              <Input value={form.takeaway} onChange={e => update('takeaway', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Zusammenfassung</label>
            <Textarea rows={5} value={form.summary} onChange={e => update('summary', e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button onClick={onSave} disabled={loading}>Speichern</Button>
            {slug && (
              <Button variant="destructive" onClick={onDelete} disabled={loading}>
                <Trash2 className="h-4 w-4 mr-2" /> Löschen
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate('/admin')}>Zurück</Button>
          </div>
        </CardContent>
      </Card>

      {/* Details Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Werk-Details</CardTitle>
          <CardDescription>Kontext, Abschnitte, Zitate und Schlüsselmomente</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeLang} onValueChange={(v) => setActiveLang(v as any)}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="de">Deutsch</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="la">Latinum</TabsTrigger>
            </TabsList>

            {(['de','en','la'] as const).map(lang => (
              <TabsContent key={lang} value={lang} className="space-y-6">
                {/* Context */}
                <div className="space-y-2">
                  <Label>Kontext Titel</Label>
                  <Input value={details?.[lang]?.context?.title || ''} onChange={e => {
                    const next = { ...(details?.[lang] || {}) };
                    next.context = { ...(next.context || {}), title: e.target.value };
                    setDetails((prev: any) => ({ ...prev, [lang]: next }));
                  }} />
                </div>
                <div className="space-y-2">
                  <Label>Kontext Absätze</Label>
                  <Textarea rows={5} value={(details?.[lang]?.context?.paragraphs || []).join('\n')} onChange={e => {
                    const next = { ...(details?.[lang] || {}) };
                    next.context = { ...(next.context || {}), paragraphs: e.target.value.split('\n') };
                    setDetails((prev: any) => ({ ...prev, [lang]: next }));
                  }} />
                </div>

                {/* Sections */}
                <div className="space-y-3">
                  <Label>Abschnitte</Label>
                  {Array.isArray(details?.[lang]?.sections) && details[lang].sections.length > 0 ? details[lang].sections.map((sec: any, i: number) => (
                    <div key={i} className="space-y-2 border rounded p-3">
                      <Input value={sec.title || ''} onChange={e => {
                        const arr = [...(details?.[lang]?.sections || [])];
                        arr[i] = { ...arr[i], title: e.target.value };
                        setDetails((prev: any) => ({ ...prev, [lang]: { ...(prev[lang] || {}), sections: arr } }));
                      }} placeholder="Titel" />
                      <Textarea rows={4} value={(sec.content || []).join('\n')} onChange={e => {
                        const arr = [...(details?.[lang]?.sections || [])];
                        arr[i] = { ...arr[i], content: e.target.value.split('\n') };
                        setDetails((prev: any) => ({ ...prev, [lang]: { ...(prev[lang] || {}), sections: arr } }));
                      }} placeholder="Inhalt (Zeilen = Absätze)" />
                    </div>
                  )) : null}
                  <Button variant="outline" size="sm" onClick={() => {
                    const arr = [...(details?.[lang]?.sections || [])];
                    arr.push({ title: '', content: [] });
                    setDetails((prev: any) => ({ ...prev, [lang]: { ...(prev[lang] || {}), sections: arr } }));
                  }}>Abschnitt hinzufügen</Button>
                </div>

                {/* Quotes */}
                <div className="space-y-3">
                  <Label>Zitate</Label>
                  {Array.isArray(details?.[lang]?.quotes) && details[lang].quotes.length > 0 ? details[lang].quotes.map((q: any, i: number) => (
                    <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 border rounded p-3">
                      <Input value={q.latin || ''} onChange={e => {
                        const arr = [...(details?.[lang]?.quotes || [])];
                        arr[i] = { ...arr[i], latin: e.target.value };
                        setDetails((prev: any) => ({ ...prev, [lang]: { ...(prev[lang] || {}), quotes: arr } }));
                      }} placeholder="Lateinisches Zitat" />
                      <Input value={q.translation || ''} onChange={e => {
                        const arr = [...(details?.[lang]?.quotes || [])];
                        arr[i] = { ...arr[i], translation: e.target.value };
                        setDetails((prev: any) => ({ ...prev, [lang]: { ...(prev[lang] || {}), quotes: arr } }));
                      }} placeholder="Übersetzung" />
                      <div className="sm:col-span-2">
                        <Textarea rows={3} value={q.context || ''} onChange={e => {
                          const arr = [...(details?.[lang]?.quotes || [])];
                          arr[i] = { ...arr[i], context: e.target.value };
                          setDetails((prev: any) => ({ ...prev, [lang]: { ...(prev[lang] || {}), quotes: arr } }));
                        }} placeholder="Kontext" />
                      </div>
                    </div>
                  )) : null}
                  <Button variant="outline" size="sm" onClick={() => {
                    const arr = [...(details?.[lang]?.quotes || [])];
                    arr.push({ latin: '', translation: '', context: '' });
                    setDetails((prev: any) => ({ ...prev, [lang]: { ...(prev[lang] || {}), quotes: arr } }));
                  }}>Zitat hinzufügen</Button>
                </div>

                {/* Key Moments */}
                <div className="space-y-3">
                  <Label>Schlüsselmomente</Label>
                  {Array.isArray(details?.[lang]?.keyMoments) && details[lang].keyMoments.length > 0 ? details[lang].keyMoments.map((km: any, i: number) => (
                    <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 border rounded p-3">
                      <Input value={km.date || ''} onChange={e => {
                        const arr = [...(details?.[lang]?.keyMoments || [])];
                        arr[i] = { ...arr[i], date: e.target.value };
                        setDetails((prev: any) => ({ ...prev, [lang]: { ...(prev[lang] || {}), keyMoments: arr } }));
                      }} placeholder="Datum" />
                      <Input value={km.title || ''} onChange={e => {
                        const arr = [...(details?.[lang]?.keyMoments || [])];
                        arr[i] = { ...arr[i], title: e.target.value };
                        setDetails((prev: any) => ({ ...prev, [lang]: { ...(prev[lang] || {}), keyMoments: arr } }));
                      }} placeholder="Titel" />
                      <div className="sm:col-span-2">
                        <Textarea rows={3} value={km.description || ''} onChange={e => {
                          const arr = [...(details?.[lang]?.keyMoments || [])];
                          arr[i] = { ...arr[i], description: e.target.value };
                          setDetails((prev: any) => ({ ...prev, [lang]: { ...(prev[lang] || {}), keyMoments: arr } }));
                        }} placeholder="Beschreibung" />
                      </div>
                      <div className="sm:col-span-2">
                        <Textarea rows={2} value={km.significance || ''} onChange={e => {
                          const arr = [...(details?.[lang]?.keyMoments || [])];
                          arr[i] = { ...arr[i], significance: e.target.value };
                          setDetails((prev: any) => ({ ...prev, [lang]: { ...(prev[lang] || {}), keyMoments: arr } }));
                        }} placeholder="Bedeutung" />
                      </div>
                    </div>
                  )) : null}
                  <Button variant="outline" size="sm" onClick={() => {
                    const arr = [...(details?.[lang]?.keyMoments || [])];
                    arr.push({ date: '', title: '', description: '', significance: '' });
                    setDetails((prev: any) => ({ ...prev, [lang]: { ...(prev[lang] || {}), keyMoments: arr } }));
                  }}>Moment hinzufügen</Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex gap-2 mt-4">
            <Button onClick={async () => { setLoading(true); try { await saveWorkDetails(form.slug, details); toast.success('Werk-Details gespeichert'); } catch { toast.error('Details speichern fehlgeschlagen'); } finally { setLoading(false); }}}>Details speichern</Button>
            <Button variant="outline" className="text-destructive" onClick={async () => { if (!window.confirm('Werk-Details wirklich löschen?')) return; setLoading(true); try { await deleteWorkDetails(form.slug); toast.success('Werk-Details gelöscht'); setDetails({ de: {}, en: {}, la: {} }); } catch { toast.error('Details löschen fehlgeschlagen'); } finally { setLoading(false); }}}>Details löschen</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Additional code for language-tabbed details editor would go here
