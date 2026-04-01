import { NetworkGraph } from '@/components/NetworkGraph';
import { relationships, personNodes } from '@/data/relationships';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/layout/Footer';
import { Network } from 'lucide-react';

export default function RelationshipsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Beziehungsnetzwerk"
        description="Visualisierung der historischen Beziehungen zwischen den großen Persönlichkeiten des antiken Roms: Caesar, Cicero, Augustus, Seneca und Catilina."
        type="website"
      />

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Network className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Beziehungsnetzwerk
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Entdecke die komplexen Verbindungen zwischen den großen Persönlichkeiten des antiken Roms
            </p>
          </div>

          {/* Network Visualization */}
          <NetworkGraph nodes={personNodes} relationships={relationships} />

          {/* Additional Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border border-border rounded-lg bg-card">
              <h3 className="font-display text-lg font-semibold mb-2">
                Interaktiv
              </h3>
              <p className="text-sm text-muted-foreground">
                Ziehe die Knoten, um das Netzwerk zu erkunden. Klicke auf Personen oder Verbindungen für Details.
              </p>
            </div>

            <div className="p-6 border border-border rounded-lg bg-card">
              <h3 className="font-display text-lg font-semibold mb-2">
                Historisch Akkurat
              </h3>
              <p className="text-sm text-muted-foreground">
                Alle Beziehungen basieren auf historischen Quellen und dokumentierten Interaktionen.
              </p>
            </div>

            <div className="p-6 border border-border rounded-lg bg-card">
              <h3 className="font-display text-lg font-semibold mb-2">
                Dynamische Visualisierung
              </h3>
              <p className="text-sm text-muted-foreground">
                Die Darstellung nutzt physikbasierte Simulation für eine intuitive Anordnung.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
