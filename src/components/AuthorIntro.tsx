import { useAuthor } from '@/context/AuthorContext';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const quotes: Record<string, { latin: string; german: string }> = {
  caesar: { latin: "Veni, vidi, vici.", german: "Ich kam, sah und siegte." },
  cicero: { latin: "Dum spiro, spero.", german: "Solange ich atme, hoffe ich." },
  augustus: { latin: "Festina lente.", german: "Eile mit Weile." },
  seneca: { latin: "Non est vivere sed valere vita est.", german: "Leben heißt nicht nur zu atmen, sondern zu handeln." },
};

export function AuthorIntro() {
  const { authorInfo, currentAuthor } = useAuthor();

  if (!currentAuthor || !authorInfo) return null;

  const quote = quotes[currentAuthor];

  return (
    <section className="py-16 border-t border-border">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="surface-tonal p-8 md:p-12 rounded-xl"
        >
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-6">
              <Quote className="h-5 w-5 text-primary" />
            </div>
            <blockquote>
              <p className="text-2xl md:text-3xl font-display italic text-foreground mb-3">
                „{quote.latin}"
              </p>
              <p className="text-muted-foreground">
                — {quote.german}
              </p>
            </blockquote>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
