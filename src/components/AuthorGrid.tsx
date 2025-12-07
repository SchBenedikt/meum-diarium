
import { authors } from '@/data/authors';
import { useAuthor } from '@/context/AuthorContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslatedAuthorInfo } from '@/lib/author-translator';
import { Card, CardContent } from '@/components/ui/card';

export function AuthorGrid() {
  const { setCurrentAuthor } = useAuthor();
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
            {t('voicesOfAntiquity')}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-5 tracking-tight">
            {t('chooseAnAuthor')}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
            {t('authorSelectionDesc')}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
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
                  className="block h-full group outline-none"
                >
                  <Card className="h-full overflow-hidden border-border/50 transition-all duration-300 group-hover:border-primary/30 group-hover:-translate-y-1">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={author.heroImage}
                        alt={translatedInfo.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-display text-xl font-medium mb-2 group-hover:text-primary transition-colors">
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
