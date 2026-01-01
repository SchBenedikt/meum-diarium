import { motion, useScroll, useTransform } from 'framer-motion';
import { Scroll, Sparkles, MessageCircle, BookOpen, Users, Zap, Clock, ArrowRight, Calendar, Library, Map, BookMarked, Quote, Languages, Star, Brain, Globe2, TrendingUp, Award, Shield, Target, Search, Layers, FileText, Compass, History, Lightbulb, CheckCircle2 } from 'lucide-react';
import { AuthorGrid } from './AuthorGrid';
import { fadeUp, defaultTransition } from '@/lib/motion';
import { ModernBackground } from './ui/ModernBackground';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

export default function LandingHero() {
  const [activeDemo, setActiveDemo] = useState<'chat' | 'timeline' | 'blog'>('chat');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const heroImages = [
    'https://videos.openai.com/az/vg-assets/task_01kd5fgmcde64rgx9gacgjmcqw%2F1766489373_img_1.webp?se=2026-01-07T00%3A00%3A00Z&sp=r&sv=2024-08-04&sr=b&skoid=aa5ddad1-c91a-4f0a-9aca-e20682cc8969&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-01-01T01%3A12%3A33Z&ske=2026-01-08T01%3A17%3A33Z&sks=b&skv=2024-08-04&sig=423MZImiyMddDyXxFQaQQqGYaNObqorS5Zepowjokhs%3D&ac=oaivgprodscus2',
    'https://videos.openai.com/az/vg-assets/task_01kd5ff56ne0ksa9mb0wd9y51f%2F1766489329_img_0.webp?se=2026-01-07T00%3A00%3A00Z&sp=r&sv=2024-08-04&sr=b&skoid=aa5ddad1-c91a-4f0a-9aca-e20682cc8969&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-01-01T01%3A12%3A33Z&ske=2026-01-08T01%3A17%3A33Z&sks=b&skv=2024-08-04&sig=kUdE%2B7FG66J5HtrkoBAKpL1e4auoo%2BJ%2BnoGBk2wjTA4%3D&ac=oaivgprodscus2',
    'https://videos.openai.com/az/vg-assets/task_01kd5f9pg2fsdrhrr9g5vfzh6z%2F1766489150_img_1.webp?se=2026-01-07T00%3A00%3A00Z&sp=r&sv=2024-08-04&sr=b&skoid=aa5ddad1-c91a-4f0a-9aca-e20682cc8969&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-01-01T01%3A12%3A33Z&ske=2026-01-08T01%3A17%3A33Z&sks=b&skv=2024-08-04&sig=HczD8PiZwGefHAkqD2GpOBFUPjr/B0Yt9JCt/PUsuMI%3D&ac=oaivgprodscus2',
    'https://videos.openai.com/az/vg-assets/task_01kd5f69bcfen9xwyc7begkwh9%2F1766489035_img_1.webp?se=2026-01-07T00%3A00%3A00Z&sp=r&sv=2024-08-04&sr=b&skoid=aa5ddad1-c91a-4f0a-9aca-e20682cc8969&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-01-01T01%3A12%3A33Z&ske=2026-01-08T01%3A17%3A33Z&sks=b&skv=2024-08-04&sig=ewQGmZHoOWJWczw/yPfF4B34A1bheOfzVAEjLMZOJdc%3D&ac=oaivgprodscus2',
    'https://videos.openai.com/az/vg-assets/task_01kd5f5170frwvsp2h0f2w9gmv%2F1766488996_img_1.webp?se=2026-01-07T00%3A00%3A00Z&sp=r&sv=2024-08-04&sr=b&skoid=aa5ddad1-c91a-4f0a-9aca-e20682cc8969&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-01-01T01%3A12%3A33Z&ske=2026-01-08T01%3A17%3A33Z&sks=b&skv=2024-08-04&sig=edXCjLRGqNJw1cwSX0P2hjt0VX0%2BFZkZDC1yLmfp5nY%3D&ac=oaivgprodscus2',
    'https://videos.openai.com/az/vg-assets/task_01kd5f2kygfa089r9ssrwvryma%2F1766488909_img_0.webp?se=2026-01-07T00%3A00%3A00Z&sp=r&sv=2024-08-04&sr=b&skoid=aa5ddad1-c91a-4f0a-9aca-e20682cc8969&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2026-01-01T01%3A12%3A33Z&ske=2026-01-08T01%3A17%3A33Z&sks=b&skv=2024-08-04&sig=ako5B5z3tuDJ71o19ujuSaMGi6yyg1NYuGDx0yqR69A%3D&ac=oaivgprodscus2',
  ];

  return (
    <div className="min-h-screen">
      {/* Landing Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden bg-background pt-32 pb-32">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-20">
          {/* Gradient orbs with parallax */}
          <motion.div 
            style={{ y, opacity }}
            className="absolute top-0 -left-40 w-80 h-80 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" 
          />
          <motion.div 
            style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '40%']), opacity }}
            className="absolute top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" 
          />
          <motion.div 
            style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '20%']), opacity }}
            className="absolute -bottom-8 left-20 w-80 h-80 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" 
          />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10 px-4 sm:px-6">
          {/* Hero Content */}
          <div className="max-w-4xl mx-auto text-center space-y-8 mb-24">
            {/* Badge with AI-Powered */}
            <motion.div
              variants={fadeUp()}
              initial="hidden"
              animate="visible"
              transition={defaultTransition}
              className="flex justify-center gap-3 flex-wrap"
            >
              <div className="bg-muted/40 backdrop-blur-sm flex items-center gap-2.5 rounded-full border border-border/50 px-4 py-2.5 w-fit hover:border-primary/30 transition-colors">
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                  <Sparkles className="w-3 h-3 mr-1.5" />
                  KI-Powered
                </Badge>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm text-muted-foreground">Geschichte interaktiv erleben</span>
              </div>

            </motion.div>

            {/* Main Heading with Underline */}
            <motion.div
              variants={fadeUp(0.1)}
              initial="hidden"
              animate="visible"
              transition={defaultTransition}
              className="space-y-6"
            >
              <div className="relative inline-block">
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[1.1]">
                  Meum Diarium
                </h1>
                {/* Underline SVG */}
                <svg
                  width="100%"
                  height="20"
                  viewBox="0 0 400 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-x-0 -bottom-6 w-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 10C50 5 100 2 200 2C300 2 350 5 398 10"
                    stroke="url(#paint0_linear)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear"
                      x1="0"
                      y1="0"
                      x2="400"
                      y2="0"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="var(--primary)" stopOpacity="1" />
                      <stop offset="1" stopColor="var(--primary)" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Subtitle - Stimmen der Antike */}
              <p className="text-2xl sm:text-3xl lg:text-4xl font-display font-semibold text-muted-foreground pt-8">
                Stimmen der Antike
              </p>
            </motion.div>

            {/* Subheading */}
            <motion.p
              variants={fadeUp(0.2)}
              initial="hidden"
              animate="visible"
              transition={defaultTransition}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Erleben Sie Geschichte durch die Augen ihrer Protagonisten.
              <br className="hidden sm:block" />
              KI-gestützt, quellenbasiert, interaktiv.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp(0.3)}
              initial="hidden"
              animate="visible"
              transition={defaultTransition}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link to="/caesar" className="w-full sm:w-auto">
                <Button size="lg" className="gap-2 w-full sm:w-auto group">
                  Jetzt entdecken
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/lexicon" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <Library className="w-4 h-4" />
                  Lexikon
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Hero Images Grid */}
          <motion.div
            variants={fadeUp(0.4)}
            initial="hidden"
            animate="visible"
            transition={defaultTransition}
            className="mb-24"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {/* Image 1 - Large wide */}
              <div className="col-span-2 md:col-span-2 lg:col-span-3 overflow-hidden rounded-[1.25rem] border border-border/30 hover:border-primary/40 transition-colors group">
                <div className="relative w-full" style={{ paddingBottom: '56%' }}>
                  <img
                    src={heroImages[0]}
                    alt="Ancient history 1"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Image 2 - Medium square */}
              <div className="col-span-1 md:col-span-2 lg:col-span-2 overflow-hidden rounded-[1.25rem] border border-border/30 hover:border-primary/40 transition-colors group">
                <div className="relative w-full" style={{ paddingBottom: '66%' }}>
                  <img
                    src={heroImages[1]}
                    alt="Ancient history 2"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Image 3 - Small */}
              <div className="col-span-1 overflow-hidden rounded-[1.25rem] border border-border/30 hover:border-primary/40 transition-colors group">
                <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                  <img
                    src={heroImages[2]}
                    alt="Ancient history 3"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Image 4 - Medium */}
              <div className="col-span-1 md:col-span-1 lg:col-span-2 overflow-hidden rounded-[1.25rem] border border-border/30 hover:border-primary/40 transition-colors group">
                <div className="relative w-full" style={{ paddingBottom: '66%' }}>
                  <img
                    src={heroImages[3]}
                    alt="Ancient history 4"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Image 5 - Small */}
              <div className="col-span-1 overflow-hidden rounded-[1.25rem] border border-border/30 hover:border-primary/40 transition-colors group">
                <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                  <img
                    src={heroImages[4]}
                    alt="Ancient history 5"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Image 6 - Small */}
