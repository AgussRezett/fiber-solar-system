import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface OrbitPathProps {
  radius: number;
  segments?: number;
  color?: string;
  inclinationDeg?: number;
}

const OrbitPath = ({
  radius,
  segments = 128,
  color = '#ffffff',
  inclinationDeg = 0,
}: OrbitPathProps) => {
  const points: THREE.Vector3[] = [];

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius)
    );
  }

  // Convertir color hex a rgba con transparencia
  const hexToRgba = (hex: string, alpha: number = 0.4): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const orbitColor = color.startsWith('#') ? hexToRgba(color, 0.5) : color;

  return (
    <group rotation={[THREE.MathUtils.degToRad(inclinationDeg), 0, 0]}>
      <Line points={points} color={orbitColor} lineWidth={1.5} dashed={false} />
    </group>
  );
};

export default OrbitPath;
