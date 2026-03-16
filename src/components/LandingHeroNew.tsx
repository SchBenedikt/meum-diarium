import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowRight, BookOpen, Globe, Clock, Brain, Shield,
  Star, ChevronRight, Play, MessageSquare, Scroll, Library,
  Zap, Users, Award, TrendingUp, Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePosts } from '@/hooks/use-posts';
import { BlogCard } from './BlogCard';

// ─── Typewriter helper ───────────────────────────────────────────────────────
function useTypewriter(words: string[], speed = 80, pause = 2000) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // Simple interval-based approach kept compact
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    const interval = setInterval(() => {
      if (!deleting && subIndex < words[index].length) {
        setDisplayed(words[index].slice(0, subIndex + 1));
        setSubIndex(s => s + 1);
      } else if (deleting && subIndex > 0) {
        setDisplayed(words[index].slice(0, subIndex - 1));
        setSubIndex(s => s - 1);
      } else if (!deleting && subIndex === words[index].length) {
        setTimeout(() => setDeleting(true), pause);
      } else if (deleting && subIndex === 0) {
        setDeleting(false);
        setIndex(i => (i + 1) % words.length);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearInterval(interval);
  }, [index, subIndex, deleting, words, speed, pause]);

  return displayed;
}

// ─── Interactive UI Mockup (chat simulation) ─────────────────────────────────
const chatMessages = [
  { role: 'user', text: 'Was denkst du über den Rubikon?' },
  { role: 'caesar', text: 'Der Würfel ist gefallen! Als ich den Rubikon überschritt, wusste ich – es gibt kein Zurück mehr. Alea iacta est.' },
  { role: 'user', text: 'Hattest du keine Angst vor dem Senat?' },
  { role: 'caesar', text: 'Der Senat fürchtete mich, nicht ich ihn. Macht folgt dem Mutigen.' },
];

