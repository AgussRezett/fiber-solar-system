import { Suspense, useEffect } from "react";
import TargetHudSync from "./components/hud/TargetHudSync/TargetHudSync";
import GalaxyBackground from "./scenes/GalaxyBackground";
import CameraController from "./components/camera/CameraController";
import SunLight from "./components/effects/SunLight/SunLight";
import SolarSystem from "./components/systems/SolarSystem";
import { textureLoader } from "./components/objects/Celestial/utils/textureLoader";

const App = () => {
  useEffect(() => {
    textureLoader.preloadAllTextures();
  }, []);

  return (
    <>
      <color attach={'background'} args={['#01010a']}></color>
      <SolarSystem />
      <Suspense fallback={null}>
        <SunLight />
      </Suspense>
      <CameraController />
      <Suspense fallback={null}>
        <GalaxyBackground />
      </Suspense>
      <TargetHudSync />
    </>
  );
};

export default App;