<div className="col-span-1 overflow-hidden rounded-[1.25rem] border border-border/30 hover:border-primary/40 transition-colors group">
  <div className="relative w-full" style={{ paddingBottom: '75%' }}>
    <img
      src={heroImages[5]}
      alt="Ancient history 6"
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
  </div>
</div>

            </div>
          </motion.div>
        
        </div>
      </section>

      {/* Features Section 1 - Interactive Features */}
      <section className="relative py-24 bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            variants={fadeUp()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={defaultTransition}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <Star className="w-3 h-3 mr-1.5" />
              Hauptfunktionen
            </Badge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">
              Interaktive Funktionen
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Erkunden Sie die Geschichte auf völlig neue Weise
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={defaultTransition}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Large: Interactive Chat Demo */}
            <motion.div 
              onHoverStart={() => setHoveredCard('chat')}
              onHoverEnd={() => setHoveredCard(null)}
              className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-card to-card/50 border border-border rounded-[1.5rem] p-6 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 rounded-[1.25rem] bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <MessageCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold">KI-Gespräche</h3>
                        <Badge variant="secondary" className="mt-1 text-xs">Live Demo</Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      Authentische Dialoge mit historischen Persönlichkeiten basierend auf echten Quellen
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Enhanced Chat Demo */}
                <div className="space-y-4">
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="bg-secondary/50 rounded-[1.25rem] p-4 border border-border/50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                      <p className="text-xs font-medium text-muted-foreground">Du</p>
                    </div>
                    <p className="text-sm">Wie haben Sie Rom verändert?</p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="bg-primary/10 rounded-[1.25rem] p-4 border border-primary/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs text-white font-bold">
                        C
                      </div>
                      <p className="text-xs font-medium text-primary">Gaius Julius Caesar</p>
                    </div>
                    <p className="text-sm leading-relaxed">Der Rubikon war mehr als ein Fluss – er war eine Grenze zwischen Recht und Macht. Als ich ihn überschritt...</p>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/40">
                      <BookOpen className="w-3 h-3 text-primary/60" />
                      <span className="text-xs text-primary/60">Basierend auf historischen Quellen</span>
                    </div>
                  </motion.div>

                  <Button variant="ghost" size="sm" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Demo starten
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Characters Stat */}
            <motion.div 
              onHoverStart={() => setHoveredCard('characters')}
              onHoverEnd={() => setHoveredCard(null)}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-[1.5rem] p-6 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="p-3 rounded-[1.25rem] bg-primary/10 group-hover:bg-primary/20 transition-colors w-fit mb-4">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="text-5xl font-display font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">4+</div>
                <p className="text-sm text-muted-foreground mb-2">Historische Figuren</p>
                <div className="flex items-center gap-1 text-xs text-primary">
                  <Star className="w-3 h-3" />
                  <span>Umfassend dokumentiert</span>
                </div>
              </div>
            </motion.div>

            {/* Articles Stat */}
            <motion.div 
              onHoverStart={() => setHoveredCard('articles')}
              onHoverEnd={() => setHoveredCard(null)}
              className="bg-gradient-to-br from-card to-card/50 border border-border rounded-[1.5rem] p-6 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="p-3 rounded-[1.25rem] bg-primary/10 group-hover:bg-primary/20 transition-colors w-fit mb-4">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="text-5xl font-display font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">50+</div>
                <p className="text-sm text-muted-foreground mb-2">Artikel & Einträge</p>
                <div className="flex items-center gap-1 text-xs text-primary">
                  <TrendingUp className="w-3 h-3" />
                  <span>Wöchentlich neue Inhalte</span>
                </div>
              </div>
            </motion.div>

            {/* Timeline Feature - Larger */}
            <motion.div 
              onHoverStart={() => setHoveredCard('timeline-big')}
              onHoverEnd={() => setHoveredCard(null)}
              className="lg:col-span-2 bg-gradient-to-br from-card to-card/50 border border-border rounded-[1.5rem] p-6 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-[1.25rem] bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold">Interaktive Zeitreise</h3>
                      <p className="text-xs text-muted-foreground">Historische Ereignisse visualisiert</p>
                    </div>
                  </div>
                  <Link to="/timeline">
                    <Button size="sm" variant="ghost" className="gap-1">
                      <span className="text-xs">Erkunden</span>
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
                
                <div className="relative h-20 bg-gradient-to-r from-secondary/30 via-secondary/50 to-secondary/30 rounded-[1.25rem] border border-border/50 overflow-hidden">
                  <div className="absolute inset-0 flex items-center px-6">
                    <div className="flex-1 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 relative">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute left-[20%] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50"
                      />
                      <div className="absolute left-[20%] top-full mt-2 -translate-x-1/2">
                        <p className="text-[10px] font-medium whitespace-nowrap">100 v.Chr.</p>
                      </div>
                      
                      <div className="absolute left-[50%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/60" />
                      <div className="absolute left-[50%] top-full mt-2 -translate-x-1/2">
                        <p className="text-[10px] text-muted-foreground whitespace-nowrap">58 v.Chr.</p>
                      </div>
                      
                      <div className="absolute left-[75%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/40" />
                      <div className="absolute left-[75%] top-full mt-2 -translate-x-1/2">
                        <p className="text-[10px] text-muted-foreground whitespace-nowrap">44 v.Chr.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section 2 - Knowledge Base */}
      <section className="relative py-24 bg-background/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            variants={fadeUp()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={defaultTransition}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <Brain className="w-3 h-3 mr-1.5" />
              Wissensbank
            </Badge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">
              Quellenbasierte Inhalte
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Wissenschaftlich fundierte Informationen und historische Einordnung
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={defaultTransition}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Features */}
            <div className="md:col-span-2 bg-card border border-border rounded-[1.25rem] p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-[1.25rem] bg-primary/10">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-bold">Quellenbasiert & KI-gestützt</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-sm">Historische Quellen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-sm">Wissenschaftlich fundiert</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-sm">Peer-reviewed</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-sm">KI-Technologie</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-sm">Interaktiv</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-sm">Verifizierbar</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lexicon */}
            <div className="bg-card border border-border rounded-[1.25rem] p-6 hover:border-primary/40 transition-colors">
              <div className="p-2 rounded-[1.25rem] bg-primary/10 w-fit mb-3">
                <BookMarked className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-base font-bold mb-2">Lexikon</h3>
              <p className="text-sm text-muted-foreground mb-4">Fachbegriffe der Antike</p>
              <Link to="/lexicon">
                <Button variant="outline" size="sm" className="w-full">
                  Durchsuchen
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section 3 - Content & Tools */}
      <section className="relative py-24 bg-background">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            variants={fadeUp()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={defaultTransition}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              <Award className="w-3 h-3 mr-1.5" />
              Weitere Features
            </Badge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-4">
              Umfassende Werkzeuge
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Alles was du brauchst, um Geschichte vollständig zu erleben
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={defaultTransition}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {/* Languages */}
            <div className="bg-card border border-border rounded-[1.25rem] p-6 hover:border-primary/40 transition-colors group">
              <div className="p-2 rounded-[1.25rem] bg-primary/10 group-hover:bg-primary/20 transition-colors w-fit mb-3">
                <Languages className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-base font-bold mb-2">Mehrsprachig</h3>
              <p className="text-sm text-muted-foreground">DE • EN • LA</p>
            </div>

            {/* Timeline */}
            <div className="bg-card border border-border rounded-[1.25rem] p-6 hover:border-primary/40 transition-colors group">
              <div className="p-2 rounded-[1.25rem] bg-primary/10 group-hover:bg-primary/20 transition-colors w-fit mb-3">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-base font-bold mb-2">Chronologie</h3>
              <p className="text-sm text-muted-foreground">Detaillierte Zeitleiste</p>
            </div>

            {/* Quotes */}
            <div className="bg-card border border-border rounded-[1.25rem] p-6 hover:border-primary/40 transition-colors group">
              <div className="p-2 rounded-[1.25rem] bg-primary/10 group-hover:bg-primary/20 transition-colors w-fit mb-3">
                <Quote className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-base font-bold mb-2">Original-Zitate</h3>
              <p className="text-sm text-muted-foreground">Authentische Quellen</p>
            </div>

            {/* Places */}
            <div className="bg-card border border-border rounded-[1.25rem] p-6 hover:border-primary/40 transition-colors group">
              <div className="p-2 rounded-[1.25rem] bg-primary/10 group-hover:bg-primary/20 transition-colors w-fit mb-3">
                <Map className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display text-base font-bold mb-2">Orte & Reisen</h3>
              <p className="text-sm text-muted-foreground">Geografische Kontexte</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Author Grid Section */}
      <AuthorGrid />
    </div>
  );
}
