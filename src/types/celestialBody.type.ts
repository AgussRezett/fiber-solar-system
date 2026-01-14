import type { CelestialBodyId } from '../visuals/celestialVisuals';

export interface CelestialBodyInterface {
  id: CelestialBodyId;
  type: string;
  name?: string;
  color?: string;
  parentId?: string;
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
