import { motion, useScroll, useTransform } from 'framer-motion';
import {
  MessageSquare, Clock, Library, BookOpen, Brain, Globe,
  ArrowRight, Sparkles, Shield, Users, Award, Play,
  ChevronRight, TrendingUp, Scroll, Zap, Star,
  BookText, MapPin, GraduationCap, History, MessageCircle,
  CheckCircle2, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRef, useState, useEffect } from 'react';
import { BlogCard } from './BlogCard';
import { usePosts } from '@/hooks/use-posts';
import { HeroImageGallery } from './HeroImageGallery';
import { AuthorGrid } from './AuthorGrid';

// Animated counter hook
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return { count, ref };
}

// Feature Card Component
const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <Link to={feature.link} className="block h-full">
        <div className="relative h-full bg-card border border-border rounded-[var(--radius)] p-6 hover:border-primary/30 transition-all duration-500">
          {/* Subtle gradient background on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[var(--radius)]" />
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {feature.description}
            </p>
            <div className="flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {feature.cta}
              <ArrowUpRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Stats Counter Component
const StatCounter = ({ value, suffix = '', label, index }: { value: number; suffix?: string; label: string; index: number }) => {
  const { count, ref } = useCounter(value);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center"
    >
      <p className="text-4xl sm:text-5xl font-bold text-primary mb-2">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
};

// Data
const features = [
  {
    icon: MessageCircle,
    title: 'KI-Gespräche',
    description: 'Unterhalte dich mit Caesar, Cicero, Augustus & Seneca. Wissenschaftlich fundiert.',
    cta: 'Chat starten',
    link: '/caesar/chat'
  },
  {
    icon: History,
    title: 'Zeitstrahl',
    description: '170+ Jahre römischer Geschichte. Von Caesars Geburt bis zur Kaiserzeit.',
    cta: 'Zeitreise',
    link: '/timeline'
  },
  {
    icon: BookText,
    title: 'Lexikon',
    description: '92+ Einträge zu Personen, Orten und Begriffen mit Etymologie.',
    cta: 'Lexikon',
    link: '/lexicon'
  },
  {
    icon: GraduationCap,
    title: 'Grammatik',
    description: 'Strukturierte Grammatik mit interaktiven Übungen.',
    cta: 'Lernen',
    link: '/learn/grammar'
  },
  {
    icon: Brain,
    title: 'Vokabeltrainer',
    description: '36.000+ lateinische Vokabeln mit Übersetzungen.',
    cta: 'Vokabeln',
    link: '/vocab'
  },
  {
    icon: Globe,
    title: 'Mehrsprachig',
    description: 'Deutsch, Englisch & Latein. Ideal für bilingualen Unterricht.',
    cta: 'Sprachen',
    link: '/settings'
  }
];

const stats = [
  { value: 4, suffix: '', label: 'Historische Persönlichkeiten' },
  { value: 36000, suffix: '+', label: 'Vokabeln' },
  { value: 92, suffix: '+', label: 'Lexikon-Einträge' },
  { value: 170, suffix: '+', label: 'Jahre Geschichte' }
];

const trustIndicators = [
  { icon: Shield, label: 'Wissenschaftlich fundiert', description: 'Basierend auf echten historischen Quellen' },
  { icon: Award, label: 'Kostenlos zugänglich', description: 'Alle Inhalte ohne Anmeldung verfügbar' },
  { icon: Users, label: 'Für alle Lernlevel', description: 'Von Anfängern bis Fortgeschrittenen' },
  { icon: BookOpen, label: 'Bilingualer Unterricht', description: 'Deutsch, Englisch & Latein' }
];

// Main Component
export default function LandingPageModern() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const { posts, isLoading } = usePosts();
  const recentPosts = posts
    ? [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)
    : [];

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text Content */}
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-2">
                  <Sparkles className="h-4 w-4 mr-2" />
                  KI-gestützt & kostenlos
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
              >
                <span className="text-foreground">Die Antike</span>
                <br />
                <span className="text-primary">neu erleben</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg text-muted-foreground mb-8 leading-relaxed"
              >
                KI-Gespräche mit Caesar, Cicero, Augustus & Seneca. 
                Interaktiver Zeitstrahl, Lexikon & Vokabeltrainer.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/caesar">
                  <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 group">
                    <Play className="mr-2 h-4 w-4" />
                    Jetzt starten
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/learn">
                  <Button size="lg" variant="outline" className="rounded-full px-8">
                    Lernwerkzeuge
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-wrap gap-6 mt-8 text-sm text-muted-foreground"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Keine Anmeldung
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  36.000+ Vokabeln
                </span>
              </motion.div>
            </div>

            {/* Right: Hero Image Gallery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="order-1 lg:order-2 relative"
            >
              <HeroImageGallery />
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 bg-secondary/30 border-y border-border">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, i) => (
              <StatCounter
                key={i}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Zap className="h-3 w-3 mr-2" />
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Deine Lern-Werkzeuge
            </h2>
            <p className="text-muted-foreground">
              Von KI-Chat bis Vokabeltrainer.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={i} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* AUTHORS */}
      <AuthorGrid />

      {/* TRUST */}
      <section className="py-20">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Warum Meum Diarium?
            </h2>
            <p className="text-muted-foreground">
              Qualität, Zugänglichkeit & wissenschaftliche Fundierung.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustIndicators.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mx-auto mb-4">
                  <item.icon className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{item.label}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT POSTS */}
      {!isLoading && recentPosts.length > 0 && (
        <section className="py-24 lg:py-32 bg-secondary/20 border-y border-border">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4"
            >
              <div>
                <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
                  <TrendingUp className="h-3 w-3 mr-2" />
                  Neueste Einträge
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Aus den Tagebüchern
                </h2>
              </div>
              <Link to="/search">
                <Button variant="ghost" className="text-primary group">
                  Alle anzeigen
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.map((post, i) => (
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

      {/* CTA SECTION */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/20" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
        
        <div className="relative z-10 container mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
              <Star className="h-4 w-4 mr-2" />
              Bereit für deine Zeitreise?
            </Badge>
            
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
              Tauche ein in die
              <br />
              <span className="text-primary">Antike</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Wähle deinen historischen Begleiter und beginne deine Reise ins antike Rom.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/caesar">
                <Button size="lg" className="rounded-full px-10 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Mit Caesar beginnen
                </Button>
              </Link>
              <Link to="/cicero">
                <Button size="lg" variant="outline" className="rounded-full px-10 border-border hover:bg-secondary">
                  Cicero entdecken
                </Button>
              </Link>
            </div>

            {/* Quick Links */}
            <div className="pt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <span className="text-muted-foreground">Oder starte direkt mit:</span>
              {[
                { label: 'Augustus', path: '/augustus' },
                { label: 'Seneca', path: '/seneca' },
                { label: 'Zeitstrahl', path: '/timeline' },
                { label: 'Lexikon', path: '/lexicon' }
              ].map((link, i) => (
                <Link
                  key={i}
                  to={link.path}
                  className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                >
                  {link.label}
                  <ChevronRight className="h-3 w-3" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
