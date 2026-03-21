import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, XCircle, Sparkles, Brain, MessageSquare, RotateCcw } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';

type QuizItem = {
  id: string;
  domain: 'grammatik' | 'stilmittel';
  prompt: string;
  source: string;
  options: string[];
  answer: number;
  explanation: string;
};

const QUIZ_ITEMS: QuizItem[] = [
  {
    id: 'g1',
    domain: 'grammatik',
    prompt: 'In welchem Kasus steht "puellae" in: "Liber puellae in mensa est."?',
    source: 'Liber puellae in mensa est.',
    options: ['Genitiv Singular', 'Dativ Singular', 'Nominativ Plural', 'Ablativ Singular'],
    answer: 0,
    explanation: '"puellae" beantwortet die Frage "wessen Buch?" und steht hier im Genitiv Singular.',
  },
  {
    id: 'g2',
    domain: 'grammatik',
    prompt: 'Welches Tempus liegt vor: "milites urbem ceperunt"?',
    source: 'Milites urbem ceperunt.',
    options: ['Praesens', 'Imperfekt', 'Perfekt', 'Plusquamperfekt'],
    answer: 2,
    explanation: '"ceperunt" ist Perfekt von "capere" und beschreibt eine abgeschlossene Handlung.',
  },
  {
    id: 'g3',
    domain: 'grammatik',
    prompt: 'Welcher Kasus folgt auf die Präposition "cum"?',
    source: 'cum amicis',
    options: ['Akkusativ', 'Ablativ', 'Dativ', 'Genitiv'],
    answer: 1,
    explanation: 'Die Präposition "cum" regiert den Ablativ.',
  },
  {
    id: 'g4',
    domain: 'grammatik',
    prompt: 'Welche Satzart ist: "Si hoc facis, bene est."?',
    source: 'Si hoc facis, bene est.',
    options: ['Hauptsatzreihe', 'Fragesatz', 'Konditionalsatz', 'Finalsatz'],
    answer: 2,
    explanation: 'Mit "si" wird eine Bedingung eingeleitet, also ein Konditionalsatz.',
  },
  {
    id: 's1',
    domain: 'stilmittel',
    prompt: 'Welches Stilmittel ist "Veni, vidi, vici" primär?',
    source: 'Veni, vidi, vici.',
    options: ['Alliteration', 'Hyperbel', 'Euphemismus', 'Metonymie'],
    answer: 0,
    explanation: 'Die Wiederholung des Anfangslauts "v" macht den Satz besonders einprägsam (Alliteration).',
  },
  {
    id: 's2',
    domain: 'stilmittel',
    prompt: 'Welches Stilmittel liegt vor: "O tempora, o mores!"?',
    source: 'O tempora, o mores!',
    options: ['Apostrophe', 'Ellipse', 'Litotes', 'Klimax'],
    answer: 0,
    explanation: 'Eine direkte Anrede an abstrakte Begriffe ist eine Apostrophe.',
  },
  {
    id: 's3',
    domain: 'stilmittel',
    prompt: 'Welches Stilmittel ist "nicht unklug"?',
    source: 'non stultus',
    options: ['Ironie', 'Litotes', 'Anapher', 'Oxymoron'],
    answer: 1,
    explanation: 'Eine Bejahung durch Verneinung des Gegenteils ist eine Litotes.',
  },
  {
    id: 's4',
    domain: 'stilmittel',
    prompt: 'Was ist "Alea iacta est" in rhetorischer Perspektive?',
    source: 'Alea iacta est.',
    options: ['Metapher', 'Rhetorische Frage', 'Parallelismus', 'Synekdoche'],
    answer: 0,
    explanation: 'Der geworfene Würfel steht bildhaft für eine unumkehrbare Entscheidung (Metapher).',
  },
];

