
import { useAuthor } from '@/context/AuthorContext';
import { usePosts } from '@/hooks/use-posts';
import { BlogCard } from './BlogCard';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, defaultTransition } from '@/lib/motion';

export function BlogList() {
  const { currentAuthor, authorInfo } = useAuthor();
  const { posts, isLoading } = usePosts();

  if (!currentAuthor || !authorInfo) return null;
  if (isLoading) {
    // Optional: Add a loading skeleton here
    return <div>Loading...</div>;
  }

  const filteredPosts = posts.filter((post) => post.author === currentAuthor);

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
                Tagebuch
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
              Noch keine Einträge von diesem Autor.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
