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
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute top-10 right-10 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
          </div>

          <div className="container mx-auto px-4 py-20 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr] items-center"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-[0.25em]">
                  <Calendar className="w-3.5 h-3.5" />
                  {t('interactiveChronology') || 'Interaktive Chronologie'}
                </div>

                <div className="space-y-4 max-w-3xl">
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-foreground">
                    {t('navTimeline') || 'Zeitstrahl, der lebt.'}
                  </h1>
                  <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
                    {t('timelinePageDesc') || 'Scroll durch Feldzüge, Intrigen und Ideen – kuratiert für Caesar, Cicero, Augustus und Seneca.'}
                  </p>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground/80">
                    {['Späte Republik', 'Bürgerkriege', 'Principat', 'Stoische Wende'].map(label => (
                      <span
                        key={label}
                        className="px-3 py-1 rounded-full bg-secondary/60 border border-border/60 backdrop-blur"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="p-4 rounded-2xl bg-card/80 backdrop-blur border border-border/60 shadow-[0_20px_70px_-40px_rgba(0,0,0,0.45)]"
                    >
                      <div className="flex items-center justify-start gap-2 mb-3 text-primary">
                        <stat.icon className="h-4 w-4" />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {stat.label}
                        </span>
                      </div>
                      <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button
                    onClick={scrollToTimeline}
                    className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2 shadow-lg shadow-primary/25"
                  >
                    Zeitstrahl öffnen
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <ShareButton
                    title="Zeitstrahl der Antike - Meum Diarium"
                    text="Entdecke wichtige Ereignisse des antiken Roms."
                  />
                </div>
              </div>

              <div className="relative">
                <div className="rounded-3xl border border-border/60 bg-card/70 backdrop-blur shadow-[0_30px_100px_-60px_rgba(0,0,0,0.65)] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary/80">Live Vorschau</p>
                      <p className="text-sm text-muted-foreground">Aktuelle Ereignisse nach Autorfarbe</p>
                    </div>
                    <div className="flex -space-x-2">
                      {['caesar', 'cicero', 'augustus', 'seneca'].map(author => (
                        <span
                          key={author}
                          className={`h-8 w-8 rounded-full border-2 border-card bg-author-${author}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-border to-transparent" />
                    <div className="space-y-4">
                      {heroPreview.map((event, idx) => (
                        <div key={`${event.title}-${idx}`} className="pl-8">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <span
                              className={`h-2.5 w-2.5 rounded-full bg-author-${event.author || 'caesar'}`}
                              aria-hidden
                            />
                            <span className="font-semibold text-foreground line-clamp-1">{event.title}</span>
                          </div>
                          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                            {formatYear(event.year)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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