import { authors } from '@/data/authors';
import { useAuthor } from '@/context/AuthorContext';
import { ArrowRight, Scroll, Clock, BookOpen, BookMarked } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QuoteOfDay } from './QuoteOfDay';
import { FeaturedPost } from './FeaturedPost';
import { ReadingStats } from './ReadingStats';

export function LandingHero() {
  const { setCurrentAuthor } = useAuthor();

  const authorColors: Record<string, string> = {
    caesar: 'bg-author-caesar',
    cicero: 'bg-author-cicero',
    augustus: 'bg-author-augustus',
    seneca: 'bg-author-seneca',
  };

  const authorTextColors: Record<string, string> = {
    caesar: 'text-author-caesar',
    cicero: 'text-author-cicero',
    augustus: 'text-author-augustus',
    seneca: 'text-author-seneca',
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center py-20 hero-gradient overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-20 right-10 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-8">
              <Scroll className="h-4 w-4" />
              <span>Tagebücher der Antike</span>
            </div>
            
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl mb-6 leading-[1.1]">
              Meum Diarium
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Erlebe die Geschichte durch die persönlichen Aufzeichnungen der größten 
              Persönlichkeiten Roms. Von Caesars Eroberungen bis zu Senecas Weisheiten.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/timeline" 
                className="btn-primary"
              >
                <Clock className="h-4 w-4" />
                Zeitstrahl erkunden
              </Link>
              <Link 
                to="/lexicon" 
                className="btn-secondary"
              >
                <BookMarked className="h-4 w-4" />
                Lexikon öffnen
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote of the Day */}
      <section className="py-12">
        <div className="container mx-auto max-w-3xl">
          <QuoteOfDay />
        </div>
      </section>

      {/* Featured Post */}
      <FeaturedPost />

      {/* Author Selection */}
      <section className="py-20">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl sm:text-4xl mb-4">
              Wähle einen Autor
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Jeder Autor bietet eine einzigartige Perspektive auf das antike Rom
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Object.values(authors).map((author, index) => (
              <motion.button
                key={author.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setCurrentAuthor(author.id)}
                className="group text-left relative overflow-hidden rounded-2xl bg-card border border-border hover:border-border/80 transition-all duration-300 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={author.heroImage}
                    alt={author.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  
                  {/* Color accent bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${authorColors[author.id]}`} />
                </div>

                {/* Content */}
                <div className="relative p-5 -mt-12">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${authorColors[author.id]} text-white`}>
                    {author.title}
                  </div>
                  
                  <h3 className="font-display text-xl font-medium mb-1">
                    {author.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {author.years}
                  </p>
                  <p className="text-sm text-muted-foreground/80 line-clamp-2 mb-4">
                    {author.description}
                  </p>
                  
                  <div className={`flex items-center gap-2 text-sm font-medium ${authorTextColors[author.id]}`}>
                    <span>Tagebücher entdecken</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Reading Stats */}
      <ReadingStats />
    </div>
  );
}
