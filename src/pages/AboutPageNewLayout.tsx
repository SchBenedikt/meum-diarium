import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthor } from '@/context/AuthorContext';
import { useLanguage } from '@/context/LanguageContext';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fadeUp, staggerContainer, defaultTransition } from '@/lib/motion';
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
  ArrowLeft,
  Sparkles,
  Palette,
  Star,
  TrendingUp,
  Award
} from 'lucide-react';
import React from 'react';
import { AuthorGrid } from '@/components/AuthorGrid';
import { FeatureShowcase } from '@/components/home/FeatureShowcase';

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
      title: t('about.features.trilingual') || 'Dreisprachig',
      description: t('about.features.trilingualDesc') || 'Deutsch, Englisch und Latein vollständig verfügbar',
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
    { value: '3', label: t('about.stats.languages') || 'Sprachen', icon: Globe2 },
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
      
      <main className="flex-1 px-4 pt-32 pb-24">
        {/* Hero Section - Landing Page Style */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
        <div className="container mx-auto px-4 sm:px-6 pt-32 pb-24 relative max-w-none">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.1)}
            className="text-center space-y-8"
          >
            <motion.div variants={fadeUp(0)}>
              <div className="flex justify-center gap-3 mb-6">
                <Badge variant="secondary" className="px-4 py-2 text-xs font-medium">
                  <Sparkles className="mr-2 h-3 w-3" />
                  Über das Projekt
                </Badge>
                <Badge variant="outline" className="px-4 py-2 text-xs font-medium">
                  <Award className="mr-2 h-3 w-3" />
                  Bildung & Geschichte
                </Badge>
              </div>
              <h1 className="font-bricolage text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                Geschichte <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">neu erleben</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Meum Diarium verbindet persönliche Tagebücher mit wissenschaftlicher Analyse. 
                Erlebe die römische Geschichte durch die Augen ihrer bedeutendsten Persönlichkeiten.
              </p>
            </motion.div>
            
            <motion.div variants={fadeUp(0.2)} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/caesar">
                <Button size="lg" className="rounded-full px-8 h-14 text-base bg-primary hover:bg-primary/90">
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Landing Page Style */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer(0.1)}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp(0)}>
              <div className="flex items-center justify-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                <div className="w-8 h-[1px] bg-primary/30" />
                STATISTIKEN
                <div className="w-8 h-[1px] bg-primary/30" />
              </div>
              <h2 className="font-bricolage text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                {t('about.stats.title') || 'Beeindruckende Zahlen'}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('about.stats.subtitle') || 'Ein umfassender Einblick in die römische Geschichte'}
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer(0.1)}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp(i * 0.1)}
                className="relative group"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`w-14 h-14 rounded-xl ${stat.icon === Users ? 'bg-primary/10' : stat.icon === BookOpen ? 'bg-blue-500/10' : stat.icon === Globe2 ? 'bg-green-500/10' : 'bg-orange-500/10'} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className={`w-7 h-7 ${stat.icon === Users ? 'text-primary' : stat.icon === BookOpen ? 'text-blue-500' : stat.icon === Globe2 ? 'text-green-500' : 'text-orange-500'}`} />
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid - Landing Page Style */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer(0.1)}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp(0)}>
              <div className="flex items-center justify-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                <div className="w-8 h-[1px] bg-primary/30" />
                FUNKTIONEN
                <div className="w-8 h-[1px] bg-primary/30" />
              </div>
              <h2 className="font-bricolage text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                {t('about.features.title') || 'Was Meum Diarium bietet'}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('about.features.subtitle') || 'Eine umfassende Plattform für das Studium der römischen Geschichte'}
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer(0.1)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUp(i * 0.1)}
                className="group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    <h3 className="font-bricolage text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Author Showcase Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer(0.1)}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp(0)}>
              <div className="flex items-center justify-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                <div className="w-8 h-[1px] bg-primary/30" />
                HISTORISCHE PERSÖNLICHKEITEN
                <div className="w-8 h-[1px] bg-primary/30" />
              </div>
              <h2 className="font-bricolage text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Die Protagonisten der Geschichte
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Lerne die Persönlichkeiten kennen, die den Lauf der Geschichte verändert haben
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp(0.2)}
          >
            <AuthorGrid />
          </motion.div>
        </div>
      </section>

      {/* Methodology Section - Landing Page Style */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer(0.1)}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp(0)}>
              <div className="flex items-center justify-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                <div className="w-8 h-[1px] bg-primary/30" />
                METHODIK
                <div className="w-8 h-[1px] bg-primary/30" />
              </div>
              <h2 className="font-bricolage text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                {t('about.methodology.title') || 'Wie wir arbeiten'}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('about.methodology.subtitle') || 'Wissenschaftliche Genauigkeit trifft auf moderne Technologie'}
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer(0.1)}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {methodology.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp(i * 0.1)}
                className="group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm hover:-translate-y-1">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 rounded-xl ${item.bg} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className={`w-8 h-8 ${item.color}`} />
                    </div>
                    <h3 className="font-bricolage text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Showcase */}
      <FeatureShowcase />

      {/* CTA Section - Landing Page Style */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer(0.1)}
            className="space-y-8"
          >
            <motion.div variants={fadeUp(0)}>
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 blur-xl rounded-full" />
                <h2 className="relative font-bricolage text-4xl sm:text-5xl font-bold tracking-tight">
                  {t('about.cta.title') || 'Bereit, Geschichte zu entdecken?'}
                </h2>
              </div>
            </motion.div>
            
            <motion.p variants={fadeUp(0.2)} className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('about.cta.description') || 'Tauche ein in die Welt des antiken Roms und erlebe Geschichte aus erster Hand'}
            </motion.p>
            
            <motion.div variants={fadeUp(0.4)} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/caesar">
                <Button size="lg" className="rounded-full px-10 h-16 text-lg bg-primary hover:bg-primary/90">
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
            </motion.div>
          </motion.div>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
}
