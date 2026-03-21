import { useEffect, useMemo, useState } from 'react';
import { Shield, Code2, Database, Bot, Activity, AlertTriangle, Search } from 'lucide-react';
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

const BASE_URL = 'https://meum-diarium.xn--schner-2za.de';

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
    title: 'Tags',
    description: 'Alle verwendeten Tags aus Beitraegen.',
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
    title: 'Health',
    description: 'Service- und Binding-Status fuer Monitoring.',
    response: '{ status, message, environment, timestamp }',
  },
  {
    method: 'GET',
    path: '/api/dashboard/stats',
    title: 'Dashboard-Stats',
    description: 'Nutzer-/Kommentarstatistik fuer Dashboard (auth-gebunden).',
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
    description: 'Profilverwaltung ueber Bearer-Token.',
    notes: ['Authorization: Bearer <token> erforderlich.'],
    response: 'UserProfile',
  },
  {
    method: 'GET',
    path: '/api/debug, /api/debug-bindings',
    title: 'Debug-Endpunkte',
    description: 'Diagnoseinformationen fuer Entwicklung/Deployment.',
    notes: ['Nicht fuer produktive Client-Nutzung vorgesehen.'],
  },
];

const endpointGroups: EndpointGroup[] = [
  { id: 'content', title: 'Content APIs', icon: Database, endpoints: contentEndpoints },
  { id: 'learning', title: 'Lern- und Discovery APIs', icon: Activity, endpoints: learningEndpoints },
  { id: 'ai', title: 'KI- und Sprach-APIs', icon: Bot, endpoints: aiEndpoints },
  { id: 'system', title: 'System und Monitoring', icon: Shield, endpoints: systemEndpoints },
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
  const [query, setQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<'all' | EndpointGroup['id']>('all');

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

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-14">
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase tracking-[0.2em] font-bold">
            API v1
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight">Meum Diarium API</h1>
          <p className="text-muted-foreground max-w-3xl text-lg leading-relaxed">
            Strukturierte Referenz fuer alle oeffentlichen Endpunkte. Inklusive Suche, cURL-Beispielen und
            Implementierungsleitfaden fuer eigene Anwendungen.
          </p>

          <Card className="card-modern border-primary/20 bg-primary/5">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Code2 className="h-4 w-4" />
                <p className="text-xs uppercase tracking-[0.2em] font-semibold">Basis-URL</p>
              </div>
              <code className="text-sm bg-background/80 px-2 py-1 rounded border border-border/50">{BASE_URL}</code>
              <p className="text-sm text-muted-foreground">Empfohlener Start: GET /api/catalog, danach domain-spezifisch (Posts, Lexikon, KI).</p>
            </CardContent>
          </Card>
        </header>

        <section className="space-y-6">
          <div className="space-y-4">
            <h2 className="font-display text-3xl font-bold flex items-center gap-3"><Code2 className="h-8 w-8 text-primary" />Was ist eine API?</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Eine <strong>API (Application Programming Interface)</strong> ist eine standardisierte Schnittstelle, die es Computerprogrammen ermöglicht, miteinander zu kommunizieren. Statt dass ein Mensch eine Website mit der Maus bedient, verfrag ein Programm die API um Daten zu erhalten oder Operationen durchzuführen.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="card-modern border-border/50 bg-secondary/5">
              <CardContent className="p-5 space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">Alltagsbeispiel</p>
                <p className="text-sm text-muted-foreground">
                  Wenn du in einem Restaurant bestellst, gibst du dem Kellner (API) deine Bestellung. Der Kellner geht in die Küche (Backend), gibt die Bestellung weiter, wartet auf das Ergebnis und bringt dir das fertige Gericht. Du musst nicht selbst in die Küche gehen.
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern border-border/50 bg-primary/5">
              <CardContent className="p-5 space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">In dieser Software</p>
                <p className="text-sm text-muted-foreground">
                  Die API erlaubt es dir, Beiträge zu suchen, Lexikon-Inhalte abzurufen, mit historischen Personen zu chatten und vieles mehr – ohne die Website manuell zu bedienen.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 bg-secondary/30 border border-border/50 rounded-lg p-5">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">Wie funktioniert eine API?</p>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li><strong>1. Request:</strong> Ein Programm sendet eine strukturierte Anfrage (Request) an die API. Z. B.: „Gib mir alle Beiträge zum Thema Caesar".</li>
              <li><strong>2. Verarbeitung:</strong> Der Server empfängt die Anfrage, validiert sie, führt die notwendigen Operationen durch (z. B. Datenbankabfrage).</li>
              <li><strong>3. Response:</strong> Der Server schickt strukturierte Daten zurück (meist im JSON-Format), z. B. eine Liste von Beiträgen mit Titel, Text und Metadaten.</li>
              <li><strong>4. Verarbeitung durch den Client:</strong> Das anfragende Programm (z. B. diese Website) empfängt die Daten und zeigt sie dem Benutzer an.</li>
            </ol>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="card-modern border-border/50">
              <CardContent className="p-5 space-y-3">
                <p className="text-sm font-semibold text-primary">Content-APIs</p>
                <p className="text-sm text-muted-foreground">
                  Abrufen von Beiträgen, Lexikon-Einträgen, Werken und Autoren. Ideal für Inhaltssuche und Browsing.
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern border-border/50">
              <CardContent className="p-5 space-y-3">
                <p className="text-sm font-semibold text-primary">KI/Chat-APIs</p>
                <p className="text-sm text-muted-foreground">
                  Stelle Fragen an historische Personen, bekomme Erklärungen, führe interaktive Szenarien durch.
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern border-border/50">
              <CardContent className="p-5 space-y-3">
                <p className="text-sm font-semibold text-primary">Lern-APIs</p>
                <p className="text-sm text-muted-foreground">
                  Vokabelsuche, Grammatik-Daten, lateinische Texte und Discovery von Lernmaterialien.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 bg-primary/10 border border-primary/20 rounded-lg p-5">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary flex items-center gap-2"><Code2 className="h-4 w-4" />Praktisches Beispiel: Vokabeln abfragen</p>
            <pre className="text-xs bg-background/80 border border-border/50 rounded p-3 overflow-x-auto">{`// Anfrage (Request)
GET /api/vocab?q=amare&limit=5

// Server antwortet (Response)
{
  "results": [
    { "word": "amare", "type": "verb", "meaning": "to love" },
    { "word": "amamus", "type": "verb_form", "meaning": "we love" }
  ],
  "count": 2
}`}</pre>
            <p className="text-sm text-muted-foreground">Früher musstest du ein Lateinwörterbuch von Hand durchblättern. Mit der API brauchst du als Programm nur eine Zeile Code.</p>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-4">
          <Card className="card-modern border-border/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3 text-primary"><Shield className="h-4 w-4" /><p className="text-xs uppercase tracking-[0.2em] font-semibold">Sicherheit</p></div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Input-Validierung auf AI-Proxy-Endpunkten (Laengen, Allowlists, URL-Pruefung).</li>
                <li>CORS auf allen oeffentlichen API-Endpunkten aktiv.</li>
                <li>Bei fehlenden Bindings (z. B. D1/AI) liefern Endpunkte explizite Fehlercodes.</li>
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

        </section>

        <section className="grid lg:grid-cols-2 gap-4">
          <Card className="card-modern border-border/50">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-primary"><Code2 className="h-4 w-4" /><p className="text-xs uppercase tracking-[0.2em] font-semibold">Quickstart cURL</p></div>
              <pre className="text-xs bg-secondary/60 border border-border/50 rounded p-3 overflow-x-auto">{`curl -s "${BASE_URL}/api/catalog"
curl -s "${BASE_URL}/api/posts?tag=caesar"
curl -s "${BASE_URL}/api/ask?persona=caesar&ask=Was%20war%20der%20Rubikon%3F"`}</pre>
            </CardContent>
          </Card>

          <Card className="card-modern border-border/50">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-2 text-primary"><Code2 className="h-4 w-4" /><p className="text-xs uppercase tracking-[0.2em] font-semibold">Integration (fetch)</p></div>
              <pre className="text-xs bg-secondary/60 border border-border/50 rounded p-3 overflow-x-auto">{`const API = "${BASE_URL}";

export async function askCaesar(question) {
  const url = API + "/api/ask?persona=caesar&ask=" + encodeURIComponent(question);
  const res = await fetch(url);
  if (!res.ok) throw new Error("API error " + res.status);
  return res.json();
}`}</pre>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Search className="h-4 w-4" />
            <p className="text-xs uppercase tracking-[0.2em] font-semibold">Endpoint-Finder</p>
          </div>

          <div className="grid md:grid-cols-[1fr_auto] gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Suche nach Pfad, Methode, Parameter oder Beschreibung..."
              className="bg-card/70"
            />
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'Alle' },
                { id: 'content', label: 'Content' },
                { id: 'learning', label: 'Lernen' },
                { id: 'ai', label: 'KI' },
                { id: 'system', label: 'System' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveGroup(item.id as 'all' | EndpointGroup['id'])}
                  className={`px-3 py-1.5 rounded-md text-xs border transition-colors ${
                    activeGroup === item.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card/60 border-border/60 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{totalVisible} Endpunkte sichtbar</p>
        </section>

        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <EndpointSection
              key={group.id}
              title={group.title}
              icon={group.icon}
              endpoints={group.endpoints}
            />
          ))
        ) : (
          <Card className="card-modern border-border/50">
            <CardContent className="p-6 text-sm text-muted-foreground">
              Keine Endpunkte fuer diese Suche gefunden. Versuche kuerzere Begriffe wie "posts", "ask" oder "vocab".
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
