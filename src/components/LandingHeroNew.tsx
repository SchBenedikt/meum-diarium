import type { ElementType } from 'react';
import { Sparkles, MessageCircle, BookOpen, Map, Library, ArrowRight, Users, Bookmark, ChevronRight, Globe, Clock, Award, Zap, Shield, Scroll, Cpu, Play, Headphones, FileText, Search, Star, TrendingUp, Heart, Brain } from 'lucide-react';
import { AuthorGrid } from './AuthorGrid';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { usePosts } from '@/hooks/use-posts';
import { BlogCard } from './BlogCard';
import { FeatureShowcase } from './home/FeatureShowcase';
import { ImageWithFallback } from './ui/ImageWithFallback';
import ParallaxHero from './ParallaxHero';
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
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      iconColor: 'text-blue-500'
    },
    {
      icon: Library,
      title: t('landing.features.lexiconTitle') || 'Lexikon',
      description: t('landing.features.lexiconDesc') || '92+ Einträge zur römischen Antike',
      bgColor: 'bg-amber-100 dark:bg-amber-900/20',
      iconColor: 'text-amber-500'
    },
    {
      icon: Globe,
      title: t('landing.features.multilingual') || 'Mehrsprachig',
      description: t('landing.features.multilingualDesc') || 'Deutsch, Englisch und Latein',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      iconColor: 'text-green-500'
    },
    {
      icon: Clock,
      title: t('landing.features.timelineTitle') || 'Zeitstrahl',
      description: t('landing.features.timelineDesc') || '170+ Jahre römische Geschichte',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      iconColor: 'text-purple-500'
    },
    {
      icon: Scroll,
      title: t('landing.features.works') || 'Werke',
      description: t('landing.features.worksDesc') || 'Originalwerke und Analysen',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      iconColor: 'text-orange-500'
    },
    {
      icon: Brain,
      title: 'Intelligente Lernhilfe',
      description: 'Personalisierte Lernpfade und adaptive Übungen',
      bgColor: 'bg-pink-100 dark:bg-pink-900/20',
      iconColor: 'text-pink-500'
    },
  ];

  const learningTools = [
    {
      icon: BookOpen,
      title: 'Grammatik-Lernen',
      description: 'Interaktive Latein-Grammatik mit Übungen',
      link: '/learn/grammar',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      iconColor: 'text-green-500'
    },
    {
      icon: FileText,
      title: 'Text-Reader',
      description: 'Originaltexte mit Übersetzungen und Analysen',
      link: '/reader',
      bgColor: 'bg-amber-100 dark:bg-amber-900/20',
      iconColor: 'text-amber-500'
    },
    {
      icon: Search,
      title: 'Vokabeltrainer',
      description: '36.000+ lateinische Vokabeln lernen',
      link: '/vocab',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
      iconColor: 'text-indigo-500'
    },
    {
      icon: Headphones,
      title: 'Rhetorik-Labor',
      description: 'Redekunst und rhetorische Figuren entdecken',
      link: '/learn/rhetoric',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      iconColor: 'text-purple-500'
    },
  ];

  const stats = [
    { value: '4', label: 'Historische Persönlichkeiten' },
    { value: '36K', label: 'Vokabeln' },
    { value: '50', label: 'Artikel' },
    { value: '6', label: 'Lern-Tools' },
  ];
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Hero Section with Parallax Effect */}
      <ParallaxHero />
      
      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5 relative z-10">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-bricolage font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Features Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bricolage font-bold text-foreground mb-4">
              Alles für dein Latein-Erlebnis
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Moderne Tools und Inhalte, die das Lernen erleichtern und begeistern
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer h-full">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                        <Icon className={`h-8 w-8 ${feature.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learning Tools Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bricolage-grotesque font-bold text-foreground mb-4">
              Lern-Tools
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Interaktive Werkzeuge für ein modernes Latein-Lernerlebnis
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningTools.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link to={tool.link} className="group">
                    <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer h-full">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`p-3 rounded-lg ${tool.bgColor}`}>
                          <Icon className={`h-8 w-8 ${tool.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Author Cards Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bricolage-grotesque font-bold text-foreground text-center mb-4">
              Historische Persönlichkeiten
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto">
              Treffe die größten Denker und Herrscher des antiken Roms
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Julius Caesar', description: 'Feldherr und Diktator', image: '/images/caesar-hero.jpg', link: '/caesar' },
              { name: 'Cicero', description: 'Redner und Philosoph', image: '/images/cicero-hero.jpg', link: '/cicero' },
              { name: 'Augustus', description: 'Erster Kaiser', image: '/images/augustus-hero.jpg', link: '/augustus' },
              { name: 'Seneca', description: 'Stoischer Philosoph', image: '/images/seneca-hero.jpg', link: '/seneca' },
            ].map((author, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link to={author.link} className="group">
                  <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer h-full">
                    <div className="flex flex-col items-center text-center space-y-6">
                      <div className="w-24 h-24 rounded-xl bg-secondary/50 overflow-hidden">
                        <ImageWithFallback
                          src={author.image}
                          alt={author.name}
                          className="w-full h-full object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-3">{author.name}</h3>
                        <p className="text-base text-muted-foreground leading-relaxed">{author.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Insights - Blog Posts */}
      {!isLoading && recentPosts.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-6"
            >
              <div className="max-w-2xl">
                <h2 className="text-3xl sm:text-4xl font-bricolage-grotesque font-bold text-foreground mb-4">
                  Neuste Einträge
                </h2>
                <p className="text-muted-foreground text-lg">
                  Die neuesten Beiträge aus den Tagebüchern
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/search">
                  <Button variant="ghost" className="text-primary hover:text-primary/80 group text-lg h-auto px-0 hover:bg-transparent">
                    Alle anzeigen
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
      {/* Enhanced Call to Action Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 to-secondary/10 border-t border-border">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-2 text-sm font-medium">
                <Heart className="mr-2 h-4 w-4" />
                Made with Love for Latin Learners
              </Badge>
              <h2 className="text-4xl sm:text-5xl font-bricolage-grotesque font-bold text-foreground">
                Bereit für deine Zeitreise?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Beginne jetzt deine Reise durch die faszinierende Welt des antiken Roms und entdecke Latein wie nie zuvor.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Link to="/caesar">
                <Button size="lg" className="rounded-full px-12 py-4 text-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Jetzt starten
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="rounded-full px-12 py-4 text-lg bg-background text-foreground border-border hover:bg-secondary/50 transition-all duration-300">
                  Mehr erfahren
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-12">
              {[
                { icon: BookOpen, label: 'Kostenlos' },
                { icon: Shield, label: 'Sicher' },
                { icon: Users, label: 'Community' },
                { icon: Award, label: 'Qualität' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex flex-col items-center space-y-2"
                >
                  <div className="p-3 bg-background/80 rounded-xl">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
