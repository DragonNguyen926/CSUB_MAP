import type { CampusBounds, LatLng } from "./Campus";

export type XY = { x: number; y: number }

function clamp01(value: number) {
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

// Convert real-world GPS coordinates into normalized map coordinates (0..1)
export function latLngToXY(point: LatLng, bounds: CampusBounds): XY {
  const xRaw = (point.lng - bounds.west) / (bounds.east - bounds.west)
  const yRaw = (bounds.north - point.lat) / (bounds.north - bounds.south)

  return {
    x: clamp01(xRaw),
    y: clamp01(yRaw),
  }
}

// Useful for debug: check whether user is inside the campus bounding box
export function isInsideBounds(point: LatLng, bounds: CampusBounds) {
  const insideLat = point.lat <= bounds.north && point.lat >= bounds.south
  const insideLng = point.lng >= bounds.west && point.lng <= bounds.east
  return insideLat && insideLng
}
