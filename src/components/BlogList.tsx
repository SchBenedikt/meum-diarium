
import { useAuthor } from '@/context/AuthorContext';
import { posts } from '@/data/posts';
import { BlogCard } from './BlogCard';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07
    }
  }
};

export function BlogList() {
  const { currentAuthor, authorInfo } = useAuthor();

  if (!currentAuthor || !authorInfo) return null;

  const filteredPosts = posts.filter((post) => post.author === currentAuthor);

  return (
    <section className="py-20">
      <div className="container mx-auto">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                Diarium
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl mb-2">
              Commentarii Mei
            </h2>
            <p className="text-muted-foreground">
              {filteredPosts.length} inscriptiones a {authorInfo.name.split(' ').pop()}
            </p>
          </motion.div>
        </div>

        {/* Posts grid */}
        {filteredPosts.length > 0 ? (
          <motion.div 
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {filteredPosts.map((post) => (
              <BlogCard 
                key={post.id} 
                post={post}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground">
              Nullae adhuc inscriptiones huius auctoris.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
