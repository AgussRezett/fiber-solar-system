import { useTexture } from '@react-three/drei';
import {
  DISTANCE_KM_TO_UNITS,
  RADIUS_KM_TO_UNITS,
} from '../../../consts/scales';
import CelestialFeatures from './CelestialFeatures';
import CelestialPlanetMesh from './CelestialPlanetMesh';
import OrbitPath from './components/OrbitPath';
import PlanetLabel from './components/PlanetLabel/PlanetLabel';
import { useCelestialHover } from './hooks/useCelestialHover';
import { useCelestialMotion } from './hooks/useCelestialMotion';
import {
  CELESTIAL_VISUALS,
  DEFAULT_VISUALS_BY_TYPE,
  type CelestialVisualInterface,
} from '../../../visuals/celestialVisuals';
import { useCameraStore } from '../../../store/useCameraStore';
import { useEffect, useRef } from 'react';
import type { Group, Mesh } from 'three';
import * as THREE from 'three';
import type { CelestialBodyInterface } from '../../../types/celestialBody.type';

interface Props {
  data: CelestialBodyInterface;
  children?: React.ReactNode;
}

const CelestialBody = ({ data, children }: Props) => {
  const orbitRef = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const cloudRef = useRef<Group>(null);

  const { startOrbitById, registerBody } = useCameraStore();

  useEffect(() => {
    if (bodyRef.current) registerBody(data.id, bodyRef.current);
  }, [data.id, registerBody]);

  const visuals: CelestialVisualInterface =
    CELESTIAL_VISUALS[data.id] ??
    DEFAULT_VISUALS_BY_TYPE[data.type as keyof typeof DEFAULT_VISUALS_BY_TYPE];

  const features = visuals.features;

  const rawTexture = {
    map: visuals.map,
    normalMap: visuals.normalMap,
    specularMap: visuals.specularMap,
    displacementMap: visuals.displacementMap,
  };
  const textures = useTexture(
    Object.fromEntries(
      Object.entries(rawTexture).filter(([, v]) => v !== undefined)
    ) as Record<string, string>
  );

  const orbitRadius = data.orbit?.radiusKm
    ? data.orbit.radiusKm * DISTANCE_KM_TO_UNITS
    : 0;

  const orbitSpeed = data.orbit?.periodDays
    ? (2 * Math.PI) / data.orbit.periodDays
    : 0;

  const rotationSpeed = data.rotation?.periodHours
    ? (2 * Math.PI) / data.rotation.periodHours
    : 0;

  const radius = data.radiusKm * RADIUS_KM_TO_UNITS;

  const axialTilt = data.rotation?.axialTiltDeg
    ? THREE.MathUtils.degToRad(data.rotation.axialTiltDeg)
    : 0;

  useCelestialMotion({
    orbitRef,
    meshRef,
    cloudRef,
    orbitSpeed,
    rotationSpeed,
    hasClouds: !!features?.clouds,
  });

  const hover = useCelestialHover(meshRef, visuals.shininess ?? 30);

  return (
    <group ref={orbitRef}>
      {data.orbit && (
        <OrbitPath
          radius={orbitRadius}
          inclinationDeg={data.orbit.inclinationDeg}
          color={data.color || '#ffffff'}
          planetRadius={radius}
          planetRef={bodyRef}
        />
      )}

      <group ref={bodyRef} position={[orbitRadius, 0, 0]}>
        <CelestialFeatures
          features={features}
          radius={radius}
          axialTilt={axialTilt}
          cloudRef={cloudRef}
          textures={textures}
          displacementScale={visuals.displacementScale ?? 0}
        />

        <CelestialPlanetMesh
          ref={meshRef}
          radius={radius}
          textures={textures}
          axialTilt={axialTilt}
          displacementScale={visuals.displacementScale ?? 0}
          shininess={visuals.shininess ?? 30}
          onClick={() => startOrbitById?.(data.id)}
          onHoverStart={hover.onHoverStart}
          onHoverEnd={hover.onHoverEnd}
        />

        {(data.type === 'planet' || data.type === 'star') && (
          <PlanetLabel
            name={data.name}
            color={data.color}
            planetId={data.id}
            planetRadius={radius}
          />
        )}

        {children}
      </group>
    </group>
  );
};

export default CelestialBody;
