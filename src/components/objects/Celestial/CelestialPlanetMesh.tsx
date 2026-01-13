import { forwardRef } from 'react';
import * as THREE from 'three';

type Props = {
  radius: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  textures: any;
  axialTilt: number;
  displacementScale: number;
  shininess: number;
  onClick: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
};

const CelestialPlanetMesh = forwardRef<THREE.Mesh, Props>(
  (
    {
      radius,
      textures,
      axialTilt,
      displacementScale,
      shininess,
      onClick,
      onHoverStart,
      onHoverEnd,
    },
    ref
  ) => {
    return (
      <mesh
        ref={ref}
        rotation={[0, 0, axialTilt]}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          onHoverStart();
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          onHoverEnd();
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshPhongMaterial
          {...textures}
          displacementScale={displacementScale}
          shininess={shininess}
        />
      </mesh>
    );
  }
);

export default CelestialPlanetMesh;
