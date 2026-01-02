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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              {t('voicesOfAntiquity')}
            </span>
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

        {/* Bento Grid */}
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {Object.values(authors).map((author, index) => {
            const translatedInfo = getTranslatedAuthorInfo(author.id, t);
            const isCaesar = author.id === 'caesar';

            return (
              <motion.div
                key={author.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={cn(
                  // Caesar: große Karte über 2x2 Spalten im Bento-Grid
                  isCaesar && 'sm:col-span-2 lg:col-span-2 lg:row-span-2'
                )}
              >
                <Link
                  to={`/${author.id}`}
                  onClick={() => setCurrentAuthor(author.id)}
                  className="block h-full group outline-none"
                >
                  <Card
                    className={cn(
                      'h-full overflow-hidden border transition-all duration-500 relative',
                      'bg-gradient-to-br from-background/95 via-background/90 to-background',
                      'hover:shadow-2xl hover:-translate-y-1.5',
                      'rounded-[1.5rem]',
                      isCaesar
                        ? 'border-primary/40 hover:border-primary/70 hover:shadow-primary/25'
                        : 'border-border/40 hover:border-primary/40 hover:shadow-primary/15'
                    )}
                  >
                    {/* Image */}
                    <div
                      className={cn(
                        'relative overflow-hidden',
                        isCaesar ? 'h-80 sm:h-96 lg:h-[420px]' : 'h-64 sm:h-72'
                      )}
                    >
                      <img
                        src={author.heroImage}
                        alt={translatedInfo.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Empfohlen-Badge (ohne Verlauf) */}
                      {isCaesar && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-primary/90 text-primary-foreground border-0 shadow-lg rounded-full px-3 py-1.5">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            Empfohlen
                          </Badge>
                        </div>
                      )}

                      {/* Floating Arrow */}
                      <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="bg-background/80 backdrop-blur-sm border border-border/40 p-2.5 rounded-xl shadow-lg">
                          <ArrowRight className="w-5 h-5 text-foreground" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent
                      className={cn(
                        'relative flex flex-col h-full',
                        isCaesar ? 'p-7 space-y-4' : 'p-6 space-y-3'
                      )}
                    >
                      <div>
                        <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase mb-2 block">
                          {translatedInfo.title}
                        </span>
                        <h3
                          className={cn(
                            'font-display font-bold transition-colors',
                            'group-hover:text-primary',
                            isCaesar ? 'text-2xl sm:text-3xl mb-2' : 'text-lg sm:text-xl'
                          )}
                        >
                          {translatedInfo.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {translatedInfo.years}
                        </p>
                      </div>

                      <p
                        className={cn(
                          'text-muted-foreground leading-relaxed',
                          isCaesar ? 'text-sm sm:text-base line-clamp-4' : 'text-sm line-clamp-3'
                        )}
                      >
                        {translatedInfo.description}
                      </p>

                      {/* Highlights nur für Caesar, aber kompakt */}
                      {isCaesar && author.highlights && (
                        <div className="space-y-1 pt-2">
                          {author.highlights.slice(0, 2).map((highlight, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-xs text-muted-foreground"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                              <span>{highlight.title}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CTA */}
                      <div className="mt-4 flex items-center text-sm font-semibold text-primary">
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
        </motion.div>
      </div>
    </section>
  );
}
