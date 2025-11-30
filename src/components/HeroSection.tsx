
import { useAuthor } from '@/context/AuthorContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function HeroSection() {
  const { authorInfo, currentAuthor } = useAuthor();

  if (!authorInfo || !currentAuthor) return null;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient" />

      <div className="container mx-auto relative pt-16 sm:pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {authorInfo.title}
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display leading-[1.1]"
            >
              {authorInfo.name}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              {authorInfo.description}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-4 pt-2"
            >
              <Link to={`/${authorInfo.id}/about`} className="btn-primary">
                Mehr erfahren
              </Link>
              <span className="text-sm text-muted-foreground font-medium">
                {authorInfo.years}
              </span>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5]">
              <img 
                src={authorInfo.heroImage}
                alt={authorInfo.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-foreground/70 text-sm mb-1 font-medium">{authorInfo.latinName}</p>
                <p className="text-foreground text-lg font-display">{authorInfo.years}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
