import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils, Mesh } from 'three';
import Moon from '../Moon/Moon';

interface EarthProps {
  displacementScale?: number;
}

const EARTH_TILT = MathUtils.degToRad(23.44);
const EARTH_ROTATION_SPEED = 0.05; // visual, no física real

const Earth = ({ displacementScale = 0.02 }: EarthProps) => {
  const [earthMap, earthNormalMap, earthSpecularMap, earthDisplacementMap] =
    useTexture([
      '/assets/earth_daymap.jpg',
      '/assets/earth_normal_map.png',
      '/assets/earth_specular_map.png',
      '/assets/earth_displacement_map.jpg',
    ]);

  const earthRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!earthRef.current) return;
    earthRef.current.rotation.y += delta * EARTH_ROTATION_SPEED;
  });

  return (
    <group>
      <mesh ref={earthRef} rotation={[0, 0, EARTH_TILT]} receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial
          map={earthMap}
          normalMap={earthNormalMap}
          specularMap={earthSpecularMap}
          displacementMap={earthDisplacementMap}
          displacementScale={displacementScale}
          shininess={30}
        />
      </mesh>
      <Moon />
    </group>
  );
};

export default Earth;
