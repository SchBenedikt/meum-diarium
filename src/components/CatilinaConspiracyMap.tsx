import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, ScaleControl, TileLayer, Tooltip, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

interface MarkerPoint {
  title: string;
  note: string;
  description: string;
  position: [number, number];
  tone?: 'core' | 'siege' | 'death';
}

interface RouteSegment {
  id: string;
  label: string;
  color: string;
  points: [number, number][];
  dashed?: boolean;
}

interface CatilinaConspiracyMapProps {
  className?: string;
  mapHeightClass?: string;
}

const allMarkerPoints: MarkerPoint[] = [
  {
    title: 'Rom',
    note: 'Zentrum der Verschwörung • 63 v. Chr.',
    description: 'Catilina bewirbt sich erfolglos ums Konsulat. Cicero vereitelt den Anschlag im Senat (›Quo usque tandem‹).',
    position: [41.90, 12.48], tone: 'core',
  },
  {
    title: 'Faesulae (Fiesole)',
    note: 'Catilinas Heerlager • 63 v. Chr.',
    description: 'Gaius Manlius stellt hier im Auftrag Catilinas ein Heer aus verarmten Sullanern auf. Ausgangspunkt des bewaffneten Aufstands.',
    position: [43.80, 11.29], tone: 'core',
  },
  {
    title: 'Pistoria (Pistoia)',
    note: 'Endschlacht • Jan. 62 v. Chr.',
    description: 'Catilina fällt mit seinen Getreuen im Kampf gegen die Truppen des Antonius Hybrida. Ende der Verschwörung.',
    position: [43.93, 10.91], tone: 'death',
  },
  {
    title: 'Arretium (Arezzo)',
    note: "Manlius' Vorhut • Herbst 63 v. Chr.",
    description: 'Strategischer Vorposten der Aufständischen in Etrurien.',
    position: [43.46, 11.88], tone: 'siege',
  },
  {
    title: 'Pons Mulvius',
    note: 'Milvische Brücke • 3. Dez. 63 v. Chr.',
    description: 'Hier fangen Ciceros Leute die Gesandten der Allobroger ab. Entscheidender Beweis für die Verschwörung.',
    position: [41.93, 12.47], tone: 'siege',
  },
];

const allRouteSegments: RouteSegment[] = [
  {
    id: 'catilina-weg',
    label: 'Catilinas Weg',
    color: '#dc2626',
    points: [
      [41.90, 12.48],
      [43.80, 11.29],
      [43.93, 10.91],
    ],
  },
  {
    id: 'cicero-op',
    label: 'Ciceros Operationen',
    color: '#2563eb',
    points: [
      [41.90, 12.48],
      [41.93, 12.47],
      [43.46, 11.88],
    ],
  },
];