export default function LearnPracticePage() {
  const [domain, setDomain] = useState<'alle' | 'grammatik' | 'stilmittel'>('alle');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const list = useMemo(() => {
    if (domain === 'alle') return QUIZ_ITEMS;
    return QUIZ_ITEMS.filter((item) => item.domain === domain);
  }, [domain]);

  const current = list[index] || null;

  const checkAnswer = () => {
    if (selected == null || checked || !current) return;
    setAttempts((prev) => prev + 1);
    if (selected === current.answer) setScore((prev) => prev + 1);
    setChecked(true);
  };

  const next = () => {
    if (!list.length) return;
    setIndex((prev) => (prev + 1) % list.length);
    setSelected(null);
    setChecked(false);
  };

  const reset = () => {
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setScore(0);
    setAttempts(0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
              <div className="w-8 h-[1px] bg-primary/30" />
              LERNTRAINING
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
              Grammatik und <span className="text-primary italic">Stilmittel</span> üben
            </h1>
            <p className="text-muted-foreground/70 max-w-2xl leading-relaxed">
              Kompakte Übungen für Klausur- und Übersetzungspraxis: gezielte Fragen, direkte Rückmeldung, klare Begründung.
            </p>
          </div>
          <div className="text-right">
            <Link to="/learn" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Zurück zum Lernen
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-4 card-modern border-border/50">
            <CardContent className="p-5 space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Bereich</p>
              <div className="flex flex-wrap gap-2">
                <Button variant={domain === 'alle' ? 'default' : 'outline'} size="sm" className="rounded-full" onClick={() => { setDomain('alle'); setIndex(0); setSelected(null); setChecked(false); }}>
                  Alle
                </Button>
                <Button variant={domain === 'grammatik' ? 'default' : 'outline'} size="sm" className="rounded-full" onClick={() => { setDomain('grammatik'); setIndex(0); setSelected(null); setChecked(false); }}>
                  <Brain className="mr-2 h-4 w-4" /> Grammatik
                </Button>
                <Button variant={domain === 'stilmittel' ? 'default' : 'outline'} size="sm" className="rounded-full" onClick={() => { setDomain('stilmittel'); setIndex(0); setSelected(null); setChecked(false); }}>
                  <MessageSquare className="mr-2 h-4 w-4" /> Stilmittel
                </Button>
              </div>

              <div className="rounded-xl border border-border/50 bg-secondary/20 p-4 space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Status</p>
                <p className="text-sm">Aufgabenpool: {list.length}</p>
                <p className="text-sm">Bearbeitet: {attempts}</p>
                <p className="text-sm">Korrekt: {score}</p>
                <p className="text-sm">Trefferquote: {attempts > 0 ? `${Math.round((score / attempts) * 100)}%` : '—'}</p>
              </div>

              <Button variant="outline" className="w-full rounded-full" onClick={reset}>
                <RotateCcw className="mr-2 h-4 w-4" /> Fortschritt zurücksetzen
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-8 card-modern border-border/50">
            <CardContent className="p-6 sm:p-8 space-y-6">
              {current ? (
                <>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Aufgabe {index + 1} / {list.length}</Badge>
                    <Badge className={current.domain === 'grammatik' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'}>
                      {current.domain}
                    </Badge>
                  </div>

                  <div className="rounded-xl border border-border/50 bg-card p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">Textgrundlage</p>
                    <p className="font-serif text-lg">{current.source}</p>
                  </div>

                  <h2 className="font-display text-2xl font-bold">{current.prompt}</h2>

                  <div className="space-y-2">
                    {current.options.map((option, optionIndex) => {
                      const isSelected = selected === optionIndex;
                      const isCorrect = checked && optionIndex === current.answer;
                      const isWrongSelected = checked && isSelected && !isCorrect;
                      return (
                        <button
                          key={option}
                          onClick={() => !checked && setSelected(optionIndex)}
                          className={`w-full text-left rounded-xl border px-4 py-3 transition ${
                            isCorrect
                              ? 'border-green-500/40 bg-green-500/10'
                              : isWrongSelected
                              ? 'border-red-500/40 bg-red-500/10'
                              : isSelected
                              ? 'border-primary/40 bg-primary/10'
                              : 'border-border/50 hover:bg-secondary/40'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button className="rounded-full" onClick={checkAnswer} disabled={selected == null || checked}>
                      <Sparkles className="mr-2 h-4 w-4" /> Antwort prüfen
                    </Button>
                    <Button variant="outline" className="rounded-full" onClick={next}>
                      Nächste Aufgabe
                    </Button>
                  </div>

                  {checked && (
                    <div className="rounded-xl border border-border/50 bg-secondary/20 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {selected === current.answer ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <p className="font-semibold">{selected === current.answer ? 'Richtig.' : 'Nicht korrekt.'}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{current.explanation}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">Für diesen Bereich sind aktuell keine Aufgaben vorhanden.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
