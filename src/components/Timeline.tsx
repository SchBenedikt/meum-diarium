import { useState, useMemo, useEffect } from 'react';
import { timelineEvents as staticTimelineEvents } from '@/data/timeline';
import { authors as baseAuthors } from '@/data/authors';
import { cn } from '@/lib/utils';
import { Calendar, Star, BookOpen, Skull, Filter, X, BookMarked, GraduationCap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Author, TimelineEvent, AuthorInfo } from '@/types/blog';
import { Link } from 'react-router-dom';
import { usePosts } from '@/hooks/use-posts';
import slugify from 'slugify';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedTimeline, getTranslatedAuthors } from '@/lib/translator';
import { buildTimelineEvents } from '@/lib/timeline-builder';
import { BlogPost } from '@/types/blog';

type ContentFilter = 'all' | 'diary' | 'scientific';
type FilterType = 'all' | 'birth' | 'event' | 'work' | 'death';

const typeIcons = {
  birth: Star,
  death: Skull,
  event: Calendar,
  work: BookOpen,
};


const findPostByEvent = (event: TimelineEvent, posts: BlogPost[]) => {
  const eventSlug = slugify(event.title, { lower: true, strict: true });
  return posts.find(p =>
    p.slug === eventSlug ||
    p.title === event.title ||
    (p.historicalYear === event.year && p.author === event.author)
  );
}

// Helper function to check if a post has content for a specific perspective
const hasContent = (post: BlogPost, perspective: 'diary' | 'scientific') => {
  const content = post?.content?.[perspective];
  return content != null && typeof content === 'string' && content.trim().length > 0;
};

