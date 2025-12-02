import { Link, useNavigate } from 'react-router-dom';
import { BlogPost } from '@/types/blog';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};


interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export function BlogCard({ post, className }: BlogCardProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/search?category=${encodeURIComponent(tag)}`);
  };

  const readingTime = post.readingTime;

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -5, transition: { duration: 0.2, ease: "easeInOut" } }}
      className="h-full"
    >
      <Link
        to={`/${post.author}/${post.slug}`}
        className={cn(
          "group flex flex-col bg-card rounded-2xl h-full p-0 overflow-hidden border border-border hover:border-primary/20 transition-shadow duration-300 shadow-sm hover:shadow-lg",
          className
        )}
      >
        <div className="relative h-48 overflow-hidden">
            <img 
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              {post.tags.map((tag, i) => (
                <button
                  key={i}
                  onClick={(e) => handleTagClick(e, tag)}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors z-10 relative"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-grow">
              <h3 className="font-display text-xl font-medium mb-3 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                {post.excerpt}
              </p>
            </div>


            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.historicalDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {t('readingTime', { minutes: readingTime.toString() })}
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
        </div>
      </Link>
    </motion.article>
  );
}
