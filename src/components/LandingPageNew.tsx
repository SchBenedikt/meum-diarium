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
    color: 'from-primary/10 to-primary/5'
  },
  {
    icon: Clock,
    title: 'Zeitstrahl',
    description: '170+ Jahre römischer Geschichte entdecken',
    details: 'Interaktive Navigation durch wichtige Ereignisse und Wendepunkte',
    color: 'from-primary/10 to-primary/5'
  },
  {
    icon: Library,
    title: 'Lexikon',
    description: '92+ Einträge zu Personen & Orten',
    details: 'Umfassende Enzyklopädie mit Etymologie und historischem Kontext',
    color: 'from-primary/10 to-primary/5'
  },
  {
    icon: BookOpen,
    title: 'Grammatik',
    description: 'Interaktive Latein-Übungen',
    details: 'Systematische Grammatik mit praktischen Beispielen und Tests',
    color: 'from-primary/10 to-primary/5'
  },
  {
    icon: Brain,
    title: 'Vokabeln',
    description: '36.000+ lateinische Wörter',
    details: 'Intelligenter Vokabeltrainer mit Spaced-Repetition-System',
    color: 'from-primary/10 to-primary/5'
  },
  {
    icon: Globe,
    title: 'Mehrsprachig',
    description: 'Deutsch, Englisch & Latein',
    details: 'Barrierefreier Zugang zu antiken Texten in modernen Sprachen',
    color: 'from-primary/10 to-primary/5'
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
      {/* HERO SECTION WITH ENHANCED EFFECTS */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{
            background: `radial-gradient(circle at ${gradientX}% ${gradientY}%, hsl(var(--primary) / 0.1) 0%, transparent 50%)`,
          }}
        />
        
        {/* Fixed Background Image with subtle zoom effect */}
        <div className="absolute inset-0 z-0">
          <motion.img 
            src="/image.png" 
            alt="Antikes Rom" 
            className="w-full h-full object-cover"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
        </div>

        {/* Floating geometric shapes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-primary/20"
            style={{
              width: Math.random() * 60 + 20,
              height: Math.random() * 60 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              borderRadius: Math.random() > 0.5 ? '50%' : '10%',
            }}
            animate={{
              rotate: [0, 360],
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6 py-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-center space-y-8"
          >
            {/* Text Container with enhanced glassmorphism */}
            <motion.div 
              className="backdrop-blur-xl bg-white/5 rounded-3xl p-12 border border-white/30 shadow-2xl"
              whileHover={{ 
                scale: 1.02,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderColor: 'rgba(255, 255, 255, 0.4)'
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Main Title with glow effect */}
              <motion.h1 
                className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight relative"
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(255,255,255,0.5)",
                    "0 0 40px rgba(255,255,255,0.3)",
                    "0 0 20px rgba(255,255,255,0.5)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <span style={{ color: '#ffffff' }}>
                  Meum Diarium
                </span>
              </motion.h1>

              {/* Static Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="text-xl sm:text-2xl max-w-2xl mx-auto font-light"
                style={{ 
                  color: '#ffffff',
                  textDecoration: 'none !important',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  textDecorationLine: 'none',
                  textDecorationStyle: 'solid',
                  textDecorationThickness: '0px'
                }}
              >
                Die antike Welt neu entdecken
              </motion.p>

              {/* Enhanced CTA Button */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="space-y-4 pt-4"
              >
                <Link to="/caesar">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="rounded-full px-12 py-6 text-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 group relative overflow-hidden">
                      <span className="relative z-10 flex items-center">
                        Entdecken
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      {/* Enhanced button shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                        animate={{ x: ['-200%', '200%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </Button>
                  </motion.div>
                </Link>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  className="text-center"
                >
                  <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    Oder beginne direkt mit: 
                    <Link to="/cicero" className="ml-1 hover:text-white transition-colors" style={{ color: '#ffffff' }}>Cicero</Link> • 
                    <Link to="/augustus" className="ml-1 hover:text-white transition-colors" style={{ color: '#ffffff' }}>Augustus</Link> • 
                    <Link to="/seneca" className="ml-1 hover:text-white transition-colors" style={{ color: '#ffffff' }}>Seneca</Link>
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
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
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="w-6 h-12 rounded-full border-2 border-white/40 flex items-start justify-center p-1"
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="w-1 h-3 bg-white/60 rounded-full"
            />
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
                    {/* Hover background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0"
                      animate={{ opacity: hoveredFeature === i ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 mb-6">
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground mb-4">{feature.description}</p>
                      <p className="text-sm text-muted-foreground/70 leading-relaxed">{feature.details}</p>
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