function ChatMockup() {
  const [visible, setVisible] = useState(1);

  return (
    <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-secondary/40">
        <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-sm font-bold">C</div>
        <div>
          <p className="text-sm font-semibold">Julius Caesar</p>
          <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />Online</p>
        </div>
      </div>
      {/* Messages */}
      <div className="p-4 space-y-3 min-h-[200px]">
        <AnimatePresence>
          {chatMessages.slice(0, visible).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {visible < chatMessages.length && (
          <div className="flex justify-start">
            <div className="bg-secondary rounded-xl px-3 py-2 text-xs text-muted-foreground animate-pulse">
              Caesar schreibt…
            </div>
          </div>
        )}
      </div>
      {/* Advance button */}
      <div className="p-3 border-t border-border">
        <button
          onClick={() => visible >= chatMessages.length ? setVisible(1) : setVisible(v => v + 1)}
          className="w-full text-xs text-primary hover:text-primary/80 text-center transition-colors"
        >
          {visible < chatMessages.length ? '▶ Weiter' : '↺ Neu starten'}
        </button>
      </div>
    </div>
  );
}

// ─── Timeline Mockup ──────────────────────────────────────────────────────────
const timelineEvents = [
  { year: '100 v.Chr.', event: 'Geburt Caesars in Rom' },
  { year: '63 v.Chr.', event: 'Caesar wird Pontifex Maximus' },
  { year: '58 v.Chr.', event: 'Beginn des Gallischen Krieges' },
  { year: '49 v.Chr.', event: 'Caesar überschreitet den Rubikon' },
  { year: '44 v.Chr.', event: 'Ermordung Caesars an den Iden des März' },
];

function TimelineMockup() {
  const [active, setActive] = useState(3);
  return (
    <div className="bg-card border border-border rounded-2xl shadow-2xl p-4 w-full max-w-xs">
      <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Zeitstrahl · Caesar</p>
      <div className="relative">
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />
        <div className="space-y-3">
          {timelineEvents.map((ev, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="flex items-start gap-3 w-full text-left group"
            >
              <div className={`relative z-10 mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-200 ${
                active === i ? 'bg-primary ring-2 ring-primary/30 scale-125' : 'bg-muted-foreground/40 group-hover:bg-primary/60'
              }`} />
              <div>
                <p className={`text-xs font-medium transition-colors ${active === i ? 'text-primary' : 'text-muted-foreground'}`}>{ev.year}</p>
                <p className={`text-xs transition-colors ${active === i ? 'text-foreground font-medium' : 'text-muted-foreground/70'}`}>{ev.event}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Vocabulary Mockup ────────────────────────────────────────────────────────
const vocabCards = [
  { latin: 'alea', german: 'Würfel', type: 'Nomen' },
  { latin: 'iacere', german: 'werfen', type: 'Verb' },
  { latin: 'fortis', german: 'tapfer', type: 'Adjektiv' },
  { latin: 'victoria', german: 'Sieg', type: 'Nomen' },
];

function VocabMockup() {
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const next = () => {
    setCurrent(c => (c + 1) % vocabCards.length);
    setRevealed(false);
  };

  const card = vocabCards[current];

  return (
    <div className="bg-card border border-border rounded-2xl shadow-2xl p-5 w-full max-w-xs">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vokabeltrainer</p>
        <Badge variant="secondary" className="text-xs">{card.type}</Badge>
      </div>
      <div
        className="cursor-pointer select-none"
        onClick={() => setRevealed(r => !r)}
      >
        <div className="text-center py-6 rounded-xl bg-secondary/40 hover:bg-secondary/60 transition-colors">
          <p className="text-2xl font-bold text-foreground mb-2">{card.latin}</p>
          <AnimatePresence>
            {revealed ? (
              <motion.p
                key="german"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-primary font-semibold"
              >
                {card.german}
              </motion.p>
            ) : (
              <p className="text-muted-foreground text-sm">Tippe zum Aufdecken</p>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        {revealed && (
          <>
            <button onClick={next} className="flex-1 text-xs py-1.5 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:opacity-80 transition">
              Nochmal
            </button>
            <button onClick={next} className="flex-1 text-xs py-1.5 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:opacity-80 transition">
              Gewusst ✓
            </button>
          </>
        )}
        {!revealed && (
          <button onClick={() => setRevealed(true)} className="w-full text-xs py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition">
            Antwort zeigen
          </button>
        )}
      </div>
      <p className="text-xs text-center text-muted-foreground mt-2">{current + 1} / {vocabCards.length}</p>
    </div>
  );
}

// ─── Main Landing Page Component ─────────────────────────────────────────────
export default function LandingHeroNew() {
  const { posts, isLoading } = usePosts();
  const recentPosts = posts
    ? [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)
    : [];

  const features = [
    { icon: MessageSquare, title: 'KI-Chat', desc: 'Unterhalte dich mit Caesar, Cicero, Augustus und Seneca – gestützt auf echte historische Quellen.', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
    { icon: Clock, title: 'Zeitstrahl', desc: 'Navigiere durch 170+ Jahre römischer Geschichte mit interaktivem Zeitstrahl.', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20' },
    { icon: Library, title: 'Lexikon', desc: '92+ Einträge zu Personen, Orten und Begriffen der Antike – mit Etymologie.', color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/20' },
    { icon: BookOpen, title: 'Grammatik', desc: 'Strukturierte Latein-Grammatik mit interaktiven Übungen und Erklärungen.', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
    { icon: Brain, title: 'Vokabeltrainer', desc: '36.000+ lateinische Vokabeln mit intelligentem Spaced-Repetition-System.', color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-900/20' },
    { icon: Globe, title: 'Mehrsprachig', desc: 'Inhalte auf Deutsch, Englisch und Latein – ideal für den Unterricht.', color: 'text-teal-500', bg: 'bg-teal-100 dark:bg-teal-900/20' },
  ];

  const stats = [
    { value: '4', label: 'Historische Autoren' },
    { value: '36K+', label: 'Vokabeln' },
    { value: '92+', label: 'Lexikon-Einträge' },
    { value: '170+', label: 'Jahre Geschichte' },
  ];

  const authors = [
    { id: 'caesar', name: 'Julius Caesar', role: 'Feldherr & Diktator', years: '100–44 v.Chr.', color: 'from-red-600 to-orange-600', letter: 'C' },
    { id: 'cicero', name: 'Marcus Cicero', role: 'Redner & Philosoph', years: '106–43 v.Chr.', color: 'from-blue-600 to-indigo-600', letter: 'M' },
    { id: 'augustus', name: 'Augustus', role: 'Erster Römischer Kaiser', years: '63 v.Chr.–14 n.Chr.', color: 'from-amber-600 to-yellow-600', letter: 'A' },
    { id: 'seneca', name: 'Lucius Seneca', role: 'Stoischer Philosoph', years: '4 v.Chr.–65 n.Chr.', color: 'from-green-600 to-teal-600', letter: 'S' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1">
                <Sparkles className="h-3 w-3 mr-1.5" />
                KI-gestützt
              </Badge>
              <Badge className="bg-white/10 text-white/80 border-white/20 px-3 py-1">
                <Shield className="h-3 w-3 mr-1.5" />
                Kostenlos
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
            >
              <span className="text-white">Meum</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Diarium
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg sm:text-xl text-white/70 max-w-lg mb-8 leading-relaxed"
            >
              Erlebe das antike Rom durch die Augen von Caesar, Cicero, Augustus und Seneca.
              KI-Gespräche, interaktive Zeitreisen und moderne Lernwerkzeuge.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/caesar">
                <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-300">
                  <Play className="mr-2 h-4 w-4" />
                  Jetzt starten
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300">
                  Mehr erfahren
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="flex items-center gap-6 mt-10 text-white/50 text-sm"
            >
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-400" />
                <span>Keine Anmeldung nötig</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-400" />
                <span>Alle Inhalte kostenlos</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Interactive Chat Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <ChatMockup />
            <p className="text-white/40 text-xs">← Interaktiv – klicke auf „Weiter"</p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center p-1"
          >
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-secondary/30 border-y border-border">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <p className="text-4xl sm:text-5xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE MOCKUPS ───────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Zap className="h-3 w-3 mr-1.5" />
              Interaktive Vorschau
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Entdecke die Features
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Probiere die wichtigsten Tools direkt aus – live und interaktiv.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Chat Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-foreground">KI-Gespräch</h3>
              </div>
              <ChatMockup />
              <Link to="/caesar/chat" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                Echtes Gespräch starten <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>

            {/* Timeline Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold text-foreground">Zeitstrahl</h3>
              </div>
              <TimelineMockup />
              <Link to="/timeline" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                Vollständiger Zeitstrahl <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>

            {/* Vocab Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-pink-500" />
                <h3 className="font-semibold text-foreground">Vokabeltrainer</h3>
              </div>
              <VocabMockup />
              <Link to="/vocab" className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                Alle Vokabeln lernen <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── AUTHORS ───────────────────────────────────────────────────────── */}
      <section className="py-24 bg-secondary/20 border-y border-border">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800">
              <Scroll className="h-3 w-3 mr-1.5" />
              Historische Persönlichkeiten
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Lerne die Größten des antiken Roms kennen
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tauche in die Gedanken und das Leben von vier außergewöhnlichen Persönlichkeiten ein.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {authors.map((author, i) => (
              <motion.div
                key={author.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link to={`/${author.id}`} className="group block">
                  <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300 text-center h-full">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${author.color} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {author.letter}
                    </div>
                    <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{author.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{author.role}</p>
                    <p className="text-xs text-muted-foreground/60">{author.years}</p>
                    <div className="mt-4 flex items-center justify-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Entdecken <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Alles für dein Latein-Erlebnis
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Moderne Tools und Inhalte, die das Lernen erleichtern und begeistern.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-md transition-all duration-300 h-full">
                    <div className={`w-12 h-12 rounded-xl ${feat.bg} flex items-center justify-center mb-4`}>
                      <Icon className={`h-6 w-6 ${feat.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{feat.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── RECENT POSTS ──────────────────────────────────────────────────── */}
      {!isLoading && recentPosts.length > 0 && (
        <section className="py-24 bg-secondary/20 border-t border-border">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-6"
            >
              <div>
                <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
                  <TrendingUp className="h-3 w-3 mr-1.5" />
                  Neueste Einträge
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Aus den Tagebüchern
                </h2>
              </div>
              <Link to="/search">
                <Button variant="ghost" className="text-primary group">
                  Alle anzeigen
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <BlogCard post={post} className="h-full" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto max-w-4xl px-4 sm:px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                Bereit für deine Reise?
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold">
                Tauche ein in die
                <br />
                <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
                  Antike
                </span>
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
                Wähle deinen historischen Begleiter und beginne noch heute deine interaktive Zeitreise ins antike Rom.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/caesar">
                <Button size="lg" className="rounded-full px-10 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:scale-105 transition-all duration-300">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Mit Caesar beginnen
                </Button>
              </Link>
              <Link to="/cicero">
                <Button size="lg" variant="outline" className="rounded-full px-10 border-white/20 text-white hover:bg-white/10">
                  Cicero kennenlernen
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
              {[
                { icon: BookOpen, label: 'Kostenlos' },
                { icon: Shield, label: 'Datenschutz' },
                { icon: Users, label: 'Community' },
                { icon: Award, label: 'Qualitätsinhalte' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="p-3 bg-white/10 rounded-xl">
                    <item.icon className="h-5 w-5 text-white/80" />
                  </div>
                  <span className="text-sm text-white/60">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
