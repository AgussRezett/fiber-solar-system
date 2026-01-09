import { useHelper } from '@react-three/drei';
import AnimatedStars from './components/effects/AnimatedStars';
import { useRef } from 'react';
import { DirectionalLight, DirectionalLightHelper } from 'three';
import EarthSystem from './components/systems/EarthSystem/EarthSystem';
import GalaxyBackground from './scenes/GalaxyBackground';

const App = () => {
  const directionalLightRef = useRef<DirectionalLight>(null!);

  useHelper(directionalLightRef, DirectionalLightHelper, 1, 'hotpink');

  return (
    <>
      <color attach={'background'} args={['#01010a']}></color>
      <AnimatedStars />
      <GalaxyBackground />
      <EarthSystem />
      <directionalLight
        castShadow
        position={[0, 0, 5]}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={-0.0005}
        shadow-radius={4}
        intensity={1}
      />
    </>
  );
};

export default App;
