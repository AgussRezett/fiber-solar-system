import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group, MathUtils } from 'three';

const ISS_DISTANCE = 1.362; // Tierra radius (1) + ~400km
const ISS_ORBIT_PERIOD = 60; // segundos por vuelta (visual)
const ISS_INCLINATION = MathUtils.degToRad(51.6);

const ISS = () => {
  const { scene } = useGLTF('/assets/ISS_stationary-v1/ISS_stationary.gltf');
  const orbitRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!orbitRef.current) return;
    orbitRef.current.rotation.y += delta * ((2 * Math.PI) / ISS_ORBIT_PERIOD);
  });

  return (
    <group ref={orbitRef} rotation={[0, 0, ISS_INCLINATION]}>
      <primitive
        object={scene}
        position={[ISS_DISTANCE, 0, 0]}
        scale={0.0002}
      />
    </group>
  );
};

useGLTF.preload('/assets/ISS_stationary-v1/ISS_stationary.gltf');

export default ISS;
