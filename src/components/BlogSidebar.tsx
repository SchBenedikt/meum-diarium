import { BlogPost } from '@/types/blog';
import { authors } from '@/data/authors';
import { posts } from '@/data/posts';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Tags, ArrowRight, Quote } from 'lucide-react';
import { ShareButton } from './ShareButton';
import { useLanguage } from '@/context/LanguageContext';

interface BlogSidebarProps {
  post: BlogPost;
}

export function BlogSidebar({ post }: BlogSidebarProps) {
  const author = authors[post.author];
  const { t } = useLanguage();
  
  // Get related posts (same author, different post)
  const relatedPosts = posts
    .filter(p => p.author === post.author && p.id !== post.id)
    .slice(0, 3);

  return (
    <aside className="space-y-6">
      <div className="sidebar-card animate-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={author.heroImage} alt={author.name} className="h-12 w-12 rounded-xl object-cover" />
            <div>
              <p className="font-medium">{author.name}</p>
              <p className="text-sm text-muted-foreground">{author.title}</p>
            </div>
          </div>
          <ShareButton 
            title={post.title}
            text={`Schau mal, was ich gefunden habe: ${window.location.href}`}
            variant="compact"
          />
        </div>
      </div>

      <div className="sidebar-card animate-in stagger-2">
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
        <div className="sidebar-card animate-in stagger-3 gradient-bg">
          <Quote className="h-5 w-5 text-primary mb-3" />
          <blockquote className="font-display text-base italic mb-2">
            „{post.sidebar.quote.text}"
          </blockquote>
          <cite className="text-xs text-muted-foreground not-italic">
            — {post.sidebar.quote.source}
          </cite>
        </div>
      )}

      <div className="sidebar-card animate-in stagger-4">
        <h3 className="font-display text-lg font-medium mb-4 flex items-center gap-2">
          <Tags className="h-4 w-4 text-primary" />
          Themen
        </h3>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link 
              key={tag} 
              to={`/search?category=${encodeURIComponent(tag)}`}
              className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <div className="sidebar-card animate-in stagger-5">
          <h3 className="font-display text-lg font-medium mb-4">
            {t('otherWorks')}
          </h3>
          <div className="space-y-3">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                to={`/${relatedPost.author}/${relatedPost.slug}`}
                className="block group"
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
    </aside>
  );
}
