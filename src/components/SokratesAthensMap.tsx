import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, ScaleControl, TileLayer, Tooltip, ZoomControl } from 'react-leaflet';

interface MarkerPoint {
  title: string;
  subtitle: string;
  note: string;
  position: [number, number];
  tone: 'core' | 'death';
}

interface RouteSegment {
  id: string;
  label: string;
  color: string;
  points: [number, number][];
}

interface SokratesAthensMapProps {
  className?: string;
  mapHeightClass?: string;
}

const markerPoints: MarkerPoint[] = [
  {
    title: 'Agora',
    subtitle: 'Zentrum des öffentlichen Lebens',
    note: 'Sokrates diskutiert täglich auf dem Marktplatz mit Bürgern, Händlern und Sophisten. Hier trifft er seine Gesprächspartner für Platons frühe Dialoge.',
    position: [37.975, 23.7225],
    tone: 'core',
  },
  {
    title: 'Stoa Basileios',
    subtitle: 'Königshalle',
    note: 'Hier wurde die Anklage gegen Sokrates (Asebie/Gottlosigkeit) erhoben. Treffpunkt des Archon Basileus.',
    position: [37.9754, 23.722],
    tone: 'core',
  },
  {
    title: 'Pnyx',
    subtitle: 'Volksversammlung',
    note: 'Die athenische Ekklesia tagt hier. Sokrates kritisiert die direkte Demokratie und die Wahl von Ämtern durch das Los.',
    position: [37.9715, 23.7195],
    tone: 'core',
  },
  {
    title: 'Areopag',
    subtitle: 'Ratshügel',
    note: 'Sitz des Areopag-Rats. Später Schauplatz von Paulus\' Rede (Apg 17), aber zu Sokrates\' Zeit für Blutgericht zuständig.',
    position: [37.972, 23.7235],
    tone: 'core',
  },
  {
    title: 'Kerameikos',
    subtitle: 'Töpferviertel & Friedhof',
    note: 'Hier liegt der Demos Kerameis. Durch das Doppeltor (Dipylon) betritt man die Stadt. Sokrates\' Schüler versammeln sich oft am Stadtrand.',
    position: [37.978, 23.718],
    tone: 'core',
  },
  {
    title: 'Gefängnis / Staatsgefängnis',
    subtitle: 'Staatsgefängnis von Athen',
    note: 'Sokrates verbringt seine letzten 30 Tage hier. Im ›Phaidon‹ schildert Platon seine letzte Stunde – den Tod durch den Schierlingsbecher.',
    position: [37.9705, 23.725],
    tone: 'death',
  },
  {
    title: 'Gerichtshof (Heliaia)',
    subtitle: 'Volksgericht',
    note: 'Das Schwurgericht der Heliaia – 501 Bürger stimmten 399 v. Chr. über Sokrates\' Schuld ab (280:221 für schuldig).',
    position: [37.974, 23.722],
    tone: 'core',
  },
  {
    title: 'Lykabettus',
    subtitle: 'Aussichtspunkt',
    note: 'Vom Hügel blickt man über ganz Athen. In Platons ›Euthydemos‹ erwähnt.',
    position: [37.982, 23.743],
    tone: 'core',
  },
  {
    title: 'Akropolis',
    subtitle: 'Heiliger Bezirk',
    note: 'Zentrum der athenischen Religion. Sokrates\' angebliche Missachtung der Stadtgötter war einer der Anklagepunkte.',
    position: [37.9715, 23.726],
    tone: 'core',
  },
];

const routeSegments: RouteSegment[] = [
  {
    id: 'sokrates-walk',
    label: 'Sokrates\' Athen • Spaziergang durch die antike Stadt',
    color: '#8b5cf6',
    points: [
      [37.978, 23.718],   // Kerameikos (Start)
      [37.9754, 23.722],  // Stoa Basileios
      [37.975, 23.7225],  // Agora
      [37.974, 23.722],   // Gerichtshof
      [37.9715, 23.7195], // Pnyx
      [37.972, 23.7235],  // Areopag
      [37.9715, 23.726],  // Akropolis
      [37.9705, 23.725],  // Gefängnis
      [37.982, 23.743],   // Lykabettus
      [37.978, 23.718],   // zurück zu Kerameikos
    ],
  },
];

