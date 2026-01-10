import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group, Mesh } from 'three';
import * as THREE from 'three';
import type { CelestialBodyInterface } from '../../types/celestialBody.type';
import { DISTANCE_KM_TO_UNITS, RADIUS_KM_TO_UNITS } from '../../consts/scales';
import {
  CELESTIAL_VISUALS,
  DEFAULT_VISUALS_BY_TYPE,
  type CelestialVisualInterface,
} from '../../visuals/celestialVisuals';
import { useTexture } from '@react-three/drei';

interface Props {
  data: CelestialBodyInterface;
  children?: React.ReactNode;
}

const CelestialBody = ({ data, children }: Props) => {
  const orbitRef = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);

  const visuals: CelestialVisualInterface =
    CELESTIAL_VISUALS[data.id] ??
    DEFAULT_VISUALS_BY_TYPE[data.type as keyof typeof DEFAULT_VISUALS_BY_TYPE];

  const rawTexture = {
    map: visuals.map,
    normalMap: visuals.normalMap,
    specularMap: visuals.specularMap,
    displacementMap: visuals.displacementMap,
  };

  const textures = useTexture(
    Object.fromEntries(
      Object.entries(rawTexture).filter(([, value]) => value !== undefined)
    ) as Record<string, string>
  );

  // órbita
  const orbitRadius = data.orbit?.radiusKm
    ? data.orbit.radiusKm * DISTANCE_KM_TO_UNITS
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
      <axesHelper args={[5]} />
      <group ref={bodyRef} position={[orbitRadius, 0, 0]}>
        <mesh
          ref={meshRef}
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
          <sphereGeometry args={[data.radiusKm * RADIUS_KM_TO_UNITS, 32, 32]} />
          {visuals.material === 'basic' ? (
            <meshStandardMaterial
              {...textures}
              emissive={visuals.emissive ? new THREE.Color('red') : undefined}
            />
          ) : (
            <meshPhongMaterial
              {...textures}
              shininess={visuals.shininess}
              displacementScale={visuals.displacementScale}
            />
          )}
        </mesh>
        {children}
      </group>
    </group>
  );
};

export default CelestialBody;
