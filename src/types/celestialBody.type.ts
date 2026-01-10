import type { CelestialBodyId } from '../visuals/celestialVisuals';

export interface CelestialBodyInterface {
  id: CelestialBodyId;
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
