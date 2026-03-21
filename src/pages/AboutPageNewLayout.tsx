import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthor } from '@/context/AuthorContext';
import { useLanguage } from '@/context/LanguageContext';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { 
  ArrowRight, 
  Zap, 
  BookOpen, 
  Globe2, 
  Shield, 
  Clock, 
  Users, 
  Target,
  Code,
  Sparkles,
  Award
} from 'lucide-react';
import React from 'react';
import { AuthorGrid } from '@/components/AuthorGrid';

export default function AboutPageNew() {
  const { setCurrentAuthor } = useAuthor();
  const { t } = useLanguage();

  // Reset author when entering about page
  React.useEffect(() => {
    setCurrentAuthor(null);
  }, [setCurrentAuthor]);

  const features = [
    {
      icon: Zap,
      title: t('about.features.aiDialogs') || 'KI-Dialoge',
      description: t('about.features.aiDialogsDesc') || 'Historische Gespräche mit römischen Persönlichkeiten durch KI',
      gradient: 'from-primary/20 to-primary/5',
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      icon: BookOpen,
      title: t('about.features.dualPerspective') || 'Duale Perspektive',
      description: t('about.features.dualPerspectiveDesc') || 'Persönliches Tagebuch und wissenschaftliche Analyse',
      gradient: 'from-blue-500/20 to-blue-500/5',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      icon: Globe2,
      title: t('about.features.learningPlatform') || 'Lernplattform',
      description: t('about.features.learningPlatformDesc') || 'Grammatik, Rhetorik, Reader und Übungen in einer Oberfläche',
      gradient: 'from-green-500/20 to-green-500/5',
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    {
      icon: Shield,
      title: t('about.features.sourcesBased') || 'Quellenbasiert',
      description: t('about.features.sourcesBasedDesc') || 'Alle Inhalte basieren auf historischen Primärquellen',
      gradient: 'from-purple-500/20 to-purple-500/5',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    {
      icon: Clock,
      title: t('about.features.timeline') || 'Zeitstrahl',
      description: t('about.features.timelineDesc') || '170+ Jahre römische Geschichte detailliert aufbereitet',
      gradient: 'from-orange-500/20 to-orange-500/5',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    {
      icon: BookOpen,
      title: t('about.features.lexicon') || 'Lexikon',
      description: t('about.features.lexiconDesc') || '92+ umfassende Einträge zur römischen Antike',
      gradient: 'from-red-500/20 to-red-500/5',
      color: 'text-red-500',
      bg: 'bg-red-500/10'
    },
  ];

  const stats = [
    { value: '5', label: t('about.stats.authors') || 'Autoren', icon: Users },
    { value: '92+', label: t('about.stats.entries') || 'Lexikon-Einträge', icon: BookOpen },
    { value: '2', label: t('about.stats.perspectives') || 'Perspektiven', icon: Globe2 },
    { value: '170+', label: t('about.stats.years') || 'Jahre Geschichte', icon: Clock },
  ];

  const methodology = [
    {
      icon: BookOpen,
      title: t('about.methodology.sources') || 'Primärquellen',
      description: t('about.methodology.sourcesDesc') || 'Alle Inhalte basieren auf Original-Texten römischer Autoren und historischen Dokumenten.',
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      icon: Target,
      title: t('about.methodology.analysis') || 'Wissenschaftliche Analyse',
      description: t('about.methodology.analysisDesc') || 'Jeder Eintrag wird historisch eingeordnet und mit wissenschaftlichen Kommentaren versehen.',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      icon: Code,
      title: t('about.methodology.technology') || 'KI-Technologie',
      description: t('about.methodology.technologyDesc') || 'Moderne KI hilft bei der Darstellung und macht Geschichte interaktiv erlebbar.',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={t('about.pageTitle') || 'Über Meum Diarium'}
        description={t('about.pageDescription') || 'Erlebe römische Geschichte durch die Augen ihrer Protagonisten. KI-gestützt, quellenbasiert, interaktiv.'}
        tags={['Römische Geschichte', 'Caesar', 'Cicero', 'Augustus', 'Seneca', 'Catilina', 'Tagebuch', 'Wissenschaft']}
      />
      <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.08)}
          className="mb-16"
        >
          <motion.div variants={fadeUp(0)} className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                <div className="w-8 h-[1px] bg-primary/30" />
                ÜBER DAS PROJEKT
              </div>
              <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
                Geschichte <span className="text-primary italic">neu erleben</span>
              </h1>
              <p className="text-muted-foreground/70 max-w-2xl font-light leading-relaxed text-lg">
                Meum Diarium verbindet historische Primärquellen mit modernen Interfaces. Statt statischer Wissensseiten entsteht ein Lernraum aus Tagebuchperspektive, Analyse und interaktiver Exploration.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/caesar">
                <Button className="rounded-full h-12 px-7">
                  {t('about.hero.startExploring') || 'Jetzt erkunden'}
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/learn">
                <Button variant="outline" className="rounded-full h-12 px-7">
                  Lernen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div variants={fadeUp(0.08)} className="card-modern card-padding-md border-border/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border/40 bg-secondary/40 p-4 sm:p-5">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-display font-bold leading-none">{stat.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="h-5 w-5 text-primary" />
            <h2 className="font-display text-3xl font-bold">Was Meum Diarium besonders macht</h2>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer(0.08)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => (
              <motion.article
                key={feature.title}
                variants={fadeUp(i * 0.05)}
                className="card-modern card-hover-primary card-padding-md group"
              >
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${feature.bg}`}>
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground/80 leading-relaxed">{feature.description}</p>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="font-display text-3xl font-bold">Methodik</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {methodology.map((item, i) => (
              <Card key={item.title} className="card-modern border-border/50">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`h-12 w-12 rounded-xl ${item.bg} flex items-center justify-center`}>
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
                      Schritt {i + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground/80 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="font-display text-3xl font-bold">Historische Persönlichkeiten</h2>
          </div>
          <div className="card-modern card-padding-md">
            <AuthorGrid />
          </div>
        </section>

        <section className="card-modern card-padding-lg border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-background">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold mb-4">NÄCHSTER SCHRITT</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              {t('about.cta.title') || 'Bereit, Geschichte zu entdecken?'}
            </h2>
            <p className="text-muted-foreground/80 text-lg leading-relaxed mb-8">
              {t('about.cta.description') || 'Tauche ein in die Welt des antiken Roms und erlebe Geschichte aus erster Hand'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/caesar">
                <Button className="rounded-full h-12 px-7">
                  {t('about.cta.start') || 'Jetzt starten'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/lexicon">
                <Button variant="outline" className="rounded-full h-12 px-7">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {t('about.cta.lexicon') || 'Lexikon durchsuchen'}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
