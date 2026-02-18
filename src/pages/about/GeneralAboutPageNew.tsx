import { Footer } from '@/components/layout/Footer';
import { useAuthor } from '@/context/AuthorContext';
import { BookOpen, Users, Clock, Sparkles, Globe2, Zap, Shield, Target, Code, BookMarked, Palette, ArrowLeft } from 'lucide-react';
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
      <main className="flex-1 container mx-auto px-6 pt-32 pb-24 max-w-screen-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
              <div className="w-8 h-[1px] bg-primary/30" />
              ÜBER DAS PROJEKT
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
              Geschichte <span className="text-primary italic">neu erleben</span>
            </h1>
            <p className="text-muted-foreground/60 max-w-2xl font-light leading-relaxed text-lg">
              Meum Diarium verbindet persönliche Tagebücher mit wissenschaftlicher Analyse. Erlebe die römische Geschichte durch die Augen ihrer bedeutendsten Persönlichkeiten - von Caesar über Cicero bis hin zu Augustus und Seneca. Unsere Plattform macht historisches Wissen durch moderne Technologie interaktiv und zugänglich.
            </p>
          </motion.div>
          <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors pr-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Zurück zum Start
          </Link>
        </div>
        
        {/* Hero Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
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

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-b from-background to-secondary/20 border-y border-border">
          <div className="container mx-auto max-w-screen-2xl px-6 sm:px-8">
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
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                {t('about.features.subtitle') || 'Eine umfassende Plattform für das Studium der römischen Geschichte mit modernster Technologie und wissenschaftlicher Fundierung'}
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

        {/* Historical Context Section */}
        <section className="py-20 bg-gradient-to-b from-secondary/10 to-background">
          <div className="container mx-auto max-w-screen-2xl px-6 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge variant="outline" className="mb-4 py-2 px-4 text-xs uppercase tracking-[0.2em]">
                Historischer Kontext
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Die Epoche, die alles veränderte
              </h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Tauche ein in die transformative Zeit vom Ende der Römischen Republik bis zur Entstehung des Kaiserreichs - eine Periode, die das westliche Denken für immer geprägt hat
              </p>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="p-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Der Übergang von Republik zu Kaiserreich</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Erlebe den dramatischen Wandel einer der einflussreichsten Gesellschaften der Geschichte. Von Caesars Überquerung des Rubikon über die Bürgerkriege bis zur Errichtung des Prinzipats unter Augustus - Meum Diarium dokumentiert diese entscheidende Jahrzehnte aus erster Hand.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
                      <span>100-44 v. Chr.: Der Aufstieg Caesars und der Niedergang der Republik</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
                      <span>44-31 v. Chr.: Bürgerkriege und das Ende der alten Ordnung</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
                      <span>27 v. Chr.-14 n. Chr.: Augustus und die Geburt des Kaiserreichs</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="p-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40">
                  <h3 className="text-2xl font-bold mb-4 text-primary">Die Protagonisten der Geschichte</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Lerne die Persönlichkeiten kennen, die den Lauf der Geschichte verändert haben. Ihre Gedanken, Entscheidungen und Emotionen werden durch historisch fundierte Tagebucheinträge lebendig und verständlich gemacht.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: "Julius Caesar", role: "Feldherr und Diktator" },
                      { name: "Marcus Tullius Cicero", role: "Redner und Staatsmann" },
                      { name: "Augustus", role: "Erster Kaiser Roms" },
                      { name: "Lucius Annaeus Seneca", role: "Philosoph und Berater" }
                    ].map((person, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{person.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-semibold">{person.name}</div>
                          <div className="text-sm text-muted-foreground">{person.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Methodology Section */}
        <section className="py-20">
          <div className="container mx-auto max-w-screen-2xl px-6 sm:px-8">
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
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                {t('about.methodology.subtitle') || 'Wissenschaftliche Genauigkeit trifft auf moderne Technologie - eine einzigartige Kombination aus historischer Forschung und interaktiver Erlebniswelt'}
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-screen-2xl mx-auto">
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

        {/* Educational Value Section */}
        <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto max-w-screen-2xl px-6 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge variant="outline" className="mb-4 py-2 px-4 text-xs uppercase tracking-[0.2em]">
                Bildungswert
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Geschichte, die begeistert und bildet
              </h2>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                Meum Diarium ist mehr als nur eine Wissenssammlung - es ist ein interaktives Lernerlebnis, das historisches Verständnis fördert und zur kritischen Auseinandersetzung anregt
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: BookOpen,
                  title: "Historisches Verständnis",
                  description: "Entwickle ein tiefes Verständnis für historische Zusammenhänge und ihre Relevanz für die Gegenwart",
                  gradient: "from-blue-500/20 to-blue-500/5"
                },
                {
                  icon: Users,
                  title: "Empathie und Perspektive",
                  description: "Lerne, historische Ereignisse aus verschiedenen Blickwinkeln zu betrachten und zu verstehen",
                  gradient: "from-green-500/20 to-green-500/5"
                },
                {
                  icon: Target,
                  title: "Kritisches Denken",
                  description: "Schärfe deine Fähigkeit zur Quellenkritik und historischen Analyse durch interaktive Inhalte",
                  gradient: "from-purple-500/20 to-purple-500/5"
                },
                {
                  icon: Globe2,
                  title: "Kulturelle Kompetenz",
                  description: "Erweitere dein Verständnis für antike Kultur und ihren Einfluss auf die westliche Zivilisation",
                  gradient: "from-orange-500/20 to-orange-500/5"
                }
              ].map((value, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative"
                >
                  <div className="relative h-full rounded-2xl border border-border/40 bg-card p-6 transition-all duration-500 hover:border-primary/50">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4`}>
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-background to-secondary/20 border-t border-border">
          <div className="container mx-auto max-w-screen-2xl px-6 sm:px-6 text-center">
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
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                {t('about.cta.description') || 'Tauche ein in die Welt des antiken Roms und erlebe Geschichte aus erster Hand. Entdecke die Gedanken, Entscheidungen und Emotionen der Menschen, die das westliche Denken geprägt haben.'}
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
