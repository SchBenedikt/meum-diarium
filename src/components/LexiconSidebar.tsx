
import { Link } from 'react-router-dom';
import { lexicon, LexiconEntry } from '@/data/lexicon';
import { BookCopy, Link as LinkIcon, BookMarked, Tags } from 'lucide-react';
import { motion } from 'framer-motion';

interface LexiconSidebarProps {
  entry: LexiconEntry;
}

export function LexiconSidebar({ entry }: LexiconSidebarProps) {
  const relatedTerms = entry.relatedTerms
    ? lexicon.filter(e => entry.relatedTerms?.includes(e.slug))
    : [];

  return (
    <aside className="space-y-6">
      {/* Etymology */}
      {entry.etymology && (
        <motion.div 
          className="sidebar-card animate-in"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
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
        className="sidebar-card animate-in stagger-1"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="font-display text-lg font-medium mb-3 flex items-center gap-2">
          <Tags className="h-4 w-4 text-primary" />
          Kategorie
        </h3>
        <Link 
          to={`/search?category=${encodeURIComponent(entry.category)}`}
          className="inline-block px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
        >
          {entry.category}
        </Link>
      </motion.div>

      {/* Related Terms */}
      {relatedTerms.length > 0 && (
        <motion.div 
          className="sidebar-card animate-in stagger-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-display text-lg font-medium mb-4 flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-primary" />
            Verwandte Begriffe
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
        className="sidebar-card animate-in stagger-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <Link to="/lexicon" className="group">
          <h3 className="font-display text-lg font-medium mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
            <BookMarked className="h-4 w-4 text-primary" />
            Ganzes Lexikon
          </h3>
          <p className="text-sm text-muted-foreground">
            Alle Begriffe des antiken Roms durchstöbern.
          </p>
        </Link>
      </motion.div>
    </aside>
  );
}
