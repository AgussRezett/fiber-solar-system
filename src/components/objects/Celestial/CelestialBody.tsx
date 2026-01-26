import { useEffect, useRef } from 'react';
import type { Group, Mesh } from 'three';
import * as THREE from 'three';

import {
  DISTANCE_KM_TO_UNITS,
  RADIUS_KM_TO_UNITS,
} from '../../../consts/scales';


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
import { useCelestialMotion } from './hooks/useCelestialMotion';
import CelestialPlanetMesh from './CelestialPlanetMesh';
import PlanetLabel from './components/PlanetLabel/PlanetLabel';
import OrbitPath from './components/OrbitPath';

interface Props {
  data: CelestialBodyInterface;
  children?: React.ReactNode;
}

const CelestialBody = ({ data, children }: Props) => {
  const bodyRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const cloudRef = useRef<Group>(null);


  useEffect(() => {
    if (bodyRef.current) useCameraStore.getState().registerBody(data.id, bodyRef.current);
  }, [data.id]);

  const visuals: CelestialVisualInterface =
    CELESTIAL_VISUALS[data.id] ??
    DEFAULT_VISUALS_BY_TYPE[data.type as keyof typeof DEFAULT_VISUALS_BY_TYPE];

  const radius = data.radiusKm * RADIUS_KM_TO_UNITS;

  const axialTilt = data.rotation?.axialTiltDeg
    ? THREE.MathUtils.degToRad(data.rotation.axialTiltDeg)
    : 0;

  const hover = useCelestialHover(meshRef, visuals.shininess ?? 30);

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

  useCelestialMotion({
    meshRef,
    cloudRef,
    rotationPeriodHours: data.rotation?.periodHours,
  });

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


        <CelestialPlanetMesh
          ref={meshRef}
          cloudRef={cloudRef}
          planetId={data.id}
          visuals={visuals}
          radius={radius}
          axialTilt={axialTilt}
          onPointerDown={() => useCameraStore.getState().startOrbitById?.(data.id)}
          onPointerUp={() => useCameraStore.getState().startOrbitById?.(data.id)}
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
