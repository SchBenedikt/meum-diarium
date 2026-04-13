import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  ChevronRight,
  BookOpen,
  Users,
  MessageSquare,
  Hash,
  List,
  PenTool,
  Calendar,
  Target,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Route,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

type Level = 'Basis' | 'Mittelstufe' | 'Fortgeschritten';

type GrammarTopic = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  level: Level;
  topics: string[];
};

const grammarTopics: GrammarTopic[] = [
  {
    id: 'substantive',
    title: 'Substantive (Nomen)',
    description: 'Kasus, Deklination und Formensicherheit für solide Übersetzungen.',
    icon: BookOpen,
    color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
    level: 'Basis',
    topics: ['Geschlechter', 'Kasus', 'Deklination', 'Pluralbildung'],
  },
  {
    id: 'verben',
    title: 'Verben',
    description: 'Tempora, Modi und Konjugationen als Kern jeder Satzanalyse.',
    icon: PenTool,
    color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
    level: 'Basis',
    topics: ['Konjugation', 'Tempora', 'Modi', 'Aktiv/Passiv'],
  },
  {
    id: 'adjektive',
    title: 'Adjektive',
    description: 'Kongruenz, Steigerung und präziser Ausdruck in der Übersetzung.',
    icon: MessageSquare,
    color: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
    level: 'Basis',
    topics: ['Deklination', 'Steigerung', 'Vergleiche'],
  },
  {
    id: 'pronomen',
    title: 'Pronomen',
    description: 'Verweisstrukturen verstehen und komplexe Sätze sicher auflösen.',
    icon: Users,
    color: 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300',
    level: 'Mittelstufe',
    topics: ['Personalpronomen', 'Possessivpronomen', 'Demonstrativpronomen', 'Relativpronomen'],
  },
  {
    id: 'adverbien',
    title: 'Adverbien',
    description: 'Feinheiten der Aussage durch adverbiale Bestimmungen erfassen.',
    icon: Hash,
    color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300',
    level: 'Mittelstufe',
    topics: ['Adverbarten', 'Steigerung', 'Bildung'],
  },
  {
    id: 'syntax',
    title: 'Syntax',
    description: 'Satzbau strategisch lesen, Kernsatz erkennen, Nebensätze einordnen.',
    icon: List,
    color: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300',
    level: 'Fortgeschritten',
    topics: ['Satzbau', 'Wortstellung', 'Satzgliederung'],
  },
  {
    id: 'partizipien',
    title: 'Partizipien',
    description: 'PPA, PPP und abhängige Konstruktionen souverän übersetzen.',
    icon: Calendar,
    color: 'bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300',
    level: 'Fortgeschritten',
    topics: ['PPA', 'PPP', 'PFA', 'Infinitiv', 'Gerundium'],
  },
];

const LEVEL_COLORS: Record<Level, string> = {
  Basis: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Mittelstufe: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  Fortgeschritten: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

const DAILY_TIPS = [
  'Das Verb steht im Lateinischen meist am Satzende – suche es zuerst!',
  'Ein Partizip stimmt in Kasus, Numerus und Genus mit dem Bezugswort überein.',
  'Der Ablativus absolutus steht immer grammatisch unabhängig vom Hauptsatz.',
  'Beim AcI steht das Subjekt des Nebensatzes im Akkusativ.',
  'Ne + Konjunktiv = Finalsatz: „damit nicht".',
  'Das Gerundivum drückt eine Notwendigkeit aus: „legendum est" = man muss lesen.',
  'Lateinische Substantive ändern ihre Bedeutung je nach Kasus – Kontext prüfen!',
];

function loadVisited(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem('grammar-visited') ?? '[]')); }
  catch { return new Set(); }
}
function markVisited(id: string) {
  const visited = loadVisited();
  visited.add(id);
  localStorage.setItem('grammar-visited', JSON.stringify([...visited]));
}

