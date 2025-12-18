import { useAuthor } from '@/context/AuthorContext';
import { useLanguage } from '@/context/LanguageContext';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const quotes: Record<string, { latin: string; de: string; en: string; la: string }> = {
  caesar: {
    latin: "Veni, vidi, vici.",
    de: "Ich kam, sah und siegte.",
    en: "I came, I saw, I conquered.",
    la: "Veni, vidi, vici."
  },
  cicero: {
    latin: "Dum spiro, spero.",
    de: "Solange ich atme, hoffe ich.",
    en: "While I breathe, I hope.",
    la: "Dum spiro, spero."
  },
  augustus: {
    latin: "Festina lente.",
    de: "Eile mit Weile.",
    en: "Make haste slowly.",
    la: "Festina lente."
  },
  seneca: {
    latin: "Non est vivere sed valere vita est.",
    de: "Leben heißt nicht nur zu atmen, sondern zu handeln.",
    en: "Life is not merely being alive, but being well.",
    la: "Non est vivere sed valere vita est."
  },
};

export function AuthorIntro() {
  const { authorInfo, currentAuthor } = useAuthor();
  const { language } = useLanguage();

  if (!currentAuthor || !authorInfo) return null;

  const quote = quotes[currentAuthor];
  const baseLang = language.split('-')[0] as 'de' | 'en' | 'la';
  const translation = quote[baseLang] || quote.de;

  return (
    <section className="py-16 border-t border-border/40">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card/40 backdrop-blur-md p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-border/40 group overflow-hidden relative"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl transition-colors" />
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-6">
              <Quote className="h-5 w-5 text-primary" />
            </div>
            <blockquote>
              <p className="text-2xl md:text-3xl font-display italic text-foreground mb-3">
                „{quote.latin}"
              </p>
              <p className="text-muted-foreground">
                — {translation}
              </p>
            </blockquote>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
