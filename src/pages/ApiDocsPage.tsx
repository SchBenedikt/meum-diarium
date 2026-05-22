import { useEffect, useMemo, useState } from 'react';
import { Shield, Code2, Database, Bot, Activity, AlertTriangle, Search, BookOpen, Zap, Beaker, Puzzle, Lightbulb, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

type Endpoint = {
  method: string;
  path: string;
  title: string;
  description: string;
  params?: Array<{ name: string; description: string }>;
  response?: string;
  notes?: string[];
};

type EndpointGroup = {
  id: 'content' | 'learning' | 'ai' | 'system';
  title: string;
  icon: React.ElementType;
  endpoints: Endpoint[];
};

type TabId = 'intro' | 'basis' | 'content' | 'learning' | 'ai' | 'system';

const BASE_URL = 'https://meum-diarium.xn--schchner-2za.de';

const contentEndpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/catalog',
    title: 'Katalog',
    description: 'Uebersicht ueber verfuegbare Inhalte (Posts, Lexikon, Werke, Autoren).',
    response: '{ timestamp, counts, available_authors }',
  },
  {
    method: 'GET, POST, PUT, DELETE',
    path: '/api/posts',
    title: 'Beitraege',
    description: 'Beitraege listen/erstellen/aktualisieren/loeschen.',
    params: [
      { name: 'slug', description: 'Optional: einzelner Beitrag.' },
      { name: 'tag', description: 'Optional: Tag-Filter fuer Listenansicht.' },
    ],
    response: 'Post[] | Post',
  },
  {
    method: 'GET, PUT, DELETE',
    path: '/api/posts/{author}/{slug}',
    title: 'Beitrag ueber Autor+Slug',
    description: 'Direkter Zugriff auf einen konkreten Beitrag inkl. Update/Delete.',
    response: 'Post',
    notes: ['Author-Slug wird serverseitig geprueft.'],
  },
  {
    method: 'GET, POST, PUT, DELETE',
    path: '/api/lexicon',
    title: 'Lexikon',
    description: 'Lexikoneintraege listen und verwalten.',
    params: [
      { name: 'slug', description: 'Optional: einzelner Eintrag.' },
      { name: 'search', description: 'Optional: Suche ueber term/definition.' },
      { name: 'limit', description: 'Optional: Begrenzung der Ergebniszahl.' },
    ],
    response: 'LexiconEntry[] | LexiconEntry',
  },
  {
    method: 'GET, POST, PUT, DELETE',
    path: '/api/authors',
    title: 'Autoren',
    description: 'Autorendaten abrufen und pflegen.',
    params: [{ name: 'id', description: 'Optional: einzelner Autor.' }],
    response: 'Author[] | Author',
  },
  {
    method: 'GET, POST, PUT, DELETE',
    path: '/api/works',
    title: 'Werke',
    description: 'Werke abrufen und verwalten.',
    params: [{ name: 'slug', description: 'Optional: einzelnes Werk.' }],
    response: 'Work[] | Work',
  },
  {
    method: 'GET',
    path: '/api/pages/{slug}',
    title: 'Seiten-Content',
    description: 'Liefert strukturierten JSON-Content fuer ueber-Seiten und aehnliche Inhalte.',
    response: 'Page JSON',
  },
];

const learningEndpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/vocab',
    title: 'Vokabelsuche',
    description: 'Suche in lateinischen/deutschen Vokabeldaten.',
    params: [
      { name: 'q', description: 'Suchbegriff.' },
      { name: 'limit', description: 'Standard 50.' },
      { name: 'offset', description: 'Pagination-Offset.' },
    ],
    response: '{ results, count, limit, offset, source }',
  },
  {
    method: 'GET',
    path: '/api/vocab/all',
    title: 'Vokabel-Export (erweitert)',
    description: 'Erweiterte Datenausgabe inkl. Formen/Grammatik, paginierbar.',
    params: [
      { name: 'limit', description: 'Standard 100.' },
      { name: 'offset', description: 'Pagination-Offset.' },
      { name: 'includeForms', description: 'true/false, Standard true.' },
    ],
    response: 'VocabEntry[]',
  },
  {
    method: 'GET',
    path: '/api/vocab/{vokId}',
    title: 'Vokabeldetails',
    description: 'Vokabel inkl. Formen, Grammatik-Metadaten und Zusatzinfos.',
    response: 'VocabEntryDetail',
  },
  {
    method: 'GET',
    path: '/api/vocab/{vokId}/form/{form}',
    title: 'Konkrete Form',
    description: 'Form-spezifische Abfrage fuer eine Vokabel.',
    response: '{ success, data }',
  },
  {
    method: 'GET',
    path: '/api/latin-texts',
    title: 'Lateintexte',
    description: 'Texteinheiten nach Werk/Buch/Kapitel.',
    params: [
      { name: 'workId', description: 'Erforderlich.' },
      { name: 'book', description: 'Erforderlich.' },
      { name: 'chapter', description: 'Optional.' },
    ],
    response: 'LatinTextSegment[]',
  },
  {
    method: 'GET',
    path: '/api/tags',
    title: 'Schlagwörter',
    description: 'Alle verwendeten Schlagwörter aus Beiträgen.',
    response: 'string[]',
  },
];

const aiEndpoints: Endpoint[] = [
  {
    method: 'GET, POST',
    path: '/api/ask',
    title: 'Persona-Chat',
    description: 'Proxy-Endpoint fuer historische Persona-Antworten inkl. Ressourcen.',
    params: [
      { name: 'persona', description: 'caesar | cicero | augustus | seneca | catilina' },
      { name: 'ask', description: 'Erforderlich, max. 800 Zeichen.' },
      { name: 'history', description: 'Optional, max. 20 Nachrichten.' },
      { name: 'sitemap', description: 'Optional, valide http(s)-URL.' },
    ],
    response: '{ response, resources?, format }',
    notes: ['Anfragen werden validiert, dann an den AI-Upstream weitergeleitet.'],
  },
  {
    method: 'GET, POST',
    path: '/api/explain',
    title: 'Begriffserklaerung',
    description: 'Kurz-Erklaerungen zu Begriffen mit optionalem Kontext.',
    params: [
      { name: 'term', description: 'Erforderlich, max. 120 Zeichen.' },
      { name: 'question', description: 'Optional, max. 500 Zeichen.' },
      { name: 'history', description: 'Optional, max. 20 Nachrichten.' },
    ],
    response: '{ term, response, format }',
  },
  {
    method: 'POST',
    path: '/api/simulate',
    title: 'Simulation',
    description: 'Interaktive Szenarien mit Entscheidungsfolgen.',
    params: [
      { name: 'persona', description: 'Erforderlich, allowlist-validiert.' },
      { name: 'scenario', description: 'Erforderlich, max. 500 Zeichen.' },
      { name: 'choice', description: 'Optional, max. 300 Zeichen.' },
      { name: 'history', description: 'Optional, max. 20 Nachrichten.' },
    ],
    response: '{ narrative, stats, options, ended }',
  },
];

const systemEndpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/stats',
    title: 'Statistiken',
    description: 'Aggregierte Kennzahlen ueber Inhalte und Tags.',
    response: '{ posts, authors, tags, totalReadingTime, ... }',
  },
  {
    method: 'GET',
    path: '/api/health',
    title: 'Gesundheit',
    description: 'Service- und Binding-Status für Überwachung.',
    response: '{ status, message, environment, timestamp }',
  },
  {
    method: 'GET, POST',
    path: '/api/reading-progress',
    title: 'Lese-Fortschritt',
    description: 'User-spezifischer Fortschritt pro Beitrag.',
    notes: ['Erfordert X-User-ID Header.'],
    response: '{ readingProgress, totalReadingTime, ... }',
  },
];

