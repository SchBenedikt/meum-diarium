
import { useAuthor } from '@/context/AuthorContext';
import { usePosts } from '@/hooks/use-posts';
import { BlogCard } from './BlogCard';
import { BookOpen, GraduationCap, BookMarked } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, defaultTransition } from '@/lib/motion';
import { SearchFilter } from './SearchFilter';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { BlogPost } from '@/types/blog';

type ContentFilter = 'all' | 'diary' | 'scientific';

export function BlogList() {
  const { currentAuthor, authorInfo } = useAuthor();
  const { posts, isLoading } = usePosts();
  const [searchQuery, setSearchQuery] = useState('');
  const [contentFilter, setContentFilter] = useState<ContentFilter>('all');

  if (!currentAuthor || !authorInfo) return null;
  if (isLoading) {
    // Optional: Add a loading skeleton here
    return <div>Loading...</div>;
  }

  // Helper function to check if a post has content for a specific perspective
  const hasContent = (post: BlogPost, perspective: 'diary' | 'scientific') => {
    const content = post?.content?.[perspective];
    return content != null && typeof content === 'string' && content.trim().length > 0;
  };

  const formatYear = (year: number) => {
    if (Number.isNaN(year)) return 'Unbekannt';
    if (year === 0) return '0';
    return year < 0 ? `${Math.abs(year)} v. Chr.` : `${year} n. Chr.`;
  };

  const filteredPosts = posts
    .filter((post) => post.author === currentAuthor)
    .filter((post) => {
      // Filter by content type
      if (contentFilter === 'diary') {
        return hasContent(post, 'diary');
      } else if (contentFilter === 'scientific') {
        return hasContent(post, 'scientific');
      }
      return true; // 'all' shows everything
    })
    .filter((post) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        (post.diaryTitle && post.diaryTitle.toLowerCase().includes(query)) ||
        (post.scientificTitle && post.scientificTitle.toLowerCase().includes(query)) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    })
    // Chronological order by historical year (oldest → newest)
    .sort((a, b) => {
      const ay = typeof a.historicalYear === 'number' ? a.historicalYear : new Date(a.date).getFullYear();
      const by = typeof b.historicalYear === 'number' ? b.historicalYear : new Date(b.date).getFullYear();
      return ay - by;
    });

  // Group posts by year for clearer chronological overview
  const groupedByYear = useMemo(() => {
    const groups: Record<number, BlogPost[]> = {};
    for (const post of filteredPosts) {
      const year = typeof post.historicalYear === 'number'
        ? post.historicalYear
        : (post.date ? new Date(post.date).getFullYear() : NaN);
      const key = year;
      if (!groups[key]) groups[key] = [];
      groups[key].push(post);
    }
    // Sort posts within each year by date if available
    Object.keys(groups).forEach((y) => {
      const yearKey = Number(y);
      groups[yearKey].sort((a, b) => {
        const ad = a.date ? new Date(a.date).getTime() : 0;
        const bd = b.date ? new Date(b.date).getTime() : 0;
        return ad - bd; // oldest → newest within year
      });
    });
    // Return entries sorted by year descending (newest first)
    return Object.entries(groups).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [filteredPosts]);

  // Count posts with content for each perspective
  const counts = useMemo(() => {
    if (!posts || posts.length === 0) {
      return { all: 0, diary: 0, scientific: 0 };
    }
    
    const authorPosts = posts.filter(p => p.author === currentAuthor);
    
    // Helper function (same as above)
    const hasContentMemo = (post: BlogPost, perspective: 'diary' | 'scientific') => {
      const content = post?.content?.[perspective];
      return content != null && typeof content === 'string' && content.trim().length > 0;
    };
    
    const diaryCount = authorPosts.filter(p => hasContentMemo(p, 'diary')).length;
    const scientificCount = authorPosts.filter(p => hasContentMemo(p, 'scientific')).length;
    
    return {
      all: authorPosts.length,
      diary: diaryCount,
      scientific: scientificCount,
    };
  }, [posts, currentAuthor]);

  return (
    <section className="px-4 sm:px-6">
      <div className="">
        {/* Section header */}
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-xs sm:text-sm font-medium text-primary uppercase tracking-wider">
            {contentFilter === 'diary' ? 'Tagebuch' : contentFilter === 'scientific' ? 'Wissenschaftlich' : 'Beiträge'}
          </span>
        </div>

        {/* Content Filter Buttons */}
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <BookOpen className="h-6 w-6 text-primary flex-shrink-0" />
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold">Einträge</h2>
              <p className="text-muted-foreground text-sm mt-1">{filteredPosts.length} Einträge von {authorInfo.name}</p>
            </div>
          </div>

          {/* Content Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setContentFilter('all')}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200',
                contentFilter === 'all'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <BookMarked className="h-4 w-4" />
              Alle <span className="hidden sm:inline">({counts.all})</span>
            </button>
            <button
              onClick={() => setContentFilter('diary')}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200',
                contentFilter === 'diary'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <BookOpen className="h-4 w-4" />
              📔 Tagebuch <span className="hidden sm:inline">({counts.diary})</span>
            </button>
            <button
              onClick={() => setContentFilter('scientific')}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200',
                contentFilter === 'scientific'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <GraduationCap className="h-4 w-4" />
              📚 Wissenschaftlich <span className="hidden sm:inline">({counts.scientific})</span>
            </button>
          </div>
        </div>

        {/* Search Filter */}
        <div className="mb-8">
          <SearchFilter 
            value={searchQuery} 
            onChange={setSearchQuery}
            placeholder="Beiträge durchsuchen..."
          />
        </div>

        {/* Posts grouped by year */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-12">
            {groupedByYear.map(([year, postsOfYear]) => (
              <section key={year} className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="space-y-1">
                    <p className="text-2xl font-display font-bold">{formatYear(Number(year))}</p>
                    <p className="text-xs text-muted-foreground">{postsOfYear.length} {postsOfYear.length === 1 ? 'Eintrag' : 'Einträge'}</p>
                  </div>
                  <div className="h-px flex-1 bg-border/50 ml-4" />
                </div>
                <motion.div
                  className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  variants={staggerContainer(0.07)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.05 }}
                >
                  {postsOfYear.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </motion.div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-lg border border-dashed border-border bg-secondary/20">
            <p className="text-muted-foreground">
              {contentFilter === 'diary' 
                ? 'Keine Tagebuch-Einträge von diesem Autor.'
                : contentFilter === 'scientific'
                ? 'Keine wissenschaftlichen Artikel von diesem Autor.'
                : 'Noch keine Einträge von diesem Autor.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
