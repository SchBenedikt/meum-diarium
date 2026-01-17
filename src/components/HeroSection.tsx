import { useAuthor } from '@/context/AuthorContext';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Scroll } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

export function HeroSection() {
  const { authorInfo, currentAuthor } = useAuthor();

  if (!authorInfo || !currentAuthor) return null;

  return (
    <section className="relative flex items-center overflow-hidden bg-background pt-20 pb-12 sm:pt-32">
      {/* Decorative background circle */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-8"
          >
            <div>
              <Badge variant="outline" className="mb-6 py-1 px-4 text-xs uppercase tracking-widest border-primary/20 text-primary bg-primary/5">
                <Scroll className="w-3.5 h-3.5 mr-2" />
                {authorInfo.title}
              </Badge>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold leading-[1.1] tracking-tighter mb-8">
                <span className="text-foreground block">{authorInfo.name.split(' ')[0]}</span>
                <span className="text-primary italic">{authorInfo.name.split(' ').slice(1).join(' ')}</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-xl leading-relaxed font-light">
                {authorInfo.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link to={`/${authorInfo.id}/about`}>
                <Button size="lg" className="rounded-full px-8 h-14 text-base bg-primary hover:scale-105 transition-transform duration-300 shadow-lg shadow-primary/20">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Biografie entdecken
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-border bg-card shadow-2xl glass-panel">
              <img
                src={authorInfo.heroImage}
                alt={authorInfo.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Decortive accent */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 border-l-2 border-b-2 border-primary/20 rounded-bl-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}