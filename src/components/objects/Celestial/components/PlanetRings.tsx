import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

type Props = {
  radius: number;
  innerRadiusMultiplier: number;
  outerRadiusMultiplier: number;
  colorMap: string;
  alphaMap: string;
  opacity?: number;
};

const PlanetRings = ({
  radius,
  innerRadiusMultiplier,
  outerRadiusMultiplier,
  colorMap,
  alphaMap,
  opacity = 1,
}: Props) => {
  const textures = useTexture({
    map: colorMap,
    alphaMap,
  });

  const geometry = useMemo(() => {
    const innerRadius = radius * innerRadiusMultiplier;
    const outerRadius = radius * outerRadiusMultiplier;

    const geo = new THREE.RingGeometry(innerRadius, outerRadius, 256);

    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      const r = Math.sqrt(x * x + y * y);

      // SOLO radio -> U
      const u = (r - innerRadius) / (outerRadius - innerRadius);

      // V constante
      uv.setXY(i, u, 0.5);
    }

    uv.needsUpdate = true;
    return geo;
  }, [radius, innerRadiusMultiplier, outerRadiusMultiplier]);

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <primitive object={geometry} />
      <meshStandardMaterial
        {...textures}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        alphaTest={0.05}
        opacity={opacity}
      />
    </mesh>
  );
};

export default PlanetRings;