export function Timeline() {
  const { language, t } = useLanguage();
  const { posts } = usePosts();
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(staticTimelineEvents);
  const [authors, setAuthors] = useState<Record<string, AuthorInfo>>(baseAuthors);

  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([]);
  const [selectedType, setSelectedType] = useState<FilterType>('all');
  const [contentFilter, setContentFilter] = useState<ContentFilter>('all');
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  useEffect(() => {
    async function updateTimeline() {
      const translatedStatic = await getTranslatedTimeline(language);
      const translatedAuthors = await getTranslatedAuthors(language);
      setAuthors(translatedAuthors);
      const merged = buildTimelineEvents(language, posts, translatedStatic, { deduplicate: true });
      setTimelineEvents(merged);
    }
    updateTimeline();
  }, [language, posts]);

  const typeLabels: Record<string, string> = {
    birth: t('birth'),
    death: t('death'),
    event: t('event'),
    work: t('work'),
  };

  const filteredEvents = useMemo(() => {
    return timelineEvents.filter((event) => {
      const authorMatch = selectedAuthors.length === 0 || selectedAuthors.includes(event.author);
      const typeMatch = selectedType === 'all' || event.type === selectedType;

      let contentMatch = true;
      if (contentFilter !== 'all') {
        const post = findPostByEvent(event, posts);
        if (post) {
          contentMatch = hasContent(post, contentFilter);
        }
      }

      return authorMatch && typeMatch && contentMatch;
    });
  }, [timelineEvents, selectedAuthors, selectedType, contentFilter, posts]);

  const toggleAuthor = (authorId: Author) => {
    setSelectedAuthors(prev =>
      prev.includes(authorId)
        ? prev.filter(a => a !== authorId)
        : [...prev, authorId]
    );
  };

  const clearFilters = () => {
    setSelectedAuthors([]);
    setSelectedType('all');
  };

  const hasFilters = selectedAuthors.length > 0 || selectedType !== 'all';

  // Calculate timeline range safely
  const safeYears = timelineEvents.filter(e => Number.isFinite(e.year)).map(e => e.year);
  const minYear = safeYears.length ? Math.min(...safeYears) : -100;
  const maxYear = safeYears.length ? Math.max(...safeYears) : 100;
  const totalRange = maxYear - minYear || 1;

  const formatYear = (year: number) => {
    if (!Number.isFinite(year)) return '—';
    return year > 0 ? `${year} n. Chr.` : `${Math.abs(year)} v. Chr.`;
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {[{ label: 'Späte Republik', tone: 'from-amber-500/25 via-amber-500/10 to-transparent' }, { label: 'Bürgerkriege', tone: 'from-red-500/25 via-red-500/10 to-transparent' }, { label: 'Principat', tone: 'from-indigo-500/25 via-indigo-500/10 to-transparent' }, { label: 'Stoa & Briefe', tone: 'from-emerald-500/25 via-emerald-500/10 to-transparent' }].map(({ label, tone }) => (
            <span
              key={label}
              className={`px-3 py-1 rounded-full bg-gradient-to-r ${tone} border border-border/60 backdrop-blur-sm font-semibold text-[10px]`}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Filters - mobile optimized */}
        <div className="mb-8 sm:mb-10 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border/40 bg-gradient-to-br from-card/80 via-card/60 to-background/80 backdrop-blur-xl shadow-[0_25px_90px_-60px_rgba(0,0,0,0.65)] space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t('filter')}</span>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                {t('clearFilters')}
              </button>
            )}
          </div>

          {/* Author Filter - mobile optimized */}
          <div className="flex flex-wrap gap-2">
            {Object.values(authors).map((author) => {
              const isSelected = selectedAuthors.includes(author.id as Author);
              return (
                <button
                  key={author.id}
                  onClick={() => toggleAuthor(author.id as Author)}
                  className={cn(
                    "flex items-center gap-2 px-3 sm:px-4 py-2 min-h-[40px] rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation active:scale-95",
                    isSelected
                      ? `bg-author-${author.id} text-white `
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70"
                  )}
                >
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full flex-shrink-0",
                      isSelected ? "bg-white" : `bg-author-${author.id}`
                    )}
                  />
                  <span className="whitespace-nowrap">{author.name}</span>
                </button>
              );
            })}
          </div>

          {/* Type Filter - mobile optimized */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'birth', 'event', 'work', 'death'] as FilterType[]).map((type) => {
              const Icon = type === 'all' ? Calendar : typeIcons[type as keyof typeof typeIcons];
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 min-h-[40px] rounded-lg text-sm transition-all duration-200 touch-manipulation active:scale-95",
                    selectedType === type
                      ? "bg-primary text-primary-foreground "
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary active:bg-secondary"
                  )}
                >
                  <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="whitespace-nowrap">{type === 'all' ? t('all') : typeLabels[type as keyof typeof typeLabels]}</span>
                </button>
              );
            })}
          </div>

          {/* Content Filter - NEW */}
          <div className="pt-4 border-t border-border/40">
            <div className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Nach Inhalt filtern
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setContentFilter('all')}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 min-h-[40px] rounded-lg text-sm transition-all duration-200 touch-manipulation active:scale-95',
                  contentFilter === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary active:bg-secondary'
                )}
              >
                <BookMarked className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="whitespace-nowrap">Alle</span>
              </button>
              <button
                onClick={() => setContentFilter('diary')}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 min-h-[40px] rounded-lg text-sm transition-all duration-200 touch-manipulation active:scale-95',
                  contentFilter === 'diary'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary active:bg-secondary'
                )}
              >
                <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="whitespace-nowrap">📔 Tagebuch</span>
              </button>
              <button
                onClick={() => setContentFilter('scientific')}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 min-h-[40px] rounded-lg text-sm transition-all duration-200 touch-manipulation active:scale-95',
                  contentFilter === 'scientific'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary active:bg-secondary'
                )}
              >
                <GraduationCap className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="whitespace-nowrap">📚 Wissenschaftlich</span>
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Timeline Bar */}
        <div className="mb-12 px-4">
          {/* Period labels above timeline */}
          <div className="relative mb-3">
            <div className="flex justify-between text-[10px] sm:text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">
              <div className="flex flex-col items-start">
                <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">Republik</span>
                <span className="text-[9px] mt-0.5 opacity-60">{formatYear(-100)} - {formatYear(-27)}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-600 dark:text-red-400">Bürgerkriege</span>
                <span className="text-[9px] mt-0.5 opacity-60">{formatYear(-49)} - {formatYear(-30)}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">Kaiserzeit</span>
                <span className="text-[9px] mt-0.5 opacity-60">{formatYear(-27)} - {formatYear(68)}</span>
              </div>
            </div>
          </div>

          <div className="relative h-3 bg-gradient-to-r from-amber-500/10 via-red-500/10 to-indigo-500/10 rounded-full overflow-hidden border border-border/30 shadow-inner">
            {/* Year markers every 20 years */}
            {[...Array(Math.ceil((maxYear - minYear) / 20))].map((_, i) => {
              const year = minYear + (i * 20);
              const position = ((year - minYear) / totalRange) * 100;
              return (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-px bg-border/20"
                  style={{ left: `${position}%` }}
                />
              );
            })}

            {filteredEvents.map((event, idx) => {
              const position = Number.isFinite(event.year)
                ? ((event.year - minYear) / totalRange) * 100
                : 50;
              const isBarHovered = hoveredEvent === `${event.year}-${event.title}`;
              const eventId = `event-${event.year}-${event.title.replace(/\s+/g, '-')}`;

              const handleBarClick = () => {
                const element = document.getElementById(eventId);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setHoveredEvent(`${event.year}-${event.title}`);
                  setTimeout(() => setHoveredEvent(null), 2000);
                }
              };

              return (
                <motion.button
                  key={`bar-${event.year}-${event.title}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.6 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleBarClick}
                  className={cn(
                    "absolute top-1/2 rounded-full cursor-pointer transition-all duration-300",
                    `bg-author-${event.author || 'caesar'}`,
                    isBarHovered ? "h-5 w-5 z-10 ring-4 ring-background shadow-[0_8px_30px_-12px_rgba(0,0,0,0.4)]" : "h-3 w-3 shadow-[0_4px_15px_-5px_rgba(0,0,0,0.3)]"
                  )}
                  style={{
                    left: `${position}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onMouseEnter={() => setHoveredEvent(`${event.year}-${event.title}`)}
                  onMouseLeave={() => setHoveredEvent(null)}
                  aria-label={`Springe zu ${event.title}`}
                >
                  {isBarHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-2 bg-card border border-border rounded-lg text-xs font-medium pointer-events-none z-20 shadow-xl"
                    >
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{formatYear(event.year)}</div>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
          <div className="flex justify-between mt-3 text-xs font-medium text-muted-foreground">
            <span>{formatYear(minYear)}</span>
            <span className="text-[10px] text-center flex-1">{filteredEvents.length} Ereignisse</span>
            <span>{formatYear(maxYear)}</span>
          </div>
        </div>

        {/* Timeline Events - mobile optimized */}
        <div className="relative max-w-4xl mx-auto px-2 sm:px-0">
          {/* Center Line */}
          <div className="absolute left-6 sm:left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-border via-border to-transparent md:-translate-x-px" />

          <AnimatePresence mode="popLayout">
            {filteredEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {t('noEventsFound')}
                </p>
              </motion.div>
            ) : (
              filteredEvents.map((event, index) => {
                const author = event.author ? authors[event.author] : null;
                const Icon = typeIcons[event.type];
                const isLeft = index % 2 === 0;
                const isHovered = hoveredEvent === `${event.year}-${event.title}`;
                const post = findPostByEvent(event, posts);

                const EventContent = () => (
                  <>
                    {/* Content Card - mobile optimized */}
                    <div className={cn(
                      "flex-1 ml-12 sm:ml-16 md:ml-0",
                      isLeft ? "md:text-right md:pr-8" : "md:text-left md:pl-8"
                    )}>
                      <motion.div
                        className={cn(
                          "inline-block bg-gradient-to-br from-card/80 via-card/60 to-background/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border transition-all duration-300 text-left touch-manipulation shadow-[0_25px_80px_-60px_rgba(0,0,0,0.65)]",
                          post ? 'cursor-pointer' : '',
                          isHovered && post
                            ? `border-author-${event.author || 'caesar'} `
                            : "border-border/50 hover:border-border/70",
                          isLeft ? "md:ml-auto" : ""
                        )}
                        style={{
                          boxShadow: isHovered
                            ? `0 20px 60px -30px ${author?.color || 'rgba(0,0,0,0.45)'}`
                            : undefined,
                          borderColor: isHovered && author?.color ? author.color : undefined,
                        }}
                      >
                        {/* Header - mobile optimized */}
                        <div className={cn(
                          "flex flex-wrap items-center gap-2 mb-3",
                          isLeft ? "md:justify-end" : ""
                        )}>
                          <span className="text-sm sm:text-base font-extrabold tracking-tight" style={{ color: author?.color }}>
                            {formatYear(event.year)}
                          </span>
                          <span className={cn(
                            "px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-widest",
                            "bg-secondary/80 text-secondary-foreground border border-border/40"
                          )}>
                            {typeLabels[event.type]}
                          </span>
                          {author && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border/40" style={{ backgroundColor: `${author.color}10` }}>
                              <div
                                className={cn(
                                  "h-4 w-4 rounded flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0",
                                  `bg-author-${event.author || 'caesar'}`
                                )}
                              >
                                {author.name.charAt(0)}
                              </div>
                              <span className="text-[10px] font-semibold" style={{ color: author.color }}>
                                {author.name}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content - mobile optimized */}
                        <h3 className={cn(
                          "font-display text-lg sm:text-xl font-bold mb-2 transition-colors duration-200 line-clamp-2",
                          post && 'hover:text-primary',
                          isHovered && post && 'text-primary'
                        )}>
                          {event.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {event.description}
                        </p>

                        {/* Read More */}
                        {post && (
                          <div className="mt-4 pt-3 border-t border-border/30">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200",
                              isHovered ? 'text-primary' : 'text-muted-foreground'
                            )}>
                              {t('readMore')}
                              <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        )}
                      </motion.div>
                    </div>

                    {/* Center Icon - mobile optimized */}
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "absolute left-6 sm:left-8 md:left-1/2 md:-translate-x-1/2",
                        "h-11 w-11 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center z-10 transition-all duration-300 border-4 border-background",
                        `bg-author-${event.author || 'caesar'}`,
                        post && "cursor-pointer hover:shadow-lg touch-manipulation",
                        isHovered && "ring-4 ring-primary/20 scale-110 shadow-xl"
                      )}
                    >
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </motion.div>

                    {/* Spacer */}
                    <div className="hidden md:block flex-1" />
                  </>
                );

                const eventId = `event-${event.year}-${event.title.replace(/\s+/g, '-')}`;

                const TimelineItem = (
                  <motion.div
                    id={eventId}
                    key={`${event.year}-${event.title}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={cn(
                      "relative flex items-start gap-4 mb-10 scroll-mt-24",
                      "md:items-center",
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    )}
                    onMouseEnter={() => setHoveredEvent(`${event.year}-${event.title}`)}
                    onMouseLeave={() => setHoveredEvent(null)}
                  >
                    <EventContent />
                  </motion.div>
                );

                return post ? (
                  <Link key={`${event.year}-${event.title}`} to={`/${post.author}/${post.slug}`} className="block">
                    {TimelineItem}
                  </Link>
                ) : (
                  TimelineItem
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { value: filteredEvents.length, label: t('events') },
            { value: filteredEvents.filter(e => e.type === 'birth').length, label: t('births') },
            { value: filteredEvents.filter(e => e.type === 'work').length, label: t('works') },
            { value: `${Math.abs(minYear)}-${maxYear > 0 ? maxYear : Math.abs(maxYear)}`, label: t('timePeriod') },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-secondary/20 border border-border/40 backdrop-blur-sm"
            >
              <p className="font-display text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

