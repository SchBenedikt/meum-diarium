
import { useAuthor } from '@/context/AuthorContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BlogList } from './BlogList';
import { fadeUp, scaleIn, defaultTransition, float } from '@/lib/motion';
import { ModernBackground } from './ui/ModernBackground';

export function HeroSection() {
  const { authorInfo, currentAuthor } = useAuthor();

  if (!authorInfo || !currentAuthor) return null;

  return (
    <section className="relative flex items-center overflow-hidden bg-background" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      {/* Dynamic Background */}
      <ModernBackground />

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background z-[1]" />

      <div className="container mx-auto relative pt-16 sm:pt-20 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6">
            <motion.div
              variants={fadeUp()}
              initial="hidden"
              animate="visible"
              transition={defaultTransition}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {authorInfo.title}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp(0.1)}
              initial="hidden"
              animate="visible"
              transition={defaultTransition}
              className="text-4xl sm:text-5xl lg:text-6xl font-display leading-[1.1]"
            >
              {authorInfo.name}
            </motion.h1>

            <motion.p
              variants={fadeUp(0.2)}
              initial="hidden"
              animate="visible"
              transition={defaultTransition}
              className="text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              {authorInfo.description}
            </motion.p>

            <motion.div
              variants={fadeUp(0.3)}
              initial="hidden"
              animate="visible"
              transition={defaultTransition}
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
            variants={scaleIn(0.2)}
            initial="hidden"
            animate="visible"
            transition={defaultTransition}
            className="relative hidden lg:block"
          >
            <motion.div
              variants={float}
              animate="animate"
              className="relative rounded-3xl aspect-[4/5] overflow-hidden border border-white/10 backdrop-blur-sm bg-white/5"
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={authorInfo.heroImage}
                  alt={authorInfo.name}
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-primary font-medium tracking-wider text-xs uppercase mb-2 opacity-80">{authorInfo.latinName}</p>
                <p className="text-foreground text-2xl font-display font-semibold">{authorInfo.years}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