export default function CatilinaConspiracyMap({ className = '', mapHeightClass = 'h-[420px]' }: CatilinaConspiracyMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  const mapBounds = useMemo(() => {
    const coords: [number, number][] = [];
    allMarkerPoints.forEach(p => coords.push(p.position));
    allRouteSegments.forEach(seg => seg.points.forEach(pt => coords.push(pt)));
    const lats = coords.map(c => c[0]);
    const lngs = coords.map(c => c[1]);
    return [
      [Math.min(...lats) - 1, Math.min(...lngs) - 1.5],
      [Math.max(...lats) + 1, Math.max(...lngs) + 1.5],
    ] as L.LatLngBoundsExpression;
  }, []);

  const toneColor = (tone?: 'core' | 'siege' | 'death') => {
    switch (tone) {
      case 'siege': return { border: '#d97706', fill: '#fbbf24' };
      case 'death': return { border: '#4a0404', fill: '#78716c' };
      default: return { border: '#dc2626', fill: '#f87171' };
    }
  };

  if (!isClient) {
    return <div className={`${mapHeightClass} w-full rounded-3xl bg-card/60 border border-border/40 animate-pulse`} />;
  }

  return (
    <div className={`card-modern overflow-hidden shadow-xl ${className}`}>
      <div className="bg-gradient-to-br from-primary/5 via-background to-background/50 p-4 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <span aria-hidden="true" className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-base leading-none">
                🗺️
              </span>
              Catilinas Verschwörung (63–62 v. Chr.)
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {allMarkerPoints.length} Schauplätze • Die Schauplätze der Krise, die Rom erschütterte
            </p>
          </div>
        </div>
      </div>

      <MapContainer
        bounds={mapBounds}
        maxBounds={mapBounds}
        maxBoundsViscosity={0.8}
        minZoom={3}
        maxZoom={9}
        scrollWheelZoom
        zoomControl={false}
        className={`w-full ${mapHeightClass} antique-map`}
        preferCanvas
        worldCopyJump
      >
        <ZoomControl position="topright" />
        <ScaleControl position="bottomleft" imperial={false} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution="© OpenStreetMap, © Carto"
        />
        {allRouteSegments.map(segment => (
          <Polyline
            key={segment.id}
            positions={segment.points}
            pathOptions={{
              color: segment.color,
              weight: 6,
              opacity: 0.9,
              dashArray: segment.dashed ? '15 10' : undefined,
              lineJoin: 'round',
              lineCap: 'round',
            }}
          >
            <Tooltip sticky permanent={false} direction="center" opacity={0.97} className="!bg-background/95 !border-2 !border-primary/40 !rounded-lg !shadow-xl">
              <div className="text-xs font-bold text-foreground px-1">{segment.label}</div>
            </Tooltip>
          </Polyline>
        ))}
        {allMarkerPoints.map(point => {
          const tc = toneColor(point.tone);
          return (
            <CircleMarker
              key={point.title}
              center={point.position}
              radius={9}
              pathOptions={{
                color: tc.border,
                fillColor: tc.fill,
                fillOpacity: 0.9,
                weight: 3.5,
                opacity: 1,
              }}
            >
              <Popup maxWidth={320} minWidth={240} className="campaign-popup">
                <div className="text-sm p-2">
                  <div className="font-bold text-foreground mb-1 text-base border-b-2 border-primary/30 pb-2">{point.title}</div>
                  <div className="text-[13px] text-primary font-semibold mt-2 mb-1.5">{point.note}</div>
                  <div className="text-[13px] text-foreground/80 leading-relaxed">{point.description}</div>
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
          );
        })}
      </MapContainer>

      <div className="p-5 border-t border-border/40 bg-gradient-to-br from-background via-background/90 to-card/30">
        <div className="flex flex-col gap-5">
          <div>
            <div className="text-xs font-bold text-primary/90 mb-3 uppercase tracking-widest flex items-center gap-2">
              <span className="h-px flex-1 bg-primary/20" />
              Routen
              <span className="h-px flex-1 bg-primary/20" />
            </div>
            <div className="flex flex-wrap gap-2">
              {allRouteSegments.map(item => (
                <div key={item.id} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card/80 border border-border/60 hover:border-primary/40 hover:bg-card transition-all shadow-sm hover:shadow-md">
                  <span
                    className="h-3.5 w-10 rounded-full shadow-inner"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-semibold text-foreground text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-primary/90 mb-3 uppercase tracking-widest flex items-center gap-2">
              <span className="h-px flex-1 bg-primary/20" />
              Ereignistypen
              <span className="h-px flex-1 bg-primary/20" />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card/80 border border-border/60 hover:bg-card transition-all shadow-sm">
                <div className="h-4 w-4 rounded-full bg-red-400 border-[3px] border-red-600 shadow-md" />
                <span className="font-semibold text-foreground text-xs">Zentrale Schauplätze</span>
              </div>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card/80 border border-border/60 hover:bg-card transition-all shadow-sm">
                <div className="h-4 w-4 rounded-full bg-amber-300 border-[3px] border-amber-600 shadow-md" />
                <span className="font-semibold text-foreground text-xs">Schlüsselorte</span>
              </div>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card/80 border border-border/60 hover:bg-card transition-all shadow-sm">
                <div className="h-4 w-4 rounded-full bg-stone-400 border-[3px] border-stone-800 shadow-md" />
                <span className="font-semibold text-foreground text-xs">Endpunkte</span>
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
