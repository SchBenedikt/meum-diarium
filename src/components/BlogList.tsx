import { useAuthor } from '@/context/AuthorContext';
import { usePosts } from '@/hooks/use-posts';
import { BlogCard } from './BlogCard';
import { BookOpen, GraduationCap, BookMarked } from 'lucide-react';
import { SearchFilter } from './SearchFilter';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { BlogPost } from '@/types/blog';
import { useLanguage } from '@/context/LanguageContext';
import { getPostTags } from '@/lib/tag-utils';

export function BlogList() {
  const { currentAuthor, authorInfo } = useAuthor();
  const { posts, isLoading } = usePosts();
  const [searchQuery, setSearchQuery] = useState('');

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // 'asc' = oldest first, 'desc' = newest first
  const { language } = useLanguage();
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
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    const base = posts
      .filter((post) => post.author === currentAuthor)
      .filter((post) => post.author === currentAuthor)
      .filter((post) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(query) ||
          (post.diaryTitle && post.diaryTitle.toLowerCase().includes(query)) ||
          (post.scientificTitle && post.scientificTitle.toLowerCase().includes(query)) ||
          post.excerpt.toLowerCase().includes(query) ||
          getPostTags(post, language).some(tag => tag.toLowerCase().includes(query))
        );
      });

    // Sort by historical year (default) and then by date within year.
    base.sort((a, b) => {
      const ay = typeof a.historicalYear === 'number' ? a.historicalYear : (a.date ? new Date(a.date).getFullYear() : 0);
      const by = typeof b.historicalYear === 'number' ? b.historicalYear : (b.date ? new Date(b.date).getFullYear() : 0);
      // ascending = oldest first
      return sortOrder === 'asc' ? ay - by : by - ay;
    });

    return base;
  }, [posts, currentAuthor, searchQuery, sortOrder]);
  // Group posts by year
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
    Object.keys(groups).forEach((y) => {
      const yearKey = Number(y);
      groups[yearKey].sort((a, b) => {
        const ad = a.date ? new Date(a.date).getTime() : 0;
        const bd = b.date ? new Date(b.date).getTime() : 0;
        return sortOrder === 'asc' ? ad - bd : bd - ad;
      });
    });
    // Sort years according to sortOrder
    return Object.entries(groups).sort((a, b) => {
      const na = Number(a[0]);
      const nb = Number(b[0]);
      return sortOrder === 'asc' ? na - nb : nb - na;
    });
  }, [filteredPosts]);
  // Count posts with content
  const counts = useMemo(() => {
    if (!posts || posts.length === 0) return { all: 0 };
    const authorPosts = posts.filter(p => p.author === currentAuthor);
    return { all: authorPosts.length };
  }, [posts, currentAuthor]);
  if (!currentAuthor || !authorInfo) return null;
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <section className="px-4 sm:px-6">
      <div className="">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Einträge</h2>
              <p className="text-muted-foreground text-sm mt-1">{filteredPosts.length} Einträge</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">Sortieren:</div>
              <button
                onClick={() => setSortOrder('asc')}
                className={cn('px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200', sortOrder === 'asc' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground')}
                aria-pressed={sortOrder === 'asc'}
                title="Älteste zuerst"
              >
                Älteste
              </button>
              <button
                onClick={() => setSortOrder('desc')}
                className={cn('px-3 py-2 rounded-full text-xs font-semibold transition-all duration-200', sortOrder === 'desc' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground')}
                aria-pressed={sortOrder === 'desc'}
                title="Neueste zuerst"
              >
                Neueste
              </button>
              <BookOpen className="h-6 w-6 text-primary/40 shrink-0" />
            </div>
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
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  {postsOfYear.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-lg border border-dashed border-border bg-secondary/20">
            <p className="text-muted-foreground">Noch keine Einträge von diesem Autor.</p>
          </div>
        )}
      </div>
    </section>
  );
}