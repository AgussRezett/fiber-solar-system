import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import styles from './PlanetLabel.module.css';
import { Html } from '@react-three/drei';
import { useCameraStore } from '../../../../../store/useCameraStore';

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
  const { camera } = useThree();
  const { startOrbitById } = useCameraStore();
  const groupRef = useRef<THREE.Group>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const opacityRef = useRef(0);

  const handleClick = () => {
    startOrbitById?.(planetId);
  };

  useFrame((state) => {
    if (!groupRef.current || !labelRef.current) return;

    // Obtener posición mundial del grupo
    const worldPosition = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPosition);

    // Calcular distancia de la cámara al planeta
    const distance = camera.position.distanceTo(worldPosition);

    // Calcular tamaño aparente del planeta en píxeles
    // Usamos la proyección de la cámara para calcular el tamaño en pantalla
    const { size } = state;
    const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 50;
    const fovRad = THREE.MathUtils.degToRad(fov);

    // Calcular tamaño aparente del planeta en píxeles
    // Proyectar el radio del planeta a la pantalla
    const planetDiameter = planetRadius * 2;
    const screenHeight = size.height;

    // Calcular el tamaño aparente usando proyección de perspectiva
    // Usamos la distancia de la cámara y el FOV para calcular el tamaño en pantalla
    const distanceToCamera = Math.max(distance, 0.1); // Evitar división por cero
    const apparentSize =
      (planetDiameter * screenHeight) /
      (distanceToCamera * Math.tan(fovRad / 2) * 2);

    // Mostrar el círculo cuando el planeta es pequeño en pantalla
    // Umbral: mostrar cuando el tamaño aparente es menor a 25px
    const SHOW_THRESHOLD = 25;
    const MIN_SIZE = 5; // Tamaño mínimo para mostrar (evitar mostrar cuando es demasiado pequeño)

    let opacity = 0;
    if (apparentSize > MIN_SIZE && apparentSize <= SHOW_THRESHOLD) {
      // El planeta es pequeño pero visible, mostrar el círculo
      // Interpolación suave: más visible cuando el planeta es más pequeño
      const normalizedSize =
        (apparentSize - MIN_SIZE) / (SHOW_THRESHOLD - MIN_SIZE);
      const t = Math.max(0, Math.min(1, normalizedSize));
      opacity = 1 - t; // Invertido: más pequeño = más visible
    } else if (apparentSize <= MIN_SIZE) {
      // El planeta es demasiado pequeño, mostrar completamente
      opacity = 1;
    }

    // Suavizar cambios de opacidad
    opacityRef.current += (opacity - opacityRef.current) * 0.1;

    // Actualizar opacidad del label
    labelRef.current.style.opacity = opacityRef.current.toString();
    labelRef.current.style.pointerEvents =
      opacityRef.current > 0.1 ? 'auto' : 'none';
  });

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
