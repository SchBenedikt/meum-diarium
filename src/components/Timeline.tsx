
import { useState, useMemo } from 'react';
import { timelineEvents } from '@/data/timeline';
import { authors } from '@/data/authors';
import { cn } from '@/lib/utils';
import { Calendar, Star, BookOpen, Skull, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Author } from '@/types/blog';
import { Link } from 'react-router-dom';
import { posts } from '@/data/posts';
import slugify from 'slugify';

const typeIcons = {
  birth: Star,
  death: Skull,
  event: Calendar,
  work: BookOpen,
};

const typeLabels: Record<string, string> = {
  birth: 'Natus',
  death: 'Mortuus',
  event: 'Eventum',
  work: 'Opus',
};

const authorColorClasses: Record<string, string> = {
  caesar: 'bg-author-caesar',
  cicero: 'bg-author-cicero',
  augustus: 'bg-author-augustus',
  seneca: 'bg-author-seneca',
};

const authorBorderClasses: Record<string, string> = {
  caesar: 'border-author-caesar',
  cicero: 'border-author-cicero',
  augustus: 'border-author-augustus',
  seneca: 'border-author-seneca',
};

type FilterType = 'all' | 'birth' | 'death' | 'event' | 'work';

const findPostByEvent = (event: typeof timelineEvents[0]) => {
  const eventSlug = slugify(event.title, { lower: true, strict: true });
  return posts.find(p => p.slug === eventSlug);
}

