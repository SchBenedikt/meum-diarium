import type { ElementType } from 'react';
import { Sparkles, MessageCircle, BookOpen, Map, Library, ArrowRight, Users, Bookmark, ChevronRight } from 'lucide-react';
import { AuthorGrid } from './AuthorGrid';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

type BentoCard = {
  title: string;
  description: string;
  icon: ElementType;
  to: string;
  cta?: string;
  className?: string;
  delay?: number;
};

const bentoCards: BentoCard[] = [
  {
    title: 'Charakter-Dialoge',
    description: 'Direkte Interaktion mit historischen Persönlichkeiten auf Basis authentischer Quellen.',
    icon: MessageCircle,
    to: '/caesar/chat',
    cta: 'Dialog starten',
    className: 'md:col-span-2 md:row-span-2 bg-primary/5 border-primary/20',
    delay: 0.1
  },
  {
    title: 'Lexikon',
    description: 'Historische Begriffe präzise auf den Punkt gebracht.',
    icon: BookOpen,
    to: '/lexicon',
    cta: 'Nachschlagen',
    delay: 0.2
  },
  {
    title: 'Karten',
    description: 'Schauplätze und Feldzüge visualisiert.',
    icon: Map,
    to: '/simulation',
    cta: 'Karte öffnen',
    delay: 0.3
  },
  {
    title: 'Analysepunkte',
    description: 'Tiefergehende Recherchen zu Wendepunkten.',
    icon: Bookmark,
    to: '/blog',
    cta: 'Lesen',
    className: 'md:col-span-2',
    delay: 0.4
  }
];

export default function LandingHero() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Visual Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 overflow-hidden">
        <div className="container relative mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-8 py-1.5 px-4 text-xs uppercase tracking-[0.2em] bg-background/50 backdrop-blur-sm border-primary/20 text-primary">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              {t('landing.hero.aiPowered') || 'ERLEBE GESCHICHTE NEU'}
            </Badge>

            <h1 className="font-sans text-5xl sm:text-7xl lg:text-8xl mb-8 text-foreground leading-[1.1] tracking-tight">
              Meum <span className="text-primary italic">Diarium</span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mb-12 leading-relaxed font-light">
              {t('landing.hero.voicesOfAntiquity') || 'Tauche ein in die Gedankenwelt der größten Persönlichkeiten der Antike.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/caesar">
                <Button size="lg" className="rounded-full px-8 h-14 text-base bg-primary transition-transform duration-300">
                  {t('landing.hero.discoverNow') || 'Jetzt entdecken'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/lexicon">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base border-border bg-background/50 backdrop-blur-sm">
                  <Library className="mr-2 h-5 w-5" />
                  {t('landing.hero.lexicon') || 'Lexikon'}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="py-24 bg-background/50 border-y border-border/50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-16 text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl font-sans mb-4 tracking-tight">Features</h2>
            <p className="max-w-xl text-muted-foreground text-lg font-light">
              Entdecke die verschiedenen Wege, wie du die Geschichte hautnah miterleben kannst.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bentoCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: card.delay }}
              >
                <Link
                  to={card.to}
                  className={`group relative flex flex-col h-full overflow-hidden rounded-[var(--radius)] border border-border bg-card/50 p-8 transition-all duration-500 ${card.className || ''}`}
                >
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-500">
                    <card.icon className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-sans mb-3 group-hover:text-primary transition-colors duration-300">{card.title}</h3>
                    <p className="text-muted-foreground leading-relaxed font-light">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-2 text-sm font-medium text-primary">
                    {card.cta} <ChevronRight className="h-4 w-4" />
                  </div>

                  {/* Decorative background for primary card */}
                  {card.className?.includes('bg-primary/5') && (
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Authors Section */}
      <section id="autoren" className="py-32 bg-background">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Perspektiven</p>
              <h2 className="text-4xl sm:text-5xl font-sans mb-6 tracking-tight">Wähle deinen Begleiter</h2>
              <p className="text-muted-foreground text-xl font-light italic">
                "Historia magistra vitae est."
              </p>
            </div>
          </div>
          <AuthorGrid />
        </div>
      </section>
    </div>
  );
}
