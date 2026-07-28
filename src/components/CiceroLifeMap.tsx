import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, ScaleControl, TileLayer, Tooltip, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

interface MarkerPoint {
  title: string;
  note: string;
  description: string;
  position: [number, number];
  tone?: 'birth' | 'core' | 'death';
}

interface RouteSegment {
  id: string;
  label: string;
  color: string;
  points: [number, number][];
}

interface CiceroLifeMapProps {
  className?: string;
  mapHeightClass?: string;
}

const markerPoints: MarkerPoint[] = [
  {
    title: 'Arpinum',
    note: 'Geburtsort • 106 v. Chr.',
    description: 'Cicero wird in der Provinz geboren, fernab der römischen Senatsaristokratie.',
    position: [41.65, 13.61],
    tone: 'birth',
  },
  {
    title: 'Rom',
    note: 'Politisches Zentrum • 90–43 v. Chr.',
    description: 'Forum Romanum, Senat, Rednertribüne – Schauplatz seines gesamten Wirkens.',
    position: [41.9, 12.48],
    tone: 'core',
  },
  {
    title: 'Athen',
    note: 'Studium der Rhetorik • 79 v. Chr.',
    description: 'Studium bei Antiochos von Askalon und Demetrios.',
    position: [37.97, 23.72],
    tone: 'core',
  },
  {
    title: 'Rhodos',
    note: 'Rhetorikschule • 78 v. Chr.',
    description: 'Weiterbildung bei Molon von Rhodos.',
    position: [36.43, 28.21],
    tone: 'core',
  },
  {
    title: 'Lilybaeum',
    note: 'Quaestur auf Sizilien • 75 v. Chr.',
    description: 'Erste politische Station; Kampf gegen Korruption.',
    position: [37.8, 12.43],
    tone: 'core',
  },
  {
    title: 'Thessaloniki',
    note: 'Exil • 58–57 v. Chr.',
    description: 'Verbannt wegen der Hinrichtung der Catilinarier; schwere psychische Krise.',
    position: [40.64, 22.94],
    tone: 'core',
  },
  {
    title: 'Dyrrhachium',
    note: 'Exil-Station • 57 v. Chr.',
    description: 'Wartet auf die Rückberufung durch den Senat.',
    position: [41.32, 19.45],
    tone: 'core',
  },
  {
    title: 'Tarsus',
    note: 'Prokonsulat in Kilikien • 51 v. Chr.',
    description: 'Statthalterschaft als Provinzgouverneur.',
    position: [36.92, 34.9],
    tone: 'core',
  },
  {
    title: 'Tusculum',
    note: 'Landvilla • 60–44 v. Chr.',
    description: 'Hier entstehen De re publica, De legibus, De natura deorum, Tusculanae disputationes.',
    position: [41.8, 12.72],
    tone: 'core',
  },
  {
    title: 'Formiae',
    note: 'Ermordung • 7. Dez. 43 v. Chr.',
    description: 'Von Häschern des Antonius gestellt und auf der Flucht getötet – Kopf und Hände in Rom zur Schau gestellt.',
    position: [41.26, 13.61],
    tone: 'death',
  },
];

const routeSegments: RouteSegment[] = [
  {
    id: 'ausbildung',
    label: 'Ausbildung (79–78)',
    color: '#7c3aed',
    points: [
      [41.65, 13.61],
      [41.9, 12.48],
      [37.97, 23.72],
      [36.43, 28.21],
    ],
  },
  {
    id: 'politischer-aufstieg',
    label: 'Politischer Aufstieg (75)',
    color: '#ea580c',
    points: [
      [41.9, 12.48],
      [37.8, 12.43],
      [41.9, 12.48],
    ],
  },
  {
    id: 'exil-rueckkehr',
    label: 'Exil & Rückkehr (58–57)',
    color: '#dc2626',
    points: [
      [41.9, 12.48],
      [40.64, 22.94],
      [41.32, 19.45],
      [41.9, 12.48],
    ],
  },
  {
    id: 'statthalterschaft',
    label: 'Statthalterschaft (51)',
    color: '#2563eb',
    points: [
      [41.9, 12.48],
      [36.92, 34.9],
      [41.9, 12.48],
    ],
  },
  {
    id: 'niedergang-tod',
    label: 'Niedergang & Tod (60–43)',
    color: '#525252',
    points: [
      [41.9, 12.48],
      [41.8, 12.72],
      [41.26, 13.61],
    ],
  },
];

export default function CiceroLifeMap({ className = '', mapHeightClass = 'h-[420px]' }: CiceroLifeMapProps) {
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
      [Math.min(...lats) - 3, Math.min(...lngs) - 5],
      [Math.max(...lats) + 3, Math.max(...lngs) + 5],
    ] as L.LatLngBoundsExpression;
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
          Ciceros Lebensstationen (106–43 v. Chr.)
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Schlüsselpunkte seines privaten & politischen Wegs
        </p>
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
        {routeSegments.map((segment) => (
          <Polyline
            key={segment.id}
            positions={segment.points}
            pathOptions={{
              color: segment.color,
              weight: 6,
              opacity: 0.9,
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
              color: point.tone === 'birth' ? '#16a34a' : point.tone === 'death' ? '#dc2626' : '#6366f1',
              fillColor: point.tone === 'birth' ? '#4ade80' : point.tone === 'death' ? '#f87171' : '#818cf8',
              fillOpacity: 0.9,
              weight: 3.5,
              opacity: 1,
            }}
          >
            <Popup maxWidth={300} minWidth={220} className="campaign-popup">
              <div className="text-sm p-2">
                <div className="font-bold text-foreground mb-2 text-base border-b-2 border-primary/30 pb-2">{point.title}</div>
                <div className="text-[13px] text-foreground/90 leading-relaxed font-medium">{point.note}</div>
                <div className="text-xs text-muted-foreground/80 mt-2 pt-2 border-t border-border/20 italic">{point.description}</div>
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
          <div>
            <div className="text-xs font-bold text-primary/90 mb-3 uppercase tracking-widest flex items-center gap-2">
              <span className="h-px flex-1 bg-primary/20" />
              Lebensabschnitte
              <span className="h-px flex-1 bg-primary/20" />
            </div>
            <div className="flex flex-wrap gap-2">
              {legend.map((item) => (
                <div key={item.id} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card/80 border border-border/60 hover:border-primary/40 hover:bg-card transition-all shadow-sm hover:shadow-md">
                  <span className="h-3.5 w-10 rounded-full shadow-inner" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-foreground text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-primary/90 mb-3 uppercase tracking-widest flex items-center gap-2">
              <span className="h-px flex-1 bg-primary/20" />
              Ortstypen
              <span className="h-px flex-1 bg-primary/20" />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card/80 border border-border/60 hover:bg-card transition-all shadow-sm">
                <div className="h-4 w-4 rounded-full bg-green-400 border-[3px] border-green-600 shadow-md" />
                <span className="font-semibold text-foreground text-xs">Geburtsort</span>
              </div>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card/80 border border-border/60 hover:bg-card transition-all shadow-sm">
                <div className="h-4 w-4 rounded-full bg-indigo-400 border-[3px] border-indigo-600 shadow-md" />
                <span className="font-semibold text-foreground text-xs">Lebensstation</span>
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
