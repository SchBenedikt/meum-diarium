import { useEffect, useMemo, useState } from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, ScaleControl, TileLayer, Tooltip, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

type Campaign = 'all' | 'gallic' | 'civil';

interface MarkerPoint {
  title: string;
  note: string;
  description: string;
  position: [number, number];
  tone?: 'core' | 'sea' | 'siege';
  campaign: Campaign;
}

interface RouteSegment {
  id: string;
  label: string;
  color: string;
  points: [number, number][];
  dashed?: boolean;
  campaign: Campaign;
}

interface CaesarCampaignMapProps {
  className?: string;
  mapHeightClass?: string;
}

const campaigns: { key: Campaign; label: string }[] = [
  { key: 'all', label: 'Alle Feldzüge' },
  { key: 'gallic', label: 'Gallischer Krieg' },
  { key: 'civil', label: 'Bürgerkrieg' },
];

const allMarkerPoints: MarkerPoint[] = [
  // Gallischer Krieg (58–50 v. Chr.)
  {
    title: 'Genava',
    note: '58 v. Chr. – Erster großer Sieg',
    description: 'Caesar stoppt den Auszug der Helvetier. 130.000 Feinde aufgehalten. Beginn der Eroberung Galliens.',
    position: [46.2, 6.1], campaign: 'gallic',
  },
  {
    title: 'Bibracte',
    note: '58 v. Chr. – Entscheidung gegen die Helvetier',
    description: 'Vernichtende Niederlage der Helvetier. Caesar öffnet sich das Tor nach Gallien. Der gesamte Stamm kapituliert.',
    position: [46.95, 4.3], campaign: 'gallic',
  },
  {
    title: 'Vosges',
    note: '58 v. Chr. – Sieg über Ariovist',
    description: 'Caesar schlägt den germanischen König Ariovist. Rhein als Grenze Roms etabliert.',
    position: [47.75, 7.0], campaign: 'gallic',
  },
  {
    title: 'Rheinbrücke',
    note: '55/53 v. Chr. – Technisches Meisterwerk',
    description: 'In nur 10 Tagen erbaut (400 m Länge)! Demonstration römischer Ingenieurskunst. Erste Brücke über den Rhein.',
    position: [50.35, 7.6], campaign: 'gallic',
  },
  {
    title: 'Britannien',
    note: '55/54 v. Chr. – Erste römische Landung',
    description: 'Caesar durchbricht den "Oceanus" und betritt Britannien. Zwei Expeditionen militärischer Machtdemonstration.',
    position: [51.13, 1.3], campaign: 'gallic',
  },
  {
    title: 'Avaricum',
    note: '52 v. Chr. – 25 Tage Belagerung',
    description: '40.000 Tote nach erbittertem Widerstand. Caesar belagert die Hauptstadt der Biturigen.',
    position: [47.08, 2.4], tone: 'siege', campaign: 'gallic',
  },
  {
    title: 'Gergovia',
    note: '52 v. Chr. – Caesars Niederlage',
    description: '700 Legionäre fallen. Vercingetorix besiegt Caesar an der Bergfeste der Arverner. Seltene Niederlage.',
    position: [45.77, 3.1], campaign: 'gallic',
  },
  {
    title: 'Alesia',
    note: '52 v. Chr. – Wendepunkt des Krieges',
    description: '11 km Doppelwall. Vercingetorix gefangen. Caesar besiegt 200.000 Gallier mit 50.000 Legionären.',
    position: [47.52, 4.34], tone: 'siege', campaign: 'gallic',
  },
  // Bürgerkrieg (49–45 v. Chr.)
  {
    title: 'Ravenna',
    note: 'Winterlager 50/49 v. Chr.',
    description: 'Caesar wartet auf Entscheidung des Senats. Hier fällt die Nachricht: "Dem Senat gefällt kein Friede."',
    position: [44.42, 12.20], campaign: 'civil',
  },
  {
    title: 'Rubikon',
    note: '10. Jan. 49 v. Chr. – Schicksalsentscheidung',
    description: 'Alea iacta est! Caesar überschreitet den Grenzfluss – der Bürgerkrieg beginnt. Unumkehrbarer Schritt.',
    position: [44.18, 12.38], campaign: 'civil',
  },
  {
    title: 'Rom',
    note: '49 v. Chr. – Machtübernahme in Italien',
    description: 'Pompeius flieht aus Rom. Caesar übernimmt die Kontrolle über Italien ohne Blutvergießen.',
    position: [41.90, 12.48], campaign: 'civil',
  },
  {
    title: 'Ilerda',
    note: '49 v. Chr. – Sicherung Hispaniens',
    description: 'Caesar zwingt die pompeianischen Legionen in Spanien zur Aufgabe. Strategisches Meisterwerk.',
    position: [41.62, -0.62], campaign: 'civil',
  },
  {
    title: 'Massilia',
    note: '49 v. Chr. – Seeblockade',
    description: 'Marseille, auf Seiten des Senats, belagert und zur Kapitulation gezwungen. Pompeianische Flotte besiegt.',
    position: [43.29, 5.37], tone: 'sea', campaign: 'civil',
  },
  {
    title: 'Brundisium',
    note: '49 v. Chr. – Übergang nach Griechenland',
    description: 'Caesar setzt nach Epirus über – die Verfolgung des Pompeius beginnt. Italien gesichert.',
    position: [40.64, 17.94], tone: 'sea', campaign: 'civil',
  },
  {
    title: 'Dyrrhachium',
    note: '48 v. Chr. – Rückschlag',
    description: 'Caesar belagert Pompeius’ Lager – scheitert. Fast eine verlorene Kampagne.',
    position: [41.32, 19.45], campaign: 'civil',
  },
  {
    title: 'Pharsalos',
    note: '48 v. Chr. – Entscheidungsschlacht',
    description: 'Caesar (22.000) besiegt Pompeius (47.000) dank der dritten Linie. Pompeius flieht nach Ägypten.',
    position: [39.28, 22.37], tone: 'core', campaign: 'civil',
  },
  {
    title: 'Alexandria',
    note: '48/47 v. Chr. – Flottenkampf & Kleopatra',
    description: 'Caesar setzt Kleopatra als ägyptische Königin ein. Fast ertrunken im Hafen von Alexandria.',
    position: [31.21, 29.9], tone: 'sea', campaign: 'civil',
  },
  {
    title: 'Zela',
    note: '47 v. Chr. – "Veni, vidi, vici"',
    description: 'Nur 5 Tage Kampagne. Pharnakes von Pontus vernichtend geschlagen. Caesars kürzester Sieg.',
    position: [40.0, 36.1], campaign: 'civil',
  },
  {
    title: 'Thapsus',
    note: '46 v. Chr. – Triumph in Afrika',
    description: '10.000 Feinde gefallen. Cato der Jüngere begeht Selbstmord in Utica.',
    position: [36.4, 10.6], tone: 'core', campaign: 'civil',
  },
  {
    title: 'Munda',
    note: '45 v. Chr. – Letzte Schlacht',
    description: 'Härtester Kampf des Bürgerkriegs. 30.000 Tote. Die Söhne des Pompeius endgültig besiegt.',
    position: [37.3, -4.9], tone: 'core', campaign: 'civil',
  },
];

