import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { fadeUp, staggerContainer } from '@/lib/motion';

const KiPage = () => {
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://meum-diarium.xn--schchner-2za.de';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="KI-Nutzung — Meum Diarium"
        description="Vollständige Transparenz: Meum Diarium wurde mit KI erstellt. Alle Inhalte, Features und Texte sind von künstlicher Intelligenz generiert oder unterstützt."
        type="website"
        image={`${baseUrl}/images/ki-hero.jpg`}
      />

      <main className="flex-1">
        {/* Hero */}
        <motion.section 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer(0.1)}
          className="container mx-auto max-w-6xl px-4 pt-32 pb-24"
        >
          <motion.div variants={fadeUp()} className="space-y-8">
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-[2px] bg-primary" />
                <span className="text-primary font-bold text-xs uppercase tracking-widest">Transparenz</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight">
                Diese App wurde mit KI erstellt
              </h1>
              <p className="text-xl text-muted-foreground/80 leading-relaxed max-w-2xl">
                Meum Diarium ist ein Projekt, das von Anfang an mit künstlicher Intelligenz entwickelt wurde. Nicht als Spielerei, sondern als echtes Lernwerkzeug für Latein und römische Geschichte.
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* Main Content */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={staggerContainer(0.1)}
          className="container mx-auto max-w-6xl px-4 py-16 border-t border-primary/10"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* Was ist alles mit KI gemacht */}
            <motion.div variants={fadeUp()} className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Was ist mit KI gemacht?</h2>
              <div className="space-y-3 text-muted-foreground/80">
                <p><strong>✓ Alle Tagebuch-Einträge</strong> — Die persönlichen Perspektiven der historischen Personen</p>
                <p><strong>✓ Wissenschaftliche Artikel</strong> — Historische Kontexte und Analysen</p>
                <p><strong>✓ Der KI-Chat</strong> — Gespräche mit Caesar, Cicero, Augustus und anderen</p>
                <p><strong>✓ Das Zeitreise-Spiel</strong> — Interaktive Szenarien zum Lernen</p>
                <p><strong>✓ Begriffserklärungen</strong> — Lexikon und Glossare</p>
                <p><strong>✓ UI & Design</strong> — Diese Seite selbst</p>
              </div>
            </motion.div>

            {/* Warum das funktioniert */}
            <motion.div variants={fadeUp()} className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Warum das funktioniert</h2>
              <div className="space-y-3 text-muted-foreground/80">
                <p><strong>Historische Basis</strong> — Alle Inhalte basieren auf echten historischen Quellen und dokumentierten Fakten.</p>
                <p><strong>Kontrolle</strong> — Die Inhalte wurden manuell überprüft und korrigiert.</p>
                <p><strong>Spezialität</strong> — KI ist extrem gut darin, komplexe Inhalte verständlich zu erklären.</p>
                <p><strong>Konsistenz</strong> — KI erzeugt konsistente Charaktere und Perspektiven.</p>
              </div>
            </motion.div>

            {/* Kritische Punkte */}
            <motion.div variants={fadeUp()} className="space-y-6">
              <h2 className="font-display text-2xl font-bold">Wichtige Grenzen</h2>
              <div className="space-y-3 text-muted-foreground/80">
                <p><strong>KI kann irren</strong> — Besonders bei Details und speziellen Daten.</p>
                <p><strong>Generalisierungen</strong> — KI vereinfacht manchmal zu viel.</p>
                <p><strong>Keine neuen Erkenntnisse</strong> — KI generiert aus bestehendem Wissen, erfindet nicht neu.</p>
                <p><strong>Archiviert im 2026er Snapshot</strong> — Das Wissen der KI hat ein Cut-off-Datum.</p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Gekennzeichnung? */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={fadeUp()}
          className="container mx-auto max-w-3xl px-4 py-20 border-t border-primary/10"
        >
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-8 md:p-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Sind KI-Inhalte gekennzeichnet?</h2>
            <p className="text-lg text-muted-foreground/80 mb-6">
              Nein. Die KI-Inhalte sind <strong>grundsätzlich nicht gekennzeichnet</strong>, weil die ganze Anwendung mit KI erstellt wurde.
            </p>
            <p className="text-muted-foreground/80">
              Wenn du wissen möchtest, ob etwas mit KI gemacht wurde: Die Antwort ist ja. Die einzigen handschriftlich verfassten Teile sind diese Transparenz-Seite und die allgemeine Struktur der Anwendung. Der Rest ist KI-generiert oder KI-unterstützt.
            </p>
          </div>
        </motion.section>

        {/* Warum das okay ist */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={staggerContainer(0.1)}
          className="container mx-auto max-w-6xl px-4 py-20 border-t border-primary/10"
        >
          <motion.h2 variants={fadeUp()} className="font-display text-3xl font-bold mb-12 text-center">
            Warum ist das trotzdem ein gutes Lernwerkzeug?
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              variants={fadeUp()}
              className="space-y-3"
            >
              <h3 className="font-display text-xl font-bold">Für Schüler:innen</h3>
              <ul className="space-y-2 text-muted-foreground/80">
                <li>✓ Sofortige Antworten auf Fragen — kein Warten auf Lehrer</li>
                <li>✓ Mehrere Perspektiven auf Geschichte — durch die Charaktere</li>
                <li>✓ Spielerisches Lernen — nicht nur passive Texte</li>
                <li>✓ Immer verfügbar — 24/7 zugänglich</li>
              </ul>
            </motion.div>

            <motion.div 
              variants={fadeUp()}
              className="space-y-3"
            >
              <h3 className="font-display text-xl font-bold">Für Lehrkräfte</h3>
              <ul className="space-y-2 text-muted-foreground/80">
                <li>✓ OER-Ressourcen — alles frei nutzbar und modifizierbar</li>
                <li>✓ Ergänzung, nicht Ersatz — für Unterrichtsmaterialien</li>
                <li>✓ Motivierend — durch interaktive Elemente</li>
                <li>✓ Transparent — diese Seite erklärt alles offen</li>
              </ul>
            </motion.div>
          </div>
        </motion.section>

        {/* Fazit */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={fadeUp()}
          className="container mx-auto max-w-3xl px-4 py-20 border-t border-primary/10"
        >
          <div className="space-y-6 text-center">
            <h2 className="font-display text-3xl font-bold">Das ist nicht perfekt — und das ist okay</h2>
            <p className="text-lg text-muted-foreground/80 leading-relaxed">
              Meum Diarium ist ein Experiment: Kann KI ein echtes, vertrauenswürdiges Lernwerkzeug sein? Kann sie Geschichte so vermitteln, dass sie interessant wird?
            </p>
            <p className="text-lg text-muted-foreground/80 leading-relaxed">
              Die Antwort ist: Ja, wenn wir ehrlich sind. Wenn wir sagen, was KI ist und was nicht. Wenn wir Fehler zugeben und korrigieren.
            </p>
            <p className="text-lg font-semibold text-primary">
              Deshalb diese Seite. Deshalb diese Transparenz.
            </p>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={fadeUp()}
          className="container mx-auto max-w-3xl px-4 py-20 border-t border-primary/10"
        >
          <div className="space-y-6 text-center">
            <h2 className="font-display text-2xl font-bold">Fragen? Feedback?</h2>
            <p className="text-muted-foreground/80">
              Wenn dir etwas nicht stimmt oder du einen Fehler findest — sag Bescheid.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link to="/contact">
                <Button className="h-11 px-6">Kontakt</Button>
              </Link>
              <a href="https://github.com/SchBenedikt/meum-diarium" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="h-11 px-6">GitHub</Button>
              </a>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={fadeUp()}
          className="container mx-auto max-w-6xl px-4 pb-16 text-center text-xs text-muted-foreground/60"
        >
          <p>Stand: 22.05.2026</p>
        </motion.div>
      </main>
    </div>
  );
};

export default KiPage;
