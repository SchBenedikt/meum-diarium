import { Footer } from '@/components/layout/Footer';
import { Timeline } from '@/components/Timeline';
import { ShareButton } from '@/components/ShareButton';
import { Calendar, Clock, Users, BookMarked, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { timelineEvents as staticTimelineEvents } from '@/data/timeline';
import { useEffect, useState, useMemo } from 'react';
import { usePosts } from '@/hooks/use-posts';
import { buildTimelineEvents } from '@/lib/timeline-builder';
import { useAuthor } from '@/context/AuthorContext';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedTimeline } from '@/lib/translator';
import { TimelineEvent } from '@/types/blog';

export default function TimelinePage() {
  const { setCurrentAuthor } = useAuthor();
  const { language, t } = useLanguage();
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(staticTimelineEvents);
  const { posts } = usePosts();
  const heroPreview = useMemo(() => timelineEvents.slice(0, 4), [timelineEvents]);

  useEffect(() => {
    setCurrentAuthor(null);
  }, [setCurrentAuthor]);

  useEffect(() => {
    async function translateAndMerge() {
      const translatedStatic = await getTranslatedTimeline(language);
      const merged = buildTimelineEvents(language, posts, translatedStatic, { deduplicate: true });
      setTimelineEvents(merged);
    }
    translateAndMerge();
  }, [language, posts]);

  const formatYear = (year: number) => year > 0 ? `${year} n. Chr.` : `${Math.abs(year)} v. Chr.`;

  const stats = useMemo(() => {
    const totalEvents = timelineEvents.length;
    const safeYears = timelineEvents.filter(e => Number.isFinite(e.year)).map(e => e.year);
    const minYear = safeYears.length ? Math.min(...safeYears) : -100;
    const maxYear = safeYears.length ? Math.max(...safeYears) : 100;

    return [
      { icon: BookMarked, value: totalEvents.toString(), label: t('events') },
      { icon: Users, value: '4', label: t('personalities') },
      { icon: Clock, value: formatYear(minYear), label: t('start') },
      { icon: Calendar, value: formatYear(maxYear), label: t('end') },
    ];
  }, [timelineEvents, t]);

  const scrollToTimeline = () => {
    document.getElementById('timeline-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        {/* Immersive Hero Section */}
        <section className="relative overflow-hidden bg-background pt-32 pb-20">
          {/* Animated Background Blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                x: [0, 100, 0],
                y: [0, 50, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-[20%] -left-[10%] h-[60%] w-[50%] rounded-full bg-primary/5 blur-[120px]"
            />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, -90, 0],
                x: [0, -80, 0],
                y: [0, -100, 0]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-[20%] -right-[10%] h-[60%] w-[50%] rounded-full bg-amber-500/5 blur-[120px]"
            />
          </div>

          {/* Background Texture/Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--foreground) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-8"
              >
                <Calendar className="w-3.5 h-3.5" />
                {t('interactiveChronology') || 'Interaktive Chronologie'}
              </motion.div>

              <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter text-foreground mb-8">
                {t('navTimeline') || 'Zeitstrahl'}
              </h1>

              <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                {t('timelinePageDesc') || 'Eintauchen in das goldene Zeitalter. Feldzüge, Intrigen und die Geburt einer Weltmacht.'}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="p-6 rounded-[2rem] bg-card/40 backdrop-blur-md border border-border/40 hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex items-center justify-center mb-3">
                      <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                        <stat.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="font-display text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={scrollToTimeline}
                  className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center gap-3 shadow-2xl shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  Zeitstrahl öffnen
                  <ChevronDown className="h-5 w-5 animate-bounce" />
                </motion.button>
                <ShareButton
                  title="Zeitstrahl der Antike - Meum Diarium"
                  text="Entdecke wichtige Ereignisse des antiken Roms."
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Timeline Content */}
        <div id="timeline-content">
          <Timeline />
        </div>
      </main>
      <Footer />
    </div>
  );
}