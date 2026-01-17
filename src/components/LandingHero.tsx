import type { ElementType } from 'react';
import { Sparkles, MessageCircle, BookOpen, Clock, Map, Library, ArrowRight, Users, ShieldCheck, Compass, Bookmark } from 'lucide-react';
import { AuthorGrid } from './AuthorGrid';
import { ModernBackground } from './ui/ModernBackground';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

type BentoCard = {
  title: string;
  description: string;
  icon: ElementType;
  to: string;
  cta?: string;
  tone?: 'primary' | 'neutral';
};

const bentoCards: BentoCard[] = [
  {
    title: 'Charakter-Dialoge',
    description: 'Direkte Interaktion mit historischen Persönlichkeiten auf Basis authentischer Quellen.',
    icon: MessageCircle,
    to: '/caesar/chat',
    cta: 'Dialog starten',
    tone: 'primary'
  },
  {
    title: 'Kompaktes Lexikon',
    description: 'Begriffe, Definitionen und historische Zusammenhänge – präzise auf den Punkt gebracht.',
    icon: BookOpen,
    to: '/lexicon',
    cta: 'Nachschlagen'
  },
  {
    title: 'Virtuelle Karten',
    description: 'Schauplätze und Feldzüge visualisiert für ein besseres räumliches Verständnis.',
    icon: Map,
    to: '/simulation',
    cta: 'Karte öffnen'
  },
  {
    title: 'Analysepunkte',
    description: 'Tägliche Einblicke und tiefergehende Recherchen zu bedeutenden Wendepunkten.',
    icon: Bookmark,
    to: '/blog',
    cta: 'Beiträge lesen'
  },
  {
    title: 'Perspektiven',
    description: 'Entdecke die Geschichte durch verschiedene Stimmen und Deutungen.',
    icon: Users,
    to: '/#autoren',
    cta: 'Autoren wählen'
  }
];

export default function LandingHero() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-border/40 overflow-hidden">
        <ModernBackground />
        <div className="container relative z-10 mx-auto max-w-6xl px-4 sm:px-6 text-center sm:text-left">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6 py-1 px-3 border-primary/20 bg-primary/5 text-primary text-xs uppercase tracking-widest font-semibold">
              <Sparkles className="mr-2 h-3 w-3" />
              {t('landing.hero.aiPowered') || 'Historisches KI-Studio'}
            </Badge>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-foreground leading-[1.1]">
              Meum <span className="text-primary italic">Diarium</span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground font-display max-w-2xl mb-8 leading-relaxed">
              {t('landing.hero.voicesOfAntiquity') || 'Stimmen der Antike – präzise, nachprüfbar, direkt zugänglich.'}
            </p>

            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4">
              <Link to="/caesar">
                <Button size="lg" className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 transition-all shadow-none">
                  {t('landing.hero.discoverNow') || 'Jetzt starten'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/lexicon">
                <Button size="lg" variant="ghost" className="rounded-full px-8 h-12 hover:bg-secondary transition-all">
                  <Library className="mr-2 h-4 w-4" />
                  {t('landing.hero.lexicon') || 'Lexikon öffnen'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="py-20 sm:py-32 bg-background">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold mb-3">Struktur & Tiefe</p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 tracking-tight">Klarheit durch Design</h2>
            <p className="max-w-2xl text-muted-foreground text-lg leading-relaxed">
              Unsere Anwendung ist darauf ausgelegt, komplexe historische Daten in eine leicht verständliche, minimalistische Form zu bringen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 auto-rows-[180px]">
            {/* Featured Bento Card (Dialoge) - Large */}
            <Link
              to={bentoCards[0].to}
              className="md:col-span-6 lg:col-span-8 lg:row-span-2 group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-8 transition-all hover:border-primary/20 hover:bg-muted/30"
            >
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-none">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-3">{bentoCards[0].title}</h3>
                  <p className="max-w-md text-muted-foreground leading-relaxed text-lg">
                    {bentoCards[0].description}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-primary font-bold transition-all group-hover:gap-3">
                  {bentoCards[0].cta} <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* Lexikon Card - Medium */}
            <Link
              to={bentoCards[1].to}
              className="md:col-span-3 lg:col-span-4 lg:row-span-1 group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-6 transition-all hover:border-primary/20 hover:bg-muted/30"
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center gap-4 mb-2">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-display font-bold">{bentoCards[1].title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-snug">
                  {bentoCards[1].description}
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-all">
                  {bentoCards[1].cta} <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* Karten Card - Medium */}
            <Link
              to={bentoCards[2].to}
              className="md:col-span-3 lg:col-span-4 lg:row-span-1 group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-6 transition-all hover:border-primary/20 hover:bg-muted/30"
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center gap-4 mb-2">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary">
                    <Map className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-display font-bold">{bentoCards[2].title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-snug">
                  {bentoCards[2].description}
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-bold opacity-0 group-hover:opacity-100 transition-all">
                  {bentoCards[2].cta} <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>

            {/* Blog Card - Wide */}
            <Link
              to={bentoCards[3].to}
              className="md:col-span-3 lg:col-span-7 lg:row-span-1 group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-6 transition-all hover:border-primary/20 hover:bg-muted/30"
            >
              <div className="flex h-full items-center gap-6">
                <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/5 text-primary">
                  <Bookmark className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-display font-bold mb-1">{bentoCards[3].title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {bentoCards[3].description}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
              </div>
            </Link>

            {/* Autoren Card - Square-ish */}
            <Link
              to={bentoCards[4].to}
              className="md:col-span-3 lg:col-span-5 lg:row-span-1 group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-6 transition-all hover:border-primary/20 hover:bg-muted/30"
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center gap-4 mb-2">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-display font-bold">Autoren</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-snug">
                  {bentoCards[4].description}
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-bold transition-all group-hover:gap-3">
                  {bentoCards[4].cta} <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Authors Bottom Section */}
      <section id="autoren" className="py-20 border-t border-border/40 bg-background/50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold mb-3">Historische Stimmen</p>
            <h2 className="text-3xl font-display font-bold mb-4">Wähle deinen Begleiter</h2>
            <p className="text-muted-foreground text-lg italic">"Historia magistra vitae est."</p>
          </div>
          <AuthorGrid />
        </div>
      </section>
    </div>
  );
}
