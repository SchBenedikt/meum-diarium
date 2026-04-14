import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Lightbulb,
  AlertTriangle,
  ArrowRight,
  Table2,
  Layers,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

type GrammarTopic = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
  accent: string;
  subtopics: string[];
  highlights: string[];
  relatedTo: string[];
};

const grammarTopics: GrammarTopic[] = [
  {
    id: 'substantive',
    title: 'Substantive',
    subtitle: 'Nomen & Kasus',
    description: 'Deklination, Kasus und Formensicherheit für solide Übersetzungen.',
    icon: BookOpen,
    color: 'bg-blue-50 dark:bg-blue-900/20',
    accent: 'text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    subtopics: ['Geschlechter', 'Nominativ', 'Genitiv', 'Dativ', 'Akkusativ', 'Ablativ', 'Deklination', 'Pluralbildung'],
    highlights: ['1.–5. Deklination', 'Genus-Regeln', 'Ablativus absolutus'],
    relatedTo: ['adjektive', 'pronomen'],
  },
  {
    id: 'verben',
    title: 'Verben',
    subtitle: 'Tempora & Modi',
    description: 'Konjugationen, Tempora und Modi als Kern jeder Satzanalyse.',
    icon: PenTool,
    color: 'bg-green-50 dark:bg-green-900/20',
    accent: 'text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    subtopics: ['Konjugation', 'Präsens', 'Imperfekt', 'Perfekt', 'Plusquamperfekt', 'Futur', 'Konjunktiv', 'Aktiv/Passiv'],
    highlights: ['4 Konjugationsklassen', 'Deponentia', 'Irreguläre Verben'],
    relatedTo: ['syntax', 'partizipien'],
  },
  {
    id: 'adjektive',
    title: 'Adjektive',
    subtitle: 'Kongruenz & Steigerung',
    description: 'Kongruenz, Steigerung und präziser Ausdruck in der Übersetzung.',
    icon: MessageSquare,
    color: 'bg-purple-50 dark:bg-purple-900/20',
    accent: 'text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    subtopics: ['Deklination', 'Positiv', 'Komparativ', 'Superlativ', 'Elativ', 'Unregelmäßige Steigerung'],
    highlights: ['A/O-Deklination', 'Konsonant.-Stamm', 'Komparativ-Konstruktionen'],
    relatedTo: ['substantive', 'adverbien'],
  },
  {
    id: 'pronomen',
    title: 'Pronomen',
    subtitle: 'Verweise & Bezüge',
    description: 'Verweisstrukturen verstehen und komplexe Sätze sicher auflösen.',
    icon: Users,
    color: 'bg-amber-50 dark:bg-amber-900/20',
    accent: 'text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    subtopics: ['Personalpronomen', 'Possessivpronomen', 'Demonstrativpronomen', 'Relativpronomen', 'Interrogativpronomen', 'Indefinitpronomen'],
    highlights: ['is, ea, id', 'ille, ille, illud', 'qui, quae, quod'],
    relatedTo: ['substantive', 'syntax'],
  },
  {
    id: 'adverbien',
    title: 'Adverbien',
    subtitle: 'Aussage & Modifikation',
    description: 'Feinheiten der Aussage durch adverbiale Bestimmungen erfassen.',
    icon: Hash,
    color: 'bg-red-50 dark:bg-red-900/20',
    accent: 'text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    subtopics: ['Lokaladverbien', 'Temporaladverbien', 'Modaladverbien', 'Kausaladverbien', 'Steigerung', 'Bildung aus Adjektiven'],
    highlights: ['Bildung auf -e/-iter', 'Steigerungsformen', 'Interrogativadverbien'],
    relatedTo: ['adjektive', 'syntax'],
  },
  {
    id: 'syntax',
    title: 'Syntax',
    subtitle: 'Satzbau & Konstruktionen',
    description: 'Satzbau strategisch lesen, Kernsatz erkennen, Nebensätze einordnen.',
    icon: List,
    color: 'bg-indigo-50 dark:bg-indigo-900/20',
    accent: 'text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    subtopics: ['AcI', 'NcI', 'ut-Sätze', 'cum-Konstruktionen', 'Finalsätze', 'Kausalsätze', 'Relativsätze', 'Konsequtivsätze'],
    highlights: ['AcI nach dicere/putare', 'ut finale vs. consecutivum', 'Wortstellung'],
    relatedTo: ['verben', 'pronomen', 'partizipien'],
  },
  {
    id: 'partizipien',
    title: 'Partizipien',
    subtitle: 'PPA, PPP & Konstruktionen',
    description: 'PPA, PPP und abhängige Konstruktionen souverän übersetzen.',
    icon: Calendar,
    color: 'bg-teal-50 dark:bg-teal-900/20',
    accent: 'text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    subtopics: ['PPA', 'PPP', 'PFA', 'Gerundium', 'Gerundivum', 'Ablativus absolutus', 'Partizipialphrase'],
    highlights: ['Zeitverhältnis', 'Kongruenz', 'Ablativus absolutus'],
    relatedTo: ['verben', 'syntax'],
  },
];

