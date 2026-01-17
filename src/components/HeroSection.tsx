import { useAuthor } from '@/context/AuthorContext';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BlogList } from './BlogList';
import { ArrowRight, BookOpen, Calendar, MapPin, Quote, Scroll, Users } from 'lucide-react';
import { fadeUp, scaleIn, defaultTransition, float } from '@/lib/motion';
import { ModernBackground } from './ui/ModernBackground';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { useRef } from 'react';


export function HeroSection() {
  const { authorInfo, currentAuthor } = useAuthor();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);


  if (!authorInfo || !currentAuthor) return null;


  return (
    <section ref={heroRef} className="relative flex items-center overflow-hidden bg-background pt-12 sm:pt-20" style={{ minHeight: '60vh' }}>
      {/* Dynamic Background */}
      <ModernBackground />


      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 z-[1]" />


      <div className="container mx-auto max-w-7xl relative pt-16 sm:pt-20 z-10 px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 items-start" style={{ minHeight: 'calc(70vh - 8rem)' }}>
          {/* Text content - takes 7 columns */}
          <div className="lg:col-span-7 space-y-8 flex flex-col justify-center">
            <motion.div
              variants={fadeUp()}
              initial="hidden"
              animate="visible"
              transition={defaultTransition}
            >
              <Badge variant="secondary" className="mb-4">
                <Scroll className="w-3 h-3 mr-1.5" />
                {authorInfo.title}
              </Badge>
            </motion.div>


            <motion.h1
              style={{ y: textY }}
              variants={fadeUp(0.1)}
              initial="hidden"
              animate="visible"
              transition={defaultTransition}
              className="text-5xl sm:text-6xl lg:text-8xl font-display leading-[1] font-bold tracking-tight"
            >
              <span className="text-foreground italic">{authorInfo.name.split(' ')[0]}</span>
              <span className="text-primary block mt-2">{authorInfo.name.split(' ').slice(1).join(' ')}</span>
            </motion.h1>


            <motion.p
              variants={fadeUp(0.2)}
              initial="hidden"
              animate="visible"
              transition={defaultTransition}
              className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed"
            >
              {authorInfo.description}
            </motion.p>


            <motion.div
              variants={fadeUp(0.3)}
              initial="hidden"
              animate="visible"
              transition={defaultTransition}
              className="flex flex-wrap items-center gap-4 pt-6"
            >
              <Link to={`/${authorInfo.id}/about`}>
                <Button size="lg" className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 transition-all shadow-none group">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Biografie entdecken
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

            </motion.div>
          </div>


          {/* Hero Image & Info Cards - takes 5 columns */}
          <div className="lg:col-span-5 relative h-[50vh] lg:h-[60vh]">
            {/* Main Image */}
            <motion.div
              variants={scaleIn(0.2)}
              initial="hidden"
              animate="visible"
              transition={defaultTransition}
              className="relative h-full rounded-[1.5rem] overflow-hidden border border-border/40 bg-card"
            >
              <div className="w-full h-full relative overflow-hidden">
                <img
                  src={authorInfo.heroImage}
                  alt={authorInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}