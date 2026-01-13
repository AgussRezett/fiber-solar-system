import { useTexture } from '@react-three/drei';
import React from 'react';
import { DoubleSide, Texture, Vector2, type Group } from 'three';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  features: any;
  radius: number;
  axialTilt: number;
  cloudRef: React.RefObject<Group | null>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  textures: any;
  displacementScale: number;
};

const Clouds = ({
  features,
  radius,
  axialTilt,
  cloudRef,
  textures,
  displacementScale,
}: Props) => {
  const loadedCloudTexture = useTexture(features.clouds.map);
  const cloudTexture = (
    Array.isArray(loadedCloudTexture)
      ? loadedCloudTexture[0]
      : loadedCloudTexture
  ) as Texture;

  return (
    <group ref={cloudRef} rotation={[0, 0, axialTilt]}>
      <mesh>
        <sphereGeometry
          args={[radius * (features.clouds.scale ?? 1.01), 96, 96]}
        />
        <meshPhongMaterial
          map={cloudTexture}
          transparent
          opacity={features.clouds.opacity}
          depthWrite={false}
          side={DoubleSide}
          normalMap={textures.normalMap}
          normalScale={new Vector2(0.2, 0.2)}
          displacementMap={textures.displacementMap}
          displacementScale={radius * (displacementScale * 0.1)}
          shininess={5}
        />
      </mesh>
    </group>
  );
};

export default Clouds;