const QUICK_REFERENCE = [
  {
    title: 'AcI (Accusativus cum Infinitivo)',
    icon: '→',
    rule: 'Nach Verben des Sagens, Denkens & Wahrnehmens: Subjekt im Akkusativ, Prädikat im Infinitiv.',
    example: 'Caesar dicit Gallos esse fortes.',
    translation: 'Caesar sagt, dass die Gallier tapfer sind.',
  },
  {
    title: 'Ablativus absolutus',
    icon: '◎',
    rule: 'Unabhängige Partizipialkonstruktion im Ablativ. Gibt Zeit, Grund oder Begleitumstand an.',
    example: 'Caesare duce, Romani vicerunt.',
    translation: 'Da Caesar Anführer war, siegten die Römer.',
  },
  {
    title: 'Gerundium vs. Gerundivum',
    icon: '⊕',
    rule: 'Gerundium = Verbalsubstantiv. Gerundivum = Verbaladjektiv (drückt Notwendigkeit aus).',
    example: 'ars scribendi · epistula scribenda est',
    translation: 'die Kunst des Schreibens · der Brief muss geschrieben werden',
  },
];

const COMMON_MISTAKES = [
  { wrong: "'Et' immer mit 'und' übersetzen", right: "'Et' kann auch 'auch', 'sogar' bedeuten – Kontext prüfen" },
  { wrong: 'Subjekt steht immer am Anfang', right: 'Im Lateinischen ist die Wortstellung frei; Verb meist am Ende' },
  { wrong: "Ablativ = immer 'von'", right: "Ablativ hat viele Bedeutungen: mit, durch, von, aus, als, weil..." },
  { wrong: 'PPP = Vergangenheit', right: 'PPP drückt abgeschlossene Handlung aus, keine Zeitform' },
  { wrong: "'Ne' = 'nicht' am Satzanfang", right: "'Ne' leitet oft Finalsatz ein: 'damit nicht'" },
  { wrong: 'Alle -us Wörter sind maskulin', right: 'Ausnahmen: domus (f.), virus (n.), humus (f.) u.a.' },
];

const DAILY_TIPS = [
  'Das Verb steht im Lateinischen meist am Satzende – suche es zuerst!',
  'Ein Partizip stimmt in Kasus, Numerus und Genus mit dem Bezugswort überein.',
  'Der Ablativus absolutus steht immer grammatisch unabhängig vom Hauptsatz.',
  'Beim AcI steht das Subjekt des Nebensatzes im Akkusativ.',
  'Ne + Konjunktiv = Finalsatz: „damit nicht".',
  'Das Gerundivum drückt eine Notwendigkeit aus: „legendum est" = man muss lesen.',
  'Lateinische Substantive ändern ihre Bedeutung je nach Kasus – Kontext prüfen!',
];

