// src/utils/geo.ts
export type LatLng = { lat: number; lng: number }

function isNumberPair(x: any): x is [number, number] {
  return Array.isArray(x) && x.length >= 2 && Number.isFinite(x[0]) && Number.isFinite(x[1])
}

function ensureRingClosed(ring: [number, number][]): [number, number][] {
  if (!ring.length) return ring
  const [fx, fy] = ring[0]
  const [lx, ly] = ring[ring.length - 1]
  if (fx === lx && fy === ly) return ring
  return [...ring, [fx, fy]]
}

function guessLngLat(pair: [number, number]): [number, number] {
  const a0 = pair[0], a1 = pair[1]
  // Si parece [lat,lng], lo invertimos a [lng,lat]
  const looksLatLng = a0 >= -90 && a0 <= 90 && a1 >= -180 && a1 <= 180
  return looksLatLng ? [a1, a0] : [a0, a1]
}

// 1) De [{lat,lng}, ...] a [[[lng,lat], ...]]
export function latLngArrayToLegacyCoords(points: LatLng[]): [number, number][][] {
  if (!Array.isArray(points) || points.length < 3) return []
  const ring: [number, number][] = points.map(p => [Number(p.lng), Number(p.lat)])
  return [ensureRingClosed(ring)]
}

// 2) Aplana estructuras anidadas hacia rings de pares numéricos
function extractRingsFromNested(input: any): [number, number][][] {
  if (!Array.isArray(input)) return []
  if (isNumberPair(input[0])) {
    return [input as [number, number][]]
  }
  const rings: [number, number][][] = []
  for (const part of input) {
    if (!Array.isArray(part)) continue
    if (isNumberPair(part[0])) {
      rings.push(part as [number, number][])
    } else if (Array.isArray(part[0])) {
      const sub = extractRingsFromNested(part)
      rings.push(...sub)
    }
  }
  return rings
}

// 3) Normaliza “cualquier cosa” al formato antiguo [[[lng,lat], ...]] (solo anillo exterior)
// Soporta: GeoJSON (Feature/Polygon/MultiPolygon), arrays anidados, o [{lat,lng}]
export function toLegacyPolygonCoords(input: any): [number, number][][] {
  if (!input) return []

  // GeoJSON Feature/FeatureCollection/Geometry
  if (input?.type === 'Feature') {
    return toLegacyPolygonCoords(input.geometry)
  }
  if (input?.type === 'FeatureCollection') {
    const feats = Array.isArray(input.features) ? input.features : []
    for (const f of feats) {
      const coords = toLegacyPolygonCoords(f)
      if (coords.length) return coords
    }
    return []
  }
  if (input?.type === 'Polygon') {
    // Asegura cierre del anillo exterior
    const rings = extractRingsFromNested(input.coordinates)
    if (!rings.length) return []
    return [ensureRingClosed(rings[0].map(guessLngLat))]
  }
  if (input?.type === 'MultiPolygon') {
    const rings = extractRingsFromNested(input.coordinates)
    if (!rings.length) return []
    // Toma el anillo más grande como exterior
    let best = rings[0]
    for (const r of rings) if (r.length > best.length) best = r
    return [ensureRingClosed(best.map(guessLngLat))]
  }

  // Propiedades comunes con coords crudas
  const raw = input?.poligono ?? input?.polygon ?? input?.area ?? input?.zona ?? input?.coordinates
  if (raw) {
    const rings = extractRingsFromNested(raw)
    if (rings.length) {
      let best = rings[0]
      for (const r of rings) if (r.length > best.length) best = r
      return [ensureRingClosed(best.map(guessLngLat))]
    }
  }

  // Array de objetos {lat,lng}
  if (Array.isArray(input) && input.length && typeof input[0] === 'object' && 'lat' in input[0] && 'lng' in input[0]) {
    return latLngArrayToLegacyCoords(input as LatLng[])
  }

  // Array de pares o anidados
  if (Array.isArray(input)) {
    const rings = extractRingsFromNested(input)
    if (rings.length) {
      let best = rings[0]
      for (const r of rings) if (r.length > best.length) best = r
      return [ensureRingClosed(best.map(guessLngLat))]
    }
  }

  return []
}

// 4) Crea un Feature listo para Leaflet/Map.svelte con properties
export function toPolygonFeatureFromAny(input: any, properties: any = {}) {
  const coords = toLegacyPolygonCoords(input) // [[[lng,lat], ...]]
  if (!coords.length || coords[0].length < 4) return null // 3 + cierre
  return {
    type: 'Feature',
    geometry: { type: 'Polygon', coordinates: coords },
    properties
  }
}
