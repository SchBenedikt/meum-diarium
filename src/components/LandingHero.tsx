import type { ElementType } from 'react';
import { Sparkles, MessageCircle, BookOpen, Map, Library, ArrowRight, Users, Bookmark, ChevronRight } from 'lucide-react';
import { AuthorGrid } from './AuthorGrid';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { usePosts } from '@/hooks/use-posts';
import { BlogCard } from './BlogCard';
import { FeatureShowcase } from './home/FeatureShowcase';
import { HeroImageGallery } from './HeroImageGallery';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
type BentoCard = {
  title: string;
  description: string;
  icon: ElementType;
  to: string;
  cta?: string;
  className?: string;
  delay?: number;
};
// bentoCards removed in favor of FeatureShowcase component
export default function LandingHero() {
  const { t } = useLanguage();
  const { posts, isLoading } = usePosts();
  const recentPosts = posts
    ? [...posts]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6)
    : [];
  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Visual Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-48 sm:pb-32 overflow-hidden">
        <div className="container relative mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-8 py-1.5 px-4 text-xs uppercase tracking-[0.2em] bg-background/50 backdrop-blur-sm border-primary/20 text-primary">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              {t('landing.hero.aiPowered') || 'ERLEBE GESCHICHTE NEU'}
            </Badge>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl mb-8 text-foreground leading-[1.1] tracking-tighter font-extrabold">
              <span className="text-primary">Meum Diarium</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mb-12 leading-relaxed font-light">
              {t('landing.hero.voicesOfAntiquity') || 'Tauche ein in die Gedankenwelt der größten Persönlichkeiten der Antike.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/caesar">
                <Button size="lg" className="rounded-full px-8 h-14 text-base bg-primary transition-transform duration-300">
                  {t('landing.hero.discoverNow') || 'Jetzt entdecken'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/lexicon">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base border-border bg-background/50 backdrop-blur-sm">
                  <Library className="mr-2 h-5 w-5" />
                  {t('landing.hero.lexicon') || 'Lexikon'}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Hero Image Gallery */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-6 py-2 px-4 text-xs uppercase tracking-[0.2em] bg-background/50 backdrop-blur-sm border-primary/20 text-primary">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Entdecke die Persönlichkeiten
            </Badge>
            <h2 className="font-display text-4xl sm:text-6xl font-bold mb-6 tracking-tight">
              Die <span className="italic text-primary">Größten</span> der Antike
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Klicke dich durch die Bilder und entdecke die berühmtesten Persönlichkeiten der römischen Geschichte.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <HeroImageGallery />
          </motion.div>
        </div>
      </section>
      
      <FeatureShowcase />
      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-b from-background to-secondary/20 border-y border-border">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">92+</div>
              <div className="text-sm text-muted-foreground">{t('landing.stats.lexiconEntries') || 'Lexikon-Einträge'}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">5</div>
              <div className="text-sm text-muted-foreground">{t('landing.stats.authors') || 'Historische Autoren'}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">3</div>
              <div className="text-sm text-muted-foreground">{t('landing.stats.languages') || 'Sprachen'}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">170+</div>
              <div className="text-sm text-muted-foreground">{t('landing.stats.yearsHistory') || 'Jahre Geschichte'}</div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Authors Section */}
      <section id="autoren" className="pt-16 pb-0 bg-background relative border-t border-border">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <AuthorGrid />
        </div>
      </section>
      {/* Recent Insights Section */}
      {!isLoading && recentPosts.length > 0 && (
        <section className="pt-32 pb-16 bg-secondary/20 border-t border-border overflow-hidden">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4 font-bold">Aktuell</p>
                <h2 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tighter mb-4">Neuste <span className="italic text-primary">Beiträge</span></h2>
                <p className="text-muted-foreground text-lg font-light italic">"Wissen ist der einzige Schatz, der sich vermehrt, wenn man ihn teilt."</p>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/search">
                  <Button variant="ghost" className="text-primary hover:text-primary/80 group text-lg h-auto px-0 hover:bg-transparent">
                    Alle Beiträge <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {recentPosts.map((post) => (
                <BlogCard key={post.slug} post={post} className="bg-background/80 h-full" />
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link to="/search" className="group">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative flex items-center gap-6 px-10 py-6 bg-card/40 backdrop-blur-xl border border-border/40 rounded-[2.5rem] premium-glow overflow-hidden transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:rotate-6 transition-all duration-500">
                    <Library className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-display text-2xl font-bold tracking-tight mb-0.5">
                      Alle Beiträge entdecken
                    </h3>
                    <p className="text-sm text-muted-foreground font-light">
                      Durchstöbere unser gesamtes Archiv
                    </p>
                  </div>
                  <div className="ml-4 h-10 w-10 rounded-full border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </motion.div>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
