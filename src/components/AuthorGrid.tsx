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
    <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
      {/* Subtle decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.01)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20 dark:bg-[linear-gradient(rgba(255,255,255,.01)_1px,transparent_1px)]" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 sm:mb-20"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold mb-4">{t('voicesOfAntiquity')}</p>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            {t('chooseAnAuthor')}
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('authorSelectionDesc')}
          </p>
        </motion.div>

        {/* Standard Premium Grid */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
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
                className="h-full"
              >
                <Link
                  to={`/${author.id}`}
                  onClick={() => setCurrentAuthor(author.id)}
                  className="block h-full group outline-none"
                >
                  <Card
                    className={cn(
                      'h-full overflow-hidden border border-border/40 transition-all duration-500 bg-card/50 backdrop-blur-sm shadow-none rounded-[2rem] premium-glow'
                    )}
                  >
                    {/* Image Section */}
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={author.heroImage}
                        alt={translatedInfo.name}
                        className="w-full h-full object-cover transition-transform duration-1000"
                      />

                      {/* Premium Accent Corner */}
                      {isCaesar && (
                        <div className="absolute top-6 left-6">
                          <Badge className="bg-primary text-primary-foreground border-0 shadow-none rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest">
                            {t('landing.authorGrid.recommended')}
                          </Badge>
                        </div>
                      )}

                      {/* Floating Arrow removed */}
                    </div>

                    {/* Content Section */}
                    <CardContent className="p-8 space-y-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase block">
                          {translatedInfo.title}
                        </span>
                        <h3 className="font-display text-2xl font-bold text-foreground transition-colors">
                          {translatedInfo.name}
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium">
                          {translatedInfo.years}
                        </p>
                      </div>

                      <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-3">
                        {translatedInfo.description}
                      </p>

                      <div className="pt-2 flex items-center text-xs font-bold text-primary uppercase tracking-widest transition-all">
                        <span>{t('landing.authorGrid.exploreProfile')}</span>
                        <ArrowRight className="ml-1 w-3.5 h-3.5" />
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
