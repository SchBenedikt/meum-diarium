import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, ArrowRight, Shield, Globe, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ParallaxHero() {
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll();
  
  // Enhanced parallax effects with stronger movement
  const yText = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacityImage = useTransform(scrollYProgress, [0, 0.6], [1, 0.2]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const yFloatingElements = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const blurImage = useTransform(scrollYProgress, [0, 0.5], [0, 8]);

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
          }}
        />
      </motion.div>

      {/* Floating Elements for enhanced parallax */}
      <motion.div
        style={{ y: yFloatingElements }}
        className="absolute inset-0 z-10 pointer-events-none"
      >
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: yText }}
        className="relative z-20 container mx-auto max-w-4xl px-4 sm:px-6 text-center"
      >
        {/* Top Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 cursor-pointer transition-all duration-200 px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            KI-Powered
            <ArrowRight className="h-4 w-4 ml-2" />
          </Badge>
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 cursor-pointer transition-all duration-200 px-4 py-2">
            <Shield className="h-4 w-4 mr-2" />
            Modern Lernen
            <ArrowRight className="h-4 w-4 ml-2" />
          </Badge>
        </motion.div>

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
          Deine Latein-Reise. Deine Ziele. Dein Erfolg.
        </motion.p>

        {/* Call-to-Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex justify-center"
        >
          <Link to="/caesar">
            <Button 
              size="lg" 
              className="rounded-full px-8 py-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-bricolage-grotesque"
            >
              Kostenlos starten
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>

        {/* Small Feature List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-8 justify-center items-center pt-8"
        >
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Shield className="h-4 w-4 text-green-400" />
            <span>Daten sind sicher</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Globe className="h-4 w-4 text-blue-400" />
            <span>Kostenlos & Open</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <Cpu className="h-4 w-4 text-purple-400" />
            <span>Offline verfügbar</span>
          </div>
        </motion.div>
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
