import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, MessageCircle, BookText, GraduationCap, Brain,
  Clock, Globe, Sparkles, ArrowUpRight, Star, Shapes, LayoutDashboard
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useRef, useState, useEffect } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATS = [
  { value: '36K+', label: 'Vokabeln' },
  { value: '92+', label: 'Lexikon-Einträge' },
  { value: '5', label: 'Historische Autoren' },
  { value: '170+', label: 'Jahre Geschichte' },
];

const MARQUEE_ITEMS = [
  'Alea iacta est', 'O tempora, o mores', 'Festina lente',
  'Dum differtur vita transcurrit', 'Veni, vidi, vici',
  'Carpe diem', 'In vino veritas', 'Per aspera ad astra',
];

const AUTHORS = [
  { id: 'caesar',   name: 'Caesar',   full: 'Gaius Iulius Caesar',    role: 'Feldherr & Staatsmann',    years: '100–44 v. Chr.', quote: 'Veni, vidi, vici.', path: '/caesar',   color: '#7f1d1d' },
  { id: 'cicero',   name: 'Cicero',   full: 'Marcus Tullius Cicero',  role: 'Redner & Philosoph',       years: '106–43 v. Chr.', quote: 'O tempora, o mores.', path: '/cicero',   color: '#1e3a5f' },
  { id: 'augustus', name: 'Augustus', full: 'Gaius Octavius Augustus', role: 'Erster Kaiser Roms',       years: '63 v.–14 n. Chr.', quote: 'Festina lente.', path: '/augustus', color: '#78350f' },
  { id: 'seneca',   name: 'Seneca',  full: 'Lucius Annaeus Seneca',   role: 'Stoischer Philosoph',      years: '4 v.–65 n. Chr.', quote: 'Dum differtur vita transcurrit.', path: '/seneca',   color: '#14532d' },
  { id: 'sokrates', name: 'Sokrates', full: 'Sokrates',                role: 'Philosoph & Weiser',       years: '470–399 v. Chr.', quote: 'Ich weiß, dass ich nichts weiß.', path: '/sokrates', color: '#6ba82f' },
];

const BENTO = [
  {
    icon: MessageCircle,
    title: 'KI-Gespräche',
    desc: 'Chatte mit Caesar, Cicero, Augustus oder Seneca – gestützt auf historische Quellen.',
    link: '/caesar/chat',
    size: 'large', // spans 2 cols
    accent: '#7f1d1d',
  },
  {
    icon: Brain,
    title: 'Vokabeltrainer',
    desc: '36.000+ Vokabeln mit intelligentem Wiederholungssystem.',
    link: '/vocab',
    size: 'small',
    accent: '#4c1d95',
  },
  {
    icon: Clock,
    title: 'Zeitstrahl',
    desc: '170+ Jahre Geschichte interaktiv erleben.',
    link: '/timeline',
    size: 'small',
    accent: '#1e3a5f',
  },
  {
    icon: BookText,
    title: 'Lexikon',
    desc: '92+ Einträge zu Personen, Orten und Begriffen.',
    link: '/lexicon',
    size: 'small',
    accent: '#78350f',
  },
  {
    icon: GraduationCap,
    title: 'Grammatik',
    desc: 'Strukturierte Lateingrammatik mit interaktiven Übungen.',
    link: '/learn/grammar',
    size: 'small',
    accent: '#14532d',
  },
  {
    icon: Globe,
    title: 'Originaltexte',
    desc: 'Lateinische Texte mit Übersetzungen und Kommentaren.',
    link: '/reader',
    size: 'small',
    accent: '#0f2f4c',
  },
  {
    icon: Shapes,
    title: 'Rhetorik & Stil',
    desc: 'Lerne Stilmittel und erkenne sie in Texten.',
    link: '/learn/rhetoric',
    size: 'small',
    accent: '#059669',
  },
  {
    icon: LayoutDashboard,
    title: 'Dein Dashboard',
    desc: 'Verfolge deinen Fortschritt und speichere Inhalte.',
    link: '/dashboard',
    size: 'small',
    accent: '#ea580c',
  },
];

