// ==============================
// CSUB Campus Core Geometry Data
// ==============================

// Basic geographic coordinate type
export type LatLng = {
    lat: number
    lng: number
  }
  
  // Bounding box of the CSUB campus
  // north = max latitude
  // south = min latitude
  // west  = min longitude
  // east  = max longitude
  export type CampusBounds = {
    north: number
    south: number
    west: number
    east: number
  }
  
  // ------------------------------
  // Official CSUB Campus Bounds
  // ------------------------------
  export const CSUB_BOUNDS: CampusBounds = {
    north: 35.354290925848105,
    south: 35.34303307732104,
    west: -119.11006061827734,
    east: -119.09661599443925,
  }
  
  // ------------------------------
  // Campus Center (Reference Point)
  // ------------------------------
  export const CSUB_CENTER: LatLng = {
    lat: 35.35142310548957,
    lng: -119.1031736867117,
  }
  