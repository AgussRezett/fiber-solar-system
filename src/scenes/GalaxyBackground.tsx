import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const GalaxyBackground = () => {
  const texture = useTexture('/assets/stars_milky_way.jpg');

  const galaxyRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!galaxyRef.current) return;

    galaxyRef.current.rotation.x += 0.0001;
    galaxyRef.current.rotation.y += 0.0001;
    galaxyRef.current.rotation.z += 0.0001;
  });

  return (
    <mesh ref={galaxyRef}>
      <sphereGeometry args={[300, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

export default GalaxyBackground;
