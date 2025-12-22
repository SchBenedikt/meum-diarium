
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
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
          <motion.div
            variants={fadeUp()}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={defaultTransition}
          >
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary uppercase tracking-wider">
                {contentFilter === 'diary' ? 'Tagebuch' : contentFilter === 'scientific' ? 'Wissenschaftlich' : 'Alle Beiträge'}
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl mb-2 text-foreground">
              Meine <span className="text-primary italic">Kommentare</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-light">
              {filteredPosts.length} Einträge von <span className="italic">{authorInfo.name.split(' ').pop()}</span>
            </p>
          </motion.div>
        </div>

        {/* Content Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setContentFilter('all')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              contentFilter === 'all'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <BookMarked className="h-4 w-4" />
            Alle ({counts.all})
          </button>
          <button
            onClick={() => setContentFilter('diary')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              contentFilter === 'diary'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <BookOpen className="h-4 w-4" />
            📔 Tagebuch ({counts.diary})
          </button>
          <button
            onClick={() => setContentFilter('scientific')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
              contentFilter === 'scientific'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <GraduationCap className="h-4 w-4" />
            📚 Wissenschaftlich ({counts.scientific})
          </button>
        </div>

        {/* Search Filter */}
        <div className="mb-8">
          <SearchFilter 
            value={searchQuery} 
            onChange={setSearchQuery}
            placeholder="Beiträge durchsuchen..."
          />
        </div>

        {/* Posts grid */}
        {filteredPosts.length > 0 ? (
          <motion.div
            className="grid gap-5 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
          >
            {filteredPosts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 rounded-lg border border-dashed border-border">
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
