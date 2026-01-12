import * as THREE from 'three';

type Props = {
  radius: number;
  color: string;
  opacity: number;
  scale: number;
  normalMap?: THREE.Texture;
  normalScale?: number;
};

const Atmosphere = ({
  radius,
  color,
  opacity,
  scale,
  normalMap,
  normalScale = 0.15,
}: Props) => {
  return (
    <mesh scale={scale}>
      <sphereGeometry args={[radius, 96, 96]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.BackSide}
        depthWrite={false}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(normalScale, normalScale)}
      />
    </mesh>
  );
};

export default Atmosphere;
