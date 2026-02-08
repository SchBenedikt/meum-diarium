import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { Building2, Mail, Phone, Globe, Shield, Scale, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
export default function ImprintPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Impressum - Meum Diarium"
        description="Rechtliche Informationen und Kontaktdaten von Meum Diarium."
      />
      <main className="flex-1 container mx-auto px-4 pt-32 pb-24 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
              <div className="w-8 h-[1px] bg-primary/30" />
              IMPRESSUM
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
              <span className="text-primary italic">Impressum</span>
            </h1>
            <p className="text-muted-foreground/60 max-w-md font-light leading-relaxed">
              Angaben gemäß § 5 TMG
            </p>
          </motion.div>
          <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors pr-2">
            <ArrowLeft className="h-3.5 w-3.5" /> Zurück zum Start
          </Link>
        </div>
        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-12"
            >
              {/* Responsible Party */}
              <div className="p-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-primary" />
                  Betreiber
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <p><strong className="text-foreground">Meum Diarium</strong></p>
                  <p>
                    Benedikt Schächner —{' '}
                    <a
                      href="https://benedikt.xn--schchner-2za.de"
                      className="text-primary hover:underline"
                    >
                      benedikt.schächner.de
                    </a>
                  </p>
                  <p>
                    Vinzenz Schächner —{' '}
                    <a
                      href="https://vinzenz.xn--schchner-2za.de"
                      className="text-primary hover:underline"
                    >
                      vinzenz.schächner.de
                    </a>
                  </p>
                  <p>Adresse auf Anfrage</p>
                  <p className="text-sm">Hinweis: Private, nicht-kommerzielle Seite mit Fokus auf Bildung und Kultur.</p>
                  <p className="text-sm">Die Anschrift geben wir auf Anfrage an, um Privatsphäre und Sicherheit zu wahren.</p>
                </div>
              </div>
              {/* Contact */}
              <div className="p-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-primary" />
                  Kontakt
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">E-Mail</p>
                      <a href="mailto:info@meum-diarium.de" className="text-primary hover:underline">
                        info@meum-diarium.de
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Website</p>
                      <a href="https://meum-diarium.xn--schchner-2za.de" className="text-primary hover:underline">
                        meum-diarium.schächner.de
                      </a>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Für allgemeine Anfragen nutzen Sie bitte die E-Mail-Adresse. Wir antworten in der Regel innerhalb weniger Werktage.
                  </p>
                </div>
              </div>
              {/* Disclaimer */}
              <div className="p-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-primary" />
                  Haftungsausschluss
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Haftung für Inhalte
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-3">
                      Sollten Ihnen Fehler auffallen, freuen wir uns über einen Hinweis, damit wir nachbessern können.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Haftung für Links
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-3">
                      Links werden sorgfältig ausgewählt, können sich aber jederzeit ändern.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      Urheberrecht
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-3">
                      Zitate sind im Rahmen des Zitatrechts möglich, sofern sie korrekt gekennzeichnet werden.
                    </p>
                  </div>
                </div>
              </div>
              {/* Educational Purpose */}
              <div className="p-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Scale className="w-6 h-6 text-primary" />
                  Zweck der Website
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Meum Diarium ist ein nicht-kommerzielles Bildungsprojekt zur Vermittlung römischer Geschichte. Die Inhalte basieren auf historischen Quellen und wissenschaftlicher Forschung. Alle dargestellten Tagebucheinträge sind fiktiv und dienen der didaktischen Aufbereitung historischer Ereignisse.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Wir wollen Geschichte nachvollziehbar machen: mit klaren Kontexten, Quellenbezug und einem modernen Zugang. Wenn dabei ein kleiner Schmunzler mitschwingt, ist das Absicht, aber die Fakten bleiben sauber.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Das Angebot richtet sich an Lernende, Lehrende und alle, die römische Geschichte verständlich und gut aufbereitet erleben möchten.
                </p>
              </div>
              {/* EU Dispute Resolution */}
              <div className="p-6 rounded-2xl bg-secondary/20 border border-border/40">
                <h2 className="text-xl font-bold mb-3">
                  EU-Streitschlichtung
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                  <a
                    href="https://ec.europa.eu/consumers/odr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    https://ec.europa.eu/consumers/odr
                  </a>
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
              {/* Links */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/privacy">
                  <div className="px-6 py-3 rounded-xl bg-card/40 border border-border/40 hover:border-primary/50 transition-colors text-center">
                    <Shield className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">Datenschutzerklärung</p>
                  </div>
                </Link>
                <Link to="/cookies">
                  <div className="px-6 py-3 rounded-xl bg-card/40 border border-border/40 hover:border-primary/50 transition-colors text-center">
                    <Globe className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium">Cookie-Richtlinien</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
