import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, ScaleControl, TileLayer, Tooltip, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

interface MarkerPoint {
  title: string;
  note: string;
  position: [number, number];
  tone?: 'core' | 'sea' | 'siege';
}

interface RouteSegment {
  id: string;
  label: string;
  color: string;
  points: [number, number][];
  dashed?: boolean;
}

interface CaesarCampaignMapProps {
  className?: string;
  mapHeightClass?: string;
}

const markerPoints: MarkerPoint[] = [
  { title: 'Rhône & Helvetier', note: '58 v. Chr. – Aufhalten der Helvetier, Tor nach Gallien', position: [46.2, 6.1] },
  { title: 'Gergovia', note: '52 v. Chr. – Rückschlag gegen Vercingetorix', position: [45.77, 3.1] },
  { title: 'Alesia', note: '52 v. Chr. – Doppelwall-Belagerung, Wendepunkt im Gallischen Krieg', position: [47.52, 4.34] },
  { title: 'Bibracte', note: '58 v. Chr. – Sieg über die Helvetier', position: [46.95, 4.3] },
  { title: 'Avaricum', note: '52 v. Chr. – Belagerung, ca. 40k Tote', position: [47.08, 2.4], tone: 'siege' },
  { title: 'Rheinbrücke', note: '55/53 v. Chr. – Machtdemonstration Richtung Germanien', position: [50.35, 7.6] },
  { title: 'Dover (Britannien)', note: '55/54 v. Chr. – Erste römische Landung auf der Insel', position: [51.13, 1.3] },
  { title: 'Massilia', note: '49 v. Chr. – Seeblockade im Bürgerkrieg', position: [43.29, 5.37], tone: 'sea' },
  { title: 'Brundisium', note: '49 v. Chr. – Übergang nach Epirus', position: [40.64, 17.94], tone: 'sea' },
  { title: 'Dyrrhachium', note: '48 v. Chr. – Rückschlag gegen Pompeius', position: [41.32, 19.45] },
  { title: 'Pharsalos', note: '48 v. Chr. – Entscheidungsschlacht gegen Pompeius', position: [39.28, 22.37] },
  { title: 'Zela', note: '47 v. Chr. – „Veni, vidi, vici“', position: [40.0, 36.1] },
  { title: 'Ilerda', note: '49 v. Chr. – Bürgerkrieg, Sicherung Hispaniens', position: [41.62, -0.62] },
  { title: 'Thapsus', note: '46 v. Chr. – Niederlage der Pompeianer in Afrika', position: [36.4, 10.6] },
  { title: 'Munda', note: '45 v. Chr. – Letzte große Schlacht gegen die Optimaten', position: [37.3, -4.9] },
  { title: 'Alexandria', note: '48/47 v. Chr. – Bündnis mit Kleopatra, Flottenkampf', position: [31.21, 29.9] },
];

const routeSegments: RouteSegment[] = [
  {
    id: 'gallia',
    label: 'Gallischer Krieg',
    color: '#d9480f',
    points: [
      [43.6, 3.9],
      [46.2, 6.1],
      [46.95, 4.3],
      [47.52, 4.34],
      [45.77, 3.1],
      [50.35, 7.6],
    ],
  },
  {
    id: 'rhine',
    label: 'Rheinbrücken',
    color: '#9a3412',
    points: [
      [48.9, 7.0],
      [50.35, 7.6],
    ],
  },
  {
    id: 'britannia',
    label: 'Britannien-Expedition',
    color: '#0f172a',
    points: [
      [50.96, 1.85],
      [51.13, 1.3],
    ],
    dashed: true,
  },
  {
    id: 'civil',
    label: 'Bürgerkrieg',
    color: '#2563eb',
    points: [
      [41.62, -0.62],
      [37.3, -4.9],
      [36.4, 10.6],
      [31.21, 29.9],
    ],
  },
  {
    id: 'pompeius',
    label: 'Gegen Pompeius',
    color: '#8b5cf6',
    points: [
      [40.64, 17.94],
      [41.32, 19.45],
      [39.28, 22.37],
      [40.0, 36.1],
    ],
    dashed: true,
  },
  {
    id: 'med',
    label: 'Seerouten',
    color: '#0891b2',
    points: [
      [43.29, 5.37],
      [40.64, 17.94],
      [41.32, 19.45],
      [31.21, 29.9],
    ],
    dashed: true,
  },
];

export default function CaesarCampaignMap({ className = '', mapHeightClass = 'h-[420px]' }: CaesarCampaignMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const legend = useMemo(() => routeSegments.map((segment) => ({ id: segment.id, label: segment.label, color: segment.color, dashed: segment.dashed })), []);

  const mapBounds = useMemo(() => {
    const coords: [number, number][] = [];
    markerPoints.forEach((p) => coords.push(p.position));
    routeSegments.forEach((seg) => seg.points.forEach((pt) => coords.push(pt)));
    if (!coords.length) return undefined;
    const lats = coords.map((c) => c[0]);
    const lngs = coords.map((c) => c[1]);
    return [
      [Math.min(...lats) - 2, Math.min(...lngs) - 4],
      [Math.max(...lats) + 2, Math.max(...lngs) + 4],
    ] as L.LatLngBoundsExpression;
  }, []);

  if (!isClient) {
    return <div className={`${mapHeightClass} w-full rounded-3xl bg-card/60 border border-border/40 animate-pulse`} />;
  }

  return (
    <div className={`rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden ${className}`}>
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
              weight: 4,
              opacity: 0.9,
              dashArray: segment.dashed ? '10 10' : '6 2',
              lineJoin: 'round',
              lineCap: 'round',
            }}
          />
        ))}
        {markerPoints.map((point) => (
          <CircleMarker
            key={point.title}
            center={point.position}
            radius={7}
            pathOptions={{
              color: point.tone === 'siege' ? '#f59e0b' : point.tone === 'sea' ? '#0ea5e9' : '#ef4444',
              fillColor: point.tone === 'siege' ? '#fbbf24' : point.tone === 'sea' ? '#38bdf8' : '#f87171',
              fillOpacity: 0.75,
              weight: 2.5,
              opacity: 1,
            }}
          >
            <Popup>
              <div className="text-sm font-semibold text-foreground mb-1">{point.title}</div>
              <div className="text-xs text-foreground/80">{point.note}</div>
            </Popup>
            <Tooltip direction="top" offset={[0, -8]} opacity={0.95} permanent={false}>
              <span className="text-[11px] font-bold">{point.title}</span>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
      <div className="p-4 border-t border-border/40 bg-background/60 flex flex-wrap gap-3 text-xs text-muted-foreground">
        {legend.map((item) => (
          <div key={item.id} className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-card border border-border/50">
            <span
              className="h-2 w-6 rounded-full"
              style={{
                backgroundColor: item.color,
                backgroundImage: item.dashed ? 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255,255,255,0.6) 4px, rgba(255,255,255,0.6) 8px)' : undefined,
              }}
            />
            <span className="font-semibold text-foreground/80">{item.label}</span>
          </div>
        ))}
        <div className="ml-auto text-[11px] text-foreground/60">Karte: OSM/Carto, sepia getönt</div>
      </div>
    </div>
  );
}
