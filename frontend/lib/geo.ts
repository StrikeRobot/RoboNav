const DIRS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;

export function bearingToCardinal(deg: number): string {
  return DIRS[Math.round(deg / 45) % 8];
}

export function formatDistance(metres: number): string {
  return metres >= 1000
    ? `${(metres / 1000).toFixed(1)} km`
    : `${Math.round(metres)} m`;
}

export function formatCoord(lat: number, lon: number): string {
  return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
}
