'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  MapPin,
  Route,
  Satellite,
  Layers,
  Car,
  Palette,
  LocateFixed,
  Compass,
  Home,
  Check,
} from 'lucide-react';
import { PlaygroundNavbar } from '@/components/playground-navbar';
import { useTheme } from 'next-themes';
import { presets } from '@/app/data/presets';
import { SidebarProvider } from '@/components/animate-ui/radix/sidebar';
import { createRoot, Root } from 'react-dom/client';

type LatLng = google.maps.LatLngLiteral;
type MarkerColor = 'orange' | 'blue' | 'red' | 'purple';

export default function MapPage() {
  const { resolvedTheme } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<
    Array<
      | google.maps.marker.AdvancedMarkerElement
      | google.maps.Marker
      | google.maps.OverlayView
    >
  >([]);
  const markerRootsRef = useRef<Root[]>([]);
  const markerContainersRef = useRef<Record<string, HTMLDivElement>>({});
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
    null
  );
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(
    null
  );
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const popupOverlayRef = useRef<google.maps.OverlayView | null>(null);
  const popupRootRef = useRef<Root | null>(null);
  const openPopupRef = useRef<
    | null
    | ((
        item: {
          id: string;
          name: string;
          accomodation: string | null;
          street: string | null;
          housenumber: number | null;
          housenumber_addition: string | null;
          postcode: string | null;
          city: string | null;
          position: LatLng;
        },
        overrideColor?: 'orange' | 'blue' | 'red' | 'purple'
      ) => void)
  >(null);
  const selectionPolylineRef = useRef<google.maps.Polyline | null>(null);
  const midOverlayRef = useRef<google.maps.OverlayView | null>(null);
  const midRootRef = useRef<Root | null>(null);
  const areaPolygonsRef = useRef<
    Record<MarkerColor, google.maps.Polygon | null>
  >({ orange: null, blue: null, red: null, purple: null });

  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [baseMap, setBaseMap] = useState<'roadmap' | 'satellite'>('satellite');
  const [use3D, setUse3D] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [useArchiveData, setUseArchiveData] = useState(true);
  const [selectedMarkerIds, setSelectedMarkerIds] = useState<string[]>([]);
  const [walkDuration, setWalkDuration] = useState<string | null>(null);
  const [routeMidpoint, setRouteMidpoint] = useState<LatLng | null>(null);
  const [markerColors, setMarkerColors] = useState<Record<string, MarkerColor>>(
    {}
  );
  const [visited, setVisited] = useState<Record<string, boolean>>({});
  const [groups, setGroups] = useState<
    Array<{
      id: string;
      name: string;
      position: LatLng;
      accomodation: string | null;
      street: string | null;
      housenumber: number | null;
      housenumber_addition: string | null;
      postcode: string | null;
      city: string | null;
    }>
  >([]);

  const darkMapStyles: google.maps.MapTypeStyle[] = useMemo(
    () => [
      { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }],
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }],
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }],
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }],
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }],
      },
    ],
    []
  );

  const groupsKey = useMemo(
    () =>
      groups
        .map(
          (g) =>
            `${g.id}:${g.position.lat.toFixed(6)},${g.position.lng.toFixed(6)}`
        )
        .join('|'),
    [groups]
  );

  const defaultCenter = useMemo<LatLng>(() => ({ lat: 52.1, lng: 5.3 }), []);
  const apiKey = useMemo(
    () => process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    []
  );
  const mapId = useMemo(() => process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || '', []);

  const subscriptionsUrl = useMemo(() => {
    if (useArchiveData) {
      const params = new URLSearchParams({
        archive: '1',
        ts: '20231005142154',
      });
      return `/api/jotihunt/subscriptions?${params.toString()}`;
    }
    return '/api/jotihunt/subscriptions';
  }, [useArchiveData]);

  function toNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const n = parseFloat(value.replace(',', '.'));
      return Number.isFinite(n) ? n : null;
    }
    return null;
  }

  function parseGroupPosition(record: unknown): LatLng | null {
    if (!record || typeof record !== 'object') return null;
    const obj = record as Record<string, unknown>;
    const latCandidate = obj['lat'] ?? obj['latitude'];
    const lngCandidate =
      obj['lng'] ?? obj['lon'] ?? obj['long'] ?? obj['longitude'];
    const latNum = toNumber(latCandidate);
    const lngNum = toNumber(lngCandidate);
    if (latNum !== null && lngNum !== null) return { lat: latNum, lng: lngNum };
    const latitude = obj['latitude'];
    const longitude = obj['longitude'];
    const lat2 = toNumber(latitude);
    const lng2 = toNumber(longitude);
    if (lat2 !== null && lng2 !== null) return { lat: lat2, lng: lng2 };
    const location = obj['location'];
    if (location && typeof location === 'object') {
      const loc = location as Record<string, unknown>;
      const llat = toNumber(loc['lat']);
      const llng = toNumber(
        loc['lng'] ?? loc['lon'] ?? loc['long'] ?? loc['longitude']
      );
      if (llat !== null && llng !== null) return { lat: llat, lng: llng };
      const coordinates = loc['coordinates'];
      if (Array.isArray(coordinates) && coordinates.length >= 2) {
        const [lngCoord, latCoord] = coordinates as unknown[];
        const lat3 = toNumber(latCoord);
        const lng3 = toNumber(lngCoord);
        if (lat3 !== null && lng3 !== null) return { lat: lat3, lng: lng3 };
      }
    }
    const coordinatesStr = obj['coordinates'];
    if (typeof coordinatesStr === 'string' && coordinatesStr.includes(',')) {
      const parts = coordinatesStr
        .split(',')
        .map((p) => parseFloat((p as string).trim().replace(',', '.')));
      if (
        parts.length >= 2 &&
        !Number.isNaN(parts[0]) &&
        !Number.isNaN(parts[1])
      )
        return { lat: parts[0], lng: parts[1] };
    }
    return null;
  }

  function parseGroupId(record: unknown): string {
    const obj = record as Record<string, unknown>;
    if (obj['id']) return String(obj['id']);
    if (obj['slug']) return String(obj['slug']);
    if (obj['code']) return String(obj['code']);
    if (obj['name']) return String(obj['name']);
    return Math.random().toString(36).slice(2);
  }

  function parseGroupName(record: unknown): string {
    const obj = record as Record<string, unknown>;
    if (obj['name']) return String(obj['name']);
    if (obj['title']) return String(obj['title']);
    if (obj['group']) return String(obj['group']);
    return 'Onbekend';
  }

  function extractDetail<T = unknown>(
    rec: Record<string, unknown>,
    key: string
  ): T | null {
    if (key in rec && rec[key] != null) return rec[key] as T;
    return null;
  }

  function convexHullLatLng(points: LatLng[]): LatLng[] {
    if (points.length <= 1) return points.slice();
    const pts = points
      .map((p) => ({ x: p.lng, y: p.lat, src: p }))
      .sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x));
    const cross = (
      o: { x: number; y: number },
      a: { x: number; y: number },
      b: { x: number; y: number }
    ) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    const lower: { x: number; y: number; src: LatLng }[] = [];
    for (const p of pts) {
      while (
        lower.length >= 2 &&
        cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0
      )
        lower.pop();
      lower.push(p);
    }
    const upper: { x: number; y: number; src: LatLng }[] = [];
    for (let i = pts.length - 1; i >= 0; i--) {
      const p = pts[i];
      while (
        upper.length >= 2 &&
        cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0
      )
        upper.pop();
      upper.push(p);
    }
    const hull = lower
      .slice(0, lower.length - 1)
      .concat(upper.slice(0, upper.length - 1));
    return hull.map((h) => h.src);
  }

  function colorStyles(c: MarkerColor): {
    fillColor: string;
    strokeColor: string;
  } {
    if (c === 'orange') return { fillColor: '#f97316', strokeColor: '#f97316' };
    if (c === 'blue') return { fillColor: '#3b82f6', strokeColor: '#3b82f6' };
    if (c === 'red') return { fillColor: '#ef4444', strokeColor: '#ef4444' };
    return { fillColor: '#a855f7', strokeColor: '#a855f7' };
  }

  useEffect(() => {
    let active = true;
    async function loadGroups() {
      try {
        const res = await fetch(subscriptionsUrl, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Failed to load groups ${res.status}`);
        const data = await res.json();
        const items = Array.isArray(data)
          ? data
          : Array.isArray((data as Record<string, unknown>)?.['data'])
          ? ((data as Record<string, unknown>)['data'] as unknown[])
          : [];
        const parsed = items
          .map((rec) => {
            const position = parseGroupPosition(rec);
            if (!position) return null;
            const obj = rec as Record<string, unknown>;
            return {
              id: parseGroupId(rec),
              name: parseGroupName(rec),
              position,
              accomodation: extractDetail<string>(obj, 'accomodation'),
              street: extractDetail<string>(obj, 'street'),
              housenumber: extractDetail<number>(obj, 'housenumber'),
              housenumber_addition: extractDetail<string>(
                obj,
                'housenumber_addition'
              ),
              postcode: extractDetail<string>(obj, 'postcode'),
              city: extractDetail<string>(obj, 'city'),
            };
          })
          .filter(
            (
              x
            ): x is {
              id: string;
              name: string;
              position: LatLng;
              accomodation: string | null;
              street: string | null;
              housenumber: number | null;
              housenumber_addition: string | null;
              postcode: string | null;
              city: string | null;
            } => x !== null
          );
        if (active) setGroups(parsed);
      } catch (e: unknown) {
        if (active)
          setError(e instanceof Error ? e.message : 'Failed to load groups');
      }
    }
    loadGroups();
    return () => {
      active = false;
    };
  }, [subscriptionsUrl]);

  function detachMarker(
    m:
      | google.maps.marker.AdvancedMarkerElement
      | google.maps.Marker
      | google.maps.OverlayView
  ) {
    if ('setMap' in m && typeof m.setMap === 'function') {
      m.setMap(null);
    } else if ('map' in m) {
      (m as google.maps.marker.AdvancedMarkerElement).map = null;
    }
  }

  function closePopup() {
    if (popupOverlayRef.current) {
      try {
        popupOverlayRef.current.setMap(null as unknown as google.maps.Map);
      } catch {}
      popupOverlayRef.current = null;
    }
    if (popupRootRef.current) {
      try {
        popupRootRef.current.unmount();
      } catch {}
      popupRootRef.current = null;
    }
  }

  function openPopup(
    item: {
      id: string;
      name: string;
      accomodation: string | null;
      street: string | null;
      housenumber: number | null;
      housenumber_addition: string | null;
      postcode: string | null;
      city: string | null;
      position: LatLng;
    },
    overrideColor?: 'orange' | 'blue' | 'red' | 'purple'
  ) {
    closePopup();
    class PopupOverlay extends google.maps.OverlayView {
      position: LatLng;
      container: HTMLDivElement;
      constructor(position: LatLng, content: HTMLElement) {
        super();
        this.position = position;
        this.container = document.createElement('div');
        this.container.style.position = 'absolute';
        this.container.style.transform = 'translate(-50%, calc(-100% - 12px))';
        this.container.style.zIndex = '1000';
        this.container.appendChild(content);
      }
      onAdd() {
        this.getPanes()?.overlayMouseTarget.appendChild(this.container);
      }
      draw() {
        const proj = this.getProjection();
        if (!proj) return;
        const pt = proj.fromLatLngToDivPixel(
          new google.maps.LatLng(this.position)
        );
        if (!pt) return;
        this.container.style.left = `${pt.x}px`;
        this.container.style.top = `${pt.y}px`;
      }
      onRemove() {
        this.container.remove();
      }
    }
    const holder = document.createElement('div');
    const root = createRoot(holder);
    popupRootRef.current = root;
    const color = overrideColor ?? markerColors[item.id];
    const isVisited = visited[item.id] || false;
    const baseCard = 'rounded-xl shadow-lg p-3 min-w-[240px] border';
    const cardClass =
      color === 'orange'
        ? `bg-orange-500 border-orange-500 text-white ${baseCard}`
        : color === 'blue'
        ? `bg-blue-500 border-blue-500 text-white ${baseCard}`
        : color === 'red'
        ? `bg-red-500 border-red-500 text-white ${baseCard}`
        : color === 'purple'
        ? `bg-purple-500 border-purple-500 text-white ${baseCard}`
        : `bg-card ${baseCard}`;
    const secondaryTextClass = color
      ? 'text-white/80'
      : 'text-muted-foreground';
    root.render(
      <Card className={cardClass}>
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <div className="font-semibold leading-none mb-1">{item.name}</div>
            {item.accomodation ? (
              <div className={`text-sm ${secondaryTextClass}`}>
                {item.accomodation}
              </div>
            ) : null}
            <div className="mt-1 text-sm">
              {[item.street, item.housenumber].filter(Boolean).join(' ')}
              {item.housenumber_addition ? ` ${item.housenumber_addition}` : ''}
            </div>
            <div className={`text-sm ${secondaryTextClass}`}>
              {[item.postcode || undefined, item.city || undefined]
                .filter(Boolean)
                .join(' ')}
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 shrink-0"
            onClick={() => {
              closePopup();
            }}
          >
            ✕
          </Button>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button
            size="sm"
            className="h-8 px-3 rounded-lg"
            onClick={() => {
              const url = `https://www.google.com/maps/dir/?api=1&destination=${item.position.lat},${item.position.lng}&travelmode=driving`;
              window.open(url, '_blank', 'noopener,noreferrer');
            }}
          >
            <Car className="w-3.5 h-3.5 mr-1.5" />
            Google Maps
          </Button>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 px-3 rounded-lg"
                >
                  <Palette className="w-3.5 h-3.5 mr-1.5" />
                  Kleur
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="w-auto p-2"
              >
                <div className="flex items-center gap-2">
                  <Button
                    aria-label="oranje"
                    size="icon"
                    variant="secondary"
                    className="h-7 w-7 rounded-md bg-orange-500 border-2 border-orange-500"
                    onClick={() => {
                      setMarkerColors((m) => ({ ...m, [item.id]: 'orange' }));
                      setTimeout(
                        () => openPopupRef.current?.(item, 'orange'),
                        0
                      );
                    }}
                  />
                  <Button
                    aria-label="blauw"
                    size="icon"
                    variant="secondary"
                    className="h-7 w-7 rounded-md bg-blue-500 border-2 border-blue-500"
                    onClick={() => {
                      setMarkerColors((m) => ({ ...m, [item.id]: 'blue' }));
                      setTimeout(() => openPopupRef.current?.(item, 'blue'), 0);
                    }}
                  />
                  <Button
                    aria-label="rood"
                    size="icon"
                    variant="secondary"
                    className="h-7 w-7 rounded-md bg-red-500 border-2 border-red-500"
                    onClick={() => {
                      setMarkerColors((m) => ({ ...m, [item.id]: 'red' }));
                      setTimeout(() => openPopupRef.current?.(item, 'red'), 0);
                    }}
                  />
                  <Button
                    aria-label="paars"
                    size="icon"
                    variant="secondary"
                    className="h-7 w-7 rounded-md bg-purple-500 border-2 border-purple-500"
                    onClick={() => {
                      setMarkerColors((m) => ({ ...m, [item.id]: 'purple' }));
                      setTimeout(
                        () => openPopupRef.current?.(item, 'purple'),
                        0
                      );
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-label={
                      isVisited ? 'Bezocht door vossen' : 'Markeer als bezocht'
                    }
                    size="icon"
                    variant="secondary"
                    className={`h-8 w-8 rounded-lg border-2 ${
                      isVisited
                        ? 'bg-green-500 text-white border-green-500 hover:bg-green-500'
                        : 'border-border'
                    }`}
                    onClick={() => {
                      setVisited((v) => ({ ...v, [item.id]: !v[item.id] }));
                      setTimeout(() => openPopupRef.current?.(item, color), 0);
                    }}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isVisited ? 'Bezocht' : 'Markeer bezocht'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </Card>
    );
    const overlay = new PopupOverlay(item.position, holder);
    popupOverlayRef.current = overlay;
    overlay.setMap(mapRef.current!);
  }

  useEffect(() => {
    openPopupRef.current = (it, oc) => openPopup(it, oc);
  }, [markerColors, visited]);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        if (!apiKey) {
          setError('Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
          return;
        }
        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['marker'],
        });
        await loader.importLibrary('maps');
        await loader.importLibrary('marker');
        if (cancelled) return;
        const options: google.maps.MapOptions = {
          center: defaultCenter,
          zoom: 9,
          mapTypeId:
            baseMap === 'satellite'
              ? google.maps.MapTypeId.HYBRID
              : google.maps.MapTypeId.ROADMAP,
          tilt: use3D ? 67.5 : 0,
          heading: use3D ? 45 : 0,
          gestureHandling: 'greedy',
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
        };
        if (mapId) Object.assign(options, { mapId });
        const map = new google.maps.Map(
          mapContainerRef.current as HTMLDivElement,
          options
        );
        mapRef.current = map;
        directionsServiceRef.current = new google.maps.DirectionsService();
        directionsRendererRef.current = new google.maps.DirectionsRenderer({
          suppressMarkers: true,
          preserveViewport: true,
        });
        directionsRendererRef.current.setMap(map);
        infoWindowRef.current = new google.maps.InfoWindow();
        setIsReady(true);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load Google Maps');
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [apiKey, defaultCenter, mapId]);

  useEffect(() => {
    if (!isReady || !mapRef.current) return;
    mapRef.current.setMapTypeId(
      baseMap === 'satellite'
        ? google.maps.MapTypeId.HYBRID
        : google.maps.MapTypeId.ROADMAP
    );
    if (baseMap === 'roadmap') {
      const isDark = resolvedTheme === 'dark';
      const styles = isDark ? darkMapStyles : null;
      mapRef.current.setOptions({
        styles: styles || undefined,
        backgroundColor: isDark ? '#242f3e' : '#e5e3df',
      });
      try {
        const div = mapRef.current.getDiv() as HTMLElement;
        div.style.backgroundColor = isDark ? '#242f3e' : '#e5e3df';
      } catch {}
    } else {
      mapRef.current.setOptions({
        styles: undefined,
        backgroundColor: undefined,
      });
      try {
        const div = mapRef.current.getDiv() as HTMLElement;
        div.style.backgroundColor = '';
      } catch {}
    }
  }, [baseMap, isReady, resolvedTheme, darkMapStyles]);

  useEffect(() => {
    if (!isReady || !mapRef.current) return;
    mapRef.current.setTilt(use3D ? 67.5 : 0);
    mapRef.current.setHeading(use3D ? 45 : 0);
  }, [use3D, isReady]);

  useEffect(() => {
    if (!isReady || !mapRef.current) return;
    markersRef.current.forEach(detachMarker);
    markersRef.current = [];
    markerRootsRef.current.forEach((r) => {
      try {
        r.unmount();
      } catch {}
    });
    markerRootsRef.current = [];
    markerContainersRef.current = {};
    const markerById: Record<
      string,
      | google.maps.marker.AdvancedMarkerElement
      | google.maps.Marker
      | google.maps.OverlayView
    > = {};
    if (!showMarkers || groups.length === 0) return;
    groups.forEach((item) => {
      if (mapId && google.maps.marker?.AdvancedMarkerElement) {
        const container = document.createElement('div');
        const root = createRoot(container);
        markerRootsRef.current.push(root);
        root.render(
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className={
                    'h-8 w-8 rounded-md p-0 font-semibold bg-secondary text-secondary-foreground border-2 border-transparent shadow-sm flex items-center justify-center hover:bg-secondary hover:opacity-100 focus-visible:outline-none'
                  }
                  aria-label={`Scouting groep: ${item.name}`}
                >
                  <Home className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{item.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
        markerContainersRef.current[item.id] = container;
        const adv = new google.maps.marker.AdvancedMarkerElement({
          position: item.position,
          map: mapRef.current!,
          content: container,
        });
        adv.addListener('gmp-click', () => {
          setSelectedMarkerIds((prev) => {
            if (prev.includes(item.id))
              return prev.filter((x) => x !== item.id);
            if (prev.length < 2) return [...prev, item.id];
            return [prev[1], item.id];
          });
          openPopupRef.current?.(item);
        });
        markersRef.current.push(adv);
        markerById[item.id] = adv;
      } else if (google.maps.OverlayView) {
        class DomMarker extends google.maps.OverlayView {
          position: LatLng;
          container: HTMLDivElement;
          click: () => void;
          constructor(
            position: LatLng,
            content: HTMLElement,
            click: () => void
          ) {
            super();
            this.position = position;
            this.container = document.createElement('div');
            this.container.style.position = 'absolute';
            this.container.appendChild(content);
            this.click = click;
            this.container.addEventListener('click', this.click);
          }
          onAdd() {
            this.getPanes()?.overlayMouseTarget.appendChild(this.container);
          }
          draw() {
            const projection = this.getProjection();
            if (!projection) return;
            const point = projection.fromLatLngToDivPixel(
              new google.maps.LatLng(this.position)
            );
            if (!point) return;
            this.container.style.left = `${point.x}px`;
            this.container.style.top = `${point.y}px`;
            this.container.style.transform = 'translate(-50%, -50%)';
          }
          onRemove() {
            this.container.removeEventListener('click', this.click);
            this.container.remove();
          }
        }
        const container = document.createElement('div');
        const root = createRoot(container);
        markerRootsRef.current.push(root);
        root.render(
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className={
                    'h-8 w-8 rounded-md p-0 font-semibold bg-secondary text-secondary-foreground border-2 border-transparent shadow-sm flex items-center justify-center hover:bg-secondary hover:opacity-100 focus-visible:outline-none'
                  }
                  aria-label={`Scouting groep: ${item.name}`}
                >
                  <Home className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{item.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
        markerContainersRef.current[item.id] = container;
        const domMarker = new DomMarker(item.position, container, () => {
          setSelectedMarkerIds((prev) => {
            if (prev.includes(item.id))
              return prev.filter((x) => x !== item.id);
            if (prev.length < 2) return [...prev, item.id];
            return [prev[1], item.id];
          });
          openPopupRef.current?.(item);
        });
        domMarker.setMap(mapRef.current!);
        markersRef.current.push(domMarker);
        markerById[item.id] = domMarker;
      } else {
        const marker = new google.maps.Marker({
          position: item.position,
          map: mapRef.current!,
          icon: (function () {
            const size = 28;
            const bg = '#ffffff';
            const border = '#e5e7eb';
            const radius = 6;
            const glyph = '#111827';
            const isVisited = !!visited[item.id];
            const pad = 3;
            const badgeR = 4;
            const cx = size - badgeR - 2;
            const cy = badgeR + 2;
            const badge = isVisited
              ? `<circle cx='${cx}' cy='${cy}' r='${badgeR}' fill='#22c55e' stroke='#ffffff' stroke-width='1.5' />`
              : '';
            const svg = `<?xml version='1.0'?>
              <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>
                <rect x='0.5' y='0.5' rx='${radius}' ry='${radius}' width='${
              size - 1
            }' height='${size - 1}' fill='${bg}' stroke='${border}'/>
                <path d='M ${size / 2} ${pad + 6} L ${size - pad - 6} ${
              size / 2
            } L ${size - pad - 6} ${size - pad - 6} L ${pad + 6} ${
              size - pad - 6
            } L ${pad + 6} ${size / 2} Z' fill='none'/>
                <path d='M ${size / 2} ${pad + 7} l ${size / 2 - pad - 7} ${
              size / 2 - pad - 7
            } h -4 v ${size / 2 - pad - 1} h -${size - 2 * pad - 6} v -${
              size / 2 - pad - 1
            } h -4 Z' fill='${glyph}'/>
                ${badge}
              </svg>`;
            const url =
              'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
            return {
              url,
              size: new google.maps.Size(size, size),
              scaledSize: new google.maps.Size(size, size),
              anchor: new google.maps.Point(size / 2, size / 2),
            } as google.maps.Icon;
          })(),
        });
        marker.addListener('click', () => {
          setSelectedMarkerIds((prev) => {
            if (prev.includes(item.id))
              return prev.filter((x) => x !== item.id);
            if (prev.length < 2) return [...prev, item.id];
            return [prev[1], item.id];
          });
          openPopupRef.current?.(item);
        });
        markersRef.current.push(marker);
        markerById[item.id] = marker;
      }
    });
    // After creating DOM markers, add visited badge to their DOM when needed
    Object.entries(markerContainersRef.current).forEach(([id, container]) => {
      const btn = container.querySelector('button') as HTMLElement | null;
      const el = btn ?? (container.firstElementChild as HTMLElement | null);
      if (!el) return;
      el.classList.add('relative');
      const existingBadge = el.querySelector(
        '[data-role="visited-badge"]'
      ) as HTMLElement | null;
      const isVisited = !!visited[id];
      if (isVisited && !existingBadge) {
        const badge = document.createElement('span');
        badge.setAttribute('data-role', 'visited-badge');
        badge.className =
          'absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.06)]';
        el.appendChild(badge);
      } else if (!isVisited && existingBadge) {
        existingBadge.remove();
      }
    });
  }, [showMarkers, isReady, groupsKey, mapId, baseMap, visited]);

  useEffect(() => {
    Object.entries(markerContainersRef.current).forEach(([id, container]) => {
      const btn = container.querySelector('button') as HTMLElement | null;
      const el = btn ?? (container.firstElementChild as HTMLElement | null);
      if (!el) return;
      el.classList.add('relative');
      el.classList.add('border-2');
      el.classList.remove(
        'bg-card',
        'bg-secondary',
        'bg-orange-500',
        'bg-blue-500',
        'bg-red-500',
        'bg-purple-500',
        'text-white',
        'text-secondary-foreground'
      );
      const color = markerColors[id];
      if (color === 'orange') el.classList.add('bg-orange-500', 'text-white');
      else if (color === 'blue') el.classList.add('bg-blue-500', 'text-white');
      else if (color === 'red') el.classList.add('bg-red-500', 'text-white');
      else if (color === 'purple')
        el.classList.add('bg-purple-500', 'text-white');
      else el.classList.add('bg-secondary', 'text-secondary-foreground');
      const c = markerColors[id];
      const borderColor =
        c === 'orange'
          ? 'border-orange-500'
          : c === 'blue'
          ? 'border-blue-500'
          : c === 'red'
          ? 'border-red-500'
          : c === 'purple'
          ? 'border-purple-500'
          : 'border-border';
      el.classList.remove(
        'border-orange-500',
        'border-blue-500',
        'border-red-500',
        'border-purple-500',
        'border-border'
      );
      if (selectedMarkerIds.includes(id)) {
        el.classList.remove('border-transparent');
        el.classList.add(borderColor);
      } else {
        el.classList.add('border-transparent');
      }

      const existingBadge = el.querySelector(
        '[data-role="visited-badge"]'
      ) as HTMLElement | null;
      const isVisited = !!visited[id];
      if (isVisited && !existingBadge) {
        const badge = document.createElement('span');
        badge.setAttribute('data-role', 'visited-badge');
        badge.className =
          'absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.06)]';
        el.appendChild(badge);
      } else if (!isVisited && existingBadge) {
        existingBadge.remove();
      }
    });
  }, [selectedMarkerIds, markerColors, visited]);

  useEffect(() => {
    if (!isReady) return;
    // Update classic markers' icons for visited state
    groups.forEach((g) => {
      const container = markerContainersRef.current[g.id];
      if (container) return; // DOM-based marker handled by DOM badge above
      const idx = markersRef.current.findIndex((m) => {
        const classic = m as google.maps.Marker;
        if (typeof classic.getPosition === 'function') {
          const pos = classic.getPosition();
          return (
            !!pos &&
            Math.abs(pos.lat() - g.position.lat) < 1e-6 &&
            Math.abs(pos.lng() - g.position.lng) < 1e-6
          );
        }
        return false;
      });
      if (idx >= 0) {
        const marker = markersRef.current[idx] as unknown as google.maps.Marker;
        if (marker.setIcon) {
          const size = 28;
          const bg = '#ffffff';
          const border = '#e5e7eb';
          const radius = 6;
          const glyph = '#111827';
          const isVisited = !!visited[g.id];
          const pad = 3;
          const badgeR = 4;
          const cx = size - badgeR - 2;
          const cy = badgeR + 2;
          const badge = isVisited
            ? `<circle cx='${cx}' cy='${cy}' r='${badgeR}' fill='#22c55e' stroke='#ffffff' stroke-width='1.5' />`
            : '';
          const svg = `<?xml version='1.0'?>
            <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>
              <rect x='0.5' y='0.5' rx='${radius}' ry='${radius}' width='${
            size - 1
          }' height='${size - 1}' fill='${bg}' stroke='${border}'/>
              <path d='M ${size / 2} ${pad + 6} L ${size - pad - 6} ${
            size / 2
          } L ${size - pad - 6} ${size - pad - 6} L ${pad + 6} ${
            size - pad - 6
          } L ${pad + 6} ${size / 2} Z' fill='none'/>
              <path d='M ${size / 2} ${pad + 7} l ${size / 2 - pad - 7} ${
            size / 2 - pad - 7
          } h -4 v ${size / 2 - pad - 1} h -${size - 2 * pad - 6} v -${
            size / 2 - pad - 1
          } h -4 Z' fill='${glyph}'/>
              ${badge}
            </svg>`;
          const url =
            'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
          marker.setIcon({
            url,
            size: new google.maps.Size(size, size),
            scaledSize: new google.maps.Size(size, size),
            anchor: new google.maps.Point(size / 2, size / 2),
          } as google.maps.Icon);
        }
      }
    });
  }, [visited, isReady, groupsKey]);

  useEffect(() => {
    if (!isReady || !mapRef.current) return;
    if (groups.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    groups.forEach((g) => bounds.extend(g.position));
    mapRef.current.fitBounds(bounds, 48);
  }, [groupsKey, groups, isReady]);

  useEffect(() => {
    return () => {
      closePopup();
    };
  }, []);

  useEffect(() => {
    if (!isReady || !mapRef.current) return;
    (['orange', 'blue', 'red', 'purple'] as MarkerColor[]).forEach((c) => {
      const existing = areaPolygonsRef.current[c];
      if (existing) existing.setMap(null);
      areaPolygonsRef.current[c] = null;
    });
    const grouped: Record<MarkerColor, LatLng[]> = {
      orange: [],
      blue: [],
      red: [],
      purple: [],
    };
    groups.forEach((g) => {
      const color = markerColors[g.id];
      if (color) grouped[color].push(g.position);
    });
    (['orange', 'blue', 'red', 'purple'] as MarkerColor[]).forEach((c) => {
      const pts = grouped[c];
      if (!pts || pts.length < 3) return;
      const hull = convexHullLatLng(pts);
      if (hull.length < 3) return;
      const { fillColor, strokeColor } = colorStyles(c);
      const poly = new google.maps.Polygon({
        map: mapRef.current!,
        paths: hull,
        fillColor,
        fillOpacity: 0.15,
        strokeColor,
        strokeOpacity: 0.4,
        strokeWeight: 2,
      });
      areaPolygonsRef.current[c] = poly;
    });
    return () => {
      (['orange', 'blue', 'red', 'purple'] as MarkerColor[]).forEach((c) => {
        const existing = areaPolygonsRef.current[c];
        if (existing) existing.setMap(null);
        areaPolygonsRef.current[c] = null;
      });
    };
  }, [isReady, groupsKey, groups, markerColors]);

  useEffect(() => {
    if (!isReady || !mapRef.current) return;
    if (selectionPolylineRef.current) {
      selectionPolylineRef.current.setMap(null);
      selectionPolylineRef.current = null;
    }
    if (midOverlayRef.current) {
      try {
        midOverlayRef.current.setMap(null as unknown as google.maps.Map);
      } catch {}
      midOverlayRef.current = null;
    }
    if (midRootRef.current) {
      try {
        midRootRef.current.unmount();
      } catch {}
      midRootRef.current = null;
    }
    if (selectedMarkerIds.length !== 2) return;
    const a = groups.find((g) => g.id === selectedMarkerIds[0]);
    const b = groups.find((g) => g.id === selectedMarkerIds[1]);
    if (!a || !b) return;
    if (!walkDuration) {
      selectionPolylineRef.current = new google.maps.Polyline({
        map: mapRef.current,
        path: [a.position, b.position],
        strokeOpacity: 0,
        icons: [
          {
            icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 4 },
            offset: '0',
            repeat: '16px',
          },
        ],
        strokeColor: '#9CA3AF',
      });
    }
    class MidOverlay extends google.maps.OverlayView {
      p: LatLng;
      el: HTMLDivElement;
      constructor(p: LatLng, content: HTMLElement) {
        super();
        this.p = p;
        this.el = document.createElement('div');
        this.el.style.position = 'absolute';
        this.el.appendChild(content);
      }
      onAdd() {
        this.getPanes()?.overlayMouseTarget.appendChild(this.el);
      }
      draw() {
        const proj = this.getProjection();
        if (!proj) return;
        const pt = proj.fromLatLngToDivPixel(new google.maps.LatLng(this.p));
        if (!pt) return;
        this.el.style.left = `${pt.x}px`;
        this.el.style.top = `${pt.y}px`;
        this.el.style.transform = 'translate(-50%, -50%)';
      }
      onRemove() {
        this.el.remove();
      }
    }
    const mid = routeMidpoint ?? {
      lat: (a.position.lat + b.position.lat) / 2,
      lng: (a.position.lng + b.position.lng) / 2,
    };
    const holder = document.createElement('div');
    const root = createRoot(holder);
    midRootRef.current = root;
    const primaryColor = markerColors[selectedMarkerIds[0]];
    const durationClasses =
      primaryColor === 'orange'
        ? 'bg-orange-500 text-white border-orange-500'
        : primaryColor === 'blue'
        ? 'bg-blue-500 text-white border-blue-500'
        : primaryColor === 'red'
        ? 'bg-red-500 text-white border-red-500'
        : primaryColor === 'purple'
        ? 'bg-purple-500 text-white border-purple-500'
        : 'bg-secondary text-secondary-foreground border-border';
    const calcBtnClasses = durationClasses;
    const calcBtnHoverBg =
      primaryColor === 'orange'
        ? 'hover:bg-orange-500'
        : primaryColor === 'blue'
        ? 'hover:bg-blue-500'
        : primaryColor === 'red'
        ? 'hover:bg-red-500'
        : primaryColor === 'purple'
        ? 'hover:bg-purple-500'
        : 'hover:bg-secondary';
    root.render(
      <div className="flex items-center gap-2">
        {!walkDuration ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className={`h-8 w-8 rounded-lg border-2 focus:bg-inherit active:bg-inherit hover:opacity-100 focus:opacity-100 active:opacity-100 transition-none ${calcBtnClasses} ${calcBtnHoverBg}`}
                  onClick={() => {
                    (async () => {
                      await computeWalkingRouteBetween(a.position, b.position);
                    })();
                  }}
                >
                  <Route className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bereken looproute</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
        {walkDuration ? (
          <div
            className={`px-2 py-1 rounded-md border text-xs shadow-sm ${durationClasses}`}
          >
            {walkDuration}
          </div>
        ) : null}
      </div>
    );
    const overlay = new MidOverlay(mid, holder);
    midOverlayRef.current = overlay;
    overlay.setMap(mapRef.current);
  }, [
    selectedMarkerIds,
    isReady,
    groupsKey,
    groups,
    walkDuration,
    routeMidpoint,
    markerColors,
    baseMap,
    use3D,
  ]);

  useEffect(() => {
    if (!directionsRendererRef.current) return;
    directionsRendererRef.current.setMap(null as unknown as google.maps.Map);
    setWalkDuration(null);
    setRouteMidpoint(null);
  }, [selectedMarkerIds]);

  async function computeWalkingRouteBetween(p1: LatLng, p2: LatLng) {
    if (
      !isReady ||
      !directionsServiceRef.current ||
      !directionsRendererRef.current
    )
      return;
    try {
      const result = await directionsServiceRef.current.route({
        origin: p1,
        destination: p2,
        travelMode: google.maps.TravelMode.WALKING,
        provideRouteAlternatives: false,
      });
      directionsRendererRef.current.setMap(mapRef.current);
      directionsRendererRef.current.setDirections(result);
      const leg = result.routes?.[0]?.legs?.[0];
      const text = leg?.duration?.text || null;
      setWalkDuration(text);
      let mp: LatLng | null = null;
      const r = result.routes?.[0] as google.maps.DirectionsRoute | undefined;
      if (
        r?.overview_path &&
        Array.isArray(r.overview_path) &&
        r.overview_path.length
      ) {
        const i = Math.floor(r.overview_path.length / 2);
        const ll = r.overview_path[i] as google.maps.LatLng;
        if (ll && typeof ll.lat === 'function' && typeof ll.lng === 'function')
          mp = { lat: ll.lat(), lng: ll.lng() };
      } else if (r?.legs && r.legs[0]?.steps) {
        const steps = r.legs[0].steps as google.maps.DirectionsStep[];
        const pts: google.maps.LatLng[] = [];
        steps.forEach((s) => {
          const maybePath = (s as unknown as { path?: google.maps.LatLng[] })
            .path;
          if (maybePath && Array.isArray(maybePath)) pts.push(...maybePath);
        });
        if (pts.length) {
          const i = Math.floor(pts.length / 2);
          const ll = pts[i] as google.maps.LatLng;
          if (
            ll &&
            typeof ll.lat === 'function' &&
            typeof ll.lng === 'function'
          )
            mp = { lat: ll.lat(), lng: ll.lng() };
        }
      }
      if (mp) setRouteMidpoint(mp);
    } catch {
      setError('Directions API not enabled for walking routes.');
    }
  }

  function recenter() {
    if (!mapRef.current) return;
    mapRef.current.setCenter(defaultCenter);
    mapRef.current.setZoom(9);
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex flex-col">
        <PlaygroundNavbar presets={presets} />
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative h-[calc(100vh-140px)] w-full rounded-2xl overflow-hidden border bg-background">
            <div
              ref={mapContainerRef}
              className="absolute inset-0"
            />
            {!apiKey && (
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <Card className="max-w-md w-full">
                  <CardHeader>
                    <CardTitle>Google Maps setup required</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY and optionally
                      NEXT_PUBLIC_GOOGLE_MAP_ID in .env.local and restart the
                      server.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
            {error && apiKey && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                <Card>
                  <CardContent className="py-2 px-4 text-sm">
                    {error}
                  </CardContent>
                </Card>
              </div>
            )}
            <div className="absolute bottom-4 left-4 z-20 max-w-[95vw] pointer-events-auto">
              <TooltipProvider>
                <div className="bg-card border rounded-xl shadow-sm p-1.5 flex flex-wrap items-center gap-1.5">
                  <Button
                    variant="secondary"
                    size="sm"
                    className={`h-8 px-3 rounded-lg border-2 ${
                      baseMap === 'roadmap'
                        ? 'border-border'
                        : 'border-transparent'
                    }`}
                    onClick={() => setBaseMap('roadmap')}
                  >
                    <Layers className="w-3.5 h-3.5 mr-1.5" />
                    Roadmap
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className={`h-8 px-3 rounded-lg border-2 ${
                      baseMap === 'satellite'
                        ? 'border-border'
                        : 'border-transparent'
                    }`}
                    onClick={() => setBaseMap('satellite')}
                  >
                    <Satellite className="w-3.5 h-3.5 mr-1.5" />
                    Satellite
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className={`h-8 px-3 rounded-lg border-2 ${
                      use3D ? 'border-border' : 'border-transparent'
                    }`}
                    onClick={() => setUse3D((v) => !v)}
                  >
                    3D
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className={`h-8 px-3 rounded-lg border-2 ${
                      showMarkers ? 'border-border' : 'border-transparent'
                    }`}
                    onClick={() => setShowMarkers((v) => !v)}
                  >
                    <MapPin className="w-3.5 h-3.5 mr-1.5" />
                    Markers
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className={`h-8 px-3 rounded-lg border-2 ${
                      useArchiveData ? 'border-border' : 'border-transparent'
                    }`}
                    onClick={() => setUseArchiveData((v) => !v)}
                  >
                    Archief
                  </Button>
                  <div className="h-6 w-px bg-border mx-1" />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-lg"
                        onClick={recenter}
                      >
                        <LocateFixed className="w-3.5 h-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Center NL</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-lg"
                        onClick={() =>
                          mapRef.current?.setHeading(
                            (mapRef.current.getHeading() || 0) + 30
                          )
                        }
                      >
                        <Compass className="w-3.5 h-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Draai</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
