import * as THREE from 'three';

interface OrbitParams {
  semiMajorAxisKm: number;
  eccentricity: number;
  inclinationDeg: number;
  longitudeOfAscendingNodeDeg: number;
  argumentOfPeriapsisDeg: number;

  // modo tiempo
  meanAnomalyAtEpochDeg?: number;
  periodDays?: number;
  epochJulianDay?: number;
  currentJulianDay?: number;

  // modo directo
  trueAnomalyOverride?: number;
}

export function calculateOrbitalPosition(params: OrbitParams) {
  const {
    semiMajorAxisKm: a,
    eccentricity: e,
    inclinationDeg,
    longitudeOfAscendingNodeDeg,
    argumentOfPeriapsisDeg,
    trueAnomalyOverride,
  } = params;

  let ν: number;

  // =========================
  // 🔑 MODO 1: anomalía directa
  // =========================
  if (typeof trueAnomalyOverride === 'number') {
    ν = trueAnomalyOverride;
  } else {
    // =========================
    // 🔑 MODO 2: basado en tiempo
    // =========================
    const {
      meanAnomalyAtEpochDeg,
      periodDays,
      epochJulianDay,
      currentJulianDay,
    } = params;

    if (
      meanAnomalyAtEpochDeg === undefined ||
      periodDays === undefined ||
      epochJulianDay === undefined ||
      currentJulianDay === undefined
    ) {
      throw new Error(
        'calculateOrbitalPosition: faltan parámetros orbitales temporales'
      );
    }

    const n = (2 * Math.PI) / periodDays;
    const M =
      THREE.MathUtils.degToRad(meanAnomalyAtEpochDeg) +
      n * (currentJulianDay - epochJulianDay);

    // resolver ecuación de Kepler (simple)
    let E = M;
    for (let i = 0; i < 6; i++) {
      E = M + e * Math.sin(E);
    }

    ν =
      2 *
      Math.atan2(
        Math.sqrt(1 + e) * Math.sin(E / 2),
        Math.sqrt(1 - e) * Math.cos(E / 2)
      );
  }

  // =========================
  // Transformación espacial
  // =========================
  const r = (a * (1 - e * e)) / (1 + e * Math.cos(ν));

  const i = THREE.MathUtils.degToRad(inclinationDeg);
  const Ω = THREE.MathUtils.degToRad(longitudeOfAscendingNodeDeg);
  const ω = THREE.MathUtils.degToRad(argumentOfPeriapsisDeg);

  const cosΩ = Math.cos(Ω);
  const sinΩ = Math.sin(Ω);
  const cosi = Math.cos(i);
  const sini = Math.sin(i);
  const cosων = Math.cos(ω + ν);
  const sinων = Math.sin(ω + ν);

  const x = r * (cosΩ * cosων - sinΩ * sinων * cosi);
  const y = r * (sinΩ * cosων + cosΩ * sinων * cosi);
  const z = r * (sinων * sini);

  return { x, y, z };
}
