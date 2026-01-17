import { useAuthor } from '@/context/AuthorContext';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Scroll } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';


export function HeroSection() {
  const { authorInfo, currentAuthor } = useAuthor();

  if (!authorInfo || !currentAuthor) return null;


  return (
    <section className="relative flex items-center overflow-hidden bg-background pt-12 sm:pt-20" style={{ minHeight: '60vh' }}>
      <div className="container mx-auto max-w-7xl relative pt-16 sm:pt-20 px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 items-start" style={{ minHeight: 'calc(70vh - 8rem)' }}>
          {/* Text content - takes 7 columns */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                <Scroll className="w-3 h-3 mr-1.5" />
                {authorInfo.title}
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-sans leading-tight">
              <span className="text-foreground">{authorInfo.name.split(' ')[0]}</span>
              <span className="text-foreground block mt-2">{authorInfo.name.split(' ').slice(1).join(' ')}</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              {authorInfo.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link to={`/${authorInfo.id}/about`}>
                <Button size="lg" className="rounded-[var(--radius)] px-6 h-11 bg-primary text-primary-foreground">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Biografie entdecken
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image - takes 5 columns */}
          <div className="lg:col-span-5 relative h-[50vh] lg:h-[60vh]">
            <div className="relative h-full rounded-[var(--radius)] overflow-hidden border border-border bg-card">
              <div className="w-full h-full relative overflow-hidden">
                <img
                  src={authorInfo.heroImage}
                  alt={authorInfo.name}
                  className="w-full h-full object-cover rounded-[var(--radius)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}