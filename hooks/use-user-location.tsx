'use client';
import { useEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import { createRoot, Root } from 'react-dom/client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { Button } from '../components/ui/button';
import { User } from 'lucide-react';

export type LatLng = google.maps.LatLngLiteral;

export type UseUserLocationResult = {
  locationError: string | null;
  requestLocation: () => void;
  clearLocationError: () => void;
};

export function useUserLocation(
  isReady: boolean,
  mapRef: MutableRefObject<google.maps.Map | null>,
  mapId?: string
): UseUserLocationResult {
  const userMarkerRef = useRef<
    | google.maps.marker.AdvancedMarkerElement
    | google.maps.Marker
    | google.maps.OverlayView
    | null
  >(null);
  const userMarkerRootRef = useRef<Root | null>(null);
  const userMarkerContainerRef = useRef<HTMLDivElement | null>(null);
  const geoWatchIdRef = useRef<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!isReady || !mapRef.current) return;
    const hasGeo = typeof navigator !== 'undefined' && !!navigator.geolocation;
    if (!hasGeo) return;
    function renderUserMarkerContent(container: HTMLElement) {
      const root = createRoot(container);
      userMarkerRootRef.current = root;
      root.render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className={
                  'relative h-8 w-8 rounded-md p-0 font-semibold bg-secondary text-secondary-foreground border-2 border-transparent shadow-sm flex items-center justify-center hover:bg-secondary hover:opacity-100 focus-visible:outline-none'
                }
                aria-label={`Mijn locatie`}
              >
                <User className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.06)]" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mijn locatie</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    function createOrUpdateUserMarker(pos: LatLng) {
      if (userMarkerRef.current) {
        const m = userMarkerRef.current as google.maps.Marker;
        if (typeof (m as any).setPosition === 'function') {
          m.setPosition(pos as any);
          return;
        }
        const adv =
          userMarkerRef.current as google.maps.marker.AdvancedMarkerElement & {
            position?: LatLng;
          };
        if (adv && 'position' in adv) {
          (adv as any).position = pos;
          return;
        }
        const ov = userMarkerRef.current as google.maps.OverlayView & {
          position?: LatLng;
          draw?: () => void;
        };
        if (ov && 'position' in ov) {
          (ov as any).position = pos;
          if (typeof ov.draw === 'function') ov.draw();
          return;
        }
      }
      if (mapId && google.maps.marker?.AdvancedMarkerElement) {
        const container = document.createElement('div');
        userMarkerContainerRef.current = container;
        renderUserMarkerContent(container);
        const adv = new google.maps.marker.AdvancedMarkerElement({
          position: pos,
          map: mapRef.current!,
          content: container,
        });
        userMarkerRef.current = adv;
        return;
      }
      if (google.maps.OverlayView) {
        class DomUserMarker extends google.maps.OverlayView {
          position: LatLng;
          container: HTMLDivElement;
          constructor(p: LatLng, content: HTMLElement) {
            super();
            this.position = p;
            this.container = document.createElement('div');
            this.container.style.position = 'absolute';
            this.container.appendChild(content);
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
            this.container.remove();
          }
        }
        const container = document.createElement('div');
        userMarkerContainerRef.current = container;
        renderUserMarkerContent(container);
        const domMarker = new DomUserMarker(pos, container);
        domMarker.setMap(mapRef.current!);
        userMarkerRef.current = domMarker;
        return;
      }
      const size = 28;
      const bg = '#ffffff';
      const border = '#e5e7eb';
      const radius = 6;
      const headR = 4;
      const headCx = size / 2;
      const headCy = 10;
      const bodyW = 10;
      const bodyH = 8;
      const bodyX = headCx - bodyW / 2;
      const bodyY = headCy + 3;
      const badgeR = 4;
      const cx = size - badgeR - 2;
      const cy = badgeR + 2;
      const glyph = `
        <circle cx='${headCx}' cy='${headCy}' r='${headR}' fill='#111827' />
        <rect x='${bodyX}' y='${bodyY}' rx='3' ry='3' width='${bodyW}' height='${bodyH}' fill='#111827' />
      `;
      const svg = `<?xml version='1.0'?>
        <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>
          <rect x='0.5' y='0.5' rx='${radius}' ry='${radius}' width='${
        size - 1
      }' height='${size - 1}' fill='${bg}' stroke='${border}'/>
          ${glyph}
          <circle cx='${cx}' cy='${cy}' r='${badgeR}' fill='#ef4444' stroke='#ffffff' stroke-width='1.5' />
        </svg>`;
      const url = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
      const marker = new google.maps.Marker({
        position: pos,
        map: mapRef.current!,
        icon: {
          url,
          size: new google.maps.Size(size, size),
          scaledSize: new google.maps.Size(size, size),
          anchor: new google.maps.Point(size / 2, size / 2),
        },
      });
      userMarkerRef.current = marker;
    }
    const watchId = navigator.geolocation.watchPosition(
      (p) => {
        createOrUpdateUserMarker({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
        });
        if (locationError) setLocationError(null);
      },
      (e) => {
        const msg =
          e && typeof e === 'object' && 'code' in e
            ? (e as GeolocationPositionError).code === 1
              ? 'Locatie geblokkeerd. Sta locatie toe in je browser en probeer opnieuw.'
              : (e as GeolocationPositionError).code === 2
              ? 'Locatie niet beschikbaar.'
              : 'Locatie aanvraag verlopen.'
            : 'Kon locatie niet ophalen.';
        setLocationError(msg);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 }
    );
    geoWatchIdRef.current = watchId;
    return () => {
      if (geoWatchIdRef.current != null) {
        try {
          navigator.geolocation.clearWatch(geoWatchIdRef.current);
        } catch {}
        geoWatchIdRef.current = null;
      }
      if (userMarkerRef.current) {
        try {
          detachMarker(userMarkerRef.current);
        } catch {}
        userMarkerRef.current = null;
      }
      if (userMarkerRootRef.current) {
        try {
          userMarkerRootRef.current.unmount();
        } catch {}
        userMarkerRootRef.current = null;
      }
      userMarkerContainerRef.current = null;
    };
  }, [isReady, mapId, locationError]);

  function requestLocation() {
    try {
      navigator.geolocation.getCurrentPosition(
        (p) => {
          const pos = { lat: p.coords.latitude, lng: p.coords.longitude };
          const m = mapRef.current;
          if (m) {
            const currentZoom = m.getZoom() ?? 9;
            if (currentZoom < 15) m.setZoom(15);
            m.panTo(pos);
          }
          setLocationError(null);
        },
        (e) => {
          const msg =
            e && typeof e === 'object' && 'code' in e
              ? (e as GeolocationPositionError).code === 1
                ? 'Locatie geblokkeerd. Sta locatie toe in je browser en probeer opnieuw.'
                : (e as GeolocationPositionError).code === 2
                ? 'Locatie niet beschikbaar.'
                : 'Locatie aanvraag verlopen.'
              : 'Kon locatie niet ophalen.';
          setLocationError(msg);
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
      );
    } catch {}
  }

  function clearLocationError() {
    setLocationError(null);
  }

  return { locationError, requestLocation, clearLocationError };
}

export default useUserLocation;
