
import { useMemo } from 'react';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { authors } from '@/data/authors';
import { Author } from '@/types/blog';
import { useLanguage } from '@/context/LanguageContext';

interface QuoteData {
  text: string;
  latinText?: string;
  author: Author;
  source: string;
}

const quotes: QuoteData[] = [
  { text: 'Der Würfel ist gefallen.', latinText: 'Alea iacta est.', author: 'caesar', source: 'Überschreitung des Rubikon, 49 v. Chr.' },
];

export function QuoteOfDay() {
  const { t } = useLanguage();
  const quote = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return quotes[dayOfYear % quotes.length];
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="relative rounded-lg bg-card border border-border/50 p-8 md:p-10"
    >
      {/* Decorative Quote Mark */}
      <div className="absolute top-6 left-8 opacity-10">
        <Quote className="h-16 w-16 text-primary" />
      </div>

      <div className="relative">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-6">
          {t('quoteOfTheDay')}
        </p>

        <blockquote className="font-display text-2xl sm:text-3xl leading-relaxed mb-4 text-foreground">
          „{quote.text}"
        </blockquote>

        {quote.latinText && (
          <p className="text-base italic text-muted-foreground mb-8">
            {quote.latinText}
          </p>
        )}

        <div className="flex items-center gap-3 text-sm">
          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-xs font-medium text-secondary-foreground">
              {authors[quote.author].name.charAt(0)}
            </span>
          </div>
          <div>
            <span className="font-medium text-foreground">{authors[quote.author].name}</span>
            <span className="block text-muted-foreground text-xs">{quote.source}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
