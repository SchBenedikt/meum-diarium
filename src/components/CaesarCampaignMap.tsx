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
  // Gallischer Krieg (58-50 v. Chr.)
  { title: 'Helvetier-Schlacht', note: '58 v. Chr.\nErster großer Sieg\n130.000 Feinde aufgehalten', position: [46.2, 6.1] },
  { title: 'Bibracte', note: '58 v. Chr.\nVernichtende Niederlage der Helvetier\nTor nach Gallien', position: [46.95, 4.3] },
  { title: 'Rheinbrücke', note: '55/53 v. Chr.\nTechnisches Meisterwerk\nIn 10 Tagen erbaut, 400m Länge', position: [50.35, 7.6] },
  { title: 'Britannien', note: '55/54 v. Chr.\nErste römische Landung\n2 Expeditionen', position: [51.13, 1.3] },
  { title: 'Avaricum', note: '52 v. Chr.\n25 Tage Belagerung\n40.000 Tote', position: [47.08, 2.4], tone: 'siege' },
  { title: 'Gergovia', note: '52 v. Chr.\nCaesars Niederlage\n700 Legionäre gefallen', position: [45.77, 3.1] },
  { title: 'Alesia', note: '52 v. Chr.\nWendepunkt\n11 km Doppelwall, Vercingetorix gefangen', position: [47.52, 4.34], tone: 'siege' },
  // Bürgerkrieg (49-45 v. Chr.)
  { title: 'Ilerda', note: '49 v. Chr.\nStrategisches Manöver\nSicherung Hispaniens', position: [41.62, -0.62] },
  { title: 'Massilia', note: '49 v. Chr.\nSeeblockade\nPompeianische Flotte besiegt', position: [43.29, 5.37], tone: 'sea' },
  { title: 'Brundisium', note: '49 v. Chr.\nÜbergang nach Griechenland\nItalien gesichert', position: [40.64, 17.94], tone: 'sea' },
  { title: 'Dyrrhachium', note: '48 v. Chr.\nRückschlag\nBelagerung scheitert', position: [41.32, 19.45] },
  { title: 'Pharsalos', note: '48 v. Chr.\nEntscheidungsschlacht\n22.000 vs. 47.000, Pompeius flieht', position: [39.28, 22.37], tone: 'core' },
  { title: 'Alexandria', note: '48/47 v. Chr.\nFlottenkampf\nKleopatra an der Macht', position: [31.21, 29.9], tone: 'sea' },
  { title: 'Zela', note: '47 v. Chr.\n"Veni, vidi, vici"\n5-Tage-Kampagne', position: [40.0, 36.1] },
  { title: 'Thapsus', note: '46 v. Chr.\nTriumph in Afrika\n10.000 Feinde gefallen', position: [36.4, 10.6], tone: 'core' },
  { title: 'Munda', note: '45 v. Chr.\nLetzte Schlacht\nHärtester Kampf, 30.000 Tote', position: [37.3, -4.9], tone: 'core' },
];
const routeSegments: RouteSegment[] = [
  // Gallischer Krieg (58-50 v. Chr.) - Rot/Orange
  {
    id: 'gallia-main',
    label: 'Gallischer Krieg (58-52)',
    color: '#dc2626',
    points: [
      [43.6, 3.9],  // Start (Süd-Gallien)
      [46.2, 6.1],   // Helvetier
      [46.95, 4.3],  // Bibracte
      [47.08, 2.4],  // Avaricum
      [45.77, 3.1],  // Gergovia
      [47.52, 4.34], // Alesia
    ],
  },
  {
    id: 'rhine',
    label: 'Nach Germanien (55/53)',
    color: '#9a3412',
    points: [
      [47.52, 4.34], // Von Alesia
      [50.35, 7.6],  // Rhein
    ],
  },
  {
    id: 'britannia',
    label: 'Britannien (55/54)',
    color: '#78716c',
    points: [
      [50.96, 1.85], // Nordfrankreich
      [51.13, 1.3],  // Dover
    ],
    dashed: true,
  },
  // Bürgerkrieg (49-45 v. Chr.) - Blau/Violett
  {
    id: 'civil-hispania',
    label: 'Hispanien (49)',
    color: '#2563eb',
    points: [
      [43.6, 3.9],   // Von Gallien
      [41.62, -0.62], // Ilerda
    ],
  },
  {
    id: 'civil-italia',
    label: 'Italien & Griechenland (49-48)',
    color: '#7c3aed',
    points: [
      [43.29, 5.37],  // Massilia
      [40.64, 17.94], // Brundisium
      [41.32, 19.45], // Dyrrhachium
      [39.28, 22.37], // Pharsalos
    ],
  },
  {
    id: 'civil-east',
    label: 'Ostfeldzug (48-47)',
    color: '#8b5cf6',
    points: [
      [39.28, 22.37], // Pharsalos
      [31.21, 29.9],  // Alexandria
      [40.0, 36.1],   // Zela
    ],
    dashed: true,
  },
  {
    id: 'civil-africa',
    label: 'Afrika & Spanien (46-45)',
    color: '#0891b2',
    points: [
      [36.4, 10.6],   // Thapsus
      [37.3, -4.9],   // Munda
    ],
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
    <div className={`card-modern overflow-hidden shadow-xl ${className}`}>
      <div className="bg-gradient-to-br from-primary/5 via-background to-background/50 p-4 border-b border-border/40">
        <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            🗺️
          </span>
          Caesars Feldzüge (58–45 v. Chr.)
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Interaktive Karte der wichtigsten Schlachten und Kampagnen
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
        {markerPoints.map((point) => (
          <CircleMarker
            key={point.title}
            center={point.position}
            radius={9}
            pathOptions={{
              color: point.tone === 'siege' ? '#d97706' : point.tone === 'sea' ? '#0284c7' : '#dc2626',
              fillColor: point.tone === 'siege' ? '#fbbf24' : point.tone === 'sea' ? '#38bdf8' : '#f87171',
              fillOpacity: 0.9,
              weight: 3.5,
              opacity: 1,
            }}
          >
            <Popup maxWidth={300} minWidth={220} className="campaign-popup">
              <div className="text-sm p-2">
                <div className="font-bold text-foreground mb-2 text-base border-b-2 border-primary/30 pb-2">{point.title}</div>
                <div className="text-[13px] text-foreground/90 leading-relaxed whitespace-pre-line font-medium">{point.note}</div>
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
          {/* Kampagnen-Routen */}
          <div>
            <div className="text-xs font-bold text-primary/90 mb-3 uppercase tracking-widest flex items-center gap-2">
              <span className="h-px flex-1 bg-primary/20" />
              Feldzüge & Kampagnen
              <span className="h-px flex-1 bg-primary/20" />
            </div>
            <div className="flex flex-wrap gap-2">
              {legend.map((item) => (
                <div key={item.id} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card/80 border border-border/60 hover:border-primary/40 hover:bg-card transition-all shadow-sm hover:shadow-md">
                  <span
                    className="h-3.5 w-10 rounded-full shadow-inner"
                    style={{
                      backgroundColor: item.color,
                      backgroundImage: item.dashed ? 'repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(255,255,255,0.6) 6px, rgba(255,255,255,0.6) 12px)' : undefined,
                    }}
                  />
                  <span className="font-semibold text-foreground text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Markierungs-Typen */}
          <div>
            <div className="text-xs font-bold text-primary/90 mb-3 uppercase tracking-widest flex items-center gap-2">
              <span className="h-px flex-1 bg-primary/20" />
              Ereignistypen
              <span className="h-px flex-1 bg-primary/20" />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card/80 border border-border/60 hover:bg-card transition-all shadow-sm">
                <div className="h-4 w-4 rounded-full bg-red-400 border-[3px] border-red-600 shadow-md" />
                <span className="font-semibold text-foreground text-xs">Feldschlachten</span>
              </div>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card/80 border border-border/60 hover:bg-card transition-all shadow-sm">
                <div className="h-4 w-4 rounded-full bg-amber-300 border-[3px] border-amber-600 shadow-md" />
                <span className="font-semibold text-foreground text-xs">Belagerungen</span>
              </div>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card/80 border border-border/60 hover:bg-card transition-all shadow-sm">
                <div className="h-4 w-4 rounded-full bg-sky-400 border-[3px] border-sky-600 shadow-md" />
                <span className="font-semibold text-foreground text-xs">Seeschlachten</span>
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