// ─── Marquee ─────────────────────────────────────────────────────────────────

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="lp-marquee-wrap" aria-hidden="true">
      <motion.div
        className="lp-marquee-track"
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((item, i) => (
          <span key={i} className="lp-marquee-item">
            {item}
            <span className="lp-marquee-dot">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  const words = ['Caesar', 'Cicero', 'Augustus', 'Seneca'];
  const [wordIdx, setWordIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % words.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={ref} className="lp-hero">
      {/* Background image with parallax */}
      <motion.div className="lp-hero__bg" style={{ y: imgY, opacity: imgOpacity }}>
        <img
          src="/landing-rome.png"
          alt="Antikes Rom – Sonnenuntergang über dem Forum Romanum"
          className="lp-hero__bg-img"
        />
        {/* Gradient overlays removed as per request */}
      </motion.div>

      {/* Content */}
      <motion.div className="lp-hero__content" style={{ y: textY }}>
        <div className="lp-hero__glass-box">
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="lp-hero__headline"
          >
            Sprich mit
            <br />
            <span className="lp-hero__headline-swap-wrap">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIdx}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.32, 0, 0.67, 0] }}
                  className="lp-hero__headline-swap"
                  style={{ color: AUTHORS[wordIdx]?.color || 'var(--lp-accent)' }}
                >
                  {words[wordIdx]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="lp-hero__ctas"
          >
            <Link to="/caesar">
              <Button className="lp-btn-primary" size="lg">
                Jetzt entdecken
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/learn">
              <Button variant="ghost" className="lp-btn-ghost" size="lg">
                Lernwerkzeuge
              </Button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="lp-hero__stats"
          >
            {STATS.map((s) => (
              <div key={s.label} className="lp-hero__stat">
                <span className="lp-hero__stat-value">{s.value}</span>
                <span className="lp-hero__stat-label">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="lp-hero__scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="lp-hero__scroll-dot"
        />
      </motion.div>
    </section>
  );
}

// ─── Marquee strip ────────────────────────────────────────────────────────────

function MarqueeStrip() {
  return (
    <section className="lp-strip">
      <Marquee />
    </section>
  );
}

// ─── Authors ──────────────────────────────────────────────────────────────────

function Authors() {
  return (
    <section className="lp-section">
      <div className="lp-section__inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lp-section__header"
        >
          <span className="lp-label">Historische Begleiter</span>
          <h2 className="lp-section__title">Vier Stimmen der Antike</h2>
          <p className="lp-section__sub">
            Wähle deinen persönlichen Begleiter und erlebe das antike Rom aus erster Hand.
          </p>
        </motion.div>

        <div className="lp-authors">
          {AUTHORS.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.09 }}
            >
              <Link to={a.path} className="lp-author group">
                {/* Color bar */}
                <div className="lp-author__bar" style={{ background: a.color }} />

                <div className="lp-author__body">
                  {/* Initial */}
                  <div className="lp-author__initial" style={{ color: a.color }}>
                    {a.name[0]}
                  </div>

                  <div className="lp-author__text">
                    <p className="lp-author__name">{a.full}</p>
                    <p className="lp-author__role">{a.role}</p>
                    <p className="lp-author__years">{a.years}</p>
                  </div>

                  <blockquote className="lp-author__quote" style={{ borderColor: `${a.color}40` }}>
                    „{a.quote}"
                  </blockquote>
                </div>

                <div className="lp-author__arrow">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Bento Features ───────────────────────────────────────────────────────────

function BentoGrid() {
  return (
    <section className="lp-section lp-section--tinted">
      <div className="lp-section__inner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lp-section__header"
        >
          <span className="lp-label">Werkzeuge</span>
          <h2 className="lp-section__title">Alles für dein Latein-Studium</h2>
        </motion.div>

        <div className="lp-bento">
          {BENTO.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className={`lp-bento__cell lp-bento__cell--${item.size}`}
              >
                <Link to={item.link} className="lp-bento__card group">
                  {/* Glow accent */}
                  <div
                    className="lp-bento__glow"
                    style={{ background: `radial-gradient(ellipse at top left, ${item.accent}20 0%, transparent 60%)` }}
                  />
                  <div className="lp-bento__top">
                    <div className="lp-bento__icon" style={{ background: `${item.accent}15`, color: item.accent }}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <ArrowUpRight className="lp-bento__arrow" />
                  </div>
                  <h3 className="lp-bento__title">{item.title}</h3>
                  <p className="lp-bento__desc">{item.desc}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────

function Cta() {
  return (
    <section className="lp-cta-section">
      {/* Decorative background */}
      <div className="lp-cta-bg" aria-hidden="true">
        <div className="lp-cta-bg__orb lp-cta-bg__orb--1" />
        <div className="lp-cta-bg__orb lp-cta-bg__orb--2" />
        <div className="lp-cta-bg__grid" />
      </div>

      <div className="lp-section__inner">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lp-cta-inner"
        >
          <div className="lp-cta-badge">
            <Star className="h-3 w-3 mr-1.5" />
            Kostenlos starten
          </div>

          <h2 className="lp-cta-headline">
            Beginne deine<br />
            <span className="lp-cta-headline__accent">Zeitreise</span>
          </h2>

          <p className="lp-cta-sub">
            Wähle einen historischen Begleiter und tauche ein in die Welt des antiken Roms.
            Keine Anmeldung nötig.
          </p>

          <div className="lp-cta-btns">
            <Link to="/caesar">
              <Button className="lp-btn-primary lp-btn-primary--lg" size="lg">
                Mit Caesar starten
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/timeline">
              <Button variant="outline" className="lp-btn-outline--cta" size="lg">
                Zeitstrahl öffnen
              </Button>
            </Link>
          </div>

          {/* Tiny trust */}
          <div className="lp-cta-trust">
            {['Keine Anmeldung', 'Alles kostenlos', 'Open Source'].map((t) => (
              <span key={t} className="lp-cta-trust__item">
                <span className="lp-cta-trust__dot" />
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function LandingPageMinimalist() {
  return (
    <div className="lp-root">
      <Hero />
      <MarqueeStrip />
      <Authors />
      <BentoGrid />
      <Cta />
    </div>
  );
}
