import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { MessageCircle, Zap, BookOpen, FileText, MessageSquare, Film, Check, ArrowLeft, Code, Clock, Euro, Sparkles } from 'lucide-react';

const KiPage = () => {
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://meum-diarium.xn--schchner-2za.de';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="KI-Transparenz und Nutzung"
        description="Vollständige Transparenz zur KI-Nutzung bei Meum Diarium: Wie Inhalte, Funktionen und Lernmodule entwickelt, überprüft und eingesetzt werden."
        type="website"
        image={`${baseUrl}/images/ki-hero.jpg`}
        canonical={`${baseUrl}/ki`}
        tags={['KI', 'Transparenz', 'Meum Diarium', 'PWA', 'SEO']}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "KI-Transparenz und Nutzung",
            "url": `${baseUrl}/ki`,
            "description": "Transparente Erklärung zur KI-Nutzung bei Meum Diarium.",
            "inLanguage": "de-DE",
            "isPartOf": {
              "@type": "WebSite",
              "name": "Meum Diarium",
              "url": baseUrl
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Startseite",
                "item": baseUrl
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "KI",
                "item": `${baseUrl}/ki`
              }
            ]
          }
        ]}
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
                Hier erfährst du ehrlich, wie KI bei Meum Diarium eingesetzt wird – und was menschliche Arbeit ist.
              </p>
            </div>
            <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Zurück
            </Link>
          </motion.div>
        </motion.section>

        {/* Grundsätzliches */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={fadeUp()}
          className="container mx-auto max-w-4xl px-4 pb-20"
        >
          <Card className="card-modern border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-background">
            <CardContent className="p-8 md:p-12 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-primary font-bold text-xs uppercase tracking-widest">Grundsätzliches</span>
              </div>
              <p className="text-lg text-muted-foreground/80 leading-relaxed">
                KI hat die Erstellung dieser Anwendung erheblich vereinfacht und beschleunigt. Texte, Code-Grundgerüste und Übersetzungen wurden oft mit KI ausgearbeitet. 
              </p>
              <p className="text-lg text-muted-foreground/80 leading-relaxed">
                <strong>Das Design, der Aufbau, die Struktur und die Features haben wir uns aber selbst überlegt und ausgearbeitet.</strong> Die KI war ein Werkzeug – sie hat nicht die Vision geliefert. Jede Entscheidung über Architektur, Benutzerführung, didaktisches Konzept und visuelle Identität wurde von uns getroffen.
              </p>
              <p className="text-lg text-muted-foreground/80 leading-relaxed">
                Zudem wurden sämtliche Inhalte nach <strong>strengen Richtlinien kontrolliert und überarbeitet</strong>: Historische Fakten wurden gegen Primär- und Sekundärliteratur geprüft, lateinische Texte auf Korrektheit verifiziert und alle KI-generierten Passagen redaktionell nachbearbeitet. Diese Seite ist kein Experiment – sie ist sorgfältig entwickelt und geprüft.
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Aktive KI Section */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={staggerContainer(0.1)}
          className="container mx-auto max-w-6xl px-4 py-20 border-t border-primary/10"
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
              Diese Features nutzen KI direkt – du interagierst live mit ihr.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: MessageCircle,
                title: 'KI-Chat mit Charakteren',
                description: 'Unterhalte dich mit Caesar, Cicero, Augustus und anderen historischen Persönlichkeiten. Die KI antwortet authentisch im Charakter.',
                detail: '→ Live generiert, kein vorgefertigter Text'
              },
              {
                icon: Zap,
                title: 'Zeitreise-Szenarien',
                description: 'Interaktives Spiel mit Entscheidungen und historischen Konsequenzen. Die KI reagiert dynamisch auf deine Aktionen.',
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
              <span className="text-primary font-bold text-xs uppercase tracking-widest">Passive KI (geprüft)</span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight">
              Inhalte mit KI erstellt
            </h2>
            <p className="text-muted-foreground/70 mt-4 text-lg">
              Diese Inhalte wurden mithilfe von KI erstellt, dann nach strengen Richtlinien manuell überprüft und korrigiert.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: 'Tagebuch-Einträge',
                description: 'Persönliche Perspektiven und Gedanken historischer Figuren.',
                verification: 'KI-erstellt + redaktionell geprüft'
              },
              {
                icon: FileText,
                title: 'Wissenschaftliche Artikel',
                description: 'Detaillierte Analysen mit historischem Kontext und Quellenangaben.',
                verification: 'KI-erstellt + fachlich gegengeprüft'
              },
              {
                icon: MessageSquare,
                title: 'Lexikon & Begriffe',
                description: 'Lateinische Vokabeln und historische Konzepte, verständlich erklärt.',
                verification: 'KI-erstellt + auf Korrektheit geprüft'
              },
              {
                icon: Film,
                title: 'KI-generierte Videos',
                description: 'Visuelles Begleitmaterial zu historischen Szenen.',
                verification: 'KI-erstellt, mit Hinweis gekennzeichnet'
              },
              {
                icon: Code,
                title: 'Anwendungscode',
                description: 'Grundgerüste, Komponenten und wiederkehrende Muster.',
                verification: 'KI-unterstützt + manuell architekturiert'
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

        {/* Menschliche Arbeit Section */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={fadeUp()}
          className="container mx-auto max-w-4xl px-4 py-20 border-t border-primary/10"
        >
          <Card className="card-modern border-border/50">
            <CardContent className="p-8 md:p-12">
              <h2 className="font-display text-3xl font-bold mb-8">Was ist komplett ohne KI entstanden?</h2>
              <div className="space-y-6 text-muted-foreground/80">
                <div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Konzept & Architektur</h3>
                  <p>Die Idee, das didaktische Konzept, die Seitenstruktur und der Aufbau der Anwendung wurden vollständig ohne KI entwickelt. Wir haben entschieden, welche Features sinnvoll sind und wie sie zusammenspielen.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Design & Visual Identity</h3>
                  <p>Layout-Entscheidungen, Farbpalette, Typografie, Benutzerführung und das gesamte visuelle Erscheinungsbild sind menschliche Arbeit. Die KI hat Komponenten-Vorschläge gemacht, aber das Gesamtdesign haben wir selbst erarbeitet.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Feature-Entwicklung</h3>
                  <p>Welche interaktiven Elemente es gibt (Chat, Simulationen, Zeitleiste, Karte, Lexikon, Arbeitsblätter), wie sie funktionieren und wie sie didaktisch eingebettet sind – das alles ist ohne KI entstanden.</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-foreground">Qualitätskontrolle</h3>
                  <p>Sämtliche Inhalte werden manuell geprüft. Historische Fakten gegen Quellen, lateinische Texte auf Korrektheit, didaktische Materialien auf Verständlichkeit. KI generiert, der Mensch kontrolliert.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Zeit & Kosten Vergleich */}
        <motion.section 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={staggerContainer(0.1)}
          className="container mx-auto max-w-6xl px-4 py-20 border-t border-primary/10"
        >
          <motion.div variants={fadeUp()} className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-primary font-bold text-xs uppercase tracking-widest">Aufwand & Wert</span>
            </div>
            <h2 className="font-display text-4xl font-bold tracking-tight">
              Was würde das ohne KI kosten?
            </h2>
            <p className="text-muted-foreground/70 mt-4 text-lg max-w-2xl mx-auto">
              Eine ehrliche Einordnung des Aufwands – mit und ohne KI.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={fadeUp()}>
              <Card className="card-modern border-border/50 h-full">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold">Mit KI (tatsächlich)</h3>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground/80">
                    <div className="flex justify-between"><span>Konzeption & Planung</span><span className="font-semibold text-foreground">~40 Stunden</span></div>
                    <div className="flex justify-between"><span>Design & UI/UX</span><span className="font-semibold text-foreground">~60 Stunden</span></div>
                    <div className="flex justify-between"><span>Entwicklung & Code</span><span className="font-semibold text-foreground">~120 Stunden</span></div>
                    <div className="flex justify-between"><span>Inhaltserstellung & Prüfung</span><span className="font-semibold text-foreground">~80 Stunden</span></div>
                    <div className="flex justify-between"><span>Testing & Optimierung</span><span className="font-semibold text-foreground">~40 Stunden</span></div>
                    <div className="pt-3 border-t border-border/50 flex justify-between font-bold text-foreground">
                      <span>Gesamt</span><span>~340 Stunden</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground/60 italic">Reine Entwicklungszeit inkl. KI-Nutzung über ~6 Monate</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp()}>
              <Card className="card-modern border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-background h-full">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Euro className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-bold">Ohne KI (geschätzt)</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span>Konzeption & Planung</span><span className="font-semibold text-foreground">~60 Stunden</span></div>
                    <div className="flex justify-between"><span>Design & UI/UX</span><span className="font-semibold text-foreground">~120 Stunden</span></div>
                    <div className="flex justify-between"><span>Entwicklung & Code</span><span className="font-semibold text-foreground">~600 Stunden</span></div>
                    <div className="flex justify-between"><span>Inhaltserstellung & Prüfung</span><span className="font-semibold text-foreground">~350 Stunden</span></div>
                    <div className="flex justify-between"><span>Testing & Optimierung</span><span className="font-semibold text-foreground">~100 Stunden</span></div>
                    <div className="pt-3 border-t border-border/50 flex justify-between font-bold text-foreground">
                      <span>Gesamt</span><span>~1.230 Stunden</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground/60 italic">Hochgerechnet auf ~12–18 Monate für eine Einzelperson</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={fadeUp()} className="mt-12">
            <Card className="card-modern border-border/50">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Euro className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-bold">Was würde diese Anwendung kosten?</h3>
                </div>
                <div className="grid sm:grid-cols-3 gap-6 text-center">
                  <div className="p-4 rounded-xl bg-secondary/30">
                    <p className="text-3xl font-display font-bold text-primary">~€80</p>
                    <p className="text-xs text-muted-foreground mt-1">Stundensatz (freiberuflich)</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/30">
                    <p className="text-3xl font-display font-bold text-primary">~€98.000</p>
                    <p className="text-xs text-muted-foreground mt-1">Gesamtkosten ohne KI</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/30">
                    <p className="text-3xl font-display font-bold text-primary">~€27.000</p>
                    <p className="text-xs text-muted-foreground mt-1">Gesamtkosten mit KI</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground/60 italic mt-6 text-center">
                  Geschätzt bei einem durchschnittlichen Stundensatz von ~80 € für Full-Stack-Entwicklung, inkl. Konzeption, Design, Inhalten und Qualitätssicherung. Ohne laufende Kosten (Server, APIs, Lizenzen).
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        {/* Gekennzeichnung */}
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
              Nein – und das ist Absicht. Die KI-Inhalte sind <strong>grundsätzlich nicht einzeln gekennzeichnet</strong>, weil die gesamte Anwendung mithilfe von KI erstellt wurde.
            </p>
            <p className="text-muted-foreground/80">
              Wenn du wissen möchtest, ob etwas mit KI gemacht wurde: Die Antwort ist fast immer ja. Der gesamte Inhalt – von den Tagebucheinträgen über die wissenschaftlichen Artikel bis zu den interaktiven Features – wurde mit Unterstützung von KI erstellt. Aber: Jeder Inhalt wurde manuell überprüft und nach strengen Richtlinien überarbeitet. Das Design und die Struktur der Anwendung sind eigenständig entwickelt.
            </p>
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
              <h2 className="font-display text-3xl font-bold mb-8">Nach welchen Richtlinien wurde geprüft?</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">Historische Korrektheit</h3>
                  <p className="text-muted-foreground/80">
                    Alle Inhalte basieren auf etablierten Quellen – Primärtexte (Caesar, Cicero, Sallust, Seneca, Augustinus), akademische Werke und archäologische Befunde. Jede Aussage wurde gegen diese Quellen validiert.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Sprachliche Richtigkeit</h3>
                  <p className="text-muted-foreground/80">
                    Lateinische Zitate, Vokabeln und Grammatik-Erklärungen wurden manuell auf Korrektheit geprüft. Deutsche Texte wurden auf Rechtschreibung, Stil und Verständlichkeit redigiert.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Didaktische Qualität</h3>
                  <p className="text-muted-foreground/80">
                    Alle Lernmaterialien wurden auf Altersangemessenheit, Lernzielfokus und methodische Qualität geprüft. Die Simulationen und interaktiven Elemente wurden auf ihre didaktische Wirksamkeit hin bewertet.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Technische Zuverlässigkeit</h3>
                  <p className="text-muted-foreground/80">
                    Code und Funktionen werden regelmäßig getestet. Die KI-generierten Code-Grundgerüste wurden manuell überarbeitet, optimiert und auf Sicherheit sowie Barrierefreiheit geprüft.
                  </p>
                </div>
                <div className="pt-4 border-t border-border/50">
                  <p className="text-muted-foreground/80 italic">
                    KI kann trotzdem Fehler machen. Wenn dir etwas auffällt, freuen wir uns über eine Rückmeldung.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                <li>✓ Sofortige Antworten auf Fragen – kein Warten auf Lehrer</li>
                <li>✓ Mehrere Perspektiven auf Geschichte durch die Charaktere</li>
                <li>✓ Spielerisches Lernen – nicht nur passive Texte</li>
                <li>✓ Immer verfügbar – 24/7 von überall zugänglich</li>
              </ul>
            </motion.div>

            <motion.div 
              variants={fadeUp()}
              className="space-y-3"
            >
              <h3 className="font-display text-xl font-bold">Für Lehrkräfte</h3>
              <ul className="space-y-2 text-muted-foreground/80">
                <li>✓ OER-Ressourcen – alles frei nutzbar und modifizierbar</li>
                <li>✓ Ergänzung, nicht Ersatz – für den Unterricht konzipiert</li>
                <li>✓ Motivierend durch interaktive Elemente</li>
                <li>✓ Transparent – diese Seite erklärt dir alles offen</li>
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
          <Card className="card-modern border-border/50 bg-gradient-to-br from-primary/10 to-transparent">
            <CardContent className="p-8 md:p-12 space-y-6 text-center">
              <h2 className="font-display text-3xl font-bold">Warum Transparenz?</h2>
              <p className="text-lg text-muted-foreground/80 leading-relaxed">
                Meum Diarium zeigt, dass KI ein echtes, zuverlässiges Werkzeug für Bildung sein kann – wenn wir ehrlich sind über ihre Nutzung. 
                KI hat uns geholfen, schneller zu arbeiten und bessere Inhalte zu produzieren. Aber das Konzept, das Design und die Qualitätskontrolle bleiben menschlich.
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
          <p>Aktualisiert: 02.06.2026</p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default KiPage;
