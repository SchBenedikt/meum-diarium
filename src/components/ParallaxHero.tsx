import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, ArrowRight, Shield, Globe, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ParallaxHero() {
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll();
  
  // Subtle parallax effects for scroll-based animation
  const yText = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacityImage = useTransform(scrollYProgress, [0, 0.4], [1, 0.3]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const yFloatingElements = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const blurImage = useTransform(scrollYProgress, [0, 0.3], [0, 6]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div
        style={{
          y: yImage,
          opacity: opacityImage,
          scale: scaleImage,
        }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60 z-10" />
        <motion.img
          src="/image.png"
          alt="Antike römische Landschaft"
          className="w-full h-full object-cover"
          style={{
            filter: `blur(${blurImage.get()}px)`,
            objectPosition: 'top center',
          }}
        />
      </motion.div>

      
      {/* Content */}
      <motion.div
        style={{ y: yText }}
        className="relative z-20 container mx-auto max-w-4xl px-4 sm:px-6 text-center"
      >
        
        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-bricolage-grotesque text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight drop-shadow-lg"
        >
          Meum Diarium
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto font-light font-bricolage-grotesque mb-8 drop-shadow-md"
        >
          Tagebücher antiker Persönlichkeiten
        </motion.p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ scaleY: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
