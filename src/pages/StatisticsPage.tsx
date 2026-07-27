import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import { BarChart3, ArrowLeft, FileText, Route, ScrollText, Code2, Users, Hash, Clock3, BookText, Layers, Activity } from 'lucide-react';

type ApiStats = {
  posts: number;
  authors: number;
  tags: number;
  totalReadingTime: number;
  averageReadingTime: number;
  postsByAuthor: Record<string, number>;
  topTags: { tag: string; count: number }[];
  images: {
    total: number;
    totalBytes: number;
    totalMB: number;
  };
  generatedAt: string;
};

type WorkEntry = {
  id: string;
  title: string;
  author?: string;
};

type LexiconEntry = {
  slug: string;
  term: string;
  category?: string;
};

type CategoryBucket = {
  category: string;
  count: number;
};

const AUTHORS = [
  { id: 'caesar', name: 'Caesar', color: '#DC2626' },
  { id: 'augustus', name: 'Augustus', color: '#2563EB' },
  { id: 'cicero', name: 'Cicero', color: '#D97706' },
  { id: 'catilina', name: 'Catilina', color: '#7C3AED' },
  { id: 'sallust', name: 'Sallust', color: '#059669' },
  { id: 'seneca', name: 'Seneca', color: '#0891B2' },
  { id: 'sokrates', name: 'Sokrates', color: '#BE123C' },
];

