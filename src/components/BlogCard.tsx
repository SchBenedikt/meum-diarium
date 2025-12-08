import { Link, useNavigate } from 'react-router-dom';
import { BlogPost } from '@/types/blog';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, generateExcerpt } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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
  const displayExcerpt =
    post.excerpt || generateExcerpt(post.content.diary || post.content.scientific, 150);

  return (
    <motion.article
      variants={cardVariants}
      className="h-full"
    >
      <Link
        to={`/${post.author}/${post.slug}`}
        className={cn(
          'group flex flex-col bg-card rounded-lg h-full overflow-hidden border border-border/60 hover:border-primary/40 active:border-primary/50 transition-all duration-300  hover: touch-manipulation',
          className
        )}
      >
        {/* Image – ohne weißen Overlay-Farbverlauf */}
        <div className="relative h-44 sm:h-48 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-4 sm:p-5 flex flex-col flex-grow gap-3 sm:gap-4">
          {/* Tags: horizontal scroll, Chips-Style */}
          {post.tags.length > 0 && (
            <div className="relative -mx-1">
              <div className="flex gap-2 overflow-x-auto no-scrollbar px-1">
                {post.tags.slice(0, 4).map((tag, i) => (
                  <button
                    key={i}
                    onClick={(e) => handleTagClick(e, tag)}
                    className="whitespace-nowrap px-2.5 sm:px-3 py-1 min-h-[32px] rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 active:bg-primary/30 transition-colors flex-shrink-0 touch-manipulation"
                    aria-label={`Filter nach ${tag}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title + excerpt */}
          <div className="flex-grow space-y-2">
            <h3 className="font-display text-base sm:text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>

            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
              {displayExcerpt}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="whitespace-nowrap">{post.historicalDate}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                {t('readingTime', { minutes: readingTime.toString() })}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
