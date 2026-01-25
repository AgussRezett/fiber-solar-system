import SolarSystem from './components/systems/SolarSystem';
import CameraController from './components/camera/CameraController';
import { useTargetHudSync } from './components/hud/TargetHudSync/TargetHudSync';
import GalaxyBackground from './scenes/GalaxyBackground';
import SunLight from './components/effects/SunLight/SunLight';

const App = () => {
  useTargetHudSync();

  return (
    <>
      <color attach={'background'} args={['#01010a']}></color>
      <SolarSystem />
      <SunLight />
      <CameraController />
      <GalaxyBackground />
    </>
  );
};

export default App;
