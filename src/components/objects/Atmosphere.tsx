import * as THREE from 'three';

type Props = {
  radius: number;
  color: string;
  opacity: number;
  scale: number;
};

const Atmosphere = ({ radius, color, opacity, scale }: Props) => {
  return (
    <mesh scale={scale}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.BackSide}
      />
    </mesh>
  );
};

export default Atmosphere;
