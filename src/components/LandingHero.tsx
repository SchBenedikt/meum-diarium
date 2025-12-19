
import { BookMarked, Clock, ArrowRight, Sparkles, Quote, Library, Mic2 } from 'lucide-react';
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
    { label: 'Jahrtausende alte Weisheit', value: '2000+', icon: Library },
    { label: 'Echtzeit-Rekonstruktion', value: 'AI', icon: Sparkles },
    { label: 'Zeitlose Philosophie', value: '∞', icon: Mic2 },
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
                <Button size="lg" className="h-16 px-12 text-xl rounded-2xl bg-primary text-primary-foreground border border-primary/20 hover:bg-primary/90 transition-all group font-display font-bold shadow-none" asChild>
                  <a href="#authors">
                    {t('discoverAuthorsBtn') || 'Autoren entdecken'}
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" size="lg" className="h-16 px-12 text-xl rounded-2xl backdrop-blur-md bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all font-display font-bold shadow-none" asChild>
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
        variants={fadeUp(0.2)}
        initial={false}
        className="relative z-30 -mt-20 sm:-mt-28 mb-[-3rem]"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto w-full max-w-4xl">
            <div className="bg-card/95 backdrop-blur-xl border border-primary/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-around items-center gap-6 sm:gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2">
                  <div className="flex items-center gap-3">
                    <stat.icon className="w-6 h-6 text-primary" />
                    <span className="text-3xl sm:text-4xl font-display font-bold text-foreground">{stat.value}</span>
                  </div>
                  <span className="text-sm sm:text-base text-foreground tracking-wide font-medium">{stat.label}</span>
                </div>
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
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight">
                Geschichte wird <span className="text-primary text-5xl sm:text-6xl md:text-7xl block mt-2 italic">lebendig.</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 font-light">
                Stellen Sie sich vor, Sie könnten die Vergangenheit nicht nur lesen, sondern mit ihr in den Dialog treten.
                <span className="block mt-4 text-foreground font-medium">Meum Diarium</span> nutzt fortschrittlichste KI, um die Gedankenwelten von Caesar, Cicero und anderen Giganten der Geschichte auf Basis ihrer authentischen Schriften zu rekonstruieren.
              </p>
              <div className="space-y-4">
                {[
                  'Authentische Rekonstruktionen',
                  'Interaktive Dialoge mit dem Altertum',
                  'Lateinisch-Deutsche Quellenstudien'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-lg font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
              <div className="relative rounded-3xl overflow-hidden border border-border/40 aspect-square lg:aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1549490339-bca904392ac9?q=80&w=2070&auto=format&fit=crop"
                  alt="Ancient Roman Architecture with modern digital flow"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/5 backdrop-blur-xl border border-border/40 rounded-2xl p-6 hover:border-primary/50 transition-all group/demo overflow-hidden">
                    <p className="text-sm font-medium text-primary uppercase tracking-widest mb-2 group-hover/demo:translate-x-1 transition-transform">Live Demonstration</p>
                    <p className="text-xl font-display font-semibold transition-colors group-hover/demo:text-primary">"Alea iacta est" – Sprich mit <span className="italic">Caesar</span> über den Rubikon.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* New Section: Giganten der Antike */}
      <section className="py-40 relative z-10 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-secondary/5 blur-[120px] rounded-full -translate-x-1/2" />
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center mb-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tighter"
            >
              Die <span className="text-primary italic">Giganten</span> der Antike.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl sm:text-2xl text-muted-foreground max-w-3xl font-light leading-relaxed italic opacity-80"
            >
              Von den Hallen des Senats bis zu den Fernen des Imperiums – begegne den Menschen, die unsere Welt geformt haben. In einer Tiefe, die kein Geschichtsbuch erreicht.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: 'Strategie & Macht',
                desc: 'Erfahre von Caesar die Geheimnisse seiner Feldzüge und den Preis des Triumphs.',
                icon: '🦅',
                color: 'from-primary/20 to-transparent'
              },
              {
                title: 'Rhetorik & Recht',
                desc: 'Cicero führt dich in die Kunst der Überzeugung und die Verteidigung der Republik ein.',
                icon: '⚖️',
                color: 'from-secondary/20 to-transparent'
              },
              {
                title: 'Weisheit & Seelenruhe',
                desc: 'Seneca lehrt dich die stoische Gelassenheit in einer Welt voller Unruhe.',
                icon: '🌿',
                color: 'from-accent/20 to-transparent'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative bg-white/[0.02] backdrop-blur-3xl p-10 rounded-3xl border border-border/40 hover:border-primary/50 transition-all duration-700 group overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <div className="relative z-10">
                  <div className="text-5xl mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-700 block">{feature.icon}</div>
                  <h3 className="font-display text-3xl font-bold mb-6">{feature.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Section: Wissen in Echtzeit */}
      <section className="py-32 relative z-10 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-30" />
                <div className="relative bg-card/60 backdrop-blur-2xl border border-border/40 rounded-3xl p-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-border/40 hover:border-primary/40 transition-all">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary">C</div>
                      <div>
                        <p className="text-sm font-bold text-primary mb-1">CAESAR</p>
                        <p className="text-lg font-display">"Veni, vidi, vici. Doch was sah ich wirklich in den Augen der Gallier?"</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-primary/10 border border-primary/20 ml-8">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-white">AI</div>
                      <div>
                        <p className="text-sm font-bold text-primary mb-1">SYSTEM</p>
                        <p className="text-lg">Analysiere 'Commentarii de Bello Gallico'... Rekonstruiere emotionale Kontext-Ebenen...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight">
                Intelligenz trifft <span className="text-primary text-5xl sm:text-6xl md:text-7xl block mt-2 italic">Unendlichkeit.</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 font-light">
                Wir nutzen nicht einfach nur Text-Modelle. Wir erschaffen <span className="text-foreground font-medium">digitale Consciousness-Proxies</span>.
                Jedes Wort, das unsere KI wählt, ist verankert in den rhetorischen Mustern und philosophischen Überzeugungen des jeweiligen Autors.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-secondary/20 border border-border/40 hover:border-primary/40 transition-all group overflow-hidden">
                  <p className="text-3xl font-display font-bold text-primary mb-2 group-hover:scale-110 transition-transform origin-left">99%</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Texttreue</p>
                </div>
                <div className="p-6 rounded-2xl bg-secondary/20 border border-border/40 hover:border-primary/40 transition-all group overflow-hidden">
                  <p className="text-3xl font-display font-bold text-primary mb-2 group-hover:scale-110 transition-transform origin-left">&lt; 1s</p>
                  <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Antwortzeit</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <FeatureShowcase />

      {/* Main Links - Enhanced Grid */}
      <section className="py-24 sm:py-32 bg-background relative z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                to: "/timeline",
                icon: Clock,
                title: t('navTimeline'),
                desc: t('timelineDesc'),
                color: 'from-blue-500/20 to-cyan-500/20'
              },
              {
                to: "/lexicon",
                icon: BookMarked,
                title: t('navLexicon'),
                desc: t('lexiconDesc'),
                color: 'from-emerald-500/20 to-teal-500/20'
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Link to={item.to} className="group relative block h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-2xl`} />
                  <Card className="h-full p-8 sm:p-10 border border-border/40 bg-card/60 backdrop-blur-xl group-hover:border-primary/40 group-hover:-translate-y-1 transition-all duration-500 rounded-3xl overflow-hidden relative">
                    <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <item.icon className="h-7 w-7 text-foreground" />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed mb-6 italic opacity-70">
                      {item.desc}
                    </p>
                    <div className="flex items-center text-primary font-semibold group-hover:translate-x-1 transition-transform">
                      Entdecken <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div id="authors">
        <AuthorGrid />
      </div>

      <FeaturedPost />

      {/* Quote Section with enhanced design */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-left" />
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <Quote className="w-12 h-12 text-primary/40 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-display font-bold">Worte der Ewigkeit</h2>
          </div>
          <QuoteOfDay />
        </div>
      </section>

      <ReadingStats />
    </div>
  );
}
