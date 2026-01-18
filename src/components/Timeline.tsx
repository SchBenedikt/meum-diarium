import { useState, useMemo, useEffect, useRef } from 'react';
import { timelineEvents as staticTimelineEvents } from '@/data/timeline';
import { authors as baseAuthors } from '@/data/authors';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Star,
  BookOpen,
  Skull,
  Search,
  BookMarked,
  GraduationCap,
  ArrowRight,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Author, TimelineEvent, AuthorInfo, BlogPost } from '@/types/blog';
import { Link } from 'react-router-dom';
import { usePosts } from '@/hooks/use-posts';
import slugify from 'slugify';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedTimeline, getTranslatedAuthors } from '@/lib/translator';
import { buildTimelineEvents } from '@/lib/timeline-builder';

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
  return posts.find(
    (p) =>
      p.slug === eventSlug ||
      p.title === event.title ||
      (p.historicalYear === event.year && p.author === event.author),
  );
};

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
  const [searchTerm, setSearchTerm] = useState('');

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
    birth: t('birth') || 'Geburt',
    death: t('death') || 'Tod',
    event: t('event') || 'Ereignis',
    work: t('work') || 'Werk',
  };

  const filteredEvents = useMemo(() => {
    return timelineEvents
      .slice()
      .sort((a, b) => a.year - b.year)
      .filter((event) => {
        const authorMatch = selectedAuthors.length === 0 || selectedAuthors.includes(event.author);
        const typeMatch = selectedType === 'all' || event.type === selectedType;

        const searchMatch = !searchTerm ||
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase());

        let contentMatch = true;
        if (contentFilter !== 'all') {
          const post = findPostByEvent(event, posts);
          if (post) {
            contentMatch = hasContent(post, contentFilter);
          } else {
            contentMatch = false;
          }
        }

        return authorMatch && typeMatch && contentMatch && searchMatch;
      });
  }, [timelineEvents, selectedAuthors, selectedType, contentFilter, posts, searchTerm]);

  const clearFilters = () => {
    setSelectedAuthors([]);
    setSelectedType('all');
    setContentFilter('all');
    setSearchTerm('');
  };

  const hasFilters = selectedAuthors.length > 0 || selectedType !== 'all' || contentFilter !== 'all' || searchTerm !== '';

  const formatYear = (year: number) => {
    if (!Number.isFinite(year)) return '—';
    return year > 0 ? `${year} n. Chr.` : `${Math.abs(year)} v. Chr.`;
  };

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Search & Filter Bar */}
        <div className="sticky top-20 z-50 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center gap-4 p-2 rounded-3xl bg-card border border-border/40 shadow-2xl shadow-primary/5 backdrop-blur-xl"
          >
            {/* Search Input */}
            <div className="relative flex-1 group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchTimeline') ?? 'Ereignisse durchsuchen...'}
                className="w-full bg-transparent border-none h-12 pl-11 pr-4 focus-visible:ring-0 text-base placeholder:text-muted-foreground/20 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 p-1 md:border-l border-border/40 w-full md:w-auto overflow-x-auto no-scrollbar">
              {/* Type Filter */}
              <div className="flex gap-1">
                {(['all', 'birth', 'event', 'work', 'death'] as FilterType[]).map((type) => {
                  const isSelected = selectedType === type;
                  const Label = type === 'all' ? (t('all') || 'Alle') : typeLabels[type] || type;
                  const Icon = type === 'all' ? Calendar : typeIcons[type as keyof typeof typeIcons];
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "hover:bg-secondary text-muted-foreground"
                      )}
                    >
                      <Icon className="h-3 w-3" />
                      <span className="hidden sm:inline">{Label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Clear Filters */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="rounded-xl h-10 w-10 flex items-center justify-center hover:bg-destructive/5 hover:text-destructive text-muted-foreground/40 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Decade Sections (Lexicon Style) */}
        <div className="space-y-24 pb-24">
          <AnimatePresence>
            {filteredEvents.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center py-32 text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-muted-foreground/20" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{t('noEventsFound') || 'Nicht gefunden'}</h3>
                  <p className="text-muted-foreground/60 font-light">{t('searchTimeline')}</p>
                </div>
                <button onClick={clearFilters} className="px-6 py-2 rounded-full border border-border/40 hover:bg-secondary transition-colors text-sm font-medium">
                  {t('clearFilters')}
                </button>
              </motion.div>
            ) : (
              Object.entries(
                filteredEvents.reduce((acc, event, index) => {
                  const decade = Math.floor(event.year / 10) * 10;
                  const decadeKey = `${decade}s`;
                  if (!acc[decadeKey]) acc[decadeKey] = [];
                  acc[decadeKey].push({ event, index });
                  return acc;
                }, {} as Record<string, Array<{ event: typeof filteredEvents[0], index: number }>>)
              ).map(([decadeKey, events]) => {
                const decade = parseInt(decadeKey);
                const isBC = decade < 0;
                const displayDecade = isBC ? Math.abs(decade) : decade;
                const decadeLabel = isBC ? `${displayDecade}er v. Chr.` : `${displayDecade}er n. Chr.`;

                return (
                  <div key={decadeKey} className="group/section">
                    {/* Decade Header */}
                    <div className="flex items-baseline gap-4 mb-10">
                      <span className="text-3xl sm:text-5xl font-black text-foreground/5 group-hover/section:text-primary/10 transition-colors duration-500 font-display italic">
                        {decadeLabel}
                      </span>
                      <div className="h-[1px] flex-1 bg-border/40" />
                    </div>

                    {/* Events Grid (Lexicon Card Style) */}
                    <div className="grid gap-px bg-border/40 border border-border/40 rounded-[2rem] overflow-hidden shadow-sm">
                      {events.map(({ event }, eventIdx) => {
                        const author = event.author ? authors[event.author] : null;
                        const Icon = typeIcons[event.type as keyof typeof typeIcons];
                        const post = findPostByEvent(event, posts);

                        const CardContent = (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover/entry:opacity-100 transition-opacity duration-500" />
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover/entry:scale-y-100 transition-transform duration-500 origin-top" />

                            <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                              <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-3">
                                  <span className={cn(
                                    "inline-flex items-center justify-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border",
                                    author ? `text-[${author.color}] border-[${author.color}]/20 bg-[${author.color}]/5` : "text-primary border-primary/20 bg-primary/10"
                                  )}
                                    style={author ? { color: author.color, borderColor: `${author.color}30`, backgroundColor: `${author.color}10` } : undefined}
                                  >
                                    {formatYear(event.year)}
                                  </span>
                                  <div className="w-1 h-1 rounded-full bg-border" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    {typeLabels[event.type]}
                                  </span>
                                </div>

                                <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight group-hover/entry:text-primary transition-colors italic">
                                  {event.title}
                                </h3>
                                <p className="text-muted-foreground/60 font-light leading-relaxed max-w-2xl text-base group-hover/entry:text-foreground/80 transition-colors">
                                  {event.description}
                                </p>

                                {author && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <div className="w-4 h-4 rounded-full bg-cover bg-center grayscale opacity-50 group-hover/entry:grayscale-0 group-hover/entry:opacity-100 transition-all" style={{ backgroundImage: `url(${author.heroImage})` }} />
                                    <span className="text-[10px] font-semibold text-muted-foreground/60 group-hover/entry:text-primary/80 transition-colors">{author.name}</span>
                                  </div>
                                )}

                              </div>
                              <div className="flex items-center gap-2 text-primary/0 group-hover/entry:text-primary/100 transition-all duration-500 -translate-x-4 group-hover/entry:translate-x-0 self-end sm:self-center">
                                {post && (
                                  <>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{t('readMore') || 'Details'}</span>
                                    <ArrowRight className="h-4 w-4" />
                                  </>
                                )}
                              </div>
                            </div>
                          </>
                        )

                        if (post) {
                          return (
                            <Link
                              key={`${event.year}-${event.title}`}
                              to={`/${post.author}/${post.slug}`}
                              className="group/entry relative bg-card p-8 sm:p-10 transition-all duration-500 hover:z-10 hover:bg-card/80 block"
                            >
                              {CardContent}
                            </Link>
                          )
                        }

                        return (
                          <div
                            key={`${event.year}-${event.title}`}
                            className="group/entry relative bg-card p-8 sm:p-10 transition-all duration-500 hover:z-10 hover:bg-card/80"
                          >
                            {CardContent}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
