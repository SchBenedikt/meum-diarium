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
    <section ref={heroRef} className="relative flex items-center overflow-hidden bg-background" style={{ minHeight: 'calc(100vh - 4rem)' }}>
      {/* Dynamic Background */}
      <ModernBackground />


      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background z-[1]" />


      <div className="container mx-auto max-w-7xl relative pt-16 sm:pt-20 z-10 px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 items-start" style={{ minHeight: 'calc(100vh - 8rem)' }}>
          {/* Text content - takes 5 columns */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-center">
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
              className="text-4xl sm:text-5xl lg:text-7xl font-display leading-[1.05] font-bold tracking-tighter"
            >
              <span className="text-foreground">{authorInfo.name.split(' ')[0]}</span>
              <span className="text-primary block">{authorInfo.name.split(' ').slice(1).join(' ')}</span>
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
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <Link to={`/${authorInfo.id}/about`}>
                <Button size="lg" className="gap-2 group">
                  <BookOpen className="w-4 h-4" />
                  Biografie entdecken 
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-border/50 bg-card/50">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <span className="text-xs text-muted-foreground block">Lebenszeit</span>
                  <span className="text-sm text-foreground font-display font-semibold">
                    {authorInfo.years}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>


          {/* Hero Image & Info Cards - takes 7 columns */}
          <div className="lg:col-span-7 relative h-[70vh] lg:h-[85vh]">
            {/* Main Image */}
            <motion.div
              style={{ y: imageY }}
              variants={scaleIn(0.2)}
              initial="hidden"
              animate="visible"
              transition={defaultTransition}
              className="relative h-full rounded-[1.5rem] overflow-hidden border border-border/40 bg-card group"
            >
              <div className="w-full h-full relative overflow-hidden">
                <img
                  src={authorInfo.heroImage}
                  alt={authorInfo.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              </div>
              
              {/* Floating Name Card */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.7 }}
                className="absolute bottom-8 left-8 right-8"
              >
                <div className="p-6 rounded-[1.25rem] bg-card/95 backdrop-blur-xl border border-border/30">
                  <p className="text-primary font-bold tracking-[0.3em] text-[9px] uppercase mb-2">{authorInfo.latinName}</p>
                  <p className="text-foreground text-3xl font-display font-bold mb-1">{authorInfo.name.split(' ').pop()}</p>
                  <Separator className="my-3" />
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>Römischer Staatsmann</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>Rom</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating Info Cards - Bento Style */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.7 }}
              className="absolute -left-4 top-1/4 hidden xl:block"
            >
              <div className="w-48 p-4 rounded-[1.25rem] bg-card/95 backdrop-blur-xl border border-border/30 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Quote className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-semibold">Berühmtes Zitat</span>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  "Veni, vidi, vici"
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.7 }}
              className="absolute -right-4 bottom-1/3 hidden xl:block"
            >
              <div className="w-52 p-4 rounded-[1.25rem] bg-card/95 backdrop-blur-xl border border-border/30 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-semibold">Werke</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    <span className="text-xs text-muted-foreground">De Bello Gallico</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    <span className="text-xs text-muted-foreground">De Bello Civili</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}