export default function LatinGrammarPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<string>('Alle');

  const dailyTip = DAILY_TIPS[Math.floor((Date.now() / 86400000)) % DAILY_TIPS.length];

  const categories = ['Alle', 'Nomen & Pronomen', 'Verb & Syntax', 'Erweiterung'];
  const categoryMap: Record<string, string[]> = {
    'Nomen & Pronomen': ['substantive', 'adjektive', 'pronomen'],
    'Verb & Syntax': ['verben', 'syntax'],
    'Erweiterung': ['adverbien', 'partizipien'],
  };

  const filteredTopics = activeFilter === 'Alle'
    ? grammarTopics
    : grammarTopics.filter(t => (categoryMap[activeFilter] || []).includes(t.id));

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10 flex flex-col">
      <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">

        {/* Hero */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
              <div className="w-8 h-[1px] bg-primary/30" />
              GRAMMATIK
            </div>
            <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight">
              Lateinische <span className="text-primary italic">Grammatik</span>
            </h1>
            <p className="text-muted-foreground/70 max-w-2xl font-light leading-relaxed text-lg">
              Alle Grammatikthemen mit klaren Erklärungen, Tabellen, Regeln und Beispielen –
              für eine tiefes Verständnis der lateinischen Sprache.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Link to="/learn" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Zurück zum Lernen
            </Link>
          </motion.div>
        </div>

        {/* Daily Tip Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex items-start gap-4 rounded-2xl border border-amber-200/60 dark:border-amber-800/30 bg-amber-50/60 dark:bg-amber-900/10 px-5 py-4"
        >
          <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400 mb-1">Tipp des Tages</p>
            <p className="text-sm text-amber-900 dark:text-amber-300 leading-relaxed">{dailyTip}</p>
          </div>
        </motion.div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={activeFilter === cat ? 'default' : 'outline'}
              size="sm"
              className="rounded-full text-xs"
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Topic Cards Grid */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-5">
            <GraduationCap className="h-4 w-4 text-primary" />
            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">Grammatik-Module</h2>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredTopics.map((topic, index) => {
              const relatedTopics = topic.relatedTo
                .map(id => grammarTopics.find(t => t.id === id))
                .filter(Boolean) as typeof grammarTopics;
              return (
                <motion.button
                  key={topic.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => navigate(`/learn/grammar/${topic.id}`)}
                  className="text-left rounded-2xl border border-border/50 bg-card p-5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-md transition-all group"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl ${topic.color}`}>
                      <topic.icon className={`w-5 h-5 ${topic.accent.split(' ')[0]}`} />
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 mt-0.5 group-hover:text-primary/60 transition-colors" />
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-xl font-bold mb-0.5">{topic.title}</h3>
                  <p className="text-xs text-primary/70 font-semibold uppercase tracking-[0.12em] mb-2">{topic.subtitle}</p>
                  <p className="text-sm text-muted-foreground/80 leading-relaxed mb-4">{topic.description}</p>

                  {/* Subtopics tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {topic.subtopics.slice(0, 4).map((sub) => (
                      <span key={sub} className="text-[10px] px-2 py-0.5 rounded-full border border-border/60 text-muted-foreground bg-muted/30">
                        {sub}
                      </span>
                    ))}
                    {topic.subtopics.length > 4 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-border/60 text-muted-foreground/60">
                        +{topic.subtopics.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Highlights */}
                  <div className={`rounded-xl border px-3 py-2.5 mb-4 ${topic.color} border-current/20`}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-1.5">Highlights</p>
                    <div className="space-y-0.5">
                      {topic.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-1.5">
                          <span className={`text-[10px] ${topic.accent.split(' ')[0]}`}>•</span>
                          <span className="text-xs text-muted-foreground/80">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Related topics */}
                  {relatedTopics.length > 0 && (
                    <div className="pt-3 border-t border-border/30">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-1.5">Auch relevant:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {relatedTopics.map(rel => (
                          <span key={rel.id} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/8 text-primary/80 border border-primary/20">
                            <ArrowRight className="h-2.5 w-2.5" />
                            {rel.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Quick Reference Cards */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">Wichtige Konstruktionen</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {QUICK_REFERENCE.map(item => (
              <div key={item.title} className="rounded-2xl border border-primary/20 bg-primary/5 p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl text-primary/40 font-serif leading-none mt-0.5">{item.icon}</span>
                  <p className="font-semibold text-primary text-sm leading-snug">{item.title}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.rule}</p>
                <div className="rounded-xl bg-background/70 border border-border/40 px-3 py-2.5">
                  <p className="text-sm font-medium text-foreground italic mb-1">{item.example}</p>
                  <p className="text-xs text-muted-foreground">{item.translation}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Two-column: Overview tables + Common Mistakes */}
        <section className="mb-16 grid lg:grid-cols-2 gap-6">
          {/* Declension Quick Reference */}
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <Table2 className="h-4 w-4 text-primary" />
                <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">Deklinationsübersicht</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2 pr-3 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Kasus</th>
                      <th className="text-left py-2 px-2 font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[10px]">1. Dekl.</th>
                      <th className="text-left py-2 px-2 font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider text-[10px]">2. Dekl. m</th>
                      <th className="text-left py-2 px-2 font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider text-[10px]">2. Dekl. n</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {[
                      ['Nom.', 'rosa', 'dominus', 'bellum'],
                      ['Gen.', 'rosae', 'domini', 'belli'],
                      ['Dat.', 'rosae', 'domino', 'bello'],
                      ['Akk.', 'rosam', 'dominum', 'bellum'],
                      ['Abl.', 'rosa', 'domino', 'bello'],
                    ].map(([kasus, ...forms]) => (
                      <tr key={kasus} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2 pr-3 font-medium text-foreground">{kasus}</td>
                        {forms.map((f, i) => (
                          <td key={i} className="py-2 px-2 font-mono text-muted-foreground">{f}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground/60 mt-3 italic">Singular-Formen. Für Plural → Substantive-Modul öffnen.</p>
            </CardContent>
          </Card>

          {/* Verb conjugation quick ref */}
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <Layers className="h-4 w-4 text-primary" />
                <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-primary">Konjugationsübersicht Präsens</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2 pr-3 font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Person</th>
                      <th className="text-left py-2 px-2 font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider text-[10px]">1. Konj.</th>
                      <th className="text-left py-2 px-2 font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[10px]">2. Konj.</th>
                      <th className="text-left py-2 px-2 font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[10px]">3. Konj.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {[
                      ['1. Sg.', 'amo', 'moneo', 'rego'],
                      ['2. Sg.', 'amas', 'mones', 'regis'],
                      ['3. Sg.', 'amat', 'monet', 'regit'],
                      ['1. Pl.', 'amamus', 'monemus', 'regimus'],
                      ['2. Pl.', 'amatis', 'monetis', 'regitis'],
                      ['3. Pl.', 'amant', 'monent', 'regunt'],
                    ].map(([person, ...forms]) => (
                      <tr key={person} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2 pr-3 font-medium text-foreground">{person}</td>
                        {forms.map((f, i) => (
                          <td key={i} className="py-2 px-2 font-mono text-muted-foreground">{f}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground/60 mt-3 italic">Aktiv Präsens. Für alle Tempora → Verben-Modul öffnen.</p>
            </CardContent>
          </Card>
        </section>

        {/* Common Mistakes */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-destructive">Häufige Fehler & Richtigstellungen</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {COMMON_MISTAKES.map((item, i) => (
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

        {/* Quick links */}
        <section className="rounded-2xl border border-border/40 bg-muted/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-foreground">Weiter üben?</p>
            <p className="text-sm text-muted-foreground mt-0.5">Wende das Gelernte direkt an lateinischen Texten an.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button variant="outline" onClick={() => navigate('/reader')} className="rounded-full text-sm">
              Zum Textreader
            </Button>
            <Button variant="outline" onClick={() => navigate('/learn/stilmittel')} className="rounded-full text-sm">
              Stilmittel
            </Button>
            <Button onClick={() => navigate('/learn/practice')} className="rounded-full text-sm">
              Zum Üben
            </Button>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
