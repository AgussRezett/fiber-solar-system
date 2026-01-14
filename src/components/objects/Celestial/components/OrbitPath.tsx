import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, type RefObject } from 'react';
import useOrbitPathOpacity from '../hooks/useOrbitPathOpacity';

interface OrbitPathProps {
  radius: number;
  segments?: number;
  color?: string;
  inclinationDeg?: number;
  planetRadius: number;
  planetRef: RefObject<THREE.Group | null>;
}

const OrbitPath = ({
  radius,
  segments = 128,
  color = '#ffffff',
  inclinationDeg = 0,
  planetRadius,
  planetRef,
}: OrbitPathProps) => {
  const lineRef = useRef<THREE.Line>(null);

  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius)
    );
  }

  useOrbitPathOpacity(planetRadius, planetRef, lineRef);

  return (
    <group rotation={[THREE.MathUtils.degToRad(inclinationDeg), 0, 0]}>
      <Line
        ref={lineRef}
        points={points}
        color={color}
        lineWidth={1.5}
        transparent
        opacity={0}
      />
    </group>
  );
};

export default OrbitPath;
