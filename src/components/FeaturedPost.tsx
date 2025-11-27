import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { posts } from '@/data/posts';
import { authors } from '@/data/authors';
import { useMemo } from 'react';

const authorColorClasses: Record<string, string> = {
  caesar: 'bg-author-caesar',
  cicero: 'bg-author-cicero',
  augustus: 'bg-author-augustus',
  seneca: 'bg-author-seneca',
};

export function FeaturedPost() {
  // Get a "featured" post - for now, rotate based on date
  const featuredPost = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return posts[dayOfYear % posts.length];
  }, []);

  const author = authors[featuredPost.author];

  return (
    <section className="py-16">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card to-secondary/30 border border-border"
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-64 md:h-auto">
              <img 
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card md:bg-gradient-to-r md:from-transparent md:to-card" />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent md:hidden" />
              
              {/* Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm text-sm font-medium">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Empfohlen</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-10 w-10 rounded-xl ${authorColorClasses[featuredPost.author]} flex items-center justify-center`}>
                  <span className="text-white font-bold">{author.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-sm">{author.name}</p>
                  <p className="text-xs text-muted-foreground">{author.title}</p>
                </div>
              </div>

              {featuredPost.latinTitle && (
                <p className="text-sm italic text-muted-foreground mb-2">
                  {featuredPost.latinTitle}
                </p>
              )}

              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3">
                {featuredPost.title}
              </h2>

              <p className="text-muted-foreground mb-6 line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {featuredPost.historicalDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {featuredPost.readingTime} Min. Lesezeit
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {featuredPost.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-3 py-1 rounded-full bg-secondary text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link 
                to={`/post/${featuredPost.slug}`}
                className="btn-primary w-fit"
              >
                Jetzt lesen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