const useCases = [
  {
    icon: BookOpen,
    label: 'BILDUNG & LEHRE',
    title: 'Entwickle interaktive Lernplattformen',
    description: 'Nutze unsere kuratierten Inhalte und historischen Quellen um eigene Lehrinhalte und Lernplattformen zu erstellen.',
  },
  {
    icon: Zap,
    label: 'DATENANALYSE',
    title: 'Quantitative Analysen römischer Geschichte',
    description: 'Nutze den gesamten Katalog für quantitative Analysen römischer Geschichte oder für Natural Language Processing.',
  },
  {
    icon: Beaker,
    label: 'FORSCHUNGSTOOLS',
    title: 'Integriere historische Fakten in deine Forschung',
    description: 'Integriere historische Fakten und Glossareinträge direkt in wissenschaftliche Anwendungen oder Zitationssysteme.',
  },
  {
    icon: Puzzle,
    label: 'INTEGRATIONEN',
    title: 'Baue Browser-Extensions oder Mobile Apps',
    description: 'Baue Browser-Extensions oder Mobile Apps, die unseren "Sententia Diei" oder die Timeline als Widget anzeigen.',
  },
  {
    icon: Lightbulb,
    label: 'KI-EXPERIMENTE',
    title: 'Nutze die Persona-Endpunkte für AI-Chatbots',
    description: 'Nutze die Persona-Schnittstellen um eigene Chat-Bots oder Rollenspiel-Szenarien mit antiken Charakteren zu gestalten.',
  },
  {
    icon: Globe,
    label: 'OPEN SCIENCE',
    title: 'Trage zu offener Wissenschaft bei',
    description: 'Alle öffentlich zugänglichen Daten fördern das Open Science Prinzip – freier Zugang zu Wissen für eine informierte Gesellschaft.',
  },
];

const endpointGroups: EndpointGroup[] = [
  { id: 'content', title: 'Inhalts-APIs', icon: Database, endpoints: contentEndpoints },
  { id: 'learning', title: 'Lern- und Entdeckungs-APIs', icon: Activity, endpoints: learningEndpoints },
  { id: 'ai', title: 'KI- und Sprach-APIs', icon: Bot, endpoints: aiEndpoints },
  { id: 'system', title: 'System und Überwachung', icon: Shield, endpoints: systemEndpoints },
];

