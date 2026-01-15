import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import MiniSolarSystem from './MiniSolarSystem/MiniSolarSystem';
import styles from './LoadingScreen.module.css';
import { useProgress } from '@react-three/drei';

const LoadingScreen = () => {
  const { progress } = useProgress();
  const [visible, setVisible] = useState(true);
  const fadeOut = progress >= 100;

  useEffect(() => {
    if (fadeOut) {
      const timer = setTimeout(() => setVisible(false), 500);

      return () => clearTimeout(timer);
    }
  }, [fadeOut]);

  if (!visible) return null;

  return (
    <div className={`${styles.loadingScreen} ${fadeOut ? styles.fadeOut : ''}`}>
      <div className={styles.canvasWrapper}>
        <Canvas
          orthographic
          camera={{ zoom: 120, position: [0, 0, 10] }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={null}>
            <group scale={0.7}>
              <MiniSolarSystem />
            </group>
          </Suspense>
        </Canvas>
      </div>

      <div className={styles.loadingText}>Cargando</div>
    </div>
  );
};

export default LoadingScreen;
