
import { authors } from '@/data/authors';
import { useAuthor } from '@/context/AuthorContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedAuthorInfo } from '@/lib/author-translator';
import { Card, CardContent } from '@/components/ui/card';
import { ModernBackground } from './ui/ModernBackground';

export function AuthorGrid() {
  const { setCurrentAuthor } = useAuthor();
  const { t } = useLanguage();

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-background relative overflow-hidden">
      <ModernBackground />
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block px-3 sm:px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            {t('voicesOfAntiquity')}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-5 tracking-tight px-4">
            {t('chooseAnAuthor')}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg leading-relaxed px-4">
            {t('authorSelectionDesc')}
          </p>
        </motion.div>

        <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {Object.values(authors).map((author, index) => {
            const translatedInfo = getTranslatedAuthorInfo(author.id, t);

            return (
              <motion.div
                key={author.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
              >
                <Link
                  to={`/${author.id}`}
                  onClick={() => setCurrentAuthor(author.id)}
                  className="block h-full group outline-none touch-manipulation"
                >
                  <Card className="h-full overflow-hidden bg-surface-container-low/30 backdrop-blur-md border border-white/5 transition-all duration-500 group-hover:border-primary/40 group-hover:-translate-y-2 group-hover:scale-[1.01] relative">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                    <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
                      <img
                        src={author.heroImage}
                        alt={translatedInfo.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
                    </div>
                    <CardContent className="p-5 sm:p-6 relative">
                      <h3 className="font-display text-lg sm:text-xl font-medium mb-2 group-hover:text-primary transition-colors">
                        {translatedInfo.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {translatedInfo.title}
                      </p>
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
