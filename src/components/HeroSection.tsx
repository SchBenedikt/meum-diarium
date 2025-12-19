
import { useAuthor } from '@/context/AuthorContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BlogList } from './BlogList';
import { ArrowRight } from 'lucide-react';
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
          <div className="space-y-8">
            <motion.div
              variants={fadeUp()}
              initial="hidden"
              animate="visible"
              transition={defaultTransition}
            >
              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-bold uppercase tracking-[0.2em] border border-primary/20 backdrop-blur-md">
                {authorInfo.title}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp(0.1)}
              initial="hidden"
              animate="visible"
              transition={defaultTransition}
              className="text-4xl sm:text-5xl lg:text-7xl font-display leading-[1] font-bold tracking-tighter"
            >
              <span className="text-foreground">{authorInfo.name.split(' ')[0]}</span>
              <span className="text-primary block italic">{authorInfo.name.split(' ').slice(1).join(' ')}</span>
            </motion.h1>

            <motion.p
              variants={fadeUp(0.2)}
              initial="hidden"
              animate="visible"
              transition={defaultTransition}
              className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed font-light"
            >
              {authorInfo.description}
            </motion.p>

            <motion.div
              variants={fadeUp(0.3)}
              initial="hidden"
              animate="visible"
              transition={defaultTransition}
              className="flex flex-wrap items-center gap-6 pt-4"
            >
              <Link to={`/${authorInfo.id}/about`} className="px-8 py-4 rounded-3xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all duration-500 hover:scale-105 active:scale-95 flex items-center gap-2 group">
                Biografie entdecken <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Lebenszeit</span>
                <span className="text-lg text-foreground font-display font-medium">
                  {authorInfo.years}
                </span>
              </div>
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
              className="relative rounded-3xl overflow-hidden border border-border/40 backdrop-blur-xl bg-card/30 group"
            >
              <div className="aspect-[4/5] relative overflow-hidden">
                <img
                  src={authorInfo.heroImage}
                  alt={authorInfo.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              </div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="p-5 rounded-2xl bg-card/60 backdrop-blur-xl border border-white/10 translate-y-2 group-hover:translate-y-0 transition-transform duration-700">
                  <p className="text-primary font-bold tracking-[0.3em] text-[9px] uppercase mb-1">{authorInfo.latinName}</p>
                  <p className="text-foreground text-2xl font-display font-bold">{authorInfo.name.split(' ').pop()}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
