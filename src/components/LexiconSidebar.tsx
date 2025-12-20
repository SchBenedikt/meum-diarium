
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
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.12, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-5 lg:space-y-6"
    >
      {/* Etymology */}
      {entry.etymology && (
        <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md p-5 lg:p-6">
          <h3 className="font-display text-lg font-medium mb-3 flex items-center gap-2">
            <BookCopy className="h-4 w-4 text-primary" />
            Etymologie
          </h3>
          <p className="text-sm italic text-muted-foreground">
            {entry.etymology}
          </p>
        </div>
      )}

      {/* Category */}
      <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md p-5 lg:p-6">
        <h3 className="font-display text-lg font-medium mb-3 flex items-center gap-2">
          <Tags className="h-4 w-4 text-primary" />
          Kategorie
        </h3>
        <Link
          to={`/search?category=${encodeURIComponent(entry.category)}`}
          className="inline-block px-3.5 py-1.5 min-h-[36px] rounded-full bg-primary/12 text-primary text-xs font-medium hover:bg-primary/20 active:bg-primary/25 transition-colors border border-primary/10"
        >
          {entry.category}
        </Link>
      </div>

      {/* Related Terms */}
      {relatedTerms.length > 0 && (
        <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md p-5 lg:p-6">
          <h3 className="font-display text-lg font-medium mb-4 flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-primary" />
            {t('relatedEntries')}
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            {relatedTerms.map(term => (
              <Link
                key={term.slug}
                to={`/lexicon/${term.slug}`}
                className="block text-sm text-muted-foreground hover:text-primary hover:underline py-1"
              >
                {term.term}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Go to Lexicon */}
      <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md p-5 lg:p-6">
        <Link to="/lexicon" className="group">
          <h3 className="font-display text-lg font-medium mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
            <BookMarked className="h-4 w-4 text-primary" />
            {t('navLexicon')}
          </h3>
          <p className="text-sm text-muted-foreground">
            Alle Begriffe des antiken Roms durchstöbern.
          </p>
        </Link>
      </div>
    </motion.aside>
  );
}
