import type { ElementType } from 'react';
import { Sparkles, MessageCircle, BookOpen, Map, Library, ArrowRight, Users, Bookmark, ChevronRight, Clock, Award, Zap, Shield, Scroll, Cpu, Play, Star, TrendingUp, Heart, Brain, Calendar, User } from 'lucide-react';
import { AuthorGrid } from './AuthorGrid';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { usePosts } from '@/hooks/use-posts';
import { BlogCard } from './BlogCard';
import { FeatureShowcase } from './home/FeatureShowcase';
import { ImageWithFallback } from './ui/ImageWithFallback';
import ParallaxHero from './ParallaxHero';
import { useState, useEffect } from 'react';
import { Author } from '@/types/blog';
import AnimatedCounter from './AnimatedCounter';

export default function LandingHeroNew() {
  const { t } = useLanguage();
  const { posts, isLoading } = usePosts();
  const [selectedAuthor, setSelectedAuthor] = useState<Author>('caesar');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const recentPosts = posts
    ? [...posts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6)
    : [];

  const authors = [
    { 
      id: 'caesar' as Author, 
      name: 'Julius Caesar', 
      full: 'Gaius Iulius Caesar',
      role: 'Feldherr & Staatsmann', 
      years: '100–44 v. Chr.', 
      description: 'Der berühmte römische Feldherr und Diktator, der den Rubikon überschritt und Rom als Alleinherrscher regierte.',
      image: '/images/caesar-hero.png',
      quote: 'Veni, vidi, vici.',
      color: 'from-red-600 to-orange-600'
    },
    { 
      id: 'cicero' as Author, 
      name: 'Marcus Cicero', 
      full: 'Marcus Tullius Cicero',
      role: 'Redner & Philosoph', 
      years: '106–43 v. Chr.', 
      description: 'Der größte römische Redner und Philosoph, bekannt für seine Reden gegen Catilina und seine philosophischen Werke.',
      image: '/images/cicero-hero.png',
      quote: 'O tempora, o mores.',
      color: 'from-blue-600 to-indigo-600'
    },
    { 
      id: 'augustus' as Author, 
      name: 'Augustus', 
      full: 'Gaius Octavius Augustus',
      role: 'Erster Kaiser Roms', 
      years: '63 v. Chr.–14 n. Chr.', 
      description: 'Der erste römische Kaiser, der nach Caesars Tod das Reich befriedete und die Pax Romana einleitete.',
      image: '/images/augustus-hero.png',
      quote: 'Festina lente.',
      color: 'from-amber-600 to-yellow-600'
    },
    { 
      id: 'seneca' as Author, 
      name: 'Lucius Seneca', 
      full: 'Lucius Annaeus Seneca',
      role: 'Stoischer Philosoph', 
      years: '4 v. Chr.–65 n. Chr.', 
      description: 'Der bedeutende stoische Philosoph, Lehrer Neros und Verfasser zahlreicher philosophischer Schriften und Dramen.',
      image: '/images/seneca-hero.png',
      quote: 'Dum differtur vita transcurrit.',
      color: 'from-green-600 to-teal-600'
    },
    { 
      id: 'sokrates' as Author, 
      name: 'Sokrates', 
      full: 'Sokrates',
      role: 'Philosoph', 
      years: '469–399 v. Chr.', 
      description: 'Der Begründer der abendländischen Philosophie, der durch seine bohrenden Fragen und sein unerschütterliches Streben nach Wahrheit Athen herausforderte.',
      image: '/images/sokrates-hero.png',
      quote: 'Ich weiß, dass ich nichts weiß.',
      color: 'from-sky-600 to-blue-600'
    },
    { 
      id: 'sallust' as Author, 
      name: 'Sallust', 
      full: 'Gaius Sallustius Crispus',
      role: 'Historiker', 
      years: '86–35 v. Chr.', 
      description: 'Ein bedeutender römischer Historiker, der für seine prägnanten Analysen des moralischen Verfalls Roms und der politischen Korruption bekannt ist.',
      image: '/images/sallust-hero.png',
      quote: 'Tugend ist das einzige unvergängliche Gut.',
      color: 'from-purple-600 to-fuchsia-600'
    },
    { 
      id: 'catilina' as Author, 
      name: 'Catilina', 
      full: 'Lucius Sergius Catilina',
      role: 'Verschwörer', 
      years: '108–62 v. Chr.', 
      description: 'Der berüchtigte Gegenspieler Ciceros, der eine gewaltsame Umwälzung der Republik plante und als Symbol für den inneren Zerfall Roms gilt.',
      image: '/images/catilina-hero.png',
      quote: 'Das Unglück macht die Menschen kühn.',
      color: 'from-zinc-700 to-stone-900'
    },
  ];

  const currentAuthorData = authors.find(a => a.id === selectedAuthor);
  const authorPosts = posts
    ? posts
        .filter(post => post.author === selectedAuthor)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3)
    : [];

  const handleAuthorSelect = (authorId: Author) => {
    if (authorId === selectedAuthor) return;
    
    setIsTransitioning(true);
    
    // Add a small delay for smooth transition
    setTimeout(() => {
      setSelectedAuthor(authorId);
      setIsTransitioning(false);
    }, 150);
  };
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

  
  const stats = [
    { value: '7', label: 'Historische Persönlichkeiten', delay: 0 },
    { value: '36000', label: 'Vokabeln', delay: 0.2 },
    { value: '50', label: 'Artikel', delay: 0.4 },
    { value: '92+', label: 'Lexikon-Einträge', delay: 0.6 },
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
              <AnimatedCounter
                key={i}
                endValue={stat.value}
                label={stat.label}
                delay={stat.delay}
              />
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

            {/* Historical Personalities Section - Two Column Layout */}
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
              Historische Persönlichkeiten
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Entdecke die größten Denker und Herrscher des antiken Roms
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Selected Author Details */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {currentAuthorData && (
                  <motion.div
                    key={selectedAuthor}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <Card className="p-8 h-full">
                      <div className="space-y-6">
                        {/* Author Header */}
                        <motion.div 
                          className="flex items-start gap-6"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="w-20 h-20 rounded-xl bg-secondary/50 overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={currentAuthorData.image}
                              alt={currentAuthorData.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <motion.h3 
                              className="text-2xl font-bold text-foreground mb-1"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              {currentAuthorData.full}
                            </motion.h3>
                            <motion.p 
                              className="text-muted-foreground mb-2"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.25 }}
                            >
                              {currentAuthorData.role}
                            </motion.p>
                            <motion.div 
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <Calendar className="h-4 w-4" />
                              <span>{currentAuthorData.years}</span>
                            </motion.div>
                          </div>
                        </motion.div>

                        {/* Quote */}
                        <motion.blockquote 
                          className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 }}
                        >
                          "{currentAuthorData.quote}"
                        </motion.blockquote>

                        {/* Description */}
                        <motion.p 
                          className="text-muted-foreground leading-relaxed"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          {currentAuthorData.description}
                        </motion.p>

                        {/* Action Buttons */}
                        <motion.div 
                          className="flex gap-3 pt-4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.45 }}
                        >
                          <Link to={`/${currentAuthorData.id}`}>
                            <Button className="rounded-full">
                              <User className="mr-2 h-4 w-4" />
                              Profil besuchen
                            </Button>
                          </Link>
                          <Link to={`/${currentAuthorData.id}/chat`}>
                            <Button variant="outline" className="rounded-full">
                              <MessageCircle className="mr-2 h-4 w-4" />
                              Chat starten
                            </Button>
                          </Link>
                        </motion.div>

                        {/* Recent Blog Posts */}
                        {authorPosts.length > 0 && (
                          <motion.div 
                            className="pt-6 border-t border-border"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-primary" />
                              Neueste Beiträge
                              <Badge variant="secondary" className="text-xs">
                                {authorPosts.length}
                              </Badge>
                            </h4>
                            <div className="space-y-3">
                              {authorPosts.map((post, i) => (
                                <motion.div
                                  key={post.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.6 + i * 0.1 }}
                                >
                                  <Link to={`/${currentAuthorData.id}/${post.slug}`}>
                                    <div className="p-3 rounded-lg bg-card/50 hover:bg-card border border-border/50 hover:border-primary/30 transition-all duration-200 cursor-pointer group">
                                      <h5 className="font-medium text-foreground group-hover:text-primary transition-colors mb-1">
                                        {post.diaryTitle || post.title}
                                      </h5>
                                      <p className="text-sm text-muted-foreground line-clamp-2">
                                        {post.excerpt}
                                      </p>
                                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        <span>{new Date(post.date).toLocaleDateString('de-DE')}</span>
                                        {post.readingTime && (
                                          <>
                                            <span>•</span>
                                            <span>{post.readingTime} Min. Lesezeit</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                            {authorPosts.length >= 3 && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9 }}
                              >
                                <Link to={`/${currentAuthorData.id}`} className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 mt-3 transition-colors">
                                  Alle Beiträge ansehen
                                  <ArrowRight className="h-3 w-3" />
                                </Link>
                              </motion.div>
                            )}
                          </motion.div>
                        )}

                        {/* No posts state */}
                        {!isLoading && authorPosts.length === 0 && (
                          <motion.div 
                            className="pt-6 border-t border-border text-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground">Noch keine Beiträge von {currentAuthorData.name} verfügbar.</p>
                          </motion.div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Loading overlay */}
              {isTransitioning && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </div>

            {/* Right Column - Author Selection */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Wähle eine Persönlichkeit
              </h3>
              <div className="space-y-4">
                {authors.filter(a => a.id !== selectedAuthor).map((author) => (
                  <div key={author.id}>
                    <button
                      onClick={() => handleAuthorSelect(author.id)}
                      disabled={isTransitioning}
                      className="w-full text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Card className={`p-4 transition-all duration-300 cursor-pointer ${
                        isTransitioning 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:shadow-lg hover:border-primary/50'
                      }`}>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg bg-secondary/50 overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={author.image}
                              alt={author.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                              {author.name}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-1">{author.role}</p>
                            <p className="text-xs text-muted-foreground">{author.years}</p>
                          </div>
                          <div className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-sm font-medium">Auswählen</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </Card>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
