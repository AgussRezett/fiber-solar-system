import { useHelper } from '@react-three/drei';
import { useRef } from 'react';
import { DirectionalLight, DirectionalLightHelper } from 'three';
import SolarSystem from './components/systems/SolarSystem';
import CameraController from './components/camera/CameraController';
import GalaxyBackground from './scenes/GalaxyBackground';
import AnimatedStars from './components/effects/AnimatedStars';

const App = () => {
  const directionalLightRef = useRef<DirectionalLight>(null!);

  useHelper(directionalLightRef, DirectionalLightHelper, 1, 'hotpink');

  return (
    <>
      <color attach={'background'} args={['#01010a']}></color>
      <AnimatedStars />
      <GalaxyBackground />

      <SolarSystem />
      <CameraController />

      {/*  <directionalLight
        castShadow
        position={[0, 0, 5]}
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-bias={-0.0005}
        shadow-radius={4}
        intensity={1}
      /> */}
      <ambientLight intensity={2}></ambientLight>
    </>
  );
};

export default App;
