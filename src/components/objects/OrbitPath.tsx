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
  color = '#ffffff33',
  inclinationDeg = 0,
}: OrbitPathProps) => {
  const points: THREE.Vector3[] = [];

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(
      new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius)
    );
  }

  return (
    <group rotation={[THREE.MathUtils.degToRad(inclinationDeg), 0, 0]}>
      <Line points={points} color={color} lineWidth={1} dashed={false} />
    </group>
  );
};

export default OrbitPath;