export default function SokratesAthensMap({ className = '', mapHeightClass = 'h-[420px]' }: SokratesAthensMapProps) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const legend = useMemo(() => routeSegments.map((segment) => ({ id: segment.id, label: segment.label, color: segment.color })), []);
  const mapBounds = useMemo(() => {
    const coords: [number, number][] = [];
    markerPoints.forEach((p) => coords.push(p.position));
    routeSegments.forEach((seg) => seg.points.forEach((pt) => coords.push(pt)));
    if (!coords.length) return undefined;
    const lats = coords.map((c) => c[0]);
    const lngs = coords.map((c) => c[1]);
    return [
      [Math.min(...lats) - 0.008, Math.min(...lngs) - 0.012],
      [Math.max(...lats) + 0.008, Math.max(...lngs) + 0.012],
    ] as [[number, number], [number, number]];
  }, []);

  if (!isClient) {
    return <div className={`${mapHeightClass} w-full rounded-3xl bg-card/60 border border-border/40 animate-pulse`} />;
  }

  return (
    <div className={`card-modern overflow-hidden shadow-xl ${className}`}>
      <div className="bg-gradient-to-br from-primary/5 via-background to-background/50 p-4 border-b border-border/40">
        <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <span aria-hidden="true" className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            🏛️
          </span>
          Sokrates' Athen (5. Jh. v. Chr.)
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Die wichtigsten Schauplätze seines Lebens und Prozesses
        </p>
      </div>
      <MapContainer
        bounds={mapBounds}
        maxBounds={mapBounds}
        maxBoundsViscosity={0.8}
        minZoom={13}
        maxZoom={18}
        scrollWheelZoom
        zoomControl={false}
        className={`w-full ${mapHeightClass} antique-map`}
        preferCanvas
      >
        <ZoomControl position="topright" />
        <ScaleControl position="bottomleft" imperial={false} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="© OpenStreetMap, © Carto"
        />
        {routeSegments.map((segment) => (
          <Polyline
            key={segment.id}
            positions={segment.points}
            pathOptions={{
              color: segment.color,
              weight: 6,
              opacity: 0.9,
              dashArray: '10 8',
              lineJoin: 'round',
              lineCap: 'round',
            }}
          >
            <Tooltip sticky permanent={false} direction="center" opacity={0.97} className="!bg-background/95 !border-2 !border-primary/40 !rounded-lg !shadow-xl">
              <div className="text-xs font-bold text-foreground px-1">{segment.label}</div>
            </Tooltip>
          </Polyline>
        ))}
        {markerPoints.map((point) => (
          <CircleMarker
            key={point.title}
            center={point.position}
            radius={9}
            pathOptions={{
              color: point.tone === 'death' ? '#dc2626' : '#8b5cf6',
              fillColor: point.tone === 'death' ? '#f87171' : '#c084fc',
              fillOpacity: 0.9,
              weight: 3.5,
              opacity: 1,
            }}
          >
            <Popup maxWidth={300} minWidth={220} className="campaign-popup">
              <div className="text-sm p-2">
                <div className="font-bold text-foreground mb-1 text-base border-b-2 border-primary/30 pb-2">{point.title}</div>
                <div className="text-[12px] text-primary/80 font-semibold mb-1.5 italic">{point.subtitle}</div>
                <div className="text-[13px] text-foreground/90 leading-relaxed font-medium">{point.note}</div>
              </div>
            </Popup>
            <Tooltip
              direction="top"
              offset={[0, -12]}
              opacity={0.98}
              permanent={false}
              className="!bg-background/98 !border-2 !border-border/70 !rounded-lg !shadow-2xl !px-3 !py-1.5"
            >
              <span className="text-xs font-bold text-foreground">{point.title}</span>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
      <div className="p-5 border-t border-border/40 bg-gradient-to-br from-background via-background/90 to-card/30">
        <div className="flex flex-col gap-5">
          {/* Route */}
          <div>
            <div className="text-xs font-bold text-primary/90 mb-3 uppercase tracking-widest flex items-center gap-2">
              <span className="h-px flex-1 bg-primary/20" />
              Route
              <span className="h-px flex-1 bg-primary/20" />
            </div>
            <div className="flex flex-wrap gap-2">
              {legend.map((item) => (
                <div key={item.id} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card/80 border border-border/60 hover:border-primary/40 hover:bg-card transition-all shadow-sm hover:shadow-md">
                  <span
                    className="h-3.5 w-10 rounded-full shadow-inner"
                    style={{
                      backgroundColor: item.color,
                      backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(255,255,255,0.6) 6px, rgba(255,255,255,0.6) 12px)',
                    }}
                  />
                  <span className="font-semibold text-foreground text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Stationen */}
          <div>
            <div className="text-xs font-bold text-primary/90 mb-3 uppercase tracking-widest flex items-center gap-2">
              <span className="h-px flex-1 bg-primary/20" />
              Stationen
              <span className="h-px flex-1 bg-primary/20" />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card/80 border border-border/60 hover:bg-card transition-all shadow-sm">
                <div className="h-4 w-4 rounded-full bg-purple-400 border-[3px] border-purple-600 shadow-md" />
                <span className="font-semibold text-foreground text-xs">Lebensstationen</span>
              </div>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card/80 border border-border/60 hover:bg-card transition-all shadow-sm">
                <div className="h-4 w-4 rounded-full bg-red-400 border-[3px] border-red-600 shadow-md" />
                <span className="font-semibold text-foreground text-xs">Todesort</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-border/20 flex items-center justify-between text-[11px] text-muted-foreground/60">
          <span>Kartendaten: OpenStreetMap • CartoDB</span>
          <span>© {new Date().getFullYear()} Meum Diarium</span>
        </div>
      </div>
    </div>
  );
}
