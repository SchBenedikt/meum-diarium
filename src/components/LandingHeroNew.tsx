import type { ElementType } from 'react';
import { Sparkles, MessageCircle, BookOpen, Map, Library, ArrowRight, Users, Bookmark, ChevronRight, Globe, Clock, Award, Zap, Shield, Scroll } from 'lucide-react';
import { AuthorGrid } from './AuthorGrid';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { usePosts } from '@/hooks/use-posts';
import { BlogCard } from './BlogCard';
import { FeatureShowcase } from './home/FeatureShowcase';

export default function LandingHeroNew() {
  const { t } = useLanguage();
  const { posts, isLoading } = usePosts();

  const recentPosts = posts
    ? [...posts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6)
    : [];

  const features = [
    {
      icon: Zap,
      title: t('landing.features.aiChat') || 'KI-Gespräche',
      description: t('landing.features.aiChatDesc') || 'Historische Dialoge mit römischen Persönlichkeiten',
      color: 'from-primary/20 to-primary/10',
    },
    {
      icon: Library,
      title: t('landing.features.lexiconTitle') || 'Lexikon',
      description: t('landing.features.lexiconDesc') || '92+ Einträge zur römischen Antike',
      color: 'from-blue-500/20 to-blue-500/10',
    },
    {
      icon: Globe,
      title: t('landing.features.multilingual') || 'Mehrsprachig',
      description: t('landing.features.multilingualDesc') || 'Deutsch, Englisch und Latein',
      color: 'from-green-500/20 to-green-500/10',
    },
    {
      icon: Clock,
      title: t('landing.features.timelineTitle') || 'Zeitstrahl',
      description: t('landing.features.timelineDesc') || '170+ Jahre römische Geschichte',
      color: 'from-purple-500/20 to-purple-500/10',
    },
    {
      icon: Scroll,
      title: t('landing.features.works') || 'Werke',
      description: t('landing.features.worksDesc') || 'Originalwerke und Analysen',
      color: 'from-orange-500/20 to-orange-500/10',
    },
    {
      icon: Shield,
      title: t('landing.features.authentic') || 'Authentisch',
      description: t('landing.features.authenticDesc') || 'Quellenbasiert und historisch fundiert',
      color: 'from-red-500/20 to-red-500/10',
    },
  ];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-primary/3 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Hero Section - Completely Redesigned */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div>
                <Badge variant="outline" className="mb-6 py-2 px-4 text-xs uppercase tracking-[0.2em] bg-background/50 backdrop-blur-sm border-primary/30 text-primary">
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t('landing.hero.badge') || 'Erlebe Geschichte Neu'}
                </Badge>

                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl mb-6 text-foreground leading-[1.1] tracking-tighter font-extrabold">
                  <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    {t('landing.hero.title1') || 'Geschichte'}
                  </span>
                  <br />
                  <span className="text-foreground">
                    {t('landing.hero.title2') || 'zum Leben erweckt'}
                  </span>
                </h1>

                <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed font-light mb-8">
                  {t('landing.hero.description') || 'Tauche ein in die Gedankenwelt der größten Persönlichkeiten des antiken Roms. KI-gestützt. Quellenbasiert. Interaktiv.'}
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/caesar">
                    <Button size="lg" className="rounded-full px-8 h-14 text-base bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/50">
                      {t('landing.hero.startJourney') || 'Reise beginnen'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/lexicon">
                    <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base border-border hover:bg-secondary/50 backdrop-blur-sm transition-all duration-300">
                      <Library className="mr-2 h-5 w-5" />
                      {t('landing.hero.exploreLexicon') || 'Lexikon erkunden'}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4 pt-8 border-t border-border/50">
                {[
                  { value: '92+', label: t('landing.stats.entries') || 'Einträge' },
                  { value: '5', label: t('landing.stats.authors') || 'Autoren' },
                  { value: '3', label: t('landing.stats.languages') || 'Sprachen' },
                  { value: '170+', label: t('landing.stats.years') || 'Jahre' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Visual Element */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
                <img 
                  src="/images/caesar-hero.jpg" 
                  alt="Julius Caesar"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                
                {/* Overlay content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 space-y-3">
                  {[
                    { icon: MessageCircle, text: t('landing.hero.feature1') || 'Historische KI-Dialoge' },
                    { icon: BookOpen, text: t('landing.hero.feature2') || 'Umfassendes Lexikon' },
                    { icon: Map, text: t('landing.hero.feature3') || 'Interaktive Zeitreisen' },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                      className="flex items-center gap-3 text-foreground/90 backdrop-blur-sm"
                    >
                      <feature.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 w-24 h-24 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center"
              >
                <Award className="w-12 h-12 text-primary" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center"
              >
                <Globe className="w-16 h-16 text-primary" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid - Modern Cards */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4 py-2 px-4 text-xs uppercase tracking-[0.2em]">
              {t('landing.features.badge') || 'Funktionen'}
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              {t('landing.features.title') || 'Alles was du brauchst'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('landing.features.subtitle') || 'Eine umfassende Plattform für das Studium der römischen Antike'}
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
                <div className="relative h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Authors Section with Enhanced Design */}
      <section id="autoren" className="py-20 bg-background border-y border-border">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4 py-2 px-4 text-xs uppercase tracking-[0.2em]">
              {t('landing.authors.badge') || 'Persönlichkeiten'}
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              {t('landing.authors.title') || 'Die Stimmen der Antike'}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('landing.authors.subtitle') || 'Entdecke die Tagebücher und Werke der größten römischen Persönlichkeiten'}
            </p>
          </motion.div>
          
          <AuthorGrid />
        </div>
      </section>

      {/* Recent Insights - Blog Posts */}
      {!isLoading && recentPosts.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-6"
            >
              <div className="max-w-2xl">
                <Badge variant="outline" className="mb-4 py-2 px-4 text-xs uppercase tracking-[0.2em]">
                  {t('landing.recent.badge') || 'Aktuell'}
                </Badge>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                  {t('landing.recent.title') || 'Neuste Einträge'}
                </h2>
                <p className="text-xl text-muted-foreground">
                  {t('landing.recent.subtitle') || 'Die neuesten Beiträge aus den Tagebüchern'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/search">
                  <Button variant="ghost" className="text-primary hover:text-primary/80 group text-lg h-auto px-0 hover:bg-transparent">
                    {t('landing.recent.viewAll') || 'Alle anzeigen'}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.slice(0, 6).map((post, i) => (
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

      {/* Call to Action Section */}
      <section className="py-20 bg-background border-t border-border">
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
                {t('landing.cta.title') || 'Bereit für deine Zeitreise?'}
              </h2>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('landing.cta.description') || 'Beginne jetzt deine Reise durch die faszinierende Welt des antiken Roms'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/caesar">
                <Button size="lg" className="rounded-full px-10 h-16 text-lg bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/50">
                  {t('landing.cta.start') || 'Jetzt starten'}
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="rounded-full px-10 h-16 text-lg border-border hover:bg-secondary/50 transition-all duration-300">
                  {t('landing.cta.learnMore') || 'Mehr erfahren'}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
