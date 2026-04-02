import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, Code, ExternalLink, Search } from 'lucide-react';
import { SEO } from '@/components/SEO';

type SchemaType = {
  '@type': string;
  [key: string]: unknown;
};

export default function SchemaOrgDocPage() {
  const [schemas, setSchemas] = useState<SchemaType[]>([]);

  useEffect(() => {
    // Extract all schema.org JSON-LD from the page
    const extractSchemas = () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      const foundSchemas: SchemaType[] = [];

      scripts.forEach(script => {
        try {
          const data = JSON.parse(script.textContent || '');
          if (data['@type']) {
            foundSchemas.push(data);
          }
        } catch (e) {
          console.error('Failed to parse schema:', e);
        }
      });

      setSchemas(foundSchemas);
    };

    extractSchemas();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Schema.org Dokumentation"
        description="Vollständige Dokumentation der Schema.org-Implementierung für strukturierte Daten auf Meum Diarium"
        type="website"
      />

      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/5 to-background py-16 sm:py-20">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück
              </Button>
            </Link>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Schema.org Implementierung
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Meum Diarium nutzt strukturierte Daten nach Schema.org-Standards für optimale Suchmaschinenoptimierung
              und Rich Snippets in den Suchergebnissen.
            </p>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-12">
          {/* Overview Section */}
          <section className="mb-16">
            <h2 className="font-display text-3xl font-bold mb-6">Übersicht</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Schema.org ist ein gemeinsames Vokabular für strukturierte Daten im Web, unterstützt von Google,
                  Microsoft, Yahoo und Yandex. Durch die Implementierung von Schema.org-Markup helfen wir Suchmaschinen,
                  unsere Inhalte besser zu verstehen und anzuzeigen.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="secondary" className="gap-1">
                    <Check className="h-3 w-3" />
                    BlogPosting
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Check className="h-3 w-3" />
                    WebSite
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Check className="h-3 w-3" />
                    Person
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Check className="h-3 w-3" />
                    Organization
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Check className="h-3 w-3" />
                    SearchAction
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Implementation Details */}
          <section className="mb-16">
            <h2 className="font-display text-3xl font-bold mb-6">Implementierte Schema-Typen</h2>

            <div className="space-y-6">
              {/* WebSite Schema */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    WebSite Schema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Grundlegendes Schema für die gesamte Website, implementiert auf allen Seiten.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Enthaltene Eigenschaften:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">name</code> - Name der Website</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">url</code> - Basis-URL</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">description</code> - Beschreibung</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">inLanguage</code> - Sprache (de-DE, en-US, la)</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">potentialAction</code> - SearchAction für Suchfunktion</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">publisher</code> - Organization mit Logo</li>
                    </ul>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-xs">
{`{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Meum Diarium",
  "url": "https://meum-diarium.xn--schchner-2za.de",
  "inLanguage": "de-DE",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://.../?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* BlogPosting Schema */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    BlogPosting Schema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Detailliertes Schema für Blog-Beiträge mit Autor, Veröffentlichungsdatum und Interaktionsstatistiken.
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Enthaltene Eigenschaften:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">headline</code> - Titel des Beitrags</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">description</code> - Kurzbeschreibung</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">articleBody</code> - Vollständiger Inhalt</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">wordCount</code> - Wortzahl</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">author</code> - Person-Schema des Autors</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">publisher</code> - Organization mit Logo</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">datePublished</code> - Veröffentlichungsdatum</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">dateModified</code> - Änderungsdatum</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">commentCount</code> - Anzahl Kommentare</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">interactionStatistic</code> - Interaktionsstatistiken</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">mainEntityOfPage</code> - WebPage-Referenz</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">about</code> - Thematische Klassifizierung</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">keywords</code> - Schlagwörter</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">inLanguage</code> - Sprache des Inhalts</li>
                      <li><code className="text-xs bg-muted px-1 py-0.5 rounded">isAccessibleForFree</code> - Kostenloser Zugang</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Organization Schema */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Organization Schema (Publisher)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Informationen über den Herausgeber der Inhalte.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-xs">
{`{
  "@type": "Organization",
  "name": "Meum Diarium",
  "url": "https://meum-diarium.xn--schchner-2za.de",
  "logo": {
    "@type": "ImageObject",
    "url": "https://.../icons/favicon.svg",
    "width": 512,
    "height": 512
  }
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Testing & Validation */}
          <section className="mb-16">
            <h2 className="font-display text-3xl font-bold mb-6">Validierung & Testing</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  Du kannst die Schema.org-Implementierung mit folgenden Tools validieren:
                </p>
                <div className="space-y-3">
                  <a
                    href="https://search.google.com/test/rich-results"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Search className="h-4 w-4" />
                    Google Rich Results Test
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <a
                    href="https://validator.schema.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Check className="h-4 w-4" />
                    Schema.org Validator
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Current Page Schemas */}
          {schemas.length > 0 && (
            <section className="mb-16">
              <h2 className="font-display text-3xl font-bold mb-6">Schemas auf dieser Seite</h2>
              <div className="space-y-4">
                {schemas.map((schema, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {schema['@type']} Schema
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/50 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-xs">
                          {JSON.stringify(schema, null, 2)}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Implementation Guide */}
          <section>
            <h2 className="font-display text-3xl font-bold mb-6">Implementierungsrichtlinien</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Verwende die SEO-Komponente</h4>
                      <p className="text-sm text-muted-foreground">
                        Die <code className="bg-muted px-1 py-0.5 rounded">SEO</code>-Komponente verwaltet automatisch
                        Meta-Tags und strukturierte Daten. Übergebe <code className="bg-muted px-1 py-0.5 rounded">structuredData</code>
                        für benutzerdefinierte Schemas.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Folge Schema.org-Richtlinien</h4>
                      <p className="text-sm text-muted-foreground">
                        Verwende nur Eigenschaften, die im offiziellen Schema.org-Vokabular definiert sind.
                        Siehe <a href="https://schema.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">schema.org</a> für Details.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Teste regelmäßig</h4>
                      <p className="text-sm text-muted-foreground">
                        Validiere strukturierte Daten mit Google Rich Results Test nach jeder Änderung.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