const allRouteSegments: RouteSegment[] = [
  {
    id: 'gallia-main',
    label: 'Gallischer Krieg (58–52)',
    color: '#dc2626',
    campaign: 'gallic',
    points: [
      [43.6, 3.9],
      [46.2, 6.1],
      [46.95, 4.3],
      [47.75, 7.0],
      [47.08, 2.4],
      [45.77, 3.1],
      [47.52, 4.34],
    ],
  },
  {
    id: 'rhine',
    label: 'Nach Germanien (55/53)',
    color: '#9a3412',
    campaign: 'gallic',
    points: [
      [47.52, 4.34],
      [50.35, 7.6],
    ],
  },
  {
    id: 'britannia',
    label: 'Britannien (55/54)',
    color: '#78716c',
    campaign: 'gallic',
    points: [
      [50.96, 1.85],
      [51.13, 1.3],
    ],
    dashed: true,
  },
  {
    id: 'civil-italia',
    label: 'Italien & Griechenland (49–48)',
    color: '#7c3aed',
    campaign: 'civil',
    points: [
      [43.6, 3.9],
      [44.42, 12.20],
      [44.18, 12.38],
      [41.90, 12.48],
      [43.29, 5.37],
      [40.64, 17.94],
      [41.32, 19.45],
      [39.28, 22.37],
    ],
  },
  {
    id: 'civil-hispania',
    label: 'Hispanien (49)',
    color: '#2563eb',
    campaign: 'civil',
    points: [
      [43.6, 3.9],
      [41.62, -0.62],
    ],
  },
  {
    id: 'civil-east',
    label: 'Ostfeldzug (48–47)',
    color: '#8b5cf6',
    campaign: 'civil',
    points: [
      [39.28, 22.37],
      [31.21, 29.9],
      [40.0, 36.1],
    ],
  },
  {
    id: 'civil-africa',
    label: 'Afrika & Spanien (46–45)',
    color: '#0891b2',
    campaign: 'civil',
    points: [
      [36.4, 10.6],
      [37.3, -4.9],
    ],
  },
];

