import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import celestialObjects from '../data/solarSystem.json';

const GalaxyBackground = () => {
  const maxOrbitKm = Math.max(
    ...celestialObjects
      .filter((item) => item.orbit?.radiusKm)
      .map((item) => item.orbit!.radiusKm)
  );

  const texture = useTexture('/assets/stars_milky_way.jpg');

  const galaxyRef = useRef<THREE.Mesh>(null);

  useFrame(({ camera }) => {
    if (!galaxyRef.current) return;

    galaxyRef.current.position.copy(camera.position);
    galaxyRef.current.rotation.x += 0.0001;
    galaxyRef.current.rotation.y += 0.0001;
    galaxyRef.current.rotation.z += 0.0001;
  });

  return (
    <mesh ref={galaxyRef}>
      <sphereGeometry args={[maxOrbitKm, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

export default GalaxyBackground;
