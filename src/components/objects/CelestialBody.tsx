import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
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

  // hover animation refs
  const hoverTarget = useRef(0); // 0 -> off, 1 -> hover
  const hoverValue = useRef(0);

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
      Object.entries(rawTexture).filter(([, v]) => v !== undefined)
    ) as Record<string, string>
  );

  // órbita
  const orbitRadius = data.orbit?.radiusKm
    ? data.orbit.radiusKm * DISTANCE_KM_TO_UNITS
    : 0;

  const orbitSpeed = data.orbit?.periodDays
    ? (2 * Math.PI) / data.orbit.periodDays
    : 0;

  // rotación
  const rotationSpeed = data.rotation?.periodHours
    ? (2 * Math.PI) / data.rotation.periodHours
    : 0;

  const radiusUnits = data.radiusKm * RADIUS_KM_TO_UNITS;

  const axialTilt = data.rotation?.axialTiltDeg
    ? THREE.MathUtils.degToRad(data.rotation.axialTiltDeg)
    : 0;

  const cloudTexture = features?.clouds?.map
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useTexture(features.clouds.map)
    : null;

  useFrame((_, delta) => {
    // órbita
    if (orbitRef.current) {
      orbitRef.current.rotation.y += orbitSpeed * delta * 0.1;
    }

    // rotación planeta
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed * delta;
    }

    // rotación nubes
    if (cloudRef.current && features?.clouds) {
      cloudRef.current.rotation.y += rotationSpeed * delta;
    }

    // ===== Hover ease-in-out =====
    const speed = 4;
    hoverValue.current +=
      (hoverTarget.current - hoverValue.current) * delta * speed;

    // ease-in-out senoidal
    const eased = 0.5 - 0.5 * Math.cos(Math.PI * hoverValue.current);

    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshPhongMaterial;

      mat.emissive.set('#ffffff');
      mat.emissiveIntensity = eased * 0.15;

      mat.shininess = (visuals.shininess ?? 30) + eased * 40;
    }
  });

  return (
    <group ref={orbitRef}>
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
          <Atmosphere radius={radiusUnits} {...features.atmosphere} />
        )}

        {features?.clouds && cloudTexture && (
          <group ref={cloudRef} rotation={[0, 0, axialTilt]}>
            <mesh>
              <sphereGeometry
                args={[radiusUnits * (features.clouds.scale ?? 1.01), 96, 96]}
              />
              <meshPhongMaterial
                map={cloudTexture}
                transparent
                opacity={features.clouds.opacity}
                depthWrite={false}
                side={THREE.DoubleSide}
                normalMap={textures.normalMap}
                normalScale={new THREE.Vector2(0.2, 0.2)}
                displacementMap={textures.displacementMap}
                displacementScale={
                  radiusUnits * ((visuals.displacementScale ?? 0) * 0.1)
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
            startOrbitById?.(data.id);
          }}
          onPointerEnter={(e) => {
            e.stopPropagation();
            hoverTarget.current = 1;
            document.body.style.cursor = 'pointer';
          }}
          onPointerLeave={() => {
            hoverTarget.current = 0;
            document.body.style.cursor = 'default';
          }}
        >
          <sphereGeometry args={[radiusUnits, 32, 32]} />

          <meshPhongMaterial
            {...textures}
            displacementScale={visuals.displacementScale ?? 0}
            shininess={visuals.shininess ?? 30}
          />
        </mesh>

        {children}
      </group>
    </group>
  );
};

export default CelestialBody;
