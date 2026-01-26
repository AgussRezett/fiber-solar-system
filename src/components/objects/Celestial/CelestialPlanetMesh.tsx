
import { forwardRef, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { usePlanetTextures } from './hooks/usePlanetTexture';
import type { CelestialVisualInterface } from '../../../visuals/celestialVisuals';
import CelestialFeatures from './CelestialFeatures';

type Props = {
  planetId: string;
  visuals: CelestialVisualInterface;
  radius: number;
  axialTilt: number;
  cloudRef: React.RefObject<THREE.Group | null>;
  onPointerDown: () => void;
  onPointerUp: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
};

const CelestialPlanetMesh = forwardRef<THREE.Mesh, Props>(
  (props, ref) => {
    const textures = usePlanetTextures(props.planetId, props.visuals);
    const materialRef = useRef<THREE.Material>(null);

    // Actualizar las texturas del material existente en lugar de recrearlo
    useEffect(() => {
      if (materialRef.current && textures) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mat = materialRef.current as any;

        if (textures.map) mat.map = textures.map;
        if (textures.normalMap) mat.normalMap = textures.normalMap;
        if (textures.specularMap) mat.specularMap = textures.specularMap;
        if (textures.displacementMap) {
          mat.displacementMap = textures.displacementMap;
          mat.displacementScale = props.visuals.displacementScale ?? 0;
        }

        mat.needsUpdate = true;
      }
    }, [textures, props.visuals.displacementScale]);

    return (
      <>
        <CelestialFeatures
          features={props.visuals.features}
          radius={props.radius}
          axialTilt={props.axialTilt}
          cloudRef={props.cloudRef}
          textures={textures}
          displacementScale={props.visuals.displacementScale ?? 0}
        />
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
          {props.visuals.material === 'basic' ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <meshBasicMaterial ref={materialRef as any} />
          ) : (
            <meshPhongMaterial
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ref={materialRef as any}
              shininess={props.visuals.shininess ?? 30}
              emissive={props.visuals.emissive ? new THREE.Color('#ffffff') : new THREE.Color('#000000')}
            />
          )}
        </mesh>
      </>
    );
  }
);

CelestialPlanetMesh.displayName = 'CelestialPlanetMesh';

export default CelestialPlanetMesh;