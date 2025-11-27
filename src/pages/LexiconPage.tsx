import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { lexicon } from '@/data/lexicon';
import { BookMarked, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LexiconPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLexicon = lexicon
    .filter(entry => 
      entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.definition.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.term.localeCompare(b.term));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-16 hero-gradient">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <BookMarked className="h-4 w-4" />
                <span>Glossar der Antike</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
                Lexikon
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Ein Nachschlagewerk für wichtige Begriffe, Personen und Konzepte des antiken Roms.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search & Content */}
        <section className="py-12">
          <div className="container mx-auto max-w-4xl">
            {/* Search Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mb-10"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Begriff suchen..."
                className="w-full pl-12 pr-4 py-6 text-base rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </motion.div>

            {/* Lexicon List */}
            <div className="space-y-6">
              {filteredLexicon.length > 0 ? (
                filteredLexicon.map((entry, index) => (
                  <motion.div
                    key={entry.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="card-elevated"
                  >
                    <h2 className="font-display text-xl font-medium text-primary mb-2">
                      {entry.term}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {entry.definition}
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">
                    Kein Eintrag für "{searchTerm}" gefunden.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
