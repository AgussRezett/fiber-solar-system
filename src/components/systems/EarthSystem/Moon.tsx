import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils, Group, Mesh } from 'three';

const MOON_DISTANCE = 3;
const MOON_ORBIT_SPEED = 0.2; // visual
const MOON_TILT = MathUtils.degToRad(6.68);

const Moon = () => {
  const [moonMap] = useTexture(['/assets/moon.jpg']);

  const orbitRef = useRef<Group>(null);
  const moonRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!orbitRef.current || !moonRef.current) return;

    // órbita
    orbitRef.current.rotation.y += delta * MOON_ORBIT_SPEED;

    // rotación sincrónica
    moonRef.current.rotation.y += delta * MOON_ORBIT_SPEED;
  });

  return (
    <group ref={orbitRef} rotation={[0, 0, MOON_TILT]}>
      <mesh ref={moonRef} position={[MOON_DISTANCE, 0, 0]} castShadow>
        <sphereGeometry args={[0.27, 32, 32]} />
        <meshPhongMaterial map={moonMap} shininess={10} />
      </mesh>
    </group>
  );
};

export default Moon;
