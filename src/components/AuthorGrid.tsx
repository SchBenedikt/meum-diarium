
import { authors } from '@/data/authors';
import { useAuthor } from '@/context/AuthorContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedAuthorInfo } from '@/lib/author-translator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Star, Brain, Target, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AuthorGrid() {
  const { setCurrentAuthor } = useAuthor();
  const { t } = useLanguage();

  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        {/* Header - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{t('voicesOfAntiquity')}</span>
          </div>
          
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            {t('chooseAnAuthor')}
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            {t('authorSelectionDesc')}
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Badge variant="secondary" className="px-3 py-1.5">
              <Brain className="w-3 h-3 mr-1.5" />
              KI-basierte Dialoge
            </Badge>
            <Badge variant="secondary" className="px-3 py-1.5">
              <Target className="w-3 h-3 mr-1.5" />
              Historisch akkurat
            </Badge>
            <Badge variant="secondary" className="px-3 py-1.5">
              <Award className="w-3 h-3 mr-1.5" />
              Wissenschaftlich geprüft
            </Badge>
          </div>
        </motion.div>

        {/* Author Cards - Bento Style Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {Object.values(authors).map((author, index) => {
            const translatedInfo = getTranslatedAuthorInfo(author.id, t);
            const isCaesar = author.id === 'caesar';

            return (
              <motion.div
                key={author.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  isCaesar && "lg:col-span-2 lg:row-span-2", // Caesar gets bigger
                )}
              >
                <Link
                  to={`/${author.id}`}
                  onClick={() => setCurrentAuthor(author.id)}
                  className="block h-full group outline-none"
                >
                  <Card className={cn(
                    "h-full overflow-hidden border-2 transition-all duration-500 relative",
                    "bg-gradient-to-br from-background/95 via-background/80 to-background/95",
                    "hover:shadow-2xl hover:-translate-y-1",
                    "rounded-[1.5rem]",
                    isCaesar 
                      ? "border-primary/30 hover:border-primary/60 hover:shadow-primary/20" 
                      : "border-border/30 hover:border-primary/40 hover:shadow-primary/10"
                  )}>
                    {/* Image Container */}
                    <div className={cn(
                      "relative overflow-hidden",
                      isCaesar ? "h-96 lg:h-[500px]" : "h-72 sm:h-80"
                    )}>
                      <img
                        src={author.heroImage}
                        alt={translatedInfo.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className={cn(
                        "absolute inset-0 transition-opacity duration-500",
                        isCaesar 
                          ? "bg-gradient-to-t from-background via-background/60 to-transparent" 
                          : "bg-gradient-to-t from-background via-background/50 to-transparent"
                      )} />

                      {/* Featured Badge (for Caesar) */}
                      {isCaesar && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-primary/90 backdrop-blur-sm text-primary-foreground border-0 shadow-lg">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Empfohlen
                          </Badge>
                        </div>
                      )}

                      {/* Floating Action Badge */}
                      <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="bg-primary backdrop-blur-sm border-0 p-2.5 rounded-xl shadow-lg">
                          <ArrowRight className="w-5 h-5 text-primary-foreground" />
                        </div>
                      </div>

                      {/* Info Overlay - Always visible on Caesar */}
                      <div className={cn(
                        "absolute bottom-0 left-0 right-0 p-6 transition-all duration-500",
                        isCaesar 
                          ? "translate-y-0 opacity-100" 
                          : "translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                      )}>
                        <div className={cn(
                          "backdrop-blur-xl border rounded-xl p-4 transition-colors",
                          isCaesar 
                            ? "bg-card/98 border-border/50" 
                            : "bg-card/95 border-border/40"
                        )}>
                          <p className="text-[9px] font-bold text-primary tracking-[0.3em] uppercase mb-1">
                            {translatedInfo.latinName || translatedInfo.title}
                          </p>
                          <p className="font-display text-lg font-bold text-foreground mb-1">
                            {translatedInfo.years}
                          </p>
                          {isCaesar && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Diktator auf Lebenszeit • Eroberer Galliens
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className={cn(
                      "relative",
                      isCaesar ? "p-8" : "p-6"
                    )}>
                      <div className="mb-4">
                        <span className="text-[10px] font-bold text-primary tracking-widest uppercase mb-2 block">
                          {translatedInfo.title}
                        </span>
                        <h3 className={cn(
                          "font-display font-bold group-hover:text-primary transition-colors",
                          isCaesar ? "text-3xl mb-3" : "text-xl"
                        )}>
                          {translatedInfo.name}
                        </h3>
                      </div>
                      
                      <p className={cn(
                        "text-muted-foreground leading-relaxed",
                        isCaesar ? "text-base line-clamp-4 mb-6" : "text-sm line-clamp-3"
                      )}>
                        {translatedInfo.description}
                      </p>

                      {/* Highlights for Caesar */}
                      {isCaesar && author.highlights && (
                        <div className="mb-6 space-y-2">
                          {author.highlights.slice(0, 2).map((highlight, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              <span>{highlight.title}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CTA */}
                      <div className={cn(
                        "flex items-center text-sm font-semibold text-primary transition-opacity duration-500",
                        isCaesar ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      )}>
                        <span>Profil erkunden</span>
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-6">
            Mehr Autoren und Zeitperioden folgen in Kürze
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse delay-75" />
            <div className="w-2 h-2 rounded-full bg-primary/30 animate-pulse delay-150" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
