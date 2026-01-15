import { useTexture } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import type { Group, Mesh } from 'three';
import * as THREE from 'three';

import {
  DISTANCE_KM_TO_UNITS,
  RADIUS_KM_TO_UNITS,
} from '../../../consts/scales';

import CelestialFeatures from './CelestialFeatures';
import CelestialPlanetMesh from './CelestialPlanetMesh';
import PlanetLabel from './components/PlanetLabel/PlanetLabel';

import { useCelestialHover } from './hooks/useCelestialHover';

import {
  CELESTIAL_VISUALS,
  DEFAULT_VISUALS_BY_TYPE,
  type CelestialVisualInterface,
} from '../../../visuals/celestialVisuals';

import { useCameraStore } from '../../../store/useCameraStore';
import type { CelestialBodyInterface } from '../../../types/celestialBody.type';
import { dateToJulianDay } from './utils/dateToJulian';
import { SIMULATION_DATE } from './consts/simulationTime';
import { calculateOrbitalPosition } from './utils/orbitPosition';
import OrbitPath from './components/OrbitPath';

interface Props {
  data: CelestialBodyInterface;
  children?: React.ReactNode;
}

const CelestialBody = ({ data, children }: Props) => {
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

  const textures = useTexture(
    Object.fromEntries(
      Object.entries({
        map: visuals.map,
        normalMap: visuals.normalMap,
        specularMap: visuals.specularMap,
        displacementMap: visuals.displacementMap,
      }).filter(([, v]) => v !== undefined)
    ) as Record<string, string>
  );

  const radius = data.radiusKm * RADIUS_KM_TO_UNITS;

  const axialTilt = data.rotation?.axialTiltDeg
    ? THREE.MathUtils.degToRad(data.rotation.axialTiltDeg)
    : 0;

  const hover = useCelestialHover(meshRef, visuals.shininess ?? 30);

  // ✅ POSICIÓN ORBITAL ÚNICA (fuente de verdad)
  useEffect(() => {
    if (!data.orbit || !bodyRef.current) return;

    const jd = dateToJulianDay(SIMULATION_DATE);

    const posKm = calculateOrbitalPosition({
      ...data.orbit,
      currentJulianDay: jd,
    });

    bodyRef.current.position.set(
      posKm.x * DISTANCE_KM_TO_UNITS,
      posKm.y * DISTANCE_KM_TO_UNITS,
      posKm.z * DISTANCE_KM_TO_UNITS
    );
  }, [data.orbit]);

  return (
    <>
      {data.orbit && (
        <OrbitPath
          orbit={data.orbit}
          referenceRadiusKm={data.radiusKm}
          bodyRef={bodyRef}
          color={data.color}
        />
      )}

      <group ref={bodyRef}>
        <CelestialFeatures
          features={visuals.features}
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
    </>
  );
};

export default CelestialBody;
