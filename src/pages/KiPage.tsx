import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { MessageCircle, Zap, BookOpen, FileText, MessageSquare, Film, Check, ArrowLeft } from 'lucide-react';

const KiPage = () => {
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://meum-diarium.xn--schchner-2za.de';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="KI-Nutzung — Meum Diarium"
        description="Vollständige Transparenz: Meum Diarium wurde mithilfe von KI erstellt. Alle Inhalte, Features und Texte sind mithilfe von KI entwickelt und überprüft."
        type="website"
        image={`${baseUrl}/images/ki-hero.jpg`}
      />

      <main className="flex-1">
        {/* Hero */}
        <motion.section 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer(0.1)}
          className="container mx-auto max-w-6xl px-4 pt-32 pb-16"
        >
          <motion.div variants={fadeUp()} className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                <div className="w-8 h-[1px] bg-primary/30" />
                TRANSPARENZ
              </div>
              <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight leading-tight">
                KI in dieser <span className="text-primary italic">Anwendung</span>
              </h1>
              <p className="text-muted-foreground/70 max-w-2xl text-lg leading-relaxed">
                Meum Diarium wurde mithilfe von KI entwickelt und überprüft. Hier erfährst du ehrlich, wie KI in der Anwendung genutzt wird.
              </p>
            </div>
            <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Zurück
            </Link>
          </motion.div>
        </motion.section>

        {/* Aktive KI Section */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={staggerContainer(0.1)}
          className="container mx-auto max-w-6xl px-4 py-20"
        >
          <motion.div variants={fadeUp()} className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-primary font-bold text-xs uppercase tracking-widest">Aktive KI</span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight">
              Echtzeit-Interaktion
            </h2>
            <p className="text-muted-foreground/70 mt-4 text-lg">
              Diese Features nutzen KI direkt — du redest in Echtzeit mit ihr.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: MessageCircle,
                title: 'KI-Chat mit Charakteren',
                description: 'Unterhalte dich mit Caesar, Cicero, Augustus, Seneca und anderen römischen Persönlichkeiten. Die KI antwortet authentisch im Charakter.',
                detail: '→ Spontan kreativ im Chat generiert'
              },
              {
                icon: Zap,
                title: 'Zeitreise-Szenarien',
                description: 'Interaktives Spiel mit Entscheidungen und historischen Konsequenzen. Die KI steuert dynamisch die Geschichte je nach deinen Aktionen.',
                detail: '→ Dynamisch generiert basierend auf deinen Entscheidungen'
              }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp()}>
                <Card className="card-modern h-full border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6 sm:p-8">
                    <item.icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground/80 mb-4">{item.description}</p>
                    <p className="text-sm text-primary font-medium">{item.detail}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Passive KI Section */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={staggerContainer(0.1)}
          className="container mx-auto max-w-6xl px-4 py-20 border-t border-primary/10"
        >
          <motion.div variants={fadeUp()} className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Check className="h-5 w-5 text-primary" />
              <span className="text-primary font-bold text-xs uppercase tracking-widest">Passive KI (überprüft)</span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight">
              Inhalte mit KI erstellt
            </h2>
            <p className="text-muted-foreground/70 mt-4 text-lg">
              Diese Inhalte wurden mithilfe von KI erstellt, dann manuell überprüft und korrigiert.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: 'Tagebuch-Einträge',
                description: 'Persönliche Perspektiven und Gedanken der historischen Figuren.',
                verification: 'Mithilfe von KI erstellt, manuell überprüft'
              },
              {
                icon: FileText,
                title: 'Wissenschaftliche Artikel',
                description: 'Detaillierte Analysen mit historischem Kontext und Quellenangaben.',
                verification: 'Mithilfe von KI erstellt, redaktionell überprüft'
              },
              {
                icon: MessageSquare,
                title: 'Lexikon & Begriffe',
                description: 'Lateinische Vokabeln und historische Konzepte, verständlich erklärt.',
                verification: 'Mithilfe von KI erstellt, auf Genauigkeit überprüft'
              },
              {
                icon: Film,
                title: 'Medieninhalte',
                description: 'KI-generierte Videos als visuelles Begleitmaterial.',
                verification: 'Mithilfe von KI erstellt, mit Disclaimer'
              },
              {
                icon: BookOpen,
                title: 'Diese Webseite',
                description: 'Layout, Design und Bildunterschriften der Anwendung.',
                verification: 'Mithilfe von KI erstellt, manuell angepasst'
              }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp()}>
                <Card className="card-modern h-full border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <item.icon className="h-7 w-7 text-primary mb-3" />
                    <h3 className="font-display text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground/80 mb-4">{item.description}</p>
                    <p className="text-xs text-primary font-medium">✓ {item.verification}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Überprüfung Section */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={fadeUp()}
          className="container mx-auto max-w-4xl px-4 py-20 border-t border-primary/10"
        >
          <Card className="card-modern border-border/50">
            <CardContent className="p-8 md:p-12">
              <h2 className="font-display text-3xl font-bold mb-8">Wie wurde überprüft?</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">Historische Korrektheit</h3>
                  <p className="text-muted-foreground/80">
                    Alle Inhalte basieren auf etablierten Quellen — Primärtexte, akademische Werke, archäologische Befunde. Inhalte wurden gegen diese Quellen überprüft.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Faktenchecks</h3>
                  <p className="text-muted-foreground/80">
                    Daten, Namen und historische Ereignisse wurden manuell überprüft. Bei Unsicherheiten wurde recherchiert.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Stil & Verständlichkeit</h3>
                  <p className="text-muted-foreground/80">
                    Texte wurden auf Verständlichkeit, Konsistenz und Ton überprüft — besonders bei den Tagebucheinträgen.
                  </p>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <p className="text-muted-foreground/80 italic">
                    KI kann trotzdem Fehler machen. Wenn du etwas Falsches findest, sag gerne Bescheid.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
              Wenn du wissen möchtest, ob etwas mit KI gemacht wurde: Die Antwort ist ja. Der gesamte Inhalt — von den Tagebucheinträgen über die wissenschaftlichen Artikel bis zu den interaktiven Features — wurde mithilfe von KI erstellt. Jeder Inhalt wurde dann manuell überprüft und verbessert.
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
            <h2 className="font-display text-3xl font-bold">Ein vertrauenswürdiges Lernwerkzeug</h2>
            <p className="text-lg text-muted-foreground/80 leading-relaxed">
              Meum Diarium zeigt, dass KI ein echtes, zuverlässiges Werkzeug für Bildung sein kann — wenn wir ehrlich sind. Wenn wir sagen, wie Inhalte erstellt wurden. Wenn wir Qualität überprüfen und Fehler korrigieren.
            </p>
            <p className="text-lg text-muted-foreground/80 leading-relaxed">
              Die gesamte Anwendung wurde mithilfe von KI erstellt und überprüft. Das ist kein Experiment — das ist sorgfältig entwickelt.
            </p>
            <p className="text-lg font-semibold text-primary">
              Deshalb diese Seite. Deshalb diese Transparenz.
            </p>
          </div>
        </motion.section>

        {/* Fazit Section */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={fadeUp()}
          className="container mx-auto max-w-3xl px-4 py-20 border-t border-primary/10"
        >
          <Card className="card-modern border-border/50 bg-gradient-to-br from-primary/10 to-transparent">
            <CardContent className="p-8 md:p-12 space-y-6 text-center">
              <h2 className="font-display text-3xl font-bold">Warum Transparenz?</h2>
              <p className="text-lg text-muted-foreground/80 leading-relaxed">
                Meum Diarium zeigt, dass KI ein echtes, zuverlässiges Werkzeug für Bildung sein kann — wenn wir ehrlich sind über ihre Nutzung.
              </p>
              <p className="text-lg text-muted-foreground/80 leading-relaxed">
                Die gesamte Anwendung wurde sorgfältig entwickelt, mithilfe von KI erstellt und überprüft. Das ist kein Experiment — das ist ein vollständiges Lernwerkzeug.
              </p>
              <div className="pt-6">
                <p className="font-semibold text-primary text-lg">Deshalb diese Transparenz.</p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Footer note */}
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={fadeUp()}
          className="container mx-auto max-w-6xl px-4 pb-16 text-center text-xs text-muted-foreground/60"
        >
          <p>Aktualisiert: 22.05.2026</p>
        </motion.div>
      </main>
    </div>
  );
};

export default KiPage;
