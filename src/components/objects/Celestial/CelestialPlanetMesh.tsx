import { forwardRef } from 'react';
import * as THREE from 'three';

type Props = {
  radius: number;
  material: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  textures: any;
  axialTilt: number;
  displacementScale: number;
  shininess: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emissive: any;
  onPointerDown: () => void;
  onPointerUp: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
};

const CelestialPlanetMesh = forwardRef<THREE.Mesh, Props>(
  (
    props,
    ref
  ) => {

    return (
      <mesh
        ref={ref}
        rotation={[0, 0, props.axialTilt]}
        castShadow
        receiveShadow
        onPointerUp={() => props.onPointerUp()}
        onPointerDown={() => props.onPointerDown()}
        onPointerEnter={(e) => {
          e.stopPropagation();
          props.onHoverStart();
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          props.onHoverEnd();
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[props.radius, 32, 32]} />
        {
          props.material === 'basic' ?
            <meshBasicMaterial
              {...props.textures}
            /> :
            <meshPhongMaterial
              {...props.textures}
              displacementScale={props.displacementScale}
              shininess={props.shininess}
            /* emissive={props.emissive ? new THREE.Color('#ffffff') : new THREE.Color('#000000')} */
            />
        }
      </mesh>
    );
  }
);

export default CelestialPlanetMesh;
