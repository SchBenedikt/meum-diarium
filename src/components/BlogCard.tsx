import { Link, useNavigate } from 'react-router-dom';
import { BlogPost } from '@/types/blog';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, generateExcerpt } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { fadeUp, quickTransition } from '@/lib/motion';

const cardVariants = fadeUp(0.05, 20);

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
  const displayExcerpt =
    post.excerpt || generateExcerpt(post.content.diary || post.content.scientific, 150);

  return (
    <motion.article variants={cardVariants} transition={quickTransition} className="h-full">
      <Link
        to={`/${post.author}/${post.slug}`}
        className={cn(
          'group flex flex-col bg-card rounded-xl sm:rounded-2xl h-full overflow-hidden border border-border/60 hover:border-primary/40 active:border-primary/50 transition-all duration-300 hover:shadow-lg active:shadow-sm touch-manipulation',
          className
        )}
      >
        {/* Image */}
        <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-5 sm:p-6 flex flex-col flex-grow gap-3 sm:gap-4">
          {/* Tags: horizontal scroll, Chips-Style */}
          {post.tags.length > 0 && (
            <div className="relative -mx-1">
              <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 pb-1">
                {post.tags.slice(0, 4).map((tag, i) => (
                  <button
                    key={i}
                    onClick={(e) => handleTagClick(e, tag)}
                    className="whitespace-nowrap px-3 sm:px-3.5 py-1.5 min-h-[36px] rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium hover:bg-primary/20 active:bg-primary/30 transition-colors flex-shrink-0 touch-manipulation"
                    aria-label={`Filter nach ${tag}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title + excerpt */}
          <div className="flex-grow space-y-2.5">
            <h3 className="font-display text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
              {post.title}
            </h3>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-2 sm:line-clamp-3">
              {displayExcerpt}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{post.historicalDate}</span>
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                {t('readingTime', { minutes: readingTime.toString() })}
              </span>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
