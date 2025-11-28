
import { Footer } from '@/components/layout/Footer';
import { Timeline } from '@/components/Timeline';
import { ShareButton } from '@/components/ShareButton';
import { Calendar, Clock, Users, BookMarked } from 'lucide-react';
import { motion } from 'framer-motion';
import { timelineEvents } from '@/data/timeline';
import { useEffect } from 'react';
import { useAuthor } from '@/context/AuthorContext';

export default function TimelinePage() {
  const { setCurrentAuthor } = useAuthor();
  const totalEvents = timelineEvents.length;
  const minYear = Math.min(...timelineEvents.map(e => e.year));
  const maxYear = Math.max(...timelineEvents.map(e => e.year));
  
  useEffect(() => {
    setCurrentAuthor(null);
  }, [setCurrentAuthor]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 pt-32 hero-gradient relative overflow-hidden">
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
                  <span>Chronologia Interactiva</span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="font-display text-4xl md:text-5xl lg:text-6xl mb-4"
                >
                  Linea Temporis Antiquitatis
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-muted-foreground text-lg max-w-2xl"
                >
                  Explora eventus maximi momenti in vitis Caesaris, Ciceronis, Augusti et Senecae – interactive et percolabilis per auctorem et genus eventus.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <ShareButton 
                  title="Linea Temporis Antiquitatis - Meum Diarium"
                  text="Explora eventus maximi momenti Romae antiquae in linea temporis interactiva."
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
                { icon: BookMarked, value: totalEvents, label: 'Eventus' },
                { icon: Users, value: '4', label: 'Personae' },
                { icon: Clock, value: `${Math.abs(minYear)} a.C.n.`, label: 'Initium' },
                { icon: Calendar, value: `${maxYear} p.C.n.`, label: 'Finis' },
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
