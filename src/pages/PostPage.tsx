import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PerspectiveToggle } from '@/components/PerspectiveToggle';
import { BlogSidebar } from '@/components/BlogSidebar';
import { posts } from '@/data/posts';
import { authors } from '@/data/authors';
import { Perspective } from '@/types/blog';
import { useAuthor } from '@/context/AuthorContext';
import { ArrowLeft, Clock, Calendar, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setCurrentAuthor } = useAuthor();

  const perspectiveParam = searchParams.get('perspective') as Perspective | null;
  const [perspective, setPerspective] = useState<Perspective>(perspectiveParam || 'diary');

  const post = posts.find((p) => p.slug === slug);
  const author = post ? authors[post.author] : null;

  useEffect(() => {
    if (post) {
      setCurrentAuthor(post.author);
    }
  }, [post, setCurrentAuthor]);

  useEffect(() => {
    setSearchParams({ perspective });
  }, [perspective, setSearchParams]);

  if (!post || !author) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center">
            <h1 className="font-display text-4xl mb-4">Nicht gefunden</h1>
            <p className="text-muted-foreground mb-8">Dieser Eintrag existiert nicht.</p>
            <Link to="/">
              <Button>Zurück zur Startseite</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const content = perspective === 'diary' ? post.content.diary : post.content.scientific;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto">
          {/* Back link */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zum Diarium
          </Link>

          <div className="grid lg:grid-cols-[1fr_320px] gap-12">
            {/* Main Content */}
            <article>
              {/* Header */}
              <header className="mb-12">
                <div className="flex items-center gap-3 mb-6 animate-in">
                  <div 
                    className="h-12 w-12 rounded-xl flex items-center justify-center text-primary-foreground font-semibold shadow-lg bg-primary"
                  >
                    {author.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{author.name}</p>
                    <p className="text-sm text-muted-foreground">{author.title}</p>
                  </div>
                </div>

                {post.latinTitle && (
                  <p className="font-display italic text-lg mb-3 text-primary animate-in stagger-1">
                    „{post.latinTitle}"
                  </p>
                )}

                <h1 className="font-display text-3xl md:text-4xl lg:text-5xl mb-6 animate-in stagger-2">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 animate-in stagger-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{post.historicalDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.readingTime} Min. Lesezeit</span>
                  </div>
                </div>

                <div className="animate-in stagger-4">
                  <PerspectiveToggle value={perspective} onChange={setPerspective} />
                </div>
              </header>

              {/* Content */}
              <div className="animate-in stagger-5">
                <div 
                  className="prose-blog"
                  dangerouslySetInnerHTML={{ __html: formatContent(content) }}
                />
              </div>

              {/* Share section */}
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Gefällt dir dieser Eintrag? Teile ihn!
                  </p>
                  <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                    <Share2 className="h-4 w-4" />
                    Teilen
                  </Button>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-28">
                <BlogSidebar post={post} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function formatContent(content: string): string {
  let html = content
    .replace(/^### (.+)$/gm, `<h3>$1</h3>`)
    .replace(/^## (.+)$/gm, `<h2>$1</h2>`)
    .replace(/\*\*(.+?)\*\*/g, `<strong>$1</strong>`)
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^> (.+)$/gm, `<blockquote>$1</blockquote>`);

  html = `<p>${html}</p>`;

  return html;
}
