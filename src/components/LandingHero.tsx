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
              Meum <span className="text-primary italic">Diarium</span>
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

      <FeatureShowcase />

      {/* Scientific Vision Section */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl sm:text-5xl font-sans mb-8 tracking-tighter leading-[1.1]">
                Die Verschmelzung von <span className="text-primary italic">Wissenschaft</span> & <span className="text-primary italic">Erzählung</span>
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground font-light leading-relaxed">
                <p>
                  Meum Diarium ist mehr als nur eine Sammlung von Geschichten. Es ist ein Experiment in digitaler Hermeneutik – der Versuch, die Distanz zwischen der modernen Welt und der antiken Ratio zu überbrücken.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
                  <div className="space-y-2">
                    <div className="text-primary font-bold flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Authentizität
                    </div>
                    <p className="text-sm">Jeder Eintrag basiert auf einer tiefgreifenden Analyse historischer Quellen und Briefe.</p>
                  </div>
                  <div className="space-y-2">
                    <div className="text-primary font-bold flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Perspektive
                    </div>
                    <p className="text-sm">Wir lassen die Großen der Geschichte selbst zu Wort kommen, anstatt nur über sie zu schreiben.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square lg:aspect-auto lg:h-[600px] rounded-[3rem] overflow-hidden border border-border/50 bg-card/30 backdrop-blur-xl shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <div className="relative w-full h-full flex flex-col justify-center gap-8">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <div className="flex justify-between items-center text-xs uppercase tracking-widest text-primary/60 font-medium">
                    <span>Historia</span>
                    <span>Ratio</span>
                    <span>Narratio</span>
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <div className="p-8 border border-primary/20 bg-primary/5 rounded-2xl italic text-center text-xl text-primary/80">
                    "Historia vero testis temporum, lux veritatis, vita memoriae, magistra vitae, nuntia vetustatis."
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Authors Section */}
      <section id="autoren" className="py-32 bg-background relative border-t border-border">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center text-center mb-20">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4 font-bold">Wegbereiter</p>
            <h2 className="text-4xl sm:text-6xl font-display font-extrabold mb-8 tracking-tighter">Wähle deine <span className="italic text-primary">Perspektive</span></h2>
            <p className="text-muted-foreground text-xl max-w-2xl font-light italic">
              "Entdecke die Antike durch die Augen derer, die sie geformt haben."
            </p>
          </div>
          <AuthorGrid />
        </div>
      </section>

      {/* Recent Insights Section */}
      {!isLoading && recentPosts.length > 0 && (
        <section className="py-32 bg-secondary/20 border-t border-border mt-16 overflow-hidden">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6">
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full relative"
            >
              <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-6">
                <div className="max-w-2xl">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary mb-4 font-bold">Aktuell</p>
                  <h2 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tighter mb-4">Neuste <span className="italic text-primary">Beiträge</span></h2>
                  <p className="text-muted-foreground text-lg font-light italic">"Wissen ist der einzige Schatz, der sich vermehrt, wenn man ihn teilt."</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 mr-4">
                    <CarouselPrevious className="relative left-0 translate-y-0 h-10 w-10 border-border/40 bg-background/50 hover:bg-background" />
                    <CarouselNext className="relative right-0 translate-y-0 h-10 w-10 border-border/40 bg-background/50 hover:bg-background" />
                  </div>
                  <Link to="/search">
                    <Button variant="ghost" className="text-primary hover:text-primary/80 group text-lg h-auto px-0 hover:bg-transparent">
                      Alle Beiträge <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              <CarouselContent className="-ml-6">
                {recentPosts.map((post) => (
                  <CarouselItem key={post.id} className="pl-6 basis-full md:basis-1/2">
                    <BlogCard post={post} className="bg-background/80 h-full" />
                  </CarouselItem>
                ))}
                {/* Last item: "See More" Card */}
                <CarouselItem className="pl-6 basis-full md:basis-1/2 lg:basis-1/3">
                  <Link to="/search" className="block h-full min-h-[160px]">
                    <motion.div
                      className="h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-border/40 rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group px-8"
                    >
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                        <ArrowRight className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-display text-xl font-bold mb-1 tracking-tight">Alle Entdecken</h3>
                      <p className="text-sm text-muted-foreground">Durchstöbere unser gesamtes Archiv</p>
                    </motion.div>
                  </Link>
                </CarouselItem>
              </CarouselContent>

              {/* Mobile Navigation */}
              <div className="flex sm:hidden items-center justify-center gap-6 mt-10">
                <CarouselPrevious className="relative left-0 translate-y-0 h-12 w-12 border-border/40 bg-background/50" />
                <CarouselNext className="relative right-0 translate-y-0 h-12 w-12 border-border/40 bg-background/50" />
              </div>
            </Carousel>
          </div>
        </section>
      )}
    </div>
  );
}
