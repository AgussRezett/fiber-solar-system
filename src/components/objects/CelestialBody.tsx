import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
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
import { useCameraStore } from '../../store/useCameraStore';
import OrbitPath from './OrbitPath';
import PlanetRings from './PlanetRings';
import Atmosphere from './Atmosphere';

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
    if (bodyRef.current) {
      registerBody(data.id, bodyRef.current);
    }
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

    if (cloudRef.current && features?.clouds) {
      cloudRef.current.rotation.y += rotationSpeed * delta;
    }
  });

  const [isHovered, setIsHovered] = useState(false);

  const radiusUnits = data.radiusKm * RADIUS_KM_TO_UNITS;

  const axialTilt = data.rotation?.axialTiltDeg
    ? THREE.MathUtils.degToRad(data.rotation.axialTiltDeg)
    : 0;

  const cloudTexture = features?.clouds?.map
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useTexture(features.clouds.map)
    : null;

  return (
    <group ref={orbitRef}>
      <axesHelper args={[5]} />
      {data.orbit && (
        <OrbitPath
          radius={orbitRadius}
          inclinationDeg={data.orbit.inclinationDeg}
          color="white"
        />
      )}
      <group ref={bodyRef} position={[orbitRadius, 0, 0]}>
        {features?.rings && (
          <group rotation={[0, 0, axialTilt]}>
            <PlanetRings radius={radiusUnits} {...features.rings} />
          </group>
        )}
        {features?.atmosphere && (
          <Atmosphere
            radius={radiusUnits}
            {...features.atmosphere}
            normalMap={textures.displacementMap}
            normalScale={0.1}
          />
        )}
        {features?.clouds && cloudTexture && (
          <group ref={cloudRef} rotation={[0, 0, axialTilt]}>
            <mesh>
              <sphereGeometry
                args={[radiusUnits * (features.clouds.scale ?? 1.01), 96, 96]}
              />
              <meshPhongMaterial
                normalMap={textures.normalMap}
                normalScale={new THREE.Vector2(0.2, 0.2)}
                map={cloudTexture}
                transparent
                opacity={features.clouds.opacity}
                depthWrite={false}
                side={THREE.DoubleSide}
                displacementMap={textures.displacementMap}
                displacementScale={
                  radiusUnits * ((visuals?.displacementScale ?? 0) * 0.1)
                }
                shininess={5}
              />
            </mesh>
          </group>
        )}

        <mesh
          ref={meshRef}
          rotation={[0, 0, axialTilt]}
          castShadow
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            startOrbitById && startOrbitById(data.id);
          }}
          onPointerEnter={(event) => (
            event.stopPropagation(),
            setIsHovered(true),
            (document.body.style.cursor = 'pointer')
          )}
          onPointerLeave={() => (
            setIsHovered(false),
            (document.body.style.cursor = 'default')
          )}
        >
          <sphereGeometry args={[data.radiusKm * RADIUS_KM_TO_UNITS, 32, 32]} />
          {visuals.material === 'basic' ? (
            <meshStandardMaterial
              {...textures}
              emissive={visuals.emissive ? new THREE.Color('red') : undefined}
              emissiveIntensity={isHovered ? 0.6 : 0}
            />
          ) : (
            <meshPhongMaterial
              {...textures}
              displacementScale={visuals.displacementScale ?? 0}
              emissive={
                isHovered
                  ? new THREE.Color('#ffffff')
                  : new THREE.Color('#000000')
              }
              shininess={isHovered ? 80 : visuals.shininess}
            />
          )}
        </mesh>
        {children}
      </group>
    </group>
  );
};

export default CelestialBody;
