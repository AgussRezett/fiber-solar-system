import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Canvas camera={{ fov: 75, near: 0.1, position: [0, 5, 5] }} shadows>
      <OrbitControls
        minDistance={1.8}
        maxDistance={260}
        enableDamping
        dampingFactor={0.05}
      />
      <App />
      {/* <Perf /> */}
    </Canvas>
  </StrictMode>
);
