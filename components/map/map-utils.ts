export type LatLng = google.maps.LatLngLiteral;
export type MarkerColor = 'orange' | 'blue' | 'red' | 'purple';

export function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const n = parseFloat(value.replace(',', '.'));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function parseGroupPosition(record: unknown): LatLng | null {
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
    if (parts.length >= 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1]))
      return { lat: parts[0], lng: parts[1] };
  }
  return null;
}

export function parseGroupId(record: unknown): string {
  const obj = record as Record<string, unknown>;
  if (obj['id']) return String(obj['id']);
  if (obj['slug']) return String(obj['slug']);
  if (obj['code']) return String(obj['code']);
  if (obj['name']) return String(obj['name']);
  return Math.random().toString(36).slice(2);
}

export function parseGroupName(record: unknown): string {
  const obj = record as Record<string, unknown>;
  if (obj['name']) return String(obj['name']);
  if (obj['title']) return String(obj['title']);
  if (obj['group']) return String(obj['group']);
  return 'Onbekend';
}

export function extractDetail<T = unknown>(
  rec: Record<string, unknown>,
  key: string
): T | null {
  if (key in rec && rec[key] != null) return rec[key] as T;
  return null;
}

export function convexHullLatLng(points: LatLng[]): LatLng[] {
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

export function colorStyles(c: MarkerColor): {
  fillColor: string;
  strokeColor: string;
} {
  if (c === 'orange') return { fillColor: '#f97316', strokeColor: '#f97316' };
  if (c === 'blue') return { fillColor: '#3b82f6', strokeColor: '#3b82f6' };
  if (c === 'red') return { fillColor: '#ef4444', strokeColor: '#ef4444' };
  return { fillColor: '#a855f7', strokeColor: '#a855f7' };
}

export function rdToWgs(x: number, y: number): LatLng {
  const x0 = 155000;
  const y0 = 463000;
  const phi0 = 52.1551744;
  const lam0 = 5.38720621;
  const dx = (x - x0) * 1e-5;
  const dy = (y - y0) * 1e-5;
  const phi =
    phi0 +
    (3235.65389 * dy +
      -32.58297 * dx * dx +
      -0.2475 * dy * dy +
      -0.84978 * dx * dx * dy +
      -0.0655 * dy * dy * dy +
      -0.01709 * dx * dx * dy * dy +
      -0.00738 * dx +
      0.0053 * Math.pow(dx, 4) +
      -0.00039 * dx * dx * Math.pow(dy, 3) +
      0.00033 * Math.pow(dx, 3) +
      -0.00012 * dx * dx * Math.pow(dy, 4)) /
      3600;
  const lam =
    lam0 +
    (5260.52916 * dx +
      105.94684 * dx * dy +
      2.45656 * dx * dy * dy +
      -0.81885 * Math.pow(dx, 3) +
      0.05594 * dx * Math.pow(dy, 3) +
      -0.05607 * Math.pow(dx, 3) * dy +
      0.01199 * dy +
      -0.00256 * Math.pow(dx, 3) * dy * dy +
      0.00128 * dx * Math.pow(dy, 4) +
      0.00022 * dy * dy +
      -0.00022 * dx * dx +
      0.00026 * Math.pow(dx, 5)) /
      3600;
  return { lat: phi, lng: lam };
}

export function parseCoordInput(val: string): LatLng | null {
  const s = val.trim();
  if (!s) return null;
  const parts = s.replace(',', ' ').split(/\s+/).filter(Boolean);
  if (parts.length !== 2) return null;
  const a = parts[0];
  const b = parts[1];
  const fa = parseFloat(a);
  const fb = parseFloat(b);
  if (
    a.includes('.') ||
    a.includes(',') ||
    b.includes('.') ||
    b.includes(',')
  ) {
    if (
      isFinite(fa) &&
      isFinite(fb) &&
      Math.abs(fa) <= 90 &&
      Math.abs(fb) <= 180
    ) {
      return { lat: fa, lng: fb };
    }
    return null;
  }
  const xa = parseInt(a, 10);
  const yb = parseInt(b, 10);
  if (!Number.isFinite(xa) || !Number.isFinite(yb)) return null;
  let x = xa;
  let y = yb;
  if (x < 10000) x *= 100;
  else if (x < 100000) x *= 10;
  if (y < 10000) y *= 100;
  else if (y < 100000) y *= 10;
  return rdToWgs(x, y);
}

export function isWithinNetherlands(pos: LatLng): boolean {
  const { lat, lng } = pos;
  return lat >= 50.5 && lat <= 53.7 && lng >= 3.3 && lng <= 7.3;
}
