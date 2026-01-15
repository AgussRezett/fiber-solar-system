import type { CelestialBodyId } from '../visuals/celestialVisuals';

export interface CelestialBodyInterface {
  id: CelestialBodyId;
  type: string;
  name?: string;
  color?: string;
  parentId?: string;
  radiusKm: number;
  orbit?: {
    semiMajorAxisKm: number;
    eccentricity: number;
    inclinationDeg: number;
    longitudeOfAscendingNodeDeg: number;
    argumentOfPeriapsisDeg: number;
    meanAnomalyAtEpochDeg: number;
    periodDays: number;
    epochJulianDay: number;
  } | null;
  rotation: {
    periodHours: number;
    axialTiltDeg: number;
  };
}
