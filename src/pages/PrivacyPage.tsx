import { Footer } from '@/components/layout/Footer';
import { SEO } from '@/components/SEO';
import { Shield, Cookie, Lock, Eye, Mail, Server } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Datenschutzerklärung - Meum Diarium"
        description="Informationen zum Datenschutz und zur Verarbeitung personenbezogener Daten bei Meum Diarium."
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-24 overflow-hidden border-b border-border">
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[150px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[150px]" />
          </div>

          <div className="container mx-auto max-w-4xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <Badge variant="outline" className="mb-6 py-2 px-4 text-xs uppercase tracking-[0.2em]">
                <Shield className="mr-2 h-4 w-4" />
                Datenschutz
              </Badge>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
                Datenschutzerklärung
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Informationen zur Erhebung und Verarbeitung personenbezogener Daten
              </p>

              <p className="text-sm text-muted-foreground mt-4">
                Stand: {new Date().toLocaleDateString('de-DE')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-slate dark:prose-invert max-w-none"
            >
              {/* Introduction */}
              <div className="mb-12 p-6 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/40">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-3 mt-0">
                      Einleitung
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-0">
                      Der Schutz Ihrer persönlichen Daten ist uns wichtig. Diese Datenschutzerklärung erklärt in klaren Worten, welche Daten wir erheben, wofür wir sie brauchen und welche Rechte Sie haben. Kurz gesagt: Wir sammeln nur, was für einen stabilen Betrieb, eine gute Nutzererfahrung und eine nachvollziehbare Reichweitenmessung notwendig ist.
                    </p>
                  </div>
                </div>
              </div>

              {/* Responsible Party */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Mail className="w-6 h-6 text-primary" />
                  Verantwortliche Stelle
                </h2>
                <div className="p-6 rounded-2xl bg-secondary/20 border border-border/40">
                  <p className="mb-2"><strong>Meum Diarium</strong></p>
                  <p className="text-muted-foreground mb-0">
                    Kontakt siehe Impressum
                  </p>
                </div>
              </div>

              {/* Data Collection */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Server className="w-6 h-6 text-primary" />
                  Erhebung und Speicherung personenbezogener Daten
                </h2>
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-card/40 border border-border/40">
                    <h3 className="text-lg font-semibold mb-3">
                      Zugriffsdaten
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Bei jedem Zugriff auf unsere Website werden automatisch Informationen in Server-Logfiles gespeichert: IP-Adresse, Datum und Uhrzeit der Anfrage, Browsertyp und -version, verwendetes Betriebssystem, Referrer URL. Diese Daten werden zur Sicherstellung der Systemsicherheit und zur Fehleranalyse verwendet und nach 7 Tagen automatisch gelöscht.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-card/40 border border-border/40">
                    <h3 className="text-lg font-semibold mb-3">
                      Lokale Speicherung
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Wir verwenden den Local Storage Ihres Browsers zur Speicherung von Präferenzen (z.B. ausgewählter Autor, Sprache, Theme). Diese Daten werden ausschließlich lokal in Ihrem Browser gespeichert und nicht an unsere Server übertragen.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-card/40 border border-border/40">
                    <h3 className="text-lg font-semibold mb-3">
                      Reichweitenmessung
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Wir messen die Nutzung unserer Website, um Inhalte und Performance zu verbessern. Dabei verwenden wir Analyse-Cookies und erfassen z.B. Seitenaufrufe, Verweildauer, verwendete Endgeräte und ungefähre Standortregionen. Wir interessieren uns für Trends, nicht für einzelne Personen.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-card/40 border border-border/40">
                    <h3 className="text-lg font-semibold mb-3">
                      Kontakt per E-Mail
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Wenn Sie uns per E-Mail kontaktieren, verarbeiten wir die von Ihnen übermittelten Daten zur Bearbeitung der Anfrage. Diese Daten werden nicht ohne Ihre Zustimmung weitergegeben.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cookies */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Cookie className="w-6 h-6 text-primary" />
                  Cookies
                </h2>
                <div className="p-6 rounded-2xl bg-card/40 border border-border/40">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Diese Website verwendet technisch notwendige Cookies sowie Analyse-Cookies zur Reichweitenmessung. Die notwendigen Cookies sichern Kernfunktionen (z.B. Sprache und Theme). Die Analyse-Cookies helfen uns zu verstehen, welche Inhalte funktionieren und wo wir verbessern können.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-0">
                    Sie können Cookies in Ihren Browser-Einstellungen verwalten und jederzeit löschen. Wenn Sie Analyse-Cookies blockieren, funktioniert die Seite weiterhin, nur unsere Statistik wird etwas blinder (Caesar würde es vermutlich trotzdem als Triumph verkaufen).
                  </p>
                </div>
              </div>

              {/* Third Party Services */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Eye className="w-6 h-6 text-primary" />
                  Externe Dienste
                </h2>
                <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-card/40 border border-border/40">
                    <h3 className="text-lg font-semibold mb-3">
                      Externe Bilder
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-0">
                      Wir verwenden Bilder von Unsplash (unsplash.com). Beim Laden dieser Bilder kann Ihre IP-Adresse an Unsplash übermittelt werden. Weitere Informationen finden Sie in der Datenschutzerklärung von Unsplash.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-card/40 border border-border/40">
                    <h3 className="text-lg font-semibold mb-3">
                      Analyse und Statistik
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-0">
                      Wir nutzen eine Reichweitenmessung, um Inhalte zu verbessern und technische Probleme schneller zu erkennen. Dabei erfassen wir Nutzungsdaten in aggregierter Form. Keine Werbung, kein Verkauf von Daten, keine personalisierten Profile.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-primary" />
                  Rechtsgrundlagen in Kurzform
                </h2>
                <div className="p-6 rounded-2xl bg-card/40 border border-border/40">
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Betrieb der Website und Sicherheit: berechtigtes Interesse</li>
                    <li>• Speicherung von Präferenzen: berechtigtes Interesse</li>
                    <li>• Reichweitenmessung: berechtigtes Interesse</li>
                    <li>• Beantwortung von Anfragen: Vertragsanbahnung bzw. berechtigtes Interesse</li>
                  </ul>
                </div>
              </div>

              {/* User Rights */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-primary" />
                  Ihre Rechte
                </h2>
                <div className="p-6 rounded-2xl bg-card/40 border border-border/40">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Recht auf Auskunft über Ihre gespeicherten Daten</li>
                    <li>• Recht auf Berichtigung unrichtiger Daten</li>
                    <li>• Recht auf Löschung Ihrer Daten</li>
                    <li>• Recht auf Einschränkung der Verarbeitung</li>
                    <li>• Recht auf Datenübertragbarkeit</li>
                    <li>• Recht auf Widerspruch gegen die Verarbeitung</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4 mb-0">
                    Zur Ausübung dieser Rechte kontaktieren Sie uns bitte über die im Impressum angegebenen Kontaktdaten. Wenn es nur um Cookies geht, können Sie das auch direkt im Browser regeln. Caesar hätte dafür eine Verordnung erlassen, wir begnügen uns mit einem freundlichen Hinweis.
                  </p>
                </div>
              </div>

              {/* Changes */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4">
                  Änderungen dieser Datenschutzerklärung
                </h2>
                <div className="p-6 rounded-2xl bg-secondary/20 border border-border/40">
                  <p className="text-muted-foreground leading-relaxed mb-0">
                    Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte Rechtslagen oder bei Änderungen unseres Services anzupassen. Die jeweils aktuelle Datenschutzerklärung finden Sie stets auf dieser Seite.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
