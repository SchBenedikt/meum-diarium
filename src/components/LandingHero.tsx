
import { BookMarked, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QuoteOfDay } from './QuoteOfDay';
import { FeaturedPost } from './FeaturedPost';
import { ReadingStats } from './ReadingStats';
import { AuthorGrid } from './AuthorGrid';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FeatureShowcase } from '@/components/home/FeatureShowcase';
import { fadeUp, staggerContainer, defaultTransition, float } from '@/lib/motion';
import { ModernBackground } from './ui/ModernBackground';
import { useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function LandingHero() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Parallax effects for hero content
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background" ref={containerRef}>
      {/* Hero Section - Dynamic & Modern */}
      <section className="relative min-h-[95vh] flex items-center justify-center text-center overflow-hidden pt-20 pb-16 px-4">
        {/* Modern Background Wrapper */}
        <ModernBackground />

        {/* Background Animation Elements - Refined */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[15%] left-[15%] w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse opacity-60" />
          <div className="absolute bottom-[15%] right-[15%] w-[30rem] h-[30rem] bg-secondary/20 rounded-full blur-[150px] animate-blob opacity-60" />
        </div>

        <div className="container mx-auto relative z-10 px-4 sm:px-6 flex flex-col items-center">
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.div
              variants={fadeUp(0.1)}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-surface-container-high/40 backdrop-blur-md border border-white/10 text-primary text-sm font-medium mb-8 hover:bg-surface-container-high/60 transition-all cursor-default"
            >
              <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
              {t('discoverAntiquity') || 'Entdecke die Antike neu'}
            </motion.div>

            <motion.h1
              variants={fadeUp(0.2)}
              style={{ y: y2 }}
              className="font-display text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-6 md:mb-8 leading-[0.95] tracking-tighter font-bold text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-foreground/50"
            >
              Meum Diarium
            </motion.h1>

            <motion.p
              variants={fadeUp(0.3)}
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              {t('heroSubtitle')}
            </motion.p>

            <motion.div
              variants={fadeUp(0.4)}
              style={{ y: y1 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-6"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Button size="lg" className="h-14 px-10 text-lg rounded-full border border-white/10 hover:border-primary/50 transition-all w-full sm:w-auto bg-primary text-primary-foreground relative overflow-hidden group shadow-none" asChild>
                  <a href="#authors">
                    <span className="relative z-10 flex items-center">
                      {t('discoverAuthorsBtn')}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-white/10 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full" />
                  </a>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="lg" className="h-14 px-10 text-lg rounded-full backdrop-blur-md bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 w-full sm:w-auto shadow-none" asChild>
                  <Link to="/about">
                    Mehr erfahren
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Showcase - Moved up as requested */}
      <FeatureShowcase />

      {/* Main Links - Clean M3 Cards */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="container-centered px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {[
              { to: "/timeline", icon: Clock, title: t('navTimeline'), desc: t('timelineDesc') },
              { to: "/lexicon", icon: BookMarked, title: t('navLexicon'), desc: t('lexiconDesc') },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ ...defaultTransition, duration: 0.4, delay: index * 0.1 }}
              >
                <Link to={item.to} className="block touch-manipulation">
                  <Card variant="outlined" className="h-full p-6 sm:p-8 flex flex-col items-start bg-surface-container-low/40 backdrop-blur-md border-white/5 hover:border-primary/30 hover:bg-surface-container-low/60 active:scale-[0.98] transition-all group overflow-hidden relative">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <item.icon className="h-6 w-6 sm:h-7 sm:w-7 text-secondary-foreground" />
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-medium mb-2 sm:mb-3 text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
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


      {/* Quote of the Day */}
      <section className="py-12 sm:py-16 md:py-20 bg-surface-container-low">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <QuoteOfDay />
        </div>
      </section>

      <ReadingStats />
    </div>
  );
}