export default function StatisticsPage() {
  const [apiStats, setApiStats] = useState<ApiStats | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [worksCount, setWorksCount] = useState<number | null>(null);
  const [lexiconCount, setLexiconCount] = useState<number | null>(null);
  const [categoryCount, setCategoryCount] = useState<number | null>(null);
  const [topCategories, setTopCategories] = useState<CategoryBucket[]>([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [statsResponse, worksResponse, lexiconResponse] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/works'),
          fetch('/api/lexicon?limit=5000'),
        ]);

        if (!statsResponse.ok) throw new Error('Stats API nicht erreichbar');

        const data = (await statsResponse.json()) as ApiStats;
        const worksData = worksResponse.ok ? ((await worksResponse.json()) as WorkEntry[]) : [];
        const lexiconData = lexiconResponse.ok ? ((await lexiconResponse.json()) as LexiconEntry[]) : [];

        const categories = new Set(
          lexiconData
            .map((entry) => (entry.category || '').trim())
            .filter((category) => category.length > 0),
        );

        const categoryMap: Record<string, number> = {};
        lexiconData.forEach((entry) => {
          const key = (entry.category || '').trim();
          if (!key) return;
          categoryMap[key] = (categoryMap[key] || 0) + 1;
        });
        const sortedCategories = Object.entries(categoryMap)
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        if (active) setApiStats(data);
        if (active) setWorksCount(worksData.length);
        if (active) setLexiconCount(lexiconData.length);
        if (active) setCategoryCount(categories.size);
        if (active) setTopCategories(sortedCategories);
      } catch (error) {
        if (!active) return;
        const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
        setApiError(message);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const topCards = useMemo(
    () => [
      { label: 'Beiträge', value: apiStats?.posts ?? '—', icon: ScrollText },
      { label: 'Autoren', value: apiStats?.authors ?? '—', icon: Users },
      { label: 'Codezeilen', value: apiStats ? '52.946' : '—', icon: Code2 },
    ],
    [apiStats],
  );

  const sortedAuthors = useMemo(() => {
    if (!apiStats?.postsByAuthor) return [];
    return Object.entries(apiStats.postsByAuthor)
      .map(([id, count]) => {
        const author = AUTHORS.find(a => a.id === id);
        return { id, count, name: author?.name ?? id, color: author?.color ?? '#666' };
      })
      .sort((a, b) => b.count - a.count);
  }, [apiStats]);

  const maxPostCount = useMemo(
    () => Math.max(...sortedAuthors.map(a => a.count), 1),
    [sortedAuthors],
  );

  const generatedDate = useMemo(() => {
    if (!apiStats?.generatedAt) return null;
    return new Date(apiStats.generatedAt).toLocaleDateString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }, [apiStats]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Statistik - Meum Diarium"
        description="Kennzahlen zu Inhalten, Bildern, Routen und Codeumfang von Meum Diarium."
        type="website"
      />

      <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
              <div className="w-8 h-[1px] bg-primary/30" />
              KENNZAHLEN
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
              Projekt <span className="text-primary italic">Statistik</span>
            </h1>
            <p className="text-muted-foreground/70 max-w-2xl text-lg leading-relaxed">
              Umfang, Inhalte und technische Kennzahlen der Anwendung.
            </p>
          </motion.div>

          <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors pr-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Zurück zum Start
          </Link>
        </div>

        <section className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
          {topCards.map((card) => (
            <Card key={card.label} className="card-modern border-border/50">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center gap-2 text-primary mb-3">
                  <card.icon className="h-4 w-4" />
                  <p className="text-[10px] uppercase tracking-[0.18em] font-semibold">{card.label}</p>
                </div>
                <p className="font-display text-3xl sm:text-4xl font-bold">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid lg:grid-cols-12 gap-6 mb-10">
          <Card className="lg:col-span-7 card-modern border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-2xl">
                <BarChart3 className="h-5 w-5 text-primary" /> Inhalt & Nutzung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {apiError ? (
                <p className="text-sm text-destructive">{apiError}</p>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">Einträge gesamt</p>
                      <p className="text-2xl font-bold">
                        {(
                          (apiStats?.posts || 0) +
                          (worksCount || 0) +
                          (lexiconCount || 0)
                        ).toLocaleString('de-DE')}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">Autoren</p>
                      <p className="text-2xl font-bold">{apiStats?.authors ?? '—'}</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">Werke</p>
                      <p className="text-2xl font-bold">{worksCount ?? '—'}</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">Lexikon-Artikel</p>
                      <p className="text-2xl font-bold">{lexiconCount ?? '—'}</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">Schlagwörter</p>
                      <p className="text-2xl font-bold">{apiStats?.tags ?? '—'}</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">Kategorien</p>
                      <p className="text-2xl font-bold">{categoryCount ?? '—'}</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">Gesamte Lesezeit</p>
                      <p className="text-2xl font-bold">{apiStats?.totalReadingTime ?? '—'} Min</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">Durchschnitt</p>
                      <p className="text-2xl font-bold">{apiStats?.averageReadingTime ?? '—'} Min</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-5 card-modern border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-2xl">
                <Layers className="h-5 w-5 text-primary" /> Beiträge pro Autor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sortedAuthors.length === 0 ? (
                <p className="text-sm text-muted-foreground">Keine Daten verfügbar.</p>
              ) : (
                sortedAuthors.map((author) => {
                  const widthPercent = Math.max(6, Math.round((author.count / maxPostCount) * 100));
                  return (
                    <div key={author.id} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{author.name}</span>
                        <span className="text-muted-foreground">{author.count}</span>
                      </div>
                      <div className="h-3 rounded-full bg-secondary/50 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${widthPercent}%`, backgroundColor: author.color }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid lg:grid-cols-12 gap-6 mb-10">
          <Card className="lg:col-span-12 card-modern border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-2xl">
                <Activity className="h-5 w-5 text-primary" /> Technische Kennzahlen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
                <span className="text-muted-foreground inline-flex items-center gap-2"><FileText className="h-4 w-4" /> src-Dateien</span>
                <strong>285</strong>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
                <span className="text-muted-foreground inline-flex items-center gap-2"><Hash className="h-4 w-4" /> Routes</span>
                <strong>84</strong>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
                <span className="text-muted-foreground inline-flex items-center gap-2"><Route className="h-4 w-4" /> Server-Dateien</span>
                <strong>5</strong>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
                <span className="text-muted-foreground inline-flex items-center gap-2"><Code2 className="h-4 w-4" /> Cloudflare Functions</span>
                <strong>39</strong>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
                <span className="text-muted-foreground inline-flex items-center gap-2"><BookText className="h-4 w-4" /> Gesamt-Codezeilen</span>
                <strong>52.946</strong>
              </div>
              {generatedDate && (
                <p className="text-xs text-muted-foreground pt-1 inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" /> Datenstand: {generatedDate}
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid lg:grid-cols-12 gap-6 mb-10">
          <Card className="lg:col-span-6 card-modern border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-2xl">
                <Hash className="h-5 w-5 text-primary" /> Top Kategorien (Lexikon)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topCategories.length === 0 ? (
                <p className="text-sm text-muted-foreground">Keine Kategoriedaten verfügbar.</p>
              ) : (
                <div className="space-y-3">
                  {topCategories.map((bucket) => {
                    const max = topCategories[0]?.count || 1;
                    const widthPercent = Math.max(8, Math.round((bucket.count / max) * 100));
                    return (
                      <div key={bucket.category} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{bucket.category}</span>
                          <span className="text-muted-foreground">{bucket.count}</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-secondary/50 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary/70"
                            style={{ width: `${widthPercent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-6 card-modern border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display text-2xl">
                <ScrollText className="h-5 w-5 text-primary" /> Top Schlagwörter
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!apiStats?.topTags || apiStats.topTags.length === 0 ? (
                <p className="text-sm text-muted-foreground">Keine Tag-Daten verfügbar.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {apiStats.topTags.map((t) => (
                    <span
                      key={t.tag}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-secondary/30 px-3 py-1.5 text-sm"
                    >
                      <Hash className="h-3 w-3 text-muted-foreground" />
                      {t.tag}
                      <span className="text-xs text-muted-foreground font-mono ml-1">({t.count})</span>
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section>
          <Card className="card-modern border-border/50">
            <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-1">Mehr Kontext</p>
                <p className="text-sm text-muted-foreground">API-Endpunkte und Datenquellen findest du in der API-Dokumentation.</p>
              </div>
              <Link to="/api">
                <Button variant="outline" className="rounded-full">Zur API-Doku</Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
