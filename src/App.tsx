import { useHelper } from '@react-three/drei';
import AnimatedStars from './components/molecules/AnimatedStars';
import Earth from './components/molecules/CelestialBodies/Earth/Earth';
import { useRef } from 'react';
import { DirectionalLight, DirectionalLightHelper } from 'three';

const App = () => {
  const directionalLightRef = useRef<DirectionalLight>(null!);

  useHelper(directionalLightRef, DirectionalLightHelper, 1, 'hotpink');

  return (
    <>
      <color attach={'background'} args={['#01010a']}></color>
      <AnimatedStars />
      <Earth displacementScale={0.15} />
      <directionalLight
        ref={directionalLightRef}
        position={[0, 0, 5]}
        intensity={2}
        castShadow
      />
      {/* <ambientLight intensity={2} /> */}
    </>
  );
};

export default App;
