
import { authors } from '@/data/authors';
import { useAuthor } from '@/context/AuthorContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedAuthorInfo } from '@/lib/author-translator';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles } from 'lucide-react';

export function AuthorGrid() {
  const { setCurrentAuthor } = useAuthor();
  const { t } = useLanguage();

  return (
    <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="flex items-center justify-center gap-2 text-primary font-bold tracking-widest uppercase text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>{t('voicesOfAntiquity')}</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            {t('chooseAnAuthor')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            {t('authorSelectionDesc')}
          </p>
        </motion.div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {Object.values(authors).map((author, index) => {
            const translatedInfo = getTranslatedAuthorInfo(author.id, t);

            return (
              <motion.div
                key={author.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/${author.id}`}
                  onClick={() => setCurrentAuthor(author.id)}
                  className="block h-full group outline-none"
                >
                  <Card className="h-full overflow-hidden bg-card/40 backdrop-blur-2xl border border-border/40 transition-all duration-700 hover:border-primary/50 group-hover:-translate-y-2 rounded-2xl sm:rounded-3xl relative">
                    <div className="relative h-64 sm:h-72 overflow-hidden">
                      <img
                        src={author.heroImage}
                        alt={translatedInfo.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80" />

                      {/* Floating Badge */}
                      <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="bg-primary/20 backdrop-blur-md border border-primary/30 p-2 rounded-xl">
                          <ArrowRight className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6 relative">
                      <div className="mb-3">
                        <span className="text-[10px] font-bold text-primary tracking-widest uppercase mb-1.5 block">{translatedInfo.title}</span>
                        <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors italic">
                          {translatedInfo.name}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed font-light line-clamp-3">
                        {translatedInfo.description}
                      </p>

                      <div className="mt-5 flex items-center text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        Profil ansehen <ArrowRight className="ml-2 w-3.5 h-3.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
