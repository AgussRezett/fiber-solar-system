import { useRef } from 'react';
import * as THREE from 'three';
import styles from './PlanetLabel.module.css';
import { Html } from '@react-three/drei';
import { useCameraStore } from '../../../../../store/useCameraStore';
import usePlanetDistance from '../../hooks/usePlanetDistance';

interface PlanetLabelProps {
  name?: string;
  color?: string;
  planetId: string;
  planetRadius: number;
}

const PlanetLabel = ({
  name,
  color = '#ffffff',
  planetId,
  planetRadius,
}: PlanetLabelProps) => {
  const { startOrbitById } = useCameraStore();
  const groupRef = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    startOrbitById?.(planetId);
  };

  usePlanetDistance(planetRadius, groupRef, labelRef);

  if (!name) return null;

  return (
    <group ref={groupRef}>
      <Html
        center
        position={[0, 0, 0]}
        style={{
          pointerEvents: 'auto',
          userSelect: 'none',
        }}
        transform={false}
      >
        <div
          ref={labelRef}
          className={styles.labelContainer}
          style={{ opacity: 0 }}
        >
          <div
            className={styles.orientationCircle}
            style={{ borderColor: color }}
            onClick={handleClick}
            title={`Navegar a ${name}`}
          />
          <span
            className={styles.labelText}
            onClick={handleClick}
            title={`Navegar a ${name}`}
          >
            {name}
          </span>
        </div>
      </Html>
    </group>
  );
};

export default PlanetLabel;
