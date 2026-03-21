import { useEffect } from 'react';
import { Shield, Code2, Database, Bot, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Endpoint = {
  method: string;
  path: string;
  title: string;
  description: string;
  params?: Array<{ name: string; description: string }>;
  response?: string;
  notes?: string[];
};

const BASE_URL = 'https://meum-diarium.xn--schchner-2za.de';

const contentEndpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/catalog',
    title: 'Katalog',
    description: 'Übersicht über verfügbare Inhalte (Posts, Lexikon, Werke, Autoren).',
    response: '{ timestamp, counts, available_authors }',
  },
  {
    method: 'GET, POST, PUT, DELETE',
    path: '/api/posts',
    title: 'Beiträge',
    description: 'Beiträge listen/erstellen/aktualisieren/löschen.',
    params: [
      { name: 'slug', description: 'Optional: einzelner Beitrag.' },
      { name: 'tag', description: 'Optional: Tag-Filter für Listenansicht.' },
    ],
    response: 'Post[] | Post',
  },
  {
    method: 'GET, PUT, DELETE',
    path: '/api/posts/{author}/{slug}',
    title: 'Beitrag über Autor+Slug',
    description: 'Direkter Zugriff auf einen konkreten Beitrag inkl. Update/Delete.',
    response: 'Post',
    notes: ['Author-Slug wird serverseitig geprüft.'],
  },
  {
    method: 'GET, POST, PUT, DELETE',
    path: '/api/lexicon',
    title: 'Lexikon',
    description: 'Lexikoneinträge listen und verwalten.',
    params: [
      { name: 'slug', description: 'Optional: einzelner Eintrag.' },
      { name: 'search', description: 'Optional: Suche über term/definition.' },
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
    description: 'Liefert strukturierten JSON-Content für über-Seiten und ähnliche Inhalte.',
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
    description: 'Form-spezifische Abfrage für eine Vokabel.',
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
    title: 'Tags',
    description: 'Alle verwendeten Tags aus Beiträgen.',
    response: 'string[]',
  },
];

const aiEndpoints: Endpoint[] = [
  {
    method: 'GET, POST',
    path: '/api/ask',
    title: 'Persona-Chat',
    description: 'Proxy-Endpoint für historische Persona-Antworten.',
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
    title: 'Begriffserklärung',
    description: 'Kurz-Erklärungen zu Begriffen mit optionalem Kontext.',
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
    description: 'Aggregierte Kennzahlen über Inhalte und Tags.',
    response: '{ posts, authors, tags, totalReadingTime, ... }',
  },
  {
    method: 'GET',
    path: '/api/health',
    title: 'Health',
    description: 'Service- und Binding-Status für Monitoring.',
    response: '{ status, message, environment, timestamp }',
  },
  {
    method: 'GET',
    path: '/api/dashboard/stats',
    title: 'Dashboard-Stats',
    description: 'Nutzer-/Kommentarstatistik für Dashboard (auth-gebunden).',
    response: 'DashboardStats',
  },
  {
    method: 'GET, POST',
    path: '/api/reading-progress',
    title: 'Lese-Fortschritt',
    description: 'User-spezifischer Fortschritt pro Beitrag.',
    notes: ['Erfordert X-User-ID Header.'],
    response: '{ readingProgress, totalReadingTime, ... }',
  },
  {
    method: 'GET, POST, PUT, DELETE',
    path: '/api/profile',
    title: 'Profil',
    description: 'Profilverwaltung über Bearer-Token.',
    notes: ['Authorization: Bearer <token> erforderlich.'],
    response: 'UserProfile',
  },
  {
    method: 'GET',
    path: '/api/debug, /api/debug-bindings',
    title: 'Debug-Endpunkte',
    description: 'Diagnoseinformationen für Entwicklung/Deployment.',
    notes: ['Nicht für produktive Client-Nutzung vorgesehen.'],
  },
];

const EndpointSection = ({ title, icon: Icon, endpoints }: { title: string; icon: React.ElementType; endpoints: Endpoint[] }) => (
  <section className="space-y-6">
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-primary" />
      <h2 className="font-display text-3xl font-bold">{title}</h2>
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
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Response</p>
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
  useEffect(() => {
    document.title = 'Meum Diarium API | Dokumentation';
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-14">
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase tracking-[0.2em] font-bold">
            API v1
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight">Meum Diarium API</h1>
          <p className="text-muted-foreground max-w-3xl text-lg leading-relaxed">
            Vollständige, aktualisierte Dokumentation der öffentlich verfügbaren Endpunkte inklusive Lern- und KI-APIs.
            Diese Seite orientiert sich am aktuellen Implementierungsstand der Cloudflare Pages Functions.
          </p>

          <Card className="card-modern border-primary/20 bg-primary/5">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Code2 className="h-4 w-4" />
                <p className="text-xs uppercase tracking-[0.2em] font-semibold">Basis-URL</p>
              </div>
              <code className="text-sm bg-background/80 px-2 py-1 rounded border border-border/50">{BASE_URL}</code>
              <p className="text-sm text-muted-foreground">Beispiel: <span className="font-mono">curl "{BASE_URL}/api/catalog"</span></p>
            </CardContent>
          </Card>
        </header>

        <section className="grid md:grid-cols-2 gap-4">
          <Card className="card-modern border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3 text-primary"><Shield className="h-4 w-4" /><p className="text-xs uppercase tracking-[0.2em] font-semibold">Sicherheit</p></div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Input-Validierung auf AI-Proxy-Endpunkten (Längen, Allowlists, URL-Prüfung).</li>
                <li>CORS auf allen öffentlichen API-Endpunkten aktiv.</li>
                <li>DB-Binding-Checks mit 503 bei fehlender Konfiguration.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="card-modern border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3 text-primary"><AlertTriangle className="h-4 w-4" /><p className="text-xs uppercase tracking-[0.2em] font-semibold">Fehlerformat</p></div>
              <p className="text-sm text-muted-foreground mb-2">Fehlerantworten folgen i. d. R.:</p>
              <code className="text-sm bg-secondary px-2 py-1 rounded">{`{ "error": string, "message"?: string }`}</code>
              <p className="text-sm text-muted-foreground mt-2">Typische Statuscodes: 400, 401/403, 404, 405, 500, 502, 503.</p>
            </CardContent>
          </Card>

          <Card className="card-modern border-border/50 md:col-span-2">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3 text-primary"><CheckCircle2 className="h-4 w-4" /><p className="text-xs uppercase tracking-[0.2em] font-semibold">Hinweis zu Auth</p></div>
              <p className="text-sm text-muted-foreground">
                Nicht alle Endpunkte sind public-readonly. Besonders <span className="font-mono">/api/profile</span>, <span className="font-mono">/api/dashboard/stats</span> und <span className="font-mono">/api/reading-progress</span>
                erwarten Header-basierte Nutzeridentifikation bzw. Token.
              </p>
            </CardContent>
          </Card>
        </section>

        <EndpointSection title="Content APIs" icon={Database} endpoints={contentEndpoints} />
        <EndpointSection title="Lern- und Discovery APIs" icon={Activity} endpoints={learningEndpoints} />
        <EndpointSection title="KI- und Sprach-APIs" icon={Bot} endpoints={aiEndpoints} />
        <EndpointSection title="System und Monitoring" icon={Shield} endpoints={systemEndpoints} />
      </div>
    </div>
  );
}
