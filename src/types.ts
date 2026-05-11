export interface Coordinates {
  lat: number;
  lng: number;
}

export interface RadioStation {
  id: string;
  name: string;
  type: string; // SW, MW, LW, VHF, etc.
  frequency?: string;
  location: Coordinates;
  logoUrl?: string;
  description?: string;
  createdAt: number;
}

export interface CalculationResult {
  id: string;
  p1: Coordinates;
  p2: Coordinates;
  distanceKm: number;
  distanceMiles: number;
  bearing: number;
  timestamp: number;
}

export interface AppTheme {
  primaryColor: string;
  lineColor: string;
  fontFamily: string;
  customFontUrl?: string;
}
