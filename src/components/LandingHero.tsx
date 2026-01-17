import type { ElementType } from 'react';
import { Sparkles, MessageCircle, BookOpen, Map, Library, ArrowRight, Users, Bookmark } from 'lucide-react';
import { AuthorGrid } from './AuthorGrid';
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
    title: 'Autoren',
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
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 border-b border-border overflow-hidden">
        <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 text-center sm:text-left">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-6 py-1 px-3 text-xs uppercase tracking-wide">
              <Sparkles className="mr-2 h-3 w-3" />
              {t('landing.hero.aiPowered') || 'AI-Gestützt'}
            </Badge>

            <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl mb-6 text-foreground leading-tight">
              Meum <span className="italic">Diarium</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
              {t('landing.hero.voicesOfAntiquity') || 'Stimmen der Antike'}
            </p>

            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4">
              <Link to="/caesar">
                <Button size="lg" className="rounded px-6 h-11 bg-primary hover:bg-primary/90">
                  {t('landing.hero.discoverNow') || 'Jetzt entdecken'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/lexicon">
                <Button size="lg" variant="ghost" className="rounded px-6 h-11 hover:bg-secondary">
                  <Library className="mr-2 h-4 w-4" />
                  {t('landing.hero.lexicon') || 'Lexikon'}
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
            <p className="text-xs uppercase tracking-wider text-primary mb-3">Struktur & Tiefe</p>
            <h2 className="text-2xl sm:text-3xl font-sans mb-4">Klarheit durch Design</h2>
            <p className="max-w-2xl text-muted-foreground text-base leading-relaxed">
              Unsere Anwendung ist darauf ausgelegt, komplexe historische Daten in eine leicht verständliche, minimalistische Form zu bringen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bentoCards.map((card, idx) => (
              <Link
                key={idx}
                to={card.to}
                className="group relative overflow-hidden rounded border border-border bg-card p-6 hover:border-primary/20"
              >
                <div className="flex flex-col h-full">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded bg-primary/5 text-primary">
                    <card.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-sans mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                    {card.description}
                  </p>
                  <div className="flex items-center gap-2 text-primary text-sm">
                    {card.cta} <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Authors Bottom Section */}
      <section id="autoren" className="py-20 border-t border-border bg-background">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-wider text-primary mb-3">Historische Stimmen</p>
            <h2 className="text-2xl sm:text-3xl font-sans mb-4">Wähle deinen Begleiter</h2>
            <p className="text-muted-foreground text-base italic">"Historia magistra vitae est."</p>
          </div>
          <AuthorGrid />
        </div>
      </section>
    </div>
  );
}
