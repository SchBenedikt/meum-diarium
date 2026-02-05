import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { BookOpen, Users, Clock, Sparkles, Globe2, Zap, Shield, Target, Code, BookMarked, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
export function GeneralAboutPageNew() {
  const { setCurrentAuthor } = useAuthor();
  const { t } = useLanguage();
  useEffect(() => {
    setCurrentAuthor(null);
  }, [setCurrentAuthor]);
  const features = [
    {
      icon: Zap,
      title: t('about.features.aiDialogs') || 'KI-Dialoge',
      description: t('about.features.aiDialogsDesc') || 'Historische Gespräche mit römischen Persönlichkeiten durch KI',
      gradient: 'from-primary/20 to-primary/5',
    },
    {
      icon: BookOpen,
      title: t('about.features.dualPerspective') || 'Duale Perspektive',
      description: t('about.features.dualPerspectiveDesc') || 'Persönliches Tagebuch und wissenschaftliche Analyse',
      gradient: 'from-blue-500/20 to-blue-500/5',
    },
    {
      icon: Globe2,
      title: t('about.features.trilingual') || 'Dreisprachig',
      description: t('about.features.trilingualDesc') || 'Deutsch, Englisch und Latein vollständig verfügbar',
      gradient: 'from-green-500/20 to-green-500/5',
    },
    {
      icon: Shield,
      title: t('about.features.sourcesBased') || 'Quellenbasiert',
      description: t('about.features.sourcesBasedDesc') || 'Alle Inhalte basieren auf historischen Primärquellen',
      gradient: 'from-purple-500/20 to-purple-500/5',
    },
    {
      icon: Clock,
      title: t('about.features.timeline') || 'Zeitstrahl',
      description: t('about.features.timelineDesc') || '170+ Jahre römische Geschichte detailliert aufbereitet',
      gradient: 'from-orange-500/20 to-orange-500/5',
    },
    {
      icon: BookMarked,
      title: t('about.features.lexicon') || 'Lexikon',
      description: t('about.features.lexiconDesc') || '92+ umfassende Einträge zur römischen Antike',
      gradient: 'from-red-500/20 to-red-500/5',
    },
  ];
  const stats = [
    { value: '5', label: t('about.stats.authors') || 'Autoren', icon: Users },
    { value: '92+', label: t('about.stats.entries') || 'Lexikon-Einträge', icon: BookOpen },
    { value: '3', label: t('about.stats.languages') || 'Sprachen', icon: Globe2 },
    { value: '170+', label: t('about.stats.years') || 'Jahre Geschichte', icon: Clock },
  ];
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={t('about.pageTitle') || 'Über Meum Diarium'}
        description={t('about.pageDescription') || 'Erlebe römische Geschichte durch die Augen ihrer Protagonisten. KI-gestützt, quellenbasiert, interaktiv.'}
        tags={['Römische Geschichte', 'Caesar', 'Cicero', 'Augustus', 'Seneca', 'Catilina', 'Tagebuch', 'Wissenschaft']}
      />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 sm:py-32 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[150px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge variant="outline" className="mb-8 py-2 px-4 text-xs uppercase tracking-[0.2em] bg-background/50 backdrop-blur-sm border-primary/30 text-primary">
                <Sparkles className="mr-2 h-4 w-4" />
                {t('about.badge') || 'Über Das Projekt'}
              </Badge>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tighter">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  {t('about.hero.title1') || 'Geschichte'}
                </span>
                <br />
                <span className="text-foreground">
                  {t('about.hero.title2') || 'neu erleben'}
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed font-light mb-12 max-w-3xl mx-auto">
                {t('about.hero.description') || 'Meum Diarium verbindet persönliche Tagebücher mit wissenschaftlicher Analyse und macht die römische Geschichte durch modernste KI-Technologie erlebbar.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/caesar">
                  <Button size="lg" className="rounded-full px-8 h-14 text-base">
                    {t('about.hero.startExploring') || 'Jetzt erkunden'}
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/design">
                  <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base">
                    <Palette className="mr-2 h-5 w-5" />
                    {t('about.hero.designGuide') || 'Design-Guide'}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-b from-background to-secondary/20 border-y border-border">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge variant="outline" className="mb-4 py-2 px-4 text-xs uppercase tracking-[0.2em]">
                {t('about.features.badge') || 'Funktionen'}
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                {t('about.features.title') || 'Was Meum Diarium bietet'}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('about.features.subtitle') || 'Eine umfassende Plattform für das Studium der römischen Geschichte'}
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative"
                >
                  <div className="relative h-full rounded-2xl border border-border/40 bg-card p-8 transition-all duration-500 hover:border-primary/50">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center mb-6">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Methodology Section */}
        <section className="py-20">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge variant="outline" className="mb-4 py-2 px-4 text-xs uppercase tracking-[0.2em]">
                {t('about.methodology.badge') || 'Methodik'}
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                {t('about.methodology.title') || 'Wie wir arbeiten'}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('about.methodology.subtitle') || 'Wissenschaftliche Genauigkeit trifft auf moderne Technologie'}
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: BookOpen,
                  title: t('about.methodology.sources') || 'Primärquellen',
                  description: t('about.methodology.sourcesDesc') || 'Alle Inhalte basieren auf Original-Texten römischer Autoren und historischen Dokumenten.',
                },
                {
                  icon: Target,
                  title: t('about.methodology.analysis') || 'Wissenschaftliche Analyse',
                  description: t('about.methodology.analysisDesc') || 'Jeder Eintrag wird historisch eingeordnet und mit wissenschaftlichen Kommentaren versehen.',
                },
                {
                  icon: Code,
                  title: t('about.methodology.technology') || 'KI-Technologie',
                  description: t('about.methodology.technologyDesc') || 'Moderne KI hilft bei der Darstellung und macht Geschichte interaktiv erlebbar.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-background to-secondary/20 border-t border-border">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/20 blur-3xl" />
                <h2 className="relative text-4xl sm:text-5xl font-bold tracking-tight">
                  {t('about.cta.title') || 'Bereit, Geschichte zu entdecken?'}
                </h2>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('about.cta.description') || 'Tauche ein in die Welt des antiken Roms und erlebe Geschichte aus erster Hand'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/caesar">
                  <Button size="lg" className="rounded-full px-10 h-16 text-lg">
                    {t('about.cta.start') || 'Jetzt starten'}
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/lexicon">
                  <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg">
                    <BookOpen className="mr-2 h-5 w-5" />
                    {t('about.cta.lexicon') || 'Lexikon durchsuchen'}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
