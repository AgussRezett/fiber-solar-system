import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import CameraHud from './components/hud/CameraHud/CameraHud';
import { Canvas } from '@react-three/fiber';

createRoot(document.getElementById('root')!).render(
  <>
    <CameraHud />
    <Canvas camera={{ position: [0, 5, 5], far: 100_000_000 }} shadows>
      <App />
    </Canvas>
  </>
);
