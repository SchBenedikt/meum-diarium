import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Map, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthor } from '@/context/AuthorContext';
import { authors } from '@/data/authors';

export function OverviewGuide() {
  const { currentAuthor } = useAuthor();
  if (!currentAuthor) return null;

  const authorName = authors[currentAuthor].name;

  // Only show a refined "Start hier" for author pages (e.g., /caesar)

  return (
    <section className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-card/60 to-card/30"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-primary/10 blur-2xl" />
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-2xl bg-primary/12 border border-primary/20">
              <Map className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold">Start hier</h3>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-5">
            Neu bei {authorName}? Wähle einen der Einstiege: Profil, Chronologie oder Einträge.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link to={`/${currentAuthor}/about`} className="group flex items-center justify-between rounded-xl px-4 py-3 bg-primary/8 border border-border/40 hover:bg-primary/12 transition-colors">
              <span className="text-sm sm:text-base font-medium flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Biografie & Überblick</span>
              <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to={`/timeline`} className="group flex items-center justify-between rounded-xl px-4 py-3 bg-primary/8 border border-border/40 hover:bg-primary/12 transition-colors">
              <span className="text-sm sm:text-base font-medium flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> Chronologie</span>
              <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to={`/${currentAuthor}`} className="group flex items-center justify-between rounded-xl px-4 py-3 bg-primary/8 border border-border/40 hover:bg-primary/12 transition-colors">
              <span className="text-sm sm:text-base font-medium">Einträge lesen</span>
              <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
