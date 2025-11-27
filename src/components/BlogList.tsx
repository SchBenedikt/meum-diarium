import { useState } from 'react';
import { useAuthor } from '@/context/AuthorContext';
import { posts } from '@/data/posts';
import { Perspective } from '@/types/blog';
import { BlogCard } from './BlogCard';
import { PerspectiveToggle } from './PerspectiveToggle';
import { BookOpen, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export function BlogList() {
  const { currentAuthor, authorInfo } = useAuthor();
  const [perspective, setPerspective] = useState<Perspective>('diary');

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
              {perspective === 'diary' ? (
                <BookOpen className="h-4 w-4 text-primary" />
              ) : (
                <GraduationCap className="h-4 w-4 text-primary" />
              )}
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                {perspective === 'diary' ? 'Tagebücher' : 'Wissenschaftlich'}
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl mb-2">
              {perspective === 'diary' ? 'Meine Aufzeichnungen' : 'Historische Analysen'}
            </h2>
            <p className="text-muted-foreground">
              {filteredPosts.length} Einträge von {authorInfo.name.split(' ').pop()}
            </p>
          </motion.div>
          <PerspectiveToggle value={perspective} onChange={setPerspective} />
        </div>

        {/* Posts grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <BlogCard 
                key={post.id} 
                post={post} 
                perspective={perspective}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground">
              Noch keine Einträge für diesen Autor.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
