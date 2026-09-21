import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/layout/Footer';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { MessageCircle, Zap, FileText, BookOpen, ArrowLeft, ExternalLink, Shield, Cpu, Search, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const aiFeatures = [
  {
    icon: MessageCircle,
    title: 'Dialoge mit historischen Figuren',
    path: '/caesar/chat',
    description: 'Im Chat formulierst du Fragen an eine ausgewählte historische Figur. Ein Sprachmodell erzeugt die Antwort in einer an die Figur angelehnten Rolle. Das ist eine heutige, KI-generierte Darstellung und keine überlieferte Äußerung. Im Chat werden die letzten Gesprächsbeiträge als Kontext mitgesendet; passende Seiten und Texte können zusätzlich vorgeschlagen werden.',
    location: 'Auf den Chat-Seiten, zum Beispiel /caesar/chat',
    badge: 'Dialog',
  },
  {
    icon: Zap,
    title: 'Historische Simulationen',
    path: '/caesar/simulation',
    description: 'Du triffst Entscheidungen in vorgegebenen oder selbst beschriebenen Szenarien. Das Sprachmodell setzt deine Eingaben erzählerisch fort und kann Handlungsoptionen sowie Änderungen an Spielwerten zurückgeben. Die Simulation ist ein Lern- und Gedankenexperiment: Sie bildet keine gesicherten historischen Alternativen ab.',
    location: 'Unter /[figur]/simulation, zum Beispiel /caesar/simulation',
    badge: 'Interaktiv',
  },
  {
    icon: FileText,
    title: 'Arbeitsblatt-Generator',
    path: '/lernen/material',
    description: 'Der Generator erstellt aus einem Thema, optionalen Hinweisen und ausgewählten Aufgabentypen einen Arbeitsblattentwurf. Du kannst Aufgabenarten und Schwierigkeitsstufen festlegen und das Ergebnis als PDF exportieren. Die Ausgabe wird nicht fachlich oder didaktisch automatisch geprüft; kontrolliere insbesondere Übersetzungen, Quellenbezüge und Lösungen vor dem Einsatz.',
    location: '/lernen/material',
    badge: 'Entwurf',
  },
  {
    icon: BookOpen,
    title: 'Erklärungen zu Begriffen',
    path: '/lexicon',
    description: 'Ein Klick auf verknüpfte Begriffe in unterstützten Texten öffnet eine KI-generierte Erklärung. Du kannst dazu Rückfragen stellen. Die Antwort ergänzt den jeweiligen Lexikon-Eintrag, ersetzt ihn aber nicht und kann Fehler oder Vereinfachungen enthalten.',
    location: 'An verknüpften Begriffen in unterstützten Texten und Artikeln',
    badge: 'Auf Anfrage',
  },
];

const KiPage = () => {
  const baseUrl = import.meta.env.VITE_SITE_URL || 'https://meum-diarium.xn--schchner-2za.de';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="KI-Transparenz – Meum Diarium"
        description="Wo Meum Diarium KI einsetzt, wie die Funktionen arbeiten und worauf du dich bei generierten Antworten und Materialien verlassen kannst."
        type="website"
        image={`${baseUrl}/images/caesar-hero.png`}
        canonical={`${baseUrl}/ki`}
      />

      <main className="flex-1">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.1)}
          className="container mx-auto max-w-6xl px-4 pt-32 pb-12"
        >
          <motion.div variants={fadeUp()} className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                <div className="w-8 h-[1px] bg-primary/30" />
                TRANSPARENZ
              </div>
              <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight leading-tight">
                Wo wird <span className="text-primary italic">KI</span> genutzt?
              </h1>
              <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
                Meum Diarium nutzt generative KI für Dialoge, Simulationen, Begriffserklärungen und Arbeitsblattentwürfe. Hier steht, was die Funktionen tatsächlich tun und wo ihre Grenzen liegen.
              </p>
            </div>
            <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Zurück
            </Link>
          </motion.div>
        </motion.section>

        <section className="container mx-auto max-w-5xl px-4 pb-16 sm:pb-24">
          <div className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" />
              <div>
                <h2 className="font-semibold mb-1">KI-Ausgaben sind Vorschläge, keine Quellen</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Sprachmodelle können überzeugend klingende, aber falsche oder erfundene Angaben erzeugen. Historische Dialoge sind keine Originalquellen. Prüfe Fakten anhand verlässlicher Fachliteratur und kontrolliere generierte Unterrichtsmaterialien vor der Weitergabe oder Verwendung.
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Die neu gestalteten Beitragsbilder zu den Figuren außer Caesar sind KI-generierte Illustrationen. Sie veranschaulichen Themen, sind aber weder zeitgenössische Abbildungen noch historische Belege.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {aiFeatures.map((feature) => (
              <motion.div key={feature.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp()}>
                <Card className="card-modern border-border/50 hover:border-primary/30 transition-colors duration-300">
                  <CardContent className="p-5 sm:p-8">
                    <div className="flex items-start gap-4 sm:gap-5">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                        <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="font-display text-base sm:text-xl font-bold">{feature.title}</h2>
                            <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-bold border-primary/30 text-primary">{feature.badge}</Badge>
                          </div>
                          <Link to={feature.path} className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline whitespace-nowrap">
                            Öffnen <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{feature.description}</p>
                        <p className="text-xs text-muted-foreground"><span className="font-semibold">Ort:</span> {feature.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="card-modern mt-10 border-primary/20 bg-primary/[0.03]">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-5 text-primary">
                <Shield className="h-5 w-5" />
                <h2 className="font-bold text-sm uppercase tracking-widest">Was du wissen solltest</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2"><Cpu className="h-4 w-4 text-primary" /><h3 className="font-semibold text-sm">Verarbeitung</h3></div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Die KI-Funktionen senden deine Frage beziehungsweise die für die jeweilige Funktion nötigen Eingaben an einen externen KI-Dienst. Nutze sie daher nicht für vertrauliche oder personenbezogene Angaben. Die konkreten Speicher- und Löschfristen richten sich nach dem Dienst und sind in den Datenschutzhinweisen zu prüfen.</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2"><Search className="h-4 w-4 text-primary" /><h3 className="font-semibold text-sm">Modelle und Prüfung</h3></div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Die Anwendung leitet Anfragen an einen separat betriebenen KI-Endpunkt weiter. Das eingesetzte Modell kann sich ändern; deshalb nennen wir hier keine ungeprüfte Modellversion. Generierte Antworten werden nicht automatisch wissenschaftlich verifiziert.</p>
                </div>
              </div>
              <p className="mt-5 border-t border-border/60 pt-4 text-xs text-muted-foreground leading-relaxed">
                Die Figuren, Texte und Oberfläche verbinden redaktionelle Inhalte mit KI-Ausgaben. Eine KI-Antwort ist als solche gekennzeichnet und sollte nicht mit einer historischen Quelle verwechselt werden.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default KiPage;
