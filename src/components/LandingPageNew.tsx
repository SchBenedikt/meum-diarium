import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
  MessageSquare, Clock, Library, BookOpen, Brain, Globe,
  ArrowRight, Star, Users, Award, Shield, Quote, ScrollText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

export default function LandingPageNew() {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, -100]);
  const yImage = useTransform(scrollY, [0, 500], [0, 50]);
  
  // Animated gradient background
  const gradientX = useSpring(0);
  const gradientY = useSpring(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      gradientX.set(Math.random() * 100);
      gradientY.set(Math.random() * 100);
    }, 3000);
    return () => clearInterval(interval);
  });

  // Interactive hover states
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: MessageSquare,
      title: 'KI-Gespräche',
      description: 'Dialoge mit Caesar, Cicero, Augustus & Seneca',
      details: 'Wissenschaftlich fundierte KI-Gespräche basierend auf echten historischen Quellen',
      quote: '"Alea iacta est!" - Julius Caesar',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Clock,
      title: 'Zeitstrahl',
      description: '170+ Jahre römischer Geschichte entdecken',
      details: 'Interaktive Navigation durch wichtige Ereignisse und Wendepunkte',
      quote: '"Tempus fugit" - Die Zeit fliegt',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Library,
      title: 'Lexikon',
      description: '92+ Einträge zu Personen & Orten',
      details: 'Umfassende Enzyklopädie mit Etymologie und historischem Kontext',
      quote: '"Vox populi, vox dei" - Die Stimme des Volkes',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: BookOpen,
      title: 'Grammatik',
      description: 'Interaktive Latein-Übungen',
      details: 'Systematische Grammatik mit praktischen Beispielen und Tests',
      quote: '"Docendo discimus" - Indem wir lehren, lernen wir',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: Brain,
      title: 'Vokabeln',
      description: '36.000+ lateinische Wörter',
      details: 'Intelligenter Vokabeltrainer mit Spaced-Repetition-System',
      quote: '"Verba volant, scripta manent" - Worte fliegen, Schrift bleibt',
      color: 'from-red-500 to-rose-600'
    },
    {
      icon: Globe,
      title: 'Mehrsprachig',
      description: 'Deutsch, Englisch & Latein',
      details: 'Barrierefreier Zugang zu antiken Texten in modernen Sprachen',
      quote: '"Lingua latina, non mortua" - Latein ist nicht tot',
      color: 'from-indigo-500 to-blue-600'
    }
  ];

  const authors = [
    {
      id: 'caesar',
      name: 'Julius Caesar',
      role: 'Feldherr & Staatsmann',
      years: '100–44 v.Chr.',
      color: 'from-red-600 to-orange-600',
      letter: 'C'
    },
    {
      id: 'cicero',
      name: 'Marcus Cicero',
      role: 'Redner & Philosoph',
      years: '106–43 v.Chr.',
      color: 'from-blue-600 to-indigo-600',
      letter: 'M'
    },
    {
      id: 'augustus',
      name: 'Augustus',
      role: 'Erster Römischer Kaiser',
      years: '63 v.Chr.–14 n.Chr.',
      color: 'from-amber-600 to-yellow-600',
      letter: 'A'
    },
    {
      id: 'seneca',
      name: 'Lucius Seneca',
      role: 'Stoischer Philosoph',
      years: '4 v.Chr.–65 n.Chr.',
      color: 'from-green-600 to-teal-600',
      letter: 'S'
    }
  ];

  const stats = [
    { value: '4', label: 'Historische Persönlichkeiten' },
    { value: '36K+', label: 'Vokabeln' },
    { value: '92+', label: 'Lexikon-Einträge' },
    { value: '170+', label: 'Jahre Geschichte' }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* HERO SECTION WITH ENHANCED PARALLAX */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{
            background: `radial-gradient(circle at ${gradientX}% ${gradientY}%, hsl(var(--primary) / 0.1) 0%, transparent 50%)`,
          }}
        />
        
        {/* Parallax Background Image */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y: yImage }}
        >
          <img 
            src="/images/caesar-hero.jpg" 
            alt="Antikes Rom" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-center space-y-8"
          >
            {/* Text Container with blurred background */}
            <div className="backdrop-blur-md bg-background/20 rounded-3xl p-12 border border-white/10 shadow-2xl">
              {/* Main Title with glitch effect */}
              <motion.h1
                style={{ y: yText }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight relative"
              >
                <span className="relative">
                  <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    Meum Diarium
                  </span>
                  {/* Animated underline */}
                  <motion.div
                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary to-transparent"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                </span>
              </motion.h1>

              {/* Static Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl sm:text-2xl max-w-2xl mx-auto font-light"
                style={{ 
                  color: '#ffffff',
                  textDecoration: 'none',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                Die antike Welt neu entdecken
              </motion.p>

              {/* Enhanced CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="space-y-4 pt-4"
              >
                <Link to="/caesar">
                  <Button size="lg" className="rounded-full px-12 py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground group relative overflow-hidden">
                    <span className="relative z-10 flex items-center">
                      Entdecken
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    {/* Button shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                    />
                  </Button>
                </Link>
                <div className="text-center">
                  <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Oder beginne direkt mit: 
                    <Link to="/cicero" className="ml-1" style={{ color: '#ffffff' }}>Cicero</Link> • 
                    <Link to="/augustus" className="ml-1" style={{ color: '#ffffff' }}>Augustus</Link> • 
                    <Link to="/seneca" className="ml-1" style={{ color: '#ffffff' }}>Seneca</Link>
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-1"
          >
            <div className="w-1 h-2 bg-primary/50 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 bg-secondary/30 border-y border-border">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <p className="text-3xl sm:text-4xl font-bold text-primary mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTHORS SECTION */}
      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Users className="h-3 w-3 mr-1.5" />
              Historische Persönlichkeiten
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Lerne von den größten Denkern Roms
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Vier außergewöhnliche Persönlichkeiten als deine Begleiter auf der Reise in die Antike.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {authors.map((author, i) => (
              <motion.div
                key={author.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link to={`/${author.id}`} className="group block">
                  <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-all duration-300 text-center h-full">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${author.color} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {author.letter}
                    </div>
                    <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{author.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{author.role}</p>
                    <p className="text-xs text-muted-foreground/60">{author.years}</p>
                    <div className="mt-4 flex items-center justify-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Entdecken <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ENHANCED FEATURES SECTION WITH QUOTES */}
      <section className="py-24 bg-secondary/20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-2">
              <Star className="h-3 w-3 mr-2" />
              Einzigartige Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Mehr als nur lernen
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Jedes Feature hat seine eigene Geschichte und seinen eigenen Charakter.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="group"
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/40 hover:shadow-lg transition-all duration-300 h-full relative overflow-hidden">
                    {/* Animated gradient background on hover */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0`}
                      animate={{ opacity: hoveredFeature === i ? 0.05 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 mb-6">
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground mb-4">{feature.description}</p>
                      <p className="text-sm text-muted-foreground/70 leading-relaxed mb-4">{feature.details}</p>
                      
                      {/* Latin Quote */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: hoveredFeature === i ? 1 : 0.7, y: hoveredFeature === i ? 0 : 10 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-start gap-2 pt-4 border-t border-border/50"
                      >
                        <Quote className="h-4 w-4 text-primary/50 mt-1 flex-shrink-0" />
                        <p className="text-xs text-primary/70 italic leading-relaxed">{feature.quote}</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUST INDICATORS */}
      <section className="py-16 bg-background border-y border-border">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <Shield className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-foreground">Wissenschaftlich fundiert</h4>
              <p className="text-sm text-muted-foreground">Basierend auf echten historischen Quellen und aktuellen Forschungen</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <Award className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-foreground">Kostenlos zugänglich</h4>
              <p className="text-sm text-muted-foreground">Alle Inhalte ohne Anmeldung oder Kosten verfügbar</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <Users className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-foreground">Für Lernende aller Level</h4>
              <p className="text-sm text-muted-foreground">Von Anfängern bis Fortgeschrittenen - für jeden etwas dabei</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ENHANCED CTA SECTION */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary/20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                Beginne deine Reise
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Bereit für die Antike?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Wähle deinen historischen Begleiter und tauche ein in die faszinierende Welt des antiken Roms.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/caesar">
                <Button size="lg" className="rounded-full px-10 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Mit Caesar beginnen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/learn">
                <Button size="lg" variant="outline" className="rounded-full px-10 border-border hover:bg-secondary">
                  Alle Lernwerkzeuge
                </Button>
              </Link>
            </div>

            <div className="pt-8">
              <p className="text-sm text-muted-foreground">
                Oder wähle direkt: <Link to="/cicero" className="text-primary hover:underline">Cicero</Link> • 
                <Link to="/augustus" className="text-primary hover:underline ml-1">Augustus</Link> • 
                <Link to="/seneca" className="text-primary hover:underline ml-1">Seneca</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