export default function LatinGrammarPage() {
  const navigate = useNavigate();
  const [activeLevel, setActiveLevel] = useState<Level | 'Alle'>('Alle');
  const [visited, setVisited] = useState<Set<string>>(new Set());

  useEffect(() => {
    setVisited(loadVisited());
  }, []);

  const dailyTip = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
  }, []);

  const filteredTopics = useMemo(
    () => activeLevel === 'Alle' ? grammarTopics : grammarTopics.filter(t => t.level === activeLevel),
    [activeLevel],
  );

  const visitedCount = grammarTopics.filter(t => visited.has(t.id)).length;

  function handleNavigate(id: string) {
    markVisited(id);
    setVisited(loadVisited());
    navigate(`/learn/grammar/${id}`);
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10 flex flex-col">
      <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">

        {/* Hero */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
              <div className="w-8 h-[1px] bg-primary/30" />
              GRAMMATIK
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
              Lateinische <span className="text-primary italic">Grammatik</span>
            </h1>
            <p className="text-muted-foreground/70 max-w-2xl font-light leading-relaxed text-lg">
              Eine strukturierte Lernoberfläche mit klaren Themenbereichen statt bloßer Themenliste.
              Wähle den passenden Einstieg, übe gezielt und vertiefe Schritt für Schritt.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4 items-end">
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
              <div className="flex flex-col items-end">
                <span className="text-foreground">7 Module</span>
                <span>Inhalte</span>
              </div>
              <div className="w-px h-6 bg-border/40" />
              <div className="flex flex-col items-end">
                <span className="text-foreground">3 Niveaus</span>
                <span>Stufen</span>
              </div>
              <div className="w-px h-6 bg-border/40" />
              <div className="flex flex-col items-end">
                <span className="text-foreground">Praxisnah</span>
                <span>Ansatz</span>
              </div>
            </div>
            <Link to="/learn" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors pr-2">
              <ArrowLeft className="h-3.5 w-3.5" /> Zurück zum Lernen
            </Link>
          </motion.div>
        </div>

        {/* Quick Start Paths */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">Schnelleinstieg</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Anfänger', color: 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10', steps: ['Substantive', 'Verben', 'Adjektive'] },
              { label: 'Mittelstufe', color: 'border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10', steps: ['Pronomen', 'Adverbien', 'Syntax'] },
              { label: 'Fortgeschritten', color: 'border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10', steps: ['Partizipien', 'Stilmittel'] },
            ].map(path => (
              <div key={path.label} className={`rounded-2xl border p-4 ${path.color}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3 text-muted-foreground">{path.label}</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {path.steps.map((step, i) => (
                    <span key={step} className="flex items-center gap-1.5">
                      <span className="text-sm font-medium">{step}</span>
                      {i < path.steps.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Level Filter */}
        <section className="mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            {(['Alle', 'Basis', 'Mittelstufe', 'Fortgeschritten'] as const).map(level => (
              <Button
                key={level}
                variant={activeLevel === level ? 'default' : 'outline'}
                size="sm"
                className="rounded-full"
                onClick={() => setActiveLevel(level)}
              >
                {level}
              </Button>
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-12 gap-6 mb-16">
          {/* Grammar Cards */}
          <Card className="lg:col-span-8 card-modern border-border/50">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6 text-primary">
                <Route className="h-4 w-4" />
                <p className="text-xs uppercase tracking-[0.2em] font-semibold">Themenbereiche</p>
              </div>

              <AnimatePresence mode="popLayout">
                <div className="grid md:grid-cols-2 gap-5">
                  {filteredTopics.map((topic, index) => (
                    <motion.button
                      key={topic.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.04 }}
                      onClick={() => handleNavigate(topic.id)}
                      className="text-left rounded-2xl border border-border/50 bg-card p-5 hover:border-primary/40 hover:bg-primary/5 transition-colors relative"
                    >
                      {visited.has(topic.id) && (
                        <span className="absolute top-3 right-3 text-green-500" title="Besucht">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                      )}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className={`p-2.5 rounded-xl ${topic.color}`}>
                          <topic.icon className="w-5 h-5" />
                        </div>
                        {!visited.has(topic.id) && <ChevronRight className="w-4 h-4 text-muted-foreground mt-0.5" />}
                      </div>
                      <h3 className="font-display text-xl font-bold mb-2">{topic.title}</h3>
                      <p className="text-sm text-muted-foreground/80 leading-relaxed mb-3">{topic.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`text-[10px] uppercase tracking-[0.18em] font-semibold px-2.5 py-1 rounded-full ${LEVEL_COLORS[topic.level]}`}>
                          {topic.level}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {topic.topics.slice(0, 3).map((subTopic) => (
                          <span key={subTopic} className="text-xs px-2 py-1 rounded-full border border-border/60 text-muted-foreground">
                            {subTopic}
                          </span>
                        ))}
                      </div>
                      <p className="mt-3 text-xs font-semibold text-primary/80 flex items-center gap-1">
                        Zum Modul <ChevronRight className="h-3 w-3" />
                      </p>
                    </motion.button>
                  ))}
                </div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Progress */}
            <Card className="card-modern border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <Target className="h-4 w-4" />
                  <p className="text-xs uppercase tracking-[0.2em] font-semibold">Dein Fortschritt</p>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold">{visitedCount}</span>
                  <span className="text-muted-foreground text-sm mb-1">/ {grammarTopics.length} Module</span>
                </div>
                <div className="h-2 bg-primary/10 rounded-full mb-3">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.round((visitedCount / grammarTopics.length) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {visitedCount === 0 ? 'Noch kein Modul besucht' : `${Math.round((visitedCount / grammarTopics.length) * 100)}% abgeschlossen`}
                </p>
              </CardContent>
            </Card>

            {/* Daily Tip */}
            <Card className="card-modern border-border/50 border-amber-200/50 dark:border-amber-800/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3 text-amber-600 dark:text-amber-400">
                  <Lightbulb className="h-4 w-4" />
                  <p className="text-xs uppercase tracking-[0.2em] font-semibold">Tipp des Tages</p>
                </div>
                <p className="text-sm text-muted-foreground/80 leading-relaxed">{dailyTip}</p>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="card-modern border-border/50">
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-3">Schnellzugriff</p>
                <div className="space-y-2">
                  <Button className="w-full rounded-full" variant="outline" onClick={() => navigate('/reader')}>
                    Zum Textreader
                  </Button>
                  <Button className="w-full rounded-full" variant="outline" onClick={() => navigate('/learn/stilmittel')}>
                    Stilmittel
                  </Button>
                  <Button className="w-full rounded-full" onClick={() => navigate('/learn/practice')}>
                    Zum Üben
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Merke! boxes */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="h-4 w-4 text-primary" />
            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">Merke!</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                title: 'AcI (Accusativus cum Infinitivo)',
                rule: 'Der AcI steht nach Verben des Sagens, Denkens und Wahrnehmens. Subjekt im Akkusativ, Prädikat im Infinitiv.',
                example: '„Caesar dicit Gallos esse fortes." = Caesar sagt, dass die Gallier tapfer sind.',
              },
              {
                title: 'Ablativus absolutus',
                rule: 'Unabhängige Partizipialkonstruktion im Ablativ. Gibt Zeit, Grund, Begleitumstand an.',
                example: '„Caesare duce, Romani vicerunt." = Da Caesar Anführer war, siegten die Römer.',
              },
              {
                title: 'Gerundium vs. Gerundivum',
                rule: 'Gerundium = Verbalsubstantiv (des Lesens). Gerundivum = Verbaladjektiv (der zu lesende Brief).',
                example: '„ars scribendi" (Gerundium) vs. „epistula scribenda" (Gerundivum)',
              },
            ].map(item => (
              <div key={item.title} className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <p className="font-semibold text-primary mb-2">{item.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{item.rule}</p>
                <p className="text-xs italic text-muted-foreground/80 bg-background/60 rounded-xl px-3 py-2">{item.example}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-destructive">Häufige Fehler</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { wrong: "Ich übersetze 'et' immer mit 'und'", right: "'Et' kann auch 'auch', 'sogar' bedeuten – je nach Kontext prüfen" },
              { wrong: 'Das Subjekt steht immer am Anfang', right: 'Im Lateinischen ist die Wortstellung frei; das Verb steht meist am Ende' },
              { wrong: "Der Ablativ = immer 'von'", right: "Der Ablativ hat viele Bedeutungen: mit, durch, von, aus, als, weil..." },
              { wrong: 'Partizip Perfekt Passiv = Vergangenheit', right: 'Das PPP drückt eine abgeschlossene Handlung aus, keine Zeitform' },
              { wrong: "'Ne' = 'nicht' am Satzanfang", right: "'Ne' leitet oft einen Finalsatz ein: 'damit nicht'" },
              { wrong: 'Alle -us Wörter sind maskulin', right: 'Ausnahmen: domus (f.), virus (n.), humus (f.) u.a.' },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-border/50 bg-card p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-destructive font-bold text-sm mt-0.5">✗</span>
                  <p className="text-sm text-muted-foreground line-through">{item.wrong}</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 font-bold text-sm mt-0.5">✓</span>
                  <p className="text-sm">{item.right}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
