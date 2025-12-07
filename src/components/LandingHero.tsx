
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

export function LandingHero() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero Section - M3 Style with generous whitespace */}
      <section className="relative min-h-[85vh] flex items-center justify-center text-center overflow-hidden hero-gradient py-24 md:py-32">
        <div className="container mx-auto relative z-10 px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-surface-container-high border border-outline-variant text-primary text-sm font-medium mb-8"
            >
              {t('discoverAntiquity') || 'Entdecke die Antike'}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="font-display text-5xl sm:text-7xl lg:text-8xl mb-8 leading-[1.1] tracking-tight font-[450] text-foreground"
            >
              {t('appName')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              {t('heroSubtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-wrap justify-center items-center gap-4"
            >
              <Button size="lg" className="h-14 px-8 text-lg rounded-lg" asChild>
                <a href="#authors">
                  {t('discoverAuthorsBtn')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Links - Clean M3 Cards */}
      <section className="py-20 bg-background">
        <div className="container-centered px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { to: "/timeline", icon: Clock, title: t('navTimeline'), desc: t('timelineDesc') },
              { to: "/lexicon", icon: BookMarked, title: t('navLexicon'), desc: t('lexiconDesc') },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
              >
                <Link to={item.to}>
                  <Card variant="elevated" className="h-full p-8 flex flex-col items-start hover:bg-surface-container-low transition-colors group">
                    <div className="h-14 w-14 rounded-lg bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="h-7 w-7 text-secondary-foreground" />
                    </div>
                    <h3 className="font-display text-2xl font-medium mb-3 text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
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
      <section className="py-20 bg-surface-container-low">
        <div className="container mx-auto max-w-4xl px-6">
          <QuoteOfDay />
        </div>
      </section>

      <ReadingStats />
    </div>
  );
}