export function Timeline() {
  const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([]);
  const [selectedType, setSelectedType] = useState<FilterType>('all');
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    return timelineEvents.filter(event => {
      const authorMatch = selectedAuthors.length === 0 || 
        (event.author && selectedAuthors.includes(event.author));
      const typeMatch = selectedType === 'all' || event.type === selectedType;
      return authorMatch && typeMatch;
    });
  }, [selectedAuthors, selectedType]);

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
    <section className="py-12">
      <div className="container mx-auto">
        {/* Filters */}
        <div className="mb-10 p-4 rounded-2xl border border-border bg-card space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtra</span>
            </div>
            
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Filtra reset
              </button>
            )}
          </div>

          {/* Author Filter */}
          <div className="flex flex-wrap gap-2">
            {Object.values(authors).map((author) => {
              const isSelected = selectedAuthors.includes(author.id);
              return (
                <button
                  key={author.id}
                  onClick={() => toggleAuthor(author.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    isSelected 
                      ? `${authorColorClasses[author.id]} text-white shadow-lg` 
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  <div 
                    className={cn(
                      "h-2 w-2 rounded-full",
                      isSelected ? "bg-white" : authorColorClasses[author.id]
                    )}
                  />
                  {author.name}
                </button>
              );
            })}
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'birth', 'event', 'work', 'death'] as FilterType[]).map((type) => {
              const Icon = type === 'all' ? Calendar : typeIcons[type as keyof typeof typeIcons];
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200",
                    selectedType === type
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {type === 'all' ? 'Omnia' : typeLabels[type as keyof typeof typeLabels]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Horizontal Timeline Bar */}
        <div className="mb-12 px-4">
          <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
            {filteredEvents.map((event) => {
              const position = ((event.year - minYear) / totalRange) * 100;
              const author = event.author ? authors[event.author] : null;
              return (
                <motion.div
                  key={`bar-${event.year}-${event.title}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    "absolute top-0 h-full w-1.5 rounded-full cursor-pointer transition-all duration-200",
                    authorColorClasses[event.author || 'caesar'],
                    hoveredEvent === `${event.year}-${event.title}` && "w-3 z-10"
                  )}
                  style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                  onMouseEnter={() => setHoveredEvent(`${event.year}-${event.title}`)}
                  onMouseLeave={() => setHoveredEvent(null)}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{Math.abs(minYear)} a.C.n.</span>
            <span>{maxYear > 0 ? `${maxYear} p.C.n.` : `${Math.abs(maxYear)} a.C.n.`}</span>
          </div>
        </div>

        {/* Timeline Events */}
        <div className="relative max-w-4xl mx-auto">
          {/* Center Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-border via-border to-transparent md:-translate-x-px" />

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
                  Nulla eventa his filtris inventa sunt
                </p>
              </motion.div>
            ) : (
              filteredEvents.map((event, index) => {
                const author = event.author ? authors[event.author] : null;
                const Icon = typeIcons[event.type];
                const isLeft = index % 2 === 0;
                const isHovered = hoveredEvent === `${event.year}-${event.title}`;
                const post = findPostByEvent(event);

                const EventContent = () => (
                  <>
                     {/* Content Card */}
                     <div className={cn(
                      "flex-1 ml-16 md:ml-0",
                      isLeft ? "md:text-right md:pr-8" : "md:text-left md:pl-8"
                    )}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                          "inline-block bg-card rounded-2xl p-5 shadow-sm border-2 transition-all duration-300 text-left",
                          post ? 'group' : '',
                          isHovered && post
                            ? `${authorBorderClasses[event.author || 'caesar']} shadow-lg` 
                            : "border-border",
                          isLeft ? "md:ml-auto" : ""
                        )}
                      >
                        {/* Header */}
                        <div className={cn(
                          "flex items-center gap-2 mb-3",
                          isLeft ? "md:justify-end" : ""
                        )}>
                          {author && (
                            <div 
                              className={cn(
                                "h-7 w-7 rounded-lg flex items-center justify-center text-white text-xs font-bold",
                                authorColorClasses[event.author || 'caesar']
                              )}
                            >
                              {author.name.charAt(0)}
                            </div>
                          )}
                          <span 
                            className="text-sm font-bold"
                            style={{ color: author?.color }}
                          >
                            {event.year > 0 ? `${event.year} p.C.n.` : `${Math.abs(event.year)} a.C.n.`}
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider",
                            "bg-secondary text-secondary-foreground"
                          )}>
                            {typeLabels[event.type]}
                          </span>
                        </div>

                        {/* Content */}
                        <h3 className={cn("font-display text-lg font-semibold mb-1", post && 'group-hover:text-primary')}>
                          {event.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {event.description}
                        </p>

                        {/* Author Name */}
                        {author && (
                          <p className={cn(
                            "text-xs mt-3 font-medium",
                            "text-muted-foreground"
                          )}>
                            {author.name}
                          </p>
                        )}
                      </motion.div>
                    </div>

                    {/* Center Icon */}
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className={cn(
                        "absolute left-8 md:left-1/2 md:-translate-x-1/2",
                        "h-10 w-10 rounded-xl flex items-center justify-center shadow-lg z-10 transition-all duration-300",
                        authorColorClasses[event.author || 'caesar'],
                        isHovered && "ring-4 ring-background"
                      )}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </motion.div>

                    {/* Spacer */}
                    <div className="hidden md:block flex-1" />
                  </>
                );

                return (
                  <motion.div
                    key={`${event.year}-${event.title}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={cn(
                      "relative flex items-start gap-4 mb-6",
                      "md:items-center",
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    )}
                    onMouseEnter={() => setHoveredEvent(`${event.year}-${event.title}`)}
                    onMouseLeave={() => setHoveredEvent(null)}
                  >
                   {post ? (
                      <Link to={`/${post.author}/${post.slug}`} className="contents">
                        <EventContent />
                      </Link>
                    ) : (
                      <div className="contents">
                        <EventContent />
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { value: filteredEvents.length, label: 'Eventus' },
            { value: filteredEvents.filter(e => e.type === 'birth').length, label: 'Nati' },
            { value: filteredEvents.filter(e => e.type === 'work').length, label: 'Opera' },
            { value: `${Math.abs(minYear)}-${maxYear > 0 ? maxYear : Math.abs(maxYear)}`, label: 'Aetas' },
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
