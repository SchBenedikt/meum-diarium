import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Shield, Mail, Users, AlertTriangle } from 'lucide-react';

export default function AgbPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Allgemeine Geschäftsbedingungen"
        description="AGB von Meum Diarium - Lateinische Literatur und Lernplattform"
        noIndex={true}
      />
      
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-20 sm:py-24 md:py-28">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-4">
              Allgemeine Geschäftsbedingungen
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gültig ab dem 1. Januar 2024 für die Nutzung von Meum Diarium
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Einleitung */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  1. Einleitung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Willkommen bei Meum Diarium! Diese Allgemeinen Geschäftsbedingungen (AGB) 
                  regeln die Nutzung unserer Online-Plattform für lateinische Literatur und Lerninhalte. 
                  Durch die Nutzung unserer Dienste erklären Sie sich mit diesen Bedingungen einverstanden.
                </p>
                <p>
                  Meum Diarium wird betrieben von:
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium">Meum Diarium</p>
                  <p className="text-sm text-muted-foreground">
                    Plattform für lateinische Literatur<br />
                    Digitale Bildungslösungen
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Geltungsbereich */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  2. Geltungsbereich
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Diese AGB gelten für alle Nutzer der Meum Diarium Plattform, unabhängig davon, 
                  ob sie kostenlos oder kostenpflichtige Dienste nutzen.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Zugang auf lateinische Texte und Lernmaterialien</li>
                  <li>Kommentarfunktionen und Community-Features</li>
                  <li>Personalisierte Lernfortschritts-Tracking</li>
                  <li>Alle zukünftigen Funktionen und Dienste</li>
                </ul>
              </CardContent>
            </Card>

            {/* Registrierung und Konto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  3. Registrierung und Konto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold">3.1 Registrierung</h3>
                <p>
                  Die Registrierung auf Meum Diarium ist freiwillig und kostenlos. 
                  Für die Registrierung müssen Sie gültige und vollständige Angaben machen.
                </p>
                
                <h3 className="font-semibold">3.2 Pflichtangaben</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Gültige E-Mail-Adresse</li>
                  <li>Benutzername (mindestens 3 Zeichen)</li>
                  <li>Passwort (mindestens 8 Zeichen)</li>
                </ul>
                
                <h3 className="font-semibold">3.3 Konto-Sicherheit</h3>
                <p>
                  Sie sind verantwortlich für die Geheimhaltung Ihrer Zugangsdaten. 
                  Teilen Sie Ihre Zugangsdaten nicht mit Dritten und informieren Sie uns 
                  unverzüglich bei Verdacht auf unberechtigte Nutzung.
                </p>
              </CardContent>
            </Card>

            {/* Nutzungsrechte */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  4. Nutzungsrechte und -pflichten
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold">4.1 Erlaubte Nutzungen</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Lesen und Lernen der bereitgestellten Inhalte</li>
                  <li>Erstellen von Kommentaren und Diskussionen</li>
                  <li>Persönliche Nutzung der Lernfortschritts-Tools</li>
                  <li>Teilen von Inhalten über unsere Social-Media-Funktionen</li>
                </ul>
                
                <h3 className="font-semibold">4.2 Verbotene Nutzungen</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Kopieren, Vervielfältigen oder Verbreiten von Inhalten</li>
                  <li>Gewerbliche Nutzung ohne ausdrückliche Genehmigung</li>
                  <li>Veröffentlichung rechtswidriger oder beleidigender Inhalte</li>
                  <li>Technische Manipulation der Plattform</li>
                  <li>Erstellung von Fake-Konten oder Identitätsmissbrauch</li>
                </ul>
              </CardContent>
            </Card>

            {/* Inhalte und Urheberrecht */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  5. Inhalte und Urheberrecht
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Alle auf Meum Diarium bereitgestellten Texte und Inhalte unterliegen 
                  dem jeweiligen Urheberrecht. Die Plattform dient ausschließlich zu 
                  Bildungszwecken und privatem Studium.
                </p>
                
                <h3 className="font-semibold">5.1 Lateinische Texte</h3>
                <p>
                  Die lateinischen Texte sind gemeinfrei oder unterliegen den jeweiligen 
                  Urheberrechten. Wir bemühen uns um die korrekte Kennzeichnung der Quellen.
                </p>
                
                <h3 className="font-semibold">5.2 Benutzergenerierte Inhalte</h3>
                <p>
                  Kommentare und andere von Benutzern erstellte Inhalte bleiben das 
                  geistige Eigentum der jeweiligen Nutzer. Durch das Hochladen 
                  räumen Sie uns das Recht ein, diese Inhalte auf der Plattform zu zeigen.
                </p>
              </CardContent>
            </Card>

            {/* Haftungsausschluss */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  6. Haftungsausschluss
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Wir übernehmen keine Gewähr für die Richtigkeit, Vollständigkeit oder 
                  Aktualität der bereitgestellten Informationen. Die Nutzung erfolgt auf 
                  eigenes Risiko.
                </p>
                
                <h3 className="font-semibold">6.1 Externe Links</h3>
                <p>
                  Unsere Plattform enthält Links zu externen Webseiten. Wir haben keinen 
                  Einfluss auf den Inhalt dieser Seiten und übernehmen keine Haftung dafür.
                </p>
                
                <h3 className="font-semibold">6.2 Verfügbarkeit</h3>
                <p>
                  Wir bemühen uns um eine stabile Verfügbarkeit der Plattform, können 
                  aber keine lückenlose Funktionsfähigkeit garantieren.
                </p>
              </CardContent>
            </Card>

            {/* Datenschutz */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  7. Datenschutz
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Der Schutz Ihrer persönlichen Daten ist uns wichtig. Details zur 
                  Datenverarbeitung finden Sie in unserer separaten 
                  <Link to="/privacy" className="text-primary hover:underline ml-1">
                    Datenschutzbestimmung
                  </Link>.
                </p>
                
                <h3 className="font-semibold">7.1 Erhobene Daten</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Name und E-Mail-Adresse (bei Registrierung)</li>
                  <li>Lernfortschritte und Nutzungsdaten</li>
                  <li>Kommentare und Community-Aktivitäten</li>
                  <li>Technische Nutzungsdaten (IP-Adresse, Browser etc.)</li>
                </ul>
              </CardContent>
            </Card>

            {/* Änderungen der AGB */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  8. Änderungen der AGB
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Wir behalten uns vor, diese AGB jederzeit zu ändern. Änderungen werden 
                  auf der Plattform bekannt gegeben und treten 14 Tage nach der 
                  Bekanntgabe in Kraft.
                </p>
                <p>
                  Die fortgesetzte Nutzung der Plattform nach Änderungen gilt als 
                  Zustimmung zu den neuen Bedingungen.
                </p>
              </CardContent>
            </Card>

            {/* Kontakt */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  9. Kontakt und Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Bei Fragen zu diesen AGB oder zur Nutzung der Plattform können Sie 
                  uns jederzeit kontaktieren:
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium">Kontakt:</p>
                  <p className="text-sm text-muted-foreground">
                    E-Mail: support@meum-diarium.de<br />
                    Plattform: Meum Diarium
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Schlussbestimmungen */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  10. Schlussbestimmungen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Sollten einzelne Bestimmungen dieser AGB unwirksam oder undurchführbar sein, 
                  bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
                </p>
                <p>
                  Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss 
                  internationaler Privatrechtsnormen.
                </p>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Stand: 9. Februar 2026<br />
                    Version: 1.0
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
