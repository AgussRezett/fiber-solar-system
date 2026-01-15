import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { DISTANCE_KM_TO_UNITS, GALAXY_RADIUS_KM } from '../consts/scales';

const GalaxyBackground = () => {
  const texture = useTexture('/assets/stars_milky_way.jpg');
  const galaxyRef = useRef<THREE.Mesh>(null);

  useFrame(({ camera }) => {
    if (!galaxyRef.current) return;

    galaxyRef.current.position.copy(camera.position);
  });

  return (
    <mesh ref={galaxyRef}>
      <sphereGeometry
        args={[GALAXY_RADIUS_KM * DISTANCE_KM_TO_UNITS, 64, 64]}
      />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
};

export default GalaxyBackground;
