import { BookMarked, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QuoteOfDay } from './QuoteOfDay';
import { FeaturedPost } from './FeaturedPost';
import { ReadingStats } from './ReadingStats';
import { AuthorGrid } from './AuthorGrid';

export function LandingHero() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center text-center overflow-hidden hero-gradient py-20">
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl mb-6 leading-tight">
              Meum Diarium
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Erlebe die Geschichte durch die persönlichen Aufzeichnungen der größten 
              Persönlichkeiten Roms. Von Caesars Eroberungen bis zu Senecas Weisheiten.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <a href="#authors" className="btn-primary px-8 py-3 text-base">
                Autoren entdecken
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Links */}
      <section className="py-16 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            {[
              { to: "/timeline", icon: Clock, title: "Interaktiver Zeitstrahl", desc: "Verfolge die wichtigsten Ereignisse." },
              { to: "/lexicon", icon: BookMarked, title: "Umfassendes Lexikon", desc: "Nachschlagewerk für Begriffe." },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={item.to} className="group block p-8 rounded-2xl bg-card border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
                  <div className="inline-block p-3 rounded-xl bg-primary/10 mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-medium mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <div id="authors">
        <AuthorGrid />
      </div>
      
      <FeaturedPost />

      {/* Quote of the Day */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <QuoteOfDay />
        </div>
      </section>

      <ReadingStats />
    </div>
  );
}
