import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { DISTANCE_KM_TO_UNITS } from '../../../../consts/scales';
import { calculateOrbitalPosition } from '../utils/orbitPosition';
import useOrbitPathOpacity from '../hooks/useOrbitPathOpacity';

interface OrbitPathProps {
  orbit: {
    semiMajorAxisKm: number;
    eccentricity: number;
    inclinationDeg: number;
    longitudeOfAscendingNodeDeg: number;
    argumentOfPeriapsisDeg: number;
    periodDays: number;
    epochJulianDay: number;
  };
  referenceRadiusKm: number;
  bodyRef: React.RefObject<THREE.Object3D | null>;
  segments?: number;
  color?: string;
}

const OrbitPath = ({
  orbit,
  referenceRadiusKm,
  bodyRef,
  segments = 256,
  color = '#ffffff',
}: OrbitPathProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineRef = useRef<any>(null);

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];

    for (let i = 0; i <= segments; i++) {
      const ν = (i / segments) * Math.PI * 2;

      const posKm = calculateOrbitalPosition({
        ...orbit,
        trueAnomalyOverride: ν,
      });

      pts.push(
        new THREE.Vector3(
          posKm.x * DISTANCE_KM_TO_UNITS,
          posKm.y * DISTANCE_KM_TO_UNITS,
          posKm.z * DISTANCE_KM_TO_UNITS
        )
      );
    }

    return pts;
  }, [orbit, segments]);

  // 🔑 Fade orbital alineado con el cuerpo
  useOrbitPathOpacity({
    referenceRadiusKm,
    orbitCenterRef: bodyRef,
    orbitLineRef: lineRef,
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={1.25}
      transparent
      opacity={0}
    />
  );
};

export default OrbitPath;
