import { BlogPost } from '@/types/blog';
import { authors } from '@/data/authors';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Tags, ArrowRight, Quote } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { usePosts } from '@/hooks/use-posts';

interface BlogSidebarProps {
  post: BlogPost;
}

export function BlogSidebar({ post }: BlogSidebarProps) {
  const author = authors[post.author];
  const { t, language } = useLanguage();
  const { posts } = usePosts();

  // Get related posts (same author, different post)
  const relatedPosts = posts
    .filter(p => p.author === post.author && p.id !== post.id)
    .slice(0, 3);

  // Get the appropriate translation for the current language
  const getQuoteTranslation = () => {
    if (!post.sidebar?.quote?.translations) return null;
    
    // Try to get translation for current language
    const currentLang = language.split('-')[0] as 'de' | 'en' | 'la';
    return post.sidebar.quote.translations[currentLang] || 
           post.sidebar.quote.translations.de || 
           post.sidebar.quote.translations.en ||
           null;
  };

  const quoteTranslation = getQuoteTranslation();

  return (
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.12, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-5 lg:space-y-6"
    >
      <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md p-5 lg:p-6 overflow-hidden relative group">
        <Link to={`/${author.id}/about`} className="group block transition-all -m-1 p-1 rounded-xl hover:bg-secondary/70 active:scale-[0.99]">
          <div className="flex items-center gap-3">
            <img src={author.heroImage} alt={author.name} className="h-12 w-12 rounded-lg object-cover ring-2 ring-border/60" />
            <div className="min-w-0">
              <p className="font-display text-lg font-bold truncate italic group-hover:text-primary transition-colors">{author.name}</p>
              <p className="text-sm text-muted-foreground truncate">{author.title}</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md p-5 lg:p-6">
        <h3 className="font-display text-lg font-medium mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Historischer Kontext
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Zeit</p>
              <p className="text-muted-foreground">{post.historicalDate}</p>
            </div>
          </div>
          <Link to={`/${author.id}/about`} className="flex items-start gap-3 group">
            <Users className="h-4 w-4 text-muted-foreground mt-0.5 group-hover:text-primary transition-colors" />
            <div>
              <p className="font-medium group-hover:text-primary transition-colors">Autor</p>
              <p className="text-muted-foreground">{author.name}</p>
              <p className="text-xs text-muted-foreground">{author.years}</p>
            </div>
          </Link>
        </div>
      </div>

      {post.sidebar?.quote && (
        <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md p-5 lg:p-6">
          <Quote className="h-5 w-5 text-primary mb-3" />
          <blockquote className="font-display text-base italic mb-3">
            „{post.sidebar.quote.text}“
          </blockquote>
          {quoteTranslation && (
            <p className="text-sm text-muted-foreground/90 mb-2 italic">
              {quoteTranslation}
            </p>
          )}
          <cite className="text-xs text-muted-foreground not-italic">
            — {post.sidebar.quote.author || post.sidebar.quote.source}
            {post.sidebar.quote.date ? `, ${post.sidebar.quote.date}` : ''}
          </cite>
        </div>
      )}

      <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md p-5 lg:p-6">
        <h3 className="font-display text-lg font-medium mb-4 flex items-center gap-2">
          <Tags className="h-4 w-4 text-primary" />
          Themen
        </h3>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              to={`/search?category=${encodeURIComponent(tag)}`}
              className="flex items-center justify-center px-3 py-1 h-7 min-w-[60px] rounded-full bg-primary/12 text-primary text-xs font-medium hover:bg-primary/20 active:bg-primary/25 transition-colors border border-primary/10"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md p-5 lg:p-6">
          <h3 className="font-display text-lg font-medium mb-4">
            {t('otherWorks')}
          </h3>
          <div className="space-y-3">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                to={`/${relatedPost.author}/${relatedPost.slug}`}
                className="block group rounded-lg -m-2 p-2 hover:bg-secondary/60 active:scale-[0.99] transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                      {relatedPost.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {relatedPost.historicalDate}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.aside>
  );
}
