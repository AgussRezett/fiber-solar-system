import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import CameraHud from './components/hud/CameraHud/CameraHud';
import { Canvas } from '@react-three/fiber';
import LoadingScreen from './components/scenes/LoadingScreen/LoadingScreen';
import { ACESFilmicToneMapping } from 'three';

createRoot(document.getElementById('root')!).render(
  <>
    <CameraHud />
    <LoadingScreen />
    <Canvas
      camera={{ position: [0, 50, 200], far: 100_000_000 }}
      shadows
      gl={{
        toneMapping: ACESFilmicToneMapping,
        toneMappingExposure: 1,
      }}
    >
      <App />
    </Canvas>
  </>
);
