import { Link, useNavigate } from 'react-router-dom';
import { BlogPost } from '@/types/blog';
import { Calendar, Clock, ArrowRight } from 'lucide-react'; // Tag entfernt
import { motion } from 'framer-motion';
import { cn, generateExcerpt } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { getPostTags } from '@/lib/tag-utils';
import { fadeUp, quickTransition } from '@/lib/motion';

const cardVariants = fadeUp(0.05, 20);

interface BlogCardProps {
  post: BlogPost;
  className?: string;
  preferredPerspective?: 'diary' | 'scientific';
}

export function BlogCard({ post, className, preferredPerspective }: BlogCardProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/search?category=${encodeURIComponent(tag)}`);
  };

  const readingTime = post.readingTime;
  const displayExcerpt =
    post.excerpt || generateExcerpt(post.content?.diary || post.content?.scientific || '', 150);

  const hasDiary = post.content?.diary && post.content.diary.trim().length > 0;
  const hasScientific = post.content?.scientific && post.content.scientific.trim().length > 0;

  let displayTitle = post.title;
  if (hasDiary && !hasScientific && post.diaryTitle) {
    displayTitle = post.diaryTitle;
  } else if (hasScientific && !hasDiary && post.scientificTitle) {
    displayTitle = post.scientificTitle;
  } else if (hasDiary && hasScientific) {
    displayTitle = post.diaryTitle || post.scientificTitle || post.title;
  }

  const year =
    post.historicalDate?.match(/\d{4}/)?.[0] ??
    new Date(post.date || Date.now()).getFullYear().toString();

  return (
    <motion.article variants={cardVariants} transition={quickTransition} className="h-full">
      <Link
        to={`/${post.author}/${post.slug}${preferredPerspective ? `?p=${preferredPerspective}` : ''}`}
        className={cn(
          'group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-card transition-all duration-300 hover:border-primary/20 hover:bg-muted/10 touch-manipulation md:flex-row',
          className
        )}
      >
        {/* Bild links – flexibler, aber mit Mindestbreite */}
        <div className="relative h-40 w-full shrink-0 md:h-auto md:w-48 lg:w-56">
          <img
            src={post.coverImage}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Content rechts – flexibler, passt sich an */}
        <div className="flex flex-1 flex-col justify-between px-5 py-4 sm:px-6 sm:py-5 gap-3">
          {/* Datum / Jahr oben */}
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/80">
            {post.historicalDate}
          </div>

          {/* Titel + Excerpt */}
          <div className="space-y-2">
            <h3 className="font-display text-base sm:text-lg md:text-xl font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {displayTitle}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-3">
              {displayExcerpt}
            </p>
          </div>

          {/* Footer: Jahr, Lesezeit, Kategorien/Tags */}
          <div className="mt-3 flex flex-col gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
              {/* Jahr */}
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">{year}</span>
              </span>

              {/* Lesezeit */}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{t('readingTime', { minutes: (readingTime || 5).toString() })}</span>
              </span>
            </div>

            {/* Tag‑Chips darunter als Kategorien/Stichwörter */}
            {((post.tagsWithTranslations && post.tagsWithTranslations.length > 0) || (post.tags && post.tags.length > 0)) && (
              <div className="flex flex-wrap gap-2">
                {getPostTags(post, language).slice(0, 4).map((tag, i) => (
                  <button
                    key={i}
                    onClick={(e) => handleTagClick(e, tag)}
                    className="relative whitespace-nowrap px-2.5 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] sm:text-xs font-semibold transition-all hover:bg-primary/10 hover:border-primary/20 flex-shrink-0 touch-manipulation"
                    aria-label={`Filter nach ${tag}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pfeil rechts unten */}
          <div className="mt-1 flex justify-end">
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
