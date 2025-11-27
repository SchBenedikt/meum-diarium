import { Link } from 'react-router-dom';
import { BlogPost, Perspective } from '@/types/blog';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface BlogCardProps {
  post: BlogPost;
  perspective: Perspective;
  index?: number;
}

export function BlogCard({ post, perspective, index = 0 }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        to={`/post/${post.slug}`}
        className="group block card-elevated h-full !p-0 overflow-hidden"
      >
        <div className="relative h-48 overflow-hidden">
            <img 
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        </div>
        
        <div className="p-5">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {post.tags[0]}
              </span>
              {post.latinTitle && (
                <span className="text-xs text-muted-foreground italic">
                  {post.latinTitle}
                </span>
              )}
            </div>

            {/* Content */}
            <h3 className="font-display text-xl font-medium mb-3 group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            
            <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
              {post.excerpt}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.historicalDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingTime} Min.
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
        </div>
      </Link>
    </motion.article>
  );
}
