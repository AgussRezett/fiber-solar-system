export interface CelestialBodyInterface {
  id: string;
  type: string;
  parent?: string;
  radiusKm: number;
  orbit?: {
    radiusKm: number;
    periodDays: number;
    inclinationDeg: number;
  } | null;
  rotation: {
    periodHours: number;
    axialTiltDeg: number;
  };
}