export default function CaesarCampaignMap({ className = '', mapHeightClass = 'h-[420px]' }: CaesarCampaignMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState<Campaign>('all');

  useEffect(() => { setIsClient(true); }, []);

  const filteredPoints = useMemo(
    () => activeCampaign === 'all' ? allMarkerPoints : allMarkerPoints.filter(p => p.campaign === activeCampaign),
    [activeCampaign],
  );
  const filteredSegments = useMemo(
    () => activeCampaign === 'all' ? allRouteSegments : allRouteSegments.filter(s => s.campaign === activeCampaign),
    [activeCampaign],
  );

  const legend = useMemo(
    () => filteredSegments.map(s => ({ id: s.id, label: s.label, color: s.color, dashed: s.dashed })),
    [filteredSegments],
  );

  const markerCount = useMemo(
    () => ({
      gallic: allMarkerPoints.filter(p => p.campaign === 'gallic').length,
      civil: allMarkerPoints.filter(p => p.campaign === 'civil').length,
    }),
    [],
  );

  const mapBounds = useMemo(() => {
    const coords: [number, number][] = [];
    filteredPoints.forEach(p => coords.push(p.position));
    filteredSegments.forEach(seg => seg.points.forEach(pt => coords.push(pt)));
    if (!coords.length) return undefined;
    const lats = coords.map(c => c[0]);
    const lngs = coords.map(c => c[1]);
    return [
      [Math.min(...lats) - 2, Math.min(...lngs) - 4],
      [Math.max(...lats) + 2, Math.max(...lngs) + 4],
    ] as L.LatLngBoundsExpression;
  }, [filteredPoints, filteredSegments]);

  const activeCount = useMemo(
    () => activeCampaign === 'all'
      ? allMarkerPoints.length
      : filteredPoints.length,
    [activeCampaign, filteredPoints],
  );

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
              Caesars Feldzüge (58–45 v. Chr.)
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {activeCount} Schauplätze • Interaktive Karte der wichtigsten Schlachten und Kampagnen
            </p>
          </div>
          <div className="flex gap-1.5 bg-card/80 rounded-xl p-1 border border-border/40 self-start">
            {campaigns.map(c => (
              <button
                key={c.key}
                onClick={() => setActiveCampaign(c.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  activeCampaign === c.key
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card'
                }`}
              >
                {c.label}
                {c.key === 'gallic' && <span className="ml-1.5 text-[10px] opacity-60">({markerCount.gallic})</span>}
                {c.key === 'civil' && <span className="ml-1.5 text-[10px] opacity-60">({markerCount.civil})</span>}
              </button>
            ))}
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
        {filteredSegments.map(segment => (
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
        {filteredPoints.map(point => (
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
        ))}
      </MapContainer>

      <div className="p-5 border-t border-border/40 bg-gradient-to-br from-background via-background/90 to-card/30">
        <div className="flex flex-col gap-5">
          <div>
            <div className="text-xs font-bold text-primary/90 mb-3 uppercase tracking-widest flex items-center gap-2">
              <span className="h-px flex-1 bg-primary/20" />
              Feldzüge & Kampagnen
              <span className="h-px flex-1 bg-primary/20" />
            </div>
            <div className="flex flex-wrap gap-2">
              {legend.map(item => (
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
              {legend.length === 0 && (
                <span className="text-xs text-muted-foreground italic">Keine Routen im ausgewählten Filter</span>
              )}
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