const EndpointSection = ({ title, icon: Icon, endpoints }: { title: string; icon: React.ElementType; endpoints: Endpoint[] }) => (
  <section className="space-y-6">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="font-display text-3xl font-bold">{title}</h2>
      </div>
      <Badge variant="outline" className="font-mono">{endpoints.length} Endpunkte</Badge>
    </div>

    <div className="grid gap-4">
      {endpoints.map((endpoint) => (
        <Card key={`${endpoint.method}-${endpoint.path}`} className="card-modern border-border/50">
          <CardContent className="p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="font-mono">{endpoint.method}</Badge>
              <code className="text-primary text-sm font-mono">{endpoint.path}</code>
            </div>

            <div>
              <h3 className="font-semibold text-lg">{endpoint.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{endpoint.description}</p>
            </div>

            {endpoint.params && endpoint.params.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Parameter</p>
                <div className="grid gap-1.5">
                  {endpoint.params.map((param) => (
                    <p key={param.name} className="text-sm">
                      <span className="font-mono text-primary">{param.name}</span>
                      <span className="text-muted-foreground"> - {param.description}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            {endpoint.response && (
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Antwort</p>
                <code className="text-sm bg-secondary px-2 py-1 rounded">{endpoint.response}</code>
              </div>
            )}

            {endpoint.notes && endpoint.notes.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Hinweise</p>
                <ul className="space-y-1">
                  {endpoint.notes.map((note) => (
                    <li key={note} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);

export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('intro');
  const [query, setQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<'all' | EndpointGroup['id']>('all');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint: string) => {
    setLoading(true);
    setApiResponse(null);
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      setApiResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Meum Diarium API | Dokumentation';
  }, []);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();

    return endpointGroups
      .filter((group) => activeGroup === 'all' || group.id === activeGroup)
      .map((group) => ({
        ...group,
        endpoints: group.endpoints.filter((endpoint) => {
          if (!q) return true;
          const haystack = [
            endpoint.title,
            endpoint.path,
            endpoint.description,
            endpoint.method,
            ...(endpoint.params?.map((p) => `${p.name} ${p.description}`) || []),
            ...(endpoint.notes || []),
          ]
            .join(' ')
            .toLowerCase();
          return haystack.includes(q);
        }),
      }))
      .filter((group) => group.endpoints.length > 0);
  }, [activeGroup, query]);

  const totalVisible = filteredGroups.reduce((acc, group) => acc + group.endpoints.length, 0);

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: 'intro', label: 'Was ist eine API?' },
    { id: 'basis', label: 'Basis' },
    { id: 'content', label: 'Inhalte' },
    { id: 'learning', label: 'Entdecken' },
    { id: 'ai', label: 'KI' },
    { id: 'system', label: 'System' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-14">
        {/* Header */}
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase tracking-[0.2em] font-bold">
            API DOKUMENTATION
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight">Meum Diarium API</h1>
          <p className="text-muted-foreground max-w-3xl text-lg leading-relaxed">
            Vollständige Dokumentation aller Content- und KI-Endpunkte mit interaktiven Testfunktionen. Direkter Zugriff auf unsere Wissensdatenbank für Entwickler und Forscher.
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl">
            Hinweis: Alle öffentlich zugänglichen Beiträge und Katalogeinträge werden ausschließlich auf Deutsch bereitgestellt. Die API liefert daher deutschen Content (Titel, Auszüge und Textabschnitte).
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* INTRO TAB */}
        {activeTab === 'intro' && (
          <div className="space-y-10">
            <h2 className="font-display text-3xl font-bold">API Guide</h2>

            {/* Two Main Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="card-modern border-border/50 bg-gradient-to-br from-card to-card/80">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Code2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Was ist eine API?</h3>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        Eine <strong>API (Application Programming Interface)</strong> fungiert als digitaler Dolmetscher zwischen Anwendungen. Sie ermöglicht externen Programmen, direkt auf die Wissensdatenbank von Meum Diarium zuzugreifen und strukturierte Daten (JSON) zu erhalten.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-modern border-border/50 bg-gradient-to-br from-card to-card/80">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Warum Meum Diarium API?</h3>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        Wir glauben an die Demokratisierung von historischem Wissen. Unsere API macht wissenschaftliche Inhalte, historische Quellen und KI-Simulationen für alle zugänglich – für Bildung, Forschung und innovative Anwendungen.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Use Cases Grid */}
            <div className="space-y-4">
              <h3 className="font-display text-2xl font-bold">Was kannst du damit machen?</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {useCases.map((useCase) => {
                  const Icon = useCase.icon;
                  return (
                    <Card key={useCase.label} className="card-modern border-border/50 bg-gradient-to-br from-card to-card/80 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-primary/10">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">{useCase.label}</p>
                        </div>
                        <h4 className="font-semibold text-sm">{useCase.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{useCase.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Basis URL */}
            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold">Basis-URL</h3>
              <Card className="card-modern border-border/50">
                <CardContent className="p-5 space-y-3">
                  <p className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground">PAGES</p>
                  <code className="text-sm text-primary font-mono">{BASE_URL}</code>
                  <p className="text-sm text-muted-foreground">Statische Content-API plus KI-Proxy unter derselben Domain. /api liefert diese Dokumentation.</p>
                </CardContent>
              </Card>
            </div>

            {/* Quickstart */}
            <div className="space-y-4">
              <h3 className="font-display text-xl font-bold">API interaktiv testen</h3>
              <p className="text-sm text-muted-foreground">Teste unsere API direkt hier im Browser. Wähle einen Endpunkt und klicke auf "Testen":</p>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => testEndpoint('/api/catalog')}
                    disabled={loading}
                    className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '⏳ Lade...' : '📋 Katalog testen'}
                  </button>
                  <button
                    onClick={() => testEndpoint('/api/vocab?q=roma')}
                    disabled={loading}
                    className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '⏳ Lade...' : '🔍 Vokabeln testen'}
                  </button>
                  <button
                    onClick={() => testEndpoint('/api/stats')}
                    disabled={loading}
                    className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? '⏳ Lade...' : '📊 Statistiken testen'}
                  </button>
                </div>
                
                {apiResponse && (
                  <Card className="card-modern border-border/50">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">API Antwort</h4>
                        <button
                          onClick={() => setApiResponse(null)}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          ✕ Schließen
                        </button>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <pre className="text-xs overflow-x-auto whitespace-pre-wrap font-mono">
                          {JSON.stringify(apiResponse, null, 2)}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* BASIS TAB */}
        {activeTab === 'basis' && (
          <div className="space-y-10">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="card-modern border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3 text-primary">
                    <Shield className="h-4 w-4" />
                    <p className="text-xs uppercase tracking-[0.2em] font-semibold">Sicherheit</p>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Input-Validierung auf AI-Proxy-Endpunkten (Laengen, Allowlists, URL-Pruefung).</li>
                    <li>CORS auf allen oeffentlichen API-Endpunkten aktiv.</li>
                    <li>Bei fehlenden Bindings (z. B. D1/AI) liefern Endpunkte explizite Fehlercodes.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="card-modern border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3 text-primary">
                    <AlertTriangle className="h-4 w-4" />
                    <p className="text-xs uppercase tracking-[0.2em] font-semibold">Fehlerformat</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Fehlerantworten folgen i. d. R.:</p>
                  <code className="text-sm bg-secondary px-2 py-1 rounded">{`{ "error": string }`}</code>
                  <p className="text-sm text-muted-foreground mt-2">Statuscodes: 400, 404, 405, 500, 502, 503.</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold">Basis-Endpunkte</h3>
              <EndpointSection title="Übersicht" icon={Database} endpoints={[
                {
                  method: 'GET',
                  path: '/api/catalog',
                  title: 'Katalog abrufen',
                  description: 'Überblick über alle verfügbaren Inhalte: Posts, Lexikon, Werke, Autoren.',
                  response: '{ counts, available_authors, timestamp }',
                },
              ]} />
            </div>
          </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === 'content' && (
          <div className="space-y-10">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Suche in Inhalts-APIs..."
              className="w-full px-4 py-2 border border-border/50 rounded-lg bg-card text-foreground text-sm"
            />
            <EndpointSection title="Inhalts-APIs" icon={Database} endpoints={contentEndpoints} />
          </div>
        )}

        {/* LEARNING/DISCOVERY TAB */}
        {activeTab === 'learning' && (
          <div className="space-y-10">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Suche in Entdeckungs-APIs..."
              className="w-full px-4 py-2 border border-border/50 rounded-lg bg-card text-foreground text-sm"
            />
            <EndpointSection title="Lern- und Entdeckungs-APIs" icon={Activity} endpoints={learningEndpoints} />
          </div>
        )}

        {/* KI TAB */}
        {activeTab === 'ai' && (
          <div className="space-y-10">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Suche in KI-APIs..."
              className="w-full px-4 py-2 border border-border/50 rounded-lg bg-card text-foreground text-sm"
            />
            <EndpointSection title="KI- und Sprach-APIs" icon={Bot} endpoints={aiEndpoints} />
          </div>
        )}

        {/* SYSTEM TAB */}
        {activeTab === 'system' && (
          <div className="space-y-10">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Suche in System-APIs..."
              className="w-full px-4 py-2 border border-border/50 rounded-lg bg-card text-foreground text-sm"
            />
            <EndpointSection title="System und Überwachung" icon={Shield} endpoints={systemEndpoints} />
          </div>
        )}
      </div>
    </div>
  );
}
