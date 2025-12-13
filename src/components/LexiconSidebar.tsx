
import { Link } from 'react-router-dom';
import { lexicon as baseLexicon } from '@/data/lexicon';
import { LexiconEntry } from '@/types/blog';
import { BookCopy, Link as LinkIcon, BookMarked, Tags } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';
import { getTranslatedLexicon } from '@/lib/translator';

interface LexiconSidebarProps {
  entry: LexiconEntry;
}

export function LexiconSidebar({ entry }: LexiconSidebarProps) {
  const { language, t } = useLanguage();
  const [lexicon, setLexicon] = useState(baseLexicon);

  useEffect(() => {
    async function translate() {
      const translated = await getTranslatedLexicon(language);
      setLexicon(translated);
    }
    translate();
  }, [language]);


  const relatedTerms = entry.relatedTerms
    ? lexicon.filter(e => entry.relatedTerms?.includes(e.slug))
    : [];

  return (
    <aside className="space-y-5 lg:space-y-6">
      {/* Etymology */}
      {entry.etymology && (
        <motion.div 
          className="rounded-2xl border border-border/70 bg-surface-container-high/70 shadow-sm shadow-foreground/5 p-5 lg:p-6 animate-in"
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-display text-lg font-medium mb-3 flex items-center gap-2">
            <BookCopy className="h-4 w-4 text-primary" />
            Etymologie
          </h3>
          <p className="text-sm italic text-muted-foreground">
            {entry.etymology}
          </p>
        </motion.div>
      )}

      {/* Category */}
      <motion.div 
        className="rounded-2xl border border-border/70 bg-surface-container-high/70 shadow-sm shadow-foreground/5 p-5 lg:p-6 animate-in stagger-1"
        initial={{ opacity: 0, x: 12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="font-display text-lg font-medium mb-3 flex items-center gap-2">
          <Tags className="h-4 w-4 text-primary" />
          Kategorie
        </h3>
        <Link 
          to={`/search?category=${encodeURIComponent(entry.category)}`}
          className="inline-block px-3.5 py-1.5 min-h-[36px] rounded-full bg-primary/12 text-primary text-xs font-medium hover:bg-primary/20 active:bg-primary/25 transition-colors shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
        >
          {entry.category}
        </Link>
      </motion.div>

      {/* Related Terms */}
      {relatedTerms.length > 0 && (
        <motion.div 
          className="rounded-2xl border border-border/70 bg-surface-container-high/70 shadow-sm shadow-foreground/5 p-5 lg:p-6 animate-in stagger-2"
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-display text-lg font-medium mb-4 flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-primary" />
            {t('relatedEntries')}
          </h3>
          <div className="space-y-2">
            {relatedTerms.map(term => (
              <Link
                key={term.slug}
                to={`/lexicon/${term.slug}`}
                className="block text-sm text-muted-foreground hover:text-primary hover:underline"
              >
                {term.term}
              </Link>
            ))}
          </div>
        </motion.div>
      )}

       {/* Go to Lexicon */}
       <motion.div 
        className="rounded-2xl border border-border/70 bg-surface-container-high/70 shadow-sm shadow-foreground/5 p-5 lg:p-6 animate-in stagger-3"
        initial={{ opacity: 0, x: 12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <Link to="/lexicon" className="group">
          <h3 className="font-display text-lg font-medium mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
            <BookMarked className="h-4 w-4 text-primary" />
            {t('navLexicon')}
          </h3>
          <p className="text-sm text-muted-foreground">
            Alle Begriffe des antiken Roms durchstöbern.
          </p>
        </Link>
      </motion.div>
    </aside>
  );
}
