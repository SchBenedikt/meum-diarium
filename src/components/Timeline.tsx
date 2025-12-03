
import { useState, useMemo, useEffect } from 'react';
import { timelineEvents as staticTimelineEvents } from '@/data/timeline';
import { authors as baseAuthors } from '@/data/authors';
import { cn } from '@/lib/utils';
import { Calendar, Star, BookOpen, Skull, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Author, TimelineEvent, AuthorInfo } from '@/types/blog';
import { Link } from 'react-router-dom';
import { usePosts } from '@/hooks/use-posts';
import slugify from 'slugify';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedTimeline, getTranslatedAuthors } from '@/lib/translator';
import { buildTimelineEvents } from '@/lib/timeline-builder';
import { BlogPost } from '@/types/blog';

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

export function Timeline() {
  const { language, t } = useLanguage();
  const { posts } = usePosts();
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(staticTimelineEvents);
  const [authors, setAuthors] = useState<Record<string, AuthorInfo>>(baseAuthors);

  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([]);
  const [selectedType, setSelectedType] = useState<FilterType>('all');
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
    return timelineEvents.filter(event => {
      const authorMatch = selectedAuthors.length === 0 || 
        (event.author && selectedAuthors.includes(event.author));
      const typeMatch = selectedType === 'all' || event.type === selectedType;
      return authorMatch && typeMatch;
    });
  }, [selectedAuthors, selectedType, timelineEvents]);

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

  // Calculate timeline range
  const minYear = Math.min(...timelineEvents.map(e => e.year));
  const maxYear = Math.max(...timelineEvents.map(e => e.year));
  const totalRange = maxYear - minYear;

  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4">
        {/* Filters - mobile optimized */}
        <div className="mb-8 sm:mb-10 p-3 sm:p-4 rounded-2xl border border-border bg-card space-y-3 sm:space-y-4">
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
                    "flex items-center gap-2 px-3 sm:px-4 py-2 min-h-[40px] rounded-xl text-sm font-medium transition-all duration-200 touch-manipulation active:scale-95",
                    isSelected 
                      ? `bg-author-${author.id} text-white shadow-lg` 
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
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary active:bg-secondary"
                  )}
                >
                  <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="whitespace-nowrap">{type === 'all' ? t('all') : typeLabels[type as keyof typeof typeLabels]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Horizontal Timeline Bar */}
        <div className="mb-12 px-4">
          <div className="relative h-3 bg-secondary/50 rounded-full">
            {filteredEvents.map((event, idx) => {
              const position = ((event.year - minYear) / totalRange) * 100;
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
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleBarClick}
                  className={cn(
                    "absolute top-1/2 rounded-full cursor-pointer transition-all duration-300 shadow-sm",
                    `bg-author-${event.author || 'caesar'}`,
                    isBarHovered ? "h-5 w-5 z-10 shadow-lg ring-2 ring-background" : "h-3 w-3"
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
                      className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 bg-card border border-border rounded-lg shadow-lg text-xs font-medium pointer-events-none z-20"
                    >
                      {event.title}
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
          <div className="flex justify-between mt-4 text-xs font-medium text-muted-foreground">
            <span>{Math.abs(minYear)} v. Chr.</span>
            <span>{maxYear > 0 ? `${maxYear} n. Chr.` : `${Math.abs(maxYear)} v. Chr.`}</span>
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
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "inline-block bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-md border-2 transition-all duration-300 text-left touch-manipulation",
                          post ? 'cursor-pointer hover:shadow-xl active:shadow-lg' : '',
                          isHovered && post
                            ? `border-author-${event.author || 'caesar'} shadow-xl` 
                            : "border-border hover:border-border/80",
                          isLeft ? "md:ml-auto" : ""
                        )}
                      >
                        {/* Header - mobile optimized */}
                        <div className={cn(
                          "flex flex-wrap items-center gap-2 mb-2 sm:mb-3",
                          isLeft ? "md:justify-end" : ""
                        )}>
                          {author && (
                            <div 
                              className={cn(
                                "h-6 w-6 sm:h-7 sm:w-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0",
                                `bg-author-${event.author || 'caesar'}`
                              )}
                            >
                              {author.name.charAt(0)}
                            </div>
                          )}
                          <span 
                            className="text-xs sm:text-sm font-bold"
                            style={{ color: author?.color }}
                          >
                            {event.year > 0 ? `${event.year} n. Chr.` : `${Math.abs(event.year)} v. Chr.`}
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider",
                            "bg-secondary text-secondary-foreground"
                          )}>
                            {typeLabels[event.type]}
                          </span>
                        </div>

                        {/* Content - mobile optimized */}
                        <h3 className={cn(
                          "font-display text-base sm:text-lg font-semibold mb-1.5 sm:mb-2 transition-colors duration-200 line-clamp-2", 
                          post && 'hover:text-primary',
                          isHovered && post && 'text-primary'
                        )}>
                          {event.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-3">
                          {event.description}
                        </p>

                        {/* Author Name & Read More */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                          {author && (
                            <p className="text-xs font-medium text-muted-foreground">
                              {author.name}
                            </p>
                          )}
                          {post && (
                            <span className={cn(
                              "text-xs font-medium transition-colors duration-200",
                              isHovered ? 'text-primary' : 'text-muted-foreground'
                            )}>
                              {t('readMore')} →
                            </span>
                          )}
                        </div>
                      </motion.div>
                    </div>

                    {/* Center Icon - mobile optimized */}
                    <motion.div
                      whileHover={{ scale: 1.25, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "absolute left-6 sm:left-8 md:left-1/2 md:-translate-x-1/2",
                        "h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg z-10 transition-all duration-300",
                        `bg-author-${event.author || 'caesar'}`,
                        post && "cursor-pointer hover:shadow-2xl touch-manipulation",
                        isHovered && "ring-4 ring-background scale-110"
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
                      "relative flex items-start gap-4 mb-6 scroll-mt-24",
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
              className="p-4 rounded-xl bg-secondary/30"
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

type FilterType = 'all' | 'birth' | 'death' | 'event' | 'work';
    
