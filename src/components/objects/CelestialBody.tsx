import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group, Mesh } from 'three';
import * as THREE from 'three';
import type { CelestialBodyInterface } from '../../types/celestialBody.type';
import { KM_TO_UNITS } from '../../consts/scales';

interface Props {
  data: CelestialBodyInterface;
}

const CelestialBody = ({ data }: Props) => {
  const orbitRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);

  // órbita
  const orbitRadius = data.orbit?.radiusKm
    ? data.orbit.radiusKm * KM_TO_UNITS
    : 0;

  const orbitSpeed = data.orbit?.periodDays
    ? (2 * Math.PI) / data.orbit.periodDays
    : 0;

  // rotación propia
  const rotationSpeed = data.rotation?.periodHours
    ? (2 * Math.PI) / data.rotation.periodHours
    : 0;

  useFrame((_, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += orbitSpeed * delta * 0.1;
      //orbitRef.current.rotation.y += 0.002;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed * delta;
    }
  });

  return (
    <group ref={orbitRef}>
      <mesh
        ref={meshRef}
        position={[orbitRadius, 0, 0]}
        rotation={[
          0,
          0,
          data.rotation?.axialTiltDeg
            ? THREE.MathUtils.degToRad(data.rotation.axialTiltDeg)
            : 0,
        ]}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[data.radiusKm * KM_TO_UNITS, 32, 32]} />
        <meshPhongMaterial color="white" />
      </mesh>
    </group>
  );
};

export default CelestialBody;
