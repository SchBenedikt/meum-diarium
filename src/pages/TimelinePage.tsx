import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Timeline } from '@/components/Timeline';
import { ShareButton } from '@/components/ShareButton';
import { Calendar, Clock, Users, BookMarked } from 'lucide-react';
import { motion } from 'framer-motion';
import { timelineEvents } from '@/data/timeline';

export default function TimelinePage() {
  const totalEvents = timelineEvents.length;
  const minYear = Math.min(...timelineEvents.map(e => e.year));
  const maxYear = Math.max(...timelineEvents.map(e => e.year));
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-16 hero-gradient relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="container mx-auto relative">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Interaktive Chronologie</span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="font-display text-4xl md:text-5xl lg:text-6xl mb-4"
                >
                  Zeitstrahl der Antike
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-muted-foreground text-lg max-w-2xl"
                >
                  Entdecke die wichtigsten Ereignisse im Leben von Caesar, Cicero, Augustus und Seneca – 
                  interaktiv und filterbar nach Autor und Ereignistyp.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <ShareButton 
                  title="Zeitstrahl der Antike - Meum Diarium"
                  text="Entdecke die wichtigsten Ereignisse der römischen Antike in einem interaktiven Zeitstrahl."
                />
              </motion.div>
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { icon: BookMarked, value: totalEvents, label: 'Ereignisse' },
                { icon: Users, value: '4', label: 'Persönlichkeiten' },
                { icon: Clock, value: `${Math.abs(minYear)} v.Chr.`, label: 'Beginn' },
                { icon: Calendar, value: `${maxYear} n.Chr.`, label: 'Ende' },
              ].map((stat) => (
                <div 
                  key={stat.label}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        <Timeline />
      </main>
      <Footer />
    </div>
  );
}
