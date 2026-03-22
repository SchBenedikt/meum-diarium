import { motion } from 'framer-motion';
import { Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/layout/Footer';
import { fadeUp, staggerContainer } from '@/lib/motion';

const historicalFigures = [
  {
    name: 'Gaius Julius Caesar',
    slug: 'caesar',
    image: '/images/caesar-hero.png',
    description: 'Feldherr, Staatsmann und Autor der Commentarii de Bello Gallico.',
    years: '100–44 v. Chr.',
    link: '/caesar',
  },
  {
    name: 'Marcus Tullius Cicero',
    slug: 'cicero',
    image: '/images/cicero-hero.png',
    description: 'Redner, Philosoph und Konsul der späten römischen Republik.',
    years: '106–43 v. Chr.',
    link: '/cicero',
  },
  {
    name: 'Augustus',
    slug: 'augustus',
    image: '/images/augustus-hero.png',
    description: 'Erster römischer Kaiser und Begründer des Principats.',
    years: '63 v. Chr. – 14 n. Chr.',
    link: '/augustus',
  },
  {
    name: 'Lucius Annaeus Seneca',
    slug: 'seneca',
    image: '/images/seneca-hero.png',
    description: 'Stoischer Philosoph, Dramatiker und Erzieher Neros.',
    years: '4 v. Chr. – 65 n. Chr.',
    link: '/seneca',
  },
  {
    name: 'Lucius Sergius Catilina',
    slug: 'catilina',
    image: '/images/catilina-hero.png',
    description: 'Römischer Aristokrat und Anführer der berühmten Verschwörung.',
    years: '108–62 v. Chr.',
    link: '/catilina',
  },
];

const ImagesPage = () => {
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://meum-diarium.xn--schner-2za.de';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Bildmaterial – Meum Diarium"
        description="Historische Abbildungen und Rekonstruktionen der bedeutendsten Persönlichkeiten der römischen Antike zur freien Nutzung unter CC BY-SA 4.0."
        type="website"
        image={`${baseUrl}/images/caesar-hero.png`}
      />

      <main className="flex-1 container mx-auto max-w-7xl px-4 pt-32 pb-24">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.08)}
          className="mb-16"
        >
          <motion.div variants={fadeUp()} className="space-y-5 max-w-4xl">
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
              <div className="w-8 h-[1px] bg-primary/30" />
              BILDMATERIAL
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
              Historische <span className="text-primary italic">Abbildungen</span>
            </h1>
            <p className="text-muted-foreground/70 text-lg leading-relaxed max-w-3xl">
              Rekonstruktionen und Illustrationen der bedeutendsten Persönlichkeiten der römischen Antike.
              Alle Bilder stehen unter der Lizenz{' '}
              <span className="font-semibold text-foreground">CC BY-SA 4.0</span> und können frei genutzt werden.
            </p>
          </motion.div>
        </motion.section>

        <section>
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-8">
            <div className="w-8 h-[1px] bg-primary/30" />
            PERSÖNLICHKEITEN
          </div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.1)}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {historicalFigures.map((figure) => (
              <motion.div key={figure.slug} variants={fadeUp()}>
                <Link
                  to={figure.link}
                  className="group block overflow-hidden rounded-2xl border border-border/50 bg-card hover:border-primary/40 transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={figure.image}
                      alt={figure.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">
                        {figure.years}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {figure.name}
                    </h2>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed">
                      {figure.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                        CC BY-SA 4.0
                      </span>
                      <span className="rounded-full border border-border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                        PNG
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="mt-20 card-modern card-padding-lg border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-background">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
              <Image className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold mb-2">Lizenzhinweis</h2>
              <p className="text-muted-foreground/80 leading-relaxed max-w-3xl">
                Die Abbildungen auf dieser Seite sind als Open Educational Resources (OER) unter{' '}
                <span className="font-semibold text-foreground">Creative Commons BY-SA 4.0</span> lizenziert.
                Bei Verwendung bitte „Meum Diarium" als Quelle angeben und abgeleitete Werke unter der gleichen Lizenz veröffentlichen.
              </p>
              <Link
                to="/oer"
                className="inline-flex items-center mt-4 text-sm text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Mehr zu unseren OER-Materialien →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ImagesPage;
