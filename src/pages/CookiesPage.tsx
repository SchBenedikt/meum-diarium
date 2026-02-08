import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { Cookie, CheckCircle2, XCircle, Settings, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Cookie-Richtlinien - Meum Diarium"
        description="Informationen zur Verwendung von Cookies auf Meum Diarium."
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
              COOKIE-RICHTLINIEN
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-bold tracking-tight">
              Cookie-<span className="text-primary italic">Richtlinien</span>
            </h1>
            <p className="text-muted-foreground/60 max-w-md font-light leading-relaxed">
              Wie wir Cookies auf dieser Website verwenden
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
              {/* Summary */}
              <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-xl font-bold mb-3 text-amber-700 dark:text-amber-400">
                      Kurzfassung
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Meum Diarium verwendet notwendige Cookies und Analyse-Cookies. Die notwendigen Cookies sichern Grundfunktionen wie Sprache und Theme. Die Analyse-Cookies helfen uns zu verstehen, welche Inhalte gelesen werden und wo wir nachbessern sollten. Keine Werbung, kein Datenhandel, kein heimliches Imperium.
                      Alles bleibt übersichtlich und auf den Zweck der Website beschränkt.
                    </p>
                  </div>
                </div>
              </div>
              {/* What are Cookies */}
              <div className="p-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Cookie className="w-6 h-6 text-primary" />
                  Was sind Cookies?
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Cookies sind kleine Textdateien, die auf Ihrem Gerät gespeichert werden, wenn Sie eine Website besuchen. Sie helfen der Website, sich an Ihre Einstellungen zu erinnern oder anonyme Nutzungsstatistiken zu erstellen. Kein Zauber, keine Spione, nur kleine Notizzettel.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Wir nutzen zudem Local Storage für Einstellungen wie Sprache und Theme. Das ist technisch ähnlich, aber kein klassisches Cookie. Beide Varianten können Sie im Browser verwalten.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Für Meum Diarium bedeutet das: schnelleres Laden, stabile Einstellungen und besseres Verständnis, welche Inhalte besonders hilfreich sind.
                </p>
              </div>
              {/* Cookie Types */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">
                  Welche Cookies verwenden wir?
                </h2>
                {/* Essential Cookies */}
                <div className="p-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Notwendige Cookies
                      </h3>
                      <Badge variant="outline" className="mb-3 text-xs">
                        Immer aktiv
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Diese Cookies sind für den Betrieb der Website unbedingt erforderlich und können nicht deaktiviert werden. Sie dienen ausschließlich technischen Zwecken.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Ohne diese Cookies kann die Seite grundlegende Funktionen wie Sprache oder Layout nicht zuverlässig speichern.
                  </p>
                  <div className="mt-6 space-y-4">
                    <div className="p-4 rounded-xl bg-secondary/20">
                      <h4 className="font-semibold mb-2 text-sm">
                        Präferenz-Speicherung
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Zweck: Speicherung Ihrer Sprachauswahl, Theme-Einstellungen und ausgewählten Autors
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Speicherort: Browser Local Storage
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/20">
                      <h4 className="font-semibold mb-2 text-sm">
                        Session-Cookies
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Zweck: Aufrechterhaltung Ihrer Sitzung während des Besuchs
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Gültigkeit: Bis zum Schließen des Browsers
                      </p>
                    </div>
                  </div>
                </div>
                {/* No Analytics */}
                <div className="p-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Analyse-Cookies
                      </h3>
                      <Badge variant="outline" className="mb-3 text-xs border-amber-500/30">
                        Wird verwendet
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Wir verwenden Analyse-Cookies zur Reichweitenmessung und Verbesserung der Inhalte. Erfasst werden z.B. Seitenaufrufe, Verweildauer, Gerätetypen und ungefähre Regionen. Wir suchen Muster, nicht Personen. Caesar zählte Legionen, wir zählen Seitenaufrufe.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Wenn Sie Analyse-Cookies deaktivieren, funktioniert die Website weiterhin, nur unsere Statistik wird weniger präzise.
                  </p>
                  <div className="mt-6 space-y-4">
                    <div className="p-4 rounded-xl bg-secondary/20">
                      <h4 className="font-semibold mb-2 text-sm">
                        Reichweitenmessung
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Zweck: Statistik, Fehlererkennung, Optimierung von Inhalten
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Gültigkeit: Variiert je nach Cookie, in der Regel wenige Tage bis Monate
                      </p>
                    </div>
                  </div>
                </div>
                {/* No Marketing */}
                <div className="p-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Marketing-Cookies
                      </h3>
                      <Badge variant="outline" className="mb-3 text-xs border-red-500/30">
                        Nicht verwendet
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Wir setzen keine Cookies für Marketingzwecke oder personalisierte Werbung ein. Keine Verfolger, keine Banner-Flut, keine Imperatoren im Werbenetzwerk.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Es gibt keine Profile, kein Retargeting und keine Weitergabe an Werbenetzwerke.
                  </p>
                </div>
              </div>
              {/* Cookie Control */}
              <div className="p-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Settings className="w-6 h-6 text-primary" />
                  Cookie-Einstellungen verwalten
                </h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Sie können Cookies in Ihren Browser-Einstellungen jederzeit verwalten, blockieren oder löschen:
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-none">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Chrome:</strong> Einstellungen → Datenschutz und Sicherheit → Cookies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Firefox:</strong> Einstellungen → Datenschutz & Sicherheit → Cookies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Safari:</strong> Einstellungen → Datenschutz → Cookies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Edge:</strong> Einstellungen → Cookies und Websiteberechtigungen</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-4 rounded-xl bg-secondary/20">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Hinweis:</strong>{' '}
                      Das Blockieren oder Löschen von Cookies kann dazu führen, dass Ihre Präferenzen (wie Sprache und Theme) nicht gespeichert werden.
                    </p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Cookie-Einstellungen gelten in der Regel pro Gerät und Browser. Wenn Sie mehrere Geräte nutzen, müssen die Einstellungen dort jeweils separat angepasst werden.
                  </p>
                </div>
              </div>
              {/* Updates */}
              <div className="p-6 rounded-2xl bg-secondary/20 border border-border/40">
                <h2 className="text-xl font-bold mb-3">
                  Änderungen an dieser Richtlinie
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Wir können diese Cookie-Richtlinien von Zeit zu Zeit aktualisieren. Änderungen werden auf dieser Seite veröffentlicht. Das Datum der letzten Aktualisierung finden Sie oben auf dieser Seite.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  Bei wesentlichen Änderungen ergänzen wir eine kurze Zusammenfassung, damit Sie die wichtigsten Punkte schnell erfassen.
                </p>
              </div>
              {/* Links */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/privacy">
                  <div className="px-6 py-3 rounded-xl bg-card/40 border border-border/40 hover:border-primary/50 transition-colors text-center">
                    <p className="text-sm font-medium">Datenschutzerklärung</p>
                  </div>
                </Link>
                <Link to="/legal">
                  <div className="px-6 py-3 rounded-xl bg-card/40 border border-border/40 hover:border-primary/50 transition-colors text-center">
                    <p className="text-sm font-medium">Impressum</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 pb-8">
          <p className="text-sm text-muted-foreground text-center">
            Stand: {new Date().toLocaleDateString('de-DE')}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
