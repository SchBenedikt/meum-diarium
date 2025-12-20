
import { BookMarked, Clock, ArrowRight, Sparkles, Quote, Library, Mic2, Users, Crown, Send, MoreVertical, Languages, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AuthorGrid } from './AuthorGrid';
import { FeaturedPost } from './FeaturedPost';
import { QuoteOfDay } from './QuoteOfDay';
import { ReadingStats } from './ReadingStats';
import { FeatureShowcase } from '@/components/home/FeatureShowcase';
import { fadeUp, staggerContainer, defaultTransition } from '@/lib/motion';
import { ModernBackground } from './ui/ModernBackground';
import { useRef } from 'react';

export function LandingHero() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Parallax effects for hero content - Ultra-smooth prolonged visibility
  const heroY = useTransform(scrollY, [0, 1200], [0, 400]);
  const heroOpacity = useTransform(scrollY, [0, 1000], [1, 0]);
  const textScale = useTransform(scrollY, [0, 900], [1, 0.98]);

  const stats = [
    { label: 'Antike Autoren', value: '4', icon: Library },
    { label: 'Jahre Geschichte', value: '170+', icon: Clock },
    { label: 'Perspektiven', value: '2', icon: Quote },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background" ref={containerRef}>
      {/* Hero Section - Immersive & Cinematic */}
      <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Cinematic Background Image with Parallax */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-background/30 to-background z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40 z-10" />
          <img
            src="https://videos.openai.com/az/vg-assets/task_01kcs7pbnze61tyb0qdy1teb90%2F1766078554_img_1.webp?se=2025-12-20T00%3A00%3A00Z&sp=r&sv=2024-08-04&sr=b&skoid=5e5fc900-07cf-43e7-ab5b-314c0d877bb0&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-12-18T01%3A08%3A21Z&ske=2025-12-25T01%3A13%3A21Z&sks=b&skv=2024-08-04&sig=gUEvzwP5hWU/WKioE8tuz6kuc9I1G7wxXcN9f6uukDM%3D&ac=oaivgprodscus2"
            alt="Ancient Rome"
            className="w-full h-full object-cover scale-150 blur-[12px] opacity-60 object-[50%_15%]"
          />
        </motion.div>

        {/* Interactive Background Layer */}
        <ModernBackground />

        <div className="container mx-auto relative z-20 px-4 sm:px-6 pt-32 sm:pt-40">
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            style={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto flex flex-col items-center text-center"
          >
            <motion.div
              variants={fadeUp(0.1)}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary/10 backdrop-blur-xl border border-primary/20 text-primary text-xs sm:text-sm font-bold mb-8 hover:bg-primary/20 transition-all cursor-default"
            >
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              {t('discoverAntiquity') || 'ERLEBE DIE ANTIKE IN EINER NEUEN DIMENSION'}
            </motion.div>

            <motion.h1
              variants={fadeUp(0.2)}
              className="font-display text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-6 md:mb-8 leading-[0.85] tracking-tighter font-bold text-foreground whitespace-nowrap"
            >
              Meum <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary via-primary/80 to-primary/40">Diarium</span>
            </motion.h1>

            <motion.p
              variants={fadeUp(0.3)}
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-light"
            >
              {t('heroSubtitle') || 'Wo die Stimmen der Vergangenheit auf die Intelligenz der Zukunft treffen. Tauche ein in die persönlichen Aufzeichnungen der größten Denker Roms.'}
            </motion.p>

            <motion.div
              variants={fadeUp(0.5)}
              className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16"
            >
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button size="lg" className="h-16 px-12 text-xl rounded-2xl bg-primary text-primary-foreground border border-primary/20 hover:bg-primary/90 transition-all group font-display font-bold hover-uniform" asChild>
                  <a href="#authors">
                    {t('discoverAuthorsBtn') || 'Autoren entdecken'}
                    <ArrowRight className="ml-3 h-6 w-6 icon-hover" />
                  </a>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" size="lg" className="h-16 px-12 text-xl rounded-2xl backdrop-blur-md bg-surface-container-low/20 border-border/30 hover:bg-surface-container-low/30 hover:border-primary/30 transition-all font-display font-bold hover-uniform" asChild>
                  <Link to="/about">
                    Unsere Mission
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Overlapping Stats Card connecting sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-30 -mt-20 sm:-mt-28 mb-[-3rem]"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto w-full max-w-5xl">
            <div className="bg-card/95 backdrop-blur-xl border border-border/40 rounded-3xl p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center gap-3"
                >
                  <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                    <stat.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <span className="block text-4xl sm:text-5xl font-display font-bold text-foreground mb-1">{stat.value}</span>
                    <span className="block text-sm sm:text-base text-muted-foreground tracking-wide font-medium">{stat.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Storytelling Section: History Alive */}
      <section className="py-32 relative z-10 overflow-hidden bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                KI-GESTÜTZTE REKONSTRUKTION
              </div>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight">
                Geschichte wird <span className="text-primary block mt-2 italic">lebendig.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 font-light">
                Erlebe die Vergangenheit nicht nur als stilles Archiv, sondern als lebendigen Dialog. 
                <span className="block mt-4 text-foreground font-medium">Meum Diarium</span> nutzt KI, um die Gedankenwelten von Caesar, Cicero, Augustus und Seneca auf Basis ihrer authentischen Schriften zu rekonstruieren.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Quote, label: 'Authentische Quellen' },
                  { icon: Sparkles, label: 'KI-Rekonstruktion' },
                  { icon: Library, label: 'Lateinisch & Deutsch' },
                  { icon: Mic2, label: 'Interaktive Dialoge' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-card/40 border border-border/40 hover:border-primary/40 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/10 blur-[120px] rounded-full" />
              <div className="relative rounded-3xl overflow-hidden border border-border/40 aspect-square lg:aspect-[4/3] group">
                <img
                  src="https://videos.openai.com/az/vg-assets/task_01kcs7pbnze61tyb0qdy1teb90%2F1766078554_img_1.webp?se=2025-12-26T00%3A00%3A00Z&sp=r&sv=2024-08-04&sr=b&skoid=8ebb0df1-a278-4e2e-9c20-f2d373479b3a&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-12-20T02%3A21%3A13Z&ske=2025-12-27T02%3A26%3A13Z&sks=b&skv=2024-08-04&sig=aqaune3RBVFcczzZvSPU47xwEeAiVRWNNCq/m2pl6VE%3D&ac=oaivgprodscus2"
                  alt="Ancient Rome meets modern AI"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-card/90 backdrop-blur-xl border border-border/40 rounded-2xl p-5 transition-all group-hover:border-primary/50">
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      Live Demo
                    </p>
                    <p className="text-lg font-display font-semibold">"Alea iacta est" – Sprich mit Caesar über den Rubikon</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* New Section: Giganten der Antike */}
      <section className="py-32 relative z-10 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-secondary/5 blur-[120px] rounded-full -translate-x-1/2" />
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
              <Users className="w-3.5 h-3.5" />
              DIE PROTAGONISTEN
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Vier <span className="text-primary italic">Stimmen</span> der Antike
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              Erlebe die Geschichte Roms durch zwei Perspektiven: persönliche Tagebucheinträge und wissenschaftliche Analysen.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Caesar',
                subtitle: 'Der Feldherr',
                desc: 'Eroberer Galliens, Meister der Strategie. Seine Feldzüge veränderten die Grenzen der Welt.',
                icon: Crown,
                color: 'text-red-500',
                borderColor: 'border-red-500/40',
                bgAccent: 'bg-red-500/5'
              },
              {
                title: 'Cicero',
                subtitle: 'Der Redner',
                desc: 'Verteidiger der Republik, Meister der Rhetorik. Seine Worte waren schärfer als jedes Schwert.',
                icon: Mic2,
                color: 'text-amber-500',
                borderColor: 'border-amber-500/40',
                bgAccent: 'bg-amber-500/5'
              },
              {
                title: 'Augustus',
                subtitle: 'Der Gründer',
                desc: 'Schöpfer des Imperiums, Bringer des Friedens. Aus dem Chaos entstand ein neues Rom.',
                icon: Users,
                color: 'text-yellow-500',
                borderColor: 'border-yellow-500/40',
                bgAccent: 'bg-yellow-500/5'
              },
              {
                title: 'Seneca',
                subtitle: 'Der Philosoph',
                desc: 'Stoiker, Berater der Kaiser, Sucher der Wahrheit. Weisheit über Macht und Schicksal.',
                icon: Sparkles,
                color: 'text-blue-500',
                borderColor: 'border-blue-500/40',
                bgAccent: 'bg-blue-500/5'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-card/40 backdrop-blur-md rounded-2xl border border-border/40 p-6 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 group ${feature.bgAccent}`}
              >
                <div className={`p-3 rounded-xl border ${feature.borderColor} ${feature.bgAccent} ${feature.color} inline-flex mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-1 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-xs text-primary font-bold uppercase tracking-widest mb-4">{feature.subtitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Demo Section */}
      <section className="py-32 relative z-10 overflow-hidden bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                KI-CHAT SIMULATION
              </div>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight">
                Stelle deine Fragen direkt an <span className="text-primary italic block mt-2">Caesar</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 font-light">
                Tauche ein in authentische Gespräche mit den größten Figuren der Geschichte. Unsere KI-Rekonstruktion basiert auf historischen Quellen und erfasst den Charakter, das Denken und die Sprechmuster der Antike.
              </p>
              <div className="space-y-3">
                {[
                  { icon: BookOpen, text: 'Authentische historische Quellen als Basis' },
                  { icon: Sparkles, text: 'KI-gestützte Persönlichkeitsmodellierung' },
                  { icon: Languages, text: 'Lateinische und deutsche Antworten' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card/40 border border-border/30"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 blur-[100px] rounded-full" />
                {/* Demo Chat Interface */}
                <div className="relative bg-card/70 backdrop-blur-2xl border border-border/40 rounded-3xl overflow-hidden shadow-2xl">
                  {/* Chat Header */}
                  <div className="flex items-center justify-between border-b border-border/50 px-6 py-4 bg-background/50 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-lg">
                          C
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">Gaius Julius Caesar</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                          Aktiv
                        </p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <MoreVertical className="h-5 w-5 text-muted-foreground" />
                    </button>
                  </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">C</div>
                      <div>
                        <p className="font-display font-semibold text-lg">Caesar</p>
                        <span className="flex items-center gap-1.5 text-xs text-primary animate-pulse">
                          <span className="block h-1.5 w-1.5 rounded-full bg-primary" /> Online
                        </span>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                      <span>🤖 KI-gestützt</span>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="space-y-5 p-6 h-[400px] overflow-y-auto">
                    {/* User Message */}
                    <div className="flex gap-3 justify-end">
                      <div className="rounded-2xl bg-primary/10 border border-primary/30 px-5 py-3 max-w-[80%]">
                        <p className="text-sm leading-relaxed">Was war der entscheidende Moment am Rubikon?</p>
                      </div>
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center shrink-0 text-xs font-bold border border-border/40">
                        Du
                      </div>
                    </div>

                    {/* Caesar Typing Indicator */}
                    <div className="flex gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shrink-0 text-white font-bold text-sm">
                        C
                      </div>
                      <div className="rounded-2xl bg-card/70 border border-border/60 px-5 py-3 max-w-[85%]">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          Caesar tippt...
                        </div>
                        <p className="text-sm leading-relaxed font-medium">
                          "Der Rubikon war mehr als ein Fluss – er war eine unsichtbare Grenze zwischen Legalität und Revolution."
                        </p>
                        <p className="text-sm leading-relaxed mt-3 text-muted-foreground">
                          Ich stand an jenem kalten Januarmorgen 49 v. Chr. mit meiner XIII. Legion am Ufer. Das Gesetz verbot mir, bewaffnet die Grenze Italiens zu überschreiten. Doch in Rom warteten meine Feinde.
                        </p>
                        <p className="text-sm leading-relaxed mt-3 italic text-foreground/90">
                          "Alea iacta est" – Der Würfel ist gefallen, sagte ich. Nicht aus Übermut, sondern aus Notwendigkeit.
                        </p>
                      </div>
                    </div>

                    {/* User Follow-up */}
                    <div className="flex gap-3 justify-end">
                      <div className="rounded-2xl bg-primary/10 border border-primary/30 px-5 py-3 max-w-[80%]">
                        <p className="text-sm leading-relaxed">Hattest du keine Angst?</p>
                      </div>
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center shrink-0 text-xs font-bold border border-border/40">
                        Du
                      </div>
                    </div>
                  </div>

                  {/* Chat Input */}
                  <div className="border-t border-border/50 px-6 py-4 bg-background/30 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Stelle Caesar eine Frage..."
                        disabled
                        className="flex-1 bg-muted/40 border border-border/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/50"
                      />
                      <button disabled className="p-3 bg-primary/20 text-primary rounded-xl hover:bg-primary/30 transition-colors disabled:opacity-50">
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" />
                      KI-Demo • Basiert auf historischen Quellen
                    </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <FeatureShowcase />

      <div id="authors">
        <AuthorGrid />
      </div>

      <FeaturedPost />

      {/* Quote of the Day Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background via-background to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary/60 mb-6">Sententia Diei</p>
              <QuoteOfDay />
            </motion.div>
          </div>
        </div>
      </section>

      <ReadingStats />
    </div>
  );
}
