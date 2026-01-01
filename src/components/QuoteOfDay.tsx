
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
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-[1.25rem] bg-card border border-border/50 p-10 md:p-16 group overflow-hidden hover:border-primary/30 transition-all duration-700"
    >

      {/* Decorative Quote Mark */}
      <div className="absolute top-10 right-10 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
        <Quote className="h-40 w-40 text-primary rotate-12" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <span className="px-4 py-1.5 rounded-[1.25rem] bg-primary/10 border border-primary/25 text-[10px] font-semibold uppercase tracking-wider text-primary">
            {t('quoteOfTheDay') || 'Worte der Ewigkeit'}
          </span>
        </motion.div>

        <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.15] mb-8 text-foreground max-w-4xl tracking-tight">
          „{quote.text}"
        </blockquote>

        {quote.latinText && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl font-display text-muted-foreground/90 mb-10"
          >
            {quote.latinText}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="h-20 w-20 rounded-full p-1 bg-primary/20">
            <div className="h-full w-full rounded-full bg-card flex items-center justify-center overflow-hidden border-2 border-primary/30">
              <img
                src={authors[quote.author].heroImage}
                alt={authors[quote.author].name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="text-center">
            <span className="block font-display text-xl font-bold text-foreground mb-1">{authors[quote.author].name}</span>
            <span className="block text-primary font-medium text-xs uppercase tracking-widest opacity-80">{quote.source}</span>
          </div>
        </motion.div>
      </div>

      {/* Aesthetic frame */}
      <div className="absolute inset-0 border border-border/40 rounded-3xl pointer-events-none" />
    </motion.div>
  );
}
