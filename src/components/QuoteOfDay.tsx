import { useMemo } from 'react';
import { Quote, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { authors } from '@/data/authors';
import { Author } from '@/types/blog';

interface QuoteData {
  text: string;
  latinText?: string;
  author: Author;
  source: string;
}

const quotes: QuoteData[] = [
  { text: 'Der Würfel ist gefallen.', latinText: 'Alea iacta est.', author: 'caesar', source: 'Überschreitung des Rubikon, 49 v. Chr.' },
  { text: 'Ich kam, sah und siegte.', latinText: 'Veni, vidi, vici.', author: 'caesar', source: 'Brief an den Senat, 47 v. Chr.' },
  { text: 'Die Erfahrung ist die Lehrerin aller Dinge.', latinText: 'Experientia docet.', author: 'caesar', source: 'De Bello Civili' },
  { text: 'Wie lange noch, Catilina, wirst du unsere Geduld missbrauchen?', latinText: 'Quo usque tandem abutere, Catilina, patientia nostra?', author: 'cicero', source: 'Erste Rede gegen Catilina' },
  { text: 'Ein Raum ohne Bücher ist wie ein Körper ohne Seele.', latinText: 'A room without books is like a body without a soul.', author: 'cicero', source: 'Zugeschrieben' },
  { text: 'Die Zeiten ändern sich, und wir ändern uns mit ihnen.', latinText: 'Tempora mutantur, nos et mutamur in illis.', author: 'cicero', source: 'Philosophische Schriften' },
  { text: 'Ich habe Rom aus Ziegeln vorgefunden und aus Marmor hinterlassen.', latinText: 'Marmoream relinquo, quam latericiam accepi.', author: 'augustus', source: 'Res Gestae' },
  { text: 'Eile mit Weile.', latinText: 'Festina lente.', author: 'augustus', source: 'Lieblingszitat' },
  { text: 'Es ist nicht so, dass wir wenig Zeit hätten, sondern dass wir viel verschwenden.', latinText: 'Non exiguum temporis habemus, sed multum perdidimus.', author: 'seneca', source: 'De Brevitate Vitae' },
  { text: 'Die Philosophie ist die Kunst des Lebens.', latinText: 'Philosophia ars vitae.', author: 'seneca', source: 'Briefe an Lucilius' },
  { text: 'Wer Angst hat zu leiden, leidet bereits an seiner Angst.', author: 'seneca', source: 'Briefe an Lucilius' },
  { text: 'Glück ist nicht, alles zu haben, sondern mit dem zufrieden zu sein, was man hat.', author: 'seneca', source: 'De Vita Beata' },
];

export function QuoteOfDay() {
  const quote = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return quotes[dayOfYear % quotes.length];
  }, []);

  const authorColorClasses: Record<string, string> = {
    caesar: 'bg-author-caesar/10 border-author-caesar/20 text-author-caesar',
    cicero: 'bg-author-cicero/10 border-author-cicero/20 text-author-cicero',
    augustus: 'bg-author-augustus/10 border-author-augustus/20 text-author-augustus',
    seneca: 'bg-author-seneca/10 border-author-seneca/20 text-author-seneca',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl border p-6 ${authorColorClasses[quote.author]}`}
    >
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-current/10 flex items-center justify-center flex-shrink-0">
          <Quote className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider mb-3 opacity-70">
            Zitat des Tages
          </p>
          <blockquote className="font-display text-lg sm:text-xl leading-relaxed mb-2">
            „{quote.text}"
          </blockquote>
          {quote.latinText && (
            <p className="text-sm italic opacity-70 mb-4">
              {quote.latinText}
            </p>
          )}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{authors[quote.author].name}</span>
            <span className="opacity-50">·</span>
            <span className="opacity-70">{quote.source}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